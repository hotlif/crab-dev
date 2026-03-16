# rc-date-picker TODO

## Feature

### P1 — 核心体验

- [ ] **disabled 禁用状态** — DatePicker 组件支持 `disabled` prop，整体不可打开、不可交互。
- [ ] **placeholder 占位文本** — 支持 `placeholder` prop，无值时显示提示文字（如 "请选择日期"）。
- [ ] **"今天" 快捷按钮** — 在面板底部操作栏添加 "今天" 按钮，快速跳转并选中当天日期。
- [ ] **键盘导航** — 支持方向键在日历格子间导航，Enter 选中，Esc 关闭弹窗。
- [ ] **取消/确定按钮国际化** — `overlay.tsx` 中按钮文案 "取消" / "确定" 写死中文，应根据 `locale` 动态切换。

### P2 — 功能完善

- [ ] **value 可选** — 支持 `value?: Temporal.ZonedDateTime`，允许无初始值场景，配合 placeholder 使用。
- [ ] **清除按钮** — 允许用户清空已选日期（搭配 value 可选）。
- [ ] **月份/年份快速选择视图** — 点击头部年月标题进入月份列表或年份列表，避免逐月翻页。
- [ ] **受控 viewDate** — 暴露 `viewDate` / `onViewDateChange` prop，允许外部控制当前面板显示的年月。

### P3 — 规范与质量

- [ ] **ARIA 无障碍** — 为日历 table 添加 `role="grid"`，日期 cell 添加 `aria-selected`、`aria-disabled`，导航按钮添加 `aria-label`。
- [ ] **单元测试** — 补充 Jest 测试用例，覆盖日历矩阵生成、range 禁用逻辑、导航边界。
- [ ] **Demo 命名规范** — 所有 demo 组件命名为 `SizeDemo`，应改为各自有意义的名称（如 `BaseDemo`、`RangeDemo`）。
