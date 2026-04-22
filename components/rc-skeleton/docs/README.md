+++
title = "Skeleton"
index = true
+++


# Skeleton

骨架屏，用于在内容加载时占位，降低用户感知等待时间。


## 何时使用

- 网络请求或计算耗时导致内容尚未就绪时，需要保留版面节奏。
- 作为 `loading` 状态的视觉预填，避免界面抖动或"空白焦虑"。
- 列表、卡片、头像与按钮等典型场景的通用占位符。


## 功能特性

- 支持 `text` / `rect` / `circle` / `button` / `avatar` / `image` 六种常用形状。
- `rows` 控制多行文本占位，末行自动收窄以模拟段落尾部。
- `animation` 在 `pulse`（透明度脉动）与 `wave`（渐变扫过）之间切换；`active=false` 时保留静态底色。
- `width` / `height` 同时支持数字（自动补 `px`）与字符串（如 `"50%"`）。
- `loading=false` 时直接渲染 `children`，便于嵌入到数据驱动的分支里。
- 尊重 `prefers-reduced-motion`，自动禁用非必要动画。


## 代码演示

<Demos path="/docs/demos" />

## API

<API path="./src/skeleton.tsx" />
