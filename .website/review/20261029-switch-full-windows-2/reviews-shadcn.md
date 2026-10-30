# Switch shadcn：Windows第二候选逐图复审

94张原PNG（含重复）已逐张view_image original查看，94/94 SHA与原生JSON附件、分组索引一致。未见本次未解决图像问题；仅接受当前Windows候选所见范围，不建立canonical/baseline/verified。

source sha256:1d017d0c4c1ea6d35670210281647d5c5fd8f4d749884c7d33b888021417d810；artifact sha256:69831c138b2af1787c171949e9110e39041a98eaede23b565ed7d8e17c80429d。两worker before/after稳定，源/资产清单摘要重算匹配，逐图真实Chromium版本/输入绑定匹配。原生283全通过（216核心、60环境含6zoom、边界及库存）原样保留，不替代人工观察。

shadcn人工范围72核心（3尺寸×明暗×12状态）、18九环境×明暗、2真实200%视口、2默认库存，共94。六个disabled-selected（32、44、56、68、80、92）灰轨道及逻辑开态拇指配on，未见开态却off矛盾。

轨道/拇指：浅色关态浅灰轨道与左白色细边拇指，开态深轨/右白拇指；暗色关态暗轨/左浅拇指，开态白轨/右深拇指，均在轨内。错误态红色或浅粉轨道/边与错误句完整；外焦点胶囊四边无裁切或压标签。部分hover/pressed没有额外明显静态层或与普通帧同字节，照实记录，不把交互动作等同视觉差异。

长文在窄屏/英文环境自然两行，RTL控制/拇指/标签/输出逻辑镜像正确。触控轨道本身保持紧凑，真实::before命中区≥48px、真实伪元素盒模型、命中边缘off→on、结果语义由原生独立证明；不以轨道视觉尺寸伪称命中尺寸。真实200%两原图仅可见视口，轨道、拇指、外环、标签及on完整，原生beforeEdgeInput/afterEdgeInput与chrome.tabs.setZoom记录单列。

旧-1实际artifact sha256:69831c138b2af1787c171949e9110e39041a98eaede23b565ed7d8e17c80429d与本批指纹及全部原记录数组完全一致；source分别保留，未把旧失败改成通过。新批只读几何/环境/zoom边缘交互证据与人工原图观察分开，不改任何源/图/历史。

本批62种PNG原字节，12重复SHA组，超过首次重复32张；每张仍实际查看。

| 序号 | 原图/目标 | SHA-256 | 实际观察 |
| --- | --- | --- | --- |
| 1 | screens/rc-switch/chromium/000038-2-actual.png · shadcn-light-narrow.png | c58a434431b06537c59cb94c0e78e9cba3e8fbce01cbf8cff5fbe7c39cb43bd5 | 深色开态轨道和浅色拇指清楚，on输出对应实际选中，禁用对照可区分。 长中文自然两行，轨道/拇指与标签/输出未裁切或重叠。 |
| 2 | screens/rc-switch/chromium/000039-2-actual.png · shadcn-light-tablet.png | 8d1a74782c3857627008b95f342547b05095f9bff272f36d093b38d42d85c96b | 深色开态轨道和浅色拇指清楚，on输出对应实际选中，禁用对照可区分。 |
| 3 | screens/rc-switch/chromium/000040-2-actual.png · shadcn-light-desktop.png | 8d1a74782c3857627008b95f342547b05095f9bff272f36d093b38d42d85c96b | 深色开态轨道和浅色拇指清楚，on输出对应实际选中，禁用对照可区分。 |
| 4 | screens/rc-switch/chromium/000041-2-actual.png · shadcn-light-touch.png | 8d1a74782c3857627008b95f342547b05095f9bff272f36d093b38d42d85c96b | 深色开态轨道和浅色拇指清楚，on输出对应实际选中，禁用对照可区分。 可见轨道保持紧凑，不把它冒称48px；实际::before命中区域≥48px及边缘触控反转/恢复由原生CDP盒模型和真实tap记录独立证明。 |
| 5 | screens/rc-switch/chromium/000042-2-actual.png · shadcn-light-rtl.png | 88e3372cc2136353f56662df5a802aa9438ea63c82b4b450512ec66d00952623 | 深色开态轨道和浅色拇指清楚，on输出对应实际选中，禁用对照可区分。 开态拇指在逻辑左端，控制位于右侧、标签和输出右对齐，镜像正确。 |
| 6 | screens/rc-switch/chromium/000043-2-actual.png · shadcn-light-english.png | cb508f27647541758c06bccae2c110ca74ef56ef01fa1edbd28a9d69d06ddecb | 深色开态轨道和浅色拇指清楚，on输出对应实际选中，禁用对照可区分。 英文长标签自然两行，Selection: on与禁用说明完整。 |
| 7 | screens/rc-switch/chromium/000044-2-actual.png · shadcn-light-brand.png | b5a8340c1676000426257053639428516c13d5bc49e9b44e41d66921792526d5 | 紫色开态轨道和浅色拇指清楚，on输出对应实际选中，禁用对照可区分。 品牌轨道清楚，拇指和禁用灰色对照可辨。 |
| 8 | screens/rc-switch/chromium/000045-2-actual.png · shadcn-light-forced-colors.png | 06ca9a8117734c0e42fcdbae1b715560521bd03c07b6f4618a30eb6969717633 | 紫色开态轨道和浅色拇指清楚，on输出对应实际选中，禁用对照可区分。 禁用对照深红是该系统调色板所见，未误作普通状态error；轨道、拇指及字仍清楚。 |
| 9 | screens/rc-switch/chromium/000046-2-actual.png · shadcn-light-reduced-motion.png | 8d1a74782c3857627008b95f342547b05095f9bff272f36d093b38d42d85c96b | 深色开态轨道和浅色拇指清楚，on输出对应实际选中，禁用对照可区分。 仅确认该媒体下静态外观，不从PNG推断动效时长。 |
| 10 | screens/rc-switch/chromium/000047-2-actual.png · shadcn-dark-narrow.png | 20b4979c67be922c451029ab663c86d67f702ccc49cf233e8e0b6a98b8ee6b32 | 白色开态轨道和深色拇指清楚，on输出对应实际选中，禁用对照可区分。 长中文自然两行，轨道/拇指与标签/输出未裁切或重叠。 |
| 11 | screens/rc-switch/chromium/000048-2-actual.png · shadcn-dark-tablet.png | f75c1d153dbbfe18ad18853d19c4f72c3ea94ebac8ca0d2a07489bf1ed3678a5 | 白色开态轨道和深色拇指清楚，on输出对应实际选中，禁用对照可区分。 |
| 12 | screens/rc-switch/chromium/000049-2-actual.png · shadcn-dark-desktop.png | f75c1d153dbbfe18ad18853d19c4f72c3ea94ebac8ca0d2a07489bf1ed3678a5 | 白色开态轨道和深色拇指清楚，on输出对应实际选中，禁用对照可区分。 |
| 13 | screens/rc-switch/chromium/000050-2-actual.png · shadcn-dark-touch.png | f75c1d153dbbfe18ad18853d19c4f72c3ea94ebac8ca0d2a07489bf1ed3678a5 | 白色开态轨道和深色拇指清楚，on输出对应实际选中，禁用对照可区分。 可见轨道保持紧凑，不把它冒称48px；实际::before命中区域≥48px及边缘触控反转/恢复由原生CDP盒模型和真实tap记录独立证明。 |
| 14 | screens/rc-switch/chromium/000051-2-actual.png · shadcn-dark-rtl.png | 872535895deab1288f6fcfa684a794b92f7f328ab54e4fa2a037bb42729cc599 | 白色开态轨道和深色拇指清楚，on输出对应实际选中，禁用对照可区分。 开态拇指在逻辑左端，控制位于右侧、标签和输出右对齐，镜像正确。 |
| 15 | screens/rc-switch/chromium/000052-2-actual.png · shadcn-dark-english.png | cca3141328b169dbb46b46f6ac87a7d27cbf45b0cb3b384a3431d7626a27544d | 白色开态轨道和深色拇指清楚，on输出对应实际选中，禁用对照可区分。 英文长标签自然两行，Selection: on与禁用说明完整。 |
| 16 | screens/rc-switch/chromium/000053-2-actual.png · shadcn-dark-brand.png | 412963ff61a2e02ce5769ffe307bcd19bd84741731ac4fe648dcd39203343966 | 淡紫色开态轨道和深色拇指清楚，on输出对应实际选中，禁用对照可区分。 品牌轨道清楚，拇指和禁用灰色对照可辨。 |
| 17 | screens/rc-switch/chromium/000054-2-actual.png · shadcn-dark-forced-colors.png | d66347c89fac009e1cbaa7516a34e998946d6a5eb823557534ff7ec7c869f061 | 青色开态轨道和深色拇指清楚，on输出对应实际选中，禁用对照可区分。 禁用对照绿色是该系统调色板所见，未误作普通状态error；轨道、拇指及字仍清楚。 |
| 18 | screens/rc-switch/chromium/000055-2-actual.png · shadcn-dark-reduced-motion.png | f75c1d153dbbfe18ad18853d19c4f72c3ea94ebac8ca0d2a07489bf1ed3678a5 | 白色开态轨道和深色拇指清楚，on输出对应实际选中，禁用对照可区分。 仅确认该媒体下静态外观，不从PNG推断动效时长。 |
| 19 | screens/rc-switch/chromium/000060-4-actual-zoom-200.png · shadcn-light-zoom-200.png | 54f445a9cfd30374724cf5fadc3c6ec4c564cdb090a45ccf6a0cc19e9d0a6be6 | 真实200%可见视口内开态轨道、右拇指、完整胶囊焦点圈、长标签、禁用对照和on输出均完整；不冒称全页或其他缩放。原生在真实测得命中边缘反转/恢复后重新键盘聚焦，几何记录与此截图分开。 |
| 20 | screens/rc-switch/chromium/000061-4-actual-zoom-200.png · shadcn-dark-zoom-200.png | 5324d8365fac768f55888334de5d53bc15feae6f84e6f5ea1c15e2e834c951e8 | 真实200%可见视口内开态轨道、右拇指、完整胶囊焦点圈、长标签、禁用对照和on输出均完整；不冒称全页或其他缩放。原生在真实测得命中边缘反转/恢复后重新键盘聚焦，几何记录与此截图分开。 |
| 21 | screens/rc-switch/chromium/000206-2-actual.png · shadcn-light-small-default.png | 5aa36bcfdee7ec8b570bb896e123c32f59a13ac981b9ef101487063e03bb5c49 | 关态浅灰轨道与左白色细描边拇指可辨、拇指在轨内；off反馈一致。 |
| 22 | screens/rc-switch/chromium/000207-2-actual.png · shadcn-light-small-hover.png | 5aa36bcfdee7ec8b570bb896e123c32f59a13ac981b9ef101487063e03bb5c49 | 关态浅灰轨道与左白色细描边拇指可辨、拇指在轨内；off反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 23 | screens/rc-switch/chromium/000208-2-actual.png · shadcn-light-small-focus-visible.png | d15fe8cceec2f40bdf3a5ab1a493b55429599441c5ee43ad573e2ed3df51a1e9 | 关态浅灰轨道与左白色细描边拇指可辨、拇指在轨内；off反馈一致。 胶囊形外焦点圈完整，未切边或压到相邻标签。 |
| 24 | screens/rc-switch/chromium/000209-2-actual.png · shadcn-light-small-pressed.png | 5aa36bcfdee7ec8b570bb896e123c32f59a13ac981b9ef101487063e03bb5c49 | 关态浅灰轨道与左白色细描边拇指可辨、拇指在轨内；off反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 25 | screens/rc-switch/chromium/000210-2-actual.png · shadcn-light-small-selected.png | 42df834ca6d24a2e8ae10ac8c15d3f3bc69a3fd8e4b3204f7610722e659ebc28 | 深色轨道、浅色拇指在右侧且未越出轨道，on反馈一致。 |
| 26 | screens/rc-switch/chromium/000211-2-actual.png · shadcn-light-small-selected-hover.png | 42df834ca6d24a2e8ae10ac8c15d3f3bc69a3fd8e4b3204f7610722e659ebc28 | 深色轨道、浅色拇指在右侧且未越出轨道，on反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 27 | screens/rc-switch/chromium/000212-2-actual.png · shadcn-light-small-selected-focus-visible.png | 6feebe6d0cc5bebddc06a6f8430ecee7ce10527f716a85c20d360dffe34bef7c | 深色轨道、浅色拇指在右侧且未越出轨道，on反馈一致。 胶囊形外焦点圈完整，未切边或压到相邻标签。 |
| 28 | screens/rc-switch/chromium/000213-2-actual.png · shadcn-light-small-selected-pressed.png | 42df834ca6d24a2e8ae10ac8c15d3f3bc69a3fd8e4b3204f7610722e659ebc28 | 深色轨道、浅色拇指在右侧且未越出轨道，on反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 29 | screens/rc-switch/chromium/000214-2-actual.png · shadcn-light-small-error.png | afda2e7f3fd3493e5fa47c71cc4afb741014bd3c58150eb3140e3afa5af87e15 | 关态浅灰轨道与左白色细描边拇指可辨、拇指在轨内；off反馈一致。 红色错误边界/轨道与完整错误句可辨，没有裁字。 |
| 30 | screens/rc-switch/chromium/000215-2-actual.png · shadcn-light-small-selected-error.png | d888783ea491db0d385a94ac04343a9416d5eb9f102533fca75ae4b64500d44f | 红色轨道、浅色拇指在右侧且未越出轨道，on反馈一致。 红色错误边界/轨道与完整错误句可辨，没有裁字。 |
| 31 | screens/rc-switch/chromium/000216-2-actual.png · shadcn-light-small-disabled.png | 428743bb5474b14dd7a5cdc7920684f823b1ce9e326bf8733204309045ad2014 | 关态浅灰轨道与左白色细描边拇指可辨、拇指在轨内；off反馈一致。 禁用轨道/文字变淡，关态位置仍可辨，与禁用已选对照不同。 |
| 32 | screens/rc-switch/chromium/000217-2-actual.png · shadcn-light-small-disabled-selected.png | 42377969f82840b6d5cdb2f4f4f6599e827b7b02c7f58b890c3c8ff98081fbb0 | 主项灰轨道与浅色拇指位于开态逻辑末端，标签禁用灰度可辨；输出on与真实checked一致，无开态却off矛盾。 |
| 33 | screens/rc-switch/chromium/000218-2-actual.png · shadcn-light-medium-default.png | a3abe517751139c3d2cbea58ba3b55c880b916b9dc2f88c80c6f956e5d5e9933 | 关态浅灰轨道与左白色细描边拇指可辨、拇指在轨内；off反馈一致。 |
| 34 | screens/rc-switch/chromium/000219-2-actual.png · shadcn-light-medium-hover.png | a3abe517751139c3d2cbea58ba3b55c880b916b9dc2f88c80c6f956e5d5e9933 | 关态浅灰轨道与左白色细描边拇指可辨、拇指在轨内；off反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 35 | screens/rc-switch/chromium/000220-2-actual.png · shadcn-light-medium-focus-visible.png | 652505b09e3bb9c2b40701f9273703d855d0cd2b1e257126fb7de665b8a56333 | 关态浅灰轨道与左白色细描边拇指可辨、拇指在轨内；off反馈一致。 胶囊形外焦点圈完整，未切边或压到相邻标签。 |
| 36 | screens/rc-switch/chromium/000221-2-actual.png · shadcn-light-medium-pressed.png | a3abe517751139c3d2cbea58ba3b55c880b916b9dc2f88c80c6f956e5d5e9933 | 关态浅灰轨道与左白色细描边拇指可辨、拇指在轨内；off反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 37 | screens/rc-switch/chromium/000222-2-actual.png · shadcn-light-medium-selected.png | 8d1a74782c3857627008b95f342547b05095f9bff272f36d093b38d42d85c96b | 深色轨道、浅色拇指在右侧且未越出轨道，on反馈一致。 |
| 38 | screens/rc-switch/chromium/000223-2-actual.png · shadcn-light-medium-selected-hover.png | 8d1a74782c3857627008b95f342547b05095f9bff272f36d093b38d42d85c96b | 深色轨道、浅色拇指在右侧且未越出轨道，on反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 39 | screens/rc-switch/chromium/000224-2-actual.png · shadcn-light-medium-selected-focus-visible.png | ec39e0e72b5f8ee8827ee4f018c71bf7f6108ab413b0f200d1e2f6c4d72b6674 | 深色轨道、浅色拇指在右侧且未越出轨道，on反馈一致。 胶囊形外焦点圈完整，未切边或压到相邻标签。 |
| 40 | screens/rc-switch/chromium/000225-2-actual.png · shadcn-light-medium-selected-pressed.png | 8d1a74782c3857627008b95f342547b05095f9bff272f36d093b38d42d85c96b | 深色轨道、浅色拇指在右侧且未越出轨道，on反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 41 | screens/rc-switch/chromium/000226-2-actual.png · shadcn-light-medium-error.png | 0e64c37481ccc7d68a077c9588733501e981ea70a2566cd4ed81960d9a0f9b10 | 关态浅灰轨道与左白色细描边拇指可辨、拇指在轨内；off反馈一致。 红色错误边界/轨道与完整错误句可辨，没有裁字。 |
| 42 | screens/rc-switch/chromium/000227-2-actual.png · shadcn-light-medium-selected-error.png | 3d5d13a1b650198f6194ab814f328f1dacc8f15d2ab3fec3542e1dac476d2c33 | 红色轨道、浅色拇指在右侧且未越出轨道，on反馈一致。 红色错误边界/轨道与完整错误句可辨，没有裁字。 |
| 43 | screens/rc-switch/chromium/000228-2-actual.png · shadcn-light-medium-disabled.png | 5bb8e07d208f521fc5393a24e98af05068ed1be6d882cd7123ee577eb138ffb4 | 关态浅灰轨道与左白色细描边拇指可辨、拇指在轨内；off反馈一致。 禁用轨道/文字变淡，关态位置仍可辨，与禁用已选对照不同。 |
| 44 | screens/rc-switch/chromium/000229-2-actual.png · shadcn-light-medium-disabled-selected.png | a1683647e95a53bd32454efac878c8d803d83ca8da45cfbc35d661cbf5c1df3f | 主项灰轨道与浅色拇指位于开态逻辑末端，标签禁用灰度可辨；输出on与真实checked一致，无开态却off矛盾。 |
| 45 | screens/rc-switch/chromium/000230-2-actual.png · shadcn-light-large-default.png | ee823fe114cda99022d7ffb8cbd4990e9ab97763a070606cc45ccd3fbaff24f6 | 关态浅灰轨道与左白色细描边拇指可辨、拇指在轨内；off反馈一致。 |
| 46 | screens/rc-switch/chromium/000231-2-actual.png · shadcn-light-large-hover.png | ee823fe114cda99022d7ffb8cbd4990e9ab97763a070606cc45ccd3fbaff24f6 | 关态浅灰轨道与左白色细描边拇指可辨、拇指在轨内；off反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 47 | screens/rc-switch/chromium/000232-2-actual.png · shadcn-light-large-focus-visible.png | b016dcaeaaf98dbaf3c86fdd3883a17d24173792c9f01084d1f783887df5951a | 关态浅灰轨道与左白色细描边拇指可辨、拇指在轨内；off反馈一致。 胶囊形外焦点圈完整，未切边或压到相邻标签。 |
| 48 | screens/rc-switch/chromium/000233-2-actual.png · shadcn-light-large-pressed.png | ee823fe114cda99022d7ffb8cbd4990e9ab97763a070606cc45ccd3fbaff24f6 | 关态浅灰轨道与左白色细描边拇指可辨、拇指在轨内；off反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 49 | screens/rc-switch/chromium/000234-2-actual.png · shadcn-light-large-selected.png | ba79dc107b7550a9d25f15ff6f6eb1de49a3519bb4be4deeed6e6a337e6c2e11 | 深色轨道、浅色拇指在右侧且未越出轨道，on反馈一致。 |
| 50 | screens/rc-switch/chromium/000235-2-actual.png · shadcn-light-large-selected-hover.png | ba79dc107b7550a9d25f15ff6f6eb1de49a3519bb4be4deeed6e6a337e6c2e11 | 深色轨道、浅色拇指在右侧且未越出轨道，on反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 51 | screens/rc-switch/chromium/000236-2-actual.png · shadcn-light-large-selected-focus-visible.png | f7ff12542a2bb656af8281022685e5419b3eefc2c1101c6e4649cabf1f477717 | 深色轨道、浅色拇指在右侧且未越出轨道，on反馈一致。 胶囊形外焦点圈完整，未切边或压到相邻标签。 |
| 52 | screens/rc-switch/chromium/000237-2-actual.png · shadcn-light-large-selected-pressed.png | ba79dc107b7550a9d25f15ff6f6eb1de49a3519bb4be4deeed6e6a337e6c2e11 | 深色轨道、浅色拇指在右侧且未越出轨道，on反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 53 | screens/rc-switch/chromium/000238-2-actual.png · shadcn-light-large-error.png | c1c23489341345b110d9c5020bac02c725980acb910a1b8c726b6e4f83c68d73 | 关态浅灰轨道与左白色细描边拇指可辨、拇指在轨内；off反馈一致。 红色错误边界/轨道与完整错误句可辨，没有裁字。 |
| 54 | screens/rc-switch/chromium/000239-2-actual.png · shadcn-light-large-selected-error.png | 559d240bc75a1ba7ee2625d806bbf776fb62463e230a689f3def89cf967e5418 | 红色轨道、浅色拇指在右侧且未越出轨道，on反馈一致。 红色错误边界/轨道与完整错误句可辨，没有裁字。 |
| 55 | screens/rc-switch/chromium/000240-2-actual.png · shadcn-light-large-disabled.png | e12caa8288a004231614c0dffecd23d8a6d0347334a67e8a9d0887485abb2811 | 关态浅灰轨道与左白色细描边拇指可辨、拇指在轨内；off反馈一致。 禁用轨道/文字变淡，关态位置仍可辨，与禁用已选对照不同。 |
| 56 | screens/rc-switch/chromium/000241-2-actual.png · shadcn-light-large-disabled-selected.png | 951a2e72ca61124c4fec71026ddb0ec385bd8a91d5edf6ba951d42f1d2e89b0f | 主项灰轨道与浅色拇指位于开态逻辑末端，标签禁用灰度可辨；输出on与真实checked一致，无开态却off矛盾。 |
| 57 | screens/rc-switch/chromium/000242-2-actual.png · shadcn-dark-small-default.png | f7867e999993fa87e040f19b09309180b70df81d6cc74ba36a741a5fd15cc207 | 关态暗色轨道与左浅色拇指可辨、拇指在轨内；off反馈一致。 |
| 58 | screens/rc-switch/chromium/000243-2-actual.png · shadcn-dark-small-hover.png | f7867e999993fa87e040f19b09309180b70df81d6cc74ba36a741a5fd15cc207 | 关态暗色轨道与左浅色拇指可辨、拇指在轨内；off反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 59 | screens/rc-switch/chromium/000244-2-actual.png · shadcn-dark-small-focus-visible.png | 37a30fe83114984a604bb51bfd35ae1d0487218d9258fecdba9673e53c73247c | 关态暗色轨道与左浅色拇指可辨、拇指在轨内；off反馈一致。 胶囊形外焦点圈完整，未切边或压到相邻标签。 |
| 60 | screens/rc-switch/chromium/000245-2-actual.png · shadcn-dark-small-pressed.png | f7867e999993fa87e040f19b09309180b70df81d6cc74ba36a741a5fd15cc207 | 关态暗色轨道与左浅色拇指可辨、拇指在轨内；off反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 61 | screens/rc-switch/chromium/000246-2-actual.png · shadcn-dark-small-selected.png | db917bf70f04b52a3145c3f86eba20dcae76f561bd19452f373146a740020521 | 白色轨道、深色拇指在右侧且未越出轨道，on反馈一致。 |
| 62 | screens/rc-switch/chromium/000247-2-actual.png · shadcn-dark-small-selected-hover.png | db917bf70f04b52a3145c3f86eba20dcae76f561bd19452f373146a740020521 | 白色轨道、深色拇指在右侧且未越出轨道，on反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 63 | screens/rc-switch/chromium/000248-2-actual.png · shadcn-dark-small-selected-focus-visible.png | 1490066871dccc0217e2bc6c5e6efa5ca8d2e42a4aaf24f20c9dc1f103096a66 | 白色轨道、深色拇指在右侧且未越出轨道，on反馈一致。 胶囊形外焦点圈完整，未切边或压到相邻标签。 |
| 64 | screens/rc-switch/chromium/000249-2-actual.png · shadcn-dark-small-selected-pressed.png | db917bf70f04b52a3145c3f86eba20dcae76f561bd19452f373146a740020521 | 白色轨道、深色拇指在右侧且未越出轨道，on反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 65 | screens/rc-switch/chromium/000250-2-actual.png · shadcn-dark-small-error.png | 30313bd57f4674bc922735e49712d3450c7062cb025140119024be929692326a | 关态暗色轨道与左浅色拇指可辨、拇指在轨内；off反馈一致。 浅粉错误边界/轨道与完整错误句可辨，没有裁字。 |
| 66 | screens/rc-switch/chromium/000251-2-actual.png · shadcn-dark-small-selected-error.png | f91679ef5352d15eeb337ddef9f89c1117daa961692d1bed56cd6379867913de | 浅粉色轨道、深色拇指在右侧且未越出轨道，on反馈一致。 浅粉错误边界/轨道与完整错误句可辨，没有裁字。 |
| 67 | screens/rc-switch/chromium/000252-2-actual.png · shadcn-dark-small-disabled.png | 6690d7000348443a6d1a9ace79f4643275b216fae76ec85253f5bf5c82fa01f9 | 关态暗色轨道与左浅色拇指可辨、拇指在轨内；off反馈一致。 禁用轨道/文字变淡，关态位置仍可辨，与禁用已选对照不同。 |
| 68 | screens/rc-switch/chromium/000253-2-actual.png · shadcn-dark-small-disabled-selected.png | 1002376d18ed9a97ed00cc726ad1e844c04ab1ac850198dd7f6f195a28260287 | 主项灰轨道与深色拇指位于开态逻辑末端，标签禁用灰度可辨；输出on与真实checked一致，无开态却off矛盾。 |
| 69 | screens/rc-switch/chromium/000254-2-actual.png · shadcn-dark-medium-default.png | ed95c66cafe86b6125addefdb0088a61dd9dcc049dc9eb83087923d8365330ba | 关态暗色轨道与左浅色拇指可辨、拇指在轨内；off反馈一致。 |
| 70 | screens/rc-switch/chromium/000255-2-actual.png · shadcn-dark-medium-hover.png | ed95c66cafe86b6125addefdb0088a61dd9dcc049dc9eb83087923d8365330ba | 关态暗色轨道与左浅色拇指可辨、拇指在轨内；off反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 71 | screens/rc-switch/chromium/000256-2-actual.png · shadcn-dark-medium-focus-visible.png | 3d6ec0f345e4aad48a5111c93e424e6aca5fd107a371f0affc82564c8d77375f | 关态暗色轨道与左浅色拇指可辨、拇指在轨内；off反馈一致。 胶囊形外焦点圈完整，未切边或压到相邻标签。 |
| 72 | screens/rc-switch/chromium/000257-2-actual.png · shadcn-dark-medium-pressed.png | ed95c66cafe86b6125addefdb0088a61dd9dcc049dc9eb83087923d8365330ba | 关态暗色轨道与左浅色拇指可辨、拇指在轨内；off反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 73 | screens/rc-switch/chromium/000258-2-actual.png · shadcn-dark-medium-selected.png | f75c1d153dbbfe18ad18853d19c4f72c3ea94ebac8ca0d2a07489bf1ed3678a5 | 白色轨道、深色拇指在右侧且未越出轨道，on反馈一致。 |
| 74 | screens/rc-switch/chromium/000259-2-actual.png · shadcn-dark-medium-selected-hover.png | f75c1d153dbbfe18ad18853d19c4f72c3ea94ebac8ca0d2a07489bf1ed3678a5 | 白色轨道、深色拇指在右侧且未越出轨道，on反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 75 | screens/rc-switch/chromium/000260-2-actual.png · shadcn-dark-medium-selected-focus-visible.png | 030f6631bb74dd2c0fec47502c1a0611187a67b8cbb9fa15faf1c148025c5d6e | 白色轨道、深色拇指在右侧且未越出轨道，on反馈一致。 胶囊形外焦点圈完整，未切边或压到相邻标签。 |
| 76 | screens/rc-switch/chromium/000261-2-actual.png · shadcn-dark-medium-selected-pressed.png | f75c1d153dbbfe18ad18853d19c4f72c3ea94ebac8ca0d2a07489bf1ed3678a5 | 白色轨道、深色拇指在右侧且未越出轨道，on反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 77 | screens/rc-switch/chromium/000262-2-actual.png · shadcn-dark-medium-error.png | 01740944c2c3ab825d2253baa98e9cecd7e29ef502c31cbd00250818169d3060 | 关态暗色轨道与左浅色拇指可辨、拇指在轨内；off反馈一致。 浅粉错误边界/轨道与完整错误句可辨，没有裁字。 |
| 78 | screens/rc-switch/chromium/000263-2-actual.png · shadcn-dark-medium-selected-error.png | d73e52a3db29fe53630d99754df684d260d1894d502a5379ddfaf8dcd38e7007 | 浅粉色轨道、深色拇指在右侧且未越出轨道，on反馈一致。 浅粉错误边界/轨道与完整错误句可辨，没有裁字。 |
| 79 | screens/rc-switch/chromium/000264-2-actual.png · shadcn-dark-medium-disabled.png | 1f92e4c42db1f8b4196092ed6b87336a9ec7f6644d298af199e2c7ff7f9b13dd | 关态暗色轨道与左浅色拇指可辨、拇指在轨内；off反馈一致。 禁用轨道/文字变淡，关态位置仍可辨，与禁用已选对照不同。 |
| 80 | screens/rc-switch/chromium/000265-2-actual.png · shadcn-dark-medium-disabled-selected.png | 6630d78505d37f3f824966a8e22527f522e5b7bdfd383ea38b0440f191b1204b | 主项灰轨道与深色拇指位于开态逻辑末端，标签禁用灰度可辨；输出on与真实checked一致，无开态却off矛盾。 |
| 81 | screens/rc-switch/chromium/000266-2-actual.png · shadcn-dark-large-default.png | 77438b5fc107270da0a3af738bec97f96853f2cd7466ee919c74620c6bf78425 | 关态暗色轨道与左浅色拇指可辨、拇指在轨内；off反馈一致。 |
| 82 | screens/rc-switch/chromium/000267-2-actual.png · shadcn-dark-large-hover.png | 77438b5fc107270da0a3af738bec97f96853f2cd7466ee919c74620c6bf78425 | 关态暗色轨道与左浅色拇指可辨、拇指在轨内；off反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 83 | screens/rc-switch/chromium/000268-2-actual.png · shadcn-dark-large-focus-visible.png | 17c54c938170cca0682768463b8e052214a3408b45f5f6faebb4b79fc86cd636 | 关态暗色轨道与左浅色拇指可辨、拇指在轨内；off反馈一致。 胶囊形外焦点圈完整，未切边或压到相邻标签。 |
| 84 | screens/rc-switch/chromium/000269-2-actual.png · shadcn-dark-large-pressed.png | 77438b5fc107270da0a3af738bec97f96853f2cd7466ee919c74620c6bf78425 | 关态暗色轨道与左浅色拇指可辨、拇指在轨内；off反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 85 | screens/rc-switch/chromium/000270-2-actual.png · shadcn-dark-large-selected.png | 9323e8e1dacf245e1570cb23234df2b73966262b0384d89bed4c91aaff0c58df | 白色轨道、深色拇指在右侧且未越出轨道，on反馈一致。 |
| 86 | screens/rc-switch/chromium/000271-2-actual.png · shadcn-dark-large-selected-hover.png | 9323e8e1dacf245e1570cb23234df2b73966262b0384d89bed4c91aaff0c58df | 白色轨道、深色拇指在右侧且未越出轨道，on反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 87 | screens/rc-switch/chromium/000272-2-actual.png · shadcn-dark-large-selected-focus-visible.png | 5d02276a1e86383c4b6a1409eed8fadaf3379062640b82d17c73322e01d6ca11 | 白色轨道、深色拇指在右侧且未越出轨道，on反馈一致。 胶囊形外焦点圈完整，未切边或压到相邻标签。 |
| 88 | screens/rc-switch/chromium/000273-2-actual.png · shadcn-dark-large-selected-pressed.png | 9323e8e1dacf245e1570cb23234df2b73966262b0384d89bed4c91aaff0c58df | 白色轨道、深色拇指在右侧且未越出轨道，on反馈一致。 实际hover/mouse.down由原生流程进入；此shadcn静态图的额外状态层很弱或无可见差异，未把动作等同于额外视觉表现。 |
| 89 | screens/rc-switch/chromium/000274-2-actual.png · shadcn-dark-large-error.png | fbff96f1d46b023d564685c70887f141a7edcb4405c129ecc6d90dcac14b316d | 关态暗色轨道与左浅色拇指可辨、拇指在轨内；off反馈一致。 浅粉错误边界/轨道与完整错误句可辨，没有裁字。 |
| 90 | screens/rc-switch/chromium/000275-2-actual.png · shadcn-dark-large-selected-error.png | 25470e9c050bb1ad93cd930abeec808fa63752dedd164bd79dc3f64e187cdefa | 浅粉色轨道、深色拇指在右侧且未越出轨道，on反馈一致。 浅粉错误边界/轨道与完整错误句可辨，没有裁字。 |
| 91 | screens/rc-switch/chromium/000276-2-actual.png · shadcn-dark-large-disabled.png | 5421f61c15835d8f0c4972be71ac59ec965199af34b2999b7cbda98831891cab | 关态暗色轨道与左浅色拇指可辨、拇指在轨内；off反馈一致。 禁用轨道/文字变淡，关态位置仍可辨，与禁用已选对照不同。 |
| 92 | screens/rc-switch/chromium/000277-2-actual.png · shadcn-dark-large-disabled-selected.png | e1afc9019bd1a91293ff359f275dfdfffe1d9ce87b288bd0f01c77ec580c983f | 主项灰轨道与深色拇指位于开态逻辑末端，标签禁用灰度可辨；输出on与真实checked一致，无开态却off矛盾。 |
| 93 | screens/rc-switch/chromium/000282-0-inventory-actual.png · test/visual/inventory.visual.spec.mjs | 40eedbb86e797406f4c0447950785be0d1cd4fb5fba4ef8e8c7f5d3b54b243c4 | 默认库存图仅关态轨道/左浅拇指与“开关”标签，位于1280×720视口上方且完整；仅默认展示，不替代状态矩阵。 |
| 94 | screens/rc-switch/chromium/000283-0-inventory-actual.png · test/visual/inventory.visual.spec.mjs | 3a84076c9598f8a81cf733a463bc593a47ef48084d81472170bae3838c439ffc | 默认库存图仅关态轨道/左浅拇指与“开关”标签，位于1280×720视口上方且完整；仅默认展示，不替代状态矩阵。 |

重复SHA组（每张均已查看）：

- 8d1a74782c3857627008b95f342547b05095f9bff272f36d093b38d42d85c96b：序号2、3、4、9、37、38、40。
- f75c1d153dbbfe18ad18853d19c4f72c3ea94ebac8ca0d2a07489bf1ed3678a5：序号11、12、13、18、73、74、76。
- 5aa36bcfdee7ec8b570bb896e123c32f59a13ac981b9ef101487063e03bb5c49：序号21、22、24。
- 42df834ca6d24a2e8ae10ac8c15d3f3bc69a3fd8e4b3204f7610722e659ebc28：序号25、26、28。
- a3abe517751139c3d2cbea58ba3b55c880b916b9dc2f88c80c6f956e5d5e9933：序号33、34、36。
- ee823fe114cda99022d7ffb8cbd4990e9ab97763a070606cc45ccd3fbaff24f6：序号45、46、48。
- ba79dc107b7550a9d25f15ff6f6eb1de49a3519bb4be4deeed6e6a337e6c2e11：序号49、50、52。
- f7867e999993fa87e040f19b09309180b70df81d6cc74ba36a741a5fd15cc207：序号57、58、60。
- db917bf70f04b52a3145c3f86eba20dcae76f561bd19452f373146a740020521：序号61、62、64。
- ed95c66cafe86b6125addefdb0088a61dd9dcc049dc9eb83087923d8365330ba：序号69、70、72。
- 77438b5fc107270da0a3af738bec97f96853f2cd7466ee919c74620c6bf78425：序号81、82、84。
- 9323e8e1dacf245e1570cb23234df2b73966262b0384d89bed4c91aaff0c58df：序号85、86、88。

完整case id、逐图配置/原生附件索引、geometry/伪元素与真实边缘交互原记录、真zoom证明、源/实际资产/输入文件SHA和独立人工观察见reviews-shadcn.json。无采集、构建、源码/图片编辑、baseline或verified更新。
