# 统一尺寸实现与验证

日期：2026-09-24。接续同目录的只读审查；保留检查前已有工作区改动。

## 使用方式

使用 `ConfigProvider size="small" | "middle" | "large"` 选择紧凑、标准、宽松档。默认仍为 middle，组件显式 size 和分组配置继续优先，嵌套 Provider 可以恢复标准尺寸。

可运行对照：[统一尺寸与密度](http://127.0.0.1:5173/guides/component-sizing)。源码：[交互示例](../../docs/site/sizeShowcase.tsx)、[使用指南](../../docs/guides/component-sizing.mdx)。

## 实现

- L2 `sizing.small / middle / large` 集中定义控件、字段、操作区、导航、选项、间距与内边距；L3 引用对应角色。`ConfigProvider` 在每个边界重新声明密度变量，不改根字号或页面 zoom。
- 输入、选择、数字、Cron、卡片、头像、Checkbox / Radio、Segmented、Pagination、Tabs、Tag、Switch、Spin、Skeleton、ColorPicker、Drawer 接入全局尺寸。日期时间输入通过 LineEdit 继承。Button / ButtonGroup 原有接入保持兼容。
- Table / TablePro、Tree 增加 size，虚拟行几何与渲染行高一起变化。显式节点/数据行高度、回调、表头、筛选和汇总高度优先。粗指针下默认交互行至少 48px。
- Menu、Form 消费导航高度和行间距。DropdownContainer 在 Portal 节点声明尺寸边界，Select / ColorPicker / CronPicker 的显式尺寸也传到浮层。
- 输入框的清除、密码切换、数字步进按钮使用对应操作区尺寸；粗指针下保留 48px 目标。TextEdit 清除按钮存在时保证容器能容纳操作区域。
- medium 旧名称在 Tabs、Pagination、Skeleton、ColorPicker、Drawer 中保留，同时接受 middle。
- 文档导航轨道由 88 改为 80px，展开侧栏由 320 改为 280px；小于 1280px 使用移动导航。右侧章节目录要求内容区至少 1200px；标题和章节留白改用较小的现有 M3 字阶与间距。

## 浏览器实测

Chrome，1366×768 CSS px，细指针。输入字号仍为 16px。

| 项目 | small | middle | large |
| --- | --- | --- | --- |
| 按钮 | 32 | 40 | 56 |
| 单行输入 / 选择器 | 48 | 56 | 64 |
| 表格数据行 | 40 | 52 | 60 |
| 分页 | 32 | 40 | 48 |
| 示例纵向间距 | 8 | 12 | 16 |
| 显式 large 按钮 | 56 | 56 | 56 |
| 嵌套 middle 按钮 | 40 | 40 | 40 |

small 下另测：LineEdit 清除、Select 清除、NumberEdit 步进按钮均为 32px；Tabs 40px，Menu 44px，下拉选项 40px。

以 2560、1920、1536、1440、1366、1280、1024、960、768、390px 宽访问同一组合页，未出现页面级横向溢出。390px 额外检查 large 档，同样无页面级溢出。表格保留内部横向滚动；这是视口测试，不代表真实触屏设备测试。

1024px 下导航收起，主内容区宽度实测 1009px；原审查时为 601px。1366px 下主内容区为 991px；原为 943px。边栏与目录断点按可用空间处理，密度档位由用户显式选择。

## 范围与设计依据

三档是应用层尺寸映射，不是所有组件的等比例缩放，也不是 M3 为每个组件规定的统一三档。Switch 保留标准轨道；Badge 的 large 使用 default；Slider 保留自己的 Expressive 尺寸系列。Prose 保留阅读字阶，反馈、弹层和画布等宿主容器保留各自的尺寸规则。未改动 FlowDiagram 的默认画布宽高、PDF 编辑器面板宽度或 AppMainLayout 的容器响应策略；原审查中相关问题仍可独立处理。

实际参考：

- [M3 密度](https://m3.material.io/foundations/layout/grids-spacing/density)：显式选择、4px 步进、保留文字大小与触控目标。
- [M3 文本字段规格](https://m3.material.io/components/text-fields/specs)、[Material Web 字段示例与无障碍说明](https://material-web.dev/components/text-field/)、[字段样式实现](https://github.com/material-components/material-web/blob/main/field/internal/_shared.scss)。
- [Material Web 按钮文档](https://material-web.dev/components/button/)、[按钮默认尺寸令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-filled-button.scss)、[按钮布局实现](https://github.com/material-components/material-web/blob/main/button/internal/_shared.scss)。
- [Material Web Tabs 文档](https://material-web.dev/components/tabs/)、[Tabs 令牌接口](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-primary-tab.scss)。
- [Material Web List 文档](https://material-web.dev/components/list/)、[列表项令牌接口](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-list-item.scss)。

以上用于本次尺寸和密度对照，不将 Material Web 的稳定 M3 实现与 Expressive 规格混同，也不声称完成全库所有状态的 M3 合规验收。

## 工程验证

- Yarn PnP immutable 安装、令牌生成和全部 54 个库构建通过。
- 全仓类型检查通过（110 个 Turbo 任务）。
- 受影响组件的 lint / Wake 测试通过；新增继承与覆盖、虚拟行几何更新、粗指针、Portal 尺寸测试。
- 文档站 lint 为 0 errors / 0 warnings；10 个测试套件、63 项测试全部通过。目录断点测试覆盖 1199 / 1200px，并检查未提交输入和组件实例保留。
- 最终文档站生产构建通过（64 条路由）；检查 1926 个生产 JavaScript 文件，未发现未绑定引用。
- 安装仍提示 commitlint 的既有 TypeScript / @types/node peer 依赖；Turbo 仍提示既有循环依赖组，均不涉及新增 ConfigProvider 依赖环。原有工具链提示未作为本任务的无关修复。

验证日志：[文档站回归](./website-final-sizing.log)、[全仓类型检查](./typecheck-final-sizing.log)、[生产构建与绑定检查](./docs-build-final-sizing.log)。
