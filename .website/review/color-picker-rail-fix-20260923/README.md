# 颜色选择器完整渐变轨道修复

核对日期：2026-09-23。

## 原因与修复

颜色选择器将渐变应用于 Slider 的 inactive rail，并将 active track 设为透明。Slider 迁移至 Expressive 分段轨道后，inactive rail 仅占滑块右侧，导致滑块左侧的渐变消失；alpha 为 1 时 rail 宽度为 0。

在 ColorPickerPanel 的共享滑块样式中，将渐变 rail 的起点固定在容器左端，并使用 Slider 的公开圆角令牌恢复完整轨道两端圆角。渐变以完整值域定位，不随手柄位置压缩。普通 Slider 的分段实现不变。

颜色选择器是基于水平连续 Slider 的项目扩展，保留现有 Expressive 手柄与交互，以及现有 12px 色带高度；完整色谱代替普通 Slider 的双色数值分段。M3 和 Material Web 没有直接定义此 OKLCH 面板，不将该扩展标记为官方颜色选择器。

## 实际参考

- [M3 Slider Guidelines](https://m3.material.io/components/sliders/guidelines)：轨道表达完整值域、变化即时反馈。
- [M3 Slider Specs](https://m3.material.io/components/sliders/specs)：Expressive standard 水平滑块与 XS 手柄规格。
- [M3 Slider Accessibility](https://m3.material.io/components/sliders/accessibility)：名称、焦点、方向键与 Home / End。
- [Material Web Slider 文档与示例](https://material-web.dev/components/slider/)：连续滑块及轨道定制。
- [行为源码](https://github.com/material-components/material-web/blob/main/slider/internal/slider.ts)、[样式源码](https://github.com/material-components/material-web/blob/main/slider/internal/_slider.scss)、[令牌源码](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-slider.scss)。读取 main；令牌引用 v0_192，属于旧版 M3 对照，不作为 Expressive 手柄规格依据。

## 验证

- `generate:token`、`build:library`、`lint`、`typecheck` 均通过，Lint 为 0 errors、0 warnings。
- 包内 `corepack yarn test`：4 个测试文件、50 项测试通过。
- 真实浏览器复现：轨道容器宽 201px，修复前亮度 rail 约 62px、色度约 113px、色相约 53px，alpha 为 1 时 rail 为 0px。
- 修复后四条 rail 均为完整 201px；逐一通过 Home / End 到达最小值和最大值，八种端点状态均保持完整渐变。
- 浅色、深色截图核对通过；真实拖动色相至 288° 后，色值同步为 `#8C7CEA`，轨道保持完整宽度；取消后重新打开保留原值 `#3093EC`。
- 已重启本仓库 5173 文档开发服务，确认页面加载修复后的样式。
