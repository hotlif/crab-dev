---
"@crab-dev/rc-token-semantic": patch
"@crab-dev/rc-theme": patch
"@crab-dev/rc-tabs": patch
"@crab-dev/rc-segmented": patch
"@crab-dev/rc-checkbox": patch
"@crab-dev/rc-radio": patch
"@crab-dev/rc-card": patch
"@crab-dev/rc-tag": patch
"@crab-dev/rc-select": patch
"@crab-dev/rc-number-edit": patch
"@crab-dev/rc-alert": patch
"@crab-dev/rc-app-main-layout": patch
"@crab-dev/rc-date-picker": patch
"@crab-dev/rc-dialog": patch
"@crab-dev/rc-pdf-editor": patch
"@crab-dev/rc-table": patch
---

继续修正 macOS Tahoe 26 控件独立设计：移除 Tabs、Segmented、Checkbox、Radio、Card 和可选标签残留的 Material 状态遮罩、光圈与形变；补充桌面选择边缘、上下数字步进器、单选菜单前置勾选与活动行、浮动侧栏和分组玻璃工具栏。工作区账户及标签页菜单应用独立玻璃材质；内联 Alert 保持中性正文，Dialog 和日期时间浮层使用桌面主次操作，PDF 缩略图以边框标记选中。

深色主操作与实色状态使用饱和底色配白字；今天日期、排序序号与站点强调文字使用独立文字颜色角色。各设计边界实际应用自己的字体，避免字段、菜单或 Tabs 继承浏览器默认衬线字体。

macOS TimePicker 默认使用数字输入；需要旧表盘扩展时显式传入 `panelProps={{ defaultMode: 'dial' }}`。已进入编辑的模式、焦点及未完成输入在切换设计体系时保持。

修复 Tabs 默认只保留面板容器、却卸载其内容的问题。工程工作台切换任务后保留未保存的编辑草稿；显式开启 `destroyInactiveTabPane` 时仍销毁内容。
