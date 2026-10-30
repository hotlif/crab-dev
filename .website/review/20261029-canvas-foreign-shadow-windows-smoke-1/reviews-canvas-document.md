# iframe 内 Shadow Canvas：Windows 单场景证据

真实 Chromium 156.0.8078.4 / Windows：1 case passed。原图已逐张查看（1/1），PNG SHA-256、历史输入前后稳定性及聚合指纹均匹配。此记录仅对应本目录候选，不与 Linux 像素基准混比。

- 源码：`sha256:0d718513bc7a1605ccef51bcd56f57aa098655e30472ef6e92fe7952ef7645d3`；实际组件资产：`sha256:2923a34187fbf19e0d5125c68b40e77fba1df281167c7d3e7de1caccde0ca679`。
- iframe 的 ShadowRoot 不属于父窗口的 ShadowRoot constructor；相同实际 Theme/组件 CSS 资源已进入 iframe Document 和 ShadowRoot。
- 真实 GPU 中矩形 RGBA 为 `29,27,32,255` → 最近边界暗色 `230,224,233,255`；改变外层仍为 `230,224,233,255`。最近边界换 Apple 暗色 `248,248,250,255`，恢复亮色 `9,9,11,255`。每一步均与浏览器真实 2D 求值一致，空白 alpha=0，GL error=0。
- 公开 onRender 只记录完成的实际绘制，计数 6→8→9→11→12。显式 DPR=1.5、位图 540×240、iframe/Canvas/input 节点、完整草稿值和真实拖动后坐标 64,80 均由自动断言保持。

原图可见三个边界控制、最终 Apple/light 的 iframe 内容、草稿可见前缀、画布与坐标，所见未发现明显重叠或边界裁剪。画板内部是命名局部滚动区；截图不代表整个横向画板或整长页。

| case | 原图 SHA-256 |
| --- | --- |
| 80ff4d678bb4227f8708-d9205d1647466ff8059c/chromium/0 | [4b578219f5641a0c64655bb9178e680b3172d1700721d25e76ee2dd5eee892f1](screens/rc-canvas/chromium/000001-3-actual.png) |

其余初始配置、Linux、Firefox/WebKit、完整状态/环境矩阵和稳定复跑仍待统一候选。保持 partial，不建立 baseline、不更新 verified。首次 TEMP 权限失败、未发现测试、表单标签定位失败的原日志和截图/trace 均保留；不能计为通过。
