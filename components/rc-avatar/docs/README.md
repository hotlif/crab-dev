+++
title = "Avatar"
index = true
+++


# Avatar

头像组件，用于展示用户图像、名称缩写或图标占位。


## 何时使用

- 在评论、消息列表、成员列表中展示用户身份。
- 图片加载失败时，用名称缩写或图标提供稳定回退。
- 与 Badge 组合展示在线状态或未读提醒。


## 功能特性

- 支持 `small` / `middle` / `large` 尺寸阶梯。
- 支持 `circle` / `square` 两种形态。
- 支持图片、文本、图标三种内容来源，自动回退。
- 支持语义颜色变体（`default` / `primary` / `success` / `warning` / `error`）。
- 支持 `prefers-reduced-motion`，减少不必要动画。

## 代码演示

<Demos path="/docs/demos" />

## API

<API path="./src/avatar.tsx" />