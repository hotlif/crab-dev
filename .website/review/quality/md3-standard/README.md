# Material Design 3 默认视觉升级

后续密度与按钮类型调整见 [按钮简化与文档密度调整](../button-compact/README.md)。本文件中的 40px 默认按钮、56px 导航及产物验收数据保留为调整前版本记录。

用户确认范围：文档站和全部 53 个组件工作区。此版本替代此前保留紧凑尺寸、Zinc 表面和 6px 控件圆角的企业变体；旧 `md3-enterprise` 报告只记录历史版本。

## 实现对照

| 官方来源 | 当前实现 | 主要位置 |
| --- | --- | --- |
| [颜色角色](https://material-web.dev/theming/color/) | Material Neutral / Neutral Variant 表面，primary、secondary、tertiary 与容器前景配对，明暗主题和 error 配对 | `rc-token-global/token.toml`、`rc-token-semantic/src/theme.ts`、`rc-theme/src/theme.ts` |
| [官方色阶](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-ref-palette.scss) | 官方默认色转换为 OKLCh；保留旧 L1 原始值与公共变量回退 | `rc-token-global/token.toml` |
| [排版](https://material-web.dev/theming/typography/) | display、headline、title、body、label 各三档；Roboto 及中文字体回退；文档和工作台本地加载 Roboto | `rc-token-semantic/token.toml`、`rc-theme/docs/fonts.css`、`rc-prose` |
| [形状](https://material-web.dev/theming/shape/) | 0 / 4 / 8 / 12 / 16 / 28 / full；按钮胶囊、字段 4px、卡片 12px、弹窗 28px | 公共 shape 角色与各组件 L3 |
| [按钮](https://material-web.dev/components/button/) | filled（primary）、elevated（subtle）、tonal、outlined、text；默认 40px，兼容大小属性 | `rc-button`（含 ButtonGroup 导出） |
| [开关](https://material-web.dev/components/switch/) | 52×32px 轨道，16 / 24px 手柄，选中配色及状态层 | `rc-switch` |
| [文本框](https://material-web.dev/components/text-field/) | 默认 56px 字段、16px 正文、4px 轮廓，焦点与错误提示；其他选择器复用输入框 | `rc-line-edit`、`rc-text-edit`、`rc-select`、组合选择器 |
| [状态令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-state.scss) | 共享 hover 8%、focus / pressed 12%、dragged 16%，独立键盘焦点与 reduced-motion / forced-colors 分支 | L2 state / motion、各组件 L3 与样式 |

## 页面与兼容

- 删除整个公开“设计语言”栏目、页面、路由源文件和私有样板代码，更新外部引用并重新生成文档。
- 文档框架使用公共表面、排版、56px 导航项和选中 secondary container，不定义私有色板。
- 保留现有 React API、默认紫色、品牌种子、明暗主题、嵌套主题、旧 CSS 覆盖入口和尺寸属性。默认视觉尺寸发生变化，业务方的显式紧凑覆盖仍优先。
- 品牌生成继续使用项目既有 OKLCh 算法，并增加 secondary / tertiary 配对；并非移植 Material 的 HCT 动态颜色算法。
- 图表、表格、树、画布、流程图、路由等没有一一对应的 Material Web 控件，使用同一颜色、排版和状态角色，并保留其业务行为。虚拟列表的默认行高与布局计算同步。
- 字体采用 Google Fonts 的 Roboto Latin 可变字体（SIL OFL 1.1）；中文由系统字体回退。库消费方需要加载 Roboto，或覆盖公共字体角色。
- Wake 与 Crab CSS 保持 `0.1.45`，本轮不发布版本。

## 验收记录

逐工作区记录见 [components.csv](./components.csv)，命令结果与生产产物 SHA-256 见 [validation.json](./validation.json)。

- 全仓 lint / test / typecheck / library：216 / 216 任务通过，54 个测试工作区共 1,453 项 Wake 测试通过；最终对话框定位修正另完成受影响包检查。
- 文档生成器 27 项检查通过；根工具 Lint 0 错误、0 告警，7 项 Lint 契约检查通过；48 个令牌包契约通过。
- 最终生产构建包含 62 条路由；1,882 份 JavaScript 的绑定检查通过，未发现未绑定引用。公开“设计语言”路由与导航已移除。
- 同一最终产物逐页检查 53 个组件的浅色、深色与 320px 页面，共 159 次：标题与示例正常加载，未出现示例错误边界或页面横向溢出。原始字段记录见 [browser-pages.json](./browser-pages.json)。表格等组件仍使用自身滚动容器承载宽内容。
- 交互与尺寸记录见 [browser-interactions.json](./browser-interactions.json)：包括按钮品牌和嵌套主题、开关、日期提交与键盘操作、居中对话框及焦点恢复、窄屏分段选择。记录分别注明构建前复核与最终产物复核，避免混用版本证据。

本轮发现并修复了文档全局 CSS 规则片段残留、日期浮层内外圆角不一致、窄屏日历横向溢出、分段控件过宽与焦点环裁切等问题。

页面巡检覆盖初始示例与页面布局，不代表所有 Demo 的全部状态均完成浏览器验收。真实设备触控、屏幕阅读器、200% 文字缩放以及 forced-colors / reduced-motion 的浏览器模式本轮未实测；相关源码分支和包内测试不能替代设备验收。此实现不作 Material 第三方认证声明。
