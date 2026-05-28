#!/usr/bin/env bash
# 全链路启动：MySQL + 管理后台(8091) + C端后端(8080) + 管理前端(5174)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export JAVA_HOME="${JAVA_HOME:-/usr/lib/jvm/java-11-alibaba-dragonwell-11.0.30.27.27-1.alnx4.x86_64}"

echo ">>> MySQL"
mysql -uroot -proot -e "SELECT 1" >/dev/null

echo ">>> 同步管理后台测试密码"
mysql -uroot -proot travel_demo < "$ROOT/travel-admin-backend/scripts/reset-test-passwords.sql" 2>/dev/null || true

echo ">>> 启动 travel-admin-backend :8091"
fuser -k 8091/tcp 2>/dev/null || true
sleep 1
cd "$ROOT/travel-admin-backend"
mvn -q compile -DskipTests
nohup mvn -q spring-boot:run > /tmp/travel-admin-backend.log 2>&1 &

echo ">>> 启动 travel-backend :8080"
fuser -k 8080/tcp 2>/dev/null || true
sleep 1
cd "$ROOT/travel-backend"
mvn -q compile -DskipTests
nohup mvn -q spring-boot:run > /tmp/travel-backend.log 2>&1 &

for i in $(seq 1 45); do
  if ss -tln | grep -q ':8091 ' && ss -tln | grep -q ':8080 '; then
    echo ">>> 后端已就绪"
    break
  fi
  sleep 2
  if [[ $i -eq 45 ]]; then
    echo "启动超时"; tail -20 /tmp/travel-admin-backend.log /tmp/travel-backend.log
    exit 1
  fi
done

if ! ss -tln | grep -q ':5174 '; then
  echo ">>> 启动 travel-admin-web :5174"
  cd "$ROOT/travel-admin-web"
  nohup npm run dev > /tmp/travel-admin-web.log 2>&1 &
  sleep 5
fi

echo ""
echo "=========================================="
echo "  MySQL        :3306"
echo "  Admin API    http://127.0.0.1:8091"
echo "  Travel API   http://127.0.0.1:8080"
echo "  Admin Web    http://127.0.0.1:5174/login"
echo "  账号 superadmin / 123456"
echo "=========================================="
echo ">>> 运行测试: bash $ROOT/scripts/test-content-chain.sh"
