---
"@crab-dev/rc-line-edit": patch
"@crab-dev/rc-checkbox": patch
"@crab-dev/rc-radio": patch
"@crab-dev/rc-switch": patch
---

LineEdit 的 MD3 带标签描边字段采用 56px 浮动标签，macOS 与 shadcn 的标签与输入框同排。点击字段留白可聚焦输入，单独使用 showCount 时组合字符计为一个字符。

Checkbox 在受控值未更新时保留原生半选状态。禁用 CheckboxGroup 或 RadioGroup 会禁用所有子项。Checkbox、Radio 和 Switch 的禁用说明使用可读的次级文字色。带标签的 Switch 将开关放在设置行末端，使用 aria-disabled 等待保存时保留焦点并阻止重复切换。
