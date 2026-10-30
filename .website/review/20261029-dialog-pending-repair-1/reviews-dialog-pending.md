# Dialog pending 修复候选逐图复审

12case原生全部通过，24张原始PNG全部view_image(original)逐张查看且SHA256与cases.json完全匹配。范围只含三体系×明暗×pending-confirm/cancel，medium/standard/Chromium。

source: sha256:ca16b34209a2fdfa97a435fb43d5e0600edc4f1995dd3baed8a1da005b599aba

artifact: sha256:278c274d511264b10e0c8e51a6663851a4772f83b1c43ff853b1c2b34c9cc1c1

1个inputs-worker前后stable，逐case绑定一致。专用run无siteBuild记录。当前断言源码SHA256 25769c0dcef78da09c0a5e0da0fcfa4b874326534ef35db7d00a3da2bb16081b 与候选source文件清单匹配。

- 24帧中的请求次数均实际看见1，与旧失败候选0不同；仅证明本候选，旧失败原图仍保留。
- 三体系明暗两pending动作均保留完整外部焦点环；发起动作显示真实加载图形，另一动作和关闭×弱化禁用，“完成异步请求”控件保留正常可读层次。
- MD3呈色调表面/圆角，Apple为紧凑清楚边界，shadcn为中性描边；各图标题自然两行、说明/字段/弹层/遮罩完整，无焦点裁切或新明显视觉缺陷。
- 每case两个250ms自然观察帧可见弧线方向或亮部变化，文字与几何稳定；不把这些帧称作完整动画周期或完整录像人工验收。
- 1个inputs-worker源码/产物前后stable且逐case一致；此专用run无siteBuild记录，不补造站点构建绑定。

## 原生通过与人工范围

- RealTab/Enter enters pending; aria-busy anddata-is-loading true.
- Initiator retains focus-visible withdisabled=false andaria-disabled=true; sibling/close native disabled=true.
- Request count1 andcomplete control enabled; repeatedEnter/Escape leavescount1,dialogopen,initiatorfocused.
- Naturalallow-animation frames sampled250msapart; completionclearsbusy/loading/aria-disabled and reenables sibling.
- Finalcancelcloses andreturnsfocus to originaltrigger.

上述为候选匹配的测试源码及12项原生pass范围。人工图片只确认可见计数、加载/禁用层次、焦点边界与几何，不单独证明交互行为。

## 逐图记录

| Case / 图ID | 配置 | 原图SHA256 / 路径 | 实际观察 |
| --- | --- | --- | --- |
| 10eeb3b4bd2ba3b601d5-13f4d396b78e3f055f21/chromium/0#image-0 | md3 / light / pending-confirm | [66deaa6379cf2817f3582a8358a9e9503ee9d01e20ef6c00a7a90d8b159f9664](screens/rc-dialog/chromium/000001-0-natural-pending-confirm-frame-0.png) | md3 light pending-confirm：请求计数清楚为1；确认保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-13f4d396b78e3f055f21/chromium/0#image-1 | md3 / light / pending-confirm | [012487597d002eed15d2ac912897fb4ba94cadce80e2d3a1582a8eaca1ae48dc](screens/rc-dialog/chromium/000001-1-natural-pending-confirm-frame-1.png) | md3 light pending-confirm：请求计数清楚为1；确认保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-f83b1ddd4464c8de2b8d/chromium/0#image-0 | md3 / light / pending-cancel | [dc18df0ac6d459dc8d784e7e1e1bbea09474b62f17bf4745e28795dda4b71428](screens/rc-dialog/chromium/000002-0-natural-pending-cancel-frame-0.png) | md3 light pending-cancel：请求计数清楚为1；取消保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-f83b1ddd4464c8de2b8d/chromium/0#image-1 | md3 / light / pending-cancel | [e7e3f30cc2ead933d3e45f2ab142b98131c9f4f81ba61c1be8ff03c6d1f758b8](screens/rc-dialog/chromium/000002-1-natural-pending-cancel-frame-1.png) | md3 light pending-cancel：请求计数清楚为1；取消保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-d2ccda54eb3aad130aae/chromium/0#image-0 | md3 / dark / pending-confirm | [46ad99adf3510c0ef1e7da97c6da4e8fcaf82129240036f7d885037ea770532b](screens/rc-dialog/chromium/000003-0-natural-pending-confirm-frame-0.png) | md3 dark pending-confirm：请求计数清楚为1；确认保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-d2ccda54eb3aad130aae/chromium/0#image-1 | md3 / dark / pending-confirm | [0f6394d0e123ee88a27004cc19fe79588fc9d201476982ff948c5b4199a0d77c](screens/rc-dialog/chromium/000003-1-natural-pending-confirm-frame-1.png) | md3 dark pending-confirm：请求计数清楚为1；确认保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-3f6339123fbefba21398/chromium/0#image-0 | md3 / dark / pending-cancel | [30dcead804451081e63518293f3f79128c9b34f026d92ea8858565ad78f3303f](screens/rc-dialog/chromium/000004-0-natural-pending-cancel-frame-0.png) | md3 dark pending-cancel：请求计数清楚为1；取消保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-3f6339123fbefba21398/chromium/0#image-1 | md3 / dark / pending-cancel | [618457c1a79ada40233ad3aec043c1a2afb8689cb4f6c9708ff778032d4e7c94](screens/rc-dialog/chromium/000004-1-natural-pending-cancel-frame-1.png) | md3 dark pending-cancel：请求计数清楚为1；取消保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-27dd6a836b8f2af529ca/chromium/0#image-0 | apple / light / pending-confirm | [13c1ee249d27a44a36f5b1acabdac3fbf1901af88e250e6353f62db328414cfa](screens/rc-dialog/chromium/000005-0-natural-pending-confirm-frame-0.png) | apple light pending-confirm：请求计数清楚为1；确认保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-27dd6a836b8f2af529ca/chromium/0#image-1 | apple / light / pending-confirm | [67c2e3909b253528494506fe91ff09e14ad27fa0f9eed79d5814ecef0fcd40f5](screens/rc-dialog/chromium/000005-1-natural-pending-confirm-frame-1.png) | apple light pending-confirm：请求计数清楚为1；确认保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-09d5dded8837c0421a54/chromium/0#image-0 | apple / light / pending-cancel | [1b4fb386b72c04c030332ee82873e19aa3223e94e8f8b51a429911afdf8fcc5d](screens/rc-dialog/chromium/000006-0-natural-pending-cancel-frame-0.png) | apple light pending-cancel：请求计数清楚为1；取消保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-09d5dded8837c0421a54/chromium/0#image-1 | apple / light / pending-cancel | [832484c4ed7ac0260a2f4c65e6f340058661fd852f632900dba52b0e7fe4f1f2](screens/rc-dialog/chromium/000006-1-natural-pending-cancel-frame-1.png) | apple light pending-cancel：请求计数清楚为1；取消保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-402698c5a5374de73182/chromium/0#image-0 | apple / dark / pending-confirm | [c42b143f4c0e5be71bb3844b3b49969eaa6fd77680646ffda6326e82bada8fb5](screens/rc-dialog/chromium/000007-0-natural-pending-confirm-frame-0.png) | apple dark pending-confirm：请求计数清楚为1；确认保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-402698c5a5374de73182/chromium/0#image-1 | apple / dark / pending-confirm | [87e02821d7c4bca18bf65a13570e22e108e8fe43f3fac195bfab874fd6724097](screens/rc-dialog/chromium/000007-1-natural-pending-confirm-frame-1.png) | apple dark pending-confirm：请求计数清楚为1；确认保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-1ff5b730a6102d6bf56d/chromium/0#image-0 | apple / dark / pending-cancel | [649f154c176f817f351c864ff8065ce1d090d241fa2a71cc7d4f2be8f1988b86](screens/rc-dialog/chromium/000008-0-natural-pending-cancel-frame-0.png) | apple dark pending-cancel：请求计数清楚为1；取消保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-1ff5b730a6102d6bf56d/chromium/0#image-1 | apple / dark / pending-cancel | [81797784b1f2f5a839f7f7093f6e105d28440268f2c6d0fbf14d9a5744e7bc76](screens/rc-dialog/chromium/000008-1-natural-pending-cancel-frame-1.png) | apple dark pending-cancel：请求计数清楚为1；取消保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-82c3b9701a5171412df8/chromium/0#image-0 | shadcn / light / pending-confirm | [f1762aed46535bbd97ed0b0e4119a07f526e91243ba51b424ae088d4faabd125](screens/rc-dialog/chromium/000009-0-natural-pending-confirm-frame-0.png) | shadcn light pending-confirm：请求计数清楚为1；确认保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-82c3b9701a5171412df8/chromium/0#image-1 | shadcn / light / pending-confirm | [f3f559a4dc5847f5a955d8bbe126d1d4378e2b6c261cbafb82a1c8c1801ba991](screens/rc-dialog/chromium/000009-1-natural-pending-confirm-frame-1.png) | shadcn light pending-confirm：请求计数清楚为1；确认保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-e15658db8540108fe3ad/chromium/0#image-0 | shadcn / light / pending-cancel | [bf79a92c5d4f3272c95ed5df7b5db1edf7771bbe7c26c97529ef5081c15e3f36](screens/rc-dialog/chromium/000010-0-natural-pending-cancel-frame-0.png) | shadcn light pending-cancel：请求计数清楚为1；取消保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-e15658db8540108fe3ad/chromium/0#image-1 | shadcn / light / pending-cancel | [8b256007b9983d66db37c2b402ac861257bad7ab6913404c8596efef5a650a54](screens/rc-dialog/chromium/000010-1-natural-pending-cancel-frame-1.png) | shadcn light pending-cancel：请求计数清楚为1；取消保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-6651670091a2b00524fb/chromium/0#image-0 | shadcn / dark / pending-confirm | [a7b57f87c9f70a42b8a2af50d4f3d9052984dfc9706194e1580857332db0dc77](screens/rc-dialog/chromium/000011-0-natural-pending-confirm-frame-0.png) | shadcn dark pending-confirm：请求计数清楚为1；确认保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-6651670091a2b00524fb/chromium/0#image-1 | shadcn / dark / pending-confirm | [54d5894fbed32b42028682c87ecff432a0f2d6db5e12c29891d7320ed811431d](screens/rc-dialog/chromium/000011-1-natural-pending-confirm-frame-1.png) | shadcn dark pending-confirm：请求计数清楚为1；确认保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-54899b924ca968cb3747/chromium/0#image-0 | shadcn / dark / pending-cancel | [f29e07357ef1ae7525307828fd4dba9bb6cd6db27be627e9acd42ab9c1f318c6](screens/rc-dialog/chromium/000012-0-natural-pending-cancel-frame-0.png) | shadcn dark pending-cancel：请求计数清楚为1；取消保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |
| 10eeb3b4bd2ba3b601d5-54899b924ca968cb3747/chromium/0#image-1 | shadcn / dark / pending-cancel | [d0c944bab100175178a8bc0c6dc413b6f0c521b1154b97d643ebdd63a7e2c965](screens/rc-dialog/chromium/000012-1-natural-pending-cancel-frame-1.png) | shadcn dark pending-cancel：请求计数清楚为1；取消保留完整外部焦点环与加载图形，另一个动作及关闭×呈弱化禁用层次，完成异步请求控件可读且未弱化为禁用。标题、说明、字段、弹窗和遮罩完整。两自然帧加载图形呈相位/亮部变化，按钮与焦点几何稳定。 |

## 保留与未覆盖

- 范围严格为Chromium、medium/standard、三体系明暗的pending-confirm/cancel12单元；其他尺寸/密度/状态/浏览器/平台矩阵仍pending。
- 计数与真实焦点/disabled/complete/re-entry恢复行为的原生通过和人工静帧观察分别记录，不能互相替代。
- 12份原生视频仅确认留存文件与字节hash，未实际完整播放或逐秒审阅；不得写全部视频已审。
- 未启动浏览器、追加采集、构建、修改原图/源码、建立baseline或更新verified。

12份WebM已保留并逐文件核字节hash（详见JSON），完整播放/逐秒人工审阅数为0。没有基准批准或verified更新；其他矩阵继续pending。
