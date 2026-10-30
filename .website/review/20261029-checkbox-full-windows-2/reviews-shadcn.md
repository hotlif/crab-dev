# Checkbox shadcn：Windows 第二完整候选原图复审

112张原PNG（含重复）已逐张view_image original查看；112/112 SHA与原生JSON附件及分组索引一致。结论仅接受当前Windows候选原图所见范围，无未解决的本次图像问题，不建立baseline/verified。第一候选及其pending报告原样保留。

原生包级337通过、0失败、0跳过；核心270/270、环境60/60保持原始自动结果。shadcn人工范围：90核心（3尺寸×明暗×15状态）、18九环境×明暗、2真实200%视口、2库存，共112图。两worker before/after稳定。source sha256:2eccc74e9526d65ff758563fe29c3ab605a43cb9e782830e31abbc17a15f4ec7；artifact sha256:f545945a259e76a3cbb7fd6c42b29d431f00ac4a92e500600a96e0256cf6ef82。

修复实际复核：6张disabled-selected（32、47、62、77、92、107）均有灰色勾且输出on；18张mixed状态（33、34、35、48、49、50、63、64、65、78、79、80、93、94、95、108、109、110）均有清晰横杠，并完整显示mixed（半选，布尔值: off）。真实布尔checked和indeterminate、aria-checked及本地化输出已由原生语义断言核对，非照抄Demo属性；人工只记录原图所见，两种证据分开。

其他所见：空框/勾/半选横杠、错误红色或浅粉填充/边框、禁用灰度均可区分，标签与错误段落完整，焦点外圈没有被裁切或压住标签。触控图中的视觉标记仍紧凑，实际命中control≥48×48px由原生几何证明。RTL、英文、品牌及强制颜色所见均记录；减少动画只作静态外观观察。

真实200%两张均完整显示主项、禁用对照、on和外焦点圈，绑定chrome.tabs.setZoom证明，记录仅为实际可见视口，不扩大为全页/其他浏览器或缩放级别。

本批88种原PNG字节，12重复SHA组，超首次重复24张；每张仍已重新实际查看。历史字节比较：24张不同、88张相同，变化状态为disabled-selected、indeterminate、indeterminate-error、disabled-indeterminate，仅为旧新原始字节核对，不是baseline比较。旧候选原图和原337通过/112pending记录不改写。

| 序号 | 原图/配置 | SHA-256 | 实际观察 |
| --- | --- | --- | --- |
| 1 | screens/rc-checkbox/chromium/000038-2-actual.png · shadcn-light-narrow.png | bb7e5b6f1a19cfb8024173537fb610ab8b905294253d7d1af9b42b4e41888123 | 主项深底白勾、on反馈与真实勾选一致，禁用对照与其可区分。 窄屏长标签自然两行，未裁字或横溢，状态输出完整。 |
| 2 | screens/rc-checkbox/chromium/000039-2-actual.png · shadcn-light-tablet.png | 08e752bb63830fd76b782d680818aea3f97b519143d8da9048b529205cd88d58 | 主项深底白勾、on反馈与真实勾选一致，禁用对照与其可区分。 |
| 3 | screens/rc-checkbox/chromium/000040-2-actual.png · shadcn-light-desktop.png | 08e752bb63830fd76b782d680818aea3f97b519143d8da9048b529205cd88d58 | 主项深底白勾、on反馈与真实勾选一致，禁用对照与其可区分。 |
| 4 | screens/rc-checkbox/chromium/000041-2-actual.png · shadcn-light-touch.png | d43e34269fbe959661dd7c825e9ceece384481b3a95a1f554abe0361185db848 | 主项深底白勾、on反馈与真实勾选一致，禁用对照与其可区分。 视觉小方框仍紧凑，外部真实触控control区域原生测量≥48×48px；文字、标记未重叠。 |
| 5 | screens/rc-checkbox/chromium/000042-2-actual.png · shadcn-light-rtl.png | a9245aae019dfdf6dcf2e847d9c8759e2bce09b760067617d233ef7e8d6cc0c7 | 主项深底白勾、on反馈与真实勾选一致，禁用对照与其可区分。 控制在右、标签与结果右对齐，镜像正确。 |
| 6 | screens/rc-checkbox/chromium/000043-2-actual.png · shadcn-light-english.png | b49e4ab6cd374e952e5e33b1c92d1fb65b680c2693ec682b091363d1b76af8f0 | 主项深底白勾、on反馈与真实勾选一致，禁用对照与其可区分。 英文长标签及Selected · unavailable完整，Selection: on可见。 |
| 7 | screens/rc-checkbox/chromium/000044-2-actual.png · shadcn-light-brand.png | 9f26cdb56f2a6df47e8922dd8855a324ff9f31c8f58cd500f98eeffa9520bf73 | 主项紫底白勾、on反馈与真实勾选一致，禁用对照与其可区分。 品牌填充清楚，勾与禁用灰度对照清楚。 |
| 8 | screens/rc-checkbox/chromium/000045-2-actual.png · shadcn-light-forced-colors.png | a9c2a02545eb55995397e90a7fc0bc1fb28929b727b157123bf5befda97dfced | 主项紫底白勾、on反馈与真实勾选一致，禁用对照与其可区分。 禁用深红为本次系统配色所见，不误作普通状态error或语义色；文字和勾完整。 |
| 9 | screens/rc-checkbox/chromium/000046-2-actual.png · shadcn-light-reduced-motion.png | 08e752bb63830fd76b782d680818aea3f97b519143d8da9048b529205cd88d58 | 主项深底白勾、on反馈与真实勾选一致，禁用对照与其可区分。 本图只证明该条件静态外观，不能从PNG推断时长。 |
| 10 | screens/rc-checkbox/chromium/000047-2-actual.png · shadcn-dark-narrow.png | ae2054a01dfae91021b731dae4c800dcb0a46201788c869320f00b5a335ed6e0 | 主项白底黑勾、on反馈与真实勾选一致，禁用对照与其可区分。 窄屏长标签自然两行，未裁字或横溢，状态输出完整。 |
| 11 | screens/rc-checkbox/chromium/000048-2-actual.png · shadcn-dark-tablet.png | 5e3ce16fb45ddd5dae1d981240e6876cc9cbc00feffb2d55f1bcee8d32d24b07 | 主项白底黑勾、on反馈与真实勾选一致，禁用对照与其可区分。 |
| 12 | screens/rc-checkbox/chromium/000049-2-actual.png · shadcn-dark-desktop.png | 5e3ce16fb45ddd5dae1d981240e6876cc9cbc00feffb2d55f1bcee8d32d24b07 | 主项白底黑勾、on反馈与真实勾选一致，禁用对照与其可区分。 |
| 13 | screens/rc-checkbox/chromium/000050-2-actual.png · shadcn-dark-touch.png | f221b2ba85569a9e3a928c42cae7fff66560d151237037463f22676779610f5e | 主项白底黑勾、on反馈与真实勾选一致，禁用对照与其可区分。 视觉小方框仍紧凑，外部真实触控control区域原生测量≥48×48px；文字、标记未重叠。 |
| 14 | screens/rc-checkbox/chromium/000051-2-actual.png · shadcn-dark-rtl.png | d60fa797bf06905975fa1282d3016acd4dbd13f26a15bbb1f4a352039182089c | 主项白底黑勾、on反馈与真实勾选一致，禁用对照与其可区分。 控制在右、标签与结果右对齐，镜像正确。 |
| 15 | screens/rc-checkbox/chromium/000052-2-actual.png · shadcn-dark-english.png | e6e357ac079baeccf04d26eab25daea704a9f3aeb628f29fd9bd201afbb92e6b | 主项白底黑勾、on反馈与真实勾选一致，禁用对照与其可区分。 英文长标签及Selected · unavailable完整，Selection: on可见。 |
| 16 | screens/rc-checkbox/chromium/000053-2-actual.png · shadcn-dark-brand.png | caa23db6f18adfa9f35c5f13e332297428269327e20275906d5e2373e4acece5 | 主项淡紫底深色勾、on反馈与真实勾选一致，禁用对照与其可区分。 品牌填充清楚，勾与禁用灰度对照清楚。 |
| 17 | screens/rc-checkbox/chromium/000054-2-actual.png · shadcn-dark-forced-colors.png | 7ce0ab170a47b79ed2e5e7cd16d34fe2923dc429544302583d1320e39af47093 | 主项青底深色勾、on反馈与真实勾选一致，禁用对照与其可区分。 禁用绿色为本次系统配色所见，不误作普通状态error或语义色；文字和勾完整。 |
| 18 | screens/rc-checkbox/chromium/000055-2-actual.png · shadcn-dark-reduced-motion.png | 5e3ce16fb45ddd5dae1d981240e6876cc9cbc00feffb2d55f1bcee8d32d24b07 | 主项白底黑勾、on反馈与真实勾选一致，禁用对照与其可区分。 本图只证明该条件静态外观，不能从PNG推断时长。 |
| 19 | screens/rc-checkbox/chromium/000060-4-actual-zoom-200.png · shadcn-light-zoom-200.png | bf701a15f3bfd61af9a31097e5a2881c8484cb175b2f07c71137365fc9c255d3 | 实际200%可见视口内主项已勾、禁用对照、on输出及键盘外焦点圈全部完整；无横溢，不冒称全页或其他缩放。 |
| 20 | screens/rc-checkbox/chromium/000061-4-actual-zoom-200.png · shadcn-dark-zoom-200.png | e7ebf694a19c08fa463cacf74906ec99e1d8aa5d5a29431c6614c201c620ce39 | 实际200%可见视口内主项已勾、禁用对照、on输出及键盘外焦点圈全部完整；无横溢，不冒称全页或其他缩放。 |
| 21 | screens/rc-checkbox/chromium/000242-2-actual.png · shadcn-light-small-default.png | f6992afeb677b13f2d345f163256928ccc873b5050372a8c5d27ca70563b6176 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 |
| 22 | screens/rc-checkbox/chromium/000243-2-actual.png · shadcn-light-small-hover.png | 663bee0824491d65478942e48b69e8ff4259b0cdc851d4095304114941369372 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 目标悬停填充/描边可辨，差异轻微；原生真实hover动作与PNG分别记录。 |
| 23 | screens/rc-checkbox/chromium/000244-2-actual.png · shadcn-light-small-focus-visible.png | cb0ed680396139138e8a5ab99ab53cb9a784e08cfab8ff8af9f95a61b21c9a1e | 未选空框/标签完整可辨，off输出与未选布尔值一致。 键盘外焦点圈四边完整，未切角或遮住标签。 |
| 24 | screens/rc-checkbox/chromium/000245-2-actual.png · shadcn-light-small-pressed.png | 663bee0824491d65478942e48b69e8ff4259b0cdc851d4095304114941369372 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 原生mouse.down期间截图，静态差异较轻，不冒称独立明显压下动效。 |
| 25 | screens/rc-checkbox/chromium/000246-2-actual.png · shadcn-light-small-selected.png | 81e7d665aefd5c390999bbc3789c564dc8902097561c184a5ac48e9baa4d9a9a | 深底白勾清楚、on输出一致，禁用已选对照可区分。 |
| 26 | screens/rc-checkbox/chromium/000247-2-actual.png · shadcn-light-small-selected-hover.png | 81e7d665aefd5c390999bbc3789c564dc8902097561c184a5ac48e9baa4d9a9a | 深底白勾清楚、on输出一致，禁用已选对照可区分。 目标悬停填充/描边可辨，差异轻微；原生真实hover动作与PNG分别记录。 |
| 27 | screens/rc-checkbox/chromium/000248-2-actual.png · shadcn-light-small-selected-focus-visible.png | 24310ef216ea7fa47a3df5dd28805916d7a2199f4bc8a10a740cb3ad88101f53 | 深底白勾清楚、on输出一致，禁用已选对照可区分。 键盘外焦点圈四边完整，未切角或遮住标签。 |
| 28 | screens/rc-checkbox/chromium/000249-2-actual.png · shadcn-light-small-selected-pressed.png | 81e7d665aefd5c390999bbc3789c564dc8902097561c184a5ac48e9baa4d9a9a | 深底白勾清楚、on输出一致，禁用已选对照可区分。 原生mouse.down期间截图，静态差异较轻，不冒称独立明显压下动效。 |
| 29 | screens/rc-checkbox/chromium/000250-2-actual.png · shadcn-light-small-error.png | bef7e5f5dbf2b8e92350e9514df08de24f3ac82cff5038dac9f1a635c20ffd17 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 红色错误边界/填充及错误段落完整。 |
| 30 | screens/rc-checkbox/chromium/000251-2-actual.png · shadcn-light-small-selected-error.png | e06923f24e5b39575d77337c013ce078803ae60cd37637843ae31e6a0d43dbc0 | 红底白勾清楚、on输出一致，禁用已选对照可区分。 红色错误边界/填充及错误段落完整。 |
| 31 | screens/rc-checkbox/chromium/000252-2-actual.png · shadcn-light-small-disabled.png | 5c81b61eda3871e8307fe00662cba90833a253a76b96f0e5d65289d66b05ff0e | 禁用灰色空框/淡标签完整可辨，off输出与未选布尔值一致。 |
| 32 | screens/rc-checkbox/chromium/000253-2-actual.png · shadcn-light-small-disabled-selected.png | 95e9d2127701b4cce12fcafc058c969e27370771cd56914044de9a11921117a6 | 主项灰色填充和实际勾选标记可见、标签呈禁用灰度，输出现在为on，与真实checked=true一致；旧勾+off矛盾在新图已消失。 |
| 33 | screens/rc-checkbox/chromium/000254-2-actual.png · shadcn-light-small-indeterminate.png | 499928251c1350e1b0a5c67eb93219493bfd03a344a04fbaf792c1fe8dd95fff | 实际白色水平横杠与勾形不同；深色填充完整。输出为mixed（半选，布尔值: off），三态与布尔含义分别清楚，完整未裁切。 |
| 34 | screens/rc-checkbox/chromium/000255-2-actual.png · shadcn-light-small-indeterminate-error.png | b5f505e70df0d1df424fe2952d880c12afcf146939a9b97910e79381865d7170 | 实际白色水平横杠与勾形不同；红色填充完整。输出为mixed（半选，布尔值: off），三态与布尔含义分别清楚，完整未裁切。 红色错误边界/填充及错误段落完整。 |
| 35 | screens/rc-checkbox/chromium/000256-2-actual.png · shadcn-light-small-disabled-indeterminate.png | 00917e00676b8a3817754d5d024024265120405d7c376195b70076cd3855833e | 实际白色水平横杠与勾形不同；灰色填充完整。输出为mixed（半选，布尔值: off），三态与布尔含义分别清楚，完整未裁切。 |
| 36 | screens/rc-checkbox/chromium/000257-2-actual.png · shadcn-light-medium-default.png | 60862e3c0ce662d9893aba1dac2590d56de731ec93dd3ef0046477bc7963a413 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 |
| 37 | screens/rc-checkbox/chromium/000258-2-actual.png · shadcn-light-medium-hover.png | 68a71b01f4804beb4fdda0cb0593b09c449f3dc29c22af7801984dea7f8dd231 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 目标悬停填充/描边可辨，差异轻微；原生真实hover动作与PNG分别记录。 |
| 38 | screens/rc-checkbox/chromium/000259-2-actual.png · shadcn-light-medium-focus-visible.png | 3ed8d0c679eec1d7f1660b751ddfc67841782e01aa942f2c7d64759ff0c705ca | 未选空框/标签完整可辨，off输出与未选布尔值一致。 键盘外焦点圈四边完整，未切角或遮住标签。 |
| 39 | screens/rc-checkbox/chromium/000260-2-actual.png · shadcn-light-medium-pressed.png | 68a71b01f4804beb4fdda0cb0593b09c449f3dc29c22af7801984dea7f8dd231 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 原生mouse.down期间截图，静态差异较轻，不冒称独立明显压下动效。 |
| 40 | screens/rc-checkbox/chromium/000261-2-actual.png · shadcn-light-medium-selected.png | 08e752bb63830fd76b782d680818aea3f97b519143d8da9048b529205cd88d58 | 深底白勾清楚、on输出一致，禁用已选对照可区分。 |
| 41 | screens/rc-checkbox/chromium/000262-2-actual.png · shadcn-light-medium-selected-hover.png | 08e752bb63830fd76b782d680818aea3f97b519143d8da9048b529205cd88d58 | 深底白勾清楚、on输出一致，禁用已选对照可区分。 目标悬停填充/描边可辨，差异轻微；原生真实hover动作与PNG分别记录。 |
| 42 | screens/rc-checkbox/chromium/000263-2-actual.png · shadcn-light-medium-selected-focus-visible.png | 85be82dc108e45c0b26c66f0bb44ef3728ac652f1c82002941b35621ec924e56 | 深底白勾清楚、on输出一致，禁用已选对照可区分。 键盘外焦点圈四边完整，未切角或遮住标签。 |
| 43 | screens/rc-checkbox/chromium/000264-2-actual.png · shadcn-light-medium-selected-pressed.png | 08e752bb63830fd76b782d680818aea3f97b519143d8da9048b529205cd88d58 | 深底白勾清楚、on输出一致，禁用已选对照可区分。 原生mouse.down期间截图，静态差异较轻，不冒称独立明显压下动效。 |
| 44 | screens/rc-checkbox/chromium/000265-2-actual.png · shadcn-light-medium-error.png | 47c57cb9a397ce96fa6ac7c885742628b0f2cb5174b08b52c5255fd0bbf7ed19 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 红色错误边界/填充及错误段落完整。 |
| 45 | screens/rc-checkbox/chromium/000266-2-actual.png · shadcn-light-medium-selected-error.png | d2d4b6a9b3617170cf90440f00d6d576c257800f346ca71975326ebcd46db488 | 红底白勾清楚、on输出一致，禁用已选对照可区分。 红色错误边界/填充及错误段落完整。 |
| 46 | screens/rc-checkbox/chromium/000267-2-actual.png · shadcn-light-medium-disabled.png | be562bbc868749ae98427410a3c67f9e01e2cf784bfa6a0d3f5250df6ef4d730 | 禁用灰色空框/淡标签完整可辨，off输出与未选布尔值一致。 |
| 47 | screens/rc-checkbox/chromium/000268-2-actual.png · shadcn-light-medium-disabled-selected.png | 9fa3c66918382a55da5b5a940d297fe0798a16d39ee1d32e1a64a27fb9405404 | 主项灰色填充和实际勾选标记可见、标签呈禁用灰度，输出现在为on，与真实checked=true一致；旧勾+off矛盾在新图已消失。 |
| 48 | screens/rc-checkbox/chromium/000269-2-actual.png · shadcn-light-medium-indeterminate.png | 23317189e9b7eeed02c2448ed42c2ac99bc0e020e43d2adf87df537c8d07699e | 实际白色水平横杠与勾形不同；深色填充完整。输出为mixed（半选，布尔值: off），三态与布尔含义分别清楚，完整未裁切。 |
| 49 | screens/rc-checkbox/chromium/000270-2-actual.png · shadcn-light-medium-indeterminate-error.png | a3f3d9e03e8f43d7b79306c59c71d6077ad5528b9d20db8c80a4196fb71d9ed7 | 实际白色水平横杠与勾形不同；红色填充完整。输出为mixed（半选，布尔值: off），三态与布尔含义分别清楚，完整未裁切。 红色错误边界/填充及错误段落完整。 |
| 50 | screens/rc-checkbox/chromium/000271-2-actual.png · shadcn-light-medium-disabled-indeterminate.png | 22c94d9b4252d1aa129c321f9984666566d0541f00d26f7456a853cbd0c0fdc0 | 实际白色水平横杠与勾形不同；灰色填充完整。输出为mixed（半选，布尔值: off），三态与布尔含义分别清楚，完整未裁切。 |
| 51 | screens/rc-checkbox/chromium/000272-2-actual.png · shadcn-light-large-default.png | 9ab1c703fbbd00d75c6b74ceac24f3d6add3b887811cf4323b44d724a5155b95 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 |
| 52 | screens/rc-checkbox/chromium/000273-2-actual.png · shadcn-light-large-hover.png | e2e1d8a394ecce8b900581135dcf4aabb335cc4d599eb5567f000de457726b8b | 未选空框/标签完整可辨，off输出与未选布尔值一致。 目标悬停填充/描边可辨，差异轻微；原生真实hover动作与PNG分别记录。 |
| 53 | screens/rc-checkbox/chromium/000274-2-actual.png · shadcn-light-large-focus-visible.png | bb28655f85c50a9eb250a073165d739b8f31debb8ecc5d67bf4160cc08a17e92 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 键盘外焦点圈四边完整，未切角或遮住标签。 |
| 54 | screens/rc-checkbox/chromium/000275-2-actual.png · shadcn-light-large-pressed.png | e2e1d8a394ecce8b900581135dcf4aabb335cc4d599eb5567f000de457726b8b | 未选空框/标签完整可辨，off输出与未选布尔值一致。 原生mouse.down期间截图，静态差异较轻，不冒称独立明显压下动效。 |
| 55 | screens/rc-checkbox/chromium/000276-2-actual.png · shadcn-light-large-selected.png | b513ff1bb99cb69d8be25fdfed4faaa30b89fb845bd36cd784015f313e2f84b0 | 深底白勾清楚、on输出一致，禁用已选对照可区分。 |
| 56 | screens/rc-checkbox/chromium/000277-2-actual.png · shadcn-light-large-selected-hover.png | b513ff1bb99cb69d8be25fdfed4faaa30b89fb845bd36cd784015f313e2f84b0 | 深底白勾清楚、on输出一致，禁用已选对照可区分。 目标悬停填充/描边可辨，差异轻微；原生真实hover动作与PNG分别记录。 |
| 57 | screens/rc-checkbox/chromium/000278-2-actual.png · shadcn-light-large-selected-focus-visible.png | f28ecd05780ebaf9588c53b4a84dc2b08a5f0aa375020cdfd10adbfa46c532ca | 深底白勾清楚、on输出一致，禁用已选对照可区分。 键盘外焦点圈四边完整，未切角或遮住标签。 |
| 58 | screens/rc-checkbox/chromium/000279-2-actual.png · shadcn-light-large-selected-pressed.png | b513ff1bb99cb69d8be25fdfed4faaa30b89fb845bd36cd784015f313e2f84b0 | 深底白勾清楚、on输出一致，禁用已选对照可区分。 原生mouse.down期间截图，静态差异较轻，不冒称独立明显压下动效。 |
| 59 | screens/rc-checkbox/chromium/000280-2-actual.png · shadcn-light-large-error.png | 9b4d8ba227bac034a8271d840495f09bf541a982010aeb97e4a474de6d435c5d | 未选空框/标签完整可辨，off输出与未选布尔值一致。 红色错误边界/填充及错误段落完整。 |
| 60 | screens/rc-checkbox/chromium/000281-2-actual.png · shadcn-light-large-selected-error.png | ec4aabcae727252946524036eaf4320993a0d097af0524c0fb8a1265d79748cb | 红底白勾清楚、on输出一致，禁用已选对照可区分。 红色错误边界/填充及错误段落完整。 |
| 61 | screens/rc-checkbox/chromium/000282-2-actual.png · shadcn-light-large-disabled.png | 95f67bca0004541854e25c94ffe731efe90951ccc186cd8724dffc2f7479d48e | 禁用灰色空框/淡标签完整可辨，off输出与未选布尔值一致。 |
| 62 | screens/rc-checkbox/chromium/000283-2-actual.png · shadcn-light-large-disabled-selected.png | 959d204c1480020d00cdb5d918adfc5de0df35d6578ffd02dda3b7c3f1829c44 | 主项灰色填充和实际勾选标记可见、标签呈禁用灰度，输出现在为on，与真实checked=true一致；旧勾+off矛盾在新图已消失。 |
| 63 | screens/rc-checkbox/chromium/000284-2-actual.png · shadcn-light-large-indeterminate.png | 56755d709650b3363678759f60093b500c32418d67d54ee4ecd2335e90026de3 | 实际白色水平横杠与勾形不同；深色填充完整。输出为mixed（半选，布尔值: off），三态与布尔含义分别清楚，完整未裁切。 |
| 64 | screens/rc-checkbox/chromium/000285-2-actual.png · shadcn-light-large-indeterminate-error.png | 26ef5de55edae4a93b48865eaeef2da161e25251875e470c0684d822317c691d | 实际白色水平横杠与勾形不同；红色填充完整。输出为mixed（半选，布尔值: off），三态与布尔含义分别清楚，完整未裁切。 红色错误边界/填充及错误段落完整。 |
| 65 | screens/rc-checkbox/chromium/000286-2-actual.png · shadcn-light-large-disabled-indeterminate.png | 951772f079c45ca778c6a1054bdec2ee4abb62d61abbc33748303d23abb90ca1 | 实际白色水平横杠与勾形不同；灰色填充完整。输出为mixed（半选，布尔值: off），三态与布尔含义分别清楚，完整未裁切。 |
| 66 | screens/rc-checkbox/chromium/000287-2-actual.png · shadcn-dark-small-default.png | 79c1daaee126f544190e4883179f9acd3faf17582501e62976b5f28e89a45ad9 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 |
| 67 | screens/rc-checkbox/chromium/000288-2-actual.png · shadcn-dark-small-hover.png | 47a54111d7df50ad8481be217feba299a6f187ad40e2d02c3923e6a73d2ea5a4 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 目标悬停填充/描边可辨，差异轻微；原生真实hover动作与PNG分别记录。 |
| 68 | screens/rc-checkbox/chromium/000289-2-actual.png · shadcn-dark-small-focus-visible.png | 49f96ad5db7ccf821ce22a0241362b843f8072b5b23bf2971549747c4eea0d96 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 键盘外焦点圈四边完整，未切角或遮住标签。 |
| 69 | screens/rc-checkbox/chromium/000290-2-actual.png · shadcn-dark-small-pressed.png | 47a54111d7df50ad8481be217feba299a6f187ad40e2d02c3923e6a73d2ea5a4 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 原生mouse.down期间截图，静态差异较轻，不冒称独立明显压下动效。 |
| 70 | screens/rc-checkbox/chromium/000291-2-actual.png · shadcn-dark-small-selected.png | d206d3f869801c1c6edfc97ec63c56a5a492a6e1e714cf22646483a0db23b127 | 白底黑勾清楚、on输出一致，禁用已选对照可区分。 |
| 71 | screens/rc-checkbox/chromium/000292-2-actual.png · shadcn-dark-small-selected-hover.png | d206d3f869801c1c6edfc97ec63c56a5a492a6e1e714cf22646483a0db23b127 | 白底黑勾清楚、on输出一致，禁用已选对照可区分。 目标悬停填充/描边可辨，差异轻微；原生真实hover动作与PNG分别记录。 |
| 72 | screens/rc-checkbox/chromium/000293-2-actual.png · shadcn-dark-small-selected-focus-visible.png | 77b1586ae3148f62793bef8442f1898d8703e90c38d095fc4cc28bec0088559f | 白底黑勾清楚、on输出一致，禁用已选对照可区分。 键盘外焦点圈四边完整，未切角或遮住标签。 |
| 73 | screens/rc-checkbox/chromium/000294-2-actual.png · shadcn-dark-small-selected-pressed.png | d206d3f869801c1c6edfc97ec63c56a5a492a6e1e714cf22646483a0db23b127 | 白底黑勾清楚、on输出一致，禁用已选对照可区分。 原生mouse.down期间截图，静态差异较轻，不冒称独立明显压下动效。 |
| 74 | screens/rc-checkbox/chromium/000295-2-actual.png · shadcn-dark-small-error.png | 5911bfdbd60c8fc349ee6cc7bccab69e17edd958b9626b571eca1a3622d54683 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 浅红/浅粉错误边界/填充及错误段落完整。 |
| 75 | screens/rc-checkbox/chromium/000296-2-actual.png · shadcn-dark-small-selected-error.png | a039f854567b2510a128cfbfe23aaea1fd85925d41f936652ce1e64f64061be9 | 浅粉底深色勾清楚、on输出一致，禁用已选对照可区分。 浅红/浅粉错误边界/填充及错误段落完整。 |
| 76 | screens/rc-checkbox/chromium/000297-2-actual.png · shadcn-dark-small-disabled.png | b5764832c36843aabe5a0d68b588005de361faeb532fb9095b726f74f50b6ac9 | 禁用灰色空框/淡标签完整可辨，off输出与未选布尔值一致。 |
| 77 | screens/rc-checkbox/chromium/000298-2-actual.png · shadcn-dark-small-disabled-selected.png | a6080fc9c97eee54667ff093f181ed7a23306d7160dba33de1fe2b118427509c | 主项灰色填充和实际勾选标记可见、标签呈禁用灰度，输出现在为on，与真实checked=true一致；旧勾+off矛盾在新图已消失。 |
| 78 | screens/rc-checkbox/chromium/000299-2-actual.png · shadcn-dark-small-indeterminate.png | 33ebae9110c77bcb4f1929a83d829c6109d5dd262f95cf0874425fa798cbc99b | 实际深色水平横杠与勾形不同；白色填充完整。输出为mixed（半选，布尔值: off），三态与布尔含义分别清楚，完整未裁切。 |
| 79 | screens/rc-checkbox/chromium/000300-2-actual.png · shadcn-dark-small-indeterminate-error.png | 8045f6a7c1e1169f4340f0824248afb7960cc9dd74dbaa183063b15fddbcdc95 | 实际深色水平横杠与勾形不同；浅粉色填充完整。输出为mixed（半选，布尔值: off），三态与布尔含义分别清楚，完整未裁切。 浅红/浅粉错误边界/填充及错误段落完整。 |
| 80 | screens/rc-checkbox/chromium/000301-2-actual.png · shadcn-dark-small-disabled-indeterminate.png | fe5e863a0a7ad5968ef95222eaf0ad6d8f176acd988ad0ddd62aa3a9d69dc3f8 | 实际深色水平横杠与勾形不同；灰色填充完整。输出为mixed（半选，布尔值: off），三态与布尔含义分别清楚，完整未裁切。 |
| 81 | screens/rc-checkbox/chromium/000302-2-actual.png · shadcn-dark-medium-default.png | 4f5d03b670fd924c50ccd1d71e1fae6274e2e724dc53c4cc6d7cb35caa5aebe7 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 |
| 82 | screens/rc-checkbox/chromium/000303-2-actual.png · shadcn-dark-medium-hover.png | 051338e0c9236969c1e459a21eeaa9796f244198f2368d6d0bdadb23a93a3e59 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 目标悬停填充/描边可辨，差异轻微；原生真实hover动作与PNG分别记录。 |
| 83 | screens/rc-checkbox/chromium/000304-2-actual.png · shadcn-dark-medium-focus-visible.png | 28d5ca643958b27ccb00e5be726a8045ec2a9aeec82a58c1f4e538075e7bd997 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 键盘外焦点圈四边完整，未切角或遮住标签。 |
| 84 | screens/rc-checkbox/chromium/000305-2-actual.png · shadcn-dark-medium-pressed.png | 051338e0c9236969c1e459a21eeaa9796f244198f2368d6d0bdadb23a93a3e59 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 原生mouse.down期间截图，静态差异较轻，不冒称独立明显压下动效。 |
| 85 | screens/rc-checkbox/chromium/000306-2-actual.png · shadcn-dark-medium-selected.png | 5e3ce16fb45ddd5dae1d981240e6876cc9cbc00feffb2d55f1bcee8d32d24b07 | 白底黑勾清楚、on输出一致，禁用已选对照可区分。 |
| 86 | screens/rc-checkbox/chromium/000307-2-actual.png · shadcn-dark-medium-selected-hover.png | 5e3ce16fb45ddd5dae1d981240e6876cc9cbc00feffb2d55f1bcee8d32d24b07 | 白底黑勾清楚、on输出一致，禁用已选对照可区分。 目标悬停填充/描边可辨，差异轻微；原生真实hover动作与PNG分别记录。 |
| 87 | screens/rc-checkbox/chromium/000308-2-actual.png · shadcn-dark-medium-selected-focus-visible.png | bee7a4b8a06822a7299c9e9009e4c1a86d7d0f55d073c38a5b8a8b293f57149f | 白底黑勾清楚、on输出一致，禁用已选对照可区分。 键盘外焦点圈四边完整，未切角或遮住标签。 |
| 88 | screens/rc-checkbox/chromium/000309-2-actual.png · shadcn-dark-medium-selected-pressed.png | 5e3ce16fb45ddd5dae1d981240e6876cc9cbc00feffb2d55f1bcee8d32d24b07 | 白底黑勾清楚、on输出一致，禁用已选对照可区分。 原生mouse.down期间截图，静态差异较轻，不冒称独立明显压下动效。 |
| 89 | screens/rc-checkbox/chromium/000310-2-actual.png · shadcn-dark-medium-error.png | 6f5473ad51ac6eab451859ea131d01ea394a3868efde23c3a93aeb3de50cca2c | 未选空框/标签完整可辨，off输出与未选布尔值一致。 浅红/浅粉错误边界/填充及错误段落完整。 |
| 90 | screens/rc-checkbox/chromium/000311-2-actual.png · shadcn-dark-medium-selected-error.png | 861ed93ed4ab8a5179c1d3b77fda2440511b2c2b8bfe0e6ceb167d6501d7d0a6 | 浅粉底深色勾清楚、on输出一致，禁用已选对照可区分。 浅红/浅粉错误边界/填充及错误段落完整。 |
| 91 | screens/rc-checkbox/chromium/000312-2-actual.png · shadcn-dark-medium-disabled.png | cd48ccf0cc7ae45cea262e0595d09a4cfcc368dbad50621902f912f6046c2215 | 禁用灰色空框/淡标签完整可辨，off输出与未选布尔值一致。 |
| 92 | screens/rc-checkbox/chromium/000313-2-actual.png · shadcn-dark-medium-disabled-selected.png | b768c86901fbd8654d2dff2447453db6c4f58fab368b935784dbb1bdedc6cbf3 | 主项灰色填充和实际勾选标记可见、标签呈禁用灰度，输出现在为on，与真实checked=true一致；旧勾+off矛盾在新图已消失。 |
| 93 | screens/rc-checkbox/chromium/000314-2-actual.png · shadcn-dark-medium-indeterminate.png | aaeea4c1536d7cddd6ad32b5d9c70f6e840b8e387a5f6acc4d3bf99d3f5b266d | 实际深色水平横杠与勾形不同；白色填充完整。输出为mixed（半选，布尔值: off），三态与布尔含义分别清楚，完整未裁切。 |
| 94 | screens/rc-checkbox/chromium/000315-2-actual.png · shadcn-dark-medium-indeterminate-error.png | ef5e73585dccdba2d4d1eae3c48cd39e7ea738a4afd9755135ed2ddf1620b1fd | 实际深色水平横杠与勾形不同；浅粉色填充完整。输出为mixed（半选，布尔值: off），三态与布尔含义分别清楚，完整未裁切。 浅红/浅粉错误边界/填充及错误段落完整。 |
| 95 | screens/rc-checkbox/chromium/000316-2-actual.png · shadcn-dark-medium-disabled-indeterminate.png | 6511c67e73278bf36880b6326c288f96ac2c3d5c69ee2f35b85ca2e312f70a07 | 实际深色水平横杠与勾形不同；灰色填充完整。输出为mixed（半选，布尔值: off），三态与布尔含义分别清楚，完整未裁切。 |
| 96 | screens/rc-checkbox/chromium/000317-2-actual.png · shadcn-dark-large-default.png | 989c8df14643f7f82902672094a387d3680a0809f4165a5091e4752f81e8cf84 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 |
| 97 | screens/rc-checkbox/chromium/000318-2-actual.png · shadcn-dark-large-hover.png | 03139e01d692fbb5ced7d87f3160a4faa02dfeb868316b019ccec7ef0456a9ee | 未选空框/标签完整可辨，off输出与未选布尔值一致。 目标悬停填充/描边可辨，差异轻微；原生真实hover动作与PNG分别记录。 |
| 98 | screens/rc-checkbox/chromium/000319-2-actual.png · shadcn-dark-large-focus-visible.png | 2c88d07106bd8aaeacbf61eaaaf9149181dc366426048f3b41ceda37cb25523c | 未选空框/标签完整可辨，off输出与未选布尔值一致。 键盘外焦点圈四边完整，未切角或遮住标签。 |
| 99 | screens/rc-checkbox/chromium/000320-2-actual.png · shadcn-dark-large-pressed.png | 03139e01d692fbb5ced7d87f3160a4faa02dfeb868316b019ccec7ef0456a9ee | 未选空框/标签完整可辨，off输出与未选布尔值一致。 原生mouse.down期间截图，静态差异较轻，不冒称独立明显压下动效。 |
| 100 | screens/rc-checkbox/chromium/000321-2-actual.png · shadcn-dark-large-selected.png | e64e3dccc2216e77550e8be17898e05505697b78597dbd8b59e177bb6efddc57 | 白底黑勾清楚、on输出一致，禁用已选对照可区分。 |
| 101 | screens/rc-checkbox/chromium/000322-2-actual.png · shadcn-dark-large-selected-hover.png | e64e3dccc2216e77550e8be17898e05505697b78597dbd8b59e177bb6efddc57 | 白底黑勾清楚、on输出一致，禁用已选对照可区分。 目标悬停填充/描边可辨，差异轻微；原生真实hover动作与PNG分别记录。 |
| 102 | screens/rc-checkbox/chromium/000323-2-actual.png · shadcn-dark-large-selected-focus-visible.png | d54157516fd9c976cf821dc2e22e73db659b4fc04dc9932f0fb7599e493ab166 | 白底黑勾清楚、on输出一致，禁用已选对照可区分。 键盘外焦点圈四边完整，未切角或遮住标签。 |
| 103 | screens/rc-checkbox/chromium/000324-2-actual.png · shadcn-dark-large-selected-pressed.png | e64e3dccc2216e77550e8be17898e05505697b78597dbd8b59e177bb6efddc57 | 白底黑勾清楚、on输出一致，禁用已选对照可区分。 原生mouse.down期间截图，静态差异较轻，不冒称独立明显压下动效。 |
| 104 | screens/rc-checkbox/chromium/000325-2-actual.png · shadcn-dark-large-error.png | 7bb988b7997c9fde6029be2157e1131ad12e31e392c124a34f8c3e51838c3910 | 未选空框/标签完整可辨，off输出与未选布尔值一致。 浅红/浅粉错误边界/填充及错误段落完整。 |
| 105 | screens/rc-checkbox/chromium/000326-2-actual.png · shadcn-dark-large-selected-error.png | 28fb3fb7c181945c1847cab07928b9038aaa933c664fcf8fe4a82aaff38fab45 | 浅粉底深色勾清楚、on输出一致，禁用已选对照可区分。 浅红/浅粉错误边界/填充及错误段落完整。 |
| 106 | screens/rc-checkbox/chromium/000327-2-actual.png · shadcn-dark-large-disabled.png | 27af6970345650ab9e4c7f46691460fdc5891c1b61f198637b423da79db197c8 | 禁用灰色空框/淡标签完整可辨，off输出与未选布尔值一致。 |
| 107 | screens/rc-checkbox/chromium/000328-2-actual.png · shadcn-dark-large-disabled-selected.png | 5c0a64f11c8a47c28618a4f59ab5f8818fe966f73ce468626a205c2f66fd4203 | 主项灰色填充和实际勾选标记可见、标签呈禁用灰度，输出现在为on，与真实checked=true一致；旧勾+off矛盾在新图已消失。 |
| 108 | screens/rc-checkbox/chromium/000329-2-actual.png · shadcn-dark-large-indeterminate.png | 465195acacd722bedfd6380582832b16f80d257a2432fc9a573d82964239e1b1 | 实际深色水平横杠与勾形不同；白色填充完整。输出为mixed（半选，布尔值: off），三态与布尔含义分别清楚，完整未裁切。 |
| 109 | screens/rc-checkbox/chromium/000330-2-actual.png · shadcn-dark-large-indeterminate-error.png | f7d31d0eaab822d014fb4a1f3c1eea65743501f797d7d0501473c5de72de8d16 | 实际深色水平横杠与勾形不同；浅粉色填充完整。输出为mixed（半选，布尔值: off），三态与布尔含义分别清楚，完整未裁切。 浅红/浅粉错误边界/填充及错误段落完整。 |
| 110 | screens/rc-checkbox/chromium/000331-2-actual.png · shadcn-dark-large-disabled-indeterminate.png | 8cdd54a4a4b6843edc52c3e3be8e899a6bdc494bf56d1e5402aa55cc7ecc000d | 实际深色水平横杠与勾形不同；灰色填充完整。输出为mixed（半选，布尔值: off），三态与布尔含义分别清楚，完整未裁切。 |
| 111 | screens/rc-checkbox/chromium/000336-0-inventory-actual.png · test/visual/inventory.visual.spec.mjs | 6ddbbcce1466190ce2e04b9fd173cb22e969bab9b93c5f77d370673fa02d68ab | 公开默认库存图只有空框和Checkbox标签，位于1280×720视口上方且完整；不替代15状态矩阵。 |
| 112 | screens/rc-checkbox/chromium/000337-0-inventory-actual.png · test/visual/inventory.visual.spec.mjs | cc329128e599cd2693710c4e2ea3596dc2194d7523c3533ca6d99f90ac6a6bf8 | 公开默认库存图只有空框和Checkbox标签，位于1280×720视口上方且完整；不替代15状态矩阵。 |

重复SHA组（每张已实际看过）：

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

完整case id、配置、逐图原生附件索引/来源、自动几何和真实缩放原记录、独立人工观察及旧报告完整SHA见reviews-shadcn.json。没有新浏览器、构建、采集或图像编辑，没有canonical/baseline/verified推广。
