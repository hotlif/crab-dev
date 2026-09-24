# 页面审查修复 · 2026-09-23

对应本目录 README 的五项发现。延续项目现有 M3 基线与已采用的 Expressive Button；本次没有切换全站设计版本，也未引入 Material Web 运行时。

## 修复范围

| 报告条目 | 实现 |
| --- | --- |
| 1. 首页标签 | 可见标签通过 `useId` / `aria-labelledby` 关联到主题、尺寸、品牌色、视图设置及表单控件；移除复合控件外层的嵌套 label。浏览器复测进一步发现 Select 将 `aria-labelledby` 留在包装层，已修正为透传至实际 combobox，并覆盖可搜索与不可搜索模式。 |
| 2. 搜索焦点 | 由搜索字段外层绘制唯一焦点轮廓，局部覆盖 LineEdit 根容器的重复轮廓；强制颜色样式使用 Highlight。 |
| 3. 嵌套 main | AppMainLayout 新增 `contentLandmark`：默认保留 main，嵌入模式为必须提供名称的 region。后台实战四步、布局教程两步使用该配置。独立工作台预览保留 main。 |
| 4. Tree FAQ | 更新 JSON 内容源，说明外部按钮用于演示受控状态，并补充树本身的键盘操作；通过生成命令更新页面。 |
| 5. 正文过晚出现 | 移除重复的“文档分区”；正文容器宽度 ≥ 960px 时目录置于侧边，较窄时默认折叠。缩小页头、插图和正文前间距。原生锚点、部署前缀、当前章节以及示例实例保持。 |

文档页不是 M3 的单个标准组件。目录的断点、插图尺寸和页头密度是本项目的信息布局决定。折叠入口复用已有文本按钮，以 `aria-expanded` / `aria-controls` 表达展开行为；图标与标签保持成组。页内链接保留链接语义，没有使用 Tabs 的外观或键盘模型。

同步修正 LayoutProps 的属性分隔，防止 Wake docgen 将属性合并为一条；API 文件由 `generate:docgen` 产生，未手改生成文件。

## 工程验证

- `corepack yarn workspace @crab-dev/rc-app-main-layout generate:docgen`：通过。
- `corepack yarn workspace @crab-dev/website generate:docs`：通过。
- 定向 Turbo `lint test typecheck build:library`（Select、AppMainLayout、website）：63 项成功，其中 48 项使用缓存。覆盖外部标签透传、布局组件默认 / 嵌入语义、首页命名、目录折叠、锚点与布局切换后的示例状态。[日志](./checks.log)
- `corepack yarn docs:build`：通过，63 条路由；文档生成无漂移；检查 1918 个生产 JavaScript 文件，未绑定引用为 0。[构建日志](./docs-build.log)
- `git -c core.safecrlf=false diff --check`：通过。

现有 Turbo 循环依赖告警仍涉及 rc-masonry、rc-menu、rc-spin、rc-button、rc-component-preview；本轮未改变依赖图，未新增告警。

## 浏览器验收

使用本地生产站点 `127.0.0.1:4177`。检查首页、Button、Tree、AppMainLayout、组件目录、三份指南、三份实战，共 11 个页面；覆盖浅色 / 深色与 320、390、768、1024、1440px 的相关场景。最终两处补修（Select 标签透传、SVG 高度）均使用重新构建的产物复测。

- 首页：主题、尺寸、品牌色、视图设置的 radiogroup 具备独立名称，选项名称保持“亮色”等原始文字；不存在嵌套 label。应用类型的真实 combobox 名称正确，Enter 展开选项，Escape 关闭；主题可通过方向键切换。
- 搜索：390px 深色下，外层 311px 宽的字段只绘制一条 2px 实线轮廓；内部 285px 根容器与 input 的 outline-style 均为 none。浅色复测同样只有一层。搜索 Button 正常返回结果，Escape 关闭并恢复焦点到搜索入口。
- 后台实战：第 1 / 4 步各只有一个站点 main，没有 main 后代；示例内容为“后台工作区示例”region。320px 下可打开成员管理、编辑姓名并保存。AppMainLayout 教程也没有嵌套 main。
- Tree：新版 FAQ 可见；第二步在树上按两次 ArrowDown 后 README.md 为选中状态，非禁用节点均为 `aria-disabled="false"`。
- 目录：Enter / Space 可展开，按钮有可见焦点；320px 下点击 API 后标题位于约 88px，低于 64px 顶栏。改变视口宽度时示例反馈仍保留，未重新挂载。
- 插图：窄屏 SVG 与容器均为 120px 高，桌面 SVG 为 192px、容器为 232px，完整显示。没有再出现缩小容器后 SVG 被裁切的问题。
- 页面检查未发现整页横向溢出，浏览器 error 日志为空。Wake 工具链在 320px 下的正文段落始于 307px；首个 h2 位于 1085px，因为其前面有正文与命令表，不能将这一段高度误算为导航占用。

Button 页基础示例标题距文档顶端的 CSS 像素位置（最终产物，视口高度 1000px）：

| 视口宽度 | 修复前 | 修复后 | 目录呈现 |
| --- | --- | --- | --- |
| 1440 | 1411 | 272 | 右侧目录，不占正文前方高度 |
| 1024 | 1227 | 456 | 48px 折叠入口 |
| 768 | 1280 | 520 | 48px 折叠入口 |
| 390 | 987 | 499 | 48px 折叠入口 |
| 320 | 986 | 533 | 48px 折叠入口 |

没有运行真实屏幕阅读器、OS 强制颜色模式、减少动态效果、软键盘或浏览器 200% 缩放；320px 回归不能代替缩放验证。本次是五项报告问题的修复验收，不是全站所有组件和状态的 M3 合规声明。

## 设计依据

访问日期：2026-09-23。Material Web 源码固定提交 `9200eb8a0eef99c6bd439ce3968952d76e9ec1b4`；它的基线文本按钮用于颜色、结构和原生行为对照，站点继续使用仓库已有的 Expressive Button 尺寸与状态实现。

- M3 Buttons：[使用指南](https://m3.material.io/components/buttons/guidelines)、[规格](https://m3.material.io/components/buttons/specs)、[无障碍](https://m3.material.io/components/buttons/accessibility)；Material Web [文档与实际示例](https://material-web.dev/components/button/)、[行为](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/button/internal/button.ts)、[文本按钮样式](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/button/internal/_text-button.scss)、[令牌](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tokens/_md-comp-text-button.scss)。
- M3 Text fields：[规格](https://m3.material.io/components/text-fields/specs)、[使用指南](https://m3.material.io/components/text-fields/guidelines)、[无障碍](https://m3.material.io/components/text-fields/accessibility)；Material Web [标签](https://material-web.dev/components/text-field/#labels)、[字段轮廓](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/field/internal/_outlined-field.scss)、[共享样式](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/textfield/internal/_shared.scss)。
- Web 语义补充：[Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)、[Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)、[Main landmark](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/main.html)。
- Select 标签透传另对照 Material Web [文档](https://material-web.dev/components/select/)、[combobox 行为](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/select/internal/select.ts)、[outlined 样式](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/select/internal/_outlined-select.scss)、[令牌](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tokens/_md-comp-outlined-select.scss)。官网单选示例不覆盖本项目的多选能力；本次只修复可访问名称的关联。
