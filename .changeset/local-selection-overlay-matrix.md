---
"@crab-dev/rc-select": patch
"@crab-dev/rc-color-picker": patch
"@crab-dev/rc-dialog": patch
"@crab-dev/rc-drawer": patch
"@crab-dev/rc-dropdown-container": patch
"@crab-dev/rc-tooltip": patch
"@crab-dev/rc-menu": patch
---

补齐选择、导航和浮层的三体系规格、公开示例与包内 Playwright 状态矩阵，覆盖真实键盘、Portal 配置与草稿保留。颜色面板的轨道、宽度与操作间距归入组件令牌，窄屏操作区支持换行，强制颜色下保留清晰的触发器焦点边界。

恢复颜色选择器公开的 showEyeDropper 屏幕取色入口，按所属浏览器能力显示，取消或拒绝不改值，卸载中止原生取色会话。

补充水平与折叠菜单真实展开、Dialog 确认/取消 pending 动态场景，以及 Drawer 包公开的 iframe/Shadow DOM 组合示例；分别记录共享底层回归与真实浏览器验收范围，保留未运行、未复审部分。
