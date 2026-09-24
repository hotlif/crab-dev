# 组件文档布局核对

访问与验证日期：2026-09-24。

本次延续现有 Material Design 3 Web 界面，调整文档排版与辅助目录，不迁移组件变体。文档没有对应的单一 M3 组件，采用主内容与辅助面板的布局原则，并复用仓库的文本按钮及语义令牌。

## 改动

- 从生成器移除“设计参考”段落，同时移除 Select、PdfEditor 文档源中重复的同名章节；54 个组件页面全部通过生成命令刷新。
- 入门说明按“适合使用、选择其他组件、使用要点、无障碍”分组；正文可用宽度达到 640px 时呈双栏，否则按原顺序单栏阅读。
- 正文使用 body.large 字阶与行高，说明分组使用 title.medium；限制长段落行宽，收紧列表和章节间距，保持示例与 API 的可用宽度。
- 内容区域达到 1000px 时显示右侧目录，移除目录中重复的页面标题。窄屏保留可折叠目录，并让锚点避开固定顶栏。

640px、1000px 和 88ch 是根据本文档内容选取的应用布局尺寸，不是 M3 组件的固定规格。目录保留原有链接语义、当前章节提示、键盘焦点和按钮交互。

## 验证

- 文档站 `yarn lint`：0 errors、0 warnings。
- 文档站 `yarn typecheck`：通过。
- 文档站 `yarn test`：31 项生成器测试、63 项 Wake 页面测试通过。
- 最终间距调整后再次执行 `yarn lint`、`yarn test:generator`、`yarn check:docs`：通过，生成产物无漂移。
- 刷新 rc-token-global 与 rc-token-semantic 的令牌产物；未修改令牌定义。
- 浏览器核对 DatePicker 文档的深色、浅色界面，以及 1920px、1440px、1270px、390px 视口；未发现页面横向溢出。
- 手机目录可通过 Enter 展开和跳转；1270px 窗口下目录和目标章节均位于固定顶栏下方。
- 输入 API 筛选词后切换手机与桌面布局，输入内容保持；浏览器核对时没有 error 或 warn 日志。

上述结论仅覆盖本次文档布局与目录，不代表对组件库全部状态的合规认证。

## 实际查阅资料

- [M3 Canonical layout examples](https://m3.material.io/foundations/layout/canonical-examples/overview)：主内容、辅助面板与响应式布局。
- [M3 Applying type](https://m3.material.io/styles/typography/applying-type)：字阶、Web 排版间距、行高、文本可读性与无障碍。
- [Material Web Typography](https://material-web.dev/theming/typography/)：字阶角色和令牌映射。
- [Material Web Buttons 文档与示例](https://material-web.dev/components/button/#text-button)：文本按钮、链接按钮、无障碍名称与示例外观。
- [Material Web 按钮行为源码](https://github.com/material-components/material-web/blob/main/button/internal/button.ts)：按钮与链接语义、焦点处理。
- [Material Web 文本按钮样式](https://github.com/material-components/material-web/blob/main/button/internal/_text-button.scss)：透明容器与变体令牌。
- [Material Web 文本按钮令牌](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-text-button.scss)：main 分支读取版本，引用 v0_192 组件令牌，水平间距采用 12px。

设计核对资料保存在 review 目录，不插入公开组件文档。
