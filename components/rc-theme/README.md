# Theme 主题

Crab Design System 的 CSS-only 主题包。它只覆写 Layer 2 语义变量，不改变 Layer 1 原始色板。

```ts
import "@crab-dev/rc-theme/css/index.css";
```

默认使用 Light 主题；在根节点或任意主题边界设置 `data-theme="dark"` 可启用 Dark 主题。系统进入
forced-colors 模式时，主题会改用系统颜色关键字。

本包不监听 `prefers-color-scheme`，也不持久化主题。应用需要在首屏渲染前尽早设置根节点的
`data-theme`，并自行处理系统偏好、用户选择与持久化，避免页面先以 Light 渲染再切换造成闪烁。
