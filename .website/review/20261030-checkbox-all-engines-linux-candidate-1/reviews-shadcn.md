# checkbox shadcn Linux逐图复审

132/132原PNG含重复逐张使用view_image original实际查看：Chromium 112、Firefox 10、WebKit 10。原生397通过，失败/跳过/不稳定均0；自动通过不代替人工观察。6个worker实例（原生并发2）前后稳定，24个source/artifact摘要重新按files数组计算一致。

source `sha256:b2018cc16cb225c80afbd0053f898b583953700f9c2bf88b94589cf87f32711b`；实际资产 `sha256:a6623d51bffaf00879e651744d65d5eed0ebbe47ba71fedaac78a7830ec1952a`；镜像 `mcr.microsoft.com/playwright:v1.64.1-noble@sha256:47b510dd9230bf0b9bfc9b20102241e577ea7a99334ab4c3ca19f19770e9b8ea`。全部原PNG与原生附件SHA同字节，逐图绑定实际browser/version/worker和Linux输入。Windows旧图不替代本批。

Chromium核心90格：三尺寸×明暗×15状态；18环境、2真实200%视口、2默认库存。Firefox/WebKit各8格仅medium×明暗×default/focus-visible/selected/disabled-selected，另各2库存；不扩为其error/mixed/触控/zoom全矩阵。

原图112唯一SHA，12重复组、20张额外重复全部实际查看。126张匹配Linux对应引擎命名目标，可作为相应基准创建候选，仅资格；6库存图无命名目标仅展示证据。没有建立/更新baseline，没有比较或两次稳定性复跑，没有verified晋升。

## 实际观察与范围

- 原图1–9：Chromium浅色9环境逐原图：当前选择on、第二只读disabled check清楚。320长文两行，其余宽图未裁字；触控行间与命中外框留白增大，RTL控件移右且输出右对齐，英文完整一行，品牌紫色勾选，强制色主/禁用控件与系统褐红字可辨；命中区域按native几何另记，不从16px视觉图形推定。
- 原图10–18：Chromium暗色9环境：主项白底黑勾/品牌淡紫，disabled深灰保留勾，on一致；320换行清楚；RTL右侧、英文长文、触控增大留白均可见。强制色为黑底、主项青色/禁用项亮绿色且均保留勾，这是系统颜色映射。减少动画只有当前静态帧证据，media/状态由原生附件另证。
- 原图19–35：真实200%两张完整可见viewport分别查看：焦点环完整包住已选框，长文及on、禁用对照均可读，画面不能替代整长页。Chromium small/light全部15状态逐图，off/on随实际勾选一致；disabled-selected灰勾输出on；mixed横杠且输出明确mixed / boolean off；红色error轮廓/实底和提示文可见。外焦点环在frame内未裁切，hover/pressed与默认可能视觉相同，不制造伪state layer。
- 原图36–65：Chromium medium/large浅色30核心图逐张：框尺寸从medium至large确增、large字级也增，焦点轮廓四边完整未截。三类error红轮廓/红底和提示行分离，无与输出重叠；disabled-selected灰勾输出on、mixed横杠且布尔off、disabled-mixed仍能辨横杠。公开尺寸影响视觉图形与字级，命中区域用原生几何证据另记。
- 原图66–80：Chromium small暗色15状态：未选深表面细轮廓、hover/pressed边界更亮；selected白框黑勾，error粉红轮廓/粉红填充黑勾，mixed白/粉底横杠。disabled暗灰对照可辨；disabled-selected输出on，mixed/disabledmixed反馈与横杠相符。焦点灰环完整含空隙，不与标签挤压。
- 原图81–112：Chromium medium/large暗色全部核心状态及两默认库存逐张查看：白色selected勾和mixed横杠均清楚、error粉色状态及提示可读，disabled-selected输出on。medium与large图形/文字大小不同，外焦点环四边留白完整。库存仅顶部单个未勾Checkbox默认Demo，下面大块空白是页面布局；不能计作核心状态、尺寸或交互。
- 原图113–132：Firefox、WebKit各10原图均逐张实际查看。medium明暗default/off、focus-visible外环、selected实勾on、disabled-selected灰勾on清楚；与Chromium有字体字宽/抗锯齿微差，不跨引擎比较像素。各2张库存为顶部单个未勾Checkbox默认展示，下方空白；不能据此扩展到Firefox/WebKit混合/error/触控或三尺寸。

## 逐图

### 1. chromium · light · narrow · environment

[原图](screens/rc-checkbox/chromium/000038-2-actual.png) 254×186；SHA256 `214d818ae62f3b54f589f19f1034b1831a5e26bee5084579aa6437d865249af8`。case `d867639f9fcc14c63204-c346a46919a354d220b6/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 320布局长文自然换行，未压住控件或输出；图片是组件frame边界，不声称全页。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 2. chromium · light · tablet · environment

[原图](screens/rc-checkbox/chromium/000039-2-actual.png) 328×170；SHA256 `e373bbe1e6623412833ec395ce360e3eb47cbcc3fd44c5c573ce45e3235963f7`。case `d867639f9fcc14c63204-eca59900f879fd8e993a/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- tablet组件frame画面文字和状态完整，无可见横溢。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 3. chromium · light · desktop · environment

[原图](screens/rc-checkbox/chromium/000040-2-actual.png) 328×170；SHA256 `41964295562ab024441fa7af571ae3e52f912fa18f65052923111fcb2a283241`。case `d867639f9fcc14c63204-86691b85af2f748b6635/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- desktop组件frame画面文字和状态完整，无可见横溢。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 4. chromium · light · touch · environment

[原图](screens/rc-checkbox/chromium/000041-2-actual.png) 352×218；SHA256 `b7ffdd7b83fc6406a0a939e3be7712c72ab0957c1ab31578c7d64e1dad4b0af8`。case `d867639f9fcc14c63204-7c8a87665f5de5381fa0/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 粗指针画面外部留白/间距增大，文字和状态图形分离；真实≥48px命中区和边缘交互由原生几何/实际tap另证，不把可视图形当命中框。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 5. chromium · light · rtl · environment

[原图](screens/rc-checkbox/chromium/000042-2-actual.png) 328×170；SHA256 `261da6998f28bed404764fd10c7ce97596d9439599dd8f916a3dc09160d0bdc3`。case `d867639f9fcc14c63204-ab68de8ce47a9ac27ac3/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- RTL控件/文字及输出按逻辑边界镜像，主控位于文字右侧，未出现压叠。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 6. chromium · light · english · environment

[原图](screens/rc-checkbox/chromium/000043-2-actual.png) 526×170；SHA256 `4cd25c0c10bc81b325fd077901eae1958a9658b29e559cadad0e83b2fbb47c7b`。case `d867639f9fcc14c63204-e9dce99fb28df034d012/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 英文完整长文及Selection:on可读，未裁字。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 7. chromium · light · brand · environment

[原图](screens/rc-checkbox/chromium/000044-2-actual.png) 328×170；SHA256 `bd3f92a2eda2f0a8f8d825af3aa71586515e9b015e40d39a67344fcbfa4fbd01`。case `d867639f9fcc14c63204-166630b29c7e0900066d/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 品牌紫色/淡紫选中图形清楚，文字及禁用对照可辨。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 8. chromium · light · forced-colors · environment

[原图](screens/rc-checkbox/chromium/000045-2-actual.png) 328×170；SHA256 `4af16dc2797b1c590da622b6c28efcd053651ea6b65ce5405d6b3aee29b11a83`。case `d867639f9fcc14c63204-b0d8a9553781099f8387/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 系统白底、主项深蓝/禁用项褐红配色保留形状；不以普通主题颜色评判forced-colors。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 9. chromium · light · reduced-motion · environment

[原图](screens/rc-checkbox/chromium/000046-2-actual.png) 328×170；SHA256 `1f17caa521385a1d9d6375fac9bf4679e623b910213a089daa3b157d58dcc735`。case `d867639f9fcc14c63204-8800e6b5b426d14746e3/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 减少动画媒体下当前外观正常；PNG不证明动效时长，媒体/实际交互依据原生记录。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 10. chromium · dark · narrow · environment

[原图](screens/rc-checkbox/chromium/000047-2-actual.png) 254×186；SHA256 `0d9ea27f353947fe1ea957674e159472e61c4e19d4dc3c62c6647aa41ad491c3`。case `d867639f9fcc14c63204-0def7e83e41d6ff719b8/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 320布局长文自然换行，未压住控件或输出；图片是组件frame边界，不声称全页。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 11. chromium · dark · tablet · environment

[原图](screens/rc-checkbox/chromium/000048-2-actual.png) 328×170；SHA256 `d6a110fa3102c3bbd3cf6a62fdb4ed5300a138b538de91dc874b09c827c7ec61`。case `d867639f9fcc14c63204-29642c62693f4bbfee40/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- tablet组件frame画面文字和状态完整，无可见横溢。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 12. chromium · dark · desktop · environment

[原图](screens/rc-checkbox/chromium/000049-2-actual.png) 328×170；SHA256 `1c71558f8e833d858e57a71310698051b155e56d8575f6e9cb1b2349e76fdc8c`。case `d867639f9fcc14c63204-aa212d6749ba9cbc1bbe/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- desktop组件frame画面文字和状态完整，无可见横溢。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 13. chromium · dark · touch · environment

[原图](screens/rc-checkbox/chromium/000050-2-actual.png) 352×218；SHA256 `9500b67e57b8abb5963f692b6f08c6516614677a83917a0b3923832afc50a58e`。case `d867639f9fcc14c63204-302b5add7fc3b9f1822b/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 粗指针画面外部留白/间距增大，文字和状态图形分离；真实≥48px命中区和边缘交互由原生几何/实际tap另证，不把可视图形当命中框。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 14. chromium · dark · rtl · environment

[原图](screens/rc-checkbox/chromium/000051-2-actual.png) 328×170；SHA256 `6458f5b9206d3eb1f954bbe05992922ccfbed00c6c8e22a9e229c3a8e9aa8653`。case `d867639f9fcc14c63204-957a5cb9b541ed9a193e/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- RTL控件/文字及输出按逻辑边界镜像，主控位于文字右侧，未出现压叠。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 15. chromium · dark · english · environment

[原图](screens/rc-checkbox/chromium/000052-2-actual.png) 526×170；SHA256 `404975a195ae6035b26699aac6a76219b4da6bca9fbb92ca0341c9309ae91234`。case `d867639f9fcc14c63204-02671cd7cc1fc2462160/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 英文完整长文及Selection:on可读，未裁字。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 16. chromium · dark · brand · environment

[原图](screens/rc-checkbox/chromium/000053-2-actual.png) 328×170；SHA256 `1628876eb5c2fc1f60b28721ddc40e5977f321b0723ac55f8d259e231e5bb49c`。case `d867639f9fcc14c63204-795d4ebfc4693f76c091/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 品牌紫色/淡紫选中图形清楚，文字及禁用对照可辨。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 17. chromium · dark · forced-colors · environment

[原图](screens/rc-checkbox/chromium/000054-2-actual.png) 328×170；SHA256 `d9c25bd26e96e03227b9e58aec7b45e1afe9eae71380ead1c2fd818a2698a924`。case `d867639f9fcc14c63204-ab81702c39acecc93819/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 系统黑底、主项青色/禁用项绿色配色保留形状；不把系统色映射当普通暗主题。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 18. chromium · dark · reduced-motion · environment

[原图](screens/rc-checkbox/chromium/000055-2-actual.png) 328×170；SHA256 `980239ea9c7da709457ba3d8c58b1b0b1d8e7f2aaf1cdd80fb49a54152a4803b`。case `d867639f9fcc14c63204-272a9308d3f05c458f10/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 减少动画媒体下当前外观正常；PNG不证明动效时长，媒体/实际交互依据原生记录。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 19. chromium · light · zoom-200 · zoom

[原图](screens/rc-checkbox/chromium/000060-4-actual-zoom-200.png) 1280×813；SHA256 `d125fcaa6d1c65d9b2bf28fcf4af58f515036be8c6b77351200a1b5dcbda5098`。case `4ce4212075a27b44e623-b92f0932d5548ee9d8ef/chromium/0`；worker 0；native attachment 4/actual-zoom-200，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 真正200%浏览器zoom的可见viewport，已选控件/外焦点环、长文和on均在画面内，原生表单状态选择器也可见；不是整长页。tabZoom1→2而CSS zoom保持1，原生proof单列。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 20. chromium · dark · zoom-200 · zoom

[原图](screens/rc-checkbox/chromium/000061-4-actual-zoom-200.png) 1280×813；SHA256 `32ccd3394e050ff238ff9fb70a2fc40d454526068e96edfdb06cc109454218c3`。case `4ce4212075a27b44e623-dbd0a212559d6299cd02/chromium/0`；worker 1；native attachment 4/actual-zoom-200，同字节。原生passed；人工accepted仅实际画面范围。

- 实际操作后主控为选中，反馈on；禁用对照保留选中外观。长文与输出可读。
- 真正200%浏览器zoom的可见viewport，已选控件/外焦点环、长文和on均在画面内，原生表单状态选择器也可见；不是整长页。tabZoom1→2而CSS zoom保持1，原生proof单列。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 21. chromium · light · small · default

[原图](screens/rc-checkbox/chromium/000274-2-actual.png) 328×170；SHA256 `ee63d8a6b49653b859133e1283597af90e61060c38f92567ef1c0a80e1d3e092`。case `f64d25927e4d5b779add-4f168b1c7628e5443d93/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 22. chromium · light · small · hover

[原图](screens/rc-checkbox/chromium/000275-2-actual.png) 328×170；SHA256 `d4d67f39223c280cdc5c3a8a3221c8d3515148a19aa949bfaba1131c056d52a4`。case `f64d25927e4d5b779add-2cb1e3aadfe809960fdc/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 23. chromium · light · small · focus-visible

[原图](screens/rc-checkbox/chromium/000276-2-actual.png) 328×170；SHA256 `1624a74be6fd165b95125d509326f2a3d70196aa7390ce77044b07bf1077b81e`。case `f64d25927e4d5b779add-20ee6faaf76e073f0027/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 24. chromium · light · small · pressed

[原图](screens/rc-checkbox/chromium/000277-2-actual.png) 328×170；SHA256 `d4d67f39223c280cdc5c3a8a3221c8d3515148a19aa949bfaba1131c056d52a4`。case `f64d25927e4d5b779add-578522689dcafbd6349f/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 25. chromium · light · small · selected

[原图](screens/rc-checkbox/chromium/000278-2-actual.png) 328×170；SHA256 `b779c108946ba8ef0ac9552ab6822cd51286e2bced7012e2020d316b79fb65e2`。case `f64d25927e4d5b779add-7bf3561aa09980fe3980/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 26. chromium · light · small · selected-hover

[原图](screens/rc-checkbox/chromium/000279-2-actual.png) 328×170；SHA256 `b779c108946ba8ef0ac9552ab6822cd51286e2bced7012e2020d316b79fb65e2`。case `f64d25927e4d5b779add-f33f5385b1f5d45e33f4/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 27. chromium · light · small · selected-focus-visible

[原图](screens/rc-checkbox/chromium/000280-2-actual.png) 328×170；SHA256 `b21460af60613ae7a09789461a689fa4f54c06b5b08e26df965e6669f1a2419b`。case `f64d25927e4d5b779add-ba68d447a1fc8e404cc4/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 28. chromium · light · small · selected-pressed

[原图](screens/rc-checkbox/chromium/000281-2-actual.png) 328×170；SHA256 `b779c108946ba8ef0ac9552ab6822cd51286e2bced7012e2020d316b79fb65e2`。case `f64d25927e4d5b779add-f8ea9c0233668f602186/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 29. chromium · light · small · error

[原图](screens/rc-checkbox/chromium/000282-2-actual.png) 328×220；SHA256 `6bba5c034e2bf22cd6cc0bc4bdb03169b64f39d51012e544a633a150a1e2f8fc`。case `f64d25927e4d5b779add-3aff6f4a29e8b0b928f9/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 浅色错误轮廓/填充为红色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 30. chromium · light · small · selected-error

[原图](screens/rc-checkbox/chromium/000283-2-actual.png) 328×220；SHA256 `32c5dd1843ba4d0d4127b05960524e37f06718ee55c9262eaa010531483c3e23`。case `f64d25927e4d5b779add-877d12874452c2a68b9e/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 浅色错误轮廓/填充为红色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 31. chromium · light · small · disabled

[原图](screens/rc-checkbox/chromium/000284-2-actual.png) 328×170；SHA256 `5a1c004b3d2eac17a5ee519d8ee6a5e78b2d77ffa88f40ae3b2f8d6aade636e9`。case `f64d25927e4d5b779add-ca11aaece2e45b408359/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 32. chromium · light · small · disabled-selected

[原图](screens/rc-checkbox/chromium/000285-2-actual.png) 328×170；SHA256 `a4aae390b90922cc85dcafb6b0f8b06d55403491564a41a61c11d2f810db1deb`。case `f64d25927e4d5b779add-27410e4c9375357aa2c1/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 33. chromium · light · small · indeterminate

[原图](screens/rc-checkbox/chromium/000286-2-actual.png) 328×170；SHA256 `963a49c143d7463d3ef5b503f2e2ba52ee129c05e0fa30bb88ed897597810089`。case `f64d25927e4d5b779add-f4bdcd5df8b973d639c6/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 半选横杠清楚，反馈明确mixed（半选，布尔值off）；不把indeterminate等同checked=true。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 34. chromium · light · small · indeterminate-error

[原图](screens/rc-checkbox/chromium/000287-2-actual.png) 328×220；SHA256 `796d1c0ece372c744b4ca3be513817f0d18bdb8136df50f881b87e242fa52ab9`。case `f64d25927e4d5b779add-cc3dbc2616dff3f2cf4b/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 半选横杠清楚，反馈明确mixed（半选，布尔值off）；不把indeterminate等同checked=true。
- 浅色错误轮廓/填充为红色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 35. chromium · light · small · disabled-indeterminate

[原图](screens/rc-checkbox/chromium/000288-2-actual.png) 328×170；SHA256 `d000be1c8263dab44b28cca97f9552409a06b82bad6c4357cbb8ca84fd49844b`。case `f64d25927e4d5b779add-e951670a2bb9cd6ee54f/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 半选横杠清楚，反馈明确mixed（半选，布尔值off）；不把indeterminate等同checked=true。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- small/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 36. chromium · light · medium · default

[原图](screens/rc-checkbox/chromium/000289-2-actual.png) 328×170；SHA256 `7a9a990b1b82d5c5f231dfcdc27adfc91932db882a36b6f8b6419da240d774e2`。case `f64d25927e4d5b779add-6acf7e267076ede1f0ea/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 37. chromium · light · medium · hover

[原图](screens/rc-checkbox/chromium/000292-2-actual.png) 328×170；SHA256 `06a23f64d507669f20cd0ed0ca14eb3aa4c61f5d8ef912e95ed9b1182db75111`。case `f64d25927e4d5b779add-5047cf950a06fb7855da/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 38. chromium · light · medium · focus-visible

[原图](screens/rc-checkbox/chromium/000293-2-actual.png) 328×170；SHA256 `e3de2124fa20f579931af236329914009c2ba4811fa689b75724af42a96b86c0`。case `f64d25927e4d5b779add-4cbc2a341a20a9afd4b3/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 39. chromium · light · medium · pressed

[原图](screens/rc-checkbox/chromium/000296-2-actual.png) 328×170；SHA256 `06a23f64d507669f20cd0ed0ca14eb3aa4c61f5d8ef912e95ed9b1182db75111`。case `f64d25927e4d5b779add-ccaff8ce1594e14c8d54/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 40. chromium · light · medium · selected

[原图](screens/rc-checkbox/chromium/000297-2-actual.png) 328×170；SHA256 `1f17caa521385a1d9d6375fac9bf4679e623b910213a089daa3b157d58dcc735`。case `f64d25927e4d5b779add-ab0f162a7267d5ffafa7/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 41. chromium · light · medium · selected-hover

[原图](screens/rc-checkbox/chromium/000300-2-actual.png) 328×170；SHA256 `1f17caa521385a1d9d6375fac9bf4679e623b910213a089daa3b157d58dcc735`。case `f64d25927e4d5b779add-1f861efa37e0e8cf1f19/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 42. chromium · light · medium · selected-focus-visible

[原图](screens/rc-checkbox/chromium/000301-2-actual.png) 328×170；SHA256 `db1dbc497d3b2b1d3f4d23e92e67c51f8338abd03c21aa492477bd2c06dfbce3`。case `f64d25927e4d5b779add-a2c4e9b1061ab24cbf88/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 43. chromium · light · medium · selected-pressed

[原图](screens/rc-checkbox/chromium/000302-2-actual.png) 328×170；SHA256 `1f17caa521385a1d9d6375fac9bf4679e623b910213a089daa3b157d58dcc735`。case `f64d25927e4d5b779add-1d481a174cb05ec7bb21/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 44. chromium · light · medium · error

[原图](screens/rc-checkbox/chromium/000303-2-actual.png) 328×220；SHA256 `3a32a9751da1f600c2480d563b55d8500691cac9172a7215d896b1837f2f7cfb`。case `f64d25927e4d5b779add-ee5e596425dedc2b6a5f/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 浅色错误轮廓/填充为红色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 45. chromium · light · medium · selected-error

[原图](screens/rc-checkbox/chromium/000304-2-actual.png) 328×220；SHA256 `aab5f7612927a7ed4bf5fde6130d5ad0654abc8c306319efa86087ab76ad4a87`。case `f64d25927e4d5b779add-771f97d11fae104c8804/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 浅色错误轮廓/填充为红色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 46. chromium · light · medium · disabled

[原图](screens/rc-checkbox/chromium/000305-2-actual.png) 328×170；SHA256 `0a121367612411a4badbe3db9cf8275c7b0da54ee40d7e77457e4a56c6f7ce82`。case `f64d25927e4d5b779add-8285ad01fbc4f6de92c4/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 47. chromium · light · medium · disabled-selected

[原图](screens/rc-checkbox/chromium/000306-2-actual.png) 328×170；SHA256 `b24bc466da51e18f30cd775ac7d0da616dd1fbb375592c7e09fd205e899fec92`。case `f64d25927e4d5b779add-7acd100ca05809f9247a/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 48. chromium · light · medium · indeterminate

[原图](screens/rc-checkbox/chromium/000309-2-actual.png) 328×170；SHA256 `b568da0525bbf93120022b47e2267cde4d05338bbe2e2f5805f067b23286db67`。case `f64d25927e4d5b779add-98d38f99c0ec3656a2d9/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 半选横杠清楚，反馈明确mixed（半选，布尔值off）；不把indeterminate等同checked=true。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 49. chromium · light · medium · indeterminate-error

[原图](screens/rc-checkbox/chromium/000310-2-actual.png) 328×220；SHA256 `988acdbc3534e10e11dce554a469ddd3398e64da4ef02c239155d16efdc69f4d`。case `f64d25927e4d5b779add-f37f2ab7914071b8628e/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 半选横杠清楚，反馈明确mixed（半选，布尔值off）；不把indeterminate等同checked=true。
- 浅色错误轮廓/填充为红色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 50. chromium · light · medium · disabled-indeterminate

[原图](screens/rc-checkbox/chromium/000311-2-actual.png) 328×170；SHA256 `f14739427ea27e1626398f09b07374735aae8fbdb2babb5fe6abb36def4f0be0`。case `f64d25927e4d5b779add-7fc02ca73dd49b8bbe5b/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 半选横杠清楚，反馈明确mixed（半选，布尔值off）；不把indeterminate等同checked=true。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 51. chromium · light · large · default

[原图](screens/rc-checkbox/chromium/000312-2-actual.png) 400×174；SHA256 `4d489607aae318a3a50f833c1f3155de850c3c8ee12d91532637181d39f3b0c3`。case `f64d25927e4d5b779add-25f3ebc8d6d5f5e7312b/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 52. chromium · light · large · hover

[原图](screens/rc-checkbox/chromium/000313-2-actual.png) 400×174；SHA256 `266fcf32a13d12c571a39fcbc4dee7ec101a691a2e38f694e4d1187f8dd4b897`。case `f64d25927e4d5b779add-370a98f9244fe7019d4c/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 53. chromium · light · large · focus-visible

[原图](screens/rc-checkbox/chromium/000314-2-actual.png) 400×174；SHA256 `0a38aaff959e72e5215ea662ccc88514c705cd0ad8f39826aee37a8675308224`。case `f64d25927e4d5b779add-86aec675a4a7904bb53a/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 54. chromium · light · large · pressed

[原图](screens/rc-checkbox/chromium/000315-2-actual.png) 400×174；SHA256 `266fcf32a13d12c571a39fcbc4dee7ec101a691a2e38f694e4d1187f8dd4b897`。case `f64d25927e4d5b779add-856ab010affbe4a14344/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 55. chromium · light · large · selected

[原图](screens/rc-checkbox/chromium/000316-2-actual.png) 400×174；SHA256 `a1d7297e187c09ca65e9bfe3a4f9a9ff5f35069915eb2c69e052df5810f33554`。case `f64d25927e4d5b779add-321a3afad992827be553/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 56. chromium · light · large · selected-hover

[原图](screens/rc-checkbox/chromium/000317-2-actual.png) 400×174；SHA256 `a1d7297e187c09ca65e9bfe3a4f9a9ff5f35069915eb2c69e052df5810f33554`。case `f64d25927e4d5b779add-b52e8c205521925a9c5e/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 57. chromium · light · large · selected-focus-visible

[原图](screens/rc-checkbox/chromium/000318-2-actual.png) 400×174；SHA256 `26524127ffdd2f0add73aa46bd240a27b19fffddea4444b045d7d9acc37acdf7`。case `f64d25927e4d5b779add-71eab87315cd3f7b7ea3/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 58. chromium · light · large · selected-pressed

[原图](screens/rc-checkbox/chromium/000319-2-actual.png) 400×174；SHA256 `a1d7297e187c09ca65e9bfe3a4f9a9ff5f35069915eb2c69e052df5810f33554`。case `f64d25927e4d5b779add-d4a389a50c66fb887c27/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 59. chromium · light · large · error

[原图](screens/rc-checkbox/chromium/000320-2-actual.png) 400×223；SHA256 `899e51ff83ed3bc125cca8f6d6365b17aabda7d1e3b43ef1047b366726877da5`。case `f64d25927e4d5b779add-bf312007d0f10d833551/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 浅色错误轮廓/填充为红色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 60. chromium · light · large · selected-error

[原图](screens/rc-checkbox/chromium/000321-2-actual.png) 400×223；SHA256 `4b2dbc2ec66da9b39893ac4e14075626941c0c127e044f08c28666d2125298c3`。case `f64d25927e4d5b779add-91ab939233a4af1e722f/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 浅色错误轮廓/填充为红色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 61. chromium · light · large · disabled

[原图](screens/rc-checkbox/chromium/000322-2-actual.png) 400×174；SHA256 `7bae0a59767b884e0fc32e7c1e73de23fa08b96ec549ff2da74904f7cff32551`。case `f64d25927e4d5b779add-5079b4046b6f27183842/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 62. chromium · light · large · disabled-selected

[原图](screens/rc-checkbox/chromium/000323-2-actual.png) 400×174；SHA256 `f2d172de6ba3966711c19b65fca7fcfdb019b02bc4859d694f2b79e8796fca3a`。case `f64d25927e4d5b779add-7fe57956a0f595948b2e/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 63. chromium · light · large · indeterminate

[原图](screens/rc-checkbox/chromium/000324-2-actual.png) 400×174；SHA256 `fa87bf7c38d157af9aceb94365b8e0f4846e056b459793ba0c681e85ce1abcf1`。case `f64d25927e4d5b779add-42decf31abf952183698/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 半选横杠清楚，反馈明确mixed（半选，布尔值off）；不把indeterminate等同checked=true。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 64. chromium · light · large · indeterminate-error

[原图](screens/rc-checkbox/chromium/000325-2-actual.png) 400×223；SHA256 `a2549ae03a3a284a7d7de7c05f02aca207d230d3622fdef380a281f8ddc218b6`。case `f64d25927e4d5b779add-234164236653b4041863/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 半选横杠清楚，反馈明确mixed（半选，布尔值off）；不把indeterminate等同checked=true。
- 浅色错误轮廓/填充为红色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 65. chromium · light · large · disabled-indeterminate

[原图](screens/rc-checkbox/chromium/000326-2-actual.png) 400×174；SHA256 `eda71753e3256a4fa78ee087e362edfec2031ace87a29cf0212510cbeb0eae3c`。case `f64d25927e4d5b779add-09dc328deb58b1fd7d67/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 半选横杠清楚，反馈明确mixed（半选，布尔值off）；不把indeterminate等同checked=true。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- large/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 66. chromium · dark · small · default

[原图](screens/rc-checkbox/chromium/000327-2-actual.png) 328×170；SHA256 `abe2d7aa927607ed942afdda8699cefcfed3fc98ac4676997aef279d4e996e4b`。case `f64d25927e4d5b779add-e2a206d53ac9ae03eb5f/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 67. chromium · dark · small · hover

[原图](screens/rc-checkbox/chromium/000328-2-actual.png) 328×170；SHA256 `8baf8628d04e4b34cc9ccaba5d45ec35c1623c8696663121cb4068b7964e262a`。case `f64d25927e4d5b779add-197ddde34a31762aefe0/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 68. chromium · dark · small · focus-visible

[原图](screens/rc-checkbox/chromium/000329-2-actual.png) 328×170；SHA256 `f7fd39ae0b842d149ea9fb13cd1dbb75748fb0b3174c21859313e334d98cee5c`。case `f64d25927e4d5b779add-f8f6780740296721f043/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 69. chromium · dark · small · pressed

[原图](screens/rc-checkbox/chromium/000330-2-actual.png) 328×170；SHA256 `8baf8628d04e4b34cc9ccaba5d45ec35c1623c8696663121cb4068b7964e262a`。case `f64d25927e4d5b779add-5ede0a2d7a663007a7a0/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 70. chromium · dark · small · selected

[原图](screens/rc-checkbox/chromium/000331-2-actual.png) 328×170；SHA256 `6481ec0f574047f0321b457aea6c4303a6a7b1845915ffac4ecc513f8c889a65`。case `f64d25927e4d5b779add-21b5913c9bf1671a5b1d/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 71. chromium · dark · small · selected-hover

[原图](screens/rc-checkbox/chromium/000332-2-actual.png) 328×170；SHA256 `6481ec0f574047f0321b457aea6c4303a6a7b1845915ffac4ecc513f8c889a65`。case `f64d25927e4d5b779add-cc1599e2d54dc9d5df81/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 72. chromium · dark · small · selected-focus-visible

[原图](screens/rc-checkbox/chromium/000333-2-actual.png) 328×170；SHA256 `42444539e3a1fb635a87e46fc17af90a7d7895065d1d05e66dbfc892312daf85`。case `f64d25927e4d5b779add-77a7d5365ace3f359906/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 73. chromium · dark · small · selected-pressed

[原图](screens/rc-checkbox/chromium/000334-2-actual.png) 328×170；SHA256 `6481ec0f574047f0321b457aea6c4303a6a7b1845915ffac4ecc513f8c889a65`。case `f64d25927e4d5b779add-46d41bd7269b868e1eb5/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 74. chromium · dark · small · error

[原图](screens/rc-checkbox/chromium/000335-2-actual.png) 328×220；SHA256 `73126cf6c2fc89047919528ea3690c4aa9d344018bcb87a7fd22e5eec7b1dcf8`。case `f64d25927e4d5b779add-d33d5269504a0519d542/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 暗色错误轮廓/填充为粉色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 75. chromium · dark · small · selected-error

[原图](screens/rc-checkbox/chromium/000336-2-actual.png) 328×220；SHA256 `14b5a88525aa57878742c13fdcf5e7b77699f55f4649d70ff3bd64158ad3c47e`。case `f64d25927e4d5b779add-b741c80c9bb9728a89d9/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 暗色错误轮廓/填充为粉色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 76. chromium · dark · small · disabled

[原图](screens/rc-checkbox/chromium/000337-2-actual.png) 328×170；SHA256 `336873c94ef489a33fd6e9be4a75a318535f8cd2959c8de3e137c4419cba7f6c`。case `f64d25927e4d5b779add-7b0dcfcef2d74a35d7f9/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 77. chromium · dark · small · disabled-selected

[原图](screens/rc-checkbox/chromium/000338-2-actual.png) 328×170；SHA256 `97b5a11c8408b92ad77abafbdbd9762dec75ca9b08a48747b6d74c7e8e9197a7`。case `f64d25927e4d5b779add-0ee71912c42067fbda35/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 78. chromium · dark · small · indeterminate

[原图](screens/rc-checkbox/chromium/000339-2-actual.png) 328×170；SHA256 `038711f583b0921426cbdb9ab216f3f10f34004357c71083df7c9dc657e16357`。case `f64d25927e4d5b779add-9cb0549c3fc80a9aea0c/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 半选横杠清楚，反馈明确mixed（半选，布尔值off）；不把indeterminate等同checked=true。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 79. chromium · dark · small · indeterminate-error

[原图](screens/rc-checkbox/chromium/000340-2-actual.png) 328×220；SHA256 `353744582e9411bb87fbeb684738298e5d615ec9367e75528af12e137b8ffee0`。case `f64d25927e4d5b779add-509df019f80d671a42f8/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 半选横杠清楚，反馈明确mixed（半选，布尔值off）；不把indeterminate等同checked=true。
- 暗色错误轮廓/填充为粉色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 80. chromium · dark · small · disabled-indeterminate

[原图](screens/rc-checkbox/chromium/000341-2-actual.png) 328×170；SHA256 `b2f50a8498132cc4968ceea9bba1dc703d06ec2059cf24536acd1844cd9e70a4`。case `f64d25927e4d5b779add-f307ac8f3a067dd72e9d/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 半选横杠清楚，反馈明确mixed（半选，布尔值off）；不把indeterminate等同checked=true。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- small/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 81. chromium · dark · medium · default

[原图](screens/rc-checkbox/chromium/000342-2-actual.png) 328×170；SHA256 `ec8c27f2cd44e047f4a56709cbbd0649958d323daaedef8823fd4f6e0179f829`。case `f64d25927e4d5b779add-c53d0ec3bbfa42711d74/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 82. chromium · dark · medium · hover

[原图](screens/rc-checkbox/chromium/000345-2-actual.png) 328×170；SHA256 `10fb645d9c5f55eaa56227e9b65adc7d0587e7416aa0ad0c40fa4fc3c925953c`。case `f64d25927e4d5b779add-c1717b7851c1acd3a785/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 83. chromium · dark · medium · focus-visible

[原图](screens/rc-checkbox/chromium/000346-2-actual.png) 328×170；SHA256 `519a27b8405ad62c5a5d41ddaedd17b7c97922863a957476fd9a46578d2ec0c3`。case `f64d25927e4d5b779add-bbb412a6f71f3c2c658e/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 84. chromium · dark · medium · pressed

[原图](screens/rc-checkbox/chromium/000349-2-actual.png) 328×170；SHA256 `10fb645d9c5f55eaa56227e9b65adc7d0587e7416aa0ad0c40fa4fc3c925953c`。case `f64d25927e4d5b779add-15563ed40d091f47d263/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 85. chromium · dark · medium · selected

[原图](screens/rc-checkbox/chromium/000350-2-actual.png) 328×170；SHA256 `980239ea9c7da709457ba3d8c58b1b0b1d8e7f2aaf1cdd80fb49a54152a4803b`。case `f64d25927e4d5b779add-966c23b6448b7e2bb184/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 86. chromium · dark · medium · selected-hover

[原图](screens/rc-checkbox/chromium/000353-2-actual.png) 328×170；SHA256 `980239ea9c7da709457ba3d8c58b1b0b1d8e7f2aaf1cdd80fb49a54152a4803b`。case `f64d25927e4d5b779add-e69b135447884bc27fa0/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 87. chromium · dark · medium · selected-focus-visible

[原图](screens/rc-checkbox/chromium/000354-2-actual.png) 328×170；SHA256 `218b34d02f4d860861d7ef5b235d3c9e66334f8f016e274ece4c492175afc348`。case `f64d25927e4d5b779add-f309a61e88dd5a9348e9/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 88. chromium · dark · medium · selected-pressed

[原图](screens/rc-checkbox/chromium/000355-2-actual.png) 328×170；SHA256 `980239ea9c7da709457ba3d8c58b1b0b1d8e7f2aaf1cdd80fb49a54152a4803b`。case `f64d25927e4d5b779add-77912490d834fe0c1446/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 89. chromium · dark · medium · error

[原图](screens/rc-checkbox/chromium/000356-2-actual.png) 328×220；SHA256 `4994836d6d319929d5c73f87736191789d4abf2bf15fec4f1367d8ec14270680`。case `f64d25927e4d5b779add-701ea40f9076a6ecd59c/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 暗色错误轮廓/填充为粉色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 90. chromium · dark · medium · selected-error

[原图](screens/rc-checkbox/chromium/000357-2-actual.png) 328×220；SHA256 `78c6e53bbb019dc2670b5ab92dcc5102c0c094c4cc3c6a7ca6173dadc37dd7b2`。case `f64d25927e4d5b779add-05f355fa12c852b503d0/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 暗色错误轮廓/填充为粉色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 91. chromium · dark · medium · disabled

[原图](screens/rc-checkbox/chromium/000358-2-actual.png) 328×170；SHA256 `38443158b5d5f4b4d6d7bb4e5d0247ec59461fb239105ec9c876cab0458d7ba2`。case `f64d25927e4d5b779add-39af90068f5ff8b4e785/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 92. chromium · dark · medium · disabled-selected

[原图](screens/rc-checkbox/chromium/000359-2-actual.png) 328×170；SHA256 `fbd6e3b6f999f46609973bb7dc46a25f1f0573cc00ca7ba1b3bfb6630a5d0e8c`。case `f64d25927e4d5b779add-850d5a2831d5f873159e/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 93. chromium · dark · medium · indeterminate

[原图](screens/rc-checkbox/chromium/000362-2-actual.png) 328×170；SHA256 `0871efa0e0b6bb84027eb54e2672604cf36b08950c33bd3985dc97470e029804`。case `f64d25927e4d5b779add-8edd14e048e4b30ca528/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 半选横杠清楚，反馈明确mixed（半选，布尔值off）；不把indeterminate等同checked=true。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 94. chromium · dark · medium · indeterminate-error

[原图](screens/rc-checkbox/chromium/000363-2-actual.png) 328×220；SHA256 `ad19c3008a9fa1d59ba312c81b5b1fb185cad135f6ded1b8e0217e89bcef24a7`。case `f64d25927e4d5b779add-8fe61755bd8941e5ef7c/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 半选横杠清楚，反馈明确mixed（半选，布尔值off）；不把indeterminate等同checked=true。
- 暗色错误轮廓/填充为粉色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 95. chromium · dark · medium · disabled-indeterminate

[原图](screens/rc-checkbox/chromium/000364-2-actual.png) 328×170；SHA256 `8b7150b55868add73bbdf67f65cd0ce29a666b051974a662fa3f178ed42d3df2`。case `f64d25927e4d5b779add-dbff0e78fb307ab60b8f/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 半选横杠清楚，反馈明确mixed（半选，布尔值off）；不把indeterminate等同checked=true。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 96. chromium · dark · large · default

[原图](screens/rc-checkbox/chromium/000365-2-actual.png) 400×174；SHA256 `8f7d809d629ea94442f33a09ed4f5b0712df78255483e6759961c6a4cd081873`。case `f64d25927e4d5b779add-1cc9767e2085e1c51bc4/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 97. chromium · dark · large · hover

[原图](screens/rc-checkbox/chromium/000366-2-actual.png) 400×174；SHA256 `faeaf2bdd3456b58094bfbffdc92f3e44ba38189e3a50e9fc2b65bb6bd2f470e`。case `f64d25927e4d5b779add-2d6b3967e41696d57d38/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 98. chromium · dark · large · focus-visible

[原图](screens/rc-checkbox/chromium/000367-2-actual.png) 400×174；SHA256 `925369d19be1034cdcc0e1107203f62196dd18546813e72625060dc99713a825`。case `f64d25927e4d5b779add-f126d69bf8b7d433e327/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 99. chromium · dark · large · pressed

[原图](screens/rc-checkbox/chromium/000368-2-actual.png) 400×174；SHA256 `faeaf2bdd3456b58094bfbffdc92f3e44ba38189e3a50e9fc2b65bb6bd2f470e`。case `f64d25927e4d5b779add-34911b7a50bdc6bb1418/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 100. chromium · dark · large · selected

[原图](screens/rc-checkbox/chromium/000369-2-actual.png) 400×174；SHA256 `d9206c2983bbadea000c43fdb74b23719a7ea0dc7a659d64b16a215224ddafe6`。case `f64d25927e4d5b779add-6bf2029a3389d8ea89c6/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 101. chromium · dark · large · selected-hover

[原图](screens/rc-checkbox/chromium/000370-2-actual.png) 400×174；SHA256 `d9206c2983bbadea000c43fdb74b23719a7ea0dc7a659d64b16a215224ddafe6`。case `f64d25927e4d5b779add-6adb59cd3fc5cb7c2b9d/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 102. chromium · dark · large · selected-focus-visible

[原图](screens/rc-checkbox/chromium/000371-2-actual.png) 400×174；SHA256 `4ba05aa7de371888423a965544a300c201518764248e1fcc7a50ab5d3b38fd31`。case `f64d25927e4d5b779add-3ebe3a636c48a4af7dee/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 103. chromium · dark · large · selected-pressed

[原图](screens/rc-checkbox/chromium/000372-2-actual.png) 400×174；SHA256 `d9206c2983bbadea000c43fdb74b23719a7ea0dc7a659d64b16a215224ddafe6`。case `f64d25927e4d5b779add-ffb617931cf2da188348/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- hover/pressed通过真实指针进入；若与默认/selected同字节如实保留，不假造新状态层或把同图算作可见差异。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 104. chromium · dark · large · error

[原图](screens/rc-checkbox/chromium/000373-2-actual.png) 400×223；SHA256 `e0cb1736ad4da66b74ca0a6cedcfc0d55b57c2d8a61ea41ecdc6e8e40b2ada2c`。case `f64d25927e4d5b779add-82ccf88cca80c52e8de1/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 暗色错误轮廓/填充为粉色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 105. chromium · dark · large · selected-error

[原图](screens/rc-checkbox/chromium/000374-2-actual.png) 400×223；SHA256 `5ee24d050b4f4471475b008455bd0751031358811f3c359bebdc3a9d24811d9e`。case `f64d25927e4d5b779add-77391c000ebee1e4c8d3/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 暗色错误轮廓/填充为粉色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 106. chromium · dark · large · disabled

[原图](screens/rc-checkbox/chromium/000375-2-actual.png) 400×174；SHA256 `5b137f5e8b420e6b442fd08d1b28fd5c55b3ea784b06c610778a518eba98b09b`。case `f64d25927e4d5b779add-3b729138f898dfd6b6ab/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 107. chromium · dark · large · disabled-selected

[原图](screens/rc-checkbox/chromium/000376-2-actual.png) 400×174；SHA256 `10e36c4ef5bb04b39fe0af6a6113efd947957f1b022bb8c16ed1e2c79874cfed`。case `f64d25927e4d5b779add-4669781dc48f2cce5014/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 108. chromium · dark · large · indeterminate

[原图](screens/rc-checkbox/chromium/000377-2-actual.png) 400×174；SHA256 `1146e96bba26bd178c4cc349188d68c79c39f63dc7010f4e4ddaf222a9a12c5d`。case `f64d25927e4d5b779add-4a7727fbea8254c6b034/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 半选横杠清楚，反馈明确mixed（半选，布尔值off）；不把indeterminate等同checked=true。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 109. chromium · dark · large · indeterminate-error

[原图](screens/rc-checkbox/chromium/000378-2-actual.png) 400×223；SHA256 `04c56f4fc3af99cdb4fe4486d04b12128f286b1e3272af68b75817552f320ed9`。case `f64d25927e4d5b779add-950366838d3a7d3bdc1a/chromium/0`；worker 1；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 半选横杠清楚，反馈明确mixed（半选，布尔值off）；不把indeterminate等同checked=true。
- 暗色错误轮廓/填充为粉色，提示行与输出分离，没有遮字；aria-invalid/描述关联由原生另证。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 110. chromium · dark · large · disabled-indeterminate

[原图](screens/rc-checkbox/chromium/000379-2-actual.png) 400×174；SHA256 `6be8dd84f79bb4c718c53d7c778729ac6ebe68deb0c17a80221430ed05f4be53`。case `f64d25927e4d5b779add-3aa97159227c36cea3c1/chromium/0`；worker 0；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 半选横杠清楚，反馈明确mixed（半选，布尔值off）；不把indeterminate等同checked=true。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- large/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 111. chromium · light · inventory · inventory

[原图](screens/rc-checkbox/chromium/000392-0-inventory-actual.png) 1280×720；SHA256 `d47cf80bceafede592034fa7120da4d697ad3d0f32d982d22a7c8dc081a344f2`。case `73019a0006cb75aa6498-276b9df6d420c1631d75/chromium/0`；worker 1；native attachment 0/inventory-actual，同字节。原生passed；人工accepted仅实际画面范围。

- 仅公开默认Demo库存：顶部单个未勾选Checkbox及标签可见，下方大块留白为当前页面布局；不是核心状态/尺寸证据。
- 只审当前viewport，不扩成全页或额外交互。

基准资格：库存无命名目标，仅证据。

### 112. chromium · dark · inventory · inventory

[原图](screens/rc-checkbox/chromium/000395-0-inventory-actual.png) 1280×720；SHA256 `56541dedeb13f02962eb64097b29a9590e22c821b7ddcadf169debf758423359`。case `73019a0006cb75aa6498-f16252f9cac0ebf593d7/chromium/0`；worker 0；native attachment 0/inventory-actual，同字节。原生passed；人工accepted仅实际画面范围。

- 仅公开默认Demo库存：顶部单个未勾选Checkbox及标签可见，下方大块留白为当前页面布局；不是核心状态/尺寸证据。
- 只审当前viewport，不扩成全页或额外交互。

基准资格：库存无命名目标，仅证据。

### 113. firefox · light · medium · default

[原图](screens/rc-checkbox/firefox/000290-2-actual.png) 328×170；SHA256 `56e7d793a417758e244b80f20f73e327c667d39fc1746c87d9f4ac3ca2493359`。case `f64d25927e4d5b779add-6acf7e267076ede1f0ea/firefox/0`；worker 2；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 114. firefox · light · medium · focus-visible

[原图](screens/rc-checkbox/firefox/000294-2-actual.png) 328×170；SHA256 `d2f76016f281a0bffc00570f4bf79dfa811c399ff66ddb8373c6efe4dbf95a9c`。case `f64d25927e4d5b779add-4cbc2a341a20a9afd4b3/firefox/0`；worker 3；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 115. firefox · light · medium · selected

[原图](screens/rc-checkbox/firefox/000298-2-actual.png) 328×170；SHA256 `912093b62939c7f8a898fef5e1a34b5c9a465f4518b231b7a1c0d8a164a2f3ce`。case `f64d25927e4d5b779add-ab0f162a7267d5ffafa7/firefox/0`；worker 2；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 116. firefox · light · medium · disabled-selected

[原图](screens/rc-checkbox/firefox/000307-2-actual.png) 328×170；SHA256 `15e50fdc48a84d1169332fbb214aa623472e658bf4f805682a27adfc3288eadb`。case `f64d25927e4d5b779add-7acd100ca05809f9247a/firefox/0`；worker 3；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 117. firefox · dark · medium · default

[原图](screens/rc-checkbox/firefox/000343-2-actual.png) 328×170；SHA256 `0b38bf403b91b2a67cd8a258a2d78e99fa78270f09bb74137cc3456b93154a0c`。case `f64d25927e4d5b779add-c53d0ec3bbfa42711d74/firefox/0`；worker 2；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 118. firefox · dark · medium · focus-visible

[原图](screens/rc-checkbox/firefox/000347-2-actual.png) 328×170；SHA256 `451531e02ac694c68b761489d50aa34911f8f8f2c0592223916c3a860b52f5cd`。case `f64d25927e4d5b779add-bbb412a6f71f3c2c658e/firefox/0`；worker 3；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 119. firefox · dark · medium · selected

[原图](screens/rc-checkbox/firefox/000351-2-actual.png) 328×170；SHA256 `676503d84a491e82083ae25cf6b8bf155a1582b6166abea6f964875ba7af739e`。case `f64d25927e4d5b779add-966c23b6448b7e2bb184/firefox/0`；worker 2；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 120. firefox · dark · medium · disabled-selected

[原图](screens/rc-checkbox/firefox/000360-2-actual.png) 328×170；SHA256 `d5422502705ceaf44111b8ec68c4db5e64ca8cae552865f32b26f662cdb8fbce`。case `f64d25927e4d5b779add-850d5a2831d5f873159e/firefox/0`；worker 3；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 121. firefox · light · inventory · inventory

[原图](screens/rc-checkbox/firefox/000393-0-inventory-actual.png) 1280×720；SHA256 `a0a762b1c0f8272162be71ba6053f18bf1589d1ef3c403bd5babab4b69d0a3a1`。case `73019a0006cb75aa6498-276b9df6d420c1631d75/firefox/0`；worker 3；native attachment 0/inventory-actual，同字节。原生passed；人工accepted仅实际画面范围。

- 仅公开默认Demo库存：顶部单个未勾选Checkbox及标签可见，下方大块留白为当前页面布局；不是核心状态/尺寸证据。
- 只审当前viewport，不扩成全页或额外交互。

基准资格：库存无命名目标，仅证据。

### 122. firefox · dark · inventory · inventory

[原图](screens/rc-checkbox/firefox/000396-0-inventory-actual.png) 1280×720；SHA256 `e2bfd8514553ac8612f2a20f50ee381f31fe823aebf7cb1feb5071935903f0aa`。case `73019a0006cb75aa6498-f16252f9cac0ebf593d7/firefox/0`；worker 2；native attachment 0/inventory-actual，同字节。原生passed；人工accepted仅实际画面范围。

- 仅公开默认Demo库存：顶部单个未勾选Checkbox及标签可见，下方大块留白为当前页面布局；不是核心状态/尺寸证据。
- 只审当前viewport，不扩成全页或额外交互。

基准资格：库存无命名目标，仅证据。

### 123. webkit · light · medium · default

[原图](screens/rc-checkbox/webkit/000291-2-actual.png) 328×170；SHA256 `61a2fa261c10b312284da6c7ee68bf244a2be752ce15c88880d6f90ad0418a09`。case `f64d25927e4d5b779add-6acf7e267076ede1f0ea/webkit/0`；worker 4；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 124. webkit · light · medium · focus-visible

[原图](screens/rc-checkbox/webkit/000295-2-actual.png) 328×170；SHA256 `899030aef984d43185ab1aa21e37f7f00a39e8d4571d6ab28065ae52628ac589`。case `f64d25927e4d5b779add-4cbc2a341a20a9afd4b3/webkit/0`；worker 5；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 125. webkit · light · medium · selected

[原图](screens/rc-checkbox/webkit/000299-2-actual.png) 328×170；SHA256 `7091d2eabe2454cc5f5f1843a229933f34b153472f2381a9dff41838b6be1d39`。case `f64d25927e4d5b779add-ab0f162a7267d5ffafa7/webkit/0`；worker 4；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 126. webkit · light · medium · disabled-selected

[原图](screens/rc-checkbox/webkit/000308-2-actual.png) 328×170；SHA256 `6b9e457440d6af0ba22d3ba5e477f78e1ad2a2baaf6631c4eab3b3b5c886758a`。case `f64d25927e4d5b779add-7acd100ca05809f9247a/webkit/0`；worker 5；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- medium/浅色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 127. webkit · dark · medium · default

[原图](screens/rc-checkbox/webkit/000344-2-actual.png) 328×170；SHA256 `0ba6bb30ad8b87e80ce2b5ee4e053c3bfc9172cf885987e6c39364a2157bec12`。case `f64d25927e4d5b779add-c53d0ec3bbfa42711d74/webkit/0`；worker 5；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 128. webkit · dark · medium · focus-visible

[原图](screens/rc-checkbox/webkit/000348-2-actual.png) 328×170；SHA256 `58c39da2a82c0efeb470834fa3d2e36a8fb462de383e7d3d78e915eeff78bef7`。case `f64d25927e4d5b779add-bbb412a6f71f3c2c658e/webkit/0`；worker 4；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 空复选框可辨，反馈off。
- 真实键盘焦点外轮廓完整留在frame内，未裁切或压住相邻文字；几何/焦点属性由原生断言单列。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 129. webkit · dark · medium · selected

[原图](screens/rc-checkbox/webkit/000352-2-actual.png) 328×170；SHA256 `60c73901d782c056d99ab3dd449180f4525602cc277e65d44d354a9ad0fa1d59`。case `f64d25927e4d5b779add-966c23b6448b7e2bb184/webkit/0`；worker 5；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 130. webkit · dark · medium · disabled-selected

[原图](screens/rc-checkbox/webkit/000361-2-actual.png) 328×170；SHA256 `dfb7ec8c9f96a331ae59404e07171fcbe25feb9c80710947877353e725b4ad14`。case `f64d25927e4d5b779add-850d5a2831d5f873159e/webkit/0`；worker 4；native attachment 2/actual，同字节。原生passed；人工accepted仅实际画面范围。

- 真实勾选清楚，反馈on。
- 禁用控件与文案灰化但状态形状仍可辨；disabled-selected输出on，不能把浅灰同义为未选。
- medium/暗色文字与图形无遮挡，当前尺寸与密度按注解记录；密度不重复改变独立控件几何。
- 此引擎仅medium标准密度的default/focus-visible/selected/disabled-selected及默认库存；未核本引擎其他尺寸、error/mixed、环境或真实zoom。
- 暗色disabled和空态细边框层级较弱但可辨；没有数值对比度测量，不签署数值合规。

基准资格：匹配此Linux引擎命名目标，可作为候选；未建立/比较。

### 131. webkit · light · inventory · inventory

[原图](screens/rc-checkbox/webkit/000394-0-inventory-actual.png) 1280×720；SHA256 `8e8ba550498e3917f89c3199013e3c34179efe68a7a594540db5cbeffa3e56e0`。case `73019a0006cb75aa6498-276b9df6d420c1631d75/webkit/0`；worker 5；native attachment 0/inventory-actual，同字节。原生passed；人工accepted仅实际画面范围。

- 仅公开默认Demo库存：顶部单个未勾选Checkbox及标签可见，下方大块留白为当前页面布局；不是核心状态/尺寸证据。
- 只审当前viewport，不扩成全页或额外交互。

基准资格：库存无命名目标，仅证据。

### 132. webkit · dark · inventory · inventory

[原图](screens/rc-checkbox/webkit/000397-0-inventory-actual.png) 1280×720；SHA256 `c410746ddd371091cc601bd2771f18e839e727f78ae897504fbfb869c1797112`。case `73019a0006cb75aa6498-f16252f9cac0ebf593d7/webkit/0`；worker 4；native attachment 0/inventory-actual，同字节。原生passed；人工accepted仅实际画面范围。

- 仅公开默认Demo库存：顶部单个未勾选Checkbox及标签可见，下方大块留白为当前页面布局；不是核心状态/尺寸证据。
- 只审当前viewport，不扩成全页或额外交互。

基准资格：库存无命名目标，仅证据。

## 重复SHA（均逐张看）

- 1f17caa521385a1d9d6375fac9bf4679e623b910213a089daa3b157d58dcc735：9(chromium)、40(chromium)、41(chromium)、43(chromium)
- 980239ea9c7da709457ba3d8c58b1b0b1d8e7f2aaf1cdd80fb49a54152a4803b：18(chromium)、85(chromium)、86(chromium)、88(chromium)
- d4d67f39223c280cdc5c3a8a3221c8d3515148a19aa949bfaba1131c056d52a4：22(chromium)、24(chromium)
- b779c108946ba8ef0ac9552ab6822cd51286e2bced7012e2020d316b79fb65e2：25(chromium)、26(chromium)、28(chromium)
- 06a23f64d507669f20cd0ed0ca14eb3aa4c61f5d8ef912e95ed9b1182db75111：37(chromium)、39(chromium)
- 266fcf32a13d12c571a39fcbc4dee7ec101a691a2e38f694e4d1187f8dd4b897：52(chromium)、54(chromium)
- a1d7297e187c09ca65e9bfe3a4f9a9ff5f35069915eb2c69e052df5810f33554：55(chromium)、56(chromium)、58(chromium)
- 8baf8628d04e4b34cc9ccaba5d45ec35c1623c8696663121cb4068b7964e262a：67(chromium)、69(chromium)
- 6481ec0f574047f0321b457aea6c4303a6a7b1845915ffac4ecc513f8c889a65：70(chromium)、71(chromium)、73(chromium)
- 10fb645d9c5f55eaa56227e9b65adc7d0587e7416aa0ad0c40fa4fc3c925953c：82(chromium)、84(chromium)
- faeaf2bdd3456b58094bfbffdc92f3e44ba38189e3a50e9fc2b65bb6bd2f470e：97(chromium)、99(chromium)
- d9206c2983bbadea000c43fdb74b23719a7ea0dc7a659d64b16a215224ddafe6：100(chromium)、101(chromium)、103(chromium)

## 限制

- Only current original component frame, inventory viewport, or real-zoom viewport is visually reviewed; no whole-page claim.
- Native hit geometry, coarse pointer edge interaction, keyboard focus/semantics and state-preservation assertions are separate from visible appearance.
- Chromium declared full states/sizes; Firefox/WebKit only declared medium four-state subset plus defaults. No cross-engine pixel equality is claimed.
- Source/asset identities are captured snapshot identities; no current-worktree identity or Windows images substituted.
- No videos decoded/watched for these static selection controls; existing recordings remain untouched.
- This is one candidate appearance review and eligibility judgment. Baseline creation and two consecutive native pixel comparisons remain separate; no verified or lifecycle promotion.
- No numerical contrast compliance claim is made.
