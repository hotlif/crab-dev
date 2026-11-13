---
"@crab-dev/rc-token-semantic": major
"@crab-dev/rc-config-provider": major
"@crab-dev/rc-theme": major
"@crab-dev/rc-token-global": minor
"@crab-dev/rc-app-main-layout": patch
"@crab-dev/rc-switch": patch
"@crab-dev/rc-slider": patch
"@crab-dev/rc-menu": patch
"@crab-dev/rc-button": patch
"@crab-dev/rc-dialog": patch
"@crab-dev/rc-drawer": patch
"@crab-dev/rc-dropdown-container": patch
"@crab-dev/rc-message": patch
"@crab-dev/rc-notification": patch
"@crab-dev/rc-tooltip": patch
---

将 apple 设计体系更名为 macos，并固定以 macOS Tahoe 26 Liquid Glass 为基准。更新桌面控件轮廓、导航与浮层材质、浅深色高光和背景模糊，内容区域保持实色。提供减少透明度、高对比度和不支持滤镜的退化。

迁移：将 designSystem、data-crab-design 与 iframe 配置中的 apple 改为 macos；appleColorContract 导出改为 macosColorContract。旧浏览器偏好自动迁移，公共接口不保留旧别名。

macOS Button 使用独立 push/tint/glass/plain 样式与反馈，xs/s/m 保持圆角矩形、l/xl 为胶囊；共享 API 不再意味着复用 Material 状态层。

macOS Switch 和 Slider 在交互时使用玻璃滑块，Slider 采用连续圆头轨道，并保留键盘、拖动和辅助显示设置下的反馈。
