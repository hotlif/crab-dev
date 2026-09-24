# M3 组件目录审查与优化 · 2026-09-22

范围：`components/` 的 54 个组件与工具包，以及它们的文档、工作台主题和示例。保留任务开始前已有的 API 与 PDF 编辑器改动。本轮不升级 Wake / Crab CSS，也不引入 Material Web 运行时依赖。

采用项目现有的 M3 基线；Button、Slider、Spin 中已有的 Expressive 能力保留。Segmented 明确采用基线单选分段按钮，不称为 Expressive connected button group。树、面包屑、颜色选择器、表格、图表、编辑器等属于组合扩展，不将其标为 M3 官方独立组件。

## 已落地的优化

| 位置与问题 | 修改及依据 | 兼容性影响 |
| --- | --- | --- |
| Switch 的状态层、按下手柄及禁用色不完整 | 52×32 轨道，16/24/28 手柄；按选中状态采用独立状态层与禁用颜色。位移与缩放分离，RTL 反向位移。标签采用 body large 行高，禁用透明度只应用一次 | 保留 size 与旧颜色覆盖入口 |
| Segmented 依赖挂载后测量绘制选中背景，非 block 时宽度不等 | CSS 等宽网格，每项持有自己的选中背景；40px 视觉、48px 目标；修正禁用色与强制颜色优先级；补 Enter 激活、ref cleanup 与纯图标选中行为 | 默认选项改为等宽；旧 thumb 令牌保留，已不需要滑动背景 DOM |
| Tooltip 默认带箭头、指针无法进入提示区域 | plain tooltip 默认无箭头；离开触发器及提示区域后延迟 1500ms 关闭；提示区域接收指针；修正子元素 ref 覆盖定位 ref | 默认 arrow 从 true 改为 false，mouseLeaveDelay 从 100 改为 1500；可显式传原值 |
| Avatar 的 onClick 只绑定 span | 操作头像复用 Button，获得原生键盘、焦点和禁用语义；避免按钮内容与头像重复降低透明度 | 视觉尺寸保留；操作容器至少 48×48 |
| AvatarGroup 的更多操作包裹成员操作 | 独立 +N 按钮，成员与更多操作互不触发，也不再嵌套按钮 | 可操作的 +N 占独立空间；纯展示计数仍叠在最后一项 |
| Breadcrumbs 的回调型路径只支持指针点击 | 有 href 的上级项为链接，仅 onClick 的上级项复用 Button；当前页和禁用项不可激活 | 回调型路径有 48px 高度 |
| AppMainLayout 的 Logo 入口使用模拟按钮 | 仅在提供 onLogoClick 时复用 Button；无动作时为静态内容 | 无动作的 Logo 不进入 Tab 顺序 |
| ColorPicker 预设色块命中区域只有 20px | 20px SVG 色样置于 48×48 Button，默认四列；触发器最小 48px；遵守调用者 preventDefault | 色板默认由八列改为四列；颜色数据仍按实际 OKLCh 显示 |
| Tree 选中项额外绘制左侧竖条 | 移除竖条，保留容器色；标题下划线提供非颜色提示，参考 M3 Lists 的选中可访问性指导；拖拽位置指示保持独立 | 树为列表扩展，保留项目的 secondary container 选中角色 |
| Wake 工作台旧变量遮盖 Switch 禁用颜色 | 在已有私有主题适配层重置该旧默认变量，继续使用公共语义主题 | 不覆盖消费方嵌套主题的显式设置 |

附带集成修正：四份 Message / Notification 教学示例的按钮回调不再返回消息句柄；PDF 演示的四个 L3 令牌改为“部件.完整 CSS 属性”路径，生成 CSS 变量名不变；令牌检查器补充合法的 `text-decoration` 属性，并将原有“预设颜色数据”精确白名单迁移到 SVG 填充位置。

最终全仓复查还发现 PDF Web Component 的既有测试存在时序竞争：`ready()` 只保证引擎就绪，却在初始文档提交前调用 `close()`。该测试现等待 `crab-document-load` 并验证文档 ID 后再关闭，没有改变组件的初始化或关闭行为。

依赖仅增加 Avatar、Breadcrumbs、AppMainLayout 对已有 `rc-button` 的工作区引用。lockfile 与 PnP 由 Yarn 安装命令刷新。令牌、docgen、文档索引均由对应命令生成。

## 全目录覆盖矩阵

每一行均核对了组件用途、入口/令牌及相关语义实现，并在文档页进行默认渲染和整页宽度检查。此表的“保留”表示本轮未发现需要立即修改的该项问题，不表示其所有属性组合、弹层和状态均已认证。非视觉包按职责审查，不强加组件外观。

| 包 | 设计映射 / 本轮重点 | 处理 |
| --- | --- | --- |
| rc-alert | 持续反馈扩展；语义色、告警角色、关闭入口 | 保留 |
| rc-app-main-layout | 基线 navigation drawer + 业务页框架 | 修复 Logo 操作 |
| rc-auto-sizer | 测量基础设施；无独立视觉规范 | 保留 |
| rc-avatar | Lists leading avatar + Button 操作扩展 | 修复键盘、禁用及组操作 |
| rc-badge | M3 large/small badge；16px 计数、6px 圆点 | 保留 |
| rc-bar-chart | 数据可视化扩展；图例、键盘覆盖层、数据配色 | 保留 |
| rc-breadcrumbs | 层级导航扩展 + text button/link | 修复动作语义 |
| rc-button | Expressive buttons / icon buttons；沿用现有 API 改动 | 保留，作为操作基础 |
| rc-canvas | 绘制基础设施；主题调色板、减弱动态 | 保留 |
| rc-card | M3 elevated / filled / outlined card | 保留 |
| rc-checkbox | M3 checkbox；18px 视觉、40px 状态层、48px 目标、mixed/error | 保留 |
| rc-color-picker | Slider + text field + icon button 组合扩展 | 修复色板目标 |
| rc-component-preview | Card + Button 的文档容器扩展 | 保留 |
| rc-config-provider | 主题、品牌和配置基础设施 | 保留 |
| rc-cron-picker | 表单与选择控件组合扩展；说明、dialog 关联 | 保留 |
| rc-date-picker | 日期/时间选择组合；字段、网格键盘、弹层 | 保留已有 API 改动 |
| rc-dialog | M3 basic dialog；原生模态、焦点与异步操作 | 保留 |
| rc-divider | M3 divider；1px、装饰与分组语义 | 保留 |
| rc-drawer | Side/bottom sheet 组合扩展；四方向与模态焦点 | 保留 |
| rc-dropdown-container | Menu 等浮层的定位基础；不强制一种焦点模型 | 保留 |
| rc-empty | 空状态内容扩展；标题、说明、动作 | 保留 |
| rc-flow-diagram | Canvas 上的流程可视化扩展 | 保留 |
| rc-form | 表单编排；label、error/supporting text 关联 | 保留已有 API 改动 |
| rc-hooks | 状态、焦点、计时器等基础能力 | 保留已有改动 |
| rc-line-edit | Filled/outlined text field；56px、错误及只读语义 | 保留已有 API 改动 |
| rc-masonry | 响应式布局扩展；列顺序与容器 | 保留 |
| rc-menu | 基线导航项与弹出菜单；56px 导航项、状态与键盘 | 保留 |
| rc-message | Snackbar 类瞬时反馈扩展；inverse 色对、状态通告 | 修复教学示例回调 |
| rc-notification | 带标题通知扩展；计时、堆叠和关闭 | 修复教学示例回调 |
| rc-number-edit | Text field + spinbutton 扩展 | 保留已有 API 改动 |
| rc-pagination | 导航按钮组合扩展；当前页、禁用及目标 | 保留已有改动 |
| rc-pdf-editor | 编辑器组合扩展；工具按钮、字段、面板 | 修复演示令牌路径 |
| rc-prose | 长文排版扩展；语义文字与阅读层级 | 保留 |
| rc-radio | M3 radio；20px 视觉、48px 目标、原生分组 | 保留 |
| rc-realm | 远程内容基础设施；loading/error 与主题边界 | 保留 |
| rc-router | 路由基础设施；链接与 aria-current | 保留 |
| rc-segmented | 基线 single-select outlined segmented buttons | 修复布局与状态 |
| rc-select | Text field + menu/listbox 扩展；选值及多选 | 保留已有 API 改动 |
| rc-skeleton | 内容占位扩展；busy/status 与减弱动态 | 保留 |
| rc-slider | 项目既有 Expressive slider；键盘、值、轨道 | 保留 |
| rc-spin | Circular progress 与既有 Expressive loading 扩展 | 保留 |
| rc-split-pane | 窗格分隔扩展；separator 值与键盘 | 保留 |
| rc-switch | M3 switch 无图标变体 | 修复状态与 RTL |
| rc-table | 结构化数据扩展；行选择、排序、编辑与虚拟化 | 保留已有改动 |
| rc-table-pro | Table 与查询、列管理、分页组合 | 保留已有 API 改动 |
| rc-tabs | M3 primary / secondary tabs；指示器、焦点、面板 | 保留 |
| rc-tag | Chips 与静态标签扩展；选择、删除与命名 | 保留 |
| rc-text-edit | 多行 text field；label、辅助说明、清除 | 保留已有 API 改动 |
| rc-theme | L2 明暗主题与工作台接入 | 清理旧开关变量覆盖 |
| rc-token-global | L1 基元；颜色、字阶、形状、运动 | 保留 |
| rc-token-semantic | L2 角色映射与配对颜色 | 保留 |
| rc-tooltip | M3 plain tooltip；定位、hover/focus、dismiss | 修复默认样式及持久性 |
| rc-tree | 基线 Lists + Web tree 键盘模型扩展 | 修复选中指示 |
| rc-virtual | 虚拟化基础设施；滚动、测量与消费组件语义 | 保留 |

## 浏览器验证

使用本轮生产构建、本地 `127.0.0.1:4177`，通过 CUA 操作实际 Chromium 页面。全目录测试覆盖 54 页桌面浅色（1440×1000）与 54 页窄屏深色（390×844）；均有主要标题、未出现文档渲染错误，文档宽度分别为 1425/375px，没有整页横向溢出。这个结果不等于已展开并操作全部 260 个进阶示例。

定向验证：

- Switch：52×32 轨道、选中手柄 24px；RTL 选中手柄左偏移 4px；Space 关闭、Enter 开启。另核对禁用颜色不再被工作台旧变量覆盖。
- Segmented：窄屏下三项等宽 65px、视觉高度 40px、伪元素目标 48px；Enter 选中“日”，右方向键选中“周”；核对深色选中面与分隔线。
- Avatar：两个动作目标均为 48×48；Enter 和 Space 共触发两次；禁用为原生 disabled；焦点轮廓清晰。
- Breadcrumbs：Enter 和 Space 共触发两次；禁用项为原生 disabled；动作高度 48px。
- Tooltip：键盘聚焦显示 24px 高提示；默认无箭头；点击/悬停提示区域后，超过离开延迟仍保持可读；Escape 关闭。
- ColorPicker：触发器与四个预设按钮均为 48×48，SVG 色样 20×20；窄屏四列无溢出；Enter 选择绿色后输入值更新为 `#45BA50`。
- Tree：选中节点的 `aria-selected` 为 true，标题下划线生效，节点无选中竖条阴影。

行为单测另覆盖 Segmented 的禁用、受控值、纯图标保留、Enter、ref cleanup，以及 AvatarGroup 的独立操作和无嵌套按钮、Sidebar 有/无 Logo 动作。

未运行真实屏幕阅读器或操作系统级 forced-colors / reduced-motion 模拟；相关实现只做源码检查。没有穷举每个 demo、所有品牌色、200% 缩放、所有长文本和画布图元的可访问性。数据绘制、业务图标和自定义 slot 仍需要消费场景的可访问性验证。OKLCh 是本项目的存储格式，不能据此宣称与 HCT 生成算法等价。

## 工程验证

检查结果见同目录 `verification.json`。最终全仓 lint、test、typecheck、build:library 共 220 项通过；工具 lint 为 0 errors / 0 warnings，7 项规则契约测试通过；49 个令牌包通过契约检查。生产文档构建生成 63 条路由，并检查 1918 个 JavaScript 文件，未发现未绑定引用。

完整命令日志保留在本地审查目录。Turbo 的既有循环依赖警告，以及 Yarn 的既有 peer/ESM-loader 提示单独保留，不将“命令通过”描述成“全仓无既有警告”。

## 本轮实际参考

规范访问日期：2026-09-22。Material Web 对照固定为提交 `9200eb8a0eef99c6bd439ce3968952d76e9ec1b4`，仅作为实现与令牌参考。当前规范有 Expressive 新内容，不能将 Material Web 的基线数值直接当作新变体规格。

| 主题 | M3 规范（同时读取相应 Guidelines / Accessibility） | Material Web 对照 |
| --- | --- | --- |
| Switch | [Specs](https://m3.material.io/components/switch/specs) | [文档](https://material-web.dev/components/switch/)、[样式](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/switch/internal/_switch.scss)、[手柄](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/switch/internal/_handle.scss)、[令牌](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tokens/versions/v0_192/_md-comp-switch.scss) |
| Segmented | [Specs](https://m3.material.io/components/segmented-buttons/specs) | 官网无独立组件页；[labs 样式](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/labs/segmentedbutton/internal/_shared.scss)、[行为](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/labs/segmentedbutton/internal/segmented-button.ts) |
| Plain tooltip | [Specs](https://m3.material.io/components/tooltips/specs)、[Accessibility](https://m3.material.io/components/tooltips/accessibility) | Material Web 无对应实现；补充 [Floating UI hover](https://floating-ui.com/docs/useHover) 与 [WCAG hover/focus content](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) |
| 操作与头像扩展 | [Icon button specs](https://m3.material.io/components/icon-buttons/specs)、[Button overview](https://m3.material.io/components/buttons/overview) | [Button 文档及示例源码](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/docs/components/button.md)、[Icon button 文档](https://material-web.dev/components/icon-button/) |
| Tree / avatar | [Lists specs](https://m3.material.io/components/lists/specs)、[非颜色选中提示](https://m3.material.io/components/lists/accessibility) | [List 文档及示例](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/docs/components/list.md) |
| 侧栏 | [Navigation drawer specs](https://m3.material.io/components/navigation-drawer/specs) | 当前仍采用基线；不将侧栏改称 Expressive expanded rail |
| Checkbox / Radio | [Checkbox specs](https://m3.material.io/components/checkbox/specs)、[Radio specs](https://m3.material.io/components/radio-button/specs) | [Checkbox 样式](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/checkbox/internal/_checkbox.scss)、[Radio 样式](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/radio/internal/_radio.scss) |
| Tabs | [Specs](https://m3.material.io/components/tabs/specs) | [文档](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/docs/components/tabs.md)、[primary 样式](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tabs/internal/_primary-tab.scss) |

其他目录映射参考了同一提交的 Material Web `docs/components/` 下 text-field、select、dialog、menu、chip、slider、progress、divider 文档；并抽查 textfield 共享样式、menu 焦点行为和 dialog 焦点陷阱实现。它们用于审查对应能力，不作为本轮所有状态已符合规范的声明。
