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

echo "[3/3] 导入初始数据..."
mysql_cmd travel_demo < "$SQL_DIR/init_admin_seed.sql"

echo "[OK] 数据库初始化完成。演示账号：superadmin / director01 / sales01，密码 admin123"
