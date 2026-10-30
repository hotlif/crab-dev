# Checkbox shadcn：Windows 第一完整候选原图复审

**整体及逐图结论：pending。**112张原图（含重复）已逐张view_image original查看，112/112 SHA与导出索引和原生JSON附件一致。发现Demo反馈问题，须修复有效状态单一来源并另建新候选；不晋升当前候选。

原生包级337通过、0失败、0跳过；核心270/270、环境60/60仍保持原样。shadcn本次人工范围：90核心图（3尺寸×明暗×15状态）、18环境图（9条件×明暗）、2真实200%视口图、2默认库存图，共112。两worker before/after稳定。source sha256:95a3abd61ba6be7b449451f18c0ad5af3dc762e51bb7f51913f04b216717f399；artifact sha256:2ec46e304660abc070a9f3fe8a83dee6dc5867adda9da34c1bae2a189be37426。

具体问题1：disabled-selected主项确实有勾、原生checked/disabled断言也通过，但“当前选择: off”与真实输入矛盾。原Demo的checked使用state===disabled-selected || checked，output却只显示checked。涉及序号32、47、62、77、92、107。这不是勾选绘制失败。

具体问题2：indeterminate/indeterminate-error/disabled-indeterminate的水平横杠实际清楚，原生mixed断言通过；output仅显示独立checked=false的off，未表达有效mixed语义。涉及序号33、34、35、48、49、50、63、64、65、78、79、80、93、94、95、108、109、110。标记可见与状态反馈正确应分开记录。

实际渲染观察：浅色深底白勾/横杠，暗色白底深色勾/横杠可区分；错误红色或浅粉填充/边框完整，禁用层次可辨。外焦点环四边未被采集切掉、标签无覆盖。窄屏自然换行、RTL镜像、英文长标签、品牌与强制颜色所见均逐图记录。触控命中区域原生记录≥48×48px，但视觉标记本身仍较小，不把两者混为同一几何。

真实200%两图是chrome.tabs.setZoom后的可见视口：主项勾选、禁用对照、on输出及完整键盘焦点圈可见；没有冒称全长页面或其他缩放环境。减少动画仅作静态观察。

共88种PNG字节，重复SHA12组，超首次重复24张；每张仍已实际查看，重复组单列如下。

来源边界：固定绑定原95a3abd…候选；后续LineEdit文档warning标签措辞差异不属于本次Checkbox捕获资产，不重算/替换旧候选身份。原生报告、图片及输入指纹均未改写。

| 序号 | 原图/配置 | SHA-256 | 人工原图观察（全部pending） |
| --- | --- | --- | --- |
| 1 | screens/rc-checkbox/chromium/000038-2-actual.png · shadcn-light-narrow.png | bb7e5b6f1a19cfb8024173537fb610ab8b905294253d7d1af9b42b4e41888123 | 主项实际已选，深色底白勾与禁用对照项可区分，on输出完整。 窄屏长标签自然折成两行，未横向溢出或裁字；结果与对照项仍完整。 |
| 2 | screens/rc-checkbox/chromium/000039-2-actual.png · shadcn-light-tablet.png | 08e752bb63830fd76b782d680818aea3f97b519143d8da9048b529205cd88d58 | 主项实际已选，深色底白勾与禁用对照项可区分，on输出完整。 |
| 3 | screens/rc-checkbox/chromium/000040-2-actual.png · shadcn-light-desktop.png | 08e752bb63830fd76b782d680818aea3f97b519143d8da9048b529205cd88d58 | 主项实际已选，深色底白勾与禁用对照项可区分，on输出完整。 |
| 4 | screens/rc-checkbox/chromium/000041-2-actual.png · shadcn-light-touch.png | d43e34269fbe959661dd7c825e9ceece384481b3a95a1f554abe0361185db848 | 主项实际已选，深色底白勾与禁用对照项可区分，on输出完整。 标记本身仍是紧凑方框，外侧触控目标扩大；原生记录实际control区域≥48×48px，标签无遮挡。 |
| 5 | screens/rc-checkbox/chromium/000042-2-actual.png · shadcn-light-rtl.png | a9245aae019dfdf6dcf2e847d9c8759e2bce09b760067617d233ef7e8d6cc0c7 | 主项实际已选，深色底白勾与禁用对照项可区分，on输出完整。 控制标记位于右侧，标签和on结果右对齐，镜像关系正确。 |
| 6 | screens/rc-checkbox/chromium/000043-2-actual.png · shadcn-light-english.png | b49e4ab6cd374e952e5e33b1c92d1fb65b680c2693ec682b091363d1b76af8f0 | 主项实际已选，深色底白勾与禁用对照项可区分，on输出完整。 英文完整长标签及Selected · unavailable可见，没有裁切。 |
| 7 | screens/rc-checkbox/chromium/000044-2-actual.png · shadcn-light-brand.png | 9f26cdb56f2a6df47e8922dd8855a324ff9f31c8f58cd500f98eeffa9520bf73 | 主项实际已选，紫色底白勾与禁用对照项可区分，on输出完整。 主项呈紫色品牌填充，勾清楚，禁用项保持灰度。 |
| 8 | screens/rc-checkbox/chromium/000045-2-actual.png · shadcn-light-forced-colors.png | a9c2a02545eb55995397e90a7fc0bc1fb28929b727b157123bf5befda97dfced | 主项实际已选，紫色底白勾与禁用对照项可区分，on输出完整。 紫色主项/深红禁用项是本次系统调色板所见，不能误作普通模式语义色或error状态；文字及勾可辨。 |
| 9 | screens/rc-checkbox/chromium/000046-2-actual.png · shadcn-light-reduced-motion.png | 08e752bb63830fd76b782d680818aea3f97b519143d8da9048b529205cd88d58 | 主项实际已选，深色底白勾与禁用对照项可区分，on输出完整。 只记录该条件的静态外观，不从PNG推断动画时长。 |
| 10 | screens/rc-checkbox/chromium/000047-2-actual.png · shadcn-dark-narrow.png | ae2054a01dfae91021b731dae4c800dcb0a46201788c869320f00b5a335ed6e0 | 主项实际已选，白色底深色勾与禁用对照项可区分，on输出完整。 窄屏长标签自然折成两行，未横向溢出或裁字；结果与对照项仍完整。 |
| 11 | screens/rc-checkbox/chromium/000048-2-actual.png · shadcn-dark-tablet.png | 5e3ce16fb45ddd5dae1d981240e6876cc9cbc00feffb2d55f1bcee8d32d24b07 | 主项实际已选，白色底深色勾与禁用对照项可区分，on输出完整。 |
| 12 | screens/rc-checkbox/chromium/000049-2-actual.png · shadcn-dark-desktop.png | 5e3ce16fb45ddd5dae1d981240e6876cc9cbc00feffb2d55f1bcee8d32d24b07 | 主项实际已选，白色底深色勾与禁用对照项可区分，on输出完整。 |
| 13 | screens/rc-checkbox/chromium/000050-2-actual.png · shadcn-dark-touch.png | f221b2ba85569a9e3a928c42cae7fff66560d151237037463f22676779610f5e | 主项实际已选，白色底深色勾与禁用对照项可区分，on输出完整。 标记本身仍是紧凑方框，外侧触控目标扩大；原生记录实际control区域≥48×48px，标签无遮挡。 |
| 14 | screens/rc-checkbox/chromium/000051-2-actual.png · shadcn-dark-rtl.png | d60fa797bf06905975fa1282d3016acd4dbd13f26a15bbb1f4a352039182089c | 主项实际已选，白色底深色勾与禁用对照项可区分，on输出完整。 控制标记位于右侧，标签和on结果右对齐，镜像关系正确。 |
| 15 | screens/rc-checkbox/chromium/000052-2-actual.png · shadcn-dark-english.png | e6e357ac079baeccf04d26eab25daea704a9f3aeb628f29fd9bd201afbb92e6b | 主项实际已选，白色底深色勾与禁用对照项可区分，on输出完整。 英文完整长标签及Selected · unavailable可见，没有裁切。 |
| 16 | screens/rc-checkbox/chromium/000053-2-actual.png · shadcn-dark-brand.png | caa23db6f18adfa9f35c5f13e332297428269327e20275906d5e2373e4acece5 | 主项实际已选，淡紫色底深色勾与禁用对照项可区分，on输出完整。 主项呈淡紫色品牌填充，勾清楚，禁用项保持灰度。 |
| 17 | screens/rc-checkbox/chromium/000054-2-actual.png · shadcn-dark-forced-colors.png | 7ce0ab170a47b79ed2e5e7cd16d34fe2923dc429544302583d1320e39af47093 | 主项实际已选，青色底深色勾与禁用对照项可区分，on输出完整。 青色主项/绿色禁用项是本次系统调色板所见，不能误作普通模式语义色或error状态；文字及勾可辨。 |
| 18 | screens/rc-checkbox/chromium/000055-2-actual.png · shadcn-dark-reduced-motion.png | 5e3ce16fb45ddd5dae1d981240e6876cc9cbc00feffb2d55f1bcee8d32d24b07 | 主项实际已选，白色底深色勾与禁用对照项可区分，on输出完整。 只记录该条件的静态外观，不从PNG推断动画时长。 |
| 19 | screens/rc-checkbox/chromium/000060-4-actual-zoom-200.png · shadcn-light-zoom-200.png | bf701a15f3bfd61af9a31097e5a2881c8484cb175b2f07c71137365fc9c255d3 | 真实200%可见视口内主项已勾、禁用对照、on结果及键盘目标外环完整；长标签未裁切，没有冒称全页或其他缩放级别。 |
| 20 | screens/rc-checkbox/chromium/000061-4-actual-zoom-200.png · shadcn-dark-zoom-200.png | e7ebf694a19c08fa463cacf74906ec99e1d8aa5d5a29431c6614c201c620ce39 | 真实200%可见视口内主项已勾、禁用对照、on结果及键盘目标外环完整；长标签未裁切，没有冒称全页或其他缩放级别。 |
| 21 | screens/rc-checkbox/chromium/000242-2-actual.png · shadcn-light-small-default.png | f6992afeb677b13f2d345f163256928ccc873b5050372a8c5d27ca70563b6176 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 |
| 22 | screens/rc-checkbox/chromium/000243-2-actual.png · shadcn-light-small-hover.png | 663bee0824491d65478942e48b69e8ff4259b0cdc851d4095304114941369372 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 目标悬停边界/填充可见，状态差异较轻，截图不能替代实际hover动作。 |
| 23 | screens/rc-checkbox/chromium/000244-2-actual.png · shadcn-light-small-focus-visible.png | cb0ed680396139138e8a5ab99ab53cb9a784e08cfab8ff8af9f95a61b21c9a1e | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 实际键盘目标外焦点圈完整，四边未裁切，未压住标签。 |
| 24 | screens/rc-checkbox/chromium/000245-2-actual.png · shadcn-light-small-pressed.png | 663bee0824491d65478942e48b69e8ff4259b0cdc851d4095304114941369372 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 原生真实mouse.down期间采集；静态按下与普通态差异小，未据此声称独立明显压下动画。 |
| 25 | screens/rc-checkbox/chromium/000246-2-actual.png · shadcn-light-small-selected.png | 81e7d665aefd5c390999bbc3789c564dc8902097561c184a5ac48e9baa4d9a9a | 深底白勾主项清楚，on反馈可见；禁用对照项层级可区分。 |
| 26 | screens/rc-checkbox/chromium/000247-2-actual.png · shadcn-light-small-selected-hover.png | 81e7d665aefd5c390999bbc3789c564dc8902097561c184a5ac48e9baa4d9a9a | 深底白勾主项清楚，on反馈可见；禁用对照项层级可区分。 目标悬停边界/填充可见，状态差异较轻，截图不能替代实际hover动作。 |
| 27 | screens/rc-checkbox/chromium/000248-2-actual.png · shadcn-light-small-selected-focus-visible.png | 24310ef216ea7fa47a3df5dd28805916d7a2199f4bc8a10a740cb3ad88101f53 | 深底白勾主项清楚，on反馈可见；禁用对照项层级可区分。 实际键盘目标外焦点圈完整，四边未裁切，未压住标签。 |
| 28 | screens/rc-checkbox/chromium/000249-2-actual.png · shadcn-light-small-selected-pressed.png | 81e7d665aefd5c390999bbc3789c564dc8902097561c184a5ac48e9baa4d9a9a | 深底白勾主项清楚，on反馈可见；禁用对照项层级可区分。 原生真实mouse.down期间采集；静态按下与普通态差异小，未据此声称独立明显压下动画。 |
| 29 | screens/rc-checkbox/chromium/000250-2-actual.png · shadcn-light-small-error.png | bef7e5f5dbf2b8e92350e9514df08de24f3ac82cff5038dac9f1a635c20ffd17 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 红色错误边界或填充可辨，错误段落完整；aria-invalid/关联描述由原生断言确认。 |
| 30 | screens/rc-checkbox/chromium/000251-2-actual.png · shadcn-light-small-selected-error.png | e06923f24e5b39575d77337c013ce078803ae60cd37637843ae31e6a0d43dbc0 | 红底白勾主项清楚，on反馈可见；错误填充/错误段落完整。 红色错误边界或填充可辨，错误段落完整；aria-invalid/关联描述由原生断言确认。 |
| 31 | screens/rc-checkbox/chromium/000252-2-actual.png · shadcn-light-small-disabled.png | 5c81b61eda3871e8307fe00662cba90833a253a76b96f0e5d65289d66b05ff0e | 灰色禁用空框、标签和禁用已选对照均可辨；off结果可见。 |
| 32 | screens/rc-checkbox/chromium/000253-2-actual.png · shadcn-light-small-disabled-selected.png | 90bc2f999c85b21e0f04225843bd47e362b249aeabe77cee4335016807765693 | 主项显示灰色填充与实际勾选标记，禁用标签变淡；实际checked及disabled的原生断言通过。【主项真实已勾选且disabled，但下方“当前选择: off”】 |
| 33 | screens/rc-checkbox/chromium/000254-2-actual.png · shadcn-light-small-indeterminate.png | 7f620f28b37e139d5eb23b50f77b8bfcf051599f9280d67552ef4881fd5850b0 | 主项有清楚的白色水平横杠，与勾选勾形不同；深色填充及边界完整。【实际半选横杠和aria-checked=mixed存在，但输出仍为off】 |
| 34 | screens/rc-checkbox/chromium/000255-2-actual.png · shadcn-light-small-indeterminate-error.png | baffeecbfe6eb13a9c264c6908a03a93c42cafb26f278e537acae870a8c1b551 | 主项有清楚的白色水平横杠，与勾选勾形不同；红色填充及边界完整。 红色错误边界或填充可辨，错误段落完整；aria-invalid/关联描述由原生断言确认。【实际半选横杠和aria-checked=mixed存在，但输出仍为off】 |
| 35 | screens/rc-checkbox/chromium/000256-2-actual.png · shadcn-light-small-disabled-indeterminate.png | 92bdb2d6b2c43465ea8c2de78c67504da449030fa69666714ee444dfae48fe76 | 主项有清楚的白色水平横杠，与勾选勾形不同；灰色填充及边界完整。【实际半选横杠和aria-checked=mixed存在，但输出仍为off】 |
| 36 | screens/rc-checkbox/chromium/000257-2-actual.png · shadcn-light-medium-default.png | 60862e3c0ce662d9893aba1dac2590d56de731ec93dd3ef0046477bc7963a413 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 |
| 37 | screens/rc-checkbox/chromium/000258-2-actual.png · shadcn-light-medium-hover.png | 68a71b01f4804beb4fdda0cb0593b09c449f3dc29c22af7801984dea7f8dd231 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 目标悬停边界/填充可见，状态差异较轻，截图不能替代实际hover动作。 |
| 38 | screens/rc-checkbox/chromium/000259-2-actual.png · shadcn-light-medium-focus-visible.png | 3ed8d0c679eec1d7f1660b751ddfc67841782e01aa942f2c7d64759ff0c705ca | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 实际键盘目标外焦点圈完整，四边未裁切，未压住标签。 |
| 39 | screens/rc-checkbox/chromium/000260-2-actual.png · shadcn-light-medium-pressed.png | 68a71b01f4804beb4fdda0cb0593b09c449f3dc29c22af7801984dea7f8dd231 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 原生真实mouse.down期间采集；静态按下与普通态差异小，未据此声称独立明显压下动画。 |
| 40 | screens/rc-checkbox/chromium/000261-2-actual.png · shadcn-light-medium-selected.png | 08e752bb63830fd76b782d680818aea3f97b519143d8da9048b529205cd88d58 | 深底白勾主项清楚，on反馈可见；禁用对照项层级可区分。 |
| 41 | screens/rc-checkbox/chromium/000262-2-actual.png · shadcn-light-medium-selected-hover.png | 08e752bb63830fd76b782d680818aea3f97b519143d8da9048b529205cd88d58 | 深底白勾主项清楚，on反馈可见；禁用对照项层级可区分。 目标悬停边界/填充可见，状态差异较轻，截图不能替代实际hover动作。 |
| 42 | screens/rc-checkbox/chromium/000263-2-actual.png · shadcn-light-medium-selected-focus-visible.png | 85be82dc108e45c0b26c66f0bb44ef3728ac652f1c82002941b35621ec924e56 | 深底白勾主项清楚，on反馈可见；禁用对照项层级可区分。 实际键盘目标外焦点圈完整，四边未裁切，未压住标签。 |
| 43 | screens/rc-checkbox/chromium/000264-2-actual.png · shadcn-light-medium-selected-pressed.png | 08e752bb63830fd76b782d680818aea3f97b519143d8da9048b529205cd88d58 | 深底白勾主项清楚，on反馈可见；禁用对照项层级可区分。 原生真实mouse.down期间采集；静态按下与普通态差异小，未据此声称独立明显压下动画。 |
| 44 | screens/rc-checkbox/chromium/000265-2-actual.png · shadcn-light-medium-error.png | 47c57cb9a397ce96fa6ac7c885742628b0f2cb5174b08b52c5255fd0bbf7ed19 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 红色错误边界或填充可辨，错误段落完整；aria-invalid/关联描述由原生断言确认。 |
| 45 | screens/rc-checkbox/chromium/000266-2-actual.png · shadcn-light-medium-selected-error.png | d2d4b6a9b3617170cf90440f00d6d576c257800f346ca71975326ebcd46db488 | 红底白勾主项清楚，on反馈可见；错误填充/错误段落完整。 红色错误边界或填充可辨，错误段落完整；aria-invalid/关联描述由原生断言确认。 |
| 46 | screens/rc-checkbox/chromium/000267-2-actual.png · shadcn-light-medium-disabled.png | be562bbc868749ae98427410a3c67f9e01e2cf784bfa6a0d3f5250df6ef4d730 | 灰色禁用空框、标签和禁用已选对照均可辨；off结果可见。 |
| 47 | screens/rc-checkbox/chromium/000268-2-actual.png · shadcn-light-medium-disabled-selected.png | 2877a8fa16f205ccd5b03311422ac6559ed9dcd748be81b0b37e5dd5777eba51 | 主项显示灰色填充与实际勾选标记，禁用标签变淡；实际checked及disabled的原生断言通过。【主项真实已勾选且disabled，但下方“当前选择: off”】 |
| 48 | screens/rc-checkbox/chromium/000269-2-actual.png · shadcn-light-medium-indeterminate.png | e5743b0643cef832c7d0061d1469d63530cb16f2707c763526dd889f0c731c3e | 主项有清楚的白色水平横杠，与勾选勾形不同；深色填充及边界完整。【实际半选横杠和aria-checked=mixed存在，但输出仍为off】 |
| 49 | screens/rc-checkbox/chromium/000270-2-actual.png · shadcn-light-medium-indeterminate-error.png | f618afb8127b12c680d72d552be5137aeebd6a6206ae58429cfcd0f702509d32 | 主项有清楚的白色水平横杠，与勾选勾形不同；红色填充及边界完整。 红色错误边界或填充可辨，错误段落完整；aria-invalid/关联描述由原生断言确认。【实际半选横杠和aria-checked=mixed存在，但输出仍为off】 |
| 50 | screens/rc-checkbox/chromium/000271-2-actual.png · shadcn-light-medium-disabled-indeterminate.png | 9dbe4d93fb10bbac095b4c860645f37fdea084f7e2ae6c608ce11682f3dc084f | 主项有清楚的白色水平横杠，与勾选勾形不同；灰色填充及边界完整。【实际半选横杠和aria-checked=mixed存在，但输出仍为off】 |
| 51 | screens/rc-checkbox/chromium/000272-2-actual.png · shadcn-light-large-default.png | 9ab1c703fbbd00d75c6b74ceac24f3d6add3b887811cf4323b44d724a5155b95 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 |
| 52 | screens/rc-checkbox/chromium/000273-2-actual.png · shadcn-light-large-hover.png | e2e1d8a394ecce8b900581135dcf4aabb335cc4d599eb5567f000de457726b8b | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 目标悬停边界/填充可见，状态差异较轻，截图不能替代实际hover动作。 |
| 53 | screens/rc-checkbox/chromium/000274-2-actual.png · shadcn-light-large-focus-visible.png | bb28655f85c50a9eb250a073165d739b8f31debb8ecc5d67bf4160cc08a17e92 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 实际键盘目标外焦点圈完整，四边未裁切，未压住标签。 |
| 54 | screens/rc-checkbox/chromium/000275-2-actual.png · shadcn-light-large-pressed.png | e2e1d8a394ecce8b900581135dcf4aabb335cc4d599eb5567f000de457726b8b | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 原生真实mouse.down期间采集；静态按下与普通态差异小，未据此声称独立明显压下动画。 |
| 55 | screens/rc-checkbox/chromium/000276-2-actual.png · shadcn-light-large-selected.png | b513ff1bb99cb69d8be25fdfed4faaa30b89fb845bd36cd784015f313e2f84b0 | 深底白勾主项清楚，on反馈可见；禁用对照项层级可区分。 |
| 56 | screens/rc-checkbox/chromium/000277-2-actual.png · shadcn-light-large-selected-hover.png | b513ff1bb99cb69d8be25fdfed4faaa30b89fb845bd36cd784015f313e2f84b0 | 深底白勾主项清楚，on反馈可见；禁用对照项层级可区分。 目标悬停边界/填充可见，状态差异较轻，截图不能替代实际hover动作。 |
| 57 | screens/rc-checkbox/chromium/000278-2-actual.png · shadcn-light-large-selected-focus-visible.png | f28ecd05780ebaf9588c53b4a84dc2b08a5f0aa375020cdfd10adbfa46c532ca | 深底白勾主项清楚，on反馈可见；禁用对照项层级可区分。 实际键盘目标外焦点圈完整，四边未裁切，未压住标签。 |
| 58 | screens/rc-checkbox/chromium/000279-2-actual.png · shadcn-light-large-selected-pressed.png | b513ff1bb99cb69d8be25fdfed4faaa30b89fb845bd36cd784015f313e2f84b0 | 深底白勾主项清楚，on反馈可见；禁用对照项层级可区分。 原生真实mouse.down期间采集；静态按下与普通态差异小，未据此声称独立明显压下动画。 |
| 59 | screens/rc-checkbox/chromium/000280-2-actual.png · shadcn-light-large-error.png | 9b4d8ba227bac034a8271d840495f09bf541a982010aeb97e4a474de6d435c5d | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 红色错误边界或填充可辨，错误段落完整；aria-invalid/关联描述由原生断言确认。 |
| 60 | screens/rc-checkbox/chromium/000281-2-actual.png · shadcn-light-large-selected-error.png | ec4aabcae727252946524036eaf4320993a0d097af0524c0fb8a1265d79748cb | 红底白勾主项清楚，on反馈可见；错误填充/错误段落完整。 红色错误边界或填充可辨，错误段落完整；aria-invalid/关联描述由原生断言确认。 |
| 61 | screens/rc-checkbox/chromium/000282-2-actual.png · shadcn-light-large-disabled.png | 95f67bca0004541854e25c94ffe731efe90951ccc186cd8724dffc2f7479d48e | 灰色禁用空框、标签和禁用已选对照均可辨；off结果可见。 |
| 62 | screens/rc-checkbox/chromium/000283-2-actual.png · shadcn-light-large-disabled-selected.png | 589d5096225089ace70dced36be81629d1e590851431dcdf58d5450f93169b75 | 主项显示灰色填充与实际勾选标记，禁用标签变淡；实际checked及disabled的原生断言通过。【主项真实已勾选且disabled，但下方“当前选择: off”】 |
| 63 | screens/rc-checkbox/chromium/000284-2-actual.png · shadcn-light-large-indeterminate.png | 414496d4a42011662b84120b1e3855eb0f9b09709ec11af5d00589a9553d1b87 | 主项有清楚的白色水平横杠，与勾选勾形不同；深色填充及边界完整。【实际半选横杠和aria-checked=mixed存在，但输出仍为off】 |
| 64 | screens/rc-checkbox/chromium/000285-2-actual.png · shadcn-light-large-indeterminate-error.png | 63c2ad4e8fa6819cbe601ffbeab2609a75bdf04be2bc950603d196387fa312ba | 主项有清楚的白色水平横杠，与勾选勾形不同；红色填充及边界完整。 红色错误边界或填充可辨，错误段落完整；aria-invalid/关联描述由原生断言确认。【实际半选横杠和aria-checked=mixed存在，但输出仍为off】 |
| 65 | screens/rc-checkbox/chromium/000286-2-actual.png · shadcn-light-large-disabled-indeterminate.png | ee524f3488bf10195087129e6672437fb86d41d86262601fbac385ddb2831fd0 | 主项有清楚的白色水平横杠，与勾选勾形不同；灰色填充及边界完整。【实际半选横杠和aria-checked=mixed存在，但输出仍为off】 |
| 66 | screens/rc-checkbox/chromium/000287-2-actual.png · shadcn-dark-small-default.png | 79c1daaee126f544190e4883179f9acd3faf17582501e62976b5f28e89a45ad9 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 |
| 67 | screens/rc-checkbox/chromium/000288-2-actual.png · shadcn-dark-small-hover.png | 47a54111d7df50ad8481be217feba299a6f187ad40e2d02c3923e6a73d2ea5a4 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 目标悬停边界/填充可见，状态差异较轻，截图不能替代实际hover动作。 |
| 68 | screens/rc-checkbox/chromium/000289-2-actual.png · shadcn-dark-small-focus-visible.png | 49f96ad5db7ccf821ce22a0241362b843f8072b5b23bf2971549747c4eea0d96 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 实际键盘目标外焦点圈完整，四边未裁切，未压住标签。 |
| 69 | screens/rc-checkbox/chromium/000290-2-actual.png · shadcn-dark-small-pressed.png | 47a54111d7df50ad8481be217feba299a6f187ad40e2d02c3923e6a73d2ea5a4 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 原生真实mouse.down期间采集；静态按下与普通态差异小，未据此声称独立明显压下动画。 |
| 70 | screens/rc-checkbox/chromium/000291-2-actual.png · shadcn-dark-small-selected.png | d206d3f869801c1c6edfc97ec63c56a5a492a6e1e714cf22646483a0db23b127 | 白底黑勾主项清楚，on反馈可见；禁用对照项层级可区分。 |
| 71 | screens/rc-checkbox/chromium/000292-2-actual.png · shadcn-dark-small-selected-hover.png | d206d3f869801c1c6edfc97ec63c56a5a492a6e1e714cf22646483a0db23b127 | 白底黑勾主项清楚，on反馈可见；禁用对照项层级可区分。 目标悬停边界/填充可见，状态差异较轻，截图不能替代实际hover动作。 |
| 72 | screens/rc-checkbox/chromium/000293-2-actual.png · shadcn-dark-small-selected-focus-visible.png | 77b1586ae3148f62793bef8442f1898d8703e90c38d095fc4cc28bec0088559f | 白底黑勾主项清楚，on反馈可见；禁用对照项层级可区分。 实际键盘目标外焦点圈完整，四边未裁切，未压住标签。 |
| 73 | screens/rc-checkbox/chromium/000294-2-actual.png · shadcn-dark-small-selected-pressed.png | d206d3f869801c1c6edfc97ec63c56a5a492a6e1e714cf22646483a0db23b127 | 白底黑勾主项清楚，on反馈可见；禁用对照项层级可区分。 原生真实mouse.down期间采集；静态按下与普通态差异小，未据此声称独立明显压下动画。 |
| 74 | screens/rc-checkbox/chromium/000295-2-actual.png · shadcn-dark-small-error.png | 5911bfdbd60c8fc349ee6cc7bccab69e17edd958b9626b571eca1a3622d54683 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 浅粉/浅红错误边界或填充可辨，错误段落完整；aria-invalid/关联描述由原生断言确认。 |
| 75 | screens/rc-checkbox/chromium/000296-2-actual.png · shadcn-dark-small-selected-error.png | a039f854567b2510a128cfbfe23aaea1fd85925d41f936652ce1e64f64061be9 | 浅粉底深色勾主项清楚，on反馈可见；错误填充/错误段落完整。 浅粉/浅红错误边界或填充可辨，错误段落完整；aria-invalid/关联描述由原生断言确认。 |
| 76 | screens/rc-checkbox/chromium/000297-2-actual.png · shadcn-dark-small-disabled.png | b5764832c36843aabe5a0d68b588005de361faeb532fb9095b726f74f50b6ac9 | 灰色禁用空框、标签和禁用已选对照均可辨；off结果可见。 |
| 77 | screens/rc-checkbox/chromium/000298-2-actual.png · shadcn-dark-small-disabled-selected.png | 072af03e005452c210cc67d6c26c97b4c68a6f40d686a83429070e7358553c31 | 主项显示灰色填充与实际勾选标记，禁用标签变淡；实际checked及disabled的原生断言通过。【主项真实已勾选且disabled，但下方“当前选择: off”】 |
| 78 | screens/rc-checkbox/chromium/000299-2-actual.png · shadcn-dark-small-indeterminate.png | 581438f1d4bb9163f61cc35b56f9e3a1a91dd73c5e51fa3b3bc7f33f5437f3d1 | 主项有清楚的深色水平横杠，与勾选勾形不同；白色填充及边界完整。【实际半选横杠和aria-checked=mixed存在，但输出仍为off】 |
| 79 | screens/rc-checkbox/chromium/000300-2-actual.png · shadcn-dark-small-indeterminate-error.png | 571ad607251cc248fc09031273fb440b4951eb222d62b82ad4f19777caeb6b50 | 主项有清楚的深色水平横杠，与勾选勾形不同；浅粉色填充及边界完整。 浅粉/浅红错误边界或填充可辨，错误段落完整；aria-invalid/关联描述由原生断言确认。【实际半选横杠和aria-checked=mixed存在，但输出仍为off】 |
| 80 | screens/rc-checkbox/chromium/000301-2-actual.png · shadcn-dark-small-disabled-indeterminate.png | cc8f3aac2489f8a28a5339a039edca232e8bf9266ab5cff361c55488011d79ab | 主项有清楚的深色水平横杠，与勾选勾形不同；灰色填充及边界完整。【实际半选横杠和aria-checked=mixed存在，但输出仍为off】 |
| 81 | screens/rc-checkbox/chromium/000302-2-actual.png · shadcn-dark-medium-default.png | 4f5d03b670fd924c50ccd1d71e1fae6274e2e724dc53c4cc6d7cb35caa5aebe7 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 |
| 82 | screens/rc-checkbox/chromium/000303-2-actual.png · shadcn-dark-medium-hover.png | 051338e0c9236969c1e459a21eeaa9796f244198f2368d6d0bdadb23a93a3e59 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 目标悬停边界/填充可见，状态差异较轻，截图不能替代实际hover动作。 |
| 83 | screens/rc-checkbox/chromium/000304-2-actual.png · shadcn-dark-medium-focus-visible.png | 28d5ca643958b27ccb00e5be726a8045ec2a9aeec82a58c1f4e538075e7bd997 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 实际键盘目标外焦点圈完整，四边未裁切，未压住标签。 |
| 84 | screens/rc-checkbox/chromium/000305-2-actual.png · shadcn-dark-medium-pressed.png | 051338e0c9236969c1e459a21eeaa9796f244198f2368d6d0bdadb23a93a3e59 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 原生真实mouse.down期间采集；静态按下与普通态差异小，未据此声称独立明显压下动画。 |
| 85 | screens/rc-checkbox/chromium/000306-2-actual.png · shadcn-dark-medium-selected.png | 5e3ce16fb45ddd5dae1d981240e6876cc9cbc00feffb2d55f1bcee8d32d24b07 | 白底黑勾主项清楚，on反馈可见；禁用对照项层级可区分。 |
| 86 | screens/rc-checkbox/chromium/000307-2-actual.png · shadcn-dark-medium-selected-hover.png | 5e3ce16fb45ddd5dae1d981240e6876cc9cbc00feffb2d55f1bcee8d32d24b07 | 白底黑勾主项清楚，on反馈可见；禁用对照项层级可区分。 目标悬停边界/填充可见，状态差异较轻，截图不能替代实际hover动作。 |
| 87 | screens/rc-checkbox/chromium/000308-2-actual.png · shadcn-dark-medium-selected-focus-visible.png | bee7a4b8a06822a7299c9e9009e4c1a86d7d0f55d073c38a5b8a8b293f57149f | 白底黑勾主项清楚，on反馈可见；禁用对照项层级可区分。 实际键盘目标外焦点圈完整，四边未裁切，未压住标签。 |
| 88 | screens/rc-checkbox/chromium/000309-2-actual.png · shadcn-dark-medium-selected-pressed.png | 5e3ce16fb45ddd5dae1d981240e6876cc9cbc00feffb2d55f1bcee8d32d24b07 | 白底黑勾主项清楚，on反馈可见；禁用对照项层级可区分。 原生真实mouse.down期间采集；静态按下与普通态差异小，未据此声称独立明显压下动画。 |
| 89 | screens/rc-checkbox/chromium/000310-2-actual.png · shadcn-dark-medium-error.png | 6f5473ad51ac6eab451859ea131d01ea394a3868efde23c3a93aeb3de50cca2c | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 浅粉/浅红错误边界或填充可辨，错误段落完整；aria-invalid/关联描述由原生断言确认。 |
| 90 | screens/rc-checkbox/chromium/000311-2-actual.png · shadcn-dark-medium-selected-error.png | 861ed93ed4ab8a5179c1d3b77fda2440511b2c2b8bfe0e6ceb167d6501d7d0a6 | 浅粉底深色勾主项清楚，on反馈可见；错误填充/错误段落完整。 浅粉/浅红错误边界或填充可辨，错误段落完整；aria-invalid/关联描述由原生断言确认。 |
| 91 | screens/rc-checkbox/chromium/000312-2-actual.png · shadcn-dark-medium-disabled.png | cd48ccf0cc7ae45cea262e0595d09a4cfcc368dbad50621902f912f6046c2215 | 灰色禁用空框、标签和禁用已选对照均可辨；off结果可见。 |
| 92 | screens/rc-checkbox/chromium/000313-2-actual.png · shadcn-dark-medium-disabled-selected.png | f4696c2cdb7c8486ddacffc5bcf15273bc56985c8b903573ef3256220e5863b2 | 主项显示灰色填充与实际勾选标记，禁用标签变淡；实际checked及disabled的原生断言通过。【主项真实已勾选且disabled，但下方“当前选择: off”】 |
| 93 | screens/rc-checkbox/chromium/000314-2-actual.png · shadcn-dark-medium-indeterminate.png | e68c2546861acdcaa5d169a19cd5a37ad1578ef591bf61f1b4a296f1423f77a7 | 主项有清楚的深色水平横杠，与勾选勾形不同；白色填充及边界完整。【实际半选横杠和aria-checked=mixed存在，但输出仍为off】 |
| 94 | screens/rc-checkbox/chromium/000315-2-actual.png · shadcn-dark-medium-indeterminate-error.png | fec2eb7f13fe66689f5ded512ef3386ed1eebe18895292e00f43a2580ee9e87b | 主项有清楚的深色水平横杠，与勾选勾形不同；浅粉色填充及边界完整。 浅粉/浅红错误边界或填充可辨，错误段落完整；aria-invalid/关联描述由原生断言确认。【实际半选横杠和aria-checked=mixed存在，但输出仍为off】 |
| 95 | screens/rc-checkbox/chromium/000316-2-actual.png · shadcn-dark-medium-disabled-indeterminate.png | 0cf5d1bf9eb08f9e267724f4332bdbfb42cd69c86f5851fb29e1cce0e93d6dbb | 主项有清楚的深色水平横杠，与勾选勾形不同；灰色填充及边界完整。【实际半选横杠和aria-checked=mixed存在，但输出仍为off】 |
| 96 | screens/rc-checkbox/chromium/000317-2-actual.png · shadcn-dark-large-default.png | 989c8df14643f7f82902672094a387d3680a0809f4165a5091e4752f81e8cf84 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 |
| 97 | screens/rc-checkbox/chromium/000318-2-actual.png · shadcn-dark-large-hover.png | 03139e01d692fbb5ced7d87f3160a4faa02dfeb868316b019ccec7ef0456a9ee | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 目标悬停边界/填充可见，状态差异较轻，截图不能替代实际hover动作。 |
| 98 | screens/rc-checkbox/chromium/000319-2-actual.png · shadcn-dark-large-focus-visible.png | 2c88d07106bd8aaeacbf61eaaaf9149181dc366426048f3b41ceda37cb25523c | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 实际键盘目标外焦点圈完整，四边未裁切，未压住标签。 |
| 99 | screens/rc-checkbox/chromium/000320-2-actual.png · shadcn-dark-large-pressed.png | 03139e01d692fbb5ced7d87f3160a4faa02dfeb868316b019ccec7ef0456a9ee | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 原生真实mouse.down期间采集；静态按下与普通态差异小，未据此声称独立明显压下动画。 |
| 100 | screens/rc-checkbox/chromium/000321-2-actual.png · shadcn-dark-large-selected.png | e64e3dccc2216e77550e8be17898e05505697b78597dbd8b59e177bb6efddc57 | 白底黑勾主项清楚，on反馈可见；禁用对照项层级可区分。 |
| 101 | screens/rc-checkbox/chromium/000322-2-actual.png · shadcn-dark-large-selected-hover.png | e64e3dccc2216e77550e8be17898e05505697b78597dbd8b59e177bb6efddc57 | 白底黑勾主项清楚，on反馈可见；禁用对照项层级可区分。 目标悬停边界/填充可见，状态差异较轻，截图不能替代实际hover动作。 |
| 102 | screens/rc-checkbox/chromium/000323-2-actual.png · shadcn-dark-large-selected-focus-visible.png | d54157516fd9c976cf821dc2e22e73db659b4fc04dc9932f0fb7599e493ab166 | 白底黑勾主项清楚，on反馈可见；禁用对照项层级可区分。 实际键盘目标外焦点圈完整，四边未裁切，未压住标签。 |
| 103 | screens/rc-checkbox/chromium/000324-2-actual.png · shadcn-dark-large-selected-pressed.png | e64e3dccc2216e77550e8be17898e05505697b78597dbd8b59e177bb6efddc57 | 白底黑勾主项清楚，on反馈可见；禁用对照项层级可区分。 原生真实mouse.down期间采集；静态按下与普通态差异小，未据此声称独立明显压下动画。 |
| 104 | screens/rc-checkbox/chromium/000325-2-actual.png · shadcn-dark-large-error.png | 7bb988b7997c9fde6029be2157e1131ad12e31e392c124a34f8c3e51838c3910 | 未选中空框、标签和禁用已选对照均可辨；off结果可见。 浅粉/浅红错误边界或填充可辨，错误段落完整；aria-invalid/关联描述由原生断言确认。 |
| 105 | screens/rc-checkbox/chromium/000326-2-actual.png · shadcn-dark-large-selected-error.png | 28fb3fb7c181945c1847cab07928b9038aaa933c664fcf8fe4a82aaff38fab45 | 浅粉底深色勾主项清楚，on反馈可见；错误填充/错误段落完整。 浅粉/浅红错误边界或填充可辨，错误段落完整；aria-invalid/关联描述由原生断言确认。 |
| 106 | screens/rc-checkbox/chromium/000327-2-actual.png · shadcn-dark-large-disabled.png | 27af6970345650ab9e4c7f46691460fdc5891c1b61f198637b423da79db197c8 | 灰色禁用空框、标签和禁用已选对照均可辨；off结果可见。 |
| 107 | screens/rc-checkbox/chromium/000328-2-actual.png · shadcn-dark-large-disabled-selected.png | 4e5f5f45fa7e3a7fbb5e5c0da8b428593f23b889cd434514e07b46da8f982330 | 主项显示灰色填充与实际勾选标记，禁用标签变淡；实际checked及disabled的原生断言通过。【主项真实已勾选且disabled，但下方“当前选择: off”】 |
| 108 | screens/rc-checkbox/chromium/000329-2-actual.png · shadcn-dark-large-indeterminate.png | 7e2caae17230819f89dd4ba394fb29a9ecfb28e62984070864edd36a326a0e63 | 主项有清楚的深色水平横杠，与勾选勾形不同；白色填充及边界完整。【实际半选横杠和aria-checked=mixed存在，但输出仍为off】 |
| 109 | screens/rc-checkbox/chromium/000330-2-actual.png · shadcn-dark-large-indeterminate-error.png | b769c1e757eff59b4e07da2f9d2c27ab79043f7e7ea189f4da362842a9bf1b1d | 主项有清楚的深色水平横杠，与勾选勾形不同；浅粉色填充及边界完整。 浅粉/浅红错误边界或填充可辨，错误段落完整；aria-invalid/关联描述由原生断言确认。【实际半选横杠和aria-checked=mixed存在，但输出仍为off】 |
| 110 | screens/rc-checkbox/chromium/000331-2-actual.png · shadcn-dark-large-disabled-indeterminate.png | 82bc0c8522564727ac2ba0bee4dc8cd755d795295d9fa6c5a985140d69303999 | 主项有清楚的深色水平横杠，与勾选勾形不同；灰色填充及边界完整。【实际半选横杠和aria-checked=mixed存在，但输出仍为off】 |
| 111 | screens/rc-checkbox/chromium/000336-0-inventory-actual.png · test/visual/inventory.visual.spec.mjs | 6ddbbcce1466190ce2e04b9fd173cb22e969bab9b93c5f77d370673fa02d68ab | 默认公开Demo只显示一个空框及Checkbox文字，位于原始1280×720视口顶部；完整可见但不替代15状态矩阵。 |
| 112 | screens/rc-checkbox/chromium/000337-0-inventory-actual.png · test/visual/inventory.visual.spec.mjs | cc329128e599cd2693710c4e2ea3596dc2194d7523c3533ca6d99f90ac6a6bf8 | 默认公开Demo只显示一个空框及Checkbox文字，位于原始1280×720视口顶部；完整可见但不替代15状态矩阵。 |

重复SHA分组（全部逐张看过）：

- 08e752bb63830fd76b782d680818aea3f97b519143d8da9048b529205cd88d58：序号2、3、9、40、41、43。
- 5e3ce16fb45ddd5dae1d981240e6876cc9cbc00feffb2d55f1bcee8d32d24b07：序号11、12、18、85、86、88。
- 663bee0824491d65478942e48b69e8ff4259b0cdc851d4095304114941369372：序号22、24。
- 81e7d665aefd5c390999bbc3789c564dc8902097561c184a5ac48e9baa4d9a9a：序号25、26、28。
- 68a71b01f4804beb4fdda0cb0593b09c449f3dc29c22af7801984dea7f8dd231：序号37、39。
- e2e1d8a394ecce8b900581135dcf4aabb335cc4d599eb5567f000de457726b8b：序号52、54。
- b513ff1bb99cb69d8be25fdfed4faaa30b89fb845bd36cd784015f313e2f84b0：序号55、56、58。
- 47a54111d7df50ad8481be217feba299a6f187ad40e2d02c3923e6a73d2ea5a4：序号67、69。
- d206d3f869801c1c6edfc97ec63c56a5a492a6e1e714cf22646483a0db23b127：序号70、71、73。
- 051338e0c9236969c1e459a21eeaa9796f244198f2368d6d0bdadb23a93a3e59：序号82、84。
- 03139e01d692fbb5ced7d87f3160a4faa02dfeb868316b019ccec7ef0456a9ee：序号97、99。
- e64e3dccc2216e77550e8be17898e05505697b78597dbd8b59e177bb6efddc57：序号100、101、103。

完整case id、逐图配置/原生附件索引、自动断言与几何原记录、独立人工观察、问题位置和来源文件SHA见reviews-shadcn.json。没有新浏览器、构建或截图，没有canonical/baseline/verified推广。
