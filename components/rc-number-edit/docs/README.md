+++
title = "NumberEdit"
index = true
+++


# NumberEdit

数字输入框，支持步进、范围钳制、千分位与科学计数法自适应显示。


## 何时使用

需要用户输入数值时使用。相比原生 `<input type="number">`，它提供受控的步进
（+/- 按钮、键盘 ↑↓、长按连续加速、Shift/PageUp 大步长）、失焦范围钳制、千分位与
自定义格式化，并在**数值大到 / 小到不好用十进制显示时，自动切换为上标科学计数法**
（`1.23×10²¹`）——聚焦编辑时又展开为可直接键入的 `e` 记法。


## 代码演示

<Demos path="/docs/demos" columns={1} density="compact" />
