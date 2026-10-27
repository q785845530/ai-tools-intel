#!/usr/bin/env bash
# 看护进程：每 5 分钟检查一次 ops 主进程，挂了就拉起来。
#
# 用法：
#   setsid nohup bash scripts/watchdog.sh >> log/watchdog.log 2>&1 < /dev/null &
#
# ⚠️ 老实说：这个容器的后台进程会被周期性回收（实测主进程分别在 07:00、18:00 被静默干掉，
#    dmesg 无 OOM、日志无异常，属于被外部 SIGKILL）。看护进程本身也可能一起被杀。
#   所以它只是提高存活率，不是保证。真正的 7×24 靠云端 GitHub Actions。
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PATTERN='node run\.js --cron'
INTERVAL="${WATCHDOG_INTERVAL:-300}"

log() { echo "[$(date -u '+%Y-%m-%d %H:%M:%S')] $*"; }

log "watchdog 启动（间隔 ${INTERVAL}s）"

while true; do
  if ! pgrep -f "$PATTERN" > /dev/null 2>&1; then
    log "主进程不在，拉起"
    cd "$ROOT"
    setsid nohup node run.js --cron >> "$ROOT/log/server-stdout.log" 2>&1 < /dev/null &
    sleep 5
    if pgrep -f "$PATTERN" > /dev/null 2>&1; then
      log "拉起成功 $(pgrep -f "$PATTERN" | tr '\n' ' ')"
    else
      log "拉起失败，日志尾部：$(tail -5 "$ROOT/log/server-stdout.log" 2>/dev/null | tr '\n' ' ')"
    fi
  fi
  sleep "$INTERVAL"
done
