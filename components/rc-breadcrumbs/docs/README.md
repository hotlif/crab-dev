+++
title = "Breadcrumbs"
index = true
+++


# Breadcrumbs

面包屑导航，用于展示用户当前位置以及返回上级路径。


## 何时使用

- 页面存在明确层级关系，需要展示当前位置。
- 需要在深层页面中提供快速返回上层路径的入口。

## 功能特性

- 支持通过 `items` 配置导航层级。
- 支持 `separator` 自定义分隔符。
- 支持 `maxCount` 折叠中间层级，避免路径过长。
- 支持每一项配置 `href`、`onClick`、`disabled`。

## 代码演示

<Demos path="/docs/demos" />

## API

<API path="./src/breadcrumbs.tsx" />
