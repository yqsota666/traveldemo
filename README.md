# traveldemo

## 一键启动

在项目根目录执行：

```bash
./start-all.sh
```

脚本会自动完成以下步骤：

- 检查 `java`、`mvn`、`mysql`、`rg` 命令是否可用
- 检查并尝试启动 `mysqld`
- 校验数据库连接
- 自动创建 `travel_demo` 数据库（不存在时）
- 检查 `travel-miniapp` 并提示使用微信开发者工具打开
- 启动后端服务（`mvn spring-boot:run`）

## 前端（微信小程序）

唯一前端目录为 **`travel-miniapp`**（Taro）。

```bash
cd travel-miniapp
npm i
npm run dev:weapp
```

用微信开发者工具打开 **`travel-miniapp`** 根目录，或打开仓库根目录（`project.config.json` 已指向 `travel-miniapp/dist/weapp/`）。