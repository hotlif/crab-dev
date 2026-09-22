# Crab 企业级 Material Design 3 变体

> 历史记录：此紧凑变体已被后续“文档站和全部组件按 Material Design 3 默认视觉”升级替代。当前实现与验收见 [md3-standard](../md3-standard/README.md)，以下证据仅对应当时版本。

本轮升级默认设计，覆盖 53 个组件工作区。保留默认紫色、ConfigProvider.brandColor、small / middle / large 的 24 / 32 / 40px 基准、OKLCh、既有图标与三层令牌。Wake / Crab CSS 保持 0.1.45；没有新增依赖、版本发布或涟漪运行时。

## MD3 来源、取舍与实现

| MD3 来源 | Crab 取舍 | 实现位置 | 验收证据 |
| --- | --- | --- | --- |
| [颜色角色](https://material-web.dev/theming/color/) | 实色、品牌浅容器和前景配对；业务反馈与品牌独立；中性表面不染色 | `rc-token-semantic/token.toml`、`src/theme.ts`、`src/brand-theme.ts`；ConfigProvider | 明暗主题与品牌种子对比度测试；browser-states 的中性表面、嵌套和旧变量覆盖检查 |
| [状态令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-state.scss) | hover 8%、focus / pressed 12%、dragged 16%；独立焦点轮廓；150ms 即时反馈 | L2 `state.opacity`、`color.state`，Button / Checkbox / Radio / Slider / Select 等 L3 | 按钮四态颜色合成、几何稳定性；键盘与系统颜色检查 |
| [按钮层级](https://material-web.dev/components/button/) | 新增 tonal、outlined；保留默认 subtle 和 primary 的单层浅阴影，实色状态不重复叠加 | `rc-button/src/types.ts`、`button.tsx`、`token.toml`；ButtonGroup | 外观渲染、Group 继承、禁用 / 加载测试；生产样例 |
| [排版角色](https://material-web.dev/theming/typography/) | display 32/40、headline 28/36、title 20/28、body 14/22、label 14/20、caption 12/18px，中文字体回退 | L1 字体与行高，L2 typography，组件 L3；设计文档 | 令牌契约、生成一致性、文字真实加倍后的控件布局 |
| [形状](https://material-web.dev/theming/shape/) | 控件 6px、卡片 8px、浮层 12px，保持企业后台紧凑感 | L2 shape；Card / Dialog / Drawer / DropdownContainer / Tooltip 等 L3 | 组件测试、生产构建与截图 |
| 表面层次 | canvas / content / container / raised / overlay；暗色依靠明度及边界，不只加深阴影 | L2 color.surface，所有相关容器和数据 L3 | 明暗表面配对、暗色层次单元测试；主题对照样例 |

## 兼容与实现细节

- 原 CSS 变量、导出与覆盖回退保留。新增 ThemeColors 字段可选，公开默认契约提供完整字段。
- 新表面及浅品牌容器别名在消费点求值，避免根节点先计算变量后，嵌套旧变量覆盖失效。品牌生成器沿用原有 15 个 L2 覆盖，浅品牌容器通过 selection 配对联动。
- 新状态颜色兼容旧 hover-subtle / active-subtle 变量；两种主题的默认中性反馈由公共 8% / 12% 状态透明度生成，旧变量仍可覆盖，表格固定列保持不透明底色。
- 公共控件尺寸保持 24 / 32 / 40px；文档业务样板 28 / 36px 是局部密度，未新增公共 density API。文字单独放大时，Button 与 Select 用实际行高扩展容器，避免裁切。
- Checkbox / Radio 保留独立 48px 触控目标，其余独立操作使用 44px 基线。Table 的紧凑选择区由整个单元格承接点击，不用互相覆盖的透明区域。
- Select 的虚拟行高测量独立于虚拟滚动的可见行，分组与选项共享实际高度；Tree 粗指针行高与虚拟偏移同步。新增对应回归用例。
- Pagination 在窄屏按 DOM 顺序换行，粗指针的页码、前后页和跳页入口保留 44px 目标；生产巡检显式断言页面不横向溢出及目标尺寸。
- 菜单补齐方向键、Enter / Space 激活、展开关系与 Escape 焦点恢复；Slider 补齐键盘、禁用和空范围处理。
- Button 在 forced-colors 下使用系统 ButtonFace / ButtonText、Highlight / HighlightText 配对，连同子元素一起处理，避免文字背板造成白字白底。

## 分批记录

1. 基础与表单：公共令牌、主题、ConfigProvider、Button、Checkbox、Radio、Switch、输入、选择与日期 / 颜色 / Cron 等组合控件。首轮 77 项任务通过。
2. 容器与导航：Card、Dialog、Drawer、下拉、Tooltip、Menu、Tabs、Segmented、分页及反馈。首轮 104 项任务通过。
3. 数据与组合：Table、TablePro、Tree、图表、Canvas、FlowDiagram、布局、Realm、虚拟化；修正树测试替身，增加虚拟行高与整格点击回归。最终结果以全仓验收记录为准。
4. 文档：同步 Button API、示例和设计章节；工作台继续共享公共主题；新增 `/design/tokens` 的默认设计、绿色 / 橙色品牌、嵌套和 Portal 样例。

## 验收产物与复现

最终全仓 Wake 测试 1,462 项通过，失败和待定均为 0；文档生成器 26 项通过。逐包浏览器巡检 159 项、状态与交互 287 项全部通过，两份记录使用同一生产产物指纹。四张最终截图已查看，复核明暗与品牌、窄屏、系统颜色和文字加倍后的布局。

- [逐包清单](inventory.json)：53 个工作区，记录公共角色消费、独立视觉是否适用、实际示例与检查数。
- [逐包浏览器巡检](browser-inventory.json)：每包默认示例及已有禁用、加载、错误、空、选中、组合示例的明暗渲染；默认示例为 320px 粗指针。此文件记录渲染与尺寸，不将它单独当作交互通过证据。
- [状态与交互](browser-states.json)：按钮状态配色及几何、局部旧变量覆盖、无主题 CSS 回退、品牌与中性表面、Select / Dialog 嵌套主题和焦点、系统颜色、粗指针、文字放大、Menu / Slider / Tree / Table 的交互路径。
- [命令验收](validation.json)：最终命令结果、测试数量和产物指纹。
- 截图：[明暗与品牌](themes-desktop.png)、[320px 触控](themes-touch-320.png)、[系统强制颜色](themes-forced-320.png)、[200% 文字](themes-text-200.png)。

浏览器记录包含对整个 docs-dist 的 SHA-256 指纹；巡检和交互必须对应同一指纹。使用独立 Chrome 临时配置，CDP 端口 9347，本地生产预览端口 4177。依次运行 `node .website/scripts/verify-md3-enterprise.mjs --inventory` 和 `node .website/scripts/verify-md3-enterprise.mjs`。

全仓验收使用 Corepack Yarn：`generate:token`、`check:tokens`、`build:library`、`lint`、`typecheck`、`test`、`docs:build`。另外运行文档 `check:docs`、`test:generator` 和 `check-visual-foundation.mjs`。生成文件均由命令刷新。

文字放大测试将浏览器已解析的字体、行高加倍，保留原容器尺寸，检查组件是否随内容增高；仅修改 html 字号不足以验证 px 字号。forced-colors / reduced-motion / 粗指针由 Chrome 媒体模拟，未替代实体触屏、系统读屏或用户研究。没有宣称完整 MD3 / WCAG 认证，也没有宣称优于 Material。

未新增 lint 告警。Turbo 的既有循环工作区依赖提示仍存在，本轮未改变依赖图；历史报告不计入本轮通过数量。
