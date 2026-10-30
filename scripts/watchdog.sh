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

# 重启风暴熔断：主进程若连续快速退出（说明是配置/依赖问题，不是偶发被杀），
# 无脑每 5 分钟拉一次只会把审计链刷满失败记录。连续 N 次拉起后 3 分钟内又死，就退避到 1 小时。
CONSEC_FAIL=0
CONSEC_MAX="${WATCHDOG_MAX_RESTART:-5}"

while true; do
  if ! pgrep -f "$PATTERN" > /dev/null 2>&1; then
    log "主进程不在，拉起"
    cd "$ROOT"
    setsid nohup node run.js --cron >> "$ROOT/log/server-stdout.log" 2>&1 < /dev/null &
    sleep 5
    if pgrep -f "$PATTERN" > /dev/null 2>&1; then
      log "拉起成功 $(pgrep -f "$PATTERN" | tr '\n' ' ')"
      sleep 60
      if ! pgrep -f "$PATTERN" > /dev/null 2>&1; then
        CONSEC_FAIL=$((CONSEC_FAIL + 1))
        log "⚠️ 拉起后 60s 内又退出（连续第 ${CONSEC_FAIL}/${CONSEC_MAX} 次）"
        if [ "$CONSEC_FAIL" -ge "$CONSEC_MAX" ]; then
          log "❌ 连续 ${CONSEC_FAIL} 次重启失败，退避 1 小时后重试（请检查 log/server-stdout.log）"
          sleep 3600
          CONSEC_FAIL=0
        fi
      else
        CONSEC_FAIL=0
      fi
    else
      log "拉起失败，日志尾部：$(tail -5 "$ROOT/log/server-stdout.log" 2>/dev/null | tr '\n' ' ')"
    fi
  fi
  sleep "$INTERVAL"
done
