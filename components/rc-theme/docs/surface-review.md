# 容器、浮层和反馈的三套设计

核对日期：2026-10-22。Material 以 M3 的 card、basic dialog、plain tooltip、modal sheet、snackbar、filter chip 为对应变体，Material Web 以仓库当前 `main` 的 v0.192 令牌为实现对照。shadcn 以 `new-york-v4` 实现为对照。macOS 为 Apple HIG 启发的 Web 主题：保留清晰的内容层级、紧凑排版、中性面板和活动指示器，不宣称复刻系统框架、原生通知中心或 Liquid Glass。

## 组件范围

| 组件 | 本次处理 | 保留的行为与范围 |
| --- | --- | --- |
| Card | 独立内容内边距；Material 默认 16px、macOS 16px、shadcn 24px；沿用各设计的边框和阴影 | elevated / outlined / filled、点击、禁用、加载与键盘操作 |
| Dialog | 独立表面色和细边界；沿用三套标题、圆角和阴影；默认操作区 Material 为文字操作，macOS/shadcn 为填充确认与中性描边取消 | 原生 dialog、焦点、Escape、异步确认、取消；自定义 footer 不继承默认操作样式 |
| Drawer | 消费此前未生效的圆角令牌，只处理未贴边的角；shadcn 为直角 | 四个方位、RTL、遮罩、焦点；侧向和顶向位置是 sheet 扩展 |
| DropdownContainer | 三套菜单面板圆角与边界 | 定位、碰撞检测、portal；菜单项语义由消费方负责 |
| Tooltip | Material 无箭头逆色 plain tooltip；shadcn 紧凑逆色；macOS 中性面板与细边界 | hover、focus、Escape、aria-describedby；可选箭头是扩展 |
| Alert | 三套圆角、标题与内边距；Material 状态底色、macOS 淡状态底色、shadcn 中性表面 | 内联语义反馈、操作、关闭；不是系统 modal alert |
| Message | Material 逆色 snackbar、macOS 与 shadcn 明暗配对的 toast 表面 | 排队、更新、暂停、读屏；堆叠与倒计时为扩展 |
| Notification | macOS 16px、Material 12px、shadcn 8px 面板圆角 | 队列、关闭、焦点暂停；属于持续通知模式扩展 |
| Avatar | 方形头像采用各设计圆角 | 圆形头像、图片失败回退、分组、可点击按钮语义 |
| Badge | 默认计数容器的主题高度，保持前景/背景配对 | 圆点、small、溢出计数；定位角标区别于 shadcn 行内 Badge |
| Tag | 三套静态标签轮廓；Material 可选标签 32px / 14px 字体 | 选中勾选、禁用、键盘、移除；普通静态标签不是交互 chip |
| Spin | Material 带底轨品牌圆弧、shadcn 无底轨中性圆弧、macOS 十二辐条 | 延迟、aria-live、inert、减少动态效果；Expressive 保持显式变体 |
| Empty | 审查后保留当前语义字阶与配色 | 内容、描述、行动的层级；无对应独立 M3 组件，作为内容模式扩展 |
| Skeleton | 审查后保留语义填充、控件圆角和减少动态效果适配 | 内容占位不代替加载通告；无对应独立 M3 组件 |
| Divider | 审查后保留主题弱边界色、1px 分隔线与字阶 | 带文字、竖向和间距档位是项目扩展 |

所有差异通过 L2 语义角色传播到 L3；组件渲染不按设计名称分支。每个显式设计边界重置完整角色集，因此嵌套 provider 能恢复内层设计。强制颜色模式使用 Canvas / CanvasText / Highlight 并去除浮层阴影。

## 实际参考资料

- M3 卡片：[规格](https://m3.material.io/components/cards/specs)、[指南](https://m3.material.io/components/cards/guidelines)、[无障碍](https://m3.material.io/components/cards/accessibility)。默认内容内边距和轮廓来自卡片规格，小号/大号密度是本项目扩展。
- M3 对话框：[规格](https://m3.material.io/components/dialogs/specs)、[指南](https://m3.material.io/components/dialogs/guidelines)、[无障碍](https://m3.material.io/components/dialogs/accessibility)。
- Material Web 对话框：[文档与演示](https://material-web.dev/components/dialog/)、[样式源码](https://github.com/material-components/material-web/blob/main/dialog/internal/_dialog.scss)、[令牌入口](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-dialog.scss)。
- M3 浮层与反馈：[bottom sheet 规格](https://m3.material.io/components/bottom-sheets/specs)、[plain tooltip 规格](https://m3.material.io/components/tooltips/specs)、[snackbar 规格](https://m3.material.io/components/snackbar/specs)。Material Web 没有这些组件的对应公开实现，以上规范是视觉对照；不能将 dropdown 容器当成完整 menu。
- Material Web 菜单：[文档与演示](https://material-web.dev/components/menu/)、[面板样式](https://github.com/material-components/material-web/blob/main/menu/internal/_menu.scss)。
- M3 标签：[chip 规格](https://m3.material.io/components/chips/specs)；Material Web：[文档与演示](https://material-web.dev/components/chip/)、[filter chip v0.192 令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-filter-chip.scss)。
- Apple HIG：[Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts)、[Popovers](https://developer.apple.com/design/human-interface-guidelines/popovers)、[Materials](https://developer.apple.com/design/human-interface-guidelines/materials)、[Progress indicators](https://developer.apple.com/design/human-interface-guidelines/progress-indicators)。macOS 圆角数值、十二辐条绘制和淡反馈表面是本项目 Web 适配选择，并非 HIG 声称的跨版本固定像素规范。
- shadcn：[Card 文档](https://ui.shadcn.com/docs/components/card)及 [Card 源码](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/card.tsx)、[Dialog 源码](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/dialog.tsx)、[Sheet 源码](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/sheet.tsx)、[Tooltip 源码](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/tooltip.tsx)、[Alert 源码](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/alert.tsx)。保留本库的尺寸档位、反馈类型和复杂队列能力。

本记录区分实现依据和项目扩展，不将 DOM 测试通过表述为整套产品视觉合规。文档站演示用于核对默认、暗色、焦点、选中、禁用及浮层实际表现。
