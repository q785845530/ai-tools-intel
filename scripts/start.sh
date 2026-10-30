#!/usr/bin/env bash
# 启动 ops 常驻进程（脱离当前终端/工具调用的进程组，否则会话结束会被一起杀掉）
#
# 用法：
#   bash scripts/start.sh          # 启动（已在跑则不动）
#   bash scripts/start.sh --force  # 先停再启动
#   bash scripts/status.sh         # 看状态
#
# 为什么要 setsid：
#   `nohup node run.js &` 仍属于发起它的那个进程组。在非交互环境（CI、agent 工具调用）里，
#   父 shell 退出时会向整个进程组发信号，nohup 挡不住 SIGKILL 以外的组信号，
#   于是进程"启动成功、几秒后消失"。setsid 让它自成一个会话，PPID 变成 1 才真正常驻。
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG="$ROOT/log/server-stdout.log"
PATTERN='node run\.js --cron'

cd "$ROOT"

running() {
  pgrep -f "$PATTERN" > /dev/null 2>&1
}

if [ "${1:-}" = "--force" ]; then
  echo "  停止已有进程…"
  pkill -f "$PATTERN" 2>/dev/null || true
  sleep 2
fi

if running; then
  echo "  ✅ 已在运行，跳过启动："
  ps -eo pid,ppid,etime,args | grep "$PATTERN" | grep -v grep | sed 's/^/    /'
  exit 0
fi

mkdir -p "$ROOT/log"
# 看护进程与主进程一起拉起：容器回收后台进程时两者可能同时被杀，
# 但主进程若单独退出（未捕获异常 / OOM），watchdog 会在 5 分钟内拉回来。
# 注意 watchdog 自己也要 setsid 脱组，否则同样会随父 shell 消失。
if ! pgrep -f 'bash scripts/watchdog.sh' > /dev/null 2>&1; then
  setsid nohup bash scripts/watchdog.sh >> "$ROOT/log/watchdog.log" 2>&1 < /dev/null &
  disown 2>/dev/null || true
fi
setsid nohup node run.js --cron >> "$LOG" 2>&1 < /dev/null &
disown 2>/dev/null || true
sleep 4

if running; then
  echo "  ✅ 启动成功："
  ps -eo pid,ppid,etime,args | grep "$PATTERN" | grep -v grep | sed 's/^/    /'
  curl -s -o /dev/null -w "    本地探活 HTTP %{http_code}\n" --max-time 5 http://127.0.0.1:8765/ 2>/dev/null || true
else
  echo "  ❌ 启动失败，日志尾部："
  tail -20 "$LOG" | sed 's/^/    /'
  exit 1
fi
