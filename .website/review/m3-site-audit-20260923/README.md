# 文档站页面审查 · 2026-09-23

后续修复与验收记录见 [FIXES.md](./FIXES.md)。下文保留修复前的审查证据与测量结果。

本轮为问题审查，仅新增报告，没有修改站点或组件实现。依据现有 M3 基线审查站点外壳与页面组合，保留既有 Expressive 组件；没有把整个站点判定为某个单一 M3 官方组件。

浏览器使用上一轮通过构建检查的本地生产产物（127.0.0.1:4177），并与当前源码交叉核对。检查首页、Button、Tree、组件目录、三份指南和三份实战，共 10 个页面；覆盖浅色/深色及部分 320、390、768、1024、1440px 宽度。没有穷举所有页面与状态，也没有运行真实屏幕阅读器。

## 确认的问题

### 1. P2：首页控件标签没有正确关联

- 位置：`.website/docs/site/homeComponentShowcase.tsx:76`、`:85`、`:94`、`:125`、`:238`。
- 复现：首页的“应用类型”在浏览器语义树中是未命名的 combobox；主题、尺寸、品牌色、视图设置的 radiogroup 也没有组名。第一项单选框的名称分别被拼为“主题 亮色 暗色”“尺寸 小 中 大”“品牌色 紫罗兰 葡萄紫 靛青”。
- 原因：外层 `<label>` 包住内部已经使用 label 的整个 Segmented；Select 的焦点入口是 div，外层 label 也不能自动为它命名。视图设置只依赖 Card 标题，没有关联到分组。
- 影响：通过辅助技术进入控件时无法可靠区分各组的用途，选项名称也混入整组文字。这不是组件本身缺少 label API，而是站点示例没有正确使用。
- 建议：去掉包裹复合控件的 label，采用可见标题 + `useId` + `aria-labelledby`；组名放在 radiogroup，选项保留自己的名称。Select 显式关联“应用类型”。
- 依据：[M3 Text fields accessibility](https://m3.material.io/components/text-fields/accessibility)、[Material Web 外部标签示例](https://material-web.dev/components/text-field/#labels)、[WAI-ARIA Radio Group 命名](https://www.w3.org/WAI/ARIA/apg/patterns/radio/#wai-ariaroles,states,andproperties)。

### 2. P2：全站搜索框有两层重叠焦点轮廓

- 位置：`.website/docs/site/siteStyles.ts:191–195`；`.website/docs/site/ui.tsx:371` 附近的搜索字段组合。
- 复现：390px 深色视口打开“搜索文档”，输入框自动聚焦。实际外层 label 和内部 LineEdit 根 div 都绘制 2px 实线 outline；两者宽度分别为 311px 和 285px，产生重叠的矩形边框。
- 原因：站点为 `.crab-docs-search-field:focus-within` 添加轮廓，却只移除了 input 本身的 outline；LineEdit 的轮廓由根容器 `:has(input:focus-visible)` 绘制，仍然存在。
- 影响：焦点边界不清晰，破坏单一字段的视觉结构；与代码中“host provides the single focus ring”的意图不符。
- 建议：明确由 LineEdit 或外层容器中的一方提供焦点轮廓；继续保留键盘和强制颜色模式的可见焦点，不能简单全局清除 outline。
- 依据：[M3 Text fields specs](https://m3.material.io/components/text-fields/specs)、[Guidelines](https://m3.material.io/components/text-fields/guidelines)；Material Web [textfield 共享样式](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/textfield/internal/_shared.scss) 与 [outlined field 状态轮廓](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/field/internal/_outlined-field.scss)。

### 3. P2：后台实战嵌套两个未命名的 main 地标

- 位置：`.website/docs/examples/practice-admin/step-1.tsx:38`；同类组合见后续步骤。宿主直接渲染预览：`.website/docs/site/liveExample.tsx:131`；内部 main 来源：`components/rc-app-main-layout/src/content.tsx:18`。
- 复现：打开“实战：后台管理页面”，页面语义树同时出现站点 main 和运行示例内的 main。两个元素均没有 aria-label / aria-labelledby，也没有独立 document/application 边界；内层 main 是外层 main 的后代。
- 影响：地标导航无法清楚区分“文档正文”和“示例应用正文”。单独运行 AppMainLayout 时 main 合理，嵌入文档后需要重新处理边界。
- 建议：完整应用示例使用独立 iframe 文档，或提供明确的嵌入模式，使示例内容采用有名称的 region；不要直接把所有 main 改成 div，影响独立应用语义。
- 依据：[WAI-ARIA Main landmark](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/main.html)。这是 Web 语义补充，不是 M3 视觉数值要求。

### 4. P2：Tree FAQ 仍描述已经修复的无障碍问题

- 内容源：`.website/content/rc-tree.json:40`；当前生成页显示于 `.website/docs/components/rc-tree.mdx:54`。
- 复现：FAQ 写着“未启用拖拽时仍带有 aria-disabled”“键盘语义仍需后续修复”。而同页下方的组件说明写着“关闭拖拽不会禁用节点选择”。
- 实测：第二步教程中，非禁用节点均为 `aria-disabled="false"`；在树上按两次 ArrowDown 后 README.md 成为 `aria-selected="true"`。源码也按 `node.disabled === true` 设置禁用状态。
- 影响：同页给出相互矛盾的能力说明，容易让使用者继续采用已经不必要的绕行交互。
- 建议：更新 JSON 内容源，说明外部按钮仅演示受控状态，同时保留节点本身的键盘练习；运行文档生成命令，不手改生成页。

## 设计优化项

### 5. 重复导航和大幅示意图推迟了正文与真实示例

- 位置：`.website/docs/site/documentNavigation.tsx:95–121`、`.website/docs/site/documentStyles.ts:62–78`。
- 结构：组件标题与大幅示意图 → 吸顶的“概览/使用指南/API/更多示例” → 完整“本页内容”目录 → 基础示例。正文容器不足 1200px 时目录统一前置，因此常见 1440px 桌面也受影响。
- Button 页面实测（从文档顶端计，单位 CSS px）：

| 视口宽度 | 正文容器宽度 | 前置目录高度 | 基础示例标题位置 |
| --- | --- | --- | --- |
| 1440 | 1097 | 364 | 1411 |
| 1024 | 681 | 364 | 1227 |
| 768 | 753 | 364 | 1280 |
| 390 | 375 | 364 | 987 |
| 320 | 305 | 364 | 986 |

- 同类问题也影响指南：320px 下 Wake 工具链的首个正文 h2 在约 1249px 处。
- 建议：窄屏将完整目录折叠为一个入口；普通桌面把目录移到侧边或允许展开；缩小组件示意图，让真实示例更早出现。页内锚点保留轻量目录语义；若采用 Tabs，应同时实现对应内容与键盘模型，不只换外观。
- 依据：[M3 导航层级指南](https://m3.material.io/components/navigation-bar/guidelines) 区分页面目的地和页内相关内容，[Material Web Tabs](https://material-web.dev/components/tabs/) 提供后者的实际行为参考。这里的首屏密度评价是基于当前站点任务和测量的设计判断；M3 没有规定“第一示例必须在某个像素位置”。

## 本轮未复现的问题

- 七个目录/指南/实战入口在 320px 宽度下，页面 scrollWidth 为 305px，未出现整页横向溢出。Button 在五档宽度下也未溢出。
- 手机导航选择 Button 后关闭抽屉，焦点返回页面 h1。
- Button 页点击 API，标题位于视口约 168px，吸顶分区导航底部为 128px，未遮挡标题。
- 主题可切换；搜索可用 Escape 关闭；320px 后台实战可进入成员管理并打开编辑抽屉。
- 本轮访问页面的浏览器 error 日志为空。这不代表所有延迟加载示例都已验证。

未新增实现或测试，也未重复运行全仓构建。前次工程验证仍见 `../m3-audit-20260922/verification.json`；不能把前次通过记录当成本轮新增问题已解决的证据。真实屏幕阅读器、OS 强制颜色、减少动态、软键盘和真实浏览器 200% 缩放仍未运行。

实际参考访问日期为 2026-09-23；Material Web 源码固定提交为 `9200eb8a0eef99c6bd439ce3968952d76e9ec1b4`。规范页通过可渲染浏览器读取，补充文档与源码仅用于对应条目，没有据此声明全站符合 M3。
