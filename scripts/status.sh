#!/usr/bin/env bash
# 查看 ops 常驻进程与站点状态
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PATTERN='node run\.js --cron'

echo "════ ops 状态 ════"

if pgrep -f "$PATTERN" > /dev/null 2>&1; then
  echo "  进程：✅ 存活"
  ps -eo pid,ppid,etime,args | grep "$PATTERN" | grep -v grep | sed 's/^/    /'
else
  echo "  进程：❌ 未运行（用 bash scripts/start.sh 启动）"
fi

echo -n "  本地站点："
curl -s -o /dev/null -w "HTTP %{http_code}\n" --max-time 5 http://127.0.0.1:8765/ 2>/dev/null || echo "无响应"

echo -n "  公网站点："
curl -s -o /dev/null -w "HTTP %{http_code}\n" --max-time 15 https://q785845530.github.io/ai-tools-intel/ 2>/dev/null || echo "无响应"

echo "  日志尾部："
tail -5 "$ROOT/log/server-stdout.log" 2>/dev/null | sed 's/^/    /' || echo "    （无日志）"
