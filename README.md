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
- 检查前端目录（微信小程序）并提示使用微信开发者工具打开
- 启动后端服务（`mvn spring-boot:run`）