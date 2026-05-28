# C 端内容读取链路

## 架构

- `travel-admin-backend`：`/api/internal/cms/**` 内部只读接口（Header: `X-Internal-Token`）
- `travel-backend`：`/api/travel/content/**` 对外读取接口（HTTP 转发 admin 内部接口）
- `travel-miniapp`：调用 `travel-backend`，不改 UI 布局

## 配置

| 服务 | 配置项 |
|------|--------|
| admin | `admin.internal.token=travel-internal-cms-token` |
| travel-backend | `travel.content.admin-base-url=http://127.0.0.1:8091` |
| travel-backend | `travel.content.internal-token=travel-internal-cms-token` |

## 启动顺序

1. MySQL + CMS 数据
2. `travel-admin-backend`（8091）
3. `travel-backend`（8080）
4. `travel-miniapp` 开发预览

## 验证示例

```bash
curl -H "X-Internal-Token: travel-internal-cms-token" http://127.0.0.1:8091/api/internal/cms/cities
curl http://127.0.0.1:8080/api/travel/content/cities
```
