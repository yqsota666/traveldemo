#!/usr/bin/env bash
# 启动管理后台前后端（在服务器上执行）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
export JAVA_HOME="${JAVA_HOME:-/usr/lib/jvm/java-11-alibaba-dragonwell-11.0.30.27.27-1.alnx4.x86_64}"

echo ">>> 检查 MySQL..."
mysql -uroot -proot -e "SELECT 1" >/dev/null 2>&1 || { echo "MySQL 未就绪"; exit 1; }

echo ">>> 同步测试密码（123456）..."
mysql -uroot -proot travel_demo < "$ROOT/travel-admin-backend/scripts/reset-test-passwords.sql"

echo ">>> 停止旧进程..."
fuser -k 5174/tcp 2>/dev/null || true
fuser -k 8091/tcp 2>/dev/null || true
sleep 1

echo ">>> 启动后端 8091..."
cd "$ROOT/travel-admin-backend"
nohup mvn -q spring-boot:run > /tmp/travel-admin-backend.log 2>&1 &
echo $! > /tmp/travel-admin-backend.pid

for i in $(seq 1 60); do
  if curl -sf -o /dev/null http://127.0.0.1:8091/api/admin/v1/auth/login -X POST \
    -H 'Content-Type: application/json' -d '{"username":"director01","password":"123456"}' 2>/dev/null; then
    break
  fi
  sleep 2
  if [[ $i -eq 60 ]]; then
    echo "后端启动超时，日志："
    tail -30 /tmp/travel-admin-backend.log
    exit 1
  fi
done
echo "后端已就绪"

echo ">>> 启动前端 5174..."
cd "$ROOT/travel-admin-web"
nohup npm run dev > /tmp/travel-admin-web.log 2>&1 &
echo $! > /tmp/travel-admin-web.pid

for i in $(seq 1 30); do
  if curl -sf -o /dev/null http://127.0.0.1:5174/login 2>/dev/null; then
    break
  fi
  sleep 1
done
echo "前端已就绪"

echo ""
echo "=========================================="
echo "  本机浏览器：Cursor 转发端口 5174"
echo "  打开：http://localhost:5174/login"
echo "  账号 director01  密码 123456"
echo "=========================================="
