---
"@crab-dev/rc-tree": patch
"@crab-dev/rc-table": patch
---

Keep nested tree checkboxes and editors in control of their own keyboard events while retaining arrow navigation from node actions. Let table editors consume their own keys before grid navigation or row activation, preserving native action activation, combobox selection and input-method drafts. Recover grid focus when a cell editor is removed without another focus destination, including iframe tables. Give coarse-pointer table selection columns a 48px minimum hit area, consistent with row expansion controls.
