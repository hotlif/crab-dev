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


| 名称                | 值
|--------             |--------------
|antialiased          |-webkit-font-smoothing: antialiased; <br />-moz-osx-font-smoothing: grayscale;
|subpixel-antialiased | -webkit-font-smoothing: auto; <br />-moz-osx-font-smoothing: auto;


- antialiased 适用于精细、轻盈的字体显示，适合高分辨率屏幕。
- subpixel-antialiased 适用于标准字体显示，可能更适合低分辨率设备。


## fontStyle

设置字体倾斜

|名称          | 值
|--------      |-----------
|italic        |font-style: italic;
|not-italic    |font-style: normal;


- italic 让字体倾斜，适用于强调、引用或装饰性文本。
- not-italic 字体保持原始的直立样式，不倾斜。



## fontWeight

设置字体的粗细

| 名称            | 值                | 描述                       |
|------------------|-----------------------|----------------------------|
| font-thin        | font-weight: 100;     | 极细字体，适合大标题、装饰性文本 |
| font-extralight  | font-weight: 200;     | 特细字体，适合轻量级文本        |
| font-light       | font-weight: 300;     | 细字体，适合正文、辅助信息      |
| font-normal      | font-weight: 400;     | 常规字体，默认权重，适合正文    |
| font-medium      | font-weight: 500;     | 中等字体，适合强调、按钮文本    |
| font-semibold    | font-weight: 600;     | 半粗字体，适合小标题、强调文本  |
| font-bold        | font-weight: 700;     | 粗体，适合标题、重要信息        |
| font-extrabold   | font-weight: 800;     | 特粗体，适合视觉重点、海报      |
| font-black       | font-weight: 900;     | 极粗体，适合极强视觉冲击        |


## fontStretch


主要用于调整字体的宽度，使其变得更窄或更宽。它控制的是 字体变体，而不是简单的 CSS 变形


| 名称                          | 值                                      | 描述                       |
|-------------------------------|-----------------------------------------|----------------------------|
| font-stretch-ultra-condensed  | font-stretch: ultra-condensed; /* 50% */        | 极度收缩，最窄字体宽度      |
| font-stretch-extra-condensed  | font-stretch: extra-condensed; /* 62.5% */      | 特别收缩，较窄字体宽度      |
| font-stretch-condensed        | font-stretch: condensed; /* 75% */              | 收缩，窄字体宽度           |
| font-stretch-semi-condensed   | font-stretch: semi-condensed; /* 87.5% */       | 半收缩，略窄字体宽度        |
| font-stretch-normal           | font-stretch: normal; /* 100% */                | 正常宽度，默认字体宽度      |
| font-stretch-semi-expanded    | font-stretch: semi-expanded; /* 112.5% */       | 半扩展，略宽字体宽度        |
| font-stretch-expanded         | font-stretch: expanded; /* 125% */              | 扩展，宽字体宽度           |
| font-stretch-extra-expanded   | font-stretch: extra-expanded; /* 150% */        | 特别扩展，更宽字体宽度      |
| font-stretch-ultra-expanded   | font-stretch: ultra-expanded; /* 200% */        | 极度扩展，最宽字体宽度      |


## fontVariantNumeric

用于设置数字和分数的显示风格。

| 名称                  | 值                                      | 描述                                   |
|-----------------------|-----------------------------------------|----------------------------------------|
| normal-nums           | font-variant-numeric: normal;           | 默认数字样式                           |
| ordinal               | font-variant-numeric: ordinal;          | 序数词样式（如 1st, 2nd 的上标）       |
| slashed-zero          | font-variant-numeric: slashed-zero;     | 斜杠零（0 带斜杠，便于区分 O 和 0）    |
| lining-nums           | font-variant-numeric: lining-nums;      | 等高数字（数字与大写字母齐平）         |
| oldstyle-nums         | font-variant-numeric: oldstyle-nums;    | 古典数字（数字有上/下浮动）            |
| proportional-nums     | font-variant-numeric: proportional-nums;| 比例数字（数字宽度随形状变化）         |
| tabular-nums          | font-variant-numeric: tabular-nums;     | 表格数字（等宽数字，便于对齐）         |
| diagonal-fractions    | font-variant-numeric: diagonal-fractions;| 斜线分数（如 1/2 以斜线样式显示）      |
| stacked-fractions     | font-variant-numeric: stacked-fractions; | 堆叠分数（如 1/2 以上下堆叠样式显示）  |


## letterSpacing

用于调整字符间距。

| 名称             | 值                                         | 描述                   |
|------------------|--------------------------------------------|------------------------|
| tracking-tighter | letter-spacing: var(--crab-tracking-tighter); /* -0.05em */ | 极紧字符间距，适合大标题或装饰性文本 |
| tracking-tight   | letter-spacing: var(--crab-tracking-tight); /* -0.025em */ | 紧字符间距，适合标题、强调文本      |
| tracking-normal  | letter-spacing: var(--crab-tracking-normal); /* 0em */     | 默认字符间距，常规文本使用          |
| tracking-wide    | letter-spacing: var(--crab-tracking-wide); /* 0.025em */   | 略宽字符间距，提升可读性            |
| tracking-wider   | letter-spacing: var(--crab-tracking-wider); /* 0.05em */   | 宽字符间距，适合副标题、特殊场景    |
| tracking-widest  | letter-spacing: var(--crab-tracking-widest); /* 0.1em */   | 最宽字符间距，适合装饰性或分隔文本  |