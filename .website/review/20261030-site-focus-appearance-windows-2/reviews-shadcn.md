# 站点 shadcn 实际逐图复审（Windows 第2候选）

实际查看46/46原PNG：36自然视口帧、10导航静态图；另用官方Playwright ffmpeg-1013解码12段已有视频的25%/55%/85%共36帧，36帧均实际查看。完整视频播放0段。原生36项通过、0失败/跳过/不稳定，4个worker实例采集前后稳定（原生并发配置2）。本报告只增加证据，没有源码、采集、构建、基准或verified变更。

捕获source `sha256:4873b5ae3ae75e1ba5f1bf8d8dcae4ec72e361865304e630f8e5673fb36c31c7`；实际库/站点资产 `sha256:caaa2e325183ae7c996c04ca4f771c13c77aa1ac188dea3485041171368aa719`；完整站点构建 `sha256:49e777a2a23e7732e5b17e077b53ce172e692c995ae68f3d7a1bc34d46963dd0`。四worker三类清单前后共24个fingerprint均按files数组重新计算；原生/导出输入与results同字节。

初始Apple的appearance-live翻到shadcn并反转明暗；初始shadcn的tutorial-live回初始体系/明暗。逐图记录同时保留初始与实际配置，未按case标题误分图。全批108自然帧中本组只审36；自然帧均不作静态黄金。

与失败第1批相比，实际artifact 2590文件、完整siteBuild 2751文件的全记录数组和fingerprint完全相同；source只变4项测试/工程/贡献说明。第1批已登记的400份历史文件重新核SHA均未变，原18通过/18失败历史不改写。

## 观察与边界

320表单画面只有当前滚动位置中下段，项目名和按钮在画面外；768/桌面项目名只显示输入框横向可见部分，完整值和同一元素保留由原生断言证明。说明草稿、只读/禁用/错误样例、勾选状态清楚。四组平板/桌面加载spinner自然推进；两组窄屏虽然动画clock推进，控件在视口外且PNG同字节，不能称可见运动验收。

教程姓名“周宁 教学草稿”、邮箱与提交摘要一致；320摘要自然换行。所有教程time-series目标动画集合为空。搜索六张图有完整输入外焦点边界、首项选中底色/Enter标记；内部结果列表末项局部被截取，底部操作可见。四张抽屉面板/遮罩和首页选中清楚；关闭返回焦点及键盘上下选择、唯一选中/active-descendant、Enter之后正文焦点是原生断言证据，不由单张图推断。

对照样本的“未选择”是源码初始状态名称；正文说明勾选后切换会保留，未承诺名称动态变化。实图里该项已勾且标签不变，与原生checked断言一致记录，不误报为“当前选择:off”式动态反馈错误。可在后续考虑改名“可勾选项”以减少歧义，本批源冻结。

原PNG 31个唯一SHA，8组重复/15张额外重复，重复图也逐张查看。导航静态图仅Windows原生候选；本报告不批准Linux canonical或任何baseline。

## 逐图记录

### 1. appearance-live · dark · narrow

原图 [screens/website/chromium/000007-0-appearance-live-viewport-0.png](screens/website/chromium/000007-0-appearance-live-viewport-0.png)；320×768；SHA256 `6079d58fa17ad8c392d25bbfb2d4c6d196bb329edea13e234e4e4a8ad7814076`。

case `0e4135bc36f1ba174212-fc1977dff908257d5f73/chromium/0`；worker 0；native attachment 0 appearance-live-viewport-0同字节。初始apple/light → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色操作/输入和选择示例：项目说明“保存真实项目草稿，不因站点配置切换而重建。”可读，只读CRAB-001、禁用历史版本、阶段评审中、人数8可辨。原名“未选择”选项已勾，标签保留初始样本名称；不是动态状态输出。
- 320×768当前滚动视口，项目名/操作按钮在上方画面外；仅见表单中下段及下一卡片上部，发布范围下部在视口外。
- 自然序列第1/3帧；本组同字节，加载控件在视口外，仅clock递增不能证明可见运动。

### 2. appearance-live · dark · narrow

原图 [screens/website/chromium/000007-1-appearance-live-viewport-1.png](screens/website/chromium/000007-1-appearance-live-viewport-1.png)；320×768；SHA256 `6079d58fa17ad8c392d25bbfb2d4c6d196bb329edea13e234e4e4a8ad7814076`。

case `0e4135bc36f1ba174212-fc1977dff908257d5f73/chromium/0`；worker 0；native attachment 1 appearance-live-viewport-1同字节。初始apple/light → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色操作/输入和选择示例：项目说明“保存真实项目草稿，不因站点配置切换而重建。”可读，只读CRAB-001、禁用历史版本、阶段评审中、人数8可辨。原名“未选择”选项已勾，标签保留初始样本名称；不是动态状态输出。
- 320×768当前滚动视口，项目名/操作按钮在上方画面外；仅见表单中下段及下一卡片上部，发布范围下部在视口外。
- 自然序列第2/3帧；本组同字节，加载控件在视口外，仅clock递增不能证明可见运动。

### 3. appearance-live · dark · narrow

原图 [screens/website/chromium/000007-2-appearance-live-viewport-2.png](screens/website/chromium/000007-2-appearance-live-viewport-2.png)；320×768；SHA256 `6079d58fa17ad8c392d25bbfb2d4c6d196bb329edea13e234e4e4a8ad7814076`。

case `0e4135bc36f1ba174212-fc1977dff908257d5f73/chromium/0`；worker 0；native attachment 2 appearance-live-viewport-2同字节。初始apple/light → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色操作/输入和选择示例：项目说明“保存真实项目草稿，不因站点配置切换而重建。”可读，只读CRAB-001、禁用历史版本、阶段评审中、人数8可辨。原名“未选择”选项已勾，标签保留初始样本名称；不是动态状态输出。
- 320×768当前滚动视口，项目名/操作按钮在上方画面外；仅见表单中下段及下一卡片上部，发布范围下部在视口外。
- 自然序列第3/3帧；本组同字节，加载控件在视口外，仅clock递增不能证明可见运动。

### 4. appearance-live · dark · tablet

原图 [screens/website/chromium/000008-0-appearance-live-viewport-0.png](screens/website/chromium/000008-0-appearance-live-viewport-0.png)；768×1024；SHA256 `cc951c8a9b98152e1cfbb530716709a571354727e7fac61e27da0037975238df`。

case `0e4135bc36f1ba174212-c07c070c68e6558bc1ae/chromium/0`；worker 1；native attachment 0 appearance-live-viewport-0同字节。初始apple/light → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色操作/输入和选择示例：项目说明“保存真实项目草稿，不因站点配置切换而重建。”可读，只读CRAB-001、禁用历史版本、阶段评审中、人数8可辨。原名“未选择”选项已勾，标签保留初始样本名称；不是动态状态输出。
- 768×1024视口，项目名仅输入框横向可见部分，说明完整；错误字段/红色边界、操作按钮和选择/调节大部可见，处理中spinner角度逐帧变化。
- 自然序列第1/3帧；有限间隔自然推进，不冻结或替换持续加载动画。

### 5. appearance-live · dark · tablet

原图 [screens/website/chromium/000008-1-appearance-live-viewport-1.png](screens/website/chromium/000008-1-appearance-live-viewport-1.png)；768×1024；SHA256 `877bc497705e4540cc4584188d0e8f926dd99a170c95b2fc67d826ce8de81218`。

case `0e4135bc36f1ba174212-c07c070c68e6558bc1ae/chromium/0`；worker 1；native attachment 1 appearance-live-viewport-1同字节。初始apple/light → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色操作/输入和选择示例：项目说明“保存真实项目草稿，不因站点配置切换而重建。”可读，只读CRAB-001、禁用历史版本、阶段评审中、人数8可辨。原名“未选择”选项已勾，标签保留初始样本名称；不是动态状态输出。
- 768×1024视口，项目名仅输入框横向可见部分，说明完整；错误字段/红色边界、操作按钮和选择/调节大部可见，处理中spinner角度逐帧变化。
- 自然序列第2/3帧；有限间隔自然推进，不冻结或替换持续加载动画。

### 6. appearance-live · dark · tablet

原图 [screens/website/chromium/000008-2-appearance-live-viewport-2.png](screens/website/chromium/000008-2-appearance-live-viewport-2.png)；768×1024；SHA256 `3d871d15629dfe3b34743e6489172fe9b850645cd3cafb44d9e29d5313687c9c`。

case `0e4135bc36f1ba174212-c07c070c68e6558bc1ae/chromium/0`；worker 1；native attachment 2 appearance-live-viewport-2同字节。初始apple/light → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色操作/输入和选择示例：项目说明“保存真实项目草稿，不因站点配置切换而重建。”可读，只读CRAB-001、禁用历史版本、阶段评审中、人数8可辨。原名“未选择”选项已勾，标签保留初始样本名称；不是动态状态输出。
- 768×1024视口，项目名仅输入框横向可见部分，说明完整；错误字段/红色边界、操作按钮和选择/调节大部可见，处理中spinner角度逐帧变化。
- 自然序列第3/3帧；有限间隔自然推进，不冻结或替换持续加载动画。

### 7. appearance-live · dark · desktop

原图 [screens/website/chromium/000009-0-appearance-live-viewport-0.png](screens/website/chromium/000009-0-appearance-live-viewport-0.png)；1440×900；SHA256 `6f90b9722cef8cbd74c2112cb857d499c7cfe6d71f0600da12a8c0e034e1c587`。

case `0e4135bc36f1ba174212-4e78829df61492064d81/chromium/0`；worker 0；native attachment 0 appearance-live-viewport-0同字节。初始apple/light → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色操作/输入和选择示例：项目说明“保存真实项目草稿，不因站点配置切换而重建。”可读，只读CRAB-001、禁用历史版本、阶段评审中、人数8可辨。原名“未选择”选项已勾，标签保留初始样本名称；不是动态状态输出。
- 1440×900视口，顶栏/左右导航及表单/选择区域清楚；项目名显示框内部分，说明完整，底部slider被视口下沿截取；处理中spinner角度逐帧变化。
- 自然序列第1/3帧；有限间隔自然推进，不冻结或替换持续加载动画。

### 8. appearance-live · dark · desktop

原图 [screens/website/chromium/000009-1-appearance-live-viewport-1.png](screens/website/chromium/000009-1-appearance-live-viewport-1.png)；1440×900；SHA256 `4e483fead7ad26866fa036851ffaafb2460c1271727b7c05d648a6b1bbebb7c0`。

case `0e4135bc36f1ba174212-4e78829df61492064d81/chromium/0`；worker 0；native attachment 1 appearance-live-viewport-1同字节。初始apple/light → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色操作/输入和选择示例：项目说明“保存真实项目草稿，不因站点配置切换而重建。”可读，只读CRAB-001、禁用历史版本、阶段评审中、人数8可辨。原名“未选择”选项已勾，标签保留初始样本名称；不是动态状态输出。
- 1440×900视口，顶栏/左右导航及表单/选择区域清楚；项目名显示框内部分，说明完整，底部slider被视口下沿截取；处理中spinner角度逐帧变化。
- 自然序列第2/3帧；有限间隔自然推进，不冻结或替换持续加载动画。

### 9. appearance-live · dark · desktop

原图 [screens/website/chromium/000009-2-appearance-live-viewport-2.png](screens/website/chromium/000009-2-appearance-live-viewport-2.png)；1440×900；SHA256 `1188ba7573db404c681212f0de2de52622374b8c1086fc8c899cb6441f8042b7`。

case `0e4135bc36f1ba174212-4e78829df61492064d81/chromium/0`；worker 0；native attachment 2 appearance-live-viewport-2同字节。初始apple/light → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色操作/输入和选择示例：项目说明“保存真实项目草稿，不因站点配置切换而重建。”可读，只读CRAB-001、禁用历史版本、阶段评审中、人数8可辨。原名“未选择”选项已勾，标签保留初始样本名称；不是动态状态输出。
- 1440×900视口，顶栏/左右导航及表单/选择区域清楚；项目名显示框内部分，说明完整，底部slider被视口下沿截取；处理中spinner角度逐帧变化。
- 自然序列第3/3帧；有限间隔自然推进，不冻结或替换持续加载动画。

### 10. appearance-live · light · narrow

原图 [screens/website/chromium/000010-0-appearance-live-viewport-0.png](screens/website/chromium/000010-0-appearance-live-viewport-0.png)；320×768；SHA256 `45d84a35a97127a7b529572972a38fe99fe553ada099169d74500ac3baa5fbc3`。

case `0e4135bc36f1ba174212-217995280edc3cfb082e/chromium/0`；worker 1；native attachment 0 appearance-live-viewport-0同字节。初始apple/dark → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色操作/输入和选择示例：项目说明“保存真实项目草稿，不因站点配置切换而重建。”可读，只读CRAB-001、禁用历史版本、阶段评审中、人数8可辨。原名“未选择”选项已勾，标签保留初始样本名称；不是动态状态输出。
- 320×768当前滚动视口，项目名/操作按钮在上方画面外；仅见表单中下段及下一卡片上部，发布范围下部在视口外。
- 自然序列第1/3帧；本组同字节，加载控件在视口外，仅clock递增不能证明可见运动。

### 11. appearance-live · light · narrow

原图 [screens/website/chromium/000010-1-appearance-live-viewport-1.png](screens/website/chromium/000010-1-appearance-live-viewport-1.png)；320×768；SHA256 `45d84a35a97127a7b529572972a38fe99fe553ada099169d74500ac3baa5fbc3`。

case `0e4135bc36f1ba174212-217995280edc3cfb082e/chromium/0`；worker 1；native attachment 1 appearance-live-viewport-1同字节。初始apple/dark → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色操作/输入和选择示例：项目说明“保存真实项目草稿，不因站点配置切换而重建。”可读，只读CRAB-001、禁用历史版本、阶段评审中、人数8可辨。原名“未选择”选项已勾，标签保留初始样本名称；不是动态状态输出。
- 320×768当前滚动视口，项目名/操作按钮在上方画面外；仅见表单中下段及下一卡片上部，发布范围下部在视口外。
- 自然序列第2/3帧；本组同字节，加载控件在视口外，仅clock递增不能证明可见运动。

### 12. appearance-live · light · narrow

原图 [screens/website/chromium/000010-2-appearance-live-viewport-2.png](screens/website/chromium/000010-2-appearance-live-viewport-2.png)；320×768；SHA256 `45d84a35a97127a7b529572972a38fe99fe553ada099169d74500ac3baa5fbc3`。

case `0e4135bc36f1ba174212-217995280edc3cfb082e/chromium/0`；worker 1；native attachment 2 appearance-live-viewport-2同字节。初始apple/dark → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色操作/输入和选择示例：项目说明“保存真实项目草稿，不因站点配置切换而重建。”可读，只读CRAB-001、禁用历史版本、阶段评审中、人数8可辨。原名“未选择”选项已勾，标签保留初始样本名称；不是动态状态输出。
- 320×768当前滚动视口，项目名/操作按钮在上方画面外；仅见表单中下段及下一卡片上部，发布范围下部在视口外。
- 自然序列第3/3帧；本组同字节，加载控件在视口外，仅clock递增不能证明可见运动。

### 13. appearance-live · light · tablet

原图 [screens/website/chromium/000011-0-appearance-live-viewport-0.png](screens/website/chromium/000011-0-appearance-live-viewport-0.png)；768×1024；SHA256 `999558bae8d0fec357e8c787d334b006a5f934b753a863d686bc72d783bf08d8`。

case `0e4135bc36f1ba174212-1e9ffd0ea283d53775c7/chromium/0`；worker 0；native attachment 0 appearance-live-viewport-0同字节。初始apple/dark → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色操作/输入和选择示例：项目说明“保存真实项目草稿，不因站点配置切换而重建。”可读，只读CRAB-001、禁用历史版本、阶段评审中、人数8可辨。原名“未选择”选项已勾，标签保留初始样本名称；不是动态状态输出。
- 768×1024视口，项目名仅输入框横向可见部分，说明完整；错误字段/红色边界、操作按钮和选择/调节大部可见，处理中spinner角度逐帧变化。
- 自然序列第1/3帧；有限间隔自然推进，不冻结或替换持续加载动画。

### 14. appearance-live · light · tablet

原图 [screens/website/chromium/000011-1-appearance-live-viewport-1.png](screens/website/chromium/000011-1-appearance-live-viewport-1.png)；768×1024；SHA256 `48e3a4864920ac14ef90122037634606a7d19ade3e35da9b35c3fb05004320a5`。

case `0e4135bc36f1ba174212-1e9ffd0ea283d53775c7/chromium/0`；worker 0；native attachment 1 appearance-live-viewport-1同字节。初始apple/dark → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色操作/输入和选择示例：项目说明“保存真实项目草稿，不因站点配置切换而重建。”可读，只读CRAB-001、禁用历史版本、阶段评审中、人数8可辨。原名“未选择”选项已勾，标签保留初始样本名称；不是动态状态输出。
- 768×1024视口，项目名仅输入框横向可见部分，说明完整；错误字段/红色边界、操作按钮和选择/调节大部可见，处理中spinner角度逐帧变化。
- 自然序列第2/3帧；有限间隔自然推进，不冻结或替换持续加载动画。

### 15. appearance-live · light · tablet

原图 [screens/website/chromium/000011-2-appearance-live-viewport-2.png](screens/website/chromium/000011-2-appearance-live-viewport-2.png)；768×1024；SHA256 `1db226dafcaa97d25e16ddf6758a334de0158f1ee8e9f38a8ca2e2c8549426f0`。

case `0e4135bc36f1ba174212-1e9ffd0ea283d53775c7/chromium/0`；worker 0；native attachment 2 appearance-live-viewport-2同字节。初始apple/dark → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色操作/输入和选择示例：项目说明“保存真实项目草稿，不因站点配置切换而重建。”可读，只读CRAB-001、禁用历史版本、阶段评审中、人数8可辨。原名“未选择”选项已勾，标签保留初始样本名称；不是动态状态输出。
- 768×1024视口，项目名仅输入框横向可见部分，说明完整；错误字段/红色边界、操作按钮和选择/调节大部可见，处理中spinner角度逐帧变化。
- 自然序列第3/3帧；有限间隔自然推进，不冻结或替换持续加载动画。

### 16. appearance-live · light · desktop

原图 [screens/website/chromium/000012-0-appearance-live-viewport-0.png](screens/website/chromium/000012-0-appearance-live-viewport-0.png)；1440×900；SHA256 `d48d5cf7d0b54fe34958130db14b4af20cec54c4d4ab8bd6219c7efa8cab77f1`。

case `0e4135bc36f1ba174212-d6cb8e0a9654878b17b5/chromium/0`；worker 1；native attachment 0 appearance-live-viewport-0同字节。初始apple/dark → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色操作/输入和选择示例：项目说明“保存真实项目草稿，不因站点配置切换而重建。”可读，只读CRAB-001、禁用历史版本、阶段评审中、人数8可辨。原名“未选择”选项已勾，标签保留初始样本名称；不是动态状态输出。
- 1440×900视口，顶栏/左右导航及表单/选择区域清楚；项目名显示框内部分，说明完整，底部slider被视口下沿截取；处理中spinner角度逐帧变化。
- 自然序列第1/3帧；有限间隔自然推进，不冻结或替换持续加载动画。

### 17. appearance-live · light · desktop

原图 [screens/website/chromium/000012-1-appearance-live-viewport-1.png](screens/website/chromium/000012-1-appearance-live-viewport-1.png)；1440×900；SHA256 `5f5df7f6bad1590130cd168c4e685efa0bd4744809cf4279e868325f4adc8934`。

case `0e4135bc36f1ba174212-d6cb8e0a9654878b17b5/chromium/0`；worker 1；native attachment 1 appearance-live-viewport-1同字节。初始apple/dark → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色操作/输入和选择示例：项目说明“保存真实项目草稿，不因站点配置切换而重建。”可读，只读CRAB-001、禁用历史版本、阶段评审中、人数8可辨。原名“未选择”选项已勾，标签保留初始样本名称；不是动态状态输出。
- 1440×900视口，顶栏/左右导航及表单/选择区域清楚；项目名显示框内部分，说明完整，底部slider被视口下沿截取；处理中spinner角度逐帧变化。
- 自然序列第2/3帧；有限间隔自然推进，不冻结或替换持续加载动画。

### 18. appearance-live · light · desktop

原图 [screens/website/chromium/000012-2-appearance-live-viewport-2.png](screens/website/chromium/000012-2-appearance-live-viewport-2.png)；1440×900；SHA256 `e48685bc48b182eb02eafd293fbef281c0649206d766d61d75845cc885850814`。

case `0e4135bc36f1ba174212-d6cb8e0a9654878b17b5/chromium/0`；worker 1；native attachment 2 appearance-live-viewport-2同字节。初始apple/dark → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色操作/输入和选择示例：项目说明“保存真实项目草稿，不因站点配置切换而重建。”可读，只读CRAB-001、禁用历史版本、阶段评审中、人数8可辨。原名“未选择”选项已勾，标签保留初始样本名称；不是动态状态输出。
- 1440×900视口，顶栏/左右导航及表单/选择区域清楚；项目名显示框内部分，说明完整，底部slider被视口下沿截取；处理中spinner角度逐帧变化。
- 自然序列第3/3帧；有限间隔自然推进，不冻结或替换持续加载动画。

### 19. tutorial-live · light · narrow

原图 [screens/website/chromium/000013-5-tutorial-live-viewport-0.png](screens/website/chromium/000013-5-tutorial-live-viewport-0.png)；320×768；SHA256 `4b79df0c6adeab409ea885da0ed4fe24d5cc3db74198bd15db36628d329480c3`。

case `0e4135bc36f1ba174212-4038d8a45668fba310e4/chromium/0`；worker 0；native attachment 5 tutorial-live-viewport-0同字节。初始shadcn/light → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色教程第2步表单：姓名“周宁 教学草稿”、邮箱lin@example.com及待提交摘要一致，文字可读。
- 320×768只含当前滚动视口，摘要自然换两行；上方正文和下方其他教程未纳入画面。
- 自然序列第1/3帧，目标动画集合为空；本组三帧同字节。姓名输入未显示外焦点环，不把保留草稿画面冒称输入焦点验收。

### 20. tutorial-live · light · narrow

原图 [screens/website/chromium/000013-6-tutorial-live-viewport-1.png](screens/website/chromium/000013-6-tutorial-live-viewport-1.png)；320×768；SHA256 `4b79df0c6adeab409ea885da0ed4fe24d5cc3db74198bd15db36628d329480c3`。

case `0e4135bc36f1ba174212-4038d8a45668fba310e4/chromium/0`；worker 0；native attachment 6 tutorial-live-viewport-1同字节。初始shadcn/light → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色教程第2步表单：姓名“周宁 教学草稿”、邮箱lin@example.com及待提交摘要一致，文字可读。
- 320×768只含当前滚动视口，摘要自然换两行；上方正文和下方其他教程未纳入画面。
- 自然序列第2/3帧，目标动画集合为空；本组三帧同字节。姓名输入未显示外焦点环，不把保留草稿画面冒称输入焦点验收。

### 21. tutorial-live · light · narrow

原图 [screens/website/chromium/000013-7-tutorial-live-viewport-2.png](screens/website/chromium/000013-7-tutorial-live-viewport-2.png)；320×768；SHA256 `4b79df0c6adeab409ea885da0ed4fe24d5cc3db74198bd15db36628d329480c3`。

case `0e4135bc36f1ba174212-4038d8a45668fba310e4/chromium/0`；worker 0；native attachment 7 tutorial-live-viewport-2同字节。初始shadcn/light → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色教程第2步表单：姓名“周宁 教学草稿”、邮箱lin@example.com及待提交摘要一致，文字可读。
- 320×768只含当前滚动视口，摘要自然换两行；上方正文和下方其他教程未纳入画面。
- 自然序列第3/3帧，目标动画集合为空；本组三帧同字节。姓名输入未显示外焦点环，不把保留草稿画面冒称输入焦点验收。

### 22. tutorial-live · light · tablet

原图 [screens/website/chromium/000014-5-tutorial-live-viewport-0.png](screens/website/chromium/000014-5-tutorial-live-viewport-0.png)；768×1024；SHA256 `adf426e6e82a90eed80e15c057c82595e010eac7f5042420e5c48b492e65b2f2`。

case `0e4135bc36f1ba174212-479efa30ca063fc21ab6/chromium/0`；worker 1；native attachment 5 tutorial-live-viewport-0同字节。初始shadcn/light → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色教程第2步表单：姓名“周宁 教学草稿”、邮箱lin@example.com及待提交摘要一致，文字可读。
- 768×1024编辑卡片完整，上一步/下一步可见，正文和常见问题仅视口内部分。
- 自然序列第1/3帧，目标动画集合为空；本组三帧同字节。姓名输入未显示外焦点环，不把保留草稿画面冒称输入焦点验收。

### 23. tutorial-live · light · tablet

原图 [screens/website/chromium/000014-6-tutorial-live-viewport-1.png](screens/website/chromium/000014-6-tutorial-live-viewport-1.png)；768×1024；SHA256 `adf426e6e82a90eed80e15c057c82595e010eac7f5042420e5c48b492e65b2f2`。

case `0e4135bc36f1ba174212-479efa30ca063fc21ab6/chromium/0`；worker 1；native attachment 6 tutorial-live-viewport-1同字节。初始shadcn/light → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色教程第2步表单：姓名“周宁 教学草稿”、邮箱lin@example.com及待提交摘要一致，文字可读。
- 768×1024编辑卡片完整，上一步/下一步可见，正文和常见问题仅视口内部分。
- 自然序列第2/3帧，目标动画集合为空；本组三帧同字节。姓名输入未显示外焦点环，不把保留草稿画面冒称输入焦点验收。

### 24. tutorial-live · light · tablet

原图 [screens/website/chromium/000014-7-tutorial-live-viewport-2.png](screens/website/chromium/000014-7-tutorial-live-viewport-2.png)；768×1024；SHA256 `adf426e6e82a90eed80e15c057c82595e010eac7f5042420e5c48b492e65b2f2`。

case `0e4135bc36f1ba174212-479efa30ca063fc21ab6/chromium/0`；worker 1；native attachment 7 tutorial-live-viewport-2同字节。初始shadcn/light → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色教程第2步表单：姓名“周宁 教学草稿”、邮箱lin@example.com及待提交摘要一致，文字可读。
- 768×1024编辑卡片完整，上一步/下一步可见，正文和常见问题仅视口内部分。
- 自然序列第3/3帧，目标动画集合为空；本组三帧同字节。姓名输入未显示外焦点环，不把保留草稿画面冒称输入焦点验收。

### 25. tutorial-live · light · desktop

原图 [screens/website/chromium/000015-5-tutorial-live-viewport-0.png](screens/website/chromium/000015-5-tutorial-live-viewport-0.png)；1440×900；SHA256 `4e2af2411d93a52d25b825c6d16340219dd527103da71f7588a7a8c811e63b21`。

case `0e4135bc36f1ba174212-4c56f6639c0848cf937a/chromium/0`；worker 0；native attachment 5 tutorial-live-viewport-0同字节。初始shadcn/light → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色教程第2步表单：姓名“周宁 教学草稿”、邮箱lin@example.com及待提交摘要一致，文字可读。
- 1440×900编辑卡片、左右导航、上下步按钮可见；顶部文章标题部分在sticky header后/视口外，不能称整页。
- 自然序列第1/3帧，目标动画集合为空；右侧目录“常见问题”底色比后2帧稍浅。姓名输入未显示外焦点环，不把保留草稿画面冒称输入焦点验收。

### 26. tutorial-live · light · desktop

原图 [screens/website/chromium/000015-6-tutorial-live-viewport-1.png](screens/website/chromium/000015-6-tutorial-live-viewport-1.png)；1440×900；SHA256 `4ef9902d9534b2b5e2ae61ababfcf82028c0aea9aaa85ba0c8033c46a855a5ec`。

case `0e4135bc36f1ba174212-4c56f6639c0848cf937a/chromium/0`；worker 0；native attachment 6 tutorial-live-viewport-1同字节。初始shadcn/light → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色教程第2步表单：姓名“周宁 教学草稿”、邮箱lin@example.com及待提交摘要一致，文字可读。
- 1440×900编辑卡片、左右导航、上下步按钮可见；顶部文章标题部分在sticky header后/视口外，不能称整页。
- 自然序列第2/3帧，目标动画集合为空；右侧目录“常见问题”底色比第1帧稍深。姓名输入未显示外焦点环，不把保留草稿画面冒称输入焦点验收。

### 27. tutorial-live · light · desktop

原图 [screens/website/chromium/000015-7-tutorial-live-viewport-2.png](screens/website/chromium/000015-7-tutorial-live-viewport-2.png)；1440×900；SHA256 `4ef9902d9534b2b5e2ae61ababfcf82028c0aea9aaa85ba0c8033c46a855a5ec`。

case `0e4135bc36f1ba174212-4c56f6639c0848cf937a/chromium/0`；worker 0；native attachment 7 tutorial-live-viewport-2同字节。初始shadcn/light → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色教程第2步表单：姓名“周宁 教学草稿”、邮箱lin@example.com及待提交摘要一致，文字可读。
- 1440×900编辑卡片、左右导航、上下步按钮可见；顶部文章标题部分在sticky header后/视口外，不能称整页。
- 自然序列第3/3帧，目标动画集合为空；右侧目录“常见问题”底色比第1帧稍深。姓名输入未显示外焦点环，不把保留草稿画面冒称输入焦点验收。

### 28. tutorial-live · dark · narrow

原图 [screens/website/chromium/000016-5-tutorial-live-viewport-0.png](screens/website/chromium/000016-5-tutorial-live-viewport-0.png)；320×768；SHA256 `1e1e25b5988a468ed04054d9af82e191de9d5fd72a8186d446f00cc74cf07cb6`。

case `0e4135bc36f1ba174212-1d6cff7dfe37e725982b/chromium/0`；worker 1；native attachment 5 tutorial-live-viewport-0同字节。初始shadcn/dark → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色教程第2步表单：姓名“周宁 教学草稿”、邮箱lin@example.com及待提交摘要一致，文字可读。
- 320×768只含当前滚动视口，摘要自然换两行；上方正文和下方其他教程未纳入画面。
- 自然序列第1/3帧，目标动画集合为空；本组三帧同字节。姓名输入未显示外焦点环，不把保留草稿画面冒称输入焦点验收。

### 29. tutorial-live · dark · narrow

原图 [screens/website/chromium/000016-6-tutorial-live-viewport-1.png](screens/website/chromium/000016-6-tutorial-live-viewport-1.png)；320×768；SHA256 `1e1e25b5988a468ed04054d9af82e191de9d5fd72a8186d446f00cc74cf07cb6`。

case `0e4135bc36f1ba174212-1d6cff7dfe37e725982b/chromium/0`；worker 1；native attachment 6 tutorial-live-viewport-1同字节。初始shadcn/dark → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色教程第2步表单：姓名“周宁 教学草稿”、邮箱lin@example.com及待提交摘要一致，文字可读。
- 320×768只含当前滚动视口，摘要自然换两行；上方正文和下方其他教程未纳入画面。
- 自然序列第2/3帧，目标动画集合为空；本组三帧同字节。姓名输入未显示外焦点环，不把保留草稿画面冒称输入焦点验收。

### 30. tutorial-live · dark · narrow

原图 [screens/website/chromium/000016-7-tutorial-live-viewport-2.png](screens/website/chromium/000016-7-tutorial-live-viewport-2.png)；320×768；SHA256 `1e1e25b5988a468ed04054d9af82e191de9d5fd72a8186d446f00cc74cf07cb6`。

case `0e4135bc36f1ba174212-1d6cff7dfe37e725982b/chromium/0`；worker 1；native attachment 7 tutorial-live-viewport-2同字节。初始shadcn/dark → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色教程第2步表单：姓名“周宁 教学草稿”、邮箱lin@example.com及待提交摘要一致，文字可读。
- 320×768只含当前滚动视口，摘要自然换两行；上方正文和下方其他教程未纳入画面。
- 自然序列第3/3帧，目标动画集合为空；本组三帧同字节。姓名输入未显示外焦点环，不把保留草稿画面冒称输入焦点验收。

### 31. tutorial-live · dark · tablet

原图 [screens/website/chromium/000017-5-tutorial-live-viewport-0.png](screens/website/chromium/000017-5-tutorial-live-viewport-0.png)；768×1024；SHA256 `0b2786d36c4e3bfcacc65f55420f1cf70741fc89db7c8faea185a1a0d805e9bc`。

case `0e4135bc36f1ba174212-75c4f1e9946303a5f8c8/chromium/0`；worker 0；native attachment 5 tutorial-live-viewport-0同字节。初始shadcn/dark → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色教程第2步表单：姓名“周宁 教学草稿”、邮箱lin@example.com及待提交摘要一致，文字可读。
- 768×1024编辑卡片完整，上一步/下一步可见，正文和常见问题仅视口内部分。
- 自然序列第1/3帧，目标动画集合为空；本组三帧同字节。姓名输入未显示外焦点环，不把保留草稿画面冒称输入焦点验收。

### 32. tutorial-live · dark · tablet

原图 [screens/website/chromium/000017-6-tutorial-live-viewport-1.png](screens/website/chromium/000017-6-tutorial-live-viewport-1.png)；768×1024；SHA256 `0b2786d36c4e3bfcacc65f55420f1cf70741fc89db7c8faea185a1a0d805e9bc`。

case `0e4135bc36f1ba174212-75c4f1e9946303a5f8c8/chromium/0`；worker 0；native attachment 6 tutorial-live-viewport-1同字节。初始shadcn/dark → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色教程第2步表单：姓名“周宁 教学草稿”、邮箱lin@example.com及待提交摘要一致，文字可读。
- 768×1024编辑卡片完整，上一步/下一步可见，正文和常见问题仅视口内部分。
- 自然序列第2/3帧，目标动画集合为空；本组三帧同字节。姓名输入未显示外焦点环，不把保留草稿画面冒称输入焦点验收。

### 33. tutorial-live · dark · tablet

原图 [screens/website/chromium/000017-7-tutorial-live-viewport-2.png](screens/website/chromium/000017-7-tutorial-live-viewport-2.png)；768×1024；SHA256 `0b2786d36c4e3bfcacc65f55420f1cf70741fc89db7c8faea185a1a0d805e9bc`。

case `0e4135bc36f1ba174212-75c4f1e9946303a5f8c8/chromium/0`；worker 0；native attachment 7 tutorial-live-viewport-2同字节。初始shadcn/dark → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色教程第2步表单：姓名“周宁 教学草稿”、邮箱lin@example.com及待提交摘要一致，文字可读。
- 768×1024编辑卡片完整，上一步/下一步可见，正文和常见问题仅视口内部分。
- 自然序列第3/3帧，目标动画集合为空；本组三帧同字节。姓名输入未显示外焦点环，不把保留草稿画面冒称输入焦点验收。

### 34. tutorial-live · dark · desktop

原图 [screens/website/chromium/000018-5-tutorial-live-viewport-0.png](screens/website/chromium/000018-5-tutorial-live-viewport-0.png)；1440×900；SHA256 `162940f301a481e08f2e324120432ac8ec77f4d016202a40af2a6b2814eb2958`。

case `0e4135bc36f1ba174212-050b8614ff43f7861293/chromium/0`；worker 1；native attachment 5 tutorial-live-viewport-0同字节。初始shadcn/dark → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色教程第2步表单：姓名“周宁 教学草稿”、邮箱lin@example.com及待提交摘要一致，文字可读。
- 1440×900编辑卡片、左右导航、上下步按钮可见；顶部文章标题部分在sticky header后/视口外，不能称整页。
- 自然序列第1/3帧，目标动画集合为空；本组三帧同字节。姓名输入未显示外焦点环，不把保留草稿画面冒称输入焦点验收。

### 35. tutorial-live · dark · desktop

原图 [screens/website/chromium/000018-6-tutorial-live-viewport-1.png](screens/website/chromium/000018-6-tutorial-live-viewport-1.png)；1440×900；SHA256 `162940f301a481e08f2e324120432ac8ec77f4d016202a40af2a6b2814eb2958`。

case `0e4135bc36f1ba174212-050b8614ff43f7861293/chromium/0`；worker 1；native attachment 6 tutorial-live-viewport-1同字节。初始shadcn/dark → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色教程第2步表单：姓名“周宁 教学草稿”、邮箱lin@example.com及待提交摘要一致，文字可读。
- 1440×900编辑卡片、左右导航、上下步按钮可见；顶部文章标题部分在sticky header后/视口外，不能称整页。
- 自然序列第2/3帧，目标动画集合为空；本组三帧同字节。姓名输入未显示外焦点环，不把保留草稿画面冒称输入焦点验收。

### 36. tutorial-live · dark · desktop

原图 [screens/website/chromium/000018-7-tutorial-live-viewport-2.png](screens/website/chromium/000018-7-tutorial-live-viewport-2.png)；1440×900；SHA256 `162940f301a481e08f2e324120432ac8ec77f4d016202a40af2a6b2814eb2958`。

case `0e4135bc36f1ba174212-050b8614ff43f7861293/chromium/0`；worker 1；native attachment 7 tutorial-live-viewport-2同字节。初始shadcn/dark → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色教程第2步表单：姓名“周宁 教学草稿”、邮箱lin@example.com及待提交摘要一致，文字可读。
- 1440×900编辑卡片、左右导航、上下步按钮可见；顶部文章标题部分在sticky header后/视口外，不能称整页。
- 自然序列第3/3帧，目标动画集合为空；本组三帧同字节。姓名输入未显示外焦点环，不把保留草稿画面冒称输入焦点验收。

### 37. mobile-navigation · light · narrow

原图 [screens/website/chromium/000031-1-actual.png](screens/website/chromium/000031-1-actual.png)；320×768；SHA256 `d91f07db72caa107b70fea70b853931d16fcad80e55c79812056e1f9c4676dba`。

case `23c228f2ffdd18452a42-54e1d468923ae5612fc1/chromium/0`；worker 2；native attachment 1 actual同字节。初始shadcn/light → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色320×768导航抽屉，左面板约256px，标题/关闭X、分组箭头及首页选中底色清楚；右侧原页面被遮罩。
- 抽屉画面内无明显截断导航项；本截图不显示Escape之后的触发器返回焦点，返回焦点由原生断言另证。
- 仅当前视口；背景被遮挡部分不作内容验收。

### 38. search-results · light · narrow

原图 [screens/website/chromium/000031-3-actual.png](screens/website/chromium/000031-3-actual.png)；320×768；SHA256 `ab614b518bf9c62067dbf0864e89059abb660911e5135de6257bf165bd21696e`。

case `23c228f2ffdd18452a42-54e1d468923ae5612fc1/chromium/0`；worker 2；native attachment 3 actual同字节。初始shadcn/light → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色320×768搜索对话框，LineEdit查询框外焦点边界完整，第一项“LineEdit 单行输入框”选中底色与Enter图标清楚，其他结果没有相同选中底色。
- 320窄屏标题/摘要自然换行和省略，结果列表末项只见上部，内部视口截断合理；关闭/打开文档按钮均在画面内。
- 截图证明当前首项外观和输入焦点边界；ArrowDown→第二项→ArrowUp→首项、唯一选中、aria-activedescendant和Enter导航后的正文焦点分别依据原生断言，不从单图推断完整过程。

### 39. mobile-navigation · light · tablet

原图 [screens/website/chromium/000032-1-actual.png](screens/website/chromium/000032-1-actual.png)；768×1024；SHA256 `6b2db60466aac69f283291ff7842adf27bde36e6b6a951d3d5f26481cfe504a7`。

case `23c228f2ffdd18452a42-f8e49efcc1280cae33c9/chromium/0`；worker 3；native attachment 1 actual同字节。初始shadcn/light → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色768×1024导航抽屉，左面板约256px，标题/关闭X、分组箭头及首页选中底色清楚；右侧原页面被遮罩。
- 抽屉画面内无明显截断导航项；本截图不显示Escape之后的触发器返回焦点，返回焦点由原生断言另证。
- 仅当前视口；背景被遮挡部分不作内容验收。

### 40. search-results · light · tablet

原图 [screens/website/chromium/000032-3-actual.png](screens/website/chromium/000032-3-actual.png)；768×1024；SHA256 `b18ec5407b88bfe977cca30dc9678313425af1eb76d3ce94f2f9c78bad86b290`。

case `23c228f2ffdd18452a42-f8e49efcc1280cae33c9/chromium/0`；worker 3；native attachment 3 actual同字节。初始shadcn/light → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色768×1024搜索对话框，LineEdit查询框外焦点边界完整，第一项“LineEdit 单行输入框”选中底色与Enter图标清楚，其他结果没有相同选中底色。
- 查询框/结果/底部键盘提示、关闭/打开文档按钮均在视口内；结果列表末项在内部视口底部截断，只认可可见结果部分。
- 截图证明当前首项外观和输入焦点边界；ArrowDown→第二项→ArrowUp→首项、唯一选中、aria-activedescendant和Enter导航后的正文焦点分别依据原生断言，不从单图推断完整过程。

### 41. search-results · light · desktop

原图 [screens/website/chromium/000033-1-actual.png](screens/website/chromium/000033-1-actual.png)；1440×900；SHA256 `f96c743c0f2b84237e3d13af9b9f3a6aee6cabff5768e3c0c63e470ebbaec68c`。

case `23c228f2ffdd18452a42-4129b12dad16f2d3d0dd/chromium/0`；worker 2；native attachment 1 actual同字节。初始shadcn/light → 实际shadcn/light。原生passed；人工结论仅接受可见视口。

- 浅色1440×900搜索对话框，LineEdit查询框外焦点边界完整，第一项“LineEdit 单行输入框”选中底色与Enter图标清楚，其他结果没有相同选中底色。
- 查询框/结果/底部键盘提示、关闭/打开文档按钮均在视口内；结果列表末项在内部视口底部截断，只认可可见结果部分。
- 截图证明当前首项外观和输入焦点边界；ArrowDown→第二项→ArrowUp→首项、唯一选中、aria-activedescendant和Enter导航后的正文焦点分别依据原生断言，不从单图推断完整过程。

### 42. mobile-navigation · dark · narrow

原图 [screens/website/chromium/000034-1-actual.png](screens/website/chromium/000034-1-actual.png)；320×768；SHA256 `ea54d4fc61760a30314d0225a130c791f49944f7a4b21b2596bebdee3bbe1ac7`。

case `23c228f2ffdd18452a42-cb3dc2d6d5ffa1f0cac2/chromium/0`；worker 3；native attachment 1 actual同字节。初始shadcn/dark → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色320×768导航抽屉，左面板约256px，标题/关闭X、分组箭头及首页选中底色清楚；右侧原页面被遮罩。
- 抽屉画面内无明显截断导航项；本截图不显示Escape之后的触发器返回焦点，返回焦点由原生断言另证。
- 仅当前视口；背景被遮挡部分不作内容验收。

### 43. search-results · dark · narrow

原图 [screens/website/chromium/000034-3-actual.png](screens/website/chromium/000034-3-actual.png)；320×768；SHA256 `d1790588c7c3da06a47704a27a86fbcedc1ff8d58589bba12600ea6015008ec9`。

case `23c228f2ffdd18452a42-cb3dc2d6d5ffa1f0cac2/chromium/0`；worker 3；native attachment 3 actual同字节。初始shadcn/dark → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色320×768搜索对话框，LineEdit查询框外焦点边界完整，第一项“LineEdit 单行输入框”选中底色与Enter图标清楚，其他结果没有相同选中底色。
- 320窄屏标题/摘要自然换行和省略，结果列表末项只见上部，内部视口截断合理；关闭/打开文档按钮均在画面内。
- 截图证明当前首项外观和输入焦点边界；ArrowDown→第二项→ArrowUp→首项、唯一选中、aria-activedescendant和Enter导航后的正文焦点分别依据原生断言，不从单图推断完整过程。

### 44. mobile-navigation · dark · tablet

原图 [screens/website/chromium/000035-1-actual.png](screens/website/chromium/000035-1-actual.png)；768×1024；SHA256 `f962ae429f62a9b6855f0f17d27e97ed0d872e641157e8d14050f1f90bb7235e`。

case `23c228f2ffdd18452a42-d64878a3d566f33d0142/chromium/0`；worker 2；native attachment 1 actual同字节。初始shadcn/dark → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色768×1024导航抽屉，左面板约256px，标题/关闭X、分组箭头及首页选中底色清楚；右侧原页面被遮罩。
- 抽屉画面内无明显截断导航项；本截图不显示Escape之后的触发器返回焦点，返回焦点由原生断言另证。
- 仅当前视口；背景被遮挡部分不作内容验收。

### 45. search-results · dark · tablet

原图 [screens/website/chromium/000035-3-actual.png](screens/website/chromium/000035-3-actual.png)；768×1024；SHA256 `ec4e3f994c2eaeac31d76c083c0716b9c1e434574354aa4fa2ef66975f550a59`。

case `23c228f2ffdd18452a42-d64878a3d566f33d0142/chromium/0`；worker 2；native attachment 3 actual同字节。初始shadcn/dark → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色768×1024搜索对话框，LineEdit查询框外焦点边界完整，第一项“LineEdit 单行输入框”选中底色与Enter图标清楚，其他结果没有相同选中底色。
- 查询框/结果/底部键盘提示、关闭/打开文档按钮均在视口内；结果列表末项在内部视口底部截断，只认可可见结果部分。
- 截图证明当前首项外观和输入焦点边界；ArrowDown→第二项→ArrowUp→首项、唯一选中、aria-activedescendant和Enter导航后的正文焦点分别依据原生断言，不从单图推断完整过程。

### 46. search-results · dark · desktop

原图 [screens/website/chromium/000036-1-actual.png](screens/website/chromium/000036-1-actual.png)；1440×900；SHA256 `5b2a3409fb8fdcd4094ca330224b3f5b7d54c2793748396ddd2219b82184c68f`。

case `23c228f2ffdd18452a42-e09b21e279b0f8edfc8d/chromium/0`；worker 3；native attachment 1 actual同字节。初始shadcn/dark → 实际shadcn/dark。原生passed；人工结论仅接受可见视口。

- 暗色1440×900搜索对话框，LineEdit查询框外焦点边界完整，第一项“LineEdit 单行输入框”选中底色与Enter图标清楚，其他结果没有相同选中底色。
- 查询框/结果/底部键盘提示、关闭/打开文档按钮均在视口内；结果列表末项在内部视口底部截断，只认可可见结果部分。
- 截图证明当前首项外观和输入焦点边界；ArrowDown→第二项→ArrowUp→首项、唯一选中、aria-activedescendant和Enter导航后的正文焦点分别依据原生断言，不从单图推断完整过程。

## 自然序列

- 原图1/2/3：appearance-live dark/narrow；首帧running=2，clock推进=true，唯一PNG=1，实际可见spinner变化=false。Running controls are outside current captured viewport; identical frames do not show their appearance/motion.
- 原图4/5/6：appearance-live dark/tablet；首帧running=2，clock推进=true，唯一PNG=3，实际可见spinner变化=true。Visible spinner angle changed between three unmodified samples; three frames are not full animation/video playback.
- 原图7/8/9：appearance-live dark/desktop；首帧running=2，clock推进=true，唯一PNG=3，实际可见spinner变化=true。Visible spinner angle changed between three unmodified samples; three frames are not full animation/video playback.
- 原图10/11/12：appearance-live light/narrow；首帧running=2，clock推进=true，唯一PNG=1，实际可见spinner变化=false。Running controls are outside current captured viewport; identical frames do not show their appearance/motion.
- 原图13/14/15：appearance-live light/tablet；首帧running=2，clock推进=true，唯一PNG=3，实际可见spinner变化=true。Visible spinner angle changed between three unmodified samples; three frames are not full animation/video playback.
- 原图16/17/18：appearance-live light/desktop；首帧running=2，clock推进=true，唯一PNG=3，实际可见spinner变化=true。Visible spinner angle changed between three unmodified samples; three frames are not full animation/video playback.
- 原图19/20/21：tutorial-live light/narrow；首帧running=0，clock推进=不适用（空动画集合），唯一PNG=1，实际可见spinner变化=false。No ongoing animation in target; empty timing arrays do not evidence motion.
- 原图22/23/24：tutorial-live light/tablet；首帧running=0，clock推进=不适用（空动画集合），唯一PNG=1，实际可见spinner变化=false。No ongoing animation in target; empty timing arrays do not evidence motion.
- 原图25/26/27：tutorial-live light/desktop；首帧running=0，clock推进=不适用（空动画集合），唯一PNG=2，实际可见spinner变化=false。No ongoing animation in target; empty timing arrays do not evidence motion.
- 原图28/29/30：tutorial-live dark/narrow；首帧running=0，clock推进=不适用（空动画集合），唯一PNG=1，实际可见spinner变化=false。No ongoing animation in target; empty timing arrays do not evidence motion.
- 原图31/32/33：tutorial-live dark/tablet；首帧running=0，clock推进=不适用（空动画集合），唯一PNG=1，实际可见spinner变化=false。No ongoing animation in target; empty timing arrays do not evidence motion.
- 原图34/35/36：tutorial-live dark/desktop；首帧running=0，clock推进=不适用（空动画集合），唯一PNG=1，实际可见spinner变化=false。No ongoing animation in target; empty timing arrays do not evidence motion.

## 已有视频取样（未完整播放）

解码器 `n7.0.1-playwright-build-1013`，SHA256 `7ccd7bbff94976033f130c802c5aa40801f640d0e7dfb7de12984e88133f329b`。仅读取原WebM，输出PNG无缩放/裁切/编辑；原生视频本身800×450且带灰色未用画布，不能替代全分辨率PNG字体或几何证据。每段跨越两个体系/阶段，不以初始case名称分类整段。

### 视频1 · 初始apple/light/narrow

[原视频](report/data/75fb039ee192daf9d44439e1275106cb56cdbb19.webm)；7.36s；SHA256 `c143abf1f322fd5ac10e9df8eb875ccad976123c8402c1b211e114fa1af1c598`；原生/报告副本一致。只看3个解码瞬间，完整播放=false。

- 1.84s：1.840s浅色表单与打开的设计菜单，选择项蓝色高亮，属于转换过程而非最终shadcn帧。 解码PNG SHA256 `6dd02c164b0c2fbd40290226687936fd8e547da25230b7cbe45d917a0764fa66`，文件 `.tmp/site-shadcn-video-samples-20261030/video-01-25.png`。
- 4.048s：4.048s暗色教程顶部，资料编辑表单标题及步骤导航可见。 解码PNG SHA256 `4c92e2d0c40e86d5a8b05fcb388899cd970c6e2e536b569994c96e8a3686ec9b`，文件 `.tmp/site-shadcn-video-samples-20261030/video-01-55.png`。
- 6.256s：6.256s浅色教程已切第2步，姓名/邮箱局部；不是全部教程画面。 解码PNG SHA256 `c6e56843341e7a27da223f295954c7ef8f04168100dc11c949552ab801bdd3cd`，文件 `.tmp/site-shadcn-video-samples-20261030/video-01-85.png`。

### 视频2 · 初始apple/light/tablet

[原视频](report/data/4c28d17c674a37078e3f2329923d4390e710015a.webm)；7.52s；SHA256 `5150a4bbd2b0a4990c2b6f52aef3876a72eea2d422c2f800569c988092e20f32`；原生/报告副本一致。只看3个解码瞬间，完整播放=false。

- 1.88s：1.880s浅色操作/输入卡片与设计/主题菜单，转换过程。 解码PNG SHA256 `8b3e2e1b54f1022e0b0905c14546c0816132b5a3c83588cb695ab88fe1342248`，文件 `.tmp/site-shadcn-video-samples-20261030/video-02-25.png`。
- 4.136s：4.136s暗色站点“正在加载文档…”短暂页面；最终原PNG已加载完成，不能拿此中间态替代最终断言。 解码PNG SHA256 `eec1538ff8a9c6b3f24f032a9fd43196880da39f79c1b0e883ba5c5590cb25dc`，文件 `.tmp/site-shadcn-video-samples-20261030/video-02-55.png`。
- 6.392s：6.392s浅色教程第二步/表单上半，视口下方内容不可见。 解码PNG SHA256 `e212f86e16db575b3844bcec1d4502af3d5667aa8c8d0f1ad9724a73015d07ca`，文件 `.tmp/site-shadcn-video-samples-20261030/video-02-85.png`。

### 视频3 · 初始apple/light/desktop

[原视频](report/data/ec378df243066d0b92fa7ce507949a3966a87fee.webm)；7.8s；SHA256 `372bbc56713a0840c4bc8e0ae703ad0e27c16e9db209a5df2532efa40b3cf694`；原生/报告副本一致。只看3个解码瞬间，完整播放=false。

- 1.95s：1.950s浅色桌面设计菜单，shadcn有勾而Apple项蓝色高亮（转换中，不把高亮当渲染体系证据）。 解码PNG SHA256 `ae55e463611aeb28ab5d4363c4172698a3b5e48794faad7d4904cad636093ee0`，文件 `.tmp/site-shadcn-video-samples-20261030/video-03-25.png`。
- 4.29s：4.290s暗色教程加载中间态。 解码PNG SHA256 `8659762e4dcc83ee9817efc590f582edc3988659854db6a000cfe48845537f11`，文件 `.tmp/site-shadcn-video-samples-20261030/video-03-55.png`。
- 6.63s：6.630s浅色教程第2步，姓名框和编辑卡片上半可见。 解码PNG SHA256 `835f8c77b0757d7207c0a22dee5086ce4eb1233fb6eb5663748f42f6c2119c60`，文件 `.tmp/site-shadcn-video-samples-20261030/video-03-85.png`。

### 视频4 · 初始apple/dark/narrow

[原视频](report/data/083c2bd245e11dc8379cdc2fb477a3c9e7146141.webm)；7.64s；SHA256 `63c2045a572d8953badd7beabcc4d355e8bdb5095901bd0bec2b1db93bf769f8`；原生/报告副本一致。只看3个解码瞬间，完整播放=false。

- 1.91s：1.910s暗色窄屏表单与设计菜单，shadcn有勾、Apple高亮。 解码PNG SHA256 `5866cc6bc28f77bec36a86796891a5d6fe59a7eb682aed62bdb3bc593bcec2a2`，文件 `.tmp/site-shadcn-video-samples-20261030/video-04-25.png`。
- 4.202s：4.202s浅色文档加载中间态。 解码PNG SHA256 `65e7e9e6c847532334d79fa8435d73612c735470b9da7caf6d0796d17f331e32`，文件 `.tmp/site-shadcn-video-samples-20261030/video-04-55.png`。
- 6.494s：6.494s暗色教程第2步及姓名框局部，可见草稿文字。 解码PNG SHA256 `d685b8afac482b2e12a433100cb4a30045609ac123f310748e325ef1a5a91bd8`，文件 `.tmp/site-shadcn-video-samples-20261030/video-04-85.png`。

### 视频5 · 初始apple/dark/tablet

[原视频](report/data/8fcb312a39c0231f34764a6127ffe70f98afc4be.webm)；7.84s；SHA256 `8db3a215856ea9a5005c8c49d806c99c3506a95d21e9e7c4d424d161a9d62fd2`；原生/报告副本一致。只看3个解码瞬间，完整播放=false。

- 1.96s：1.960s暗色表单、打开的外观菜单，蓝色按钮/选择项处于切换过程。 解码PNG SHA256 `4720393c64094e66ca215e343ea438d0c3329c0b18f85d5715743b8e410845ce`，文件 `.tmp/site-shadcn-video-samples-20261030/video-05-25.png`。
- 4.312s：4.312s浅色文档加载中间态。 解码PNG SHA256 `818b37d01a77ee32b0db6633b73745d2743443d6f9d1662ac0ac54e6fa411964`，文件 `.tmp/site-shadcn-video-samples-20261030/video-05-55.png`。
- 6.664s：6.664s暗色教程第2步，上半表单与姓名草稿可见。 解码PNG SHA256 `7acb03d2eec56bcf3ff91c271f3d6984d4fa13bb31f9fc3bf6fa5efd730d7523`，文件 `.tmp/site-shadcn-video-samples-20261030/video-05-85.png`。

### 视频6 · 初始apple/dark/desktop

[原视频](report/data/5789017d9ca93caedd8e8d58f586039a82925ea2.webm)；7.64s；SHA256 `f051559c0350aa80ef611afaabcac4d1f672ffba34efb74f4ec44a42de666f8c`；原生/报告副本一致。只看3个解码瞬间，完整播放=false。

- 1.91s：1.910s暗色桌面表单与外观菜单，非最终shadcn截图。 解码PNG SHA256 `c7b7a492e5efe258f5d843ad1086c1ba6341d7a040825f1a5fb0e1d610c890eb`，文件 `.tmp/site-shadcn-video-samples-20261030/video-06-25.png`。
- 4.202s：4.202s浅色文档加载中间态，侧栏已出现。 解码PNG SHA256 `b69830703e956759e18f0cf4d62bb459872572f0880124460a76d630fddfac4a`，文件 `.tmp/site-shadcn-video-samples-20261030/video-06-55.png`。
- 6.494s：6.494s暗色教程第2步，上半表单/姓名框。 解码PNG SHA256 `be17ba0da38ab9df8e0f9ea23281c168c87b9b10d48ea8873260d3d32231dce6`，文件 `.tmp/site-shadcn-video-samples-20261030/video-06-85.png`。

### 视频7 · 初始shadcn/light/narrow

[原视频](report/data/6e0d32f441c202542162e76c51c198c1101e65d1.webm)；8.36s；SHA256 `9e7003f95fdbf6c6761b07df30f14641b7c0505abb376dad520c8f0050f7e91f`；原生/报告副本一致。只看3个解码瞬间，完整播放=false。

- 2.09s：2.090s浅色表单和正在收起/变化的外观菜单，色调带紫，转换过程不能算最终shadcn。 解码PNG SHA256 `3c3edebbd49eddb5bb536d5d6a56a986351c8f6c5bae842a98df499c6fd5e93e`，文件 `.tmp/site-shadcn-video-samples-20261030/video-07-25.png`。
- 4.598s：4.598s暗紫文档加载中间态。 解码PNG SHA256 `eaa0a988e0487d791c509cf10c7cdc41a655aec1724ce4dee04b6da19fd7679e`，文件 `.tmp/site-shadcn-video-samples-20261030/video-07-55.png`。
- 7.106s：7.106s恢复shadcn/light教程表单，姓名/邮箱/摘要和复制源码区可见，与原PNG相同阶段但视频分辨率更小。 解码PNG SHA256 `628abd26ce41382e694a97905dba5bffd1cf726419b595bfa899c9b787636958`，文件 `.tmp/site-shadcn-video-samples-20261030/video-07-85.png`。

### 视频8 · 初始shadcn/light/tablet

[原视频](report/data/a856a8b540dff77e24b5025c3d46ed6dd5b95b46.webm)；8.52s；SHA256 `7164c3d3a23eff055796e77a1177b55911b84089e10907ebdedcb2e8b6fbf717`；原生/报告副本一致。只看3个解码瞬间，完整播放=false。

- 2.13s：2.130s浅色设计菜单MD3项有勾，表单切换过程。 解码PNG SHA256 `c4a0e868da45c5a3fea33c6e56cbd00656a4eefbdb6b2e95146d969b406d2ee4`，文件 `.tmp/site-shadcn-video-samples-20261030/video-08-25.png`。
- 4.686s：4.686s暗色文档加载中间态。 解码PNG SHA256 `5d11609bdfef95008073bcd24f2a007cb2265c793eabc8c250d67cb3e241e3fb`，文件 `.tmp/site-shadcn-video-samples-20261030/video-08-55.png`。
- 7.242s：7.242s恢复浅色教程第二步，姓名/邮箱及摘要完整可见，上/下一步在画面内。 解码PNG SHA256 `520bbd31b4fdfd8d5f445ceae8d8bf0a55aa9a16009bc42ef04291f085bf65d6`，文件 `.tmp/site-shadcn-video-samples-20261030/video-08-85.png`。

### 视频9 · 初始shadcn/light/desktop

[原视频](report/data/754326fd534c06e4e555b0cf9bfd423735a8d10d.webm)；8.64s；SHA256 `dfc074bc07741363cb93fc089cdf4fb13ea75696b8dee2c509e7aa5632a8804e`；原生/报告副本一致。只看3个解码瞬间，完整播放=false。

- 2.16s：2.160s浅紫表单与桌面MD3竖导航布局切换，非最终shadcn。 解码PNG SHA256 `6bbcff2847f4657b884fba61bf0d43e51b3748ed096d3dfdca11d872e80b320c`，文件 `.tmp/site-shadcn-video-samples-20261030/video-09-25.png`。
- 4.752s：4.752s暗紫教程加载中间态。 解码PNG SHA256 `c043ba9d7643180d6127a1f34317603171409e1cc4f5176a9b60dd171ae19d0e`，文件 `.tmp/site-shadcn-video-samples-20261030/video-09-55.png`。
- 7.344s：7.344s恢复shadcn/light桌面教程，姓名/邮箱/摘要及上下一步完整可见。 解码PNG SHA256 `566d28a121802f8ada3a51c6c18ad3b011c0e81e6e9662556ae811c2dafc3c75`，文件 `.tmp/site-shadcn-video-samples-20261030/video-09-85.png`。

### 视频10 · 初始shadcn/dark/narrow

[原视频](report/data/901fc343f24421f00f81bbe78603c39ecc597a78.webm)；9.12s；SHA256 `fbb8ad7703aeee1b3ceb4a8a7493bffacd26bc5ab18299ebf53e2a2c2fbdaac3`；原生/报告副本一致。只看3个解码瞬间，完整播放=false。

- 2.28s：2.280s暗紫窄屏表单，切换过程。 解码PNG SHA256 `bdc3ecd7d35f523772278798db6c09cf46af60ae9aaec0e4824e243acaa46f39`，文件 `.tmp/site-shadcn-video-samples-20261030/video-10-25.png`。
- 5.016s：5.016s浅紫文档加载中间态。 解码PNG SHA256 `24f955467eaa396915b71ee352840b28bbf41f1fbe97cee953d168f1111d0c9b`，文件 `.tmp/site-shadcn-video-samples-20261030/video-10-55.png`。
- 7.752s：7.752s恢复shadcn/dark教程，姓名/邮箱/摘要和复制源码区可见。 解码PNG SHA256 `2ef47cb2d11e0a5ccec6cd0e53c311a8eb43ae77d3b747e2d0b7befb17fed7e7`，文件 `.tmp/site-shadcn-video-samples-20261030/video-10-85.png`。

### 视频11 · 初始shadcn/dark/tablet

[原视频](report/data/015846855fe9405e685f57cb062fea1631e9ec43.webm)；8.68s；SHA256 `0e7cbb92a95ac1bb905d79a60c91b0b9d105841a5208326524d290c6585b8f29`；原生/报告副本一致。只看3个解码瞬间，完整播放=false。

- 2.17s：2.170s暗紫平板表单，转换过程，项目名/说明与选择组可见。 解码PNG SHA256 `8b333a63be24d0356b0660fdade5d8d5e48e3010ec430fe395c181b66f52feac`，文件 `.tmp/site-shadcn-video-samples-20261030/video-11-25.png`。
- 4.774s：4.774s浅紫文档加载中间态。 解码PNG SHA256 `44136e87f2bf26b5da85c75d1811bc9bb5833763c5764fb3d6c4f39beac0fc97`，文件 `.tmp/site-shadcn-video-samples-20261030/video-11-55.png`。
- 7.378s：7.378s恢复shadcn/dark平板教程，姓名/邮箱/摘要和按钮可见。 解码PNG SHA256 `711a30e29d49120bb18c43bf4848a32f62b48f34ad1f2f67dc5c89f255dfa461`，文件 `.tmp/site-shadcn-video-samples-20261030/video-11-85.png`。

### 视频12 · 初始shadcn/dark/desktop

[原视频](report/data/fd394ee1fbf4a94e81813c9198f0376556ebd6b3.webm)；9.12s；SHA256 `4e9068f0450e6218e9e061175971fbcaddf2f0f235a5ba64eca7488884778878`；原生/报告副本一致。只看3个解码瞬间，完整播放=false。

- 2.28s：2.280s暗紫桌面表单/MD3竖导航，转换过程。 解码PNG SHA256 `dc142590ee898a87d1d05c26cc946ca76b1d1fb8b7b08ccea0776f3ca2d4c79a`，文件 `.tmp/site-shadcn-video-samples-20261030/video-12-25.png`。
- 5.016s：5.016s浅紫教程加载中间态。 解码PNG SHA256 `ee1ac54816bf28e1b5ae627ddfea1944ee43633ae75a4a2acade510dea14c828`，文件 `.tmp/site-shadcn-video-samples-20261030/video-12-55.png`。
- 7.752s：7.752s恢复shadcn/dark桌面教程，姓名/邮箱/摘要及上下一步可见。 解码PNG SHA256 `d9b2fc97368a71c0a6afacadf8aaa9b379def4d21987eebed0691b6ca262301c`，文件 `.tmp/site-shadcn-video-samples-20261030/video-12-85.png`。

## 限制

- All image judgments cover only captured visible viewport, not whole page or all form/control states.
- Input values/same-node identity, aria selection and post-navigation focus assertions are native evidence; images show only visible text/current focus.
- No ongoing natural frame is approved as static golden, including visually identical samples.
- 12 videos were decoded at three instants each; no complete video playback. Intermediate menus/loaders are expected progression, not final-ready evidence.
- Windows native Chromium review does not replace controlled Linux, Firefox/WebKit, full component matrices, contrast measurements, or subsequent baseline stability runs.
- Input/source identities belong to the captured candidate; current workspace or historical snapshot metadata are not substituted.
