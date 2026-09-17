# 常用组件状态切换的布局检查

日期：2026-09-18。生产文档 http://127.0.0.1:4175，Wake / Crab CSS 0.1.45。

本次在 Radio 基线修复后检查其他组件；只记录发现，未修改这些组件的实现。通过浏览器实际操作及 `getBoundingClientRect()` 比较状态前后尺寸，并结合源码定位原因。以下不是全库所有 Props 组合的验收结论。

## 已确认的组件问题

| 组件与条件 | 实测变化 | 原因与影响 |
| --- | --- | --- |
| Button，无前置图标、文案不变，默认与 loading 对照 | primary/text/link/danger 为 52 → 74px；subtle/dashed 为 54 → 76px；高度始终 32px | `renderLeadingIcon()` 在 loading 时新增 spinner，原状态不占位；14px 图标加 8px 间距增加 22px 宽度。自动宽度的操作按钮会挤动相邻按钮。明暗状态矩阵结果一致。 |
| LineEdit，middle、allowClear，空值输入“测试” | 外框高度 32 → 34px，宽度保持 239px；输入区域宽度 213 → 181px | 清除按钮出现后，其 24px 高度加上下 padding 共 8px 及两侧边框共 2px，将只有 `min-height: 32px` 的容器撑至 34px。输入区域因新增操作按钮而缩窄。 |
| Select，loading 演示，未约束宽度，加载结束且 placeholder 不变 | 外框宽度 152 → 130px，高度保持 32px | spinner 是额外的 Flex 子项，包含 14px 图标及 8px 左间距；它与箭头同时存在，移除时自动宽度减少 22px。明确固定宽度的场景不一定表现为外框变宽。 |

Button 使用文档「状态与明暗主题」同文案对照，未将含文案变化的异步提交当作测量依据。LineEdit 与 Select 均测量同一个运行中实例的前后状态。

源码入口：

- `components/rc-button/src/button.tsx`：`renderLoadingIcon()` / `renderLeadingIcon()`。
- `components/rc-line-edit/src/lineEdit.tsx`：`sizeContainerStyles` / `actionButtonStyle` / `showClearButton`；`token.toml` 的 `action.height` 与 `size.middle.padding`。
- `components/rc-select/src/selectInput.tsx`：`loadingIconStyle` 与尾部 loading / suffix 渲染。

## 本次未复现的状态变化

- Switch 基础示例 false → true：轨道 44×22px，外层 76×22px，坐标和尺寸变化均为 0px。
- CheckableTag 选择 Books：四个标签的坐标和尺寸变化均为 0px；不把下方“已选择”文案的正常内容变化计作缺陷。
- Segmented 日 → 周：外层 120×38px，各选项 38×32px，坐标和尺寸变化均为 0px；滑块移动是预期反馈。

## Tabs 演示的容器移动

基础示例从“概览”切到“日志”时，三个页签均保持 60×40px，相对间距不变；但内容文案长度改变，未约束宽度的整体从 255px 缩至 240px。在演示居中容器内，各页签随整体向右移动 7.5px。

这与 Radio 的选中标记改变基线不同，属于内容决定容器宽度与居中布局叠加的结果。修复方向应是为此类文档示例提供稳定、响应式的可用宽度，不能用修改选中页签边框来解决。

## 建议修复顺序

1. LineEdit：使内嵌操作区与尺寸、padding 策略一致，清除按钮出现不能撑高控件，同时保留可用点击区域。
2. Button：确定 loading 占位规则，保证同文案在默认图标、无图标及自定义 loading 图标之间切换时几何稳定。
3. Select：让 loading 与后缀指示器复用稳定的操作区，避免额外图标反复改变固有宽度。
4. Tabs 文档：补足内容容器宽度约束，保留窄屏适配。

以上三个组件问题均属于状态切换造成几何变化，具体原因不同于已修复的 Radio 基线问题。本轮没有修改实现，因此未重复运行组件构建及单元测试。
