# Button：M3 Expressive 复查

2026-09-21，在工作区已有修改上检查并修复 `rc-button`。本轮以当前 M3 Expressive 的默认按钮与切换按钮为准；五种外观、默认 S（40px）、16px 水平内边距、中性色描边与按压形变原本就是当前规范允许的配置。

## 修复结果

| 问题 | 修复 |
| --- | --- |
| 仍使用 baseline 的 12% 焦点和按压状态层 | 当前按钮状态层统一为 hover 8%、focus/pressed 10% |
| 整个禁用按钮乘以 38%，部分外观文字仍使用品牌色或浏览器默认色 | On surface 内容独立为 38%，填充容器独立为 10%；描边、文字保留各自的容器规则 |
| Tonal 禁用时错误复用透明描边背景 | 改为禁用填充容器，选中禁用也使用中性填充 |
| 危险 Filled 缺少焦点反馈，危险 Tonal/Elevated 被改成透明背景 | 使用对应前景色状态层；Tonal 使用错误容器色对，Elevated 保留原有表面与阴影 |
| XS 图标间距 8px，L/XL 描边始终 1px | XS 为 4px；L/XL 为 2px/3px |
| 缺少组件自身的 border-box，外部重置样式可能影响尺寸 | 组件显式声明 box-sizing；移除 Tonal/未选中 Filled 多余透明边框 |
| 焦点环宽度 2px、颜色为 Primary | 对齐 Material Web focus ring：Secondary、3px、向外偏移 2px |
| 粗指针直接增加按钮可见高度 | 独立命中区域至少 48×48px，保持 XS/S 可见高度 |
| 未选中 Filled 在 focus/hover 中落入普通 Filled 配色 | 分离普通与未选中切换外观，使用 On surface variant 状态层 |
| 禁用链接仍在 Tab 顺序中，未阻止事件冒泡 | 禁用时 tabIndex=-1，捕获与冒泡激活统一拦截；加载链接继续可聚焦 |
| 同时 loading 和 disabled 时仍套用加载专用外观 | 禁用外观优先，保留 aria-busy |
| 装饰图标和自定义加载图形参与无障碍名称 | aria-hidden，并保持文字作为名称 |
| 工作台默认 isSelected=false 使普通 Filled 变成未选中切换按钮 | 单独增加 toggle 控件，默认展示普通按钮 |

`token.ts` 和组件 `docgen.json` 由 Wake 命令生成，未手改。保留已有接口与用户修改，未升级依赖、提交或发布。

## 验证

- 按钮包 `corepack yarn generate:token`、`lint`、`typecheck`、`test`、`build:library` 通过；Lint 0 错误、0 告警，41 项测试通过。
- 测试覆盖禁用链接事件与 Tab 属性、加载禁用优先级、装饰图标语义，以及危险 Filled/Tonal 在明暗主题中的对比度；已有 128 个颜色种子的明暗主题可读性检查通过。
- 在端口 4174 的真实 Wake 组件工作台中检查生成的 CSS：25 种尺寸/外观组合的高度为 32/40/56/96/136px；图标间距为 4/8/8/12/16px；Outlined 描边为 1/1/1/2/3px。
- 实测禁用根元素 opacity=1、内容 opacity=0.38，Filled/Tonal/Elevated 背景 alpha=0.1。危险 Tonal 的焦点状态层实测 0.1，焦点环 3px、offset 2px。
- 实测默认 Filled 无 aria-pressed，启用切换后为 false，选中后为 true；同一文案切换前后宽度保持 88px，圆角由 20px 变为 12px。检查了浅色悬停、深色聚焦、危险配色和 loading+disabled 组合。
- 通过浏览器查看 M3 Specs 的状态示意图和 Material Web 的五种按钮实际示例，核对了版本差异。
- 独立按钮预览经鼠标、Enter、Space 激活后控制台无错误或告警。工作台多次切换 iframe 时记录到 MutationObserver 参数类型错误，来源尚未定位，不能把工作台整体描述为控制台无错误；独立按钮预览未复现。

浏览器检查不包含真实触控设备、读屏、200% 字体缩放、forced-colors/reduced-motion 媒体模拟，也未量化按压动画曲线；对应样式分支保留，不将源码检查等同于这些设备验收。

文档站全量 `generate:docs` 暂时被并行新增的 `rc-pdf-editor/docs/demos/repro.demo.tsx` 阻断：生成器要求 255 个 Demo，实际 256 个。未修改或删除其他任务的示例，也未更改全站计数约束。组件文档源及按钮工作台已更新，全站生成产物尚未同步。

## 采用的规范与兼容边界

- [M3 按钮规格、颜色、状态、尺寸和形变](https://m3.material.io/components/buttons/specs)
- [M3 使用指南](https://m3.material.io/components/buttons/guidelines)
- [M3 无障碍与键盘操作](https://m3.material.io/components/buttons/accessibility)
- [Material Web 文档与实际示例](https://material-web.dev/components/button/)
- [Material Web 按钮交互实现](https://github.com/material-components/material-web/blob/main/button/internal/button.ts)
- [Material Web 共享样式与禁用处理](https://github.com/material-components/material-web/blob/main/button/internal/_shared.scss)
- [Material Web Tonal 令牌](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-filled-tonal-button.scss)
- [Material Web 焦点环令牌](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-focus-ring.scss)

Material Web 仍采用 baseline 的部分规格（24px 水平内边距、18px 图标、12% pressed 状态层）。本次保留当前 M3 Expressive 的 16px、20px、10%，不将两版数值混用。危险色依据 M3 Specs 允许替换容器/前景色角色的说明扩展，并保留文本对比度至少 4.5 的项目要求。

旧 `dashed`、`link`、Text+isSelected 和 `circle` 接口继续兼容，但不作为符合 M3 默认按钮或完整 Icon button 的承诺。后置图标参考 Material Web 的能力；M3 推荐前置单图标，因此移除了双图标演示。连接式按钮组未在本轮独立按 Button group 规范审计。形变沿用项目既有静态 CSS 动效，不声称复制了原生弹簧动画。
