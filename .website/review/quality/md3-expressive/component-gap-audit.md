# MD3 / M3 Expressive 组件差距复核

初查日期：2026-09-20。实施复核：2026-09-21。范围：本轮识别出的六项结构性差距，以及对应组件源码、文档示例和生产页面。

本记录证明下表中的已确认差距已经实施和复验，不代表所有业务组件、全部状态组合或第三方认证均已完成。表格、图表、树和业务选择器等非一一映射的组件，仍应按表面、排版、状态、焦点和操作目标逐项审查。

## 判断依据

- [Material Text field](https://material-web.dev/components/text-field/)：Filled / Outlined、字段标签、辅助与错误信息。
- [Material Select](https://material-web.dev/components/select/)：Filled / Outlined 字段及关联标签、辅助和错误信息。
- [Material Chips](https://material-web.dev/components/chip/)：Filter chip 使用选中标记、容器色和完整交互状态。
- [Material Time pickers](https://m3.material.io/components/time-pickers/) 与 [官方实现说明](https://developer.android.com/develop/ui/compose/components/time-pickers)：拨盘和时间输入是主要形式。
- [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive) 与 [官方 LoadingIndicator](https://developer.android.com/reference/kotlin/androidx/compose/material3/LoadingIndicator.composable)：可用形状变化表达更醒目的持续加载反馈。

## 实施状态

| 优先级 | 组件 | 已实施结果 | 复验证据 |
| --- | --- | --- | --- |
| 高 | NumberEdit | 微型竖排按钮改为两个独立的 48px 加减操作；保留 spinbutton 方向键、大步进、边界禁用和长按路径，并补充 `aria-controls`。基础示例使用 Filled 字段、可见标签和辅助说明。 | 生产页确认标签、辅助说明、可聚焦加减按钮；点击“增加”后值从 2 更新为 3。 |
| 高 | TextEdit | 新增 `outlined` / `filled`、浮动标签、辅助文字、错误文字与下方计数信息区；自动建立 `aria-describedby`。Filled 标签使用独立位置令牌，避免与正文重叠。 | 生产页确认可见标签与辅助说明；输入后检查标签布局和焦点状态。 |
| 高 | Select | 新增 `appearance`、`label`、`supportingText`、`errorText`、`required`；清除操作提供 48px 目标，错误文字覆盖辅助文字并建立无障碍关联。 | 生产页确认 Filled 标签、辅助说明和下拉菜单；combobox 展开状态与选项可访问。 |
| 高 | TimePicker | 三列点击列表替换为小时、分钟、秒三个 Material Filled 数字字段；键盘方向键直接调整数值，24 小时范围明确，秒标注为企业扩展。触发输入复用 LineEdit 的字段和清除能力。 | 工作台确认三个 spinbutton 和企业扩展说明；小时字段按 ArrowUp 后值从 6 更新为 7。 |
| 中 | CheckableTag | 按 Filter chip 设计加入选中勾选、secondary container、hover / focus / active 状态层、禁用语义和命名 toolbar。 | 工作台确认选中项同时呈现勾选与容器色；选择 Books 后 checkbox 状态和结果文字同步更新。 |
| 中 | Spin | 保留紧凑场景的默认 Circular，并新增 `variant="expressive"` 形变加载指示器及纯视觉导出；支持 reduced-motion、forced-colors 和语义化 Expressive 缓动令牌。 | 工作台同时呈现 Expressive 与 Circular；两个指示器的加载状态名称可访问。 |

## 验证记录

- 48 个令牌包通过 L1 / L2 / L3 契约检查；本轮新增尺寸、状态和形状令牌均使用规范 CSS 属性命名。
- 全仓 `turbo run lint test typecheck build:library --concurrency=4 --output-logs=errors-only`：216 / 216 个任务通过。
- 文档生成一致性：53 个组件页、56 份教程、126 个教学示例、251 个唯一 Demo，0 个生成差异。
- 生产文档构建：62 个路由、2555 个文件；1893 个生产 JavaScript 文件检查为 0 个未绑定引用。
- 浏览器复验覆盖 NumberEdit、Select、TextEdit、TimePickerPanel、CheckableTag 和 Spin Expressive 的主要外观与关键交互。

本轮没有在真实粗指针设备、forced-colors 系统模式、200% 文字缩放和所有品牌主题中逐项复验；对应源码分支由整仓测试和构建覆盖，仍需在目标系统环境进行人工验收。
