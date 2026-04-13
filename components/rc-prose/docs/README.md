+++
title = "Prose"
index = true
+++


# Prose

Markdown 排版容器，为富文本内容提供完整的排版样式。


## 何时使用

- 渲染 Markdown / MDX 内容时，提供一致的排版体验。
- 文章页面、文档页面、博客内容的排版。
- 需要对标题、段落、列表、代码块、表格等元素统一样式。


## 功能特性

- 零运行时，基于 Linaria 编译为静态 CSS。
- 支持四种尺寸变体：`sm`、`base`、`lg`、`xl`。
- 支持 `invert` 暗色排版模式。
- 支持 `as` 语义标签：`div`、`article`、`section`、`main`。
- 完整的排版规则覆盖：标题、段落、链接、列表、引用、代码、表格、媒体、定义列表。
- 三层设计令牌架构，支持主题覆写。

## 代码演示

<Demos path="/docs/demos" />

## API

<API path="./src/prose.tsx" />
