---
"@crab-dev/rc-button": patch
"@crab-dev/rc-color-picker": patch
"@crab-dev/rc-cron-picker": patch
"@crab-dev/rc-date-picker": patch
"@crab-dev/rc-dialog": patch
"@crab-dev/rc-form": patch
"@crab-dev/rc-line-edit": patch
"@crab-dev/rc-number-edit": patch
"@crab-dev/rc-select": patch
"@crab-dev/rc-switch": patch
"@crab-dev/rc-table": patch
"@crab-dev/rc-tabs": patch
"@crab-dev/rc-text-edit": patch
"@crab-dev/rc-theme": patch
"@crab-dev/rc-token-semantic": minor
---

MD3 默认采用紧凑桌面几何与上置标签：继承尺寸的按钮为 32/36/40px，单行字段为 32/40/48px，Tab 为 32/36/40px。显式 Button Expressive 五档保持不变；多行内容仍由 rows/autoSize 决定高度，触控目标至少 48px，并在粗指针布局中预留空间以避免相邻操作重叠。

修正三主题字段标签宽度和 MD3 桌面 Switch 留白。公共 props、值与事件语义保持一致；依赖旧浮动标签、轮廓缺口或固定高度的自定义 CSS 需按迁移指南调整。
