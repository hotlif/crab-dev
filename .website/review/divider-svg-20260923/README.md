# Divider SVG 改造核对

核对日期：2026-09-23。采用现有 M3 Divider 基线，Material Web 令牌版本为 v0.192。

## 实现范围

- 横向、竖向及标题两侧的线条统一使用 SVG `line`，不再使用 border 或伪元素绘线。
- 使用现有 L3 线宽与颜色令牌；默认 1px，颜色映射到 L2 `color.border.subtle`（outline-variant）。
- SVG 不设置 viewBox；线段用百分比坐标适应容器，描边和虚线间距保持 CSS 像素单位。
- 保留既有 props、HTMLDivElement ref、separator 语义、装饰线隐藏与标题命名；内部 SVG 隐藏于无障碍树且不可聚焦。
- 工作台预览容器改为横向拉伸，避免只有标题宽度而无法展示线条。

## 与官方实现的差异

Material Web 使用伪元素背景绘制实线，SVG 是本次用户要求的实现方式，并非 M3 对 DOM 的要求。M3 基线为实线；dashed、dotted、行内 1em 竖线、标题及间距档位沿用本项目扩展，不将这些扩展声称为官方变体。项目默认提供 separator 语义，Material Web 默认装饰性；本次保留现有 API 的默认行为。

## 验证结果

- `corepack yarn generate:token`、`lint`、`test`、`typecheck`、`build:library` 均通过；12 项测试通过，Lint 为 0 errors / 0 warnings。
- 真实浏览器核对了默认横线、标题的 start / center / end 对齐、plain、实线 / 虚线 / 点线、竖线、浅深色主题与手机宽度。
- 读取浏览器计算样式：横线高度及描边 1px；虚线 3px / 3px；点线 0px / 2px 并使用 round 端点；竖线宽 1px，高度跟随字号为 14px / 15px。
- 独立组件预览无 console warning / error。工作台容器在内嵌预览切换时记录 MutationObserver.observe 参数报错；未定位工作台报错来源，因此不声称工作台整体无错误。
- 未完成长标题、RTL、浏览器缩放和系统强制颜色模式的专项视觉核对；强制颜色模式已按 Material Web 的 CanvasText 处理描边。

## 实际参考

- [M3 Divider Specs](https://m3.material.io/components/divider/specs)
- [M3 Divider Guidelines](https://m3.material.io/components/divider/guidelines)
- [M3 Divider Accessibility](https://m3.material.io/components/divider/accessibility)
- [Material Web Divider 文档与示例](https://material-web.dev/components/divider/)
- [Material Web 行为源码](https://github.com/material-components/material-web/blob/main/divider/internal/divider.ts)
- [Material Web 样式源码](https://github.com/material-components/material-web/blob/main/divider/internal/_divider.scss)
- [Material Web 组件令牌入口](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-divider.scss)
- [Material Web v0.192 Divider 令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-divider.scss)
