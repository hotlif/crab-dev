---
"@crab-dev/rc-canvas": minor
"@crab-dev/rc-flow-diagram": minor
---

新增 Text 自动文字模式：小字号按视图缩放和 DPR 更新清晰位图，保持换行与世界坐标尺寸稳定，并限制字形缓存与纹理分配。字体加载和 DPR 变化会刷新文字；新增 fontWeight 并同步内联编辑器。

FlowNode 默认使用 auto，并透传 fontFamily、fontWeight、lineHeight 与 textMode。需要保留旧文字外观时设置 textMode="sdf"；直接使用 Text 的默认模式不变。
