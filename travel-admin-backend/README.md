# 旅游管理后台（travel-admin-backend）

Spring Boot 后端，端口默认 **8091**，数据库 **travel_demo**。

本次 UI 精简只改了前端；后端在本目录已完整实现（登录、RBAC、订单、删除审批、客户归属、日志、工作台统计）。

## 数据库初始化（新服务器）

```bash
cd travel-admin-backend/scripts
chmod +x install-db.sh
./install-db.sh
```

或手动按顺序执行 SQL：

1. `scripts/sql/00_create_database.sql` — 创建库
2. `scripts/sql/init_admin_schema.sql` — 全部表结构
3. `scripts/sql/init_admin_seed.sql` — 角色权限与演示数据

演示账号（密码均为 `admin123`）：

| 账号 | 角色 |
|------|------|
| superadmin | 超级管理员 |
| director01 | 高层管理 |
| sales01 | 销售 |

## 启动后端

```bash
cd travel-admin-backend
mvn spring-boot:run
```

配置见 `src/main/resources/application.yml`（MySQL 连接、JWT 等）。

## 前端

见仓库根目录 `travel-admin-web/`，开发端口 **5174**，API 代理到 `8091`。

```bash
cd travel-admin-web
npm install
npm run dev
```
