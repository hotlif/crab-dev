+++
path = "/styles/fonts-and-typography"
title = "字体和排版"
nav = { id = "styles", title = "设计语言" }
+++


# 排版

排版是指在网页设计中，对文字内容进行有逻辑、有美感的编排与呈现的过程。它不仅涉及字体的选择、字号设置、行距调整，还包括文字层级、对齐方式、颜色对比及中英混排的处理等。

良好的网页排版不仅提升视觉美感，更直接影响阅读效率与用户体验。


## fontFamily

| 名称        | 值                                                                                                                                                     | 描述
|---------    |-------------------------------------------------------------------------------------------------------------------------------------------------------|-------------
| sans  | `font-family: var(--crab-font-sans, ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji');`  | 无衬线字体           
| serif| `font-family: var(--crab-font-serif, ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif);`                                                         | 有衬线字体
| mono | `font-family: var(--crab-font-mono,  ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace );`           | 等宽字体


## fontSize

用于控制元素字体大小。

| 名称      | 字体大小和行高                                                                             | 典型用处                                          |
|-----------|------------------------------------------------------------------------------------------|---------------------------------------------------|
| xs   | font-size: var(--crab-text-xs, 0.75rem); <br />line-height: var(--crab-text-xs--line-height, 1rem);     | 辅助文本、注释、小标签如 `caption`、表格辅助内容 `td` |
| sm   | font-size: var(--crab-text-sm, 0.875rem); <br />line-height: var(--crab-text-sm--line-height, 1.25rem);     | 正文小字，如 `small`、表格单元格 `td`                |
| base | font-size: var(--crab-text-base, 1rem); <br />line-height: var(--crab-text-base--line-height, 1.5rem); | 正文默认字体，段落 `p`、按钮文本、普通 `span`         |
| lg   | font-size: var(--crab-text-lg, 1.125rem); <br />line-height: var(--crab-text-lg--line-height, 1.75rem);     | 次级标题、表格表头 `th`、按钮大字                     |
| xl   | font-size: var(--crab-text-xl, 1.25rem); <br />line-height: var(--crab-text-xl--line-height, 1.75rem);     | 一级标题小字号，标题标签如 `h4`, `h3` 小号            |
| 2xl  | font-size: var(--crab-text-2xl, 1.5rem); <br />line-height: var(--crab-text-2xl--line-height, 2rem);   | 标题标签 `h2`、大号按钮或强调文本                     |
| 3xl  | font-size: var(--crab-text-3xl, 1.875rem); <br />line-height: var(--crab-text-3xl--line-height, 2.25rem);   | 标题标签 `h1`、大屏幕显示文字                         |
| 4xl  | font-size: var(--crab-text-4xl, 2.25rem); <br />line-height: var(--crab-text-4xl--line-height, 2.5rem);   | 大标题、页头横幅文字                                  |
| 5xl  | font-size: var(--crab-text-5xl, 3rem); <br />line-height: var(--crab-text-5xl--line-height, 1);   | 视觉重点文字，大型广告标题                            |
| 6xl  | font-size: var(--crab-text-6xl, 3.75rem); <br />line-height: var(--crab-text-6xl--line-height, 1);   | 视觉冲击文字，大屏幕展示                              |
| 7xl  | font-size: var(--crab-text-7xl, 4.5rem); <br />line-height: var(--crab-text-7xl--line-height, 1);   | 超大标题、海报文字                                    |
| 8xl  | font-size: var(--crab-text-8xl, 6rem); <br />line-height: var(--crab-text-8xl--line-height, 1);   | 极限大字，视觉焦点                                    |
| 9xl  | font-size: var(--crab-text-9xl, 8rem); <br />line-height: var(--crab-text-9xl--line-height, 1);   | 巨型文字，装饰用途                                    |


## fontSmoothing

用来设置抗锯齿

