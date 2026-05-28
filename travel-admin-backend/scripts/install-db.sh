#!/usr/bin/env bash
# 在新服务器初始化 travel_demo 管理后台数据库
set -euo pipefail

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_USER="${DB_USER:-root}"
DB_PASS="${DB_PASS:-root}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_DIR="$SCRIPT_DIR/sql"

mysql_cmd() {
  mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" "$@"
}

echo "[1/3] 创建数据库..."
mysql_cmd < "$SQL_DIR/00_create_database.sql"

echo "[2/3] 建表..."
mysql_cmd travel_demo < "$SQL_DIR/init_admin_schema.sql"

echo "[3/5] 导入初始数据..."
mysql_cmd travel_demo < "$SQL_DIR/init_admin_seed.sql"

echo "[4/5] CMS 建表..."
mysql_cmd travel_demo < "$SQL_DIR/init_cms_schema.sql"

echo "[5/6] CMS 权限与演示数据..."
mysql_cmd travel_demo < "$SQL_DIR/init_cms_seed.sql"

echo "[6/6] CMS 完整内容演示（含图片）..."
bash "$SCRIPT_DIR/download-cms-demo-images.sh" 2>/dev/null || warn "图片下载跳过（无网络时可稍后手动执行 download-cms-demo-images.sh）"
mysql_cmd travel_demo < "$SQL_DIR/init_cms_demo_content.sql"

echo "[OK] 数据库初始化完成。演示账号：superadmin / director01 / sales01 / sales02，密码 123456（见 reset-test-passwords.sql）"
