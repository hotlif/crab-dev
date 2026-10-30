---
"@crab-dev/rc-form": patch
"@crab-dev/rc-cron-picker": patch
"@crab-dev/rc-date-picker": patch
"@crab-dev/rc-pagination": patch
"@crab-dev/rc-tabs": patch
"@crab-dev/rc-tag": patch
"@crab-dev/rc-breadcrumbs": patch
---

将表单、日期与计划选择及导航组件的三体系状态规格、可运行矩阵示例和 Playwright 场景放回所属包，分别覆盖适用尺寸、密度、交互与环境，保留原有公开属性和受控协议。初次截图仍作为待复审候选，不自动建立基准或提升覆盖状态。

日期时间输入通过语义令牌分别采用 MD3 基线与 Apple/shadcn 的紧凑桌面扩展；表盘坐标和时间精度不变。面包屑动作沿用路径文字几何及中性反馈，避免动作尺寸变化撑高路径，并保留原生键盘与粗指针命中能力。纠正只读 Cron 示例文字，使其与“可展开查看、不可编辑”的既有行为一致。

修复面包屑路径间距没有响应 density 的问题，统一引用现有 L2 density.gap。默认 standard 间距会增加，长路径可能更早折行；组件尺寸与导航协议保持兼容。浏览器同时检查计算间距与实际相邻项坐标，不以三档重复截图作为验收通过依据。
