#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/travel-backend"
FRONTEND_DIR="$ROOT_DIR/miniapp-frontend"
BACKEND_PORT="8080"
DB_HOST="127.0.0.1"
DB_PORT="3306"
DB_NAME="travel_demo"
DB_USER="root"
DB_PASS="root"

info() {
  echo "[INFO] $*"
}

warn() {
  echo "[WARN] $*"
}

error() {
  echo "[ERROR] $*" >&2
}

require_cmd() {
  local cmd="$1"
  local tip="$2"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    error "缺少命令: $cmd"
    error "请先执行: $tip"
    exit 1
  fi
}

check_backend_prerequisites() {
  info "检查后端依赖环境..."
  require_cmd java "dnf install -y java-1.8.0-openjdk-devel"
  require_cmd mvn "dnf install -y maven"
  require_cmd mysql "dnf install -y mysql-server"
}

check_mysql_service() {
  info "检查 MySQL 服务状态..."
  if ! systemctl is-active --quiet mysqld; then
    warn "MySQL 未运行，尝试自动启动..."
    sudo systemctl start mysqld || {
      error "MySQL 启动失败，请手动执行: systemctl start mysqld"
      exit 1
    }
  fi
}

check_database_connection() {
  info "检查数据库连通性..."
  if ! mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" -e "SELECT 1;" >/dev/null 2>&1; then
    error "无法连接数据库: ${DB_HOST}:${DB_PORT}"
    error "请确认账号密码是否与 travel-backend/src/main/resources/application.yml 一致。"
    exit 1
  fi
}

check_database_exists() {
  info "检查数据库 ${DB_NAME} 是否存在..."
  if ! mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" -Nse "SHOW DATABASES LIKE '${DB_NAME}';" | rg -q "^${DB_NAME}$"; then
    warn "数据库 ${DB_NAME} 不存在，尝试自动创建..."
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    info "数据库 ${DB_NAME} 已创建。"
  fi
}

check_frontend_status() {
  info "检查前端项目状态..."
  if [[ ! -d "$FRONTEND_DIR" ]]; then
    warn "未发现前端目录: $FRONTEND_DIR"
    return
  fi

  if [[ -f "$FRONTEND_DIR/project.config.json" && -f "$FRONTEND_DIR/app.json" ]]; then
    info "检测到微信小程序项目。"
    info "请使用微信开发者工具打开目录: $FRONTEND_DIR"
  else
    warn "前端目录存在，但未识别为标准微信小程序结构。"
  fi
}

start_backend() {
  info "启动后端服务..."
  cd "$BACKEND_DIR"
  exec mvn spring-boot:run
}

main() {
  info "开始执行一键启动..."

  if [[ ! -d "$BACKEND_DIR" ]]; then
    error "未找到后端目录: $BACKEND_DIR"
    exit 1
  fi

  require_cmd rg "dnf install -y ripgrep"
  check_backend_prerequisites
  check_mysql_service
  check_database_connection
  check_database_exists
  check_frontend_status

  info "环境检查完成，准备启动后端。"
  start_backend
}

main "$@"
