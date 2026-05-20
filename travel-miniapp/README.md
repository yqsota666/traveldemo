# travel-miniapp

从 [yqsota666/Figma](https://github.com/yqsota666/Figma.git) **最新版** React 设计稿，通过 **Taro 4 + UnoCSS + plugin-html** 无损编译为微信小程序。

## 源码来源

| 目录 | 说明 |
|------|------|
| `../figma-taro-source/` | GitHub 拉取的 Figma 原仓库（参考） |
| `src/app/` | 与 Figma `src/app` 一致的页面与组件（App、城市、文创、我的、咨询等） |
| `src/shims/lucide-react.tsx` | 图标兼容层（Tabler 图标，保持原 className） |

## 已包含的页面/流程

- 首页（轮播、行程提醒、热门城市、精选客栈、热门景点、在线咨询）
- 文创商城（Products + ProductDetail）
- 关于我们
- 我的（Profile、TravelMap、FamilyProfile、退出 → WishlistForm）
- 城市详情（CityDetail + ItemDetail）
- 行程提醒（TripReminder）
- 客栈列表（HotelList）
- 咨询弹层（Consultation）

## 开发

```bash
cd travel-miniapp
npm install --legacy-peer-deps
npm run dev:weapp
```

微信开发者工具打开 **`travel-miniapp`** 根目录（`miniprogramRoot` 指向 `dist/weapp/`）。

详情里勾选 **不校验合法域名**（Unsplash 等远程图片）。

## 构建

```bash
npm run build:weapp
```

## 说明

- 布局与样式尽量保留原 Tailwind 类名，由 UnoCSS 编译。
- `div` / `img` / `button` 等由 `@tarojs/plugin-html` 转为小程序组件。
- 部分 H5 专属效果（如 `backdrop-blur`、`mix-blend`）在真机上可能略有差异，属小程序 CSS 能力限制。
