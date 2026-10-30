# LineEdit 扩展 Windows 候选审计 · 2026-10-30

完整公开 foreach 命令自然 exit1，未发中断；只启动 LineEdit。301尝试：283通过、18失败、0中断、0跳过、0未跑。TextEdit301 / NumberEdit427 为声明推导，实际0尝试，不能归并旧证据。

| 范围 | 已尝试 | 通过 | 失败 | PNG |
| --- | --- | --- | --- |
| matrix | 234 | 216 | 18 | 450 |
| environment | 60 | 60 | 0 | 120 |
| inventory | 6 | 6 | 0 | 6 |
| boundary | 1 | 1 | 0 | 0 |

核心234格均出现，216通过、18失败；matrix.complete=true仅表示无缺格。环境60/60包含6项真实200%缩放，inventory6与boundary1通过。新增filled-error / filled-warning / disabled-filled各18通过；read-only-filled18均失败。

所有失败均在 outlined 外观进入 assertCompleteDraft 后，Ctrl+Home期望collapsed(0,0)而实际选区(0,25)。原trace只发生Tab和Ctrl+Home，保存了readonly属性与完整原值；没有执行Ctrl+A、复制、拒绝编辑或filled外观只读的后续交互。先前完整editable Home/End假设不应直接套用readonly；没有证据据此修改组件产品。

576原PNG：每体系192（通过case186、原生失败截图6）；全hash及native attachmentIndex对应通过。失败截图不是完成的逐外观视觉候选；本次未新看图或批准基准。design-image-index.json逐图保留配置、状态、附件序号、尺寸和快照目标。

19份worker前后source/asset全stable；source sha256:832403c23d844ab8776df2426d2455990c127066139935326214cef0ae19558d；artifact sha256:488964434b3e1d98e33a9995db85ced1d12b28aa77b9cbb9e1c2df66c88cc96f。1090渲染源码事实与224资产事实均按共享hasher原口径匹配当前文件。清单使用renderingManifest规范化后再哈希；此前误用raw哈希的审计假差异已纠正，错误派生稿仅保存在.tmp，不代表manifest改变。原四测试源已按采集SHA存入test-sources。实际Chromium156.0.8078.4、Windows；不借WebGL vendor文字冒充引擎信息。

磁盘监测最低 2.031GiB；没有低于2GiB。后段连续轮询中位间隔 6.08秒；前段分块存在间隔，最大46.74秒，完整JSONL保留。收到安全收尾要求时进程已自然退出，未向无关进程/容器发信号或清理历史。

原始native目录和导出results/HTML/trace均保留。本文只读审计，不改源、不采集、不构建、不更新baseline/verified。修正readonly专属断言与后续新候选需根重新调度。
