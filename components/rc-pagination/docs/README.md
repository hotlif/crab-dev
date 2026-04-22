+++
title = "Pagination"
index = true
+++

# Pagination

Pagination 提供标准的页码导航能力，支持受控 / 非受控、快速跳转、自定义总量显示、紧凑尺寸等配置项。

## 何时使用

- 列表 / 表格 / 卡片墙需要按页加载大量数据
- 后端分页或前端切片分页，向用户暴露页码导航
- 需要在不同密度场景（表格内联 / 独立页面 / 抽屉底部）切换尺寸

## 设计要点

- **精准**：尺寸阶梯来自 `rc-token-semantic`，`small` (24px) / `medium` (32px) 等差密度。
- **理性**：当 `total <= pageSize * 7` 时展示完整页码，否则首尾固定 + 中部区间 + 双端省略号 + 5 页跳转。
- **稳态**：所有交互元素均覆盖 hover / focus-visible / active / disabled，遵守 `prefers-reduced-motion`。

## 代码演示

<Demos path="/docs/demos" />

## API

<API path="./src/pagination.tsx" />
