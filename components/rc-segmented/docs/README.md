+++
title = "Segmented"
index = true
+++


# Segmented

分段控制器, 用于在一组互斥选项中展示并选择单个选项。


## 何时使用

- 用于在一组互斥选项间快速切换, 且希望所有选项一屏可见、方便横向比较
- 与 Radio 的区别是外观更紧凑、连体, 常用于视图 / 时间粒度 / 筛选维度的切换
- 与 Tabs 的区别是它只负责"选值", 不承载被切换的内容面板
- 选项数量不宜过多（建议 2–5 个）, 过多时应改用 Select


## 代码演示

<Demos path="/docs/demos" />

## API

<API path="./src/segmented.tsx" />
