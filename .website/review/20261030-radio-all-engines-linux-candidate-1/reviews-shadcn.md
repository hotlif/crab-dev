# radio shadcn Linux逐图复审

114/114原PNG含重复逐张使用view_image original实际查看：Chromium 94、Firefox 10、WebKit 10。原生343通过，失败/跳过/不稳定均0；自动通过不代替人工观察。6个worker实例（原生并发2）前后稳定，24个source/artifact摘要重新按files数组计算一致。

source `sha256:b136b2e5f406321a88de6a2b4def6b4a3ba885a0a6ede79d7b2e41591c80bfcb`；实际资产 `sha256:ca945befa7e008710cfd7bea2922372ae9332150451ffcde5505f9bf156682c6`；镜像 `mcr.microsoft.com/playwright:v1.64.1-noble@sha256:47b510dd9230bf0b9bfc9b20102241e577ea7a99334ab4c3ca19f19770e9b8ea`。全部原PNG与原生附件SHA同字节，逐图绑定实际browser/version/worker和Linux输入。Windows旧图不替代本批。

Chromium核心72格：三尺寸×明暗×12状态；18环境、2真实200%视口、2默认库存。Firefox/WebKit各8格仅medium×明暗×default/focus-visible/selected/disabled-selected，另各2库存；不扩为其error/mixed/触控/zoom全矩阵。

原图94唯一SHA，12重复组、20张额外重复全部实际查看。108张匹配Linux对应引擎命名目标，可作为相应基准创建候选，仅资格；6库存图无命名目标仅展示证据。没有建立/更新baseline，没有比较或两次稳定性复跑，没有verified晋升。

## 实际观察与范围

- 原图1–18：Chromium明暗18环境原图逐张：主项内点与环清楚且on，禁用对照仍有灰内点。320长文自然两行，触控外围留白与两行间距增大；RTL控件在右/输出右对齐，英文长句完整，品牌紫色内点和外圈可辨。forced-colors浅底深蓝主项/褐红禁用、暗底青主项/绿禁用保持几何。真实tap及≥48px命中按native证据另列，不能从细圆环尺寸代替。
- 原图19–32：两真实200%明暗viewport：主项内点/环与外focus圈完整，长文和on及禁用对照均可见，viewport选择器是测试界面；不代表整长页。small/light12核心图逐张：选中黑内点与off/on反馈一致，disabled-selected灰内点on，error红圈/红内点和提示分离，圆形焦点外圈不裁边。
- 原图33–56：medium/large浅色24核心图逐张实际查看，large字级/圆环大于medium；default与selected内点有明确区别，hover/pressed不额外虚构halo。focus和selectedfocus圆环完整，错误红圈/提示行与正文分开；disabled-selected灰内点on、disabled空环off，输出没有矛盾。
- 原图57–92：Chromium暗色三尺寸36核心图逐张：selected白内点/细白环、error粉红内点/环可辨，default细灰环与hover亮环有层级；外焦点环保持完整圆形间隔。disabled灰环/灰内点+灰标签，selected输出on、空态off；large可视环和字体确增，提示与反馈各自独立，无覆压。
- 原图93–94：Chromium两库存原图实际查看：顶端居中的单个未选Radio与Radio标签，下面大块页面留白；仅默认公开Demo，不补充核心状态或尺寸。
- 原图95–114：Firefox、WebKit各10原图逐张：medium明暗default/off、focus完整圆环、selected内点on、disabled-selected灰内点on均正确。两引擎各两顶部单个Radio库存仍未选，布局留白不作matrix；字体栅格有实际引擎差别，未声称像素同一。未扩展到这些引擎error/三尺寸/环境/zoom。

## 逐图

### 1. chromium · light · narrow · environment

[原图](screens/rc-radio/chromium/000038-2-actual.png) 254×186；SHA256 `1b543ad1435033b2e07d7f3c4c46862c5e6a799447d366bbe158b18e3c05cd9a`。case `eca1d001e7d20c08dd92-487c5f71e176dbf4cf68/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 320布局长文自然换行，未压住控件或输出；图片是组件frame边界，不声称全页。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 2. chromium · light · tablet · environment

[原图](screens/rc-radio/chromium/000039-2-actual.png) 328×170；SHA256 `2e4bfca9d5a32ae28dc74bb88086b6c702b279bf368a0eecd50e77208b3f9b3b`。case `eca1d001e7d20c08dd92-b6588dfd992808fb230b/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- tablet组件frame画面文字和状态完整，无可见横溢。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 3. chromium · light · desktop · environment

[原图](screens/rc-radio/chromium/000040-2-actual.png) 328×170；SHA256 `276ac3679ffeb4d3cc45cba808c445170bf8e3b9fed0a76159f708ea0a6979df`。case `eca1d001e7d20c08dd92-dfa6ef12f55ec8b78956/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- desktop组件frame画面文字和状态完整，无可见横溢。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 4. chromium · light · touch · environment

[原图](screens/rc-radio/chromium/000041-2-actual.png) 352×218；SHA256 `8465845c4386b47511a841897c53cf137b26ce7c0a8cc458f7c3e7375c95b603`。case `eca1d001e7d20c08dd92-e35086818253f44a384c/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 粗指针画面外部留白/间距增大，文字和状态图形分离；真实≥48px命中区和边缘交互由原生几何/实际tap另证，不把可视图形当命中框。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 5. chromium · light · rtl · environment

[原图](screens/rc-radio/chromium/000042-2-actual.png) 328×170；SHA256 `dc9d26c2c91ccf2a5fade23d684242eb21e8b7abbb5a934dcc8439b83c89f95a`。case `eca1d001e7d20c08dd92-f8383264e98192695bc3/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- RTL控件/文字及输出按逻辑边界镜像，主控位于文字右侧，未出现压叠。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 6. chromium · light · english · environment

[原图](screens/rc-radio/chromium/000043-2-actual.png) 526×170；SHA256 `e25f3c160859029854cd02808dbdb6c2be01e643a7a9a480600e66c22c07bd12`。case `eca1d001e7d20c08dd92-601fdaf46a8cae03171a/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 英文完整长文及Selection:on可读，未裁字。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 7. chromium · light · brand · environment

[原图](screens/rc-radio/chromium/000044-2-actual.png) 328×170；SHA256 `68a4425f287b2b3ee20f48cf9091233f601a3ef29c0a848221ee1a32f63c64b6`。case `eca1d001e7d20c08dd92-6e25c979fbfb0f404e1a/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 品牌紫色/淡紫选中图形清楚，文字及禁用对照可辨。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 8. chromium · light · forced-colors · environment

[原图](screens/rc-radio/chromium/000045-2-actual.png) 328×170；SHA256 `32e1f01d821bb67120958fba2200902cf16a883a8af66bbedb7e6f502a4ec4ad`。case `eca1d001e7d20c08dd92-3eb036cd536d16d919ea/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 系统白底、主项深蓝/禁用项褐红配色保留形状；不以普通主题颜色评判forced-colors。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 9. chromium · light · reduced-motion · environment

[原图](screens/rc-radio/chromium/000046-2-actual.png) 328×170；SHA256 `06bde64ace3ff94b58ef87b48927b05e5ea673f07b605401ee73446153c40d13`。case `eca1d001e7d20c08dd92-54e5181d9eceb711f4ef/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 减少动画媒体下当前外观正常；PNG不证明动效时长，媒体/实际交互依据原生记录。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 10. chromium · dark · narrow · environment

[原图](screens/rc-radio/chromium/000047-2-actual.png) 254×186；SHA256 `167c1ef0a56797462a938ca74f6c969be1ac735b2070f3ba13c36034e64e386c`。case `eca1d001e7d20c08dd92-a9f97c3b7e12c469f998/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 320布局长文自然换行，未压住控件或输出；图片是组件frame边界，不声称全页。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 11. chromium · dark · tablet · environment

[原图](screens/rc-radio/chromium/000048-2-actual.png) 328×170；SHA256 `078585b74cb43de690cf394419b24e75432a6a1ebabc89db5864c76f5751a802`。case `eca1d001e7d20c08dd92-b3f04fd425f3a361feb2/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- tablet组件frame画面文字和状态完整，无可见横溢。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 12. chromium · dark · desktop · environment

[原图](screens/rc-radio/chromium/000049-2-actual.png) 328×170；SHA256 `97f0a511b2be63c68a53465612349122d0d6741b6f68e98650ee198d04b98a79`。case `eca1d001e7d20c08dd92-9b861b431f50404519a5/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- desktop组件frame画面文字和状态完整，无可见横溢。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 13. chromium · dark · touch · environment

[原图](screens/rc-radio/chromium/000050-2-actual.png) 352×218；SHA256 `0380cacea225e88e8c1947d69324c0e4f4b43f98d6539135461ae6163d8a8438`。case `eca1d001e7d20c08dd92-d15290f370ca8f5e2002/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 粗指针画面外部留白/间距增大，文字和状态图形分离；真实≥48px命中区和边缘交互由原生几何/实际tap另证，不把可视图形当命中框。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 14. chromium · dark · rtl · environment

[原图](screens/rc-radio/chromium/000051-2-actual.png) 328×170；SHA256 `07aab1fec2dd4996ee8cee3783c9b12453b3cc892d0d6ea20f141de3073b4058`。case `eca1d001e7d20c08dd92-76247f894c4cba9340bb/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- RTL控件/文字及输出按逻辑边界镜像，主控位于文字右侧，未出现压叠。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 15. chromium · dark · english · environment

[原图](screens/rc-radio/chromium/000052-2-actual.png) 526×170；SHA256 `1ef32673eb92d4de1e4bfd9b4c7b73fbc1b3ea507597f6de239f3b51e9cd1120`。case `eca1d001e7d20c08dd92-05c5c82514a1cfd9f50f/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 英文完整长文及Selection:on可读，未裁字。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 16. chromium · dark · brand · environment

[原图](screens/rc-radio/chromium/000053-2-actual.png) 328×170；SHA256 `03b0d513909747b444064d77ec749cc378b6ff4561d9acc983b1a48e7c8976b1`。case `eca1d001e7d20c08dd92-f306be651739a39f5a31/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 品牌紫色/淡紫选中图形清楚，文字及禁用对照可辨。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 17. chromium · dark · forced-colors · environment

[原图](screens/rc-radio/chromium/000054-2-actual.png) 328×170；SHA256 `9b5968bebf41f23241e2ef95be7e27be42da9f40d5216ddff285c385027f005a`。case `eca1d001e7d20c08dd92-1167e94bcd37e2f922c1/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 系统黑底、主项青色/禁用项绿色配色保留形状；不把系统色映射当普通暗主题。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 18. chromium · dark · reduced-motion · environment

[原图](screens/rc-radio/chromium/000055-2-actual.png) 328×170；SHA256 `bc7ea1a1364c3f4088e736c774ce5b6add94c22d8960a4bad1b119f7b893fcde`。case `eca1d001e7d20c08dd92-60bc9760a2371ff7dacb/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 减少动画媒体下当前外观正常；PNG不证明动效时长，媒体/实际交互依据原生记录。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 19. chromium · light · zoom-200 · zoom

[原图](screens/rc-radio/chromium/000060-4-actual-zoom-200.png) 1280×813；SHA256 `1cd19918031cffc379ff0dbfa6d0c1446f07ac18a1403cfb3d2d99300b48133f`。case `6112fc9f176121a3fe62-b2287c29dd6b102077fe/chromium/0`；worker 0；native attachment 4/actual-zoom-200，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 真正200%浏览器zoom的可见viewport，已选控件/外焦点环、长文和on均在画面内，原生表单状态选择器也可见；不是整长页。tabZoom1→2而CSS zoom保持1，原生proof单列。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 20. chromium · dark · zoom-200 · zoom

[原图](screens/rc-radio/chromium/000061-4-actual-zoom-200.png) 1280×813；SHA256 `18914fe2f55edecf0b38917fa0a07a21a4b62f25fa85b23318d22f71bc451673`。case `6112fc9f176121a3fe62-68a837039cc2230b6242/chromium/0`；worker 1；native attachment 4/actual-zoom-200，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 真正200%浏览器zoom的可见viewport，已选控件/外焦点环、长文和on均在画面内，原生表单状态选择器也可见；不是整长页。tabZoom1→2而CSS zoom保持1，原生proof单列。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 21. chromium · light · small · default

[原图](screens/rc-radio/chromium/000238-2-actual.png) 328×170；SHA256 `8c97e10d399c5b4d928ab7e22a03b2c37e7636f78d54d97ed2dd9657b0750ec3`。case `96d425a95c7ee16a72b9-8464db3271060cb30e99/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 22. chromium · light · small · hover

[原图](screens/rc-radio/chromium/000239-2-actual.png) 328×170；SHA256 `942b94a5ecdea5cbdcb621b912f9fb7f47097a7a3863f5bb5c3318c1c66aa8bf`。case `96d425a95c7ee16a72b9-88150b43792d74bcc7fa/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 23. chromium · light · small · focus-visible

[原图](screens/rc-radio/chromium/000240-2-actual.png) 328×170；SHA256 `f409873dea104fd8220f713e7067a5e797063690cc2ab3411b9522fee559c3f4`。case `96d425a95c7ee16a72b9-fd0b6ce3771a0a279521/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 24. chromium · light · small · pressed

[原图](screens/rc-radio/chromium/000241-2-actual.png) 328×170；SHA256 `942b94a5ecdea5cbdcb621b912f9fb7f47097a7a3863f5bb5c3318c1c66aa8bf`。case `96d425a95c7ee16a72b9-5aad694fa0a806cd9093/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 25. chromium · light · small · selected

[原图](screens/rc-radio/chromium/000242-2-actual.png) 328×170；SHA256 `955679602a380430d7ab7f168122d2a70bb65f795ad5a003cc3f83d53c281561`。case `96d425a95c7ee16a72b9-fe6b8578eaaf158b988c/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 26. chromium · light · small · selected-hover

[原图](screens/rc-radio/chromium/000243-2-actual.png) 328×170；SHA256 `955679602a380430d7ab7f168122d2a70bb65f795ad5a003cc3f83d53c281561`。case `96d425a95c7ee16a72b9-bc533d507b57eceb74b7/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 27. chromium · light · small · selected-focus-visible

[原图](screens/rc-radio/chromium/000244-2-actual.png) 328×170；SHA256 `72e21a7c884b0a8b8305350a4b09c66d828d58e28ee95774fbcf80b42ef8891e`。case `96d425a95c7ee16a72b9-afcfd57e6149030ad923/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 28. chromium · light · small · selected-pressed

[原图](screens/rc-radio/chromium/000245-2-actual.png) 328×170；SHA256 `955679602a380430d7ab7f168122d2a70bb65f795ad5a003cc3f83d53c281561`。case `96d425a95c7ee16a72b9-5f0ac0ec140f58858057/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 29. chromium · light · small · error

[原图](screens/rc-radio/chromium/000246-2-actual.png) 328×220；SHA256 `1ec31040411e7b9615978c8f7cd77cf966cdbb12d303f33b271bf1de24d4c4d9`。case `96d425a95c7ee16a72b9-1686a00aa59921095e53/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 浅色错误轮廓/填充为红色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 30. chromium · light · small · selected-error

[原图](screens/rc-radio/chromium/000247-2-actual.png) 328×220；SHA256 `82b27fddbfc72eea7dca094857dac2ea22bdc11d88d7d0fb4ab7adf607550b63`。case `96d425a95c7ee16a72b9-8b87c4a2f32d76727486/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 浅色错误轮廓/填充为红色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 31. chromium · light · small · disabled

[原图](screens/rc-radio/chromium/000248-2-actual.png) 328×170；SHA256 `276e0e2fdf3a345035939ed9553788ca07e8e775671d260b7ef6d24595f2adb7`。case `96d425a95c7ee16a72b9-2d726a170864c2cd36be/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 32. chromium · light · small · disabled-selected

[原图](screens/rc-radio/chromium/000249-2-actual.png) 328×170；SHA256 `9b253bf80695d90cc36661caab3c42c4a4af2723ff0dda00b966cc2065dbb0c0`。case `96d425a95c7ee16a72b9-a2595463e786418ae4fa/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 33. chromium · light · medium · default

[原图](screens/rc-radio/chromium/000250-2-actual.png) 328×170；SHA256 `f70362778e587e0cf4dd15ea1ef9ece35b18e78c0c2f43c46c48aa5d66ce7ba9`。case `96d425a95c7ee16a72b9-9174460fb5c2d572c38b/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 34. chromium · light · medium · hover

[原图](screens/rc-radio/chromium/000253-2-actual.png) 328×170；SHA256 `85fdca24b9f4affaeff09e995d0f67a0615a5e99f6d2f83c1dcccbd17c72333c`。case `96d425a95c7ee16a72b9-324339baebbec496ff41/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 35. chromium · light · medium · focus-visible

[原图](screens/rc-radio/chromium/000254-2-actual.png) 328×170；SHA256 `41b1e25a09a23eca077fc0be20d4616e9d951b346a23bec20e1ce068f163d10d`。case `96d425a95c7ee16a72b9-80e5ff66f1e30acc06ab/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 36. chromium · light · medium · pressed

[原图](screens/rc-radio/chromium/000257-2-actual.png) 328×170；SHA256 `85fdca24b9f4affaeff09e995d0f67a0615a5e99f6d2f83c1dcccbd17c72333c`。case `96d425a95c7ee16a72b9-e5495f6e7380a7fac97d/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 37. chromium · light · medium · selected

[原图](screens/rc-radio/chromium/000258-2-actual.png) 328×170；SHA256 `06bde64ace3ff94b58ef87b48927b05e5ea673f07b605401ee73446153c40d13`。case `96d425a95c7ee16a72b9-59918310903cc6794d3a/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 38. chromium · light · medium · selected-hover

[原图](screens/rc-radio/chromium/000261-2-actual.png) 328×170；SHA256 `06bde64ace3ff94b58ef87b48927b05e5ea673f07b605401ee73446153c40d13`。case `96d425a95c7ee16a72b9-f1fbbe46f19b22246871/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 39. chromium · light · medium · selected-focus-visible

[原图](screens/rc-radio/chromium/000262-2-actual.png) 328×170；SHA256 `4192d7802e791c873036c4b500aa2a6e433a7e9920a517c74a9488062e78f870`。case `96d425a95c7ee16a72b9-27bcde15b4502115b5a0/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 40. chromium · light · medium · selected-pressed

[原图](screens/rc-radio/chromium/000263-2-actual.png) 328×170；SHA256 `06bde64ace3ff94b58ef87b48927b05e5ea673f07b605401ee73446153c40d13`。case `96d425a95c7ee16a72b9-b6a7f61e72c86b3dd942/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 41. chromium · light · medium · error

[原图](screens/rc-radio/chromium/000264-2-actual.png) 328×220；SHA256 `4a42541a27bc23c292f86e9412890d3b0fc065d13edbac6c40146791c53b89cb`。case `96d425a95c7ee16a72b9-0ffee35b2fb78d6623b4/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 浅色错误轮廓/填充为红色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 42. chromium · light · medium · selected-error

[原图](screens/rc-radio/chromium/000265-2-actual.png) 328×220；SHA256 `400475b50cd357c338236d8bbc45a022e52029ebc43d806f925a421b80c9cfda`。case `96d425a95c7ee16a72b9-75889664473da509588e/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 浅色错误轮廓/填充为红色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 43. chromium · light · medium · disabled

[原图](screens/rc-radio/chromium/000266-2-actual.png) 328×170；SHA256 `21a0b4aaf021bcc8e7d5470bb90912a21b40c13bcb5d1b40f37fe642b5f21701`。case `96d425a95c7ee16a72b9-51af005016eb73ec01aa/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 44. chromium · light · medium · disabled-selected

[原图](screens/rc-radio/chromium/000267-2-actual.png) 328×170；SHA256 `1ab5ab56bd9bfa5fbe02e628e6058a316c56d1dd6dc1ef674a7dbbfd34c8190f`。case `96d425a95c7ee16a72b9-8166bcc7a418d1b03b9a/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 45. chromium · light · large · default

[原图](screens/rc-radio/chromium/000270-2-actual.png) 400×174；SHA256 `b5cd5331f2f783a5b264666ecab36fc9cd013fa5f20e2e432a72325cd5be6c7e`。case `96d425a95c7ee16a72b9-da29d073ac1869355dc7/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 46. chromium · light · large · hover

[原图](screens/rc-radio/chromium/000271-2-actual.png) 400×174；SHA256 `5833daec04e73e8116567b9ec67fc1da902dbf8b81398cc10ff066af7c4c2ef3`。case `96d425a95c7ee16a72b9-2161ea51b7dd4303cf21/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 47. chromium · light · large · focus-visible

[原图](screens/rc-radio/chromium/000272-2-actual.png) 400×174；SHA256 `9218c04abef4a0bb6bb2d2293e221fa7553cf0ea45d70a62723e25c5ece066ad`。case `96d425a95c7ee16a72b9-d7d3aeaade95d001ba66/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 48. chromium · light · large · pressed

[原图](screens/rc-radio/chromium/000273-2-actual.png) 400×174；SHA256 `5833daec04e73e8116567b9ec67fc1da902dbf8b81398cc10ff066af7c4c2ef3`。case `96d425a95c7ee16a72b9-6c94ce948197be5ab539/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 49. chromium · light · large · selected

[原图](screens/rc-radio/chromium/000274-2-actual.png) 400×174；SHA256 `1d0cd1a06eb2efc3fd7bf6bfc58e6649c64c6729aec3b9f1fd16e6df6acac8e8`。case `96d425a95c7ee16a72b9-59d4fb9ca8d7addfce1d/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 50. chromium · light · large · selected-hover

[原图](screens/rc-radio/chromium/000275-2-actual.png) 400×174；SHA256 `1d0cd1a06eb2efc3fd7bf6bfc58e6649c64c6729aec3b9f1fd16e6df6acac8e8`。case `96d425a95c7ee16a72b9-bbf99eaded8536b035fe/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 51. chromium · light · large · selected-focus-visible

[原图](screens/rc-radio/chromium/000276-2-actual.png) 400×174；SHA256 `77d92ad2040f0b7fd50536103db3ccacfc0be9c7c0bc54170970f6e7bccf92f6`。case `96d425a95c7ee16a72b9-c9132f9bee38e2224c7e/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 52. chromium · light · large · selected-pressed

[原图](screens/rc-radio/chromium/000277-2-actual.png) 400×174；SHA256 `1d0cd1a06eb2efc3fd7bf6bfc58e6649c64c6729aec3b9f1fd16e6df6acac8e8`。case `96d425a95c7ee16a72b9-3648a3a3064349719c45/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 53. chromium · light · large · error

[原图](screens/rc-radio/chromium/000278-2-actual.png) 400×223；SHA256 `9999b06d3ef8ac7b9f33da9c28ea5f54b1507b9855a09f12d4bab45b2c3dd5a1`。case `96d425a95c7ee16a72b9-020abd3fabff766251b5/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 浅色错误轮廓/填充为红色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 54. chromium · light · large · selected-error

[原图](screens/rc-radio/chromium/000279-2-actual.png) 400×223；SHA256 `70b2b94e490a53a40364a2b2a9b6ffecd4b12e9424b7bf83d933974ef34fea05`。case `96d425a95c7ee16a72b9-019bb99c76b24d503db5/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 浅色错误轮廓/填充为红色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 55. chromium · light · large · disabled

[原图](screens/rc-radio/chromium/000280-2-actual.png) 400×174；SHA256 `2eebb650d3e3b93aa359370cf9b41bd16584295662e4d4bd73e1ebd4471bae6d`。case `96d425a95c7ee16a72b9-e8d7b6940a08083782b6/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 56. chromium · light · large · disabled-selected

[原图](screens/rc-radio/chromium/000281-2-actual.png) 400×174；SHA256 `2031befd45447c3871db251f41503f5e378e5577c1c2bf01f810b362d494a088`。case `96d425a95c7ee16a72b9-174f5191e47eecabc4a0/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 57. chromium · dark · small · default

[原图](screens/rc-radio/chromium/000282-2-actual.png) 328×170；SHA256 `098ca7dcd3c94183c72da2df961aa0a762bd4b2ab9a2c4dc526eb1c40f073f81`。case `96d425a95c7ee16a72b9-120ae1da8814f769abca/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 58. chromium · dark · small · hover

[原图](screens/rc-radio/chromium/000283-2-actual.png) 328×170；SHA256 `05f94d1b1a28c7de451d5c0b3595722f16be08a3fb980d42942c99085d947ff8`。case `96d425a95c7ee16a72b9-ef2c93f056776367f80d/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 59. chromium · dark · small · focus-visible

[原图](screens/rc-radio/chromium/000284-2-actual.png) 328×170；SHA256 `0d0aedb4df9f1407cea0a27e3fd1213de4aaeb6e37acf7f91e71ace0641fd6dd`。case `96d425a95c7ee16a72b9-dee078f24270f320481d/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 60. chromium · dark · small · pressed

[原图](screens/rc-radio/chromium/000285-2-actual.png) 328×170；SHA256 `05f94d1b1a28c7de451d5c0b3595722f16be08a3fb980d42942c99085d947ff8`。case `96d425a95c7ee16a72b9-fae38ea4a8ad35c06229/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 61. chromium · dark · small · selected

[原图](screens/rc-radio/chromium/000286-2-actual.png) 328×170；SHA256 `16331afd641c05fac752e70ec22d6d908e2b3d3cbdc516761d008fac2d9bfd6e`。case `96d425a95c7ee16a72b9-97482da9020d7e588312/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 62. chromium · dark · small · selected-hover

[原图](screens/rc-radio/chromium/000287-2-actual.png) 328×170；SHA256 `16331afd641c05fac752e70ec22d6d908e2b3d3cbdc516761d008fac2d9bfd6e`。case `96d425a95c7ee16a72b9-0beae378932872946b3f/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 63. chromium · dark · small · selected-focus-visible

[原图](screens/rc-radio/chromium/000288-2-actual.png) 328×170；SHA256 `101480fedfa25e63081cab6f88d5a8badcffd70f8c7108c28dfeb70289b4c848`。case `96d425a95c7ee16a72b9-f35e26f24e39fec0fb56/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 64. chromium · dark · small · selected-pressed

[原图](screens/rc-radio/chromium/000289-2-actual.png) 328×170；SHA256 `16331afd641c05fac752e70ec22d6d908e2b3d3cbdc516761d008fac2d9bfd6e`。case `96d425a95c7ee16a72b9-0e830d614996a570f13b/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 65. chromium · dark · small · error

[原图](screens/rc-radio/chromium/000290-2-actual.png) 328×220；SHA256 `28792c9a26effccc060525d1905bf8478e89f7d2264526623312014ff7823649`。case `96d425a95c7ee16a72b9-99332d83dbb2aedab506/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 暗色错误轮廓/填充为粉色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 66. chromium · dark · small · selected-error

[原图](screens/rc-radio/chromium/000291-2-actual.png) 328×220；SHA256 `58b8f009d075e7cff6731f60e2e238961e2ad8eb36304be85363eca828af757e`。case `96d425a95c7ee16a72b9-a36e9efc8c5ced6b26b5/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 暗色错误轮廓/填充为粉色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 67. chromium · dark · small · disabled

[原图](screens/rc-radio/chromium/000292-2-actual.png) 328×170；SHA256 `ab678a46ae7e0a9d8a863ae85363fcb56e984fc7b6d84719436db1e0f74ccd4e`。case `96d425a95c7ee16a72b9-997c1ba3d22af3146527/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 68. chromium · dark · small · disabled-selected

[原图](screens/rc-radio/chromium/000293-2-actual.png) 328×170；SHA256 `2866f58ef5a061f6cc34db942c24d5767faffc7d8552535bc014733f5bc67894`。case `96d425a95c7ee16a72b9-444005d2daea4f3a691c/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 69. chromium · dark · medium · default

[原图](screens/rc-radio/chromium/000294-2-actual.png) 328×170；SHA256 `60a7454721a8eff515ad3b564b462558741def8ce47f50a749c58c852e7a83b1`。case `96d425a95c7ee16a72b9-40d45810289ae2626b7c/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 70. chromium · dark · medium · hover

[原图](screens/rc-radio/chromium/000297-2-actual.png) 328×170；SHA256 `7606447730fcd5a832d6bcfd93616fe4d43ee60cb457aaf7bb43db7235ae22c0`。case `96d425a95c7ee16a72b9-d6caed7a7ecb2c59f3e4/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 71. chromium · dark · medium · focus-visible

[原图](screens/rc-radio/chromium/000298-2-actual.png) 328×170；SHA256 `f42ad145bc0f887d9d52f1600e74b32177097dbc147e80926cae1ad7c547d40b`。case `96d425a95c7ee16a72b9-efe342dea64b411a1cb9/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 72. chromium · dark · medium · pressed

[原图](screens/rc-radio/chromium/000301-2-actual.png) 328×170；SHA256 `7606447730fcd5a832d6bcfd93616fe4d43ee60cb457aaf7bb43db7235ae22c0`。case `96d425a95c7ee16a72b9-8ec4f70d86c5686aa25b/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 73. chromium · dark · medium · selected

[原图](screens/rc-radio/chromium/000302-2-actual.png) 328×170；SHA256 `bc7ea1a1364c3f4088e736c774ce5b6add94c22d8960a4bad1b119f7b893fcde`。case `96d425a95c7ee16a72b9-fb40820e4ab43a0f6c5a/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 74. chromium · dark · medium · selected-hover

[原图](screens/rc-radio/chromium/000305-2-actual.png) 328×170；SHA256 `bc7ea1a1364c3f4088e736c774ce5b6add94c22d8960a4bad1b119f7b893fcde`。case `96d425a95c7ee16a72b9-4ffa5e6ee0a853666ce0/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 75. chromium · dark · medium · selected-focus-visible

[原图](screens/rc-radio/chromium/000306-2-actual.png) 328×170；SHA256 `83f64c16567a7db5f3be2fd9d3dc1ef992f514732754acbca89a56dea8e415ac`。case `96d425a95c7ee16a72b9-06bbb18c60b463f8826b/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 76. chromium · dark · medium · selected-pressed

[原图](screens/rc-radio/chromium/000307-2-actual.png) 328×170；SHA256 `bc7ea1a1364c3f4088e736c774ce5b6add94c22d8960a4bad1b119f7b893fcde`。case `96d425a95c7ee16a72b9-6f3e8ec27e9112125597/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 77. chromium · dark · medium · error

[原图](screens/rc-radio/chromium/000308-2-actual.png) 328×220；SHA256 `43cb2a0efbef38ccc3a18098a9f74e8cb1b3410617fc8435a7ed6ae436c38033`。case `96d425a95c7ee16a72b9-28252f34e86d93cbdbd9/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 暗色错误轮廓/填充为粉色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 78. chromium · dark · medium · selected-error

[原图](screens/rc-radio/chromium/000309-2-actual.png) 328×220；SHA256 `4b26717db850de72424942a6f84e84491dc4bafd68bf571aa701b0cb04de8979`。case `96d425a95c7ee16a72b9-42d86a420380415242eb/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 暗色错误轮廓/填充为粉色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 79. chromium · dark · medium · disabled

[原图](screens/rc-radio/chromium/000310-2-actual.png) 328×170；SHA256 `c1f1eb160f7c9c0336fb5050e38f9f9924c61aadfa35c965d5fa055fc62601e2`。case `96d425a95c7ee16a72b9-2b05ed3f43b530dfa9d1/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 80. chromium · dark · medium · disabled-selected

[原图](screens/rc-radio/chromium/000311-2-actual.png) 328×170；SHA256 `39908de2329c937e691e0945783810999d0beacb6470be89486beadd21f13417`。case `96d425a95c7ee16a72b9-7e2335cf9fe735e74714/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 81. chromium · dark · large · default

[原图](screens/rc-radio/chromium/000314-2-actual.png) 400×174；SHA256 `3220d5ad722220c63add13f3ff2d643e40a83daa699d5a8ac1fb27e67d0b35e9`。case `96d425a95c7ee16a72b9-4d137c06953ed1ca8c9f/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 82. chromium · dark · large · hover

[原图](screens/rc-radio/chromium/000315-2-actual.png) 400×174；SHA256 `0c97a8ba7213dac21351716d42ed28ae904a4d49a40b38c7a569b84442e26bee`。case `96d425a95c7ee16a72b9-bcf1114a3dddb0e0da4c/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 83. chromium · dark · large · focus-visible

[原图](screens/rc-radio/chromium/000316-2-actual.png) 400×174；SHA256 `ca83cab23ca86d977e1cd0d1bafd8d30d42f96daf5360b8c5d9162f6ec8556e8`。case `96d425a95c7ee16a72b9-93b562aaaa0cafe28625/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 84. chromium · dark · large · pressed

[原图](screens/rc-radio/chromium/000317-2-actual.png) 400×174；SHA256 `0c97a8ba7213dac21351716d42ed28ae904a4d49a40b38c7a569b84442e26bee`。case `96d425a95c7ee16a72b9-7110551623a065061e16/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 85. chromium · dark · large · selected

[原图](screens/rc-radio/chromium/000318-2-actual.png) 400×174；SHA256 `eb2009b4908838fda7c85f8c70f704b5e5e3c9570553ad326383d5c87b414854`。case `96d425a95c7ee16a72b9-119fbefd13b50c9ab94d/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 86. chromium · dark · large · selected-hover

[原图](screens/rc-radio/chromium/000319-2-actual.png) 400×174；SHA256 `eb2009b4908838fda7c85f8c70f704b5e5e3c9570553ad326383d5c87b414854`。case `96d425a95c7ee16a72b9-163b135539fefc9c2437/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 87. chromium · dark · large · selected-focus-visible

[原图](screens/rc-radio/chromium/000320-2-actual.png) 400×174；SHA256 `12516542c6b93b993fe52975500cee99b70f7f7033f4118520f1bd2416b193d2`。case `96d425a95c7ee16a72b9-78ed283fe3ae53736b31/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 88. chromium · dark · large · selected-pressed

[原图](screens/rc-radio/chromium/000321-2-actual.png) 400×174；SHA256 `eb2009b4908838fda7c85f8c70f704b5e5e3c9570553ad326383d5c87b414854`。case `96d425a95c7ee16a72b9-88287ef672d8b4de8fc5/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 89. chromium · dark · large · error

[原图](screens/rc-radio/chromium/000322-2-actual.png) 400×223；SHA256 `4f65ab16e86390b23b70b0ca9810f7fe794948d71d41f112646c783bf352fd67`。case `96d425a95c7ee16a72b9-9172c1a90596aa7cd688/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 暗色错误轮廓/填充为粉色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 90. chromium · dark · large · selected-error

[原图](screens/rc-radio/chromium/000323-2-actual.png) 400×223；SHA256 `34bc4e2f970448b23f290bbf36c7ac81464d5513eec656f331307d35f63a0984`。case `96d425a95c7ee16a72b9-fc8d87c9df4e6697fbaf/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 暗色错误轮廓/填充为粉色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 91. chromium · dark · large · disabled

[原图](screens/rc-radio/chromium/000324-2-actual.png) 400×174；SHA256 `e733aaf309c869ea4dd10e79371b9ac3d6938ab1d3ee3d9f9dd4d9c6797f2cca`。case `96d425a95c7ee16a72b9-62a827dff398d512038e/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 92. chromium · dark · large · disabled-selected

[原图](screens/rc-radio/chromium/000325-2-actual.png) 400×174；SHA256 `8032b76c0ccf7f81d7abb9ebc0fead1447f6f339f020b7f06b81979252b7da14`。case `96d425a95c7ee16a72b9-99018301e2eec2f068a9/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 93. chromium · light · inventory · inventory

[原图](screens/rc-radio/chromium/000338-0-inventory-actual.png) 1280×720；SHA256 `9dce952e144bf1c5c794255d6f1290ce067843b30835875204b5c2eefe915d40`。case `73019a0006cb75aa6498-f796cddd7964b3bfea11/chromium/0`；worker 1；native attachment 0/inventory-actual，同字节。原生passed；人工accepted仅实际画面范围。

- 仅公开默认Demo库存：顶部单个默认Radio及标签可见，下方大块留白为当前页面布局；不是核心状态/尺寸证据。
- 只审当前viewport，不扩成全页或额外交互。

基准资格：库存无命名目标，仅证据。

### 94. chromium · dark · inventory · inventory

[原图](screens/rc-radio/chromium/000341-0-inventory-actual.png) 1280×720；SHA256 `d579aa25e421e5033ddd5947d88d719bf747317f229c825aba057e644a0af5a8`。case `73019a0006cb75aa6498-9e07abe57d26e1881edf/chromium/0`；worker 0；native attachment 0/inventory-actual，同字节。原生passed；人工accepted仅实际画面范围。

- 仅公开默认Demo库存：顶部单个默认Radio及标签可见，下方大块留白为当前页面布局；不是核心状态/尺寸证据。
- 只审当前viewport，不扩成全页或额外交互。

基准资格：库存无命名目标，仅证据。

### 95. firefox · light · medium · default

[原图](screens/rc-radio/firefox/000251-2-actual.png) 328×170；SHA256 `ca3b58ca2dd58867f78f64dc4aafce614d5dc89dae4524a8a754256205f2f5d1`。case `96d425a95c7ee16a72b9-9174460fb5c2d572c38b/firefox/0`；worker 2；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 96. firefox · light · medium · focus-visible

[原图](screens/rc-radio/firefox/000255-2-actual.png) 328×170；SHA256 `32acb9b482cdeaba4fb045fd882672725c4747bfb9c1b1a8de4f7ca647305ea9`。case `96d425a95c7ee16a72b9-80e5ff66f1e30acc06ab/firefox/0`；worker 3；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 97. firefox · light · medium · selected

[原图](screens/rc-radio/firefox/000259-2-actual.png) 328×170；SHA256 `7f696acae4848ac94d1c2c32d069ead7379dea05d6f05b7c64d10b2a7309c0e6`。case `96d425a95c7ee16a72b9-59918310903cc6794d3a/firefox/0`；worker 2；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 98. firefox · light · medium · disabled-selected

[原图](screens/rc-radio/firefox/000268-2-actual.png) 328×170；SHA256 `c192ab20c45241bf534e135ce76457b6c97a57348eaf06b624332f24e4578534`。case `96d425a95c7ee16a72b9-8166bcc7a418d1b03b9a/firefox/0`；worker 3；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 99. firefox · dark · medium · default

[原图](screens/rc-radio/firefox/000295-2-actual.png) 328×170；SHA256 `2626d03b27b449e378eb10cd5c98befc9e2320b70c98f947cd4a658ee98ed985`。case `96d425a95c7ee16a72b9-40d45810289ae2626b7c/firefox/0`；worker 2；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 100. firefox · dark · medium · focus-visible

[原图](screens/rc-radio/firefox/000299-2-actual.png) 328×170；SHA256 `0c1f554998d736773706d4138fe6344b80e59fe0d50670d73f808f7b2e636deb`。case `96d425a95c7ee16a72b9-efe342dea64b411a1cb9/firefox/0`；worker 3；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 101. firefox · dark · medium · selected

[原图](screens/rc-radio/firefox/000303-2-actual.png) 328×170；SHA256 `f689d21debe645ff4b3c83a5c762ac270584c5cc2e7bdbec5d9d9ea7bbc1546d`。case `96d425a95c7ee16a72b9-fb40820e4ab43a0f6c5a/firefox/0`；worker 2；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 102. firefox · dark · medium · disabled-selected

[原图](screens/rc-radio/firefox/000312-2-actual.png) 328×170；SHA256 `173246b3c00afabee547e7a454e600f5caece52a107362a81978aef13200665c`。case `96d425a95c7ee16a72b9-7e2335cf9fe735e74714/firefox/0`；worker 3；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 103. firefox · light · inventory · inventory

[原图](screens/rc-radio/firefox/000339-0-inventory-actual.png) 1280×720；SHA256 `5396fd509a053de520792e0b61a05ed969def33f75dd290b1c87e9c120c56383`。case `73019a0006cb75aa6498-f796cddd7964b3bfea11/firefox/0`；worker 2；native attachment 0/inventory-actual，同字节。原生passed；人工accepted仅实际画面范围。

- 仅公开默认Demo库存：顶部单个默认Radio及标签可见，下方大块留白为当前页面布局；不是核心状态/尺寸证据。
- 只审当前viewport，不扩成全页或额外交互。

基准资格：库存无命名目标，仅证据。

### 104. firefox · dark · inventory · inventory

[原图](screens/rc-radio/firefox/000342-0-inventory-actual.png) 1280×720；SHA256 `d06e44abe1f8b343036091942b02787107cf1d2c10def655516074ab0795198a`。case `73019a0006cb75aa6498-9e07abe57d26e1881edf/firefox/0`；worker 3；native attachment 0/inventory-actual，同字节。原生passed；人工accepted仅实际画面范围。

- 仅公开默认Demo库存：顶部单个默认Radio及标签可见，下方大块留白为当前页面布局；不是核心状态/尺寸证据。
- 只审当前viewport，不扩成全页或额外交互。

基准资格：库存无命名目标，仅证据。

### 105. webkit · light · medium · default

[原图](screens/rc-radio/webkit/000252-2-actual.png) 328×170；SHA256 `750b57e89b2c20230275b8b2b0af2a93922628d05e3218a7cee7b45471a75992`。case `96d425a95c7ee16a72b9-9174460fb5c2d572c38b/webkit/0`；worker 5；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 106. webkit · light · medium · focus-visible

[原图](screens/rc-radio/webkit/000256-2-actual.png) 328×170；SHA256 `e5c9ee53ce3984cc1d5d66e781ac36771f025414945d4a2f23c7f4593858c921`。case `96d425a95c7ee16a72b9-80e5ff66f1e30acc06ab/webkit/0`；worker 4；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 107. webkit · light · medium · selected

[原图](screens/rc-radio/webkit/000260-2-actual.png) 328×170；SHA256 `228ecfc8a1664dd1d993765a9032b2f89ce0d9f7a62d7ac2288f751a41338208`。case `96d425a95c7ee16a72b9-59918310903cc6794d3a/webkit/0`；worker 5；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 108. webkit · light · medium · disabled-selected

[原图](screens/rc-radio/webkit/000269-2-actual.png) 328×170；SHA256 `fb4bb787dc27b0d19fcbb23bf9ac6780845b40403ecec09a6de290d8b532453c`。case `96d425a95c7ee16a72b9-8166bcc7a418d1b03b9a/webkit/0`；worker 4；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 109. webkit · dark · medium · default

[原图](screens/rc-radio/webkit/000296-2-actual.png) 328×170；SHA256 `b9087f05bc02060f7bf1578e23ce0eab0996aee4d7d8a2a0a6a0339f9d39da53`。case `96d425a95c7ee16a72b9-40d45810289ae2626b7c/webkit/0`；worker 5；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 110. webkit · dark · medium · focus-visible

[原图](screens/rc-radio/webkit/000300-2-actual.png) 328×170；SHA256 `2a2f3951badd5db0d9e0e01b0836795e4638aa52e01f96dc543f9a98a43d8ba2`。case `96d425a95c7ee16a72b9-efe342dea64b411a1cb9/webkit/0`；worker 5；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 未选空圆环清楚，反馈off。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 111. webkit · dark · medium · selected

[原图](screens/rc-radio/webkit/000304-2-actual.png) 328×170；SHA256 `120fcd45f15a092f5d737c8c0615fd1bf87779db39ee1015e7a9773fe78e4b80`。case `96d425a95c7ee16a72b9-fb40820e4ab43a0f6c5a/webkit/0`；worker 4；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 112. webkit · dark · medium · disabled-selected

[原图](screens/rc-radio/webkit/000313-2-actual.png) 328×170；SHA256 `69d3be4ade8c5c7a91f27ab76fea25aeffdd6f6b932d4290a7262d3da1d59943`。case `96d425a95c7ee16a72b9-7e2335cf9fe735e74714/webkit/0`；worker 5；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 选中内点和外圈清楚，反馈on。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 113. webkit · light · inventory · inventory

[原图](screens/rc-radio/webkit/000340-0-inventory-actual.png) 1280×720；SHA256 `b96dbc246825b2fc28771b0c688018e52cb94882e1e3559ff803dd44082521d0`。case `73019a0006cb75aa6498-f796cddd7964b3bfea11/webkit/0`；worker 4；native attachment 0/inventory-actual，同字节。原生passed；人工accepted仅实际画面范围。

- 仅公开默认Demo库存：顶部单个默认Radio及标签可见，下方大块留白为当前页面布局；不是核心状态/尺寸证据。
- 只审当前viewport，不扩成全页或额外交互。

基准资格：库存无命名目标，仅证据。

### 114. webkit · dark · inventory · inventory

[原图](screens/rc-radio/webkit/000343-0-inventory-actual.png) 1280×720；SHA256 `efd41e058d84436dfc08ed982cba9c905a2db42f1d0ffacb0c233f765280ec50`。case `73019a0006cb75aa6498-9e07abe57d26e1881edf/webkit/0`；worker 5；native attachment 0/inventory-actual，同字节。原生passed；人工accepted仅实际画面范围。

- 仅公开默认Demo库存：顶部单个默认Radio及标签可见，下方大块留白为当前页面布局；不是核心状态/尺寸证据。
- 只审当前viewport，不扩成全页或额外交互。

基准资格：库存无命名目标，仅证据。

## 重复SHA（均逐张看）

- 06bde64ace3ff94b58ef87b48927b05e5ea673f07b605401ee73446153c40d13：9(chromium)、37(chromium)、38(chromium)、40(chromium)
- bc7ea1a1364c3f4088e736c774ce5b6add94c22d8960a4bad1b119f7b893fcde：18(chromium)、73(chromium)、74(chromium)、76(chromium)
- 942b94a5ecdea5cbdcb621b912f9fb7f47097a7a3863f5bb5c3318c1c66aa8bf：22(chromium)、24(chromium)
- 955679602a380430d7ab7f168122d2a70bb65f795ad5a003cc3f83d53c281561：25(chromium)、26(chromium)、28(chromium)
- 85fdca24b9f4affaeff09e995d0f67a0615a5e99f6d2f83c1dcccbd17c72333c：34(chromium)、36(chromium)
- 5833daec04e73e8116567b9ec67fc1da902dbf8b81398cc10ff066af7c4c2ef3：46(chromium)、48(chromium)
- 1d0cd1a06eb2efc3fd7bf6bfc58e6649c64c6729aec3b9f1fd16e6df6acac8e8：49(chromium)、50(chromium)、52(chromium)
- 05f94d1b1a28c7de451d5c0b3595722f16be08a3fb980d42942c99085d947ff8：58(chromium)、60(chromium)
- 16331afd641c05fac752e70ec22d6d908e2b3d3cbdc516761d008fac2d9bfd6e：61(chromium)、62(chromium)、64(chromium)
- 7606447730fcd5a832d6bcfd93616fe4d43ee60cb457aaf7bb43db7235ae22c0：70(chromium)、72(chromium)
- 0c97a8ba7213dac21351716d42ed28ae904a4d49a40b38c7a569b84442e26bee：82(chromium)、84(chromium)
- eb2009b4908838fda7c85f8c70f704b5e5e3c9570553ad326383d5c87b414854：85(chromium)、86(chromium)、88(chromium)

## 限制

- Only current original component frame, inventory viewport, or real-zoom viewport is visually reviewed; no whole-page claim.
- Native hit geometry, coarse pointer edge interaction, keyboard focus/semantics and state-preservation assertions are separate from visible appearance.
- Chromium declared full states/sizes; Firefox/WebKit only declared medium four-state subset plus defaults. No cross-engine pixel equality is claimed.
- Source/asset identities are captured snapshot identities; no current-worktree identity or Windows images substituted.
- No videos decoded/watched for these static selection controls; existing recordings remain untouched.
- This is one candidate appearance review and eligibility judgment. Baseline creation and two consecutive native pixel comparisons remain separate; no verified or lifecycle promotion.
- No numerical contrast compliance claim is made.
