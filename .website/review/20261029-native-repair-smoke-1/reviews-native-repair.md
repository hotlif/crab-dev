# Native repair smoke 原始PNG人工复审

本轮14个实际case，原生10pass/4fail/0skip。11个case有PNG，另3个仅行为/几何。32张原始PNG已全部view_image(original)逐张查看，所有SHA256与cases.json索引一致；重复hash也分别看过。失败/诊断图单独分类，图存在不替代断言通过或基准批准。

source: sha256:c02b3bf2e779010bb6cbe879157c7acebe2e698bc60a72a4196fabb13a9e837c

artifact: sha256:5bd3b70cb21ec9e9b9c6122e391a743bb53fc9a69f4e14086cc8be4f452a3e38

siteBuild: sha256:851c2a7c57867e40eb06e5813004c2d42583b67c9da97cf8393fd0619285f31f

6个inputs-worker均stable、source/artifact/siteBuild前后匹配，并与各case绑定一致。Windowsx64 / Chromium156.0.8078.4。只对应这轮旧候选，后续解冻修复必须新证据核验。

| 组件范围 | PNG | 原生结果/人工范围 |
| --- | --- | --- |
| Alert | 2 | touch失败，含1全白附件 |
| AppMainLayout | 1 | touch通过；只当前布局静帧 |
| Breadcrumbs | 1 | 真200%通过；长路径/真焦点完整 |
| ComponentPreview | 5 | loading失败；3加载样本+诊断+全白 |
| Dialog | 4 | 两pending失败；2实际对话框+2全白 |
| Message | 4 | reduced-motion通过；只自然观察帧 |
| Select | 2 | loading通过；展开字段与弹层自然帧 |
| Spin | 13 | reduced-motion4+overlay4+200%活动4/恢复1 |
| Button / BarChart | 0 | 2parity/1boundary行为几何，不计人工看图 |

- 信息/成功/警告Alert正文与关闭图形可见；原生首行信息icon/closeicon中心偏差3px>1，case失败。截图可见不等于触控/对齐通过。后续解冻修复不由此图证明。
- 三张加载原图同hash但均实际逐张查看，显示真实源码高亮加载提示。失败诊断图已有带行号的高亮代码，但原生pre>code.language-tsx定位未找到，case仍失败。
- pending-confirm/pending-cancel两图加载弧线与焦点环完整，但异步请求次数仍0，完成按钮呈禁用状态。原生期望1的断言失败，不能批准请求次数/完成恢复链路。
- Alert/Preview/Dialog共四张全白失败附件逐张看过，无组件可评；不作为独立产品渲染失败或任何通过证据。
- 真200%长路径与紫色键盘焦点环完整，当前页/禁用项层次和projects状态可见，无当前viewport横向裁切。只证明该md3/light帧。
- 触控收起导航栏、页签、页头通知/用户区及工作备注完整，未见当前帧重叠或裁切；触控几何是独立原生证据。
- Message减少动画条完整且弧线明暗不同；Select字段/弹层两帧弧线方向不同且标签帮助完整；Spin减少动画、overlay与200%活动帧均有可见圆环，200%恢复idle后底层开关和完整焦点环清楚可见。静帧不证明全部自然周期或视频全程。
- Message时序截图上边缘有夹具控件细线截面，Message本体与投影完整。Spin overlay前景说明与模糊底层标签/按钮真实叠放，未掩膜；不将图片存在本身称作全状态视觉批准。
- BarChart配置边界1case和Button owner/public形状parity2case无PNG，只有原生行为/几何通过，人工查看数0。

## 逐图路径、SHA256与实际观察

| Case / 图ID | 原图 | SHA256 | 结论与范围 |
| --- | --- | --- | --- |
| 3d2b7864b1d353bd7ad4-628a30012a3393343c97/chromium/0#image-0 | [screens/rc-alert/chromium/000001-0-screenshot.png](screens/rc-alert/chromium/000001-0-screenshot.png) | 38bc95c0cd90e41bcf2ecbdeceb36f809e343e6f5f0227a11035abd8cbf689ce | failed-case-visible-scope-only-not-approved；触控信息/成功/警告三条Alert可见，文字/图标完整，首条关闭×可见。原生具体失败是信息图标与关闭图标中心差3px超过1px上限；不是命中断言失败，不能以可见关闭图形批准此case。 |
| 3d2b7864b1d353bd7ad4-628a30012a3393343c97/chromium/0#image-1 | [screens/rc-alert/chromium/000001-3-screenshot.png](screens/rc-alert/chromium/000001-3-screenshot.png) | 3878570f4a62a0d65f57cf1754e0269e56ec797f4e36e26b44c172eb6e800401 | blank-failure-attachment-premise-unsatisfied；全白失败附件，没有可评组件；前提不满足，保留不批准。 |
| 37df6ca4812ba571a55e-c9bc59d68735a1dfba08/chromium/0#image-0 | [screens/rc-app-main-layout/chromium/000002-2-actual.png](screens/rc-app-main-layout/chromium/000002-2-actual.png) | 5fe7c18f193c54bc28ae93d71373ec2160821e86737a7eb6ce798a0c32ba6146 | reviewed-visible-scope-no-obvious-defect；触控主布局收起为图标栏，概览/订单页签、菜单入口、通知/用户区与工作备注字段完整可见，无重叠裁切；只核当前触控静帧，命中尺寸依据原生几何记录。 |
| 5d3ac0066b4e41a3ca10-5b3abdcc3f46102c2176/chromium/0#image-0 | [screens/rc-breadcrumbs/chromium/000004-2-actual-zoom-200.png](screens/rc-breadcrumbs/chromium/000004-2-actual-zoom-200.png) | e09b99f8a073b62d328df1ce8efe0b8a942fc01e18dcd86c6d034fb349ec7c93 | reviewed-visible-scope-no-obvious-defect；真实200%完整viewport帧：长路径链接文字与紫色键盘焦点环完整，当前页粗体/禁用目录弱化可辨，projects状态显示；当前帧没有横向裁切，不推广其他体系/尺寸。 |
| d2e896be0c76f5a04745-516aedf0f48b57341745/chromium/0#image-0 | [screens/rc-component-preview/chromium/000007-0-source-loading-0.png](screens/rc-component-preview/chromium/000007-0-source-loading-0.png) | e2a7650e0217836978ed5445915a4b57d3a6b6c26242fafdfec7980fad11feb1 | failed-time-series-visible-scope-only-not-approved；Preview窄面板展开源码加载区，工作区正文、业务草稿和工具栏可见，底部显示“正在加载源码高亮…”；三张同哈希原图均逐一查看，仅证明加载提示静帧，不能证明稍后高亮完成或本case通过。 |
| d2e896be0c76f5a04745-516aedf0f48b57341745/chromium/0#image-1 | [screens/rc-component-preview/chromium/000007-1-source-loading-1.png](screens/rc-component-preview/chromium/000007-1-source-loading-1.png) | e2a7650e0217836978ed5445915a4b57d3a6b6c26242fafdfec7980fad11feb1 | failed-time-series-visible-scope-only-not-approved；Preview窄面板展开源码加载区，工作区正文、业务草稿和工具栏可见，底部显示“正在加载源码高亮…”；三张同哈希原图均逐一查看，仅证明加载提示静帧，不能证明稍后高亮完成或本case通过。 |
| d2e896be0c76f5a04745-516aedf0f48b57341745/chromium/0#image-2 | [screens/rc-component-preview/chromium/000007-2-source-loading-2.png](screens/rc-component-preview/chromium/000007-2-source-loading-2.png) | e2a7650e0217836978ed5445915a4b57d3a6b6c26242fafdfec7980fad11feb1 | failed-time-series-visible-scope-only-not-approved；Preview窄面板展开源码加载区，工作区正文、业务草稿和工具栏可见，底部显示“正在加载源码高亮…”；三张同哈希原图均逐一查看，仅证明加载提示静帧，不能证明稍后高亮完成或本case通过。 |
| d2e896be0c76f5a04745-516aedf0f48b57341745/chromium/0#image-3 | [screens/rc-component-preview/chromium/000007-4-screenshot.png](screens/rc-component-preview/chromium/000007-4-screenshot.png) | 01a646fc483888060d9c2c8f891b7405ed964e73655ac8014631ffd8281df605 | failed-diagnostic-frame-visible-scope-only-not-approved；Preview失败诊断图中加载提示已被带行号的高亮源码替换，五行源码与业务草稿、工具栏可见；这不能证明case所要求完整时序/当前后续修复通过。 |
| d2e896be0c76f5a04745-516aedf0f48b57341745/chromium/0#image-4 | [screens/rc-component-preview/chromium/000007-8-screenshot.png](screens/rc-component-preview/chromium/000007-8-screenshot.png) | 3878570f4a62a0d65f57cf1754e0269e56ec797f4e36e26b44c172eb6e800401 | blank-failure-attachment-premise-unsatisfied；全白失败附件；没有页面外观可评，保留不批准。 |
| 10eeb3b4bd2ba3b601d5-13f4d396b78e3f055f21/chromium/0#image-0 | [screens/rc-dialog/chromium/000008-0-screenshot.png](screens/rc-dialog/chromium/000008-0-screenshot.png) | 7114b6476ec654a45da581c1212656c1e0d7ea2c321583c9828eff919cec9db4 | failed-pending-dialog-visible-scope-only-not-approved；pending-confirm对话框与遮罩完整，标题自然两行、输入和说明可读，确认按钮有加载弧线与完整焦点环，取消及完成异步请求呈禁用样式；原生pending交互失败，不批准完成/恢复链路。 |
| 10eeb3b4bd2ba3b601d5-13f4d396b78e3f055f21/chromium/0#image-1 | [screens/rc-dialog/chromium/000008-4-screenshot.png](screens/rc-dialog/chromium/000008-4-screenshot.png) | 3878570f4a62a0d65f57cf1754e0269e56ec797f4e36e26b44c172eb6e800401 | blank-failure-attachment-premise-unsatisfied；全白失败附件；不作为对话框外观证据。 |
| 10eeb3b4bd2ba3b601d5-f83b1ddd4464c8de2b8d/chromium/0#image-0 | [screens/rc-dialog/chromium/000009-0-screenshot.png](screens/rc-dialog/chromium/000009-0-screenshot.png) | 43d073c090fe89cb67e1f7f5bb1824ea1231c7f6a769df77933dcfbc8c710eac | failed-pending-dialog-visible-scope-only-not-approved；pending-cancel对话框完整；取消按钮显示加载弧线与完整焦点环，确认和完成异步请求呈禁用样式，背景遮罩/标题/字段无截断；pending交互原生失败，不能批准取消完成或恢复链路。 |
| 10eeb3b4bd2ba3b601d5-f83b1ddd4464c8de2b8d/chromium/0#image-1 | [screens/rc-dialog/chromium/000009-4-screenshot.png](screens/rc-dialog/chromium/000009-4-screenshot.png) | 3878570f4a62a0d65f57cf1754e0269e56ec797f4e36e26b44c172eb6e800401 | blank-failure-attachment-premise-unsatisfied；全白失败附件，无可评产品内容，前提不满足。 |
| 8e32da64467c5e3dd00e-beb4ded8f8c9d9db0a85/chromium/0#image-0 | [screens/rc-message/chromium/000010-0-reduced-motion-0.png](screens/rc-message/chromium/000010-0-reduced-motion-0.png) | cf1403e9b9d66f27b7db9242428462e5bf2b28c3b8739da92df3bf8526e06165 | reviewed-natural-observation-visible-scope；减少动画Message四帧均有完整深色通知条与“操作结果：工作区已保存”文字，弧线保留、未见通知条几何移动；帧间可见弧线明暗差异，静帧不替代原生减少动画时序断言。顶边有夹具控件细线截面，Message本体和投影完整。 |
| 8e32da64467c5e3dd00e-beb4ded8f8c9d9db0a85/chromium/0#image-1 | [screens/rc-message/chromium/000010-1-reduced-motion-1.png](screens/rc-message/chromium/000010-1-reduced-motion-1.png) | 3558426e2e775fe5da92c6c2cbde0435d4c2f4900793b11ce1dd3fcb286dffc0 | reviewed-natural-observation-visible-scope；减少动画Message四帧均有完整深色通知条与“操作结果：工作区已保存”文字，弧线保留、未见通知条几何移动；帧间可见弧线明暗差异，静帧不替代原生减少动画时序断言。顶边有夹具控件细线截面，Message本体和投影完整。 |
| 8e32da64467c5e3dd00e-beb4ded8f8c9d9db0a85/chromium/0#image-2 | [screens/rc-message/chromium/000010-2-reduced-motion-2.png](screens/rc-message/chromium/000010-2-reduced-motion-2.png) | 6ed1d8eed474f0dfb13ad086a4a501cd9f85b124e521ac4c1ed49fdbd2f7b9f0 | reviewed-natural-observation-visible-scope；减少动画Message四帧均有完整深色通知条与“操作结果：工作区已保存”文字，弧线保留、未见通知条几何移动；帧间可见弧线明暗差异，静帧不替代原生减少动画时序断言。顶边有夹具控件细线截面，Message本体和投影完整。 |
| 8e32da64467c5e3dd00e-beb4ded8f8c9d9db0a85/chromium/0#image-3 | [screens/rc-message/chromium/000010-3-reduced-motion-3.png](screens/rc-message/chromium/000010-3-reduced-motion-3.png) | 7654e5becbfa51931888001b5296817d4a22dd5eb730dc96d46efb42fdc39cab | reviewed-natural-observation-visible-scope；减少动画Message四帧均有完整深色通知条与“操作结果：工作区已保存”文字，弧线保留、未见通知条几何移动；帧间可见弧线明暗差异，静帧不替代原生减少动画时序断言。顶边有夹具控件细线截面，Message本体和投影完整。 |
| 83bc8cb946d091642ea1-70e7f0bfb20acbd52fa4/chromium/0#image-0 | [screens/rc-select/chromium/000011-0-natural-loading-frame-0.png](screens/rc-select/chromium/000011-0-natural-loading-frame-0.png) | fdc4f97174a24720d396c85729c43e6f6648bf8b294c2d05cfc705451e868dea | reviewed-natural-observation-visible-scope；Select真实loading展开帧：字段浮动标签、输入提示、帮助文案、弹层与阴影完整；字段尾部和弹层中央均有可见弧线，两帧方向不同，几何不漂移。弹层遮住下方示例属于浮层覆盖，不把仅此两帧扩展为完整状态/动画周期验收。 |
| 83bc8cb946d091642ea1-70e7f0bfb20acbd52fa4/chromium/0#image-1 | [screens/rc-select/chromium/000011-1-natural-loading-frame-1.png](screens/rc-select/chromium/000011-1-natural-loading-frame-1.png) | 39053e67ad2b17e1b9baa883b58418f2383f74bf37e799a48f02c8db4e060bea | reviewed-natural-observation-visible-scope；Select真实loading展开帧：字段浮动标签、输入提示、帮助文案、弹层与阴影完整；字段尾部和弹层中央均有可见弧线，两帧方向不同，几何不漂移。弹层遮住下方示例属于浮层覆盖，不把仅此两帧扩展为完整状态/动画周期验收。 |
| 390330a3f6bbbdfcec6d-ec6bfc55a7f87d65fe22/chromium/0#image-0 | [screens/rc-spin/chromium/000012-0-activity-0.png](screens/rc-spin/chromium/000012-0-activity-0.png) | 95984f65fdaac35865513a834c5f613103193792f7a45c5c5bea5a8307965e25 | reviewed-natural-observation-visible-scope；Spin减少动画四帧均有圆环和完整“正在刷新项目列表，保留当前编辑草稿”文字，圆环位于相同位置、无内容裁切。圆环在部分帧较浅，仍可辨；只记录静帧明暗，不把这些图片当作完整呼吸周期或旋转抑制的独立证明。 |
| 390330a3f6bbbdfcec6d-ec6bfc55a7f87d65fe22/chromium/0#image-1 | [screens/rc-spin/chromium/000012-1-activity-1.png](screens/rc-spin/chromium/000012-1-activity-1.png) | bb80e6c34235167cd23100fa1273ae56f30c6f36fadbb9c383660a752a3aa0cc | reviewed-natural-observation-visible-scope；Spin减少动画四帧均有圆环和完整“正在刷新项目列表，保留当前编辑草稿”文字，圆环位于相同位置、无内容裁切。圆环在部分帧较浅，仍可辨；只记录静帧明暗，不把这些图片当作完整呼吸周期或旋转抑制的独立证明。 |
| 390330a3f6bbbdfcec6d-ec6bfc55a7f87d65fe22/chromium/0#image-2 | [screens/rc-spin/chromium/000012-2-activity-2.png](screens/rc-spin/chromium/000012-2-activity-2.png) | 60b639bd4571936a43895b0894bb77f4b64b4c9abf9d5c5f45da6d00b0c9312c | reviewed-natural-observation-visible-scope；Spin减少动画四帧均有圆环和完整“正在刷新项目列表，保留当前编辑草稿”文字，圆环位于相同位置、无内容裁切。圆环在部分帧较浅，仍可辨；只记录静帧明暗，不把这些图片当作完整呼吸周期或旋转抑制的独立证明。 |
| 390330a3f6bbbdfcec6d-ec6bfc55a7f87d65fe22/chromium/0#image-3 | [screens/rc-spin/chromium/000012-3-activity-3.png](screens/rc-spin/chromium/000012-3-activity-3.png) | 6297f7bdc0d8929c3d4fb2b7224371408ca08f315c5277c5d55b74f7391cfb40 | reviewed-natural-observation-visible-scope；Spin减少动画四帧均有圆环和完整“正在刷新项目列表，保留当前编辑草稿”文字，圆环位于相同位置、无内容裁切。圆环在部分帧较浅，仍可辨；只记录静帧明暗，不把这些图片当作完整呼吸周期或旋转抑制的独立证明。 |
| f0426626d6f8e37fe854-65a7783755b42d2e466d/chromium/0#image-0 | [screens/rc-spin/chromium/000013-1-activity-0.png](screens/rc-spin/chromium/000013-1-activity-0.png) | f8cbe124c217d547a23da7e9596265c3120c421b5bb5d7c4c88647b810fa297c | reviewed-natural-observation-visible-scope；Spin overlay四帧：底层表单/按钮被模糊弱化，前景圆环及两行刷新说明完整处于卡片范围，弧线方向有变化，未见卡片边界或前景文字裁切。背景与前景叠放是此loading覆盖状态，实际inert隔离/恢复以原生记录为准。 |
| f0426626d6f8e37fe854-65a7783755b42d2e466d/chromium/0#image-1 | [screens/rc-spin/chromium/000013-2-activity-1.png](screens/rc-spin/chromium/000013-2-activity-1.png) | 8d41910acdc84c7ee03ab93aac635e7c6c73791f1001acf3a461bc7da866ad53 | reviewed-natural-observation-visible-scope；Spin overlay四帧：底层表单/按钮被模糊弱化，前景圆环及两行刷新说明完整处于卡片范围，弧线方向有变化，未见卡片边界或前景文字裁切。背景与前景叠放是此loading覆盖状态，实际inert隔离/恢复以原生记录为准。 |
| f0426626d6f8e37fe854-65a7783755b42d2e466d/chromium/0#image-2 | [screens/rc-spin/chromium/000013-3-activity-2.png](screens/rc-spin/chromium/000013-3-activity-2.png) | 1f1fc1e9416b0187b611dbf03c131ff2748f84b87e5cb6371bbaef857a0c3729 | reviewed-natural-observation-visible-scope；Spin overlay四帧：底层表单/按钮被模糊弱化，前景圆环及两行刷新说明完整处于卡片范围，弧线方向有变化，未见卡片边界或前景文字裁切。背景与前景叠放是此loading覆盖状态，实际inert隔离/恢复以原生记录为准。 |
| f0426626d6f8e37fe854-65a7783755b42d2e466d/chromium/0#image-3 | [screens/rc-spin/chromium/000013-4-activity-3.png](screens/rc-spin/chromium/000013-4-activity-3.png) | e12b063f850da480b6699d69f1fc5cf3a83a6bc749fa715347d9c2e139cd41e5 | reviewed-natural-observation-visible-scope；Spin overlay四帧：底层表单/按钮被模糊弱化，前景圆环及两行刷新说明完整处于卡片范围，弧线方向有变化，未见卡片边界或前景文字裁切。背景与前景叠放是此loading覆盖状态，实际inert隔离/恢复以原生记录为准。 |
| cae2c436e3e9349e5090-d75c20e106a804dec3f8/chromium/0#image-0 | [screens/rc-spin/chromium/000014-3-actual-zoom-200-activity-0.png](screens/rc-spin/chromium/000014-3-actual-zoom-200-activity-0.png) | 55df0daa4028c6bee0315ae216bbc9793250105e835637269a8e6968a6cf938b | reviewed-natural-observation-visible-scope；真实200%完整viewport：Spin overlay卡片与圆环完整，前景两行刷新说明可读；弧线在不同方向，前景说明与模糊底层标签/按钮实际叠放，未掩膜或裁切。此帧不替代inert隔离/恢复或全动画周期证明。 |
| cae2c436e3e9349e5090-d75c20e106a804dec3f8/chromium/0#image-1 | [screens/rc-spin/chromium/000014-4-actual-zoom-200-activity-1.png](screens/rc-spin/chromium/000014-4-actual-zoom-200-activity-1.png) | d7c4f352f99c19d51d63ca3df3630be7e28806b8fce052fa8ee3c4e6c59e76e2 | reviewed-natural-observation-visible-scope；真实200%完整viewport：Spin overlay卡片与圆环完整，前景两行刷新说明可读；弧线在不同方向，前景说明与模糊底层标签/按钮实际叠放，未掩膜或裁切。此帧不替代inert隔离/恢复或全动画周期证明。 |
| cae2c436e3e9349e5090-d75c20e106a804dec3f8/chromium/0#image-2 | [screens/rc-spin/chromium/000014-5-actual-zoom-200-activity-2.png](screens/rc-spin/chromium/000014-5-actual-zoom-200-activity-2.png) | 182e0e4d48d8c115908baf4d173ce49d337010810188c4ead68ef3b00d610e4f | reviewed-natural-observation-visible-scope；真实200%完整viewport：Spin overlay卡片与圆环完整，前景两行刷新说明可读；弧线在不同方向，前景说明与模糊底层标签/按钮实际叠放，未掩膜或裁切。此帧不替代inert隔离/恢复或全动画周期证明。 |
| cae2c436e3e9349e5090-d75c20e106a804dec3f8/chromium/0#image-3 | [screens/rc-spin/chromium/000014-6-actual-zoom-200-activity-3.png](screens/rc-spin/chromium/000014-6-actual-zoom-200-activity-3.png) | 27e6c3b3769a251651923198a88aec65c8e986dab70df5548b7f8c5733ed7dd4 | reviewed-natural-observation-visible-scope；200%第四活动帧圆环相位与前三不同，前景刷新说明及模糊底层仍在同一卡片内完整入画；仅此观察帧，不批准完整时序或后续源码。 |
| cae2c436e3e9349e5090-d75c20e106a804dec3f8/chromium/0#image-4 | [screens/rc-spin/chromium/000014-9-actual-zoom-200-restored-content.png](screens/rc-spin/chromium/000014-9-actual-zoom-200-restored-content.png) | bfdfdcba89278854ce98854ba29a0137b6988a0d1d3e3719e0d23cf558a71100 | reviewed-visible-scope-no-obvious-defect；200%恢复idle后底层“项目草稿”和“允许编辑”开关清晰，开关紫色真键盘焦点环完整位于卡片内；没有loading前景/模糊残留。交互恢复与node状态依据独立原生断言。 |

## 没有PNG的case

- c01e53bc109454311a0d-2877bce5260e4786d1be/chromium/0 / md3 light hidden series and live data survive configuration：原生passed；0图人工复审。
- b0ab454e83964b85f2f0-4beeb343b6caa6dc689f/chromium/0 / owner/public Button shape parity md3 light：原生passed；0图人工复审。
- b0ab454e83964b85f2f0-24c2ab2da8de06a80517/chromium/0 / owner/public Button shape parity shadcn light：原生passed；0图人工复审。

## 限制与未批准范围

- 本轮为Windows/Chromium的代表性修复smoke，非三体系/明暗/所有尺寸密度状态完整矩阵。
- 仅绑定c02b3bf…源码、5bd3b70…产物与851c2a7…站点构建；6worker输入前后stable。宿主解冻后的Alert/Preview/Dialog等修复不由此旧图验证。
- 全部32PNG均实际原图查看，重复hash记录也逐一看过；未修改/复制原图、额外采集或构建。
- 原生10pass/4fail与人工范围分别保存；失败/空白不批准。没有PNG的检查不计看图通过。
- 连续动画只有当前自然观察帧及原时序metadata，不冒称完整视频逐秒人工复审。
- 未建立baseline、未修改manifest覆盖或标记verified。

逐case原始错误、配置注解、真实缩放证明、触控/inert/时序记录、输入与日志绑定保留在reviews-native-repair.json，未改写cases.json或原生报告。
