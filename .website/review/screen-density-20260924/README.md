# 组件尺寸与桌面屏幕适配检查

后续实现已记录在 [统一尺寸实现与验证](./implementation.md)；下文保留优化前的检查快照。

检查日期：2026-09-24。基于当前工作区（包含检查前已有的未提交修改）和 `http://127.0.0.1:5173` 的实际页面。本次只检查并记录结果，没有修改组件、设计令牌、文档站实现或依赖。

**结论：没有发现组件库以 4K 物理分辨率为基准放大的证据；但“在普通桌面窗口里显得大、可见信息少”的感受有依据。主要原因是默认密度较宽松、全局尺寸配置接入不完整、部分 small 档并不降低高度，以及文档站分栏挤占可用空间。不能据此判断所有组件都不适合 2K 以下屏幕。**

## 检查范围与边界

- 扫描全部 **54 个组件包、402 个手写源文件、907 条尺寸相关令牌**；排除生成的 `src/token.ts`、构建产物及测试目录。逐包记录尺寸、布局、适配条件和演示固定尺寸，见 [源码清单](./source-inventory.json)。
- 在 Chrome 中分别以 **1366×768、1920×1080 CSS 像素视口访问全部 54 个文档页面**，读取页面边界、正文宽度和当时已经挂载的基础演示尺寸。两轮共 108 次页面检查均未发现顶层文档横向溢出。
- 补充测量 3840、2560、1920、1707、1536、1440、1366、1280、1024、960px 宽度下的文档布局；重点检查 TablePro 订单演示、带内置样本文档的 PDF 编辑器、常用表单控件。
- 对照 M3 密度与文本字段规范、Material Web 文档和实际输入框，以及 Material Web 的按钮、文本字段相关源码。
- “顶层无溢出”不代表 iframe 内部、所有弹层、所有数据量都已通过；多数“全部示例”采用懒加载。本次没有穷举每个演示、交互状态、语言、主题或触屏环境，也没有声称全库符合 M3。
- 未修改产品代码，因此没有运行与此次只读检查无关的组件 lint/test/build。

## 已确认的原因

### 1. 物理分辨率不是组件尺寸的依据

L1 和 L2 的常用字号为 14/16px，常用控件与字段高度为 40/56px。实际文档根字号为 16px，页面 CSS `zoom` 为 1。未发现根据 3840/2560 屏幕分辨率放大所有控件的分支。Canvas 中的 DPR 与 zoom 用于绘图清晰度或画布视口，不是全站缩放。

例如浏览器缩放为 100% 时，3840 宽屏幕在系统 200% 缩放下约对应 1920 CSS 像素；2560 在 150% 缩放下约为 1707；1920 在 125% 缩放下约为 1536。还应扣除窗口边框、侧栏等。因此应以实际浏览器内容宽高和输入方式判断适配，不能仅按“4K/2K”分类。

默认按钮视觉高度 40px 与 [Material Web 按钮令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-filled-button.scss) 一致。[M3 文本字段规格](https://m3.material.io/components/text-fields/specs)的默认容器高度为 56dp；[Material Web 输入框](https://material-web.dev/components/text-field/)的 Filled / Outlined 单行示例在本次浏览器中实测均为 56 CSS px。这里是 Web 实现对照，不把所有平台的 dp 与 px 无条件等同。

### 2. 数据输入与列表采用宽松默认密度

| 对象 | 当前默认值 | 较小桌面窗口中的影响 |
| --- | --- | --- |
| LineEdit / Select，及复用输入框的 NumberEdit、日期与 Cron 输入 | 控件 56px；small 仍为 48px | 长表单、筛选栏可见字段较少；含一行说明的实际示例整体约 76px |
| NumberEdit 步进按钮 | 两个按钮各 48×48px，间距 4px | 右侧操作区域约 100px，较窄数字列中占比高 |
| Table / TablePro | 数据行 52px，表头/筛选行 56px，汇总行 52px | 同样高度可见行数较少；这不是 4K 专用规格 |
| Tree | 默认节点高 56px | 深层、大量节点需要更多滚动；已有 `defaultNodeHeight` 可调整 |
| Menu | 垂直项与水平项高度 56px | 长导航列表占用较多垂直空间 |

来源：[字段令牌](../../../components/rc-line-edit/token.toml)、[Select 令牌](../../../components/rc-select/token.toml)、[数字步进器](../../../components/rc-number-edit/src/stepper.tsx)、[Table](../../../components/rc-table/src/table.tsx)、[Tree](../../../components/rc-tree/src/tree.tsx)、[Menu 令牌](../../../components/rc-menu/token.toml)。

实测 Table 基础演示数据行 52px、表头 56px；TablePro 订单示例也为相同高度。文档中 Table 的基础演示列总宽约 3150px，而显示区域在 1366 视口中约 825px，依赖表格内部横向滚动。大量业务列并不意味着每一个基础控件都设计得过大。

### 3. 全局 small 尚不能统一调整全库

`ConfigProvider` 提供 `size`，但检查源码发现：只有 Button / ButtonGroup 消费 `config.size`；Empty 消费的是 locale。LineEdit、Select、NumberEdit 等仍使用各自的 `size = "middle"`。

因此给根节点设置 `ConfigProvider size="small"` 不能让整套表单、导航和数据组件进入统一紧凑模式。这是跨组件一致性的实际缺口。

来源：[配置类型](../../../components/rc-config-provider/src/types.ts)、[配置提供者](../../../components/rc-config-provider/src/config-provider.tsx)、[Button](../../../components/rc-button/src/button.tsx)、[LineEdit](../../../components/rc-line-edit/src/lineEdit.tsx)、[Select](../../../components/rc-select/src/select.tsx)、[NumberEdit](../../../components/rc-number-edit/src/numberEdit.tsx)。

此外，多个 size 档不是有效的高度密度档：

| 组件 | 尺寸档现状 |
| --- | --- |
| Segmented | small / middle / large 均为 40px，主要尺寸令牌相同 |
| Switch | 三档轨道均为 52×32px |
| Pagination | small / medium 均高 40px，仅部分水平间距、字号不同 |
| Tabs | small / medium 均高 48px |
| Tag | small / middle 均高 32px |
| TextEdit | 三档字号、行高和垂直内边距相同；高度主要由 rows / autoSize 决定 |

**等高本身不等于违反 M3**，尤其 Switch 等组件有既定标准形态；但这些 size API 不能被当作覆盖全库的密度系统。

### 4. 文档站布局会强化“所有组件都偏大”的感觉

文档站桌面默认展开时，导航轨道 88px + 左侧导航 320px，共占 408px；右侧章节目录 176px。正文容器宽度达到 960px 时开启右侧目录。标题为 57px，章节 h2 为 36px且上边距 80px。它更接近展示与阅读页面的节奏，不代表实际业务界面必须采用相同留白。

以下为等待 ResizeObserver 与 React 布局稳定后的实测值；左侧导航保持默认展开，浏览器垂直滚动条约占 15px，均无顶层横向溢出：

| CSS 视口宽度 | 主内容容器宽度 | 正文净宽 | 右侧目录 |
| --- | --- | --- | --- |
| 3840 | 1760 | 1040 | 展开 |
| 2560 | 1760 | 1040 | 展开 |
| 1920 | 1497 | 1040 | 展开 |
| 1707 | 1284 | 1012 | 展开 |
| 1536 | 1113 | 841 | 展开 |
| 1440 | 1017 | 745 | 展开 |
| 1366 | 943 | 863 | 折叠 |
| 1280 | 857 | 777 | 折叠 |
| 1024 | 601 | 521 | 折叠 |
| 960 | 945 | 865 | 折叠，左侧转移动布局 |

两个明显的布局跳变：1440 宽时的正文反而比 1366 窄；1024 宽时只剩 521px，而 960 已切换移动布局、净宽恢复到 865px。并且 1920、2560、3840 下正文净宽相同，说明该文档站并非必须有 4K 才能完整显示。

初次即时缩放时曾读到 1366 下正文 671px，这是折叠完成前的瞬时布局；正式结论采用上表稳定后的 863px。

来源：[文档布局与间距](../../docs/site/documentStyles.ts)、[目录断点](../../docs/site/documentNavigation.tsx)。

### 5. 复杂容器仍有需要改进的适配点

- **FlowDiagram：**默认显式传给 Canvas 的宽高为 800×520。放进小于 800px 的容器时，调用方需要传入适合容器的尺寸；这是真实的固定尺寸默认值，不能只靠屏幕分辨率判断。见 [FlowDiagram](../../../components/rc-flow-diagram/src/flow-diagram.tsx)。
- **PdfEditor：**默认侧栏 240px + 280px，两个面板初始均打开；响应式切换依赖 `@media (max-width: 1000px)`。内置样本文档实测：1920 宽时画布约 1381px，1366 时约 827px，1024 时约 485px；960 时侧栏改为覆盖定位，画布布局宽约 941px，仍可能被打开的侧栏覆盖。它具备适配，但在较窄桌面和嵌入式分栏中应进一步检查可见画布面积。见 [PDF 样式](../../../components/rc-pdf-editor/src/styles.ts)与 [面板默认状态](../../../components/rc-pdf-editor/src/pdf-editor.tsx)。
- **AppMainLayout：**侧栏 280px，可收起为 80px；自动移动布局依赖浏览器 767px 断点。嵌入窄容器但浏览器较宽时不会仅因容器变窄自动折叠。这是源码确认的适配风险，本次未构建任意宿主布局逐一重现。见 [布局逻辑](../../../components/rc-app-main-layout/src/layout.tsx)。
- **TablePro：**右侧面板固定 220px，加 36px 工具条；表格会适应剩余空间，但列多、固定列和筛选控件组合会增加横向滚动。见 [TablePro 布局](../../../components/rc-table-pro/src/table.tsx)。
- **演示外壳：**ComponentPreview 默认舞台最小高度 220px；站点存在单独覆盖，iframe 又按内容测量高度、上限为 1200px。订单示例中实测 iframe 宽约 695px，而内部文档可高达 2398px，存在内外滚动。这里应把演示外壳与组件本身分开评估。见 [预览令牌](../../../components/rc-component-preview/token.toml)、[演示 iframe](../../docs/site/componentDemoFrame.tsx)。

## 全部 54 个包逐项结果

下表的“未见统一放大”只表示未发现为 4K 放大尺寸的证据，不代表所有交互与任意宿主容器已验证。每行均完成源码扫描及上述两种桌面视口的文档页面检查；原始尺寸与源文件位置可在 `source-inventory.json` 按包名查询。

| 包 | 关键尺寸或布局 | 尺寸检查结论 |
| --- | --- | --- |
| rc-alert | 内容自适应高度；说明、标题决定总高度 | 未见统一放大；反馈组件不宜统一压缩 |
| rc-app-main-layout | 顶栏 64；侧栏 280/80；标签带 40 | 固定框架占位与容器适配需关注 |
| rc-auto-sizer | 测量宿主容器；无固有大屏尺寸 | 未见统一放大 |
| rc-avatar | 28/40/48 | 未见异常大屏尺寸 |
| rc-badge | 数字标记高 16 | 未见异常大屏尺寸 |
| rc-bar-chart | 尺寸由容器和数据决定 | 需结合宿主高度与图例数量；非统一放大 |
| rc-breadcrumbs | 内容排布；粗指针扩大命中区 | 未见异常大屏尺寸 |
| rc-button | 32/40/56，另有 96/136 大尺寸 | 默认 40 正常；超大档是显式选项 |
| rc-canvas | 支持显式尺寸与填充父容器；DPR 用于位图 | 非全站放大；宿主需提供合理尺寸 |
| rc-card | 默认内边距 16，大档 24 | 未见异常大屏尺寸 |
| rc-checkbox | 视觉框 16/18/20，基础目标 40 | 区分框大小和命中区，不宜整体缩放 |
| rc-color-picker | 触发目标 48；面板最小宽 250 | 不是 4K 尺寸；小容器需核对面板 |
| rc-component-preview | 默认舞台最小高 220；有独立 density | 演示留白会增强偏大感觉；不是全库密度 |
| rc-config-provider | size 默认 middle | 尺寸值仅 Button / ButtonGroup 消费 |
| rc-cron-picker | 输入复用 LineEdit；浮层宽 480并受视口限制 | 输入密度继承；浮层已有宽度约束 |
| rc-date-picker | 输入复用 LineEdit；日期格 40；导航目标 48 | 输入密度继承；弹层有视口最大宽度 |
| rc-dialog | 最小宽 280；最大宽高受视口约束 | 未见 4K 前提；confirm 另有 22rem 最小宽，极窄屏未穷举 |
| rc-divider | 细线/内容自适应 | 未见异常大屏尺寸 |
| rc-drawer | 宽 280/420/560，高 240/360/480；限制最大视口 | 中大档空间占比高，但已有视口边界 |
| rc-dropdown-container | 最大宽度视口减 16，浮动定位限制高度 | 已有视口保护，内容自身仍需自适应 |
| rc-empty | 最小高 200，图示宽 80 | 在小卡片和示例中明显占高，可考虑独立紧凑用法 |
| rc-flow-diagram | 默认 800×520 | 明确固定默认尺寸，窄宿主需传尺寸 |
| rc-form | 行间距 12；字段尺寸来自子组件 | 受输入控件密度影响，没有统一密度接入 |
| rc-hooks | 无固有界面；有尺寸与媒体查询工具 | 不属于偏大控件 |
| rc-line-edit | 48/56/64；字体 16 | 默认宽松；未消费全局 size |
| rc-masonry | 按容器测量；默认两列 | 自适应列宽，列数需业务设置 |
| rc-menu | 导航项高 56 | 长导航偏疏；无完整密度档 |
| rc-message | 内容自适应，浮层反馈 | 未见统一放大；不要默认压缩反馈目标 |
| rc-notification | 宽 360；最大宽高受视口限制 | 未见 4K 前提 |
| rc-number-edit | 复用输入框；步进按钮 48×48各一个 | 长宽密度均需关注；全局 small 不生效于字段 |
| rc-pagination | small/medium 均高 40；允许换行 | small 不减少垂直占位 |
| rc-pdf-editor | 高 min(800px,85vh)，最小480；双侧栏240+280 | 复杂桌面工作区，重点检查可用画布面积 |
| rc-prose | 最大宽 100%；字号与内容决定排版 | 非统一放大，文档站覆盖需单独判断 |
| rc-radio | 视觉圆 16/20/24；命中目标48 | 标准目标占位，不等于图标偏大 |
| rc-realm | 远程组件边界 | 没有独立固定大尺寸，取决于加载内容 |
| rc-router | 路由能力 | 无固有视觉尺寸 |
| rc-segmented | 三档均高40 | size 高度档退化；不能承担紧凑切换 |
| rc-select | 48/56/64；选项高48；浮层最大高240 | 默认字段宽松；未消费全局 size |
| rc-skeleton | 文本12/16/20，头像40；矩形高度可配 | 未见统一放大；应跟随被占位内容 |
| rc-slider | 默认 xs 轨道16，拇指44；另有大尺寸 | 默认非超大档；视觉与交互容器应分开判断 |
| rc-spin | 16/24/40 | 未见异常大屏尺寸 |
| rc-split-pane | 填充容器，分隔条独立命中范围 | 由宿主与面板约束决定，不是大屏常量 |
| rc-switch | 三档轨道52×32；交互容器更高 | 标准形态；small 不缩小轨道 |
| rc-table | 数据行52、表头56、筛选56；虚拟滚动 | 信息密度偏疏；已有行高接口但缺少统一密度 |
| rc-table-pro | 继承Table；侧栏220+工具条36 | 密度与侧栏组合问题，需容器级考虑 |
| rc-tabs | 48/48/64 | small 不降低中档高度 |
| rc-tag | 32/32/40 | small 不降低中档高度 |
| rc-text-edit | rows/autoSize 决定高；三档竖向排版相同 | size 不能显著减小总高 |
| rc-theme | 主题样式 | 未发现整站4K放大规则 |
| rc-token-global | 基元字号14/16、尺寸32/40/48/56等 | 常用值不是高分辨率倍增值 |
| rc-token-semantic | control40、field56、navigation56、touch48 | 默认角色偏宽松；没有统一 density 角色 |
| rc-tooltip | 最大宽250；内容自适应 | 未见异常大屏尺寸 |
| rc-tree | 默认节点56；可配置；触屏最低48 | 桌面树密度偏疏，可以已有接口先局部调整 |
| rc-virtual | 接受视口和行列尺寸，提供虚拟滚动 | 尺寸由调用方提供，不是统一放大来源 |

## 建议的处理顺序

1. 先调整文档站分栏切换策略：根据正文所需净宽决定左右目录是否展开，消除 1440/1366 与 1024/960 的反向跳变；降低展示性标题和留白对组件判断的干扰。
2. 补齐全局 size 的消费契约，再设计用户可选择、可恢复的桌面 density。优先覆盖表单、表格和树，不把所有组件直接按比例缩小。
3. 明确 size（组件变体尺寸）与 density（同一组件的信息密度）的区别，整理目前等高尺寸档的文档与行为；不为制造尺寸差异而随意破坏 Switch 等组件的标准形态。
4. FlowDiagram、AppMainLayout、PdfEditor、TablePro 增强按宿主可用空间的适配。复用 AutoSizer / ResizeObserver，避免仅依据整个浏览器宽度判断侧栏布局。
5. 后续实施分别验证普通桌面、系统缩放后的有效视口、窄分栏和触屏；表单编辑器高度、表格行高与点击区域须配套，不能只减小一个令牌。

[M3 密度指南](https://m3.material.io/foundations/layout/grids-spacing/density)允许按任务与用户偏好增加信息密度，说明了按 4dp 步进调整的方式，并要求保留字号与可用的交互目标；密度不应只因跨越屏幕断点自动改变。响应式改变布局和用户主动选择密度是两个问题。

## 实际参考资料

- [M3 Grids & spacing — Density](https://m3.material.io/foundations/layout/grids-spacing/density)，浏览器读取完整正文。
- [M3 Text fields — Specs](https://m3.material.io/components/text-fields/specs)，读取默认56dp、边距和状态说明。
- [Material Web Text field](https://material-web.dev/components/text-field/)，读取用法、无障碍、变体；实测单行 Filled/Outlined 示例56px。
- [Material Web Buttons](https://material-web.dev/components/button/)，读取用法、变体及无障碍说明。
- [Material Web Switch](https://material-web.dev/components/switch/)，读取用法与标签说明。
- [Filled button 版本化令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-filled-button.scss)，Web token版本v0.192，container-height 40px。
- [Button 共享样式](https://github.com/material-components/material-web/blob/main/button/internal/_shared.scss)与[Button 行为实现](https://github.com/material-components/material-web/blob/main/button/internal/button.ts)。
- [Outlined text field 版本化令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-outlined-text-field.scss)、[Field 共享样式](https://github.com/material-components/material-web/blob/main/field/internal/_shared.scss)与[Field 内容布局](https://github.com/material-components/material-web/blob/main/field/internal/_content.scss)。
- 本次可读取的[仓库 main/package.json](https://github.com/material-components/material-web/blob/main/package.json)声明版本2.4.1；未将项目文档中写出的其他版本号当作本次已核验版本，也未确认 Material Web 官网部署提交。未声称其覆盖全部 M3 Expressive 变体。

源码扫描可复现：在仓库根目录运行 `node .website/review/screen-density-20260924/scan.mjs`。该脚本只读取手写源码、更新本目录的清单；浏览器尺寸结果见本报告，未伪装成无布局引擎的单元测试结果。
