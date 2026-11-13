# macOS Tahoe 26 组件审查

范围：`macos` 全套可视组件。目标为 Tahoe 26 的 Web 适配，保留公共 API、值、键盘语义及主题切换中的草稿。本文记录本轮证据，不替代 `library.manifest.json` 的覆盖状态。

## 设计依据

- [Liquid Glass 概览](https://developer.apple.com/cn/documentation/technologyoverviews/liquid-glass)：内容层与操作层分开。
- [WWDC25 AppKit](https://developer.apple.com/videos/play/wwdc2025/310/)：浮动侧栏、玻璃工具分组、同心轮廓、桌面控件尺寸与 tint prominence。
- [Tab views](https://developer.apple.com/design/human-interface-guidelines/tab-views)、[Segmented controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls)：保持稳定的分组和选中表面。
- [Menus](https://developer.apple.com/design/human-interface-guidelines/menus)、[Pop-up buttons](https://developer.apple.com/design/human-interface-guidelines/pop-up-buttons)：命令/选择语义、选择标记和图标列。
- [Steppers](https://developer.apple.com/design/human-interface-guidelines/steppers)、[NSDatePicker](https://developer.apple.com/documentation/appkit/nsdatepicker)：数值步进与数字日期/时间字段。

尺寸、颜色、阴影和 CSS 滤镜参数为本库适配值。没有宣称这些数值是 AppKit 常量，也没有宣称 CSS 实现原生折射着色器。

## 发现与处理

| 范围 | 发现 | 本轮处理 |
| --- | --- | --- |
| 主题与令牌 | 深色强调操作沿用浅底深字；部分节点继承浏览器默认字体 | 饱和底色与白字独立配对；在每个配置边界应用其字体，嵌套边界恢复自己的字族 |
| Tabs | 仍加载 MD 状态遮罩，card/pill 变体沿用原有表面 | 独立 Mac tab bezel；24/28/32 Web 档位；去遮罩、下划线，选中与焦点分开 |
| Segmented | 轨道已经改色，hover/pressed 仍是 MD 遮罩 | 控件自身反馈、边缘与选中阴影；分段之间不叠玻璃 |
| Checkbox、Radio | Table/Tree 扩大命中区时能重新显示 MD 光圈 | 组件自身彻底关闭光圈，使用盒体/圆点边缘和按压反馈 |
| Switch、Slider | 已有独立旋钮和连续轨道 | 保留；本轮主题颜色通过公共角色传递 |
| LineEdit、TextEdit、Form | 已使用稳定标签、实色字段、外部焦点 | 保留字段结构，补齐主题字体的实际继承；不把编辑区改成玻璃 |
| NumberEdit | 横排圆形加减图标按钮 | 紧凑上下箭头步进器；粗指针展开真实目标，避免上下命中区重叠 |
| Select | 三角 caret、后置选中勾、选中底色与活动环并存 | 双向 chevron，单选前置勾列，强调色只标记活动项；多选保留 checkbox 语义 |
| DatePicker / TimePicker | 所有主题默认 Material 表盘 | Mac 默认数字输入与水平时段切换；显式 dial 为扩展；编辑后切换体系保留原输入节点、空草稿和焦点；日期、时间及日期时间浮层统一次要取消/主要确认按钮 |
| Card | 共享 Material 交互阴影及整卡状态遮罩 | 保留各变体的静态层级，用边界表达交互；不在正文上叠状态层 |
| Tag / CheckableTag | 可选标签仍为 M3 filter chip；选中替换图标 | Mac toggle button 外观，保持调用方图标，独立选中/按下反馈；普通标签保持状态标签语义 |
| Alert | 整段文字和边框跟随状态色 | 中性正文和表面，状态由图标表达 |
| Dialog | 默认操作仍通过 text button 模拟主次 | Mac 使用原生层级对应的 outlined/primary 外观 |
| AppMainLayout | 侧栏贴边；整条工具栏含文字一起模糊；自定义账户和标签页菜单仍使用普通内容填充 | 浮动有间距的玻璃侧栏；工具栏文字不加玻璃背景，操作单独呈现；账户及标签页菜单采用独立玻璃材质 |
| PdfEditor | 实色工具条、圆形动作、大块蓝色缩略图背景 | 逻辑命令共享玻璃分组、桌面按钮、浮动页面侧栏及选中边框；文档画布实色 |
| Menu、Dropdown、Drawer、Tooltip、Message、Notification | 已通过独立材质角色提供浮层，默认样例不足以观察展开状态 | 复核展开及深浅色状态，材质不下放到菜单每一行或长正文 |
| Table、TablePro、Tree | 内容与分隔线已独立；复选框继承命中区 | 通过 Checkbox 修复复合使用时的光圈；排序序号使用文字强调角色；保留现有 TablePro 侧栏与公共选中令牌定制 |
| ColorPicker、CronPicker、Pagination、Breadcrumbs | 依赖基础字段、按钮、Tabs 与内容表面 | 核对组合外观；继承修复后的基础控件，不重复维护另一套状态机 |
| Avatar、Badge、Spin、Skeleton、Divider、Empty | 独立尺寸/状态或中性内容表达 | 保留；Badge 继承修正后的深色实色反馈配色，Spin 保持 Mac 辐条样式 |
| Canvas、FlowDiagram、BarChart、Prose、Masonry、SplitPane | 专业内容、排版或布局，非玻璃操作控件 | 保留稳定内容表面与自己的数据颜色；不声称存在一一对应的 AppKit 组件 |
| ConfigProvider、Theme、Token、ComponentPreview、Realm | 配置边界和集成预览 | 核对配置传播；基础设施预览也在清单截图中，不计为独立原生控件 |

## 工程管理与设备运维

用户进一步确定用途为设备树、表格、属性面板和多任务工作区。本轮新增 `docs/site/engineeringWorkspace.tsx`，在设计体系指南中提供可打开的真实工作台：`medium / compact`、可调三栏、设备树过滤、台账选择与排序、参数编辑、按设备保留草稿、保存与还原、任务页签。使用现有公开组件及令牌；数据只在当前页面内修改。材质集中在导航层，表格与参数内容维持实色、稳定分隔和清晰焦点，状态同时使用文字与形状。

完整操作验收发现 Tabs 虽保留非活动面板容器，却卸载内部组件，导致任务切换丢失草稿。现已保留默认面板内容；显式 `destroyInactiveTabPane` 仍销毁。新增组件回归分别验证两种生命周期，并在实际工作台中检查输入、切换设备及任务后的草稿、保存与还原。此修复属于共享交互契约，适用三套设计。

窄窗口检查发现文档站目录改变顺序时会移动带 key 的正文 DOM；React 实例虽保留，原生 dialog 会失去 `:modal` 顶层状态，Escape 不再产生取消事件。目录和正文现保持 DOM 顺序，仅通过 CSS 网格调整宽屏位置。新增 `site-workspace.visual.spec.mjs` 在三体系浅深色中检查实际输入节点、草稿、模态状态以及缩放后的 Escape 和返回焦点。

## 验证边界

实际截图暴露并修正了选择器优先级问题：Tabs 轨道仍被旧布局拉满、NumberEdit 步进器回到横排、Select 活动项残留旧轮廓、工作区及 PDF 的普通背景覆盖专属材质。通过提高仅限 macOS 类的优先级修正，并重新构建、重新采集真实界面。没有对截图进行外观修饰。

最终默认清单采集：`.cache/visual/2026-11-12T13-53-06-820Z`，100/100 通过。另有 16 张实际展开场景，覆盖基础控件、工作区、PDF、Select、账户菜单、Dialog、Drawer 和数字时间，各含浅深色。采集时源码及产物指纹均稳定；浏览器为 Windows Chromium 156.0.8078.4。

- [实际截图对照图库](C:/Users/zhang/.codex/visualizations/2026/11/12/01a1cf48-ab8e-7620-8d59-84e5bd8a78ed/macos-tahoe/index.html)
- [原始 PNG 索引](C:/Users/zhang/.codex/visualizations/2026/11/12/01a1cf48-ab8e-7620-8d59-84e5bd8a78ed/macos-tahoe/README.md)
- 源码指纹：`sha256:aeb7e6383d3571990b53ea92d89435d445f417d8dd89e0fe4bf97d07f948a07a`
- 产物指纹：`sha256:97f6f82de043328d98ea8a4b3a52ac7e6cc578c2ce4b2a0792a2a749ac373b56`

改动前清单采集：`.cache/visual/2026-11-12T12-17-31-748Z`，100 个深浅色默认预览。默认预览只是范围盘点；许多浮层要打开后才能审查，不用这些截图替代状态验收。

本轮新增行为回归：macOS 数字时间默认值、显式表盘扩展、跨主题输入节点/焦点/空草稿保留，以及复合命中区扩大后的无光圈复选框。

系统高对比度检查按独立设计区分断言：macOS Tabs 验证选中 bezel 的系统前景/填充和焦点，CheckableTag 验证没有自动添加 M3 勾选图标且选中系统色对完整；继续检查真实截图中文字、背景和焦点像素，没有取消可读性检查。

工程验证分阶段记录，不能把它们描述为一次全量命令全部成功：根检查的架构、49 项令牌契约、生成一致性、lint、构建、导出、独立消费、类型及普通测试通过；在旧 Tabs 强制颜色断言处停止。修正独立设计断言后，所需浏览器检查分组重跑通过，Tag 的旧自动勾图标断言也单独修正并复测。日期选择器必跑浏览器检查 156 项通过。最终状态矩阵首次 508/510 通过，两项失败均为 Tag 旧图标断言；修正后两项通过。新 Tabs 草稿修复的包内 `check` 再次通过：24 项普通测试、49 项浏览器测试、3 组各 6 项强制颜色检查。站点生成器、开发/构建契约、漂移和 143 项普通测试通过；生产构建检查 2043 个 JavaScript 文件，未发现未绑定引用。

Tabs 草稿修复后，日期、执行计划与 Tabs 的 macOS 浅深色状态回归 172/172 通过，证据为 `.cache/visual/2026-11-12T14-40-22-567Z`。前一次同样的状态断言通过，但建站报告 `binding-check.json` 在采集中更新导致完整站点指纹变化，因此那次采集没有作为稳定候选；随后等待生产检查结束并重新采集。

最终工程工作台和指南布局回归 10/10 通过，证据为 `.cache/visual/2026-11-12T14-52-02-768Z`：三体系浅深色工作台 6 项，以及 macOS 浅深色的窄屏/桌面指南 4 项。另一次真实工作流采集覆盖树范围过滤、搜索、设备选择、按设备保留草稿、任务切换、保存还原、键盘分栏调整、Escape 和返回焦点，6 种主题组合全部通过。macOS 的 900×800 窗口采用工作台内部横向滚动，文档自身不横向溢出；强制颜色下材质恢复系统前景/背景，滤镜和装饰背景均为 `none`。

图库现包含 26 张重点场景和 100 张默认组件预览，共 126 张原始 PNG。工程工作台浅深色已人工核对，来自 Windows Chromium 156.0.8078.4；浏览器实际使用 Microsoft YaHei UI 回退字体。最终采集期间源码、组件产物和完整站点产物均保持稳定：

- 源码：`sha256:1d67d6c006ff69ca1cd9160f629d5d62eafa2b53f1604a883135a5315d8e2241`
- 组件产物：`sha256:d3e2fbb66a256948bfe8963de318923c1a0d44eb9da47a46d1f0c856d1da919d`
- 完整站点：`sha256:38fdd1cf7db61978d88c282219907079750199efdf438330ee75c18bba30bbd2`

最终日志：`.tmp/tahoe-workspace-site-final-check.log`、`.tmp/tahoe-workspace-site-final-test.log`、`.tmp/tahoe-workspace-site-final-build.log`、`.tmp/tahoe-workspace-browser-accepted.log`、`.tmp/tahoe-workspace-capture-accepted.log`。本轮没有在原生 macOS/Safari 上验收，也没有批准固定 Linux 环境的全库像素基线。

最终命令、状态截图与未覆盖项在本轮交付记录中列出。Windows Chromium 候选采集不等同于固定 Linux 环境下的像素基线批准；设计覆盖保持 `partial`，不因工程检查通过而自动升级。
