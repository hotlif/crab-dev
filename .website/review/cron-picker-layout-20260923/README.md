# CronPicker 布局调整

核对日期：2026-09-23。范围：`@crab-dev/rc-cron-picker`，Web，延续项目现有 M3 主题。

## 改动与依据

- Cron 规则编辑器不是 M3 的独立标准组件。本次组合已有 Primary Tabs、Outlined Select / Text Field 和多选 Filter Chip 能力，不引入第三方 UI 实现。
- 原来的四种模式同时展示输入项，76px 数字框容不下步进按钮，数字被挤掉。现在通过有可见标签的 Select 选择设置方式，只渲染当前模式的参数；NumberEdit 关闭步进按钮，保留数字输入、上下键和范围约束。
- 网格按可用宽度重排，独立滚动；展示已选数量，32px chip 的命中区向上下扩展到 48px，并留出不重叠的行距。沿用 CheckableTag 的勾选、状态层和主题配色。
- 中文规则说明优先展示，表达式可选中复制，执行预览将日期和时刻分列，并明确是本地时间。
- 下拉容器负责可用高度与整体滚动；内容宽度同时受视口和父容器限制，避免竖向滚动条挤出横向滚动。320px 下数字参数自动变为单列。
- 指定模式以一个合法值开始，至少保留一项，避免空列表被格式化为 `*` 后意外提高执行频率。纯函数的空列表语义和公开 API 保持原有约定。
- Escape 先关闭展开的子菜单，之后关闭编辑面板并恢复表达式输入框焦点。

网格的行列数、256px 滚动高度和执行预览层级是本项目针对 Cron 数值域的设计决定，不是 M3 定义的 CronPicker 规格。复用组件仍保留项目现有实现差异，例如 CheckableTag 使用 checkbox 语义与逐项 Tab，Material Web filter chip 使用 button / aria-pressed 和 chip-set 导航；本次没有声称完成所有基础组件的规范审计。

## 实际参考

- 单选方式取舍：[M3 Radio guidelines](https://m3.material.io/components/radio-button/guidelines)；空间有限时可使用下拉菜单。
- 文本框：[Guidelines](https://m3.material.io/components/text-fields/guidelines)、[Specs](https://m3.material.io/components/text-fields/specs)、[Accessibility](https://m3.material.io/components/text-fields/accessibility)。
- 多选标签：[Guidelines](https://m3.material.io/components/chips/guidelines)、[Specs](https://m3.material.io/components/chips/specs)、[Accessibility](https://m3.material.io/components/chips/accessibility)。
- 标签页：[Guidelines](https://m3.material.io/components/tabs/guidelines)、[Specs](https://m3.material.io/components/tabs/specs)、[Accessibility](https://m3.material.io/components/tabs/accessibility)。
- Material Web 文档与示例：[Select](https://material-web.dev/components/select/)、[Text field](https://material-web.dev/components/text-field/)、[Chips](https://material-web.dev/components/chip/)、[Tabs](https://material-web.dev/components/tabs/)。
- Select 源码：[行为](https://github.com/material-components/material-web/blob/main/select/internal/select.ts)、[样式](https://github.com/material-components/material-web/blob/main/select/internal/_outlined-select.scss)、[令牌](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-outlined-select.scss)。
- Text field 源码：[行为](https://github.com/material-components/material-web/blob/main/textfield/internal/text-field.ts)、[样式](https://github.com/material-components/material-web/blob/main/textfield/internal/_outlined-text-field.scss)、[令牌](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-outlined-text-field.scss)。
- Filter chip 源码：[行为](https://github.com/material-components/material-web/blob/main/chips/internal/filter-chip.ts)、[样式](https://github.com/material-components/material-web/blob/main/chips/internal/_filter-chip.scss)、[令牌](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-filter-chip.scss)。
- Tabs 源码：[行为](https://github.com/material-components/material-web/blob/main/tabs/internal/tabs.ts)、[样式](https://github.com/material-components/material-web/blob/main/tabs/internal/_primary-tab.scss)、[令牌](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-primary-tab.scss)。以上实现源码为访问当日 main，令牌入口引用 v0_192 基线；本次不迁移为另一套 Expressive 变体。

## 验证

- 包内 `generate:token`、`build:library`、`lint`、`typecheck` 通过；Lint 0 errors / 0 warnings。
- `yarn test`：2 suites，39 tests 全部通过；覆盖模式切换、仅显示当前参数、多选、最后一项保护、区间边界、星期选项、Escape 分层关闭和焦点恢复。
- 浏览器桌面浅色、深色实际查看；输入起点 10、间隔 15 后得到 `10/15 9 * * *`，预览为 09:10、09:25、09:40。
- 通过临时本地 iframe 验证 390px、320px 实际内容视口（浏览器视口覆盖接口未生效，未将其作为有效验证）。最终内容宽度分别为 342px、272px；外层 `scrollWidth === clientWidth`，无横向滚动；320px 参数单列。该检查验证布局，不等价于真实触屏设备验证。
- 重启文档开发服务刷新组件依赖缓存；文档生成没有额外文件变化。
