# 数据与布局组件主题浏览器复核

本记录覆盖 macOS、Material Design 3、shadcn，使用本地生产预览进行浏览器复核。截图作为本地审查附件保存在仓库外，不纳入代码提交。

## 本轮确认并修复

- TablePro：搜索工具栏下方的弹性容器没有启用 flex 布局，导致 AutoSizer 和数据网格高度为 0。补充容器布局后实际网格高度为 399px，搜索“三体”后可跳转到第 2 / 12 个结果。
- BarChart：shadcn 深色模式下第 2 / 6、第 4 / 7、第 5 / 8 系列使用相同颜色；增加八系列演示，补齐后三个角色。后续复核发现 Material 深色模式第 1 / 7 系列也重复，调整第 7 系列。这些扩展只覆盖 L2 变量。
- FlowDiagram：ELK 演示使用原生浅色 select 和固定灰色标签，边线演示的图例文字也固定为浅色语境颜色。改为现有 Select 与语义文字、边框、画布表面角色。生产预览中方向切换能重新布局，三设计深色控件和焦点均可见。
- SplitPane：键盘焦点只有 20% 透明的柔和阴影，深色 shadcn 下难以辨认。新增引用已有 `color.focus.ring` 的 L3 轮廓颜色，提供 2px 实线焦点轮廓；保留高对比模式的系统 Highlight。

## 实际浏览器覆盖

| 包 | 三设计深色检查 | 交互证据 |
| --- | --- | --- |
| Table | 局部三设计并列，表头、行分隔、选中背景 | Space 切换行复选框，选中计数更新 |
| TablePro | 工具栏、表头、结果高亮、滚动区域 | 搜索“三体”，下一结果显示 2 / 12，网格高度 399px |
| BarChart | 八系列 DOM 颜色；发现并修复重复角色 | 图例隐藏系列后 16 根柱变 14 根；方向键逐柱定位 |
| Canvas | 网格、面板、Minimap 视口 | 已查看实际画布绘制；本轮未完整回归拖拽 API |
| FlowDiagram | 深色 Select、提示文字、网格、边线 | ELK 方向改为从上到下，布局重新计算 |
| PDFEditor | 工具栏、侧栏、绘图工具、只读灰化 | 切换只读；编辑动作禁用，页面与文档纸张保持正常 |
| ComponentPreview | 三设计卡片背景；独立浅色与深色代码背景 | 源码折叠后 aria-expanded=false、另一块保持展开 |
| Prose | 表格表头/边线/文字、定义列表、链接、引用、代码背景 | 三设计 computed style 确认语义颜色切换 |
| Masonry | 主题边界切换，shadcn 深色四列截图 | 列数 3→4，8 项重新布局 |
| Virtual | 三设计单元格颜色、可见双轴滚动条 | 纵向从第 0 行到第 35 行，横向从 a/b/c 到 d/e/f |
| SplitPane | 4px / 8px / 8px 命中轨道；shadcn 4×16px 握柄 | ArrowRight→224、End→400、Home→120、Enter→200 |
| Realm | 三设计错误态与重试控件 | 首次加载失败，点击重试后展示成功内容 |

浏览器截图在主题切换的同一调用内偶尔保留上一帧，因此实际主题判断同时使用根节点/演示边界与 computed style。最终截图应在稳定主题重新载入后保存；早期截图仅用于问题定位。

## 验证记录

本轮相关包：Theme `lint / test (20) / typecheck / build:library`；BarChart `lint / test (80) / typecheck`；TablePro `lint / test (21) / typecheck / build:library`；FlowDiagram `lint / test (9) / typecheck`；SplitPane `generate:token / lint / test (9) / typecheck / build:library`。共 139 项相关测试通过，所有最终命令通过且无新增 lint 告警。站点生产构建由主代理统一执行。

前一轮数据组件 12 包的最小必跑集合已通过，共 607 项测试；本轮只重跑受到新修改影响的包。

## 设计依据与边界

高级数据网格、工作台、画布和代码预览不均有 Material Web 直接对应实现。以 M3 List / Divider 的层级、表面和交互规则扩展；macOS 与 shadcn 是用户明确要求的独立主题映射，不宣称原生平台逐像素复刻。

- [M3 Lists specs](https://m3.material.io/components/lists/specs)、[accessibility](https://m3.material.io/components/lists/accessibility)
- [Material Web List](https://material-web.dev/components/list/)
- [Material Web list item styles](https://github.com/material-components/material-web/blob/main/list/internal/listitem/_list-item.scss)
- [Material Web list item tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-list-item.scss)
- [Material Web Focus ring 文档](https://github.com/material-components/material-web/blob/main/docs/components/focus-ring.md)、[焦点轮廓样式](https://github.com/material-components/material-web/blob/main/focus/internal/_focus-ring.scss)
- [Apple Lists and tables](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables)
- [shadcn Chart](https://ui.shadcn.com/docs/components/chart)、[official customization](https://github.com/shadcn-ui/ui/blob/main/skills/shadcn/customization.md)
- [shadcn Resizable](https://ui.shadcn.com/docs/components/resizable)

shadcn 官方提供五个图表角色；本库有八个系列，后三个属于项目扩展，保留图例与逐柱数据名称辅助辨识。
