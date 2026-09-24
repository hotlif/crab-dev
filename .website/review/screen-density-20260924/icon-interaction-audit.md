# 尾部图标交互检查

日期：2026-09-24。

检查目标：清除与展开图标是否共用稳定操作位，鼠标从内容区移到图标是否误判离开，清除与面板焦点是否相互干扰。

## 范围与结果

对 `components/` 全部 54 个工作区的 404 个非生成、非测试 `src` TypeScript 文件进行了清除、悬停事件、隐藏样式和图标切换检索，再阅读相关控件实现。浏览器实测集中在本次改动的 Select、TimePicker、DateTimePicker；没有将源码筛查等同于全部组件的完整交互验收。

| 组件 / 路径 | 检查结果与处理 |
| --- | --- |
| Select | 原来清除与箭头并排显示，未遵循单槽切换要求。改为保留一个按钮节点，在字段悬停或按钮聚焦时显示清除，离开后恢复箭头。输入、按钮及 SVG 都属于同一个悬停边界。 |
| TimePicker | 原来 `readOnly` 与 LineEdit 的 `allowClear` 同时使用，导致清除入口被隐藏。改为复用日期选择器的尾部操作按钮，在时钟与清除之间切换。 |
| DatePicker / DateTimePicker / TimePicker | 输入框失焦直接关闭面板，会误伤进入尾部按钮或面板编辑框的焦点移动。保留调用方 onBlur，关闭交由外部点击、输入框 Escape、清除、确定 / 取消处理。 |
| 时间面板确认 | 实测发现数字输入只在失焦时提交，但弹层阻止按钮默认聚焦；直接点击确定可能提交旧值。TimePicker 与 DateTimePicker 的确定按钮先取得焦点，使数字草稿在点击前提交。 |
| TimePicker 面板草稿 | 空值首次打开直接确认无响应，以及父级保留初始值副本的问题一并修复。每次打开使用当前受控值，空值时使用面板显示的当前时间；取消不提交。 |
| LineEdit / TextEdit / NumberEdit | 清除入口由值、禁用、只读状态决定，不依赖输入区域悬停；没有发现移到清除按钮便消失的同类边界问题。密码显隐、数字步进各自保持独立功能。 |
| ColorPicker / CronPicker | ColorPicker 的 allowClear 是面板内重置草稿操作；CronPicker 没有清除图标切换。未发现相同切换问题。 |
| Pagination | 省略号与跳页箭头在同一个按钮内，由按钮自身 hover / focus-visible 控制。移动到内部图标仍在按钮边界内。 |
| Tag / Tabs / AppMainLayout 标签页 | 关闭入口没有输入框悬停条件，不受此次边界问题影响。 |
| Tree / TablePro 列管理 | 拖拽及列操作图标由包含图标的父节点样式控制显示，未发现移动到子图标后退出父节点 hover 的问题。 |
| Table / TablePro 筛选 | 复用 LineEdit / Select，Select 修复随依赖生效。 |

其余检索结果主要是状态层、出现 / 消失动画、图表高亮及定时器清理，没有发现另一套相同的清除图标切换实现。本记录只覆盖上述问题范围。

## 验证

- Select：包内 lint、typecheck、36 项测试、library 构建通过。
- DatePicker 包：包内 lint、typecheck、65 项测试、library 构建通过。测试覆盖三种字段的悬停边界、空值、禁用、无 hover 环境、鼠标 / Enter / Space 清除、焦点恢复和面板草稿。
- 两包构建均通过各自 `generate:token` 刷新产物，没有手工编辑生成文件。
- Select 浏览器实测：outlined / filled、三档尺寸、浅色 / 深色；从字段内容移到清除中心、移出恢复、鼠标清除、Tab + Enter / Space 清除。字段宽 264px 不变；字段高 48 / 56 / 64px，操作位 32 / 40 / 48px，每个尾部只有一个操作按钮。
- TimePicker 浏览器实测：时钟与清除切换、图标中心命中、移出恢复、鼠标与键盘清除、输入焦点恢复；字段宽 263px 不变，三档字段和操作位尺寸同上。
- 面板浏览器实测：TimePicker 空值直接确认、进入小时字段编辑、手输后直接确认、重新打开、点击外部关闭；DateTimePicker 手输小时后确认保存新值。
- 文档生成一致性检查通过：54 个组件页、57 份教程、126 个教学示例、263 个 Demo，0 漂移。

## 设计依据

单槽悬停切换遵循用户明确要求，属于本库交互扩展；不将其表述为 M3 强制规则。字段和操作按钮延续现有 M3 outlined / filled text field 与标准 icon button 的实现，三档桌面尺寸沿用项目密度体系。

- [M3 Text fields 指南](https://m3.material.io/components/text-fields/guidelines)、[规格](https://m3.material.io/components/text-fields/specs)、[无障碍](https://m3.material.io/components/text-fields/accessibility)
- [M3 Time pickers 指南](https://m3.material.io/components/time-pickers/guidelines)、[规格](https://m3.material.io/components/time-pickers/specs)、[无障碍](https://m3.material.io/components/time-pickers/accessibility)
- [Material Web Select 示例](https://material-web.dev/components/select/)、[行为源码](https://github.com/material-components/material-web/blob/main/select/internal/select.ts)、[outlined 样式](https://github.com/material-components/material-web/blob/main/select/internal/_outlined-select.scss)
- [Material Web Text field 示例](https://material-web.dev/components/text-field/)、[Icon button 文档](https://material-web.dev/components/icon-button/)、[字段实现](https://github.com/material-components/material-web/blob/main/textfield/internal/text-field.ts)、[字段令牌](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-outlined-text-field.scss)

Material Web 未提供日期 / 时间选择器实现；本次对其字段与按钮进行对照，没有将现有整套日期 / 时间面板宣称为完全符合 M3。上游 main 链接查阅于上述日期。
