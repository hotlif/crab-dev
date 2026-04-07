+++
title = "Tag"
index = true
+++


# Tag

标签用于进行标记和分类。


## 何时使用

- 用于标记事物的属性和维度。
- 进行分类和筛选。
- 展示状态信息（成功、警告、错误等）。


我们提供了五种预设颜色。

- ⚪️ 默认标签：中性标记，适用于一般分类。
- 🔵 品牌标签：强调突出的重要标记。
- 🟢 成功标签：表示成功、完成状态。
- 🟡 警告标签：表示警告、待处理状态。
- 🔴 错误标签：表示错误、失败状态。

## 功能特性

- 支持预设颜色与自定义颜色字符串（如 `#1677ff`）。
- 支持 `icon` 前缀图标。
- 支持 `closable` 与 `onClose` 关闭交互。
- 支持 `closeIcon` 自定义关闭图标。
- 支持 `CheckableTag` 可勾选标签（`checked` / `onChange`）。

## 代码演示

<Demos path="/docs/demos" />

## API

<API path="./src/tag.tsx" />

<API path="./src/checkable-tag.tsx" />