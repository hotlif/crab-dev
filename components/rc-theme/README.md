# Theme 主题

通过语义令牌提供浅色、深色和强制颜色模式的主题样式。

本包仅提供 CSS，覆盖 L2 语义变量，保留 L1 全局基础值。

```ts
import "@crab-dev/rc-theme/css/index.css";
```

默认使用 Light 主题；在根节点或任意主题边界设置 `data-theme="dark"` 可启用 Dark 主题。系统进入
forced-colors 模式时，主题会改用系统颜色关键字。

本包不监听 `prefers-color-scheme`，也不持久化主题。应用需要在首屏渲染前尽早设置根节点的
`data-theme`，并自行处理系统偏好、用户选择与持久化，避免页面先以 Light 渲染再切换造成闪烁。

## 文档

- [使用说明与 API](./docs/index.mdx)
- [示例源码](./docs/demos/)

在当前包目录运行 `yarn start` 可打开组件工作台，查看交互示例。
