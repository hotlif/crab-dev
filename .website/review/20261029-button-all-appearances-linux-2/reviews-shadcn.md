# Button shadcn 全部原图复审

候选：20261029-button-all-appearances-linux-2；复审时间：2026-10-29T11:49:21.726Z。

按 matrix / environment 注解或 inventory-scope.config 分类，逐张打开了 shadcn 的全部 112 case / 234 PNG：核心 90 case / 210 PNG，环境与真实缩放 20 case / 22 PNG，库存 2 case / 2 PNG。234 张哈希均匹配，10 个引用 worker 的完整 before / after 记录稳定，均为同摘要官方 Linux 镜像的 Chromium 156.0.8078.4。

五档 xs / s / m / l / xl 的五种标准外观都已查看。hover / focus / pressed 的每张对应各自实际操作的外观；焦点环均清楚、完整，未见被容器裁切或和相邻按钮重叠。disabled 明显弱化；selected / unselected 可区别，Text 保持普通动作。10 张自然 loading PNG 全部已看，弧线与文字未见重叠；本审查未播放视频，由根代理另核。

**未接受范围：** 两张 320px 失败图实际裁出 compatibility subtle 与底部长 fit 按钮，宿主后续 minmax 修复不能使旧图通过。两张 basic.demo 库存图另有默认形状差异：胶囊形与核心 public s/default 圆角矩形不一致，原生测试通过不能消除此实际差异。

已复制原停止容器中的精确编译资产，并与 inputs 指纹逐文件匹配。basic 的 meta.args 未提供 shape，直接 DemoFrame 只复制 meta.args，没有旋钮自动采用 round。owner-source CSS 的 defaultShapeStyle 在 offset 34576，后续同权 baseStyle 在 40324 无条件声明 height/2；public matrix CSS 的 base 在 1347、default shape 在 39997。两个打包顺序相反足以解释默认形状差异，未将其归咎于 Theme 或 ConfigContext。完整字节证据见 [shape audit](../../../.tmp/button-inventory-shape-audit.json) 和 [module proof](../../../.tmp/button-inventory-shape-module-proof.json)。后续删除竞争默认并重新采集，旧图继续保留。

中性 outlined / compatibility dashed 的普通态边界较弱，焦点环另有清楚轮廓。[固定 New York V4 按钮](https://github.com/shadcn-ui/ui/blob/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4/ui/button.tsx) 采用中性细描边和表面，深色再使用 input 来源的描边与半透明底色；[同提交颜色](https://github.com/shadcn-ui/ui/blob/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/app/globals.css) 的浅色 border/input 为中性 .922，深色为白色 10%/15%。当前 L3 分别消费 border.subtle/default，L2 为浅 neutral200、深 neutral800；深色是 solid role + content surface，不是参考半透明层的逐像素复刻。固定参考没有 dashed 变体，这是兼容扩展。以上按观测和映射差异记录，不宣称整体 WCAG 失败，不据印象改全局色。

真实 200% 的 4 张可见窗口图已核对扩展 proof：tabZoom=2、CSS 宽度 1280→640、DPR 自然 1→2、外窗不变、HTML/body zoom=1。它们只覆盖 s/variants 及主操作焦点，不能推广为每档尺寸每种状态的缩放交叉矩阵。所有图仅供范围内外观复审，未建立基准、未做双次稳定性验证、未更新 verified 或生命周期，Firefox/WebKit 不在本候选范围。

| 序号 | Case id / image | 实际范围 | PNG | SHA-256 | 结论 |
| --- | --- | --- | --- | --- | --- |
| 1 | 5e7cfde592acf3410c62-b1e2b2935f6c9b7ca907/chromium/0 #0 | light / s / narrow | 320×768 | b13875affccf8db46dccb692a98e9a52adc90a9ca9c44b3b0780b15f3aa60608 | reviewed-known-failure-not-accepted |
| 2 | 5e7cfde592acf3410c62-d075f87cf94caf9305bf/chromium/0 #0 | light / s / tablet | 644×374 | 1a2775d9b1913c0b482198d6d1af4b0fc54319c1a6d999be7cf7de71f1b9fa59 | reviewed-scoped-no-additional-obvious-defect |
| 3 | 5e7cfde592acf3410c62-c2833bf6c0dafd656457/chromium/0 #0 | light / s / desktop | 644×374 | 559adce6b34336091ff6b966c96ce030ee1138dc2cf326551d5fe817f8eea7bd | reviewed-scoped-no-additional-obvious-defect |
| 4 | 5e7cfde592acf3410c62-a33263492fa8a5ad7ced/chromium/0 #0 | light / s / touch | 644×374 | 1a2775d9b1913c0b482198d6d1af4b0fc54319c1a6d999be7cf7de71f1b9fa59 | reviewed-scoped-no-additional-obvious-defect |
| 5 | 5e7cfde592acf3410c62-bb5f5c6e1f572953532b/chromium/0 #0 | light / s / rtl | 644×374 | c53846277edaa6ca0a41171be34d1cc81fc5efd7af2a3d4d50681f2a8102ddff | reviewed-scoped-no-additional-obvious-defect |
| 6 | 5e7cfde592acf3410c62-4799a152e25443eaddd1/chromium/0 #0 | light / s / english | 618×374 | 3cd38a18c5873c3efb190f3ffea176a21325681362c16eaea9ac891614cbb9b2 | reviewed-scoped-no-additional-obvious-defect |
| 7 | 5e7cfde592acf3410c62-6fe64082364883792267/chromium/0 #0 | light / s / brand | 644×374 | c0d65dff1813305ea2dd7bfce49b8a1ddd46d21516b8eb46b3320fbd3a4a9cfe | reviewed-scoped-no-additional-obvious-defect |
| 8 | 5e7cfde592acf3410c62-a6df7d2ab51d6ac51242/chromium/0 #0 | light / s / forced-colors | 644×374 | 8a99eefaba5acf06d778fb5e887b9bcc41ae037c27eff4bd09cdb2588983269a | reviewed-scoped-no-additional-obvious-defect |
| 9 | 5e7cfde592acf3410c62-57924095669d39aba764/chromium/0 #0 | light / s / reduced-motion | 644×374 | d2db80b9ea18c766b70a107788bc66996f0f7faa44e76062492e188a5d7bcbf7 | reviewed-scoped-no-additional-obvious-defect |
| 10 | 5e7cfde592acf3410c62-cfd68ee975d720dadf5d/chromium/0 #0 | dark / s / narrow | 320×768 | 74e3e5e69761bb427a851dc9632c40cdb880b4e91837571e23ba8f613a1e4302 | reviewed-known-failure-not-accepted |
| 11 | 5e7cfde592acf3410c62-30900dbac8990ad0b8a2/chromium/0 #0 | dark / s / tablet | 644×374 | 86717a2608e3a1d7c8b9723f9569161bf4015610e7bd5b6e7e8911578e751f5d | reviewed-scoped-no-additional-obvious-defect |
| 12 | 5e7cfde592acf3410c62-71e65e8779ccd8523046/chromium/0 #0 | dark / s / desktop | 644×374 | ceddd4c4d9086596b84d378517583b26c2362da1b6b18c1ca4eb14a03ee3ac06 | reviewed-scoped-no-additional-obvious-defect |
| 13 | 5e7cfde592acf3410c62-9eba55b9cbd5b9a98044/chromium/0 #0 | dark / s / touch | 644×374 | 86717a2608e3a1d7c8b9723f9569161bf4015610e7bd5b6e7e8911578e751f5d | reviewed-scoped-no-additional-obvious-defect |
| 14 | 5e7cfde592acf3410c62-677d4183a41e30b29d24/chromium/0 #0 | dark / s / rtl | 644×374 | 1e43502c8ea2ee931a50799d42c3940dd288ebeacefdf966fb5e251d6a8ca92e | reviewed-scoped-no-additional-obvious-defect |
| 15 | 5e7cfde592acf3410c62-1a7d0cae7e7e160382aa/chromium/0 #0 | dark / s / english | 618×374 | d67f4a491217414661d9e58477b6eef02031bc082fc1f42ca427ec92aa9a1329 | reviewed-scoped-no-additional-obvious-defect |
| 16 | 5e7cfde592acf3410c62-51ab7419986d63dd4234/chromium/0 #0 | dark / s / brand | 644×374 | c4a147b62b8ed5502e2c610f3e2637c2001daac186c4f7a4b2d8ae28863856ce | reviewed-scoped-no-additional-obvious-defect |
| 17 | 5e7cfde592acf3410c62-5003c3cb105d9f1fc96c/chromium/0 #0 | dark / s / forced-colors | 644×374 | 0de139da869731d67ce8efc5ead0358e03fbcadb856c85b5bae0f8153b0287e3 | reviewed-scoped-no-additional-obvious-defect |
| 18 | 5e7cfde592acf3410c62-3b7dc2a5e3f2b02625ab/chromium/0 #0 | dark / s / reduced-motion | 644×374 | 26dc0b63bdd6945c76570cf03e0b19b4f20a8d0f79867c94e0eb6b62ab6fac7c | reviewed-scoped-no-additional-obvious-defect |
| 19 | 5b862e7b8dcfc4db17c8-c8bdacf4380355436232/chromium/0 #0 | light / xs / loading | 656×33 | c346c253111e3698935178fc4a552daa5d190855c4f79331a5bf19f56bcab928 | reviewed-natural-static-frame-video-separate |
| 20 | 5b862e7b8dcfc4db17c8-1415b60ab6cf58dba205/chromium/0 #0 | light / s / loading | 706×37 | d654b06142024a5f9bee758a5bc9844b4140cff626e4d7673c25d387b081e9e9 | reviewed-natural-static-frame-video-separate |
| 21 | 5b862e7b8dcfc4db17c8-38432db64b6b9a0c8c1c/chromium/0 #0 | light / m / loading | 786×41 | 3761d8bd75976679307db2b62c4b580efe8c23bbfb00377185e8cf822d8dcf47 | reviewed-natural-static-frame-video-separate |
| 22 | 5b862e7b8dcfc4db17c8-090aa7c8354df66c01ec/chromium/0 #0 | light / l / loading | 854×49 | eda4cf0467d8acfa68c77638bd828bb1bfa61c55272e23a06b3747b466bb3c19 | reviewed-natural-static-frame-video-separate |
| 23 | 5b862e7b8dcfc4db17c8-5ab92519e6619470937a/chromium/0 #0 | light / xl / loading | 1002×57 | 76ef72434dfcee0ed791526c98bfb7779edffda72e03c9bfa588dcb3c1cb641a | reviewed-natural-static-frame-video-separate |
| 24 | 5b862e7b8dcfc4db17c8-1cfb5bb25e3f1cc3ba1e/chromium/0 #0 | dark / xs / loading | 656×33 | 36d68993cf54e1129f1669b2cea9aa5f14e4b10b21ed5556bb2f21686ab81a05 | reviewed-natural-static-frame-video-separate |
| 25 | 5b862e7b8dcfc4db17c8-a175d393daaf0060ead9/chromium/0 #0 | dark / s / loading | 706×37 | 6c726f6744997970f228c520e4de2b46cc9c20ee57b818a4e578189934298e5f | reviewed-natural-static-frame-video-separate |
| 26 | 5b862e7b8dcfc4db17c8-0f399080db723505fbf2/chromium/0 #0 | dark / m / loading | 786×41 | 40f8eee10d8806d67f504b8cee31127bea563eb0064745bdffa5c5b7c3ee95df | reviewed-natural-static-frame-video-separate |
| 27 | 5b862e7b8dcfc4db17c8-b1ca0ff28c2535253e19/chromium/0 #0 | dark / l / loading | 854×49 | 2fa2278a14594b6be6fa8112817869e80729ecd8cdb6caf63c2e872606f403bc | reviewed-natural-static-frame-video-separate |
| 28 | 5b862e7b8dcfc4db17c8-61a8591c687fc7a263d6/chromium/0 #0 | dark / xl / loading | 1002×57 | 0930e96a8ef563aa327aff4c134a0c175cbb3a8b5e0652f5b284892aa657c89d | reviewed-natural-static-frame-video-separate |
| 29 | e0615b692a3cbec88509-48aec40d2200fc7a6571/chromium/0 #0 | light / s / zoom-200 | 1280×813 | 501c6dbf4bd8a62f2845995efc45f5382e50778b00776e51bd1ea4f30ec14a2a | reviewed-scoped-no-additional-obvious-defect |
| 30 | e0615b692a3cbec88509-48aec40d2200fc7a6571/chromium/0 #1 | light / s / zoom-200 | 1280×813 | 7ed22959585aa1a8d50e647d0ba0b621980490ffa469e99b931180b6f98932c8 | reviewed-scoped-no-additional-obvious-defect |
| 31 | e0615b692a3cbec88509-d5c54fc748740664280c/chromium/0 #0 | dark / s / zoom-200 | 1280×813 | 427fb25df214b7166fcdb3efcd07eb97746d5f9d07d9f57b402fd224a3fe1a31 | reviewed-scoped-no-additional-obvious-defect |
| 32 | e0615b692a3cbec88509-d5c54fc748740664280c/chromium/0 #1 | dark / s / zoom-200 | 1280×813 | 40a1a421c1007d275239a16c10a3b11606fce7b0ad40a67c0487a6a7c4ded375 | reviewed-scoped-no-additional-obvious-defect |
| 33 | b84dd6a488247b918e76-e3a22af3de09e47ece28/chromium/0 #0 | light / xs / default | 604×130 | 76db48edd9f4eff0447e0cc3574ed822b8bb9a425f705e025381df9349ff8c50 | reviewed-scoped-no-additional-obvious-defect |
| 34 | b84dd6a488247b918e76-3e0adc0fcb48b5e261d6/chromium/0 #0 | light / xs / hover / primary | 604×130 | 1bc8a3afc79cb9ee7109d50719e5635bbc3189d88150a08c5f5a573471d3bbab | reviewed-scoped-no-additional-obvious-defect |
| 35 | b84dd6a488247b918e76-3e0adc0fcb48b5e261d6/chromium/0 #1 | light / xs / hover / tonal | 604×130 | 1b2e9534cd802e45502910ab9168f4dbf841693b35e254db0faaafaaf04ba43c | reviewed-scoped-no-additional-obvious-defect |
| 36 | b84dd6a488247b918e76-3e0adc0fcb48b5e261d6/chromium/0 #2 | light / xs / hover / outlined | 604×130 | 04ef3d869e468521bd7ba33ea00bb5f84063d3f2c19ec9bb024a2dc368fad075 | reviewed-scoped-no-additional-obvious-defect |
| 37 | b84dd6a488247b918e76-3e0adc0fcb48b5e261d6/chromium/0 #3 | light / xs / hover / text | 604×130 | b15eba447b64fa9b28b25967daa262f797396ae71743d19883778254b2fd3f83 | reviewed-scoped-no-additional-obvious-defect |
| 38 | b84dd6a488247b918e76-3e0adc0fcb48b5e261d6/chromium/0 #4 | light / xs / hover / elevated | 604×130 | adc6cd7b4447f168b70d8086eb619264c04c9c0ff05505cf8c34f85feb7e2706 | reviewed-scoped-no-additional-obvious-defect |
| 39 | b84dd6a488247b918e76-49e73c3189101e394b23/chromium/0 #0 | light / xs / focus-visible / primary | 604×130 | 5244cecb147f0a6831caa8d8f0adf6fc109600f4adf14ba876251f35ad1b4d15 | reviewed-scoped-no-additional-obvious-defect |
| 40 | b84dd6a488247b918e76-49e73c3189101e394b23/chromium/0 #1 | light / xs / focus-visible / tonal | 604×130 | 204fc948ace6248b0edcac6d0b85a178573e15ed31ff60d29294c59edff0fd7b | reviewed-scoped-no-additional-obvious-defect |
| 41 | b84dd6a488247b918e76-49e73c3189101e394b23/chromium/0 #2 | light / xs / focus-visible / outlined | 604×130 | 802200288142b819eb368330d01083868d0e76339fc32a29c6f1ce29b90f58e4 | reviewed-scoped-no-additional-obvious-defect |
| 42 | b84dd6a488247b918e76-49e73c3189101e394b23/chromium/0 #3 | light / xs / focus-visible / text | 604×130 | 03cc5c7563b03b821b5513102edd2f0741be62df77d4f8e78d54fc9c6c0d05a6 | reviewed-scoped-no-additional-obvious-defect |
| 43 | b84dd6a488247b918e76-49e73c3189101e394b23/chromium/0 #4 | light / xs / focus-visible / elevated | 604×130 | 1772c6c73024d69e50153805899411fd6dc508b910503cbac135f28801879ec6 | reviewed-scoped-no-additional-obvious-defect |
| 44 | b84dd6a488247b918e76-6b7b5c9725ba2d0d5185/chromium/0 #0 | light / xs / pressed / primary | 604×130 | 8603ff5c3dd7bc300d72656febc6f5d42ac37ca1b33a654cb2ff6f22f923deca | reviewed-scoped-no-additional-obvious-defect |
| 45 | b84dd6a488247b918e76-6b7b5c9725ba2d0d5185/chromium/0 #1 | light / xs / pressed / tonal | 604×130 | 5adf5167485a119e787b692e84079229070b7e26806d12df46d34b234416f576 | reviewed-scoped-no-additional-obvious-defect |
| 46 | b84dd6a488247b918e76-6b7b5c9725ba2d0d5185/chromium/0 #2 | light / xs / pressed / outlined | 604×130 | 010206dfb19cf4d995bc8fa58771d99e1b38cc2bf3a8dd847e1fb9e4f43b3dda | reviewed-scoped-no-additional-obvious-defect |
| 47 | b84dd6a488247b918e76-6b7b5c9725ba2d0d5185/chromium/0 #3 | light / xs / pressed / text | 604×130 | 0d03544237cc57b1cf667ec62ff708c0aece6d09d87d668b06bb9a93c6212e25 | reviewed-scoped-no-additional-obvious-defect |
| 48 | b84dd6a488247b918e76-6b7b5c9725ba2d0d5185/chromium/0 #4 | light / xs / pressed / elevated | 604×130 | 6edb3379031bffa8eec630729a56ea3b45e50bae2923fd1260593da023afef60 | reviewed-scoped-no-additional-obvious-defect |
| 49 | b84dd6a488247b918e76-89a4d79b9d0ac88ee5ae/chromium/0 #0 | light / xs / disabled | 604×130 | dd0becf73b6a8a033549109880220e1374780a4d2a05a6bc5494b06097d15fce | reviewed-scoped-no-additional-obvious-defect |
| 50 | b84dd6a488247b918e76-711ee1721b751a979c66/chromium/0 #0 | light / xs / selected | 604×130 | aa78dff45d5ff94bc5160166698824cb4425413dbbb7546722680a3e76fa1cdf | reviewed-scoped-no-additional-obvious-defect |
| 51 | b84dd6a488247b918e76-60cbea3886eda62cb868/chromium/0 #0 | light / xs / unselected | 604×130 | 43dd4a95e6c07713253cced3182522f638093ba6d7a41dae76efb47ad39135b3 | reviewed-scoped-no-additional-obvious-defect |
| 52 | b84dd6a488247b918e76-3812004319dedfcf43b8/chromium/0 #0 | light / xs / variants | 604×354 | ce02da7b81255d0c87bc292cb487dfa3973c2f7708eac353043dd7d9cff619a0 | reviewed-scoped-no-additional-obvious-defect |
| 53 | b84dd6a488247b918e76-747c3ec8557104695d73/chromium/0 #0 | light / s / default | 644×134 | b7962a5c9cc0d2a1e6ebc4c51b8afa4c47e56d288b8e0a5aa9c7b90b694e629c | reviewed-scoped-no-additional-obvious-defect |
| 54 | b84dd6a488247b918e76-c0e5c0fc41789ed2ed65/chromium/0 #0 | light / s / hover / primary | 644×134 | bc8a39680b3049faa72980bfb92b5faedab93da0a9a1a5c10d7f2412b42c2e88 | reviewed-scoped-no-additional-obvious-defect |
| 55 | b84dd6a488247b918e76-c0e5c0fc41789ed2ed65/chromium/0 #1 | light / s / hover / tonal | 644×134 | a20e7f8d36c578a78a5ced2c79e2fc7099c40ef139e4042d01848d4e710dfa0f | reviewed-scoped-no-additional-obvious-defect |
| 56 | b84dd6a488247b918e76-c0e5c0fc41789ed2ed65/chromium/0 #2 | light / s / hover / outlined | 644×134 | 8d6ebc25781ecff040b4640faefaf8154378fc04a3b711f735433bf19b0fa08a | reviewed-scoped-no-additional-obvious-defect |
| 57 | b84dd6a488247b918e76-c0e5c0fc41789ed2ed65/chromium/0 #3 | light / s / hover / text | 644×134 | 25cb5d2cc52b0b4eb7d91a2534f6d10db774974fcb0b3cf84597ee9bb274012c | reviewed-scoped-no-additional-obvious-defect |
| 58 | b84dd6a488247b918e76-c0e5c0fc41789ed2ed65/chromium/0 #4 | light / s / hover / elevated | 644×134 | ba97e96ab2a606fbc0474659edf0e42fdb19e5e074eca4160df885d02837d1fc | reviewed-scoped-no-additional-obvious-defect |
| 59 | b84dd6a488247b918e76-cd02435b71c74732b239/chromium/0 #0 | light / s / focus-visible / primary | 644×134 | f9ea232798d0e340ca7374d035145fa238eec9ef5db98b99b4fc2e6c3fa41dca | reviewed-scoped-no-additional-obvious-defect |
| 60 | b84dd6a488247b918e76-cd02435b71c74732b239/chromium/0 #1 | light / s / focus-visible / tonal | 644×134 | 0e7fb0a33d228d1a77d5cc764d40024a052aa16342d58e3c2ea8c7a6a7d8be96 | reviewed-scoped-no-additional-obvious-defect |
| 61 | b84dd6a488247b918e76-cd02435b71c74732b239/chromium/0 #2 | light / s / focus-visible / outlined | 644×134 | 9ef945cef9bb77e66f5055309e9d2df27d8e9251b5e0d598a096d64641b2f1b9 | reviewed-scoped-no-additional-obvious-defect |
| 62 | b84dd6a488247b918e76-cd02435b71c74732b239/chromium/0 #3 | light / s / focus-visible / text | 644×134 | 61a667f6e8b740c262c43ad9249895afd45086c2934710997335fc88ea30fe6a | reviewed-scoped-no-additional-obvious-defect |
| 63 | b84dd6a488247b918e76-cd02435b71c74732b239/chromium/0 #4 | light / s / focus-visible / elevated | 644×134 | d917490ef62c167595d025a86f668012fbe8c3e7a4f519698214bc8075973a8a | reviewed-scoped-no-additional-obvious-defect |
| 64 | b84dd6a488247b918e76-21bbc4758c10b6fe9a6b/chromium/0 #0 | light / s / pressed / primary | 644×134 | 77be8dea502499cc8002d29d308bf15255960eef1f1315b05e0c20b77a767f55 | reviewed-scoped-no-additional-obvious-defect |
| 65 | b84dd6a488247b918e76-21bbc4758c10b6fe9a6b/chromium/0 #1 | light / s / pressed / tonal | 644×134 | 6b99c9e2ad0280b040dd0bde4ae0e1b660f0b6858fa5ca647e3cc529668e52dd | reviewed-scoped-no-additional-obvious-defect |
| 66 | b84dd6a488247b918e76-21bbc4758c10b6fe9a6b/chromium/0 #2 | light / s / pressed / outlined | 644×134 | d6f2eaf67fb51832212b9033dcb2c01e93ae91c457097442f529338bfd3af805 | reviewed-scoped-no-additional-obvious-defect |
| 67 | b84dd6a488247b918e76-21bbc4758c10b6fe9a6b/chromium/0 #3 | light / s / pressed / text | 644×134 | f0b175d0bade8e12b70456bc61025b37b6909d0ea8ea0652646f2365e765e5e0 | reviewed-scoped-no-additional-obvious-defect |
| 68 | b84dd6a488247b918e76-21bbc4758c10b6fe9a6b/chromium/0 #4 | light / s / pressed / elevated | 644×134 | 8a8ee422d86d0ea9d95ce559a0b39634717fbcd6afc34d48d0f7be181beaaf18 | reviewed-scoped-no-additional-obvious-defect |
| 69 | b84dd6a488247b918e76-6ffb53468fbc85fa4fdd/chromium/0 #0 | light / s / disabled | 644×134 | ff70e80064979c5ca5f50d76ea629f7a729d81e56c171f8a03c94ec8f82649f6 | reviewed-scoped-no-additional-obvious-defect |
| 70 | b84dd6a488247b918e76-c6ba0ad59a939b2edb76/chromium/0 #0 | light / s / selected | 644×134 | 7f1b5098db081d1552ed4d13b91152131dbbf75b11be7ad02f66deafdda68a4b | reviewed-scoped-no-additional-obvious-defect |
| 71 | b84dd6a488247b918e76-81485733f44e32219131/chromium/0 #0 | light / s / unselected | 644×134 | f79cfdf4b8767f0cd55ad4b571d3e4f711223e6d28f51daca05edb5e35d190a0 | reviewed-scoped-no-additional-obvious-defect |
| 72 | b84dd6a488247b918e76-192212c150e18e2132e2/chromium/0 #0 | light / s / variants | 644×374 | 062fb28ef6ab2f33c2336a1e6b7c5f594f0c435ad53e6fc3398a0948cfd1290d | reviewed-scoped-no-additional-obvious-defect |
| 73 | b84dd6a488247b918e76-a02f5313a28715b9ab0f/chromium/0 #0 | light / m / default | 724×138 | 458eaceaa215d2c8d072ca132dcf9f95c5b7c26815c74cb750fe3124641e76bf | reviewed-scoped-no-additional-obvious-defect |
| 74 | b84dd6a488247b918e76-fec04d12d858b2f00837/chromium/0 #0 | light / m / hover / primary | 724×138 | 15ebe02ec565c4bbdcf6d8096e32b543572d0cf674f2ebde95a368b64c260f6d | reviewed-scoped-no-additional-obvious-defect |
| 75 | b84dd6a488247b918e76-fec04d12d858b2f00837/chromium/0 #1 | light / m / hover / tonal | 724×138 | 1f03fe276762f244ac27ebefc13ab7456c840cf8a021a845532c9e8c1c8fcd34 | reviewed-scoped-no-additional-obvious-defect |
| 76 | b84dd6a488247b918e76-fec04d12d858b2f00837/chromium/0 #2 | light / m / hover / outlined | 724×138 | ec00eb241034131584bcaa15acc9d4c50ba1abb302948f16932817796445440e | reviewed-scoped-no-additional-obvious-defect |
| 77 | b84dd6a488247b918e76-fec04d12d858b2f00837/chromium/0 #3 | light / m / hover / text | 724×138 | 4609211fa4dd8711dfec4fe5f3136f0d1b6e32fcbfc0e9730d648bb72b5e069b | reviewed-scoped-no-additional-obvious-defect |
| 78 | b84dd6a488247b918e76-fec04d12d858b2f00837/chromium/0 #4 | light / m / hover / elevated | 724×138 | ff1acb1bf71dc7261b9475ba1577d2b5c9e8d8411dc0c7c8b0738b899202c765 | reviewed-scoped-no-additional-obvious-defect |
| 79 | b84dd6a488247b918e76-3d2978d221be33eca2b4/chromium/0 #0 | light / m / focus-visible / primary | 724×138 | fd229e750a4ffe7384e78c1fdf30a0d5394e22927b10bcb86c03b73554c017ee | reviewed-scoped-no-additional-obvious-defect |
| 80 | b84dd6a488247b918e76-3d2978d221be33eca2b4/chromium/0 #1 | light / m / focus-visible / tonal | 724×138 | f24d6aab9df7dd158858a08859af770cace2ad85a293f2cf4d96fcfabf6324c9 | reviewed-scoped-no-additional-obvious-defect |
| 81 | b84dd6a488247b918e76-3d2978d221be33eca2b4/chromium/0 #2 | light / m / focus-visible / outlined | 724×138 | 3018bd51f6f1ed4aeef9f0b8a4686fbd1e189cf83fa2f17619fa655aa36cce9f | reviewed-scoped-no-additional-obvious-defect |
| 82 | b84dd6a488247b918e76-3d2978d221be33eca2b4/chromium/0 #3 | light / m / focus-visible / text | 724×138 | c93e6d163d7e7948b99cf5345d8e59072ac3e821a8e9d21fc98ec926d2b0fccc | reviewed-scoped-no-additional-obvious-defect |
| 83 | b84dd6a488247b918e76-3d2978d221be33eca2b4/chromium/0 #4 | light / m / focus-visible / elevated | 724×138 | 45ac1dea9edda91d0bfb281237ee92cac06a247565ee2ce04f9ca56160755c59 | reviewed-scoped-no-additional-obvious-defect |
| 84 | b84dd6a488247b918e76-2a3f5093948553415c4a/chromium/0 #0 | light / m / pressed / primary | 724×138 | dd8dfeacab99f7c414a4f7259fd2ac08be21d4ba9b3fc89f82ff7f30ff4962e7 | reviewed-scoped-no-additional-obvious-defect |
| 85 | b84dd6a488247b918e76-2a3f5093948553415c4a/chromium/0 #1 | light / m / pressed / tonal | 724×138 | 90af0d1279b97a0b1208140760d66a7dca222b3556e8a6d3de0e604b5af362cb | reviewed-scoped-no-additional-obvious-defect |
| 86 | b84dd6a488247b918e76-2a3f5093948553415c4a/chromium/0 #2 | light / m / pressed / outlined | 724×138 | 405d0f38b235b29409ba5cc9b79c25910b934e3ff8408537834deb12a61bdcd5 | reviewed-scoped-no-additional-obvious-defect |
| 87 | b84dd6a488247b918e76-2a3f5093948553415c4a/chromium/0 #3 | light / m / pressed / text | 724×138 | 8d47b348644217515265d48648e8943b350157eb3163fc55d1b42924317462d7 | reviewed-scoped-no-additional-obvious-defect |
| 88 | b84dd6a488247b918e76-2a3f5093948553415c4a/chromium/0 #4 | light / m / pressed / elevated | 724×138 | 65674270f089aa601fd72bbd15efe26a45b7ed7be4f6ea66074bf23ce03400c3 | reviewed-scoped-no-additional-obvious-defect |
| 89 | b84dd6a488247b918e76-2d6e0a52bce17935269a/chromium/0 #0 | light / m / disabled | 724×138 | 02751dbe348a01c863fb79dfa5dd068288110f3ba3f2d6e3617bbc825ce6dfc9 | reviewed-scoped-no-additional-obvious-defect |
| 90 | b84dd6a488247b918e76-d47c08818151fc9ed433/chromium/0 #0 | light / m / selected | 724×138 | df9633b53e247cac5bc3a5c4c8a854248203470b5c00b2a366ac0248ea4f29dd | reviewed-scoped-no-additional-obvious-defect |
| 91 | b84dd6a488247b918e76-e727365d7183a58bcac0/chromium/0 #0 | light / m / unselected | 724×138 | ae760aa3c6e951a427c4bfd8fa1d803e60c3ecf0f02b8c0a15b0b64e3fa73298 | reviewed-scoped-no-additional-obvious-defect |
| 92 | b84dd6a488247b918e76-5c96e8f57139f2f6e33e/chromium/0 #0 | light / m / variants | 724×394 | 18e4f8542e494bf6b79fb7cb477ec47fd2b7ef0ce9dc8031346a1b2615f333bf | reviewed-scoped-no-additional-obvious-defect |
| 93 | b84dd6a488247b918e76-19e7575f68a46bfeeea0/chromium/0 #0 | light / l / default | 782×146 | c1b0549e5c8b201e6691645bc2ad86cb101c4240ac890a0880e3c228dd053885 | reviewed-scoped-no-additional-obvious-defect |
| 94 | b84dd6a488247b918e76-a6bac0bbd302cca3338a/chromium/0 #0 | light / l / hover / primary | 782×146 | 9cec0d347848cdb0b3a7fb514c4469254575c60875f47144f7e1d459dfa05429 | reviewed-scoped-no-additional-obvious-defect |
| 95 | b84dd6a488247b918e76-a6bac0bbd302cca3338a/chromium/0 #1 | light / l / hover / tonal | 782×146 | f72dd8e04853e130074f3028ea50b2c197f5946113472d0585e26b610748681d | reviewed-scoped-no-additional-obvious-defect |
| 96 | b84dd6a488247b918e76-a6bac0bbd302cca3338a/chromium/0 #2 | light / l / hover / outlined | 782×146 | 9e6c9bcfcb0ef3cf1a57400eea60a269e33ba030d07f29c020baf984fc4ae27d | reviewed-scoped-no-additional-obvious-defect |
| 97 | b84dd6a488247b918e76-a6bac0bbd302cca3338a/chromium/0 #3 | light / l / hover / text | 782×146 | b3352225dab399b5fb183aff00f8a54571168803d3b98b9bf8ad5b41944524f2 | reviewed-scoped-no-additional-obvious-defect |
| 98 | b84dd6a488247b918e76-a6bac0bbd302cca3338a/chromium/0 #4 | light / l / hover / elevated | 782×146 | fca2f7aae55760204335ae0a344016deb2cee7fe57df72262a6a04ea8c01d1ad | reviewed-scoped-no-additional-obvious-defect |
| 99 | b84dd6a488247b918e76-4b486f575d6a7950f355/chromium/0 #0 | light / l / focus-visible / primary | 782×146 | e5731c3cdf77a57fb61f017884ec96db20edc53c369d2f1b19132761d10520b6 | reviewed-scoped-no-additional-obvious-defect |
| 100 | b84dd6a488247b918e76-4b486f575d6a7950f355/chromium/0 #1 | light / l / focus-visible / tonal | 782×146 | 753d36692a56ce0c77bda1c13a6e9d3462cd07ac367ba287bb3c123752a5b5e1 | reviewed-scoped-no-additional-obvious-defect |
| 101 | b84dd6a488247b918e76-4b486f575d6a7950f355/chromium/0 #2 | light / l / focus-visible / outlined | 782×146 | bc5dc7471f7f0fa05c7f4ba90cee33fb834952183f8afe562dad84013b05741f | reviewed-scoped-no-additional-obvious-defect |
| 102 | b84dd6a488247b918e76-4b486f575d6a7950f355/chromium/0 #3 | light / l / focus-visible / text | 782×146 | 9400e19fef4ea6ed9ac1f64816a6383a1192e33a9d242d5cd4bfb2bf672e8bcf | reviewed-scoped-no-additional-obvious-defect |
| 103 | b84dd6a488247b918e76-4b486f575d6a7950f355/chromium/0 #4 | light / l / focus-visible / elevated | 782×146 | 48e2062221377c9105ca7c79abce4de5ad22df811b2ef71e1557dd7cba49d482 | reviewed-scoped-no-additional-obvious-defect |
| 104 | b84dd6a488247b918e76-d0b1248cdb1923f5db9d/chromium/0 #0 | light / l / pressed / primary | 782×146 | 4bf09fe7a293961d4642cfe9431ab19cee1ec780aeaac933b6c2f00aecbfd4a9 | reviewed-scoped-no-additional-obvious-defect |
| 105 | b84dd6a488247b918e76-d0b1248cdb1923f5db9d/chromium/0 #1 | light / l / pressed / tonal | 782×146 | 4dc57a2b17e8fcb0663a4b4fc224a0542568fcd05e138b437fbfb11a9d0347e5 | reviewed-scoped-no-additional-obvious-defect |
| 106 | b84dd6a488247b918e76-d0b1248cdb1923f5db9d/chromium/0 #2 | light / l / pressed / outlined | 782×146 | 0c83c1653a1a7c99f3c25576ccca1219e1b36681086d7146e26ae61bb703c0f7 | reviewed-scoped-no-additional-obvious-defect |
| 107 | b84dd6a488247b918e76-d0b1248cdb1923f5db9d/chromium/0 #3 | light / l / pressed / text | 782×146 | 0b8a71591f2b1c1d07c31778a916f790e78501c8ed450c2d9863b82c2052f7dd | reviewed-scoped-no-additional-obvious-defect |
| 108 | b84dd6a488247b918e76-d0b1248cdb1923f5db9d/chromium/0 #4 | light / l / pressed / elevated | 782×146 | adeb97a77a8b8890d52a1b77c1d9d451fadbc807abdb38245c7dd3db68ef22f1 | reviewed-scoped-no-additional-obvious-defect |
| 109 | b84dd6a488247b918e76-7fc51ae98a846e1ba6a3/chromium/0 #0 | light / l / disabled | 782×146 | 42dbb3e885f41931934f0909a5053b3a8d876adee1b8d6faec0bcaf0819569ca | reviewed-scoped-no-additional-obvious-defect |
| 110 | b84dd6a488247b918e76-05eda0ddecff2b1c4b49/chromium/0 #0 | light / l / selected | 782×146 | dce3dd31088ec25d532a55110e93bb604c60e3bc105e9c33ffe21012075637be | reviewed-scoped-no-additional-obvious-defect |
| 111 | b84dd6a488247b918e76-52322d3b2c9bc4912926/chromium/0 #0 | light / l / unselected | 782×146 | 5b46836259fb5be97d391183bed53df1e6fd7cf4dd69748917ab4baf1815e848 | reviewed-scoped-no-additional-obvious-defect |
| 112 | b84dd6a488247b918e76-55af8de3c6e87a3c0ecf/chromium/0 #0 | light / l / variants | 782×434 | ce2500896311ef4799cc97e8dbc397aaa2e051c943a9cdcc327e07984e304816 | reviewed-scoped-no-additional-obvious-defect |
| 113 | b84dd6a488247b918e76-c1124855b65afb60042c/chromium/0 #0 | light / xl / default | 920×154 | 499d61dec52e51504a14709e9d0cdb748f0adc594b564f0e6664c5d31406773b | reviewed-scoped-no-additional-obvious-defect |
| 114 | b84dd6a488247b918e76-8fb1d5b1f31b19daa35c/chromium/0 #0 | light / xl / hover / primary | 920×154 | fbc11b8d175542d2d36fcb13d7f4105da1d66b3baf39fd0a7d1f1ca3cf7e7252 | reviewed-scoped-no-additional-obvious-defect |
| 115 | b84dd6a488247b918e76-8fb1d5b1f31b19daa35c/chromium/0 #1 | light / xl / hover / tonal | 920×154 | fa87f96e4042c6e075003cbe354886b8d811eb46c9c745f167e4d4368dd0ea35 | reviewed-scoped-no-additional-obvious-defect |
| 116 | b84dd6a488247b918e76-8fb1d5b1f31b19daa35c/chromium/0 #2 | light / xl / hover / outlined | 920×154 | b19d5fb11377bf701399883179e1be90d70d65bd8afa026b99627b5de47c897d | reviewed-scoped-no-additional-obvious-defect |
| 117 | b84dd6a488247b918e76-8fb1d5b1f31b19daa35c/chromium/0 #3 | light / xl / hover / text | 920×154 | eb9d1ee357593fad0e84d6a4c95d1e8514b7dccc6ac01fff8e74f3b47e117b91 | reviewed-scoped-no-additional-obvious-defect |
| 118 | b84dd6a488247b918e76-8fb1d5b1f31b19daa35c/chromium/0 #4 | light / xl / hover / elevated | 920×154 | e74d22c21b5b15da187f2f3476647753e1b72102cd482734a99a471489ed3f2a | reviewed-scoped-no-additional-obvious-defect |
| 119 | b84dd6a488247b918e76-e58ab83d9991261911f0/chromium/0 #0 | light / xl / focus-visible / primary | 920×154 | 2596526a83da2b7a48b2210148db2ea7b13cd12868feb5d9c8050c12e8db2808 | reviewed-scoped-no-additional-obvious-defect |
| 120 | b84dd6a488247b918e76-e58ab83d9991261911f0/chromium/0 #1 | light / xl / focus-visible / tonal | 920×154 | 02ea1e5921f0bc70bc356cb88f1bdb93423d0f1a853f33a3712bdbda86081672 | reviewed-scoped-no-additional-obvious-defect |
| 121 | b84dd6a488247b918e76-e58ab83d9991261911f0/chromium/0 #2 | light / xl / focus-visible / outlined | 920×154 | b32e86862b9ab4078fb0c69f79a6a144876bef6dbe4b1fa01b599240e01b2813 | reviewed-scoped-no-additional-obvious-defect |
| 122 | b84dd6a488247b918e76-e58ab83d9991261911f0/chromium/0 #3 | light / xl / focus-visible / text | 920×154 | c8177012d7727cf7aee9b92cc9de35684874cb20e51a0c6dabc87301c05ad110 | reviewed-scoped-no-additional-obvious-defect |
| 123 | b84dd6a488247b918e76-e58ab83d9991261911f0/chromium/0 #4 | light / xl / focus-visible / elevated | 920×154 | f4e320164af5fd6e0938dc3c16d4365a44a89b8b1cf23fcb85b2af0bc42801c1 | reviewed-scoped-no-additional-obvious-defect |
| 124 | b84dd6a488247b918e76-def11b6968d3e2aaafc3/chromium/0 #0 | light / xl / pressed / primary | 920×154 | a4480d929245c2a8e5c70e675839776acdc75786cf20465fbf2179b695332bd8 | reviewed-scoped-no-additional-obvious-defect |
| 125 | b84dd6a488247b918e76-def11b6968d3e2aaafc3/chromium/0 #1 | light / xl / pressed / tonal | 920×154 | 43ed89b10da996acf438c580212d3d5e2a8238a1c20c113b55c7e3b61a324b9b | reviewed-scoped-no-additional-obvious-defect |
| 126 | b84dd6a488247b918e76-def11b6968d3e2aaafc3/chromium/0 #2 | light / xl / pressed / outlined | 920×154 | f8d99d3dc8ddcbc50b238f77ce0f0e82e6e77d075a86d76318b8ef483d94dffe | reviewed-scoped-no-additional-obvious-defect |
| 127 | b84dd6a488247b918e76-def11b6968d3e2aaafc3/chromium/0 #3 | light / xl / pressed / text | 920×154 | 4b4f8446675edecf5e1e68c8b35415c7ef2f807a425a441a55bf8ef9249b7a6a | reviewed-scoped-no-additional-obvious-defect |
| 128 | b84dd6a488247b918e76-def11b6968d3e2aaafc3/chromium/0 #4 | light / xl / pressed / elevated | 920×154 | 417d0fcb0e142cb13d4df24f0a90ee9c029de8e18e5659f5ac12d553c6b79a92 | reviewed-scoped-no-additional-obvious-defect |
| 129 | b84dd6a488247b918e76-aaac51fe9e00e8b54ef6/chromium/0 #0 | light / xl / disabled | 920×154 | ce8d719451928b8f383d6b24653dc0230dd323dba114df3c895e8a0e76d619ba | reviewed-scoped-no-additional-obvious-defect |
| 130 | b84dd6a488247b918e76-b59849ed7514f3c39a99/chromium/0 #0 | light / xl / selected | 920×154 | 44c5fbd7ac782a62bfe62d77fd0cb770fc0c9b25283b099b7afe39837f6585e7 | reviewed-scoped-no-additional-obvious-defect |
| 131 | b84dd6a488247b918e76-43723c6441d716e292d7/chromium/0 #0 | light / xl / unselected | 920×154 | 4a71103833174899ebd78695be180c5dff0a491ee64bd3a2e5359172f7472555 | reviewed-scoped-no-additional-obvious-defect |
| 132 | b84dd6a488247b918e76-ba2340f78bbaaab029cb/chromium/0 #0 | light / xl / variants | 920×474 | d53d2e1cd5ae7c68a0ef3387f5aed98c3b67380093a82c82bfd564d67f66fc7b | reviewed-scoped-no-additional-obvious-defect |
| 133 | b84dd6a488247b918e76-06e5c4fbf9430bd0aa50/chromium/0 #0 | dark / xs / default | 604×130 | 31f4dd27e619471944c6c03cd944b75f4b3536d64d97c4f8728627344c6e1124 | reviewed-scoped-no-additional-obvious-defect |
| 134 | b84dd6a488247b918e76-ea5e98ac883af11dca9f/chromium/0 #0 | dark / xs / hover / primary | 604×130 | d5c3eecd20d5d5b5ddbb813099f5fcdb5a2b4092479fc5831987ab5c10a482a6 | reviewed-scoped-no-additional-obvious-defect |
| 135 | b84dd6a488247b918e76-ea5e98ac883af11dca9f/chromium/0 #1 | dark / xs / hover / tonal | 604×130 | 67b678715f83235be050efa4717fdd4686a94d31e5aed9f593ec05a5cc1cf919 | reviewed-scoped-no-additional-obvious-defect |
| 136 | b84dd6a488247b918e76-ea5e98ac883af11dca9f/chromium/0 #2 | dark / xs / hover / outlined | 604×130 | 33dcca645ce6484faab776941aa4b7896d1e3c824f9d3c92d4a68e66d9002dd1 | reviewed-scoped-no-additional-obvious-defect |
| 137 | b84dd6a488247b918e76-ea5e98ac883af11dca9f/chromium/0 #3 | dark / xs / hover / text | 604×130 | d91e4c7fd13b6c12a279ff0cfe89da6c3d1d5e07a4c63d0af1115c8d980ab1a0 | reviewed-scoped-no-additional-obvious-defect |
| 138 | b84dd6a488247b918e76-ea5e98ac883af11dca9f/chromium/0 #4 | dark / xs / hover / elevated | 604×130 | ab6c6deccba5d79cb18486856fd5ab25093d4d33786f39728a2664321137ead4 | reviewed-scoped-no-additional-obvious-defect |
| 139 | b84dd6a488247b918e76-3b09167006d6e091ea7d/chromium/0 #0 | dark / xs / focus-visible / primary | 604×130 | 264c7750538cc87dce3d746863de7650a15ab77ed79123fbea2f31a58867da34 | reviewed-scoped-no-additional-obvious-defect |
| 140 | b84dd6a488247b918e76-3b09167006d6e091ea7d/chromium/0 #1 | dark / xs / focus-visible / tonal | 604×130 | 6ed002f89947a9e7372237577f12b9b2128045fbd72adaa3b08aecce428dbbad | reviewed-scoped-no-additional-obvious-defect |
| 141 | b84dd6a488247b918e76-3b09167006d6e091ea7d/chromium/0 #2 | dark / xs / focus-visible / outlined | 604×130 | d5a72ef648714c20d6fccd57d24631746f650cdc1b433808328af93bf48b147f | reviewed-scoped-no-additional-obvious-defect |
| 142 | b84dd6a488247b918e76-3b09167006d6e091ea7d/chromium/0 #3 | dark / xs / focus-visible / text | 604×130 | 5da91f693803e5e32a9bfd665daf7dcaf35638cee72442312d73c8cd406847ed | reviewed-scoped-no-additional-obvious-defect |
| 143 | b84dd6a488247b918e76-3b09167006d6e091ea7d/chromium/0 #4 | dark / xs / focus-visible / elevated | 604×130 | 66492ae876191b5c201281ad7113dcb9e4bd240ac590ccf83209b72cd8ee0657 | reviewed-scoped-no-additional-obvious-defect |
| 144 | b84dd6a488247b918e76-f23b40de7b7e83b00ff2/chromium/0 #0 | dark / xs / pressed / primary | 604×130 | 1c460bb96472bac0e176ba39d60f4234c3050c3bee74772395095df9c5cc5ab1 | reviewed-scoped-no-additional-obvious-defect |
| 145 | b84dd6a488247b918e76-f23b40de7b7e83b00ff2/chromium/0 #1 | dark / xs / pressed / tonal | 604×130 | 9d551db5890df8f6ddda50dedf9803413a549b459abfb6eee2d78b4e5bd8d5ba | reviewed-scoped-no-additional-obvious-defect |
| 146 | b84dd6a488247b918e76-f23b40de7b7e83b00ff2/chromium/0 #2 | dark / xs / pressed / outlined | 604×130 | 8fdea60b3b47e9751e9eeef728222389fad77befe0b6a6877bec7e23e044985a | reviewed-scoped-no-additional-obvious-defect |
| 147 | b84dd6a488247b918e76-f23b40de7b7e83b00ff2/chromium/0 #3 | dark / xs / pressed / text | 604×130 | e6a4fe4cdd2a4e4144be4762e1086ed7f63dc703cf6d6eef5a0fbe08732e2b5c | reviewed-scoped-no-additional-obvious-defect |
| 148 | b84dd6a488247b918e76-f23b40de7b7e83b00ff2/chromium/0 #4 | dark / xs / pressed / elevated | 604×130 | 8be6e9307ebd474c56716df1f7de688ee65e4aaba5964b6933c56be9b67329f1 | reviewed-scoped-no-additional-obvious-defect |
| 149 | b84dd6a488247b918e76-0853f9f7ee7c1cb5f69b/chromium/0 #0 | dark / xs / disabled | 604×130 | 74e226290a58e365da8a6ec21d6a517778d8634f030a2e3f8cae2840f3106475 | reviewed-scoped-no-additional-obvious-defect |
| 150 | b84dd6a488247b918e76-9db3fc762b71ef0c2952/chromium/0 #0 | dark / xs / selected | 604×130 | 41434148d4cbe3eb74d72f5ca677631fbe33de01243ec66a15b469e525e32404 | reviewed-scoped-no-additional-obvious-defect |
| 151 | b84dd6a488247b918e76-acd3fba08779428888c2/chromium/0 #0 | dark / xs / unselected | 604×130 | be0e8dd3bd2b41f5a10d1b1aca3da1541c6957ffe566c4ab8178fbba26b11208 | reviewed-scoped-no-additional-obvious-defect |
| 152 | b84dd6a488247b918e76-68fbb0dd18cc2e02bf62/chromium/0 #0 | dark / xs / variants | 604×354 | fac48276ce8bda09f33ad7bad01265a06d11cefec8196bf80906dfea886de7bf | reviewed-scoped-no-additional-obvious-defect |
| 153 | b84dd6a488247b918e76-2f3e66594a60100bf7eb/chromium/0 #0 | dark / s / default | 644×134 | 5a740846b42a1e6559b52671564f905e3c5e368352d0122149ab24a4d51b565c | reviewed-scoped-no-additional-obvious-defect |
| 154 | b84dd6a488247b918e76-7121ea5ea9b61759c100/chromium/0 #0 | dark / s / hover / primary | 644×134 | 914156be1c44f82819bbfb3b4ffea123f02f4b093cd0c330f08f3000e1fcc7a1 | reviewed-scoped-no-additional-obvious-defect |
| 155 | b84dd6a488247b918e76-7121ea5ea9b61759c100/chromium/0 #1 | dark / s / hover / tonal | 644×134 | c10c9d1f1f5200fe4f9061ac305fea27d1630a509afd1568776208f20f088c40 | reviewed-scoped-no-additional-obvious-defect |
| 156 | b84dd6a488247b918e76-7121ea5ea9b61759c100/chromium/0 #2 | dark / s / hover / outlined | 644×134 | 7ac62279be08a1cbe30036ec4cbe1a9ef6e5c359d0295ae94b4a4f5c67331299 | reviewed-scoped-no-additional-obvious-defect |
| 157 | b84dd6a488247b918e76-7121ea5ea9b61759c100/chromium/0 #3 | dark / s / hover / text | 644×134 | e7d3c4169f5a3e95edca689f60762cbe845b3e8095833108f7dfb89717c621c2 | reviewed-scoped-no-additional-obvious-defect |
| 158 | b84dd6a488247b918e76-7121ea5ea9b61759c100/chromium/0 #4 | dark / s / hover / elevated | 644×134 | d63381843dcc383395e3d7ab7e3b125f9f22d8f9fb7036cd61c24ea593a69e16 | reviewed-scoped-no-additional-obvious-defect |
| 159 | b84dd6a488247b918e76-562fee5c72f43bc639a4/chromium/0 #0 | dark / s / focus-visible / primary | 644×134 | 993fce042e4b9dbe4ef6df5d3dbc1dc8a0a76568e4f5928ad457b88189394bd5 | reviewed-scoped-no-additional-obvious-defect |
| 160 | b84dd6a488247b918e76-562fee5c72f43bc639a4/chromium/0 #1 | dark / s / focus-visible / tonal | 644×134 | bdd0eb108cacabeeb25aea8628dce6dd8c6f8f1e359dbee9acfe618d58d57dbb | reviewed-scoped-no-additional-obvious-defect |
| 161 | b84dd6a488247b918e76-562fee5c72f43bc639a4/chromium/0 #2 | dark / s / focus-visible / outlined | 644×134 | f3c93fe5b3b735cf2d0b6692a0e38b76874325d3414a1caec491588663873ad6 | reviewed-scoped-no-additional-obvious-defect |
| 162 | b84dd6a488247b918e76-562fee5c72f43bc639a4/chromium/0 #3 | dark / s / focus-visible / text | 644×134 | 53865f5bb690a2b66d6fc016516d55342a7a3ab49251fa0695f4db4b15c38351 | reviewed-scoped-no-additional-obvious-defect |
| 163 | b84dd6a488247b918e76-562fee5c72f43bc639a4/chromium/0 #4 | dark / s / focus-visible / elevated | 644×134 | 9947722150d257e69d26ceaab8246e1d739ce33bbb63bb207d63fba273cc29ec | reviewed-scoped-no-additional-obvious-defect |
| 164 | b84dd6a488247b918e76-e58cd6518d895a8da5f3/chromium/0 #0 | dark / s / pressed / primary | 644×134 | 853a0acc308ec8955a1935a93518063bb3c4618047fa898c69c400be4ca3dd7b | reviewed-scoped-no-additional-obvious-defect |
| 165 | b84dd6a488247b918e76-e58cd6518d895a8da5f3/chromium/0 #1 | dark / s / pressed / tonal | 644×134 | 147722f186e15539f079e2be6af102b2a90cadad2f0f0b50889965607aced09b | reviewed-scoped-no-additional-obvious-defect |
| 166 | b84dd6a488247b918e76-e58cd6518d895a8da5f3/chromium/0 #2 | dark / s / pressed / outlined | 644×134 | 8254f3855f908d09097a3ad5ae0ad7e5478f2e8084183a46a22d763c302abe7e | reviewed-scoped-no-additional-obvious-defect |
| 167 | b84dd6a488247b918e76-e58cd6518d895a8da5f3/chromium/0 #3 | dark / s / pressed / text | 644×134 | 118a593a7caadbc294669398d3d22fb5f623d284c7b954c385db82469fc6ba3e | reviewed-scoped-no-additional-obvious-defect |
| 168 | b84dd6a488247b918e76-e58cd6518d895a8da5f3/chromium/0 #4 | dark / s / pressed / elevated | 644×134 | c72af696c598f40a07b8b3771f5b558f28ab0d06db93c22df53ca367b1723da3 | reviewed-scoped-no-additional-obvious-defect |
| 169 | b84dd6a488247b918e76-98c0d69dda9e0bb519c4/chromium/0 #0 | dark / s / disabled | 644×134 | cc64576a9af2f54fc3e41e3d4b503fdd9080ccfe49e14614867d1efaa5d64ad5 | reviewed-scoped-no-additional-obvious-defect |
| 170 | b84dd6a488247b918e76-042aed26b23ffb9868d8/chromium/0 #0 | dark / s / selected | 644×134 | 682d4e077031eb1d2893698d72ab9773efbb42eceae87e48021fa7186c4fa961 | reviewed-scoped-no-additional-obvious-defect |
| 171 | b84dd6a488247b918e76-e095e9423408ce3f9455/chromium/0 #0 | dark / s / unselected | 644×134 | a5d033ca9a95c63b92aae013449678e4a7a6a5f6f9ca92d8ed00e1a47abc1139 | reviewed-scoped-no-additional-obvious-defect |
| 172 | b84dd6a488247b918e76-7b7f471a4e936c761e1c/chromium/0 #0 | dark / s / variants | 644×374 | 359a2614888288e08c0e165b138eb31d97e3ca42659198c14ecde887a938ed04 | reviewed-scoped-no-additional-obvious-defect |
| 173 | b84dd6a488247b918e76-819e0f65e266747d3492/chromium/0 #0 | dark / m / default | 724×138 | 66acd99087b4178630408054237694405291b95fd56dd9050609da4c8763e172 | reviewed-scoped-no-additional-obvious-defect |
| 174 | b84dd6a488247b918e76-584cbac90bcb7ef11113/chromium/0 #0 | dark / m / hover / primary | 724×138 | a9f5e16774092c7113ba1b50eb14c3afa1cd407672bfe137f219d408ff1382e9 | reviewed-scoped-no-additional-obvious-defect |
| 175 | b84dd6a488247b918e76-584cbac90bcb7ef11113/chromium/0 #1 | dark / m / hover / tonal | 724×138 | 3edbf94f2880085fa19ebe35fda41ad705f77bee6ce8095f157e5a6eb329ddf0 | reviewed-scoped-no-additional-obvious-defect |
| 176 | b84dd6a488247b918e76-584cbac90bcb7ef11113/chromium/0 #2 | dark / m / hover / outlined | 724×138 | 2a8b8ed619f87fb3d42d544d05664e5ebd2be08418dcbdc6e19e243332eeb9b5 | reviewed-scoped-no-additional-obvious-defect |
| 177 | b84dd6a488247b918e76-584cbac90bcb7ef11113/chromium/0 #3 | dark / m / hover / text | 724×138 | 339e83cce9f2ff8cdc6a78741cdeb85e033b486acdbf82745bac3d283e3b22f1 | reviewed-scoped-no-additional-obvious-defect |
| 178 | b84dd6a488247b918e76-584cbac90bcb7ef11113/chromium/0 #4 | dark / m / hover / elevated | 724×138 | 5e2d0a508e9bd11f7fab156d18bca50b1fd5048177d5b87e520f22bae57c1462 | reviewed-scoped-no-additional-obvious-defect |
| 179 | b84dd6a488247b918e76-ea36d525787c211840ab/chromium/0 #0 | dark / m / focus-visible / primary | 724×138 | 66cea8dbdb4f2f5cf6f789d31ab550c40a1b59d6fa7f86984927f77689b0c76f | reviewed-scoped-no-additional-obvious-defect |
| 180 | b84dd6a488247b918e76-ea36d525787c211840ab/chromium/0 #1 | dark / m / focus-visible / tonal | 724×138 | 43a2bc903bfe7ce90dbe1c611ba21597c9f73c9ccaebc113f2df314bd264cc50 | reviewed-scoped-no-additional-obvious-defect |
| 181 | b84dd6a488247b918e76-ea36d525787c211840ab/chromium/0 #2 | dark / m / focus-visible / outlined | 724×138 | 3f05d764da5e118a22cbc5c28107179845905b1a79f2de1f664db7016e9d9f43 | reviewed-scoped-no-additional-obvious-defect |
| 182 | b84dd6a488247b918e76-ea36d525787c211840ab/chromium/0 #3 | dark / m / focus-visible / text | 724×138 | b62dc45a0e3e3c88bb4d76fec1cbf70f61e47dc7a7f4e3f3805713a26069e6c3 | reviewed-scoped-no-additional-obvious-defect |
| 183 | b84dd6a488247b918e76-ea36d525787c211840ab/chromium/0 #4 | dark / m / focus-visible / elevated | 724×138 | eaff5d07a671076bc6b276379bb8e6dbb07866261f30f3db20cfce3e697fcec4 | reviewed-scoped-no-additional-obvious-defect |
| 184 | b84dd6a488247b918e76-7860d7e437495bcef852/chromium/0 #0 | dark / m / pressed / primary | 724×138 | 7bce6df70e7ef88f24c516a2680c7d73af1139d516cbc2fe75fa836bfd3fd77d | reviewed-scoped-no-additional-obvious-defect |
| 185 | b84dd6a488247b918e76-7860d7e437495bcef852/chromium/0 #1 | dark / m / pressed / tonal | 724×138 | 8b5e0ca80b304a4cc70cb927dda3334e6de12465a1ee75045a026152606f6c3d | reviewed-scoped-no-additional-obvious-defect |
| 186 | b84dd6a488247b918e76-7860d7e437495bcef852/chromium/0 #2 | dark / m / pressed / outlined | 724×138 | 6252cf31eafb2d4bf265fe7e9cd3ae81325cdf64fe06c25e7e54bae19e6f2b0a | reviewed-scoped-no-additional-obvious-defect |
| 187 | b84dd6a488247b918e76-7860d7e437495bcef852/chromium/0 #3 | dark / m / pressed / text | 724×138 | 47520f722d5e21559521611693359ce0c6f05f47a678a14607867bb8c7f0e4c7 | reviewed-scoped-no-additional-obvious-defect |
| 188 | b84dd6a488247b918e76-7860d7e437495bcef852/chromium/0 #4 | dark / m / pressed / elevated | 724×138 | 9300f0d6d4dff5352b35ce926f04d2849c2899f1486c7bc891f784022f3b4ec3 | reviewed-scoped-no-additional-obvious-defect |
| 189 | b84dd6a488247b918e76-3effb4ad6ed568fb3b6d/chromium/0 #0 | dark / m / disabled | 724×138 | 37094b2715480c5bf57e737c8ee4e6a2aa575807e16ab3931dad2f9702ea9a0c | reviewed-scoped-no-additional-obvious-defect |
| 190 | b84dd6a488247b918e76-35bac1b8d6ac08519796/chromium/0 #0 | dark / m / selected | 724×138 | 3d6b672c6877f6e6ccedc8a13d13a06386ee6c0c9af77337d9a01d4cfe6f806e | reviewed-scoped-no-additional-obvious-defect |
| 191 | b84dd6a488247b918e76-4120859c3f28a3e87b1e/chromium/0 #0 | dark / m / unselected | 724×138 | 24928af6a43a36798a397086982a9bb630de16e3ce5764256a85da0a37418cbe | reviewed-scoped-no-additional-obvious-defect |
| 192 | b84dd6a488247b918e76-8c82d0654235acf64f59/chromium/0 #0 | dark / m / variants | 724×394 | c9deca167b5ee50350caa38b873910cedde350ba00ba4b5980057f078858ea3a | reviewed-scoped-no-additional-obvious-defect |
| 193 | b84dd6a488247b918e76-294988716228178d966f/chromium/0 #0 | dark / l / default | 782×146 | e2800e92bc9b67d26425041803a3645a69c8233e68f907df98f464d1462ebeec | reviewed-scoped-no-additional-obvious-defect |
| 194 | b84dd6a488247b918e76-8387a0548ab255c9c75a/chromium/0 #0 | dark / l / hover / primary | 782×146 | 3023e609831dba5b6bf80032e1861b3ff17c642fc410fc14a0ed6d4678ebb9fa | reviewed-scoped-no-additional-obvious-defect |
| 195 | b84dd6a488247b918e76-8387a0548ab255c9c75a/chromium/0 #1 | dark / l / hover / tonal | 782×146 | f2b6fe5b8029b3d79605a33b13d22584e7cb98f66e830afe1d00d3ff20aa46f7 | reviewed-scoped-no-additional-obvious-defect |
| 196 | b84dd6a488247b918e76-8387a0548ab255c9c75a/chromium/0 #2 | dark / l / hover / outlined | 782×146 | 2301cdd4e798a271c10c6886ff9f60b3455a8cfca2b5182433902b0f7b14ef34 | reviewed-scoped-no-additional-obvious-defect |
| 197 | b84dd6a488247b918e76-8387a0548ab255c9c75a/chromium/0 #3 | dark / l / hover / text | 782×146 | fe87b7a5e7a994cf11b7d5c5474c91292b45f3d7ea0c699047fa8d2963c54060 | reviewed-scoped-no-additional-obvious-defect |
| 198 | b84dd6a488247b918e76-8387a0548ab255c9c75a/chromium/0 #4 | dark / l / hover / elevated | 782×146 | d972ddac84584bd2ba42fb28da1e050011d38f8e09b13abb479b401e740fd94a | reviewed-scoped-no-additional-obvious-defect |
| 199 | b84dd6a488247b918e76-4fb2936ffcf79a092d4f/chromium/0 #0 | dark / l / focus-visible / primary | 782×146 | 1da08d01bee6b824e368dd9a5393bfd7b9821bae85dab0998ec352534dcc2398 | reviewed-scoped-no-additional-obvious-defect |
| 200 | b84dd6a488247b918e76-4fb2936ffcf79a092d4f/chromium/0 #1 | dark / l / focus-visible / tonal | 782×146 | ecc8d6af884ab784bbb2fc32cd8192c750e95d15f881d35f41eeec71be42406a | reviewed-scoped-no-additional-obvious-defect |
| 201 | b84dd6a488247b918e76-4fb2936ffcf79a092d4f/chromium/0 #2 | dark / l / focus-visible / outlined | 782×146 | 5ae6f583b86305d1055055bbf2e27d71000082c3881f06752dd3e809ab47bc5e | reviewed-scoped-no-additional-obvious-defect |
| 202 | b84dd6a488247b918e76-4fb2936ffcf79a092d4f/chromium/0 #3 | dark / l / focus-visible / text | 782×146 | df0286d6a478fed1fcd1c347c631f6e900230429599773b814421754e7bbb54a | reviewed-scoped-no-additional-obvious-defect |
| 203 | b84dd6a488247b918e76-4fb2936ffcf79a092d4f/chromium/0 #4 | dark / l / focus-visible / elevated | 782×146 | ac6558866cef3672360e28f6ed927082cce09b70c6c2e5616ab0966d9468a20f | reviewed-scoped-no-additional-obvious-defect |
| 204 | b84dd6a488247b918e76-62338e04daa6312709e9/chromium/0 #0 | dark / l / pressed / primary | 782×146 | e59c43ba78f02a9077598ab85f8d27bbf33a64a3e5293913345ff3ef753fdfad | reviewed-scoped-no-additional-obvious-defect |
| 205 | b84dd6a488247b918e76-62338e04daa6312709e9/chromium/0 #1 | dark / l / pressed / tonal | 782×146 | efc0d90f983a32d607e05112958f6929d45474ad16979f5391e4756496af6bf8 | reviewed-scoped-no-additional-obvious-defect |
| 206 | b84dd6a488247b918e76-62338e04daa6312709e9/chromium/0 #2 | dark / l / pressed / outlined | 782×146 | 1b66581895c6f985f3d89b37767ddf823c3354896ac15b920d842bf86a9cc772 | reviewed-scoped-no-additional-obvious-defect |
| 207 | b84dd6a488247b918e76-62338e04daa6312709e9/chromium/0 #3 | dark / l / pressed / text | 782×146 | bcee206bf3442a2c795d6d15cb09d6c176f60982e8d0fd22b32f353a9ab15476 | reviewed-scoped-no-additional-obvious-defect |
| 208 | b84dd6a488247b918e76-62338e04daa6312709e9/chromium/0 #4 | dark / l / pressed / elevated | 782×146 | b7da5c05d5f0c07919d2220d0cda15051a8a01f5592daf00ff660afba7c1aeff | reviewed-scoped-no-additional-obvious-defect |
| 209 | b84dd6a488247b918e76-3bf7b7048eedb2ef1b31/chromium/0 #0 | dark / l / disabled | 782×146 | f01304b35c98badbd4f3a4fcc71682981b31d13e5e793b71160f84d5c85e01d7 | reviewed-scoped-no-additional-obvious-defect |
| 210 | b84dd6a488247b918e76-0f2efdcd77aec503a014/chromium/0 #0 | dark / l / selected | 782×146 | efc835f0dc64a9e42792cbbfa2875140855e67a8617bbba6b3783d1f8586bc0a | reviewed-scoped-no-additional-obvious-defect |
| 211 | b84dd6a488247b918e76-7b0606d80272c904ce52/chromium/0 #0 | dark / l / unselected | 782×146 | eaa2cd34a40763d877b73dd3a9f7779186140087dda8cca0800ad0f30e954d3c | reviewed-scoped-no-additional-obvious-defect |
| 212 | b84dd6a488247b918e76-701075e65b60a0fe15ee/chromium/0 #0 | dark / l / variants | 782×434 | f93bb9ec51305a51ea7c42deb899ba1237e11513b75def39cf396dbebef529e5 | reviewed-scoped-no-additional-obvious-defect |
| 213 | b84dd6a488247b918e76-83633ef94fb85745cd85/chromium/0 #0 | dark / xl / default | 920×154 | ba9992ef2e6631c97fd51a7ef7afe93c0d78f2f4e0a11f7b686c2aae5cf912c9 | reviewed-scoped-no-additional-obvious-defect |
| 214 | b84dd6a488247b918e76-975bc6cf8719a27a9761/chromium/0 #0 | dark / xl / hover / primary | 920×154 | d02fe4f6820d79cf40eade5789e1eb61bcf503f238224f638dc2537053f4b5de | reviewed-scoped-no-additional-obvious-defect |
| 215 | b84dd6a488247b918e76-975bc6cf8719a27a9761/chromium/0 #1 | dark / xl / hover / tonal | 920×154 | f2b8116c8bb0661415ec8be50ec185f50b8e97be746a4f0f53f9164fd1bdef26 | reviewed-scoped-no-additional-obvious-defect |
| 216 | b84dd6a488247b918e76-975bc6cf8719a27a9761/chromium/0 #2 | dark / xl / hover / outlined | 920×154 | 0d7d634d074a838cee7b60fb063287b4e1e628dbd56f64eb7c857e08fa55b60f | reviewed-scoped-no-additional-obvious-defect |
| 217 | b84dd6a488247b918e76-975bc6cf8719a27a9761/chromium/0 #3 | dark / xl / hover / text | 920×154 | 8d226db84770977640a0e9c93b69dc9c4b7654b4c4a5eadb2239b108c50805bb | reviewed-scoped-no-additional-obvious-defect |
| 218 | b84dd6a488247b918e76-975bc6cf8719a27a9761/chromium/0 #4 | dark / xl / hover / elevated | 920×154 | 5a90c3459e4ebce5fdd3df91ec8f7344ca4b38d23b6062925e92e182b806e52a | reviewed-scoped-no-additional-obvious-defect |
| 219 | b84dd6a488247b918e76-51a38b446a1add9283ed/chromium/0 #0 | dark / xl / focus-visible / primary | 920×154 | 0a36ecc5b25425257859df58853a12ac91305705f661c5d197a43884ff9529db | reviewed-scoped-no-additional-obvious-defect |
| 220 | b84dd6a488247b918e76-51a38b446a1add9283ed/chromium/0 #1 | dark / xl / focus-visible / tonal | 920×154 | a7c0d95865ae77e29ee7395c58b96b251d3b37b597075ea736ae7a2834e995c8 | reviewed-scoped-no-additional-obvious-defect |
| 221 | b84dd6a488247b918e76-51a38b446a1add9283ed/chromium/0 #2 | dark / xl / focus-visible / outlined | 920×154 | 7b77fe6cfd31f9d7531d5595ff8bc643d3cf65650922f123b3d761fab5a61fb9 | reviewed-scoped-no-additional-obvious-defect |
| 222 | b84dd6a488247b918e76-51a38b446a1add9283ed/chromium/0 #3 | dark / xl / focus-visible / text | 920×154 | 348d4f25595a2d3aad667de931c763871fb51fca91e43f273a319ea7674ee5e8 | reviewed-scoped-no-additional-obvious-defect |
| 223 | b84dd6a488247b918e76-51a38b446a1add9283ed/chromium/0 #4 | dark / xl / focus-visible / elevated | 920×154 | 73152808dfe724d247cb2cb793851daf5790487b20ff96ee7915463efa8fd365 | reviewed-scoped-no-additional-obvious-defect |
| 224 | b84dd6a488247b918e76-631a0e49e251038eea43/chromium/0 #0 | dark / xl / pressed / primary | 920×154 | 78721bf968795b530ab6a9513e5993b8537b4dd60fc8dad1ee07362c534d5d9e | reviewed-scoped-no-additional-obvious-defect |
| 225 | b84dd6a488247b918e76-631a0e49e251038eea43/chromium/0 #1 | dark / xl / pressed / tonal | 920×154 | 4a54a904f132a078d9e7334c9d3ad9dcbd028a4e6ace165957eba4efbbd628e1 | reviewed-scoped-no-additional-obvious-defect |
| 226 | b84dd6a488247b918e76-631a0e49e251038eea43/chromium/0 #2 | dark / xl / pressed / outlined | 920×154 | 9b6699ca6230e6860438fd61433ae616f2146e0b16bfba309c9c89ba80d2b08e | reviewed-scoped-no-additional-obvious-defect |
| 227 | b84dd6a488247b918e76-631a0e49e251038eea43/chromium/0 #3 | dark / xl / pressed / text | 920×154 | 13f5620f93f5537099f8110ceee65e565bb3678e42b07e20ad35c331a315efef | reviewed-scoped-no-additional-obvious-defect |
| 228 | b84dd6a488247b918e76-631a0e49e251038eea43/chromium/0 #4 | dark / xl / pressed / elevated | 920×154 | 2bd9399271dade6214c3ff12b69f0eec7e34349f70b85b6b0ddac25d1933b15c | reviewed-scoped-no-additional-obvious-defect |
| 229 | b84dd6a488247b918e76-a118244e5fe0e5bae008/chromium/0 #0 | dark / xl / disabled | 920×154 | cb9e0651e6debe5a9ddb3a9cf5d5aae587464de3b6c72aeb5a6e1340bfbeb4f6 | reviewed-scoped-no-additional-obvious-defect |
| 230 | b84dd6a488247b918e76-7b9fbd2ebbf25e3b3570/chromium/0 #0 | dark / xl / selected | 920×154 | 088087f5d9a86cc3bb96112faf817eed765c731d473ef698ce57e5cac67ccebc | reviewed-scoped-no-additional-obvious-defect |
| 231 | b84dd6a488247b918e76-85f41e0e3fb419ee6aac/chromium/0 #0 | dark / xl / unselected | 920×154 | 52da0a564a5b28fb635e8be15d2b747fdace1874975122f7ed405cfa42b70b02 | reviewed-scoped-no-additional-obvious-defect |
| 232 | b84dd6a488247b918e76-e5c372854efdd6a9bdee/chromium/0 #0 | dark / xl / variants | 920×474 | e18421aa74cda66ea908ca6d771cc8599032f44d8eb4f397fbaae61590093cdf | reviewed-scoped-no-additional-obvious-defect |
| 233 | 73019a0006cb75aa6498-80a248955a56e72196e8/chromium/0 #0 | light / medium / inventory-scope | 1280×720 | a05a2a40b391e354a9d611bd3d74d396f9d68f8efdc1ca3407ac22708181d070 | reviewed-shape-parity-finding-not-accepted |
| 234 | 73019a0006cb75aa6498-a40cb8066323511b1608/chromium/0 #0 | dark / medium / inventory-scope | 1280×720 | 7b957f1122521d693b597882db9375fa08cc1c0c52e9951d825da44bebc9a04e | reviewed-shape-parity-finding-not-accepted |

## 1. light · s · narrow

Case：5e7cfde592acf3410c62-b1e2b2935f6c9b7ca907/chromium/0 #0；[原图](screens/rc-button/chromium/000037-0-screenshot.png)；SHA-256：b13875affccf8db46dccb692a98e9a52adc90a9ca9c44b3b0780b15f3aa60608；320×768。

来源：inputs-worker-5.json；原生结果：failed；复审结论：reviewed-known-failure-not-accepted。

- 已单独打开并查看这张 320×768 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 320px 失败原图中标准按钮已换行，但 compatibility 行右侧 subtle 和底部 shouldFitContainer 长按钮超出可见右边界；保留为未接受失败。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。
- 根代理已在宿主调整 Demo minmax 轨道，本旧图不包含修复，不能把宿主改动当成旧图通过。

## 2. light · s · tablet

Case：5e7cfde592acf3410c62-d075f87cf94caf9305bf/chromium/0 #0；[原图](screens/rc-button/chromium/000038-1-actual.png)；SHA-256：1a2775d9b1913c0b482198d6d1af4b0fc54319c1a6d999be7cf7de71f1b9fa59；644×374。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×374 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 3. light · s · desktop

Case：5e7cfde592acf3410c62-c2833bf6c0dafd656457/chromium/0 #0；[原图](screens/rc-button/chromium/000039-1-actual.png)；SHA-256：559adce6b34336091ff6b966c96ce030ee1138dc2cf326551d5fe817f8eea7bd；644×374。

来源：inputs-worker-6.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×374 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 4. light · s · touch

Case：5e7cfde592acf3410c62-a33263492fa8a5ad7ced/chromium/0 #0；[原图](screens/rc-button/chromium/000040-1-actual.png)；SHA-256：1a2775d9b1913c0b482198d6d1af4b0fc54319c1a6d999be7cf7de71f1b9fa59；644×374。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×374 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 5. light · s · rtl

Case：5e7cfde592acf3410c62-bb5f5c6e1f572953532b/chromium/0 #0；[原图](screens/rc-button/chromium/000041-1-actual.png)；SHA-256：c53846277edaa6ca0a41171be34d1cc81fc5efd7af2a3d4d50681f2a8102ddff；644×374。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×374 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。
- 实际画面中行序、前后图标与 RTL 排列已反转，文字仍可辨识。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 6. light · s · english

Case：5e7cfde592acf3410c62-4799a152e25443eaddd1/chromium/0 #0；[原图](screens/rc-button/chromium/000042-1-actual.png)；SHA-256：3cd38a18c5873c3efb190f3ffea176a21325681362c16eaea9ac891614cbb9b2；618×374。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 618×374 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。
- 标准动作与危险动作显示英文标签；长 fit 按钮保留原本的中英并列文字。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 7. light · s · brand

Case：5e7cfde592acf3410c62-6fe64082364883792267/chromium/0 #0；[原图](screens/rc-button/chromium/000043-1-actual.png)；SHA-256：c0d65dff1813305ea2dd7bfce49b8a1ddd46d21516b8eb46b3320fbd3a4a9cfe；644×374。

来源：inputs-worker-6.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×374 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。
- 品牌色反映于主/tonal/低强调动作，危险操作仍保持独立反馈色。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 8. light · s · forced-colors

Case：5e7cfde592acf3410c62-a6df7d2ab51d6ac51242/chromium/0 #0；[原图](screens/rc-button/chromium/000044-1-actual.png)；SHA-256：8a99eefaba5acf06d778fb5e887b9bcc41ae037c27eff4bd09cdb2588983269a；644×374。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×374 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。
- 系统配色下实际呈现清楚的实线轮廓与文字；此帧不沿用普通主题的弱边界判断。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 9. light · s · reduced-motion

Case：5e7cfde592acf3410c62-57924095669d39aba764/chromium/0 #0；[原图](screens/rc-button/chromium/000045-1-actual.png)；SHA-256：d2db80b9ea18c766b70a107788bc66996f0f7faa44e76062492e188a5d7bcbf7；644×374。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×374 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 10. dark · s · narrow

Case：5e7cfde592acf3410c62-cfd68ee975d720dadf5d/chromium/0 #0；[原图](screens/rc-button/chromium/000046-0-screenshot.png)；SHA-256：74e3e5e69761bb427a851dc9632c40cdb880b4e91837571e23ba8f613a1e4302；320×768。

来源：inputs-worker-6.json；原生结果：failed；复审结论：reviewed-known-failure-not-accepted。

- 已单独打开并查看这张 320×768 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 320px 失败原图中标准按钮已换行，但 compatibility 行右侧 subtle 和底部 shouldFitContainer 长按钮超出可见右边界；保留为未接受失败。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。
- 根代理已在宿主调整 Demo minmax 轨道，本旧图不包含修复，不能把宿主改动当成旧图通过。

## 11. dark · s · tablet

Case：5e7cfde592acf3410c62-30900dbac8990ad0b8a2/chromium/0 #0；[原图](screens/rc-button/chromium/000047-1-actual.png)；SHA-256：86717a2608e3a1d7c8b9723f9569161bf4015610e7bd5b6e7e8911578e751f5d；644×374。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×374 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 12. dark · s · desktop

Case：5e7cfde592acf3410c62-71e65e8779ccd8523046/chromium/0 #0；[原图](screens/rc-button/chromium/000048-1-actual.png)；SHA-256：ceddd4c4d9086596b84d378517583b26c2362da1b6b18c1ca4eb14a03ee3ac06；644×374。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×374 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 13. dark · s · touch

Case：5e7cfde592acf3410c62-9eba55b9cbd5b9a98044/chromium/0 #0；[原图](screens/rc-button/chromium/000049-1-actual.png)；SHA-256：86717a2608e3a1d7c8b9723f9569161bf4015610e7bd5b6e7e8911578e751f5d；644×374。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×374 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 14. dark · s · rtl

Case：5e7cfde592acf3410c62-677d4183a41e30b29d24/chromium/0 #0；[原图](screens/rc-button/chromium/000050-1-actual.png)；SHA-256：1e43502c8ea2ee931a50799d42c3940dd288ebeacefdf966fb5e251d6a8ca92e；644×374。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×374 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。
- 实际画面中行序、前后图标与 RTL 排列已反转，文字仍可辨识。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 15. dark · s · english

Case：5e7cfde592acf3410c62-1a7d0cae7e7e160382aa/chromium/0 #0；[原图](screens/rc-button/chromium/000051-1-actual.png)；SHA-256：d67f4a491217414661d9e58477b6eef02031bc082fc1f42ca427ec92aa9a1329；618×374。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 618×374 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。
- 标准动作与危险动作显示英文标签；长 fit 按钮保留原本的中英并列文字。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 16. dark · s · brand

Case：5e7cfde592acf3410c62-51ab7419986d63dd4234/chromium/0 #0；[原图](screens/rc-button/chromium/000052-1-actual.png)；SHA-256：c4a147b62b8ed5502e2c610f3e2637c2001daac186c4f7a4b2d8ae28863856ce；644×374。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×374 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。
- 品牌色反映于主/tonal/低强调动作，危险操作仍保持独立反馈色。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 17. dark · s · forced-colors

Case：5e7cfde592acf3410c62-5003c3cb105d9f1fc96c/chromium/0 #0；[原图](screens/rc-button/chromium/000053-1-actual.png)；SHA-256：0de139da869731d67ce8efc5ead0358e03fbcadb856c85b5bae0f8153b0287e3；644×374。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×374 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。
- 系统配色下实际呈现清楚的实线轮廓与文字；此帧不沿用普通主题的弱边界判断。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 18. dark · s · reduced-motion

Case：5e7cfde592acf3410c62-3b7dc2a5e3f2b02625ab/chromium/0 #0；[原图](screens/rc-button/chromium/000054-1-actual.png)；SHA-256：26dc0b63bdd6945c76570cf03e0b19b4f20a8d0f79867c94e0eb6b62ab6fac7c；644×374。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×374 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 19. light · xs · loading

Case：5b862e7b8dcfc4db17c8-c8bdacf4380355436232/chromium/0 #0；[原图](screens/rc-button/chromium/000075-1-motion-actual.png)；SHA-256：c346c253111e3698935178fc4a552daa5d190855c4f79331a5bf19f56bcab928；656×33。

来源：inputs-worker-11.json；原生结果：passed；复审结论：reviewed-natural-static-frame-video-separate。

- 已单独打开并查看这张 656×33 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观均可见标签与左侧加载弧线，当前相位未见图形遮盖文字或标签裁切；此处仅查看自然 PNG，视频由根代理另核。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。
- 本张自然帧已看；此审查未播放视频，不将单帧、相位或原生 primary 动效观察推广为所有按钮的时间序列外观通过。

## 20. light · s · loading

Case：5b862e7b8dcfc4db17c8-1415b60ab6cf58dba205/chromium/0 #0；[原图](screens/rc-button/chromium/000076-1-motion-actual.png)；SHA-256：d654b06142024a5f9bee758a5bc9844b4140cff626e4d7673c25d387b081e9e9；706×37。

来源：inputs-worker-13.json；原生结果：passed；复审结论：reviewed-natural-static-frame-video-separate。

- 已单独打开并查看这张 706×37 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观均可见标签与左侧加载弧线，当前相位未见图形遮盖文字或标签裁切；此处仅查看自然 PNG，视频由根代理另核。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。
- 本张自然帧已看；此审查未播放视频，不将单帧、相位或原生 primary 动效观察推广为所有按钮的时间序列外观通过。

## 21. light · m · loading

Case：5b862e7b8dcfc4db17c8-38432db64b6b9a0c8c1c/chromium/0 #0；[原图](screens/rc-button/chromium/000077-1-motion-actual.png)；SHA-256：3761d8bd75976679307db2b62c4b580efe8c23bbfb00377185e8cf822d8dcf47；786×41。

来源：inputs-worker-12.json；原生结果：passed；复审结论：reviewed-natural-static-frame-video-separate。

- 已单独打开并查看这张 786×41 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观均可见标签与左侧加载弧线，当前相位未见图形遮盖文字或标签裁切；此处仅查看自然 PNG，视频由根代理另核。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。
- 本张自然帧已看；此审查未播放视频，不将单帧、相位或原生 primary 动效观察推广为所有按钮的时间序列外观通过。

## 22. light · l · loading

Case：5b862e7b8dcfc4db17c8-090aa7c8354df66c01ec/chromium/0 #0；[原图](screens/rc-button/chromium/000078-1-motion-actual.png)；SHA-256：eda4cf0467d8acfa68c77638bd828bb1bfa61c55272e23a06b3747b466bb3c19；854×49。

来源：inputs-worker-10.json；原生结果：passed；复审结论：reviewed-natural-static-frame-video-separate。

- 已单独打开并查看这张 854×49 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观均可见标签与左侧加载弧线，当前相位未见图形遮盖文字或标签裁切；此处仅查看自然 PNG，视频由根代理另核。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。
- 本张自然帧已看；此审查未播放视频，不将单帧、相位或原生 primary 动效观察推广为所有按钮的时间序列外观通过。

## 23. light · xl · loading

Case：5b862e7b8dcfc4db17c8-5ab92519e6619470937a/chromium/0 #0；[原图](screens/rc-button/chromium/000079-1-motion-actual.png)；SHA-256：76ef72434dfcee0ed791526c98bfb7779edffda72e03c9bfa588dcb3c1cb641a；1002×57。

来源：inputs-worker-11.json；原生结果：passed；复审结论：reviewed-natural-static-frame-video-separate。

- 已单独打开并查看这张 1002×57 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观均可见标签与左侧加载弧线，当前相位未见图形遮盖文字或标签裁切；此处仅查看自然 PNG，视频由根代理另核。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。
- 本张自然帧已看；此审查未播放视频，不将单帧、相位或原生 primary 动效观察推广为所有按钮的时间序列外观通过。

## 24. dark · xs · loading

Case：5b862e7b8dcfc4db17c8-1cfb5bb25e3f1cc3ba1e/chromium/0 #0；[原图](screens/rc-button/chromium/000080-1-motion-actual.png)；SHA-256：36d68993cf54e1129f1669b2cea9aa5f14e4b10b21ed5556bb2f21686ab81a05；656×33。

来源：inputs-worker-13.json；原生结果：passed；复审结论：reviewed-natural-static-frame-video-separate。

- 已单独打开并查看这张 656×33 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观均可见标签与左侧加载弧线，当前相位未见图形遮盖文字或标签裁切；此处仅查看自然 PNG，视频由根代理另核。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。
- 本张自然帧已看；此审查未播放视频，不将单帧、相位或原生 primary 动效观察推广为所有按钮的时间序列外观通过。

## 25. dark · s · loading

Case：5b862e7b8dcfc4db17c8-a175d393daaf0060ead9/chromium/0 #0；[原图](screens/rc-button/chromium/000081-1-motion-actual.png)；SHA-256：6c726f6744997970f228c520e4de2b46cc9c20ee57b818a4e578189934298e5f；706×37。

来源：inputs-worker-12.json；原生结果：passed；复审结论：reviewed-natural-static-frame-video-separate。

- 已单独打开并查看这张 706×37 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观均可见标签与左侧加载弧线，当前相位未见图形遮盖文字或标签裁切；此处仅查看自然 PNG，视频由根代理另核。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。
- 本张自然帧已看；此审查未播放视频，不将单帧、相位或原生 primary 动效观察推广为所有按钮的时间序列外观通过。

## 26. dark · m · loading

Case：5b862e7b8dcfc4db17c8-0f399080db723505fbf2/chromium/0 #0；[原图](screens/rc-button/chromium/000082-1-motion-actual.png)；SHA-256：40f8eee10d8806d67f504b8cee31127bea563eb0064745bdffa5c5b7c3ee95df；786×41。

来源：inputs-worker-10.json；原生结果：passed；复审结论：reviewed-natural-static-frame-video-separate。

- 已单独打开并查看这张 786×41 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观均可见标签与左侧加载弧线，当前相位未见图形遮盖文字或标签裁切；此处仅查看自然 PNG，视频由根代理另核。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。
- 本张自然帧已看；此审查未播放视频，不将单帧、相位或原生 primary 动效观察推广为所有按钮的时间序列外观通过。

## 27. dark · l · loading

Case：5b862e7b8dcfc4db17c8-b1ca0ff28c2535253e19/chromium/0 #0；[原图](screens/rc-button/chromium/000083-1-motion-actual.png)；SHA-256：2fa2278a14594b6be6fa8112817869e80729ecd8cdb6caf63c2e872606f403bc；854×49。

来源：inputs-worker-11.json；原生结果：passed；复审结论：reviewed-natural-static-frame-video-separate。

- 已单独打开并查看这张 854×49 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观均可见标签与左侧加载弧线，当前相位未见图形遮盖文字或标签裁切；此处仅查看自然 PNG，视频由根代理另核。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。
- 本张自然帧已看；此审查未播放视频，不将单帧、相位或原生 primary 动效观察推广为所有按钮的时间序列外观通过。

## 28. dark · xl · loading

Case：5b862e7b8dcfc4db17c8-61a8591c687fc7a263d6/chromium/0 #0；[原图](screens/rc-button/chromium/000084-1-motion-actual.png)；SHA-256：0930e96a8ef563aa327aff4c134a0c175cbb3a8b5e0652f5b284892aa657c89d；1002×57。

来源：inputs-worker-13.json；原生结果：passed；复审结论：reviewed-natural-static-frame-video-separate。

- 已单独打开并查看这张 1002×57 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观均可见标签与左侧加载弧线，当前相位未见图形遮盖文字或标签裁切；此处仅查看自然 PNG，视频由根代理另核。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。
- 本张自然帧已看；此审查未播放视频，不将单帧、相位或原生 primary 动效观察推广为所有按钮的时间序列外观通过。

## 29. light · s · zoom-200

Case：e0615b692a3cbec88509-48aec40d2200fc7a6571/chromium/0 #0；[原图](screens/rc-button/chromium/000089-2-actual-zoom-200.png)；SHA-256：501c6dbf4bd8a62f2845995efc45f5382e50778b00776e51bd1ea4f30ec14a2a；1280×813。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 1280×813 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 真实 200% 的完整可见窗口中，标准按钮换行；形状/图标、危险操作、compatibility dashed/subtle 与长 fit 按钮可见，主操作带可见焦点环。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。
- 此处仅两次 s/variants 可见窗口捕获，未覆盖所有命名尺寸与状态的 200% 交叉组合；相同窗口无需假造滚动。

## 30. light · s · zoom-200

Case：e0615b692a3cbec88509-48aec40d2200fc7a6571/chromium/0 #1；[原图](screens/rc-button/chromium/000089-4-actual-zoom-200.png)；SHA-256：7ed22959585aa1a8d50e647d0ba0b621980490ffa469e99b931180b6f98932c8；1280×813。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 1280×813 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 真实 200% 的完整可见窗口中，标准按钮换行；形状/图标、危险操作、compatibility dashed/subtle 与长 fit 按钮可见，主操作带可见焦点环。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。
- 此处仅两次 s/variants 可见窗口捕获，未覆盖所有命名尺寸与状态的 200% 交叉组合；相同窗口无需假造滚动。

## 31. dark · s · zoom-200

Case：e0615b692a3cbec88509-d5c54fc748740664280c/chromium/0 #0；[原图](screens/rc-button/chromium/000090-2-actual-zoom-200.png)；SHA-256：427fb25df214b7166fcdb3efcd07eb97746d5f9d07d9f57b402fd224a3fe1a31；1280×813。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 1280×813 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 真实 200% 的完整可见窗口中，标准按钮换行；形状/图标、危险操作、compatibility dashed/subtle 与长 fit 按钮可见，主操作带可见焦点环。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。
- 此处仅两次 s/variants 可见窗口捕获，未覆盖所有命名尺寸与状态的 200% 交叉组合；相同窗口无需假造滚动。

## 32. dark · s · zoom-200

Case：e0615b692a3cbec88509-d5c54fc748740664280c/chromium/0 #1；[原图](screens/rc-button/chromium/000090-4-actual-zoom-200.png)；SHA-256：40a1a421c1007d275239a16c10a3b11606fce7b0ad40a67c0487a6a7c4ded375；1280×813。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 1280×813 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 真实 200% 的完整可见窗口中，标准按钮换行；形状/图标、危险操作、compatibility dashed/subtle 与长 fit 按钮可见，主操作带可见焦点环。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。
- 此处仅两次 s/variants 可见窗口捕获，未覆盖所有命名尺寸与状态的 200% 交叉组合；相同窗口无需假造滚动。

## 33. light · xs · default

Case：b84dd6a488247b918e76-e3a22af3de09e47ece28/chromium/0 #0；[原图](screens/rc-button/chromium/000251-2-actual.png)；SHA-256：76db48edd9f4eff0447e0cc3574ed822b8bb9a425f705e025381df9349ff8c50；604×130。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 34. light · xs · hover · primary

Case：b84dd6a488247b918e76-3e0adc0fcb48b5e261d6/chromium/0 #0；[原图](screens/rc-button/chromium/000252-2-actual.png)；SHA-256：1bc8a3afc79cb9ee7109d50719e5635bbc3189d88150a08c5f5a573471d3bbab；604×130。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 35. light · xs · hover · tonal

Case：b84dd6a488247b918e76-3e0adc0fcb48b5e261d6/chromium/0 #1；[原图](screens/rc-button/chromium/000252-5-actual.png)；SHA-256：1b2e9534cd802e45502910ab9168f4dbf841693b35e254db0faaafaaf04ba43c；604×130。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 36. light · xs · hover · outlined

Case：b84dd6a488247b918e76-3e0adc0fcb48b5e261d6/chromium/0 #2；[原图](screens/rc-button/chromium/000252-8-actual.png)；SHA-256：04ef3d869e468521bd7ba33ea00bb5f84063d3f2c19ec9bb024a2dc368fad075；604×130。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 37. light · xs · hover · text

Case：b84dd6a488247b918e76-3e0adc0fcb48b5e261d6/chromium/0 #3；[原图](screens/rc-button/chromium/000252-11-actual.png)；SHA-256：b15eba447b64fa9b28b25967daa262f797396ae71743d19883778254b2fd3f83；604×130。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 38. light · xs · hover · elevated

Case：b84dd6a488247b918e76-3e0adc0fcb48b5e261d6/chromium/0 #4；[原图](screens/rc-button/chromium/000252-14-actual.png)；SHA-256：adc6cd7b4447f168b70d8086eb619264c04c9c0ff05505cf8c34f85feb7e2706；604×130。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 39. light · xs · focus-visible · primary

Case：b84dd6a488247b918e76-49e73c3189101e394b23/chromium/0 #0；[原图](screens/rc-button/chromium/000253-2-actual.png)；SHA-256：5244cecb147f0a6831caa8d8f0adf6fc109600f4adf14ba876251f35ad1b4d15；604×130。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 40. light · xs · focus-visible · tonal

Case：b84dd6a488247b918e76-49e73c3189101e394b23/chromium/0 #1；[原图](screens/rc-button/chromium/000253-5-actual.png)；SHA-256：204fc948ace6248b0edcac6d0b85a178573e15ed31ff60d29294c59edff0fd7b；604×130。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 41. light · xs · focus-visible · outlined

Case：b84dd6a488247b918e76-49e73c3189101e394b23/chromium/0 #2；[原图](screens/rc-button/chromium/000253-8-actual.png)；SHA-256：802200288142b819eb368330d01083868d0e76339fc32a29c6f1ce29b90f58e4；604×130。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 42. light · xs · focus-visible · text

Case：b84dd6a488247b918e76-49e73c3189101e394b23/chromium/0 #3；[原图](screens/rc-button/chromium/000253-11-actual.png)；SHA-256：03cc5c7563b03b821b5513102edd2f0741be62df77d4f8e78d54fc9c6c0d05a6；604×130。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 43. light · xs · focus-visible · elevated

Case：b84dd6a488247b918e76-49e73c3189101e394b23/chromium/0 #4；[原图](screens/rc-button/chromium/000253-14-actual.png)；SHA-256：1772c6c73024d69e50153805899411fd6dc508b910503cbac135f28801879ec6；604×130。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 44. light · xs · pressed · primary

Case：b84dd6a488247b918e76-6b7b5c9725ba2d0d5185/chromium/0 #0；[原图](screens/rc-button/chromium/000254-2-actual.png)；SHA-256：8603ff5c3dd7bc300d72656febc6f5d42ac37ca1b33a654cb2ff6f22f923deca；604×130。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 45. light · xs · pressed · tonal

Case：b84dd6a488247b918e76-6b7b5c9725ba2d0d5185/chromium/0 #1；[原图](screens/rc-button/chromium/000254-5-actual.png)；SHA-256：5adf5167485a119e787b692e84079229070b7e26806d12df46d34b234416f576；604×130。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 46. light · xs · pressed · outlined

Case：b84dd6a488247b918e76-6b7b5c9725ba2d0d5185/chromium/0 #2；[原图](screens/rc-button/chromium/000254-8-actual.png)；SHA-256：010206dfb19cf4d995bc8fa58771d99e1b38cc2bf3a8dd847e1fb9e4f43b3dda；604×130。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 47. light · xs · pressed · text

Case：b84dd6a488247b918e76-6b7b5c9725ba2d0d5185/chromium/0 #3；[原图](screens/rc-button/chromium/000254-11-actual.png)；SHA-256：0d03544237cc57b1cf667ec62ff708c0aece6d09d87d668b06bb9a93c6212e25；604×130。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 48. light · xs · pressed · elevated

Case：b84dd6a488247b918e76-6b7b5c9725ba2d0d5185/chromium/0 #4；[原图](screens/rc-button/chromium/000254-14-actual.png)；SHA-256：6edb3379031bffa8eec630729a56ea3b45e50bae2923fd1260593da023afef60；604×130。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 49. light · xs · disabled

Case：b84dd6a488247b918e76-89a4d79b9d0ac88ee5ae/chromium/0 #0；[原图](screens/rc-button/chromium/000255-2-actual.png)；SHA-256：dd0becf73b6a8a033549109880220e1374780a4d2a05a6bc5494b06097d15fce；604×130。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观均明显减弱，标签和容器仍在；这是禁用静态外观，不从图像断言无法激活或使用普通态对比度门槛。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 50. light · xs · selected

Case：b84dd6a488247b918e76-711ee1721b751a979c66/chromium/0 #0；[原图](screens/rc-button/chromium/000256-2-actual.png)；SHA-256：aa78dff45d5ff94bc5160166698824cb4425413dbbb7546722680a3e76fa1cdf；604×130。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 可切换外观呈选中填充和配对文字；outlined 与未选中边界有清楚区别，Text 保持普通动作展示。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 51. light · xs · unselected

Case：b84dd6a488247b918e76-60cbea3886eda62cb868/chromium/0 #0；[原图](screens/rc-button/chromium/000257-2-actual.png)；SHA-256：43dd4a95e6c07713253cced3182522f638093ba6d7a41dae76efb47ad39135b3；604×130。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 可切换外观回到未选中展示；outlined 保留细边界，Text 保持普通动作展示。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 52. light · xs · variants

Case：b84dd6a488247b918e76-3812004319dedfcf43b8/chromium/0 #0；[原图](screens/rc-button/chromium/000258-2-actual.png)；SHA-256：ce02da7b81255d0c87bc292cb487dfa3973c2f7708eac353043dd7d9cff619a0；604×354。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×354 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 53. light · s · default

Case：b84dd6a488247b918e76-747c3ec8557104695d73/chromium/0 #0；[原图](screens/rc-button/chromium/000259-2-actual.png)；SHA-256：b7962a5c9cc0d2a1e6ebc4c51b8afa4c47e56d288b8e0a5aa9c7b90b694e629c；644×134。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 54. light · s · hover · primary

Case：b84dd6a488247b918e76-c0e5c0fc41789ed2ed65/chromium/0 #0；[原图](screens/rc-button/chromium/000260-2-actual.png)；SHA-256：bc8a39680b3049faa72980bfb92b5faedab93da0a9a1a5c10d7f2412b42c2e88；644×134。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 55. light · s · hover · tonal

Case：b84dd6a488247b918e76-c0e5c0fc41789ed2ed65/chromium/0 #1；[原图](screens/rc-button/chromium/000260-5-actual.png)；SHA-256：a20e7f8d36c578a78a5ced2c79e2fc7099c40ef139e4042d01848d4e710dfa0f；644×134。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 56. light · s · hover · outlined

Case：b84dd6a488247b918e76-c0e5c0fc41789ed2ed65/chromium/0 #2；[原图](screens/rc-button/chromium/000260-8-actual.png)；SHA-256：8d6ebc25781ecff040b4640faefaf8154378fc04a3b711f735433bf19b0fa08a；644×134。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 57. light · s · hover · text

Case：b84dd6a488247b918e76-c0e5c0fc41789ed2ed65/chromium/0 #3；[原图](screens/rc-button/chromium/000260-11-actual.png)；SHA-256：25cb5d2cc52b0b4eb7d91a2534f6d10db774974fcb0b3cf84597ee9bb274012c；644×134。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 58. light · s · hover · elevated

Case：b84dd6a488247b918e76-c0e5c0fc41789ed2ed65/chromium/0 #4；[原图](screens/rc-button/chromium/000260-14-actual.png)；SHA-256：ba97e96ab2a606fbc0474659edf0e42fdb19e5e074eca4160df885d02837d1fc；644×134。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 59. light · s · focus-visible · primary

Case：b84dd6a488247b918e76-cd02435b71c74732b239/chromium/0 #0；[原图](screens/rc-button/chromium/000261-2-actual.png)；SHA-256：f9ea232798d0e340ca7374d035145fa238eec9ef5db98b99b4fc2e6c3fa41dca；644×134。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 60. light · s · focus-visible · tonal

Case：b84dd6a488247b918e76-cd02435b71c74732b239/chromium/0 #1；[原图](screens/rc-button/chromium/000261-5-actual.png)；SHA-256：0e7fb0a33d228d1a77d5cc764d40024a052aa16342d58e3c2ea8c7a6a7d8be96；644×134。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 61. light · s · focus-visible · outlined

Case：b84dd6a488247b918e76-cd02435b71c74732b239/chromium/0 #2；[原图](screens/rc-button/chromium/000261-8-actual.png)；SHA-256：9ef945cef9bb77e66f5055309e9d2df27d8e9251b5e0d598a096d64641b2f1b9；644×134。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 62. light · s · focus-visible · text

Case：b84dd6a488247b918e76-cd02435b71c74732b239/chromium/0 #3；[原图](screens/rc-button/chromium/000261-11-actual.png)；SHA-256：61a667f6e8b740c262c43ad9249895afd45086c2934710997335fc88ea30fe6a；644×134。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 63. light · s · focus-visible · elevated

Case：b84dd6a488247b918e76-cd02435b71c74732b239/chromium/0 #4；[原图](screens/rc-button/chromium/000261-14-actual.png)；SHA-256：d917490ef62c167595d025a86f668012fbe8c3e7a4f519698214bc8075973a8a；644×134。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 64. light · s · pressed · primary

Case：b84dd6a488247b918e76-21bbc4758c10b6fe9a6b/chromium/0 #0；[原图](screens/rc-button/chromium/000262-2-actual.png)；SHA-256：77be8dea502499cc8002d29d308bf15255960eef1f1315b05e0c20b77a767f55；644×134。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 65. light · s · pressed · tonal

Case：b84dd6a488247b918e76-21bbc4758c10b6fe9a6b/chromium/0 #1；[原图](screens/rc-button/chromium/000262-5-actual.png)；SHA-256：6b99c9e2ad0280b040dd0bde4ae0e1b660f0b6858fa5ca647e3cc529668e52dd；644×134。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 66. light · s · pressed · outlined

Case：b84dd6a488247b918e76-21bbc4758c10b6fe9a6b/chromium/0 #2；[原图](screens/rc-button/chromium/000262-8-actual.png)；SHA-256：d6f2eaf67fb51832212b9033dcb2c01e93ae91c457097442f529338bfd3af805；644×134。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 67. light · s · pressed · text

Case：b84dd6a488247b918e76-21bbc4758c10b6fe9a6b/chromium/0 #3；[原图](screens/rc-button/chromium/000262-11-actual.png)；SHA-256：f0b175d0bade8e12b70456bc61025b37b6909d0ea8ea0652646f2365e765e5e0；644×134。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 68. light · s · pressed · elevated

Case：b84dd6a488247b918e76-21bbc4758c10b6fe9a6b/chromium/0 #4；[原图](screens/rc-button/chromium/000262-14-actual.png)；SHA-256：8a8ee422d86d0ea9d95ce559a0b39634717fbcd6afc34d48d0f7be181beaaf18；644×134。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 69. light · s · disabled

Case：b84dd6a488247b918e76-6ffb53468fbc85fa4fdd/chromium/0 #0；[原图](screens/rc-button/chromium/000263-2-actual.png)；SHA-256：ff70e80064979c5ca5f50d76ea629f7a729d81e56c171f8a03c94ec8f82649f6；644×134。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观均明显减弱，标签和容器仍在；这是禁用静态外观，不从图像断言无法激活或使用普通态对比度门槛。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 70. light · s · selected

Case：b84dd6a488247b918e76-c6ba0ad59a939b2edb76/chromium/0 #0；[原图](screens/rc-button/chromium/000264-2-actual.png)；SHA-256：7f1b5098db081d1552ed4d13b91152131dbbf75b11be7ad02f66deafdda68a4b；644×134。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 可切换外观呈选中填充和配对文字；outlined 与未选中边界有清楚区别，Text 保持普通动作展示。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 71. light · s · unselected

Case：b84dd6a488247b918e76-81485733f44e32219131/chromium/0 #0；[原图](screens/rc-button/chromium/000265-2-actual.png)；SHA-256：f79cfdf4b8767f0cd55ad4b571d3e4f711223e6d28f51daca05edb5e35d190a0；644×134。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 可切换外观回到未选中展示；outlined 保留细边界，Text 保持普通动作展示。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 72. light · s · variants

Case：b84dd6a488247b918e76-192212c150e18e2132e2/chromium/0 #0；[原图](screens/rc-button/chromium/000266-2-actual.png)；SHA-256：062fb28ef6ab2f33c2336a1e6b7c5f594f0c435ad53e6fc3398a0948cfd1290d；644×374。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×374 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 73. light · m · default

Case：b84dd6a488247b918e76-a02f5313a28715b9ab0f/chromium/0 #0；[原图](screens/rc-button/chromium/000267-2-actual.png)；SHA-256：458eaceaa215d2c8d072ca132dcf9f95c5b7c26815c74cb750fe3124641e76bf；724×138。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 74. light · m · hover · primary

Case：b84dd6a488247b918e76-fec04d12d858b2f00837/chromium/0 #0；[原图](screens/rc-button/chromium/000268-2-actual.png)；SHA-256：15ebe02ec565c4bbdcf6d8096e32b543572d0cf674f2ebde95a368b64c260f6d；724×138。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 75. light · m · hover · tonal

Case：b84dd6a488247b918e76-fec04d12d858b2f00837/chromium/0 #1；[原图](screens/rc-button/chromium/000268-5-actual.png)；SHA-256：1f03fe276762f244ac27ebefc13ab7456c840cf8a021a845532c9e8c1c8fcd34；724×138。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 76. light · m · hover · outlined

Case：b84dd6a488247b918e76-fec04d12d858b2f00837/chromium/0 #2；[原图](screens/rc-button/chromium/000268-8-actual.png)；SHA-256：ec00eb241034131584bcaa15acc9d4c50ba1abb302948f16932817796445440e；724×138。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 77. light · m · hover · text

Case：b84dd6a488247b918e76-fec04d12d858b2f00837/chromium/0 #3；[原图](screens/rc-button/chromium/000268-11-actual.png)；SHA-256：4609211fa4dd8711dfec4fe5f3136f0d1b6e32fcbfc0e9730d648bb72b5e069b；724×138。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 78. light · m · hover · elevated

Case：b84dd6a488247b918e76-fec04d12d858b2f00837/chromium/0 #4；[原图](screens/rc-button/chromium/000268-14-actual.png)；SHA-256：ff1acb1bf71dc7261b9475ba1577d2b5c9e8d8411dc0c7c8b0738b899202c765；724×138。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 79. light · m · focus-visible · primary

Case：b84dd6a488247b918e76-3d2978d221be33eca2b4/chromium/0 #0；[原图](screens/rc-button/chromium/000269-2-actual.png)；SHA-256：fd229e750a4ffe7384e78c1fdf30a0d5394e22927b10bcb86c03b73554c017ee；724×138。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 80. light · m · focus-visible · tonal

Case：b84dd6a488247b918e76-3d2978d221be33eca2b4/chromium/0 #1；[原图](screens/rc-button/chromium/000269-5-actual.png)；SHA-256：f24d6aab9df7dd158858a08859af770cace2ad85a293f2cf4d96fcfabf6324c9；724×138。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 81. light · m · focus-visible · outlined

Case：b84dd6a488247b918e76-3d2978d221be33eca2b4/chromium/0 #2；[原图](screens/rc-button/chromium/000269-8-actual.png)；SHA-256：3018bd51f6f1ed4aeef9f0b8a4686fbd1e189cf83fa2f17619fa655aa36cce9f；724×138。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 82. light · m · focus-visible · text

Case：b84dd6a488247b918e76-3d2978d221be33eca2b4/chromium/0 #3；[原图](screens/rc-button/chromium/000269-11-actual.png)；SHA-256：c93e6d163d7e7948b99cf5345d8e59072ac3e821a8e9d21fc98ec926d2b0fccc；724×138。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 83. light · m · focus-visible · elevated

Case：b84dd6a488247b918e76-3d2978d221be33eca2b4/chromium/0 #4；[原图](screens/rc-button/chromium/000269-14-actual.png)；SHA-256：45ac1dea9edda91d0bfb281237ee92cac06a247565ee2ce04f9ca56160755c59；724×138。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 84. light · m · pressed · primary

Case：b84dd6a488247b918e76-2a3f5093948553415c4a/chromium/0 #0；[原图](screens/rc-button/chromium/000270-2-actual.png)；SHA-256：dd8dfeacab99f7c414a4f7259fd2ac08be21d4ba9b3fc89f82ff7f30ff4962e7；724×138。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 85. light · m · pressed · tonal

Case：b84dd6a488247b918e76-2a3f5093948553415c4a/chromium/0 #1；[原图](screens/rc-button/chromium/000270-5-actual.png)；SHA-256：90af0d1279b97a0b1208140760d66a7dca222b3556e8a6d3de0e604b5af362cb；724×138。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 86. light · m · pressed · outlined

Case：b84dd6a488247b918e76-2a3f5093948553415c4a/chromium/0 #2；[原图](screens/rc-button/chromium/000270-8-actual.png)；SHA-256：405d0f38b235b29409ba5cc9b79c25910b934e3ff8408537834deb12a61bdcd5；724×138。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 87. light · m · pressed · text

Case：b84dd6a488247b918e76-2a3f5093948553415c4a/chromium/0 #3；[原图](screens/rc-button/chromium/000270-11-actual.png)；SHA-256：8d47b348644217515265d48648e8943b350157eb3163fc55d1b42924317462d7；724×138。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 88. light · m · pressed · elevated

Case：b84dd6a488247b918e76-2a3f5093948553415c4a/chromium/0 #4；[原图](screens/rc-button/chromium/000270-14-actual.png)；SHA-256：65674270f089aa601fd72bbd15efe26a45b7ed7be4f6ea66074bf23ce03400c3；724×138。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 89. light · m · disabled

Case：b84dd6a488247b918e76-2d6e0a52bce17935269a/chromium/0 #0；[原图](screens/rc-button/chromium/000271-2-actual.png)；SHA-256：02751dbe348a01c863fb79dfa5dd068288110f3ba3f2d6e3617bbc825ce6dfc9；724×138。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观均明显减弱，标签和容器仍在；这是禁用静态外观，不从图像断言无法激活或使用普通态对比度门槛。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 90. light · m · selected

Case：b84dd6a488247b918e76-d47c08818151fc9ed433/chromium/0 #0；[原图](screens/rc-button/chromium/000272-2-actual.png)；SHA-256：df9633b53e247cac5bc3a5c4c8a854248203470b5c00b2a366ac0248ea4f29dd；724×138。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 可切换外观呈选中填充和配对文字；outlined 与未选中边界有清楚区别，Text 保持普通动作展示。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 91. light · m · unselected

Case：b84dd6a488247b918e76-e727365d7183a58bcac0/chromium/0 #0；[原图](screens/rc-button/chromium/000273-2-actual.png)；SHA-256：ae760aa3c6e951a427c4bfd8fa1d803e60c3ecf0f02b8c0a15b0b64e3fa73298；724×138。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 可切换外观回到未选中展示；outlined 保留细边界，Text 保持普通动作展示。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 92. light · m · variants

Case：b84dd6a488247b918e76-5c96e8f57139f2f6e33e/chromium/0 #0；[原图](screens/rc-button/chromium/000274-2-actual.png)；SHA-256：18e4f8542e494bf6b79fb7cb477ec47fd2b7ef0ce9dc8031346a1b2615f333bf；724×394。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×394 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 93. light · l · default

Case：b84dd6a488247b918e76-19e7575f68a46bfeeea0/chromium/0 #0；[原图](screens/rc-button/chromium/000275-2-actual.png)；SHA-256：c1b0549e5c8b201e6691645bc2ad86cb101c4240ac890a0880e3c228dd053885；782×146。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 94. light · l · hover · primary

Case：b84dd6a488247b918e76-a6bac0bbd302cca3338a/chromium/0 #0；[原图](screens/rc-button/chromium/000276-2-actual.png)；SHA-256：9cec0d347848cdb0b3a7fb514c4469254575c60875f47144f7e1d459dfa05429；782×146。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 95. light · l · hover · tonal

Case：b84dd6a488247b918e76-a6bac0bbd302cca3338a/chromium/0 #1；[原图](screens/rc-button/chromium/000276-5-actual.png)；SHA-256：f72dd8e04853e130074f3028ea50b2c197f5946113472d0585e26b610748681d；782×146。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 96. light · l · hover · outlined

Case：b84dd6a488247b918e76-a6bac0bbd302cca3338a/chromium/0 #2；[原图](screens/rc-button/chromium/000276-8-actual.png)；SHA-256：9e6c9bcfcb0ef3cf1a57400eea60a269e33ba030d07f29c020baf984fc4ae27d；782×146。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 97. light · l · hover · text

Case：b84dd6a488247b918e76-a6bac0bbd302cca3338a/chromium/0 #3；[原图](screens/rc-button/chromium/000276-11-actual.png)；SHA-256：b3352225dab399b5fb183aff00f8a54571168803d3b98b9bf8ad5b41944524f2；782×146。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 98. light · l · hover · elevated

Case：b84dd6a488247b918e76-a6bac0bbd302cca3338a/chromium/0 #4；[原图](screens/rc-button/chromium/000276-14-actual.png)；SHA-256：fca2f7aae55760204335ae0a344016deb2cee7fe57df72262a6a04ea8c01d1ad；782×146。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 99. light · l · focus-visible · primary

Case：b84dd6a488247b918e76-4b486f575d6a7950f355/chromium/0 #0；[原图](screens/rc-button/chromium/000277-2-actual.png)；SHA-256：e5731c3cdf77a57fb61f017884ec96db20edc53c369d2f1b19132761d10520b6；782×146。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 100. light · l · focus-visible · tonal

Case：b84dd6a488247b918e76-4b486f575d6a7950f355/chromium/0 #1；[原图](screens/rc-button/chromium/000277-5-actual.png)；SHA-256：753d36692a56ce0c77bda1c13a6e9d3462cd07ac367ba287bb3c123752a5b5e1；782×146。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 101. light · l · focus-visible · outlined

Case：b84dd6a488247b918e76-4b486f575d6a7950f355/chromium/0 #2；[原图](screens/rc-button/chromium/000277-8-actual.png)；SHA-256：bc5dc7471f7f0fa05c7f4ba90cee33fb834952183f8afe562dad84013b05741f；782×146。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 102. light · l · focus-visible · text

Case：b84dd6a488247b918e76-4b486f575d6a7950f355/chromium/0 #3；[原图](screens/rc-button/chromium/000277-11-actual.png)；SHA-256：9400e19fef4ea6ed9ac1f64816a6383a1192e33a9d242d5cd4bfb2bf672e8bcf；782×146。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 103. light · l · focus-visible · elevated

Case：b84dd6a488247b918e76-4b486f575d6a7950f355/chromium/0 #4；[原图](screens/rc-button/chromium/000277-14-actual.png)；SHA-256：48e2062221377c9105ca7c79abce4de5ad22df811b2ef71e1557dd7cba49d482；782×146。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 104. light · l · pressed · primary

Case：b84dd6a488247b918e76-d0b1248cdb1923f5db9d/chromium/0 #0；[原图](screens/rc-button/chromium/000278-2-actual.png)；SHA-256：4bf09fe7a293961d4642cfe9431ab19cee1ec780aeaac933b6c2f00aecbfd4a9；782×146。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 105. light · l · pressed · tonal

Case：b84dd6a488247b918e76-d0b1248cdb1923f5db9d/chromium/0 #1；[原图](screens/rc-button/chromium/000278-5-actual.png)；SHA-256：4dc57a2b17e8fcb0663a4b4fc224a0542568fcd05e138b437fbfb11a9d0347e5；782×146。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 106. light · l · pressed · outlined

Case：b84dd6a488247b918e76-d0b1248cdb1923f5db9d/chromium/0 #2；[原图](screens/rc-button/chromium/000278-8-actual.png)；SHA-256：0c83c1653a1a7c99f3c25576ccca1219e1b36681086d7146e26ae61bb703c0f7；782×146。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 107. light · l · pressed · text

Case：b84dd6a488247b918e76-d0b1248cdb1923f5db9d/chromium/0 #3；[原图](screens/rc-button/chromium/000278-11-actual.png)；SHA-256：0b8a71591f2b1c1d07c31778a916f790e78501c8ed450c2d9863b82c2052f7dd；782×146。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 108. light · l · pressed · elevated

Case：b84dd6a488247b918e76-d0b1248cdb1923f5db9d/chromium/0 #4；[原图](screens/rc-button/chromium/000278-14-actual.png)；SHA-256：adeb97a77a8b8890d52a1b77c1d9d451fadbc807abdb38245c7dd3db68ef22f1；782×146。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 109. light · l · disabled

Case：b84dd6a488247b918e76-7fc51ae98a846e1ba6a3/chromium/0 #0；[原图](screens/rc-button/chromium/000279-2-actual.png)；SHA-256：42dbb3e885f41931934f0909a5053b3a8d876adee1b8d6faec0bcaf0819569ca；782×146。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观均明显减弱，标签和容器仍在；这是禁用静态外观，不从图像断言无法激活或使用普通态对比度门槛。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 110. light · l · selected

Case：b84dd6a488247b918e76-05eda0ddecff2b1c4b49/chromium/0 #0；[原图](screens/rc-button/chromium/000280-2-actual.png)；SHA-256：dce3dd31088ec25d532a55110e93bb604c60e3bc105e9c33ffe21012075637be；782×146。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 可切换外观呈选中填充和配对文字；outlined 与未选中边界有清楚区别，Text 保持普通动作展示。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 111. light · l · unselected

Case：b84dd6a488247b918e76-52322d3b2c9bc4912926/chromium/0 #0；[原图](screens/rc-button/chromium/000281-2-actual.png)；SHA-256：5b46836259fb5be97d391183bed53df1e6fd7cf4dd69748917ab4baf1815e848；782×146。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 可切换外观回到未选中展示；outlined 保留细边界，Text 保持普通动作展示。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 112. light · l · variants

Case：b84dd6a488247b918e76-55af8de3c6e87a3c0ecf/chromium/0 #0；[原图](screens/rc-button/chromium/000282-2-actual.png)；SHA-256：ce2500896311ef4799cc97e8dbc397aaa2e051c943a9cdcc327e07984e304816；782×434。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×434 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 113. light · xl · default

Case：b84dd6a488247b918e76-c1124855b65afb60042c/chromium/0 #0；[原图](screens/rc-button/chromium/000283-2-actual.png)；SHA-256：499d61dec52e51504a14709e9d0cdb748f0adc594b564f0e6664c5d31406773b；920×154。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 114. light · xl · hover · primary

Case：b84dd6a488247b918e76-8fb1d5b1f31b19daa35c/chromium/0 #0；[原图](screens/rc-button/chromium/000284-2-actual.png)；SHA-256：fbc11b8d175542d2d36fcb13d7f4105da1d66b3baf39fd0a7d1f1ca3cf7e7252；920×154。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 115. light · xl · hover · tonal

Case：b84dd6a488247b918e76-8fb1d5b1f31b19daa35c/chromium/0 #1；[原图](screens/rc-button/chromium/000284-5-actual.png)；SHA-256：fa87f96e4042c6e075003cbe354886b8d811eb46c9c745f167e4d4368dd0ea35；920×154。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 116. light · xl · hover · outlined

Case：b84dd6a488247b918e76-8fb1d5b1f31b19daa35c/chromium/0 #2；[原图](screens/rc-button/chromium/000284-8-actual.png)；SHA-256：b19d5fb11377bf701399883179e1be90d70d65bd8afa026b99627b5de47c897d；920×154。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 117. light · xl · hover · text

Case：b84dd6a488247b918e76-8fb1d5b1f31b19daa35c/chromium/0 #3；[原图](screens/rc-button/chromium/000284-11-actual.png)；SHA-256：eb9d1ee357593fad0e84d6a4c95d1e8514b7dccc6ac01fff8e74f3b47e117b91；920×154。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 118. light · xl · hover · elevated

Case：b84dd6a488247b918e76-8fb1d5b1f31b19daa35c/chromium/0 #4；[原图](screens/rc-button/chromium/000284-14-actual.png)；SHA-256：e74d22c21b5b15da187f2f3476647753e1b72102cd482734a99a471489ed3f2a；920×154。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 119. light · xl · focus-visible · primary

Case：b84dd6a488247b918e76-e58ab83d9991261911f0/chromium/0 #0；[原图](screens/rc-button/chromium/000285-2-actual.png)；SHA-256：2596526a83da2b7a48b2210148db2ea7b13cd12868feb5d9c8050c12e8db2808；920×154。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 120. light · xl · focus-visible · tonal

Case：b84dd6a488247b918e76-e58ab83d9991261911f0/chromium/0 #1；[原图](screens/rc-button/chromium/000285-5-actual.png)；SHA-256：02ea1e5921f0bc70bc356cb88f1bdb93423d0f1a853f33a3712bdbda86081672；920×154。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 121. light · xl · focus-visible · outlined

Case：b84dd6a488247b918e76-e58ab83d9991261911f0/chromium/0 #2；[原图](screens/rc-button/chromium/000285-8-actual.png)；SHA-256：b32e86862b9ab4078fb0c69f79a6a144876bef6dbe4b1fa01b599240e01b2813；920×154。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 122. light · xl · focus-visible · text

Case：b84dd6a488247b918e76-e58ab83d9991261911f0/chromium/0 #3；[原图](screens/rc-button/chromium/000285-11-actual.png)；SHA-256：c8177012d7727cf7aee9b92cc9de35684874cb20e51a0c6dabc87301c05ad110；920×154。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 123. light · xl · focus-visible · elevated

Case：b84dd6a488247b918e76-e58ab83d9991261911f0/chromium/0 #4；[原图](screens/rc-button/chromium/000285-14-actual.png)；SHA-256：f4e320164af5fd6e0938dc3c16d4365a44a89b8b1cf23fcb85b2af0bc42801c1；920×154。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 124. light · xl · pressed · primary

Case：b84dd6a488247b918e76-def11b6968d3e2aaafc3/chromium/0 #0；[原图](screens/rc-button/chromium/000286-2-actual.png)；SHA-256：a4480d929245c2a8e5c70e675839776acdc75786cf20465fbf2179b695332bd8；920×154。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 125. light · xl · pressed · tonal

Case：b84dd6a488247b918e76-def11b6968d3e2aaafc3/chromium/0 #1；[原图](screens/rc-button/chromium/000286-5-actual.png)；SHA-256：43ed89b10da996acf438c580212d3d5e2a8238a1c20c113b55c7e3b61a324b9b；920×154。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 126. light · xl · pressed · outlined

Case：b84dd6a488247b918e76-def11b6968d3e2aaafc3/chromium/0 #2；[原图](screens/rc-button/chromium/000286-8-actual.png)；SHA-256：f8d99d3dc8ddcbc50b238f77ce0f0e82e6e77d075a86d76318b8ef483d94dffe；920×154。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 127. light · xl · pressed · text

Case：b84dd6a488247b918e76-def11b6968d3e2aaafc3/chromium/0 #3；[原图](screens/rc-button/chromium/000286-11-actual.png)；SHA-256：4b4f8446675edecf5e1e68c8b35415c7ef2f807a425a441a55bf8ef9249b7a6a；920×154。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 128. light · xl · pressed · elevated

Case：b84dd6a488247b918e76-def11b6968d3e2aaafc3/chromium/0 #4；[原图](screens/rc-button/chromium/000286-14-actual.png)；SHA-256：417d0fcb0e142cb13d4df24f0a90ee9c029de8e18e5659f5ac12d553c6b79a92；920×154。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 129. light · xl · disabled

Case：b84dd6a488247b918e76-aaac51fe9e00e8b54ef6/chromium/0 #0；[原图](screens/rc-button/chromium/000287-2-actual.png)；SHA-256：ce8d719451928b8f383d6b24653dc0230dd323dba114df3c895e8a0e76d619ba；920×154。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观均明显减弱，标签和容器仍在；这是禁用静态外观，不从图像断言无法激活或使用普通态对比度门槛。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 130. light · xl · selected

Case：b84dd6a488247b918e76-b59849ed7514f3c39a99/chromium/0 #0；[原图](screens/rc-button/chromium/000288-2-actual.png)；SHA-256：44c5fbd7ac782a62bfe62d77fd0cb770fc0c9b25283b099b7afe39837f6585e7；920×154。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 可切换外观呈选中填充和配对文字；outlined 与未选中边界有清楚区别，Text 保持普通动作展示。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 131. light · xl · unselected

Case：b84dd6a488247b918e76-43723c6441d716e292d7/chromium/0 #0；[原图](screens/rc-button/chromium/000289-2-actual.png)；SHA-256：4a71103833174899ebd78695be180c5dff0a491ee64bd3a2e5359172f7472555；920×154。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 可切换外观回到未选中展示；outlined 保留细边界，Text 保持普通动作展示。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 132. light · xl · variants

Case：b84dd6a488247b918e76-ba2340f78bbaaab029cb/chromium/0 #0；[原图](screens/rc-button/chromium/000290-2-actual.png)；SHA-256：d53d2e1cd5ae7c68a0ef3387f5aed98c3b67380093a82c82bfd564d67f66fc7b；920×474。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×474 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 133. dark · xs · default

Case：b84dd6a488247b918e76-06e5c4fbf9430bd0aa50/chromium/0 #0；[原图](screens/rc-button/chromium/000291-2-actual.png)；SHA-256：31f4dd27e619471944c6c03cd944b75f4b3536d64d97c4f8728627344c6e1124；604×130。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 134. dark · xs · hover · primary

Case：b84dd6a488247b918e76-ea5e98ac883af11dca9f/chromium/0 #0；[原图](screens/rc-button/chromium/000292-2-actual.png)；SHA-256：d5c3eecd20d5d5b5ddbb813099f5fcdb5a2b4092479fc5831987ab5c10a482a6；604×130。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 135. dark · xs · hover · tonal

Case：b84dd6a488247b918e76-ea5e98ac883af11dca9f/chromium/0 #1；[原图](screens/rc-button/chromium/000292-5-actual.png)；SHA-256：67b678715f83235be050efa4717fdd4686a94d31e5aed9f593ec05a5cc1cf919；604×130。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 136. dark · xs · hover · outlined

Case：b84dd6a488247b918e76-ea5e98ac883af11dca9f/chromium/0 #2；[原图](screens/rc-button/chromium/000292-8-actual.png)；SHA-256：33dcca645ce6484faab776941aa4b7896d1e3c824f9d3c92d4a68e66d9002dd1；604×130。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 137. dark · xs · hover · text

Case：b84dd6a488247b918e76-ea5e98ac883af11dca9f/chromium/0 #3；[原图](screens/rc-button/chromium/000292-11-actual.png)；SHA-256：d91e4c7fd13b6c12a279ff0cfe89da6c3d1d5e07a4c63d0af1115c8d980ab1a0；604×130。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 138. dark · xs · hover · elevated

Case：b84dd6a488247b918e76-ea5e98ac883af11dca9f/chromium/0 #4；[原图](screens/rc-button/chromium/000292-14-actual.png)；SHA-256：ab6c6deccba5d79cb18486856fd5ab25093d4d33786f39728a2664321137ead4；604×130。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 139. dark · xs · focus-visible · primary

Case：b84dd6a488247b918e76-3b09167006d6e091ea7d/chromium/0 #0；[原图](screens/rc-button/chromium/000293-2-actual.png)；SHA-256：264c7750538cc87dce3d746863de7650a15ab77ed79123fbea2f31a58867da34；604×130。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 140. dark · xs · focus-visible · tonal

Case：b84dd6a488247b918e76-3b09167006d6e091ea7d/chromium/0 #1；[原图](screens/rc-button/chromium/000293-5-actual.png)；SHA-256：6ed002f89947a9e7372237577f12b9b2128045fbd72adaa3b08aecce428dbbad；604×130。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 141. dark · xs · focus-visible · outlined

Case：b84dd6a488247b918e76-3b09167006d6e091ea7d/chromium/0 #2；[原图](screens/rc-button/chromium/000293-8-actual.png)；SHA-256：d5a72ef648714c20d6fccd57d24631746f650cdc1b433808328af93bf48b147f；604×130。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 142. dark · xs · focus-visible · text

Case：b84dd6a488247b918e76-3b09167006d6e091ea7d/chromium/0 #3；[原图](screens/rc-button/chromium/000293-11-actual.png)；SHA-256：5da91f693803e5e32a9bfd665daf7dcaf35638cee72442312d73c8cd406847ed；604×130。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 143. dark · xs · focus-visible · elevated

Case：b84dd6a488247b918e76-3b09167006d6e091ea7d/chromium/0 #4；[原图](screens/rc-button/chromium/000293-14-actual.png)；SHA-256：66492ae876191b5c201281ad7113dcb9e4bd240ac590ccf83209b72cd8ee0657；604×130。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 144. dark · xs · pressed · primary

Case：b84dd6a488247b918e76-f23b40de7b7e83b00ff2/chromium/0 #0；[原图](screens/rc-button/chromium/000294-2-actual.png)；SHA-256：1c460bb96472bac0e176ba39d60f4234c3050c3bee74772395095df9c5cc5ab1；604×130。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 145. dark · xs · pressed · tonal

Case：b84dd6a488247b918e76-f23b40de7b7e83b00ff2/chromium/0 #1；[原图](screens/rc-button/chromium/000294-5-actual.png)；SHA-256：9d551db5890df8f6ddda50dedf9803413a549b459abfb6eee2d78b4e5bd8d5ba；604×130。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 146. dark · xs · pressed · outlined

Case：b84dd6a488247b918e76-f23b40de7b7e83b00ff2/chromium/0 #2；[原图](screens/rc-button/chromium/000294-8-actual.png)；SHA-256：8fdea60b3b47e9751e9eeef728222389fad77befe0b6a6877bec7e23e044985a；604×130。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 147. dark · xs · pressed · text

Case：b84dd6a488247b918e76-f23b40de7b7e83b00ff2/chromium/0 #3；[原图](screens/rc-button/chromium/000294-11-actual.png)；SHA-256：e6a4fe4cdd2a4e4144be4762e1086ed7f63dc703cf6d6eef5a0fbe08732e2b5c；604×130。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 148. dark · xs · pressed · elevated

Case：b84dd6a488247b918e76-f23b40de7b7e83b00ff2/chromium/0 #4；[原图](screens/rc-button/chromium/000294-14-actual.png)；SHA-256：8be6e9307ebd474c56716df1f7de688ee65e4aaba5964b6933c56be9b67329f1；604×130。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 149. dark · xs · disabled

Case：b84dd6a488247b918e76-0853f9f7ee7c1cb5f69b/chromium/0 #0；[原图](screens/rc-button/chromium/000295-2-actual.png)；SHA-256：74e226290a58e365da8a6ec21d6a517778d8634f030a2e3f8cae2840f3106475；604×130。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观均明显减弱，标签和容器仍在；这是禁用静态外观，不从图像断言无法激活或使用普通态对比度门槛。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 150. dark · xs · selected

Case：b84dd6a488247b918e76-9db3fc762b71ef0c2952/chromium/0 #0；[原图](screens/rc-button/chromium/000296-2-actual.png)；SHA-256：41434148d4cbe3eb74d72f5ca677631fbe33de01243ec66a15b469e525e32404；604×130。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 可切换外观呈选中填充和配对文字；outlined 与未选中边界有清楚区别，Text 保持普通动作展示。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 151. dark · xs · unselected

Case：b84dd6a488247b918e76-acd3fba08779428888c2/chromium/0 #0；[原图](screens/rc-button/chromium/000297-2-actual.png)；SHA-256：be0e8dd3bd2b41f5a10d1b1aca3da1541c6957ffe566c4ab8178fbba26b11208；604×130。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×130 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 可切换外观回到未选中展示；outlined 保留细边界，Text 保持普通动作展示。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 152. dark · xs · variants

Case：b84dd6a488247b918e76-68fbb0dd18cc2e02bf62/chromium/0 #0；[原图](screens/rc-button/chromium/000298-2-actual.png)；SHA-256：fac48276ce8bda09f33ad7bad01265a06d11cefec8196bf80906dfea886de7bf；604×354。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 604×354 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 153. dark · s · default

Case：b84dd6a488247b918e76-2f3e66594a60100bf7eb/chromium/0 #0；[原图](screens/rc-button/chromium/000299-2-actual.png)；SHA-256：5a740846b42a1e6559b52671564f905e3c5e368352d0122149ab24a4d51b565c；644×134。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 154. dark · s · hover · primary

Case：b84dd6a488247b918e76-7121ea5ea9b61759c100/chromium/0 #0；[原图](screens/rc-button/chromium/000300-2-actual.png)；SHA-256：914156be1c44f82819bbfb3b4ffea123f02f4b093cd0c330f08f3000e1fcc7a1；644×134。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 155. dark · s · hover · tonal

Case：b84dd6a488247b918e76-7121ea5ea9b61759c100/chromium/0 #1；[原图](screens/rc-button/chromium/000300-5-actual.png)；SHA-256：c10c9d1f1f5200fe4f9061ac305fea27d1630a509afd1568776208f20f088c40；644×134。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 156. dark · s · hover · outlined

Case：b84dd6a488247b918e76-7121ea5ea9b61759c100/chromium/0 #2；[原图](screens/rc-button/chromium/000300-8-actual.png)；SHA-256：7ac62279be08a1cbe30036ec4cbe1a9ef6e5c359d0295ae94b4a4f5c67331299；644×134。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 157. dark · s · hover · text

Case：b84dd6a488247b918e76-7121ea5ea9b61759c100/chromium/0 #3；[原图](screens/rc-button/chromium/000300-11-actual.png)；SHA-256：e7d3c4169f5a3e95edca689f60762cbe845b3e8095833108f7dfb89717c621c2；644×134。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 158. dark · s · hover · elevated

Case：b84dd6a488247b918e76-7121ea5ea9b61759c100/chromium/0 #4；[原图](screens/rc-button/chromium/000300-14-actual.png)；SHA-256：d63381843dcc383395e3d7ab7e3b125f9f22d8f9fb7036cd61c24ea593a69e16；644×134。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 159. dark · s · focus-visible · primary

Case：b84dd6a488247b918e76-562fee5c72f43bc639a4/chromium/0 #0；[原图](screens/rc-button/chromium/000301-2-actual.png)；SHA-256：993fce042e4b9dbe4ef6df5d3dbc1dc8a0a76568e4f5928ad457b88189394bd5；644×134。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 160. dark · s · focus-visible · tonal

Case：b84dd6a488247b918e76-562fee5c72f43bc639a4/chromium/0 #1；[原图](screens/rc-button/chromium/000301-5-actual.png)；SHA-256：bdd0eb108cacabeeb25aea8628dce6dd8c6f8f1e359dbee9acfe618d58d57dbb；644×134。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 161. dark · s · focus-visible · outlined

Case：b84dd6a488247b918e76-562fee5c72f43bc639a4/chromium/0 #2；[原图](screens/rc-button/chromium/000301-8-actual.png)；SHA-256：f3c93fe5b3b735cf2d0b6692a0e38b76874325d3414a1caec491588663873ad6；644×134。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 162. dark · s · focus-visible · text

Case：b84dd6a488247b918e76-562fee5c72f43bc639a4/chromium/0 #3；[原图](screens/rc-button/chromium/000301-11-actual.png)；SHA-256：53865f5bb690a2b66d6fc016516d55342a7a3ab49251fa0695f4db4b15c38351；644×134。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 163. dark · s · focus-visible · elevated

Case：b84dd6a488247b918e76-562fee5c72f43bc639a4/chromium/0 #4；[原图](screens/rc-button/chromium/000301-14-actual.png)；SHA-256：9947722150d257e69d26ceaab8246e1d739ce33bbb63bb207d63fba273cc29ec；644×134。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 164. dark · s · pressed · primary

Case：b84dd6a488247b918e76-e58cd6518d895a8da5f3/chromium/0 #0；[原图](screens/rc-button/chromium/000302-2-actual.png)；SHA-256：853a0acc308ec8955a1935a93518063bb3c4618047fa898c69c400be4ca3dd7b；644×134。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 165. dark · s · pressed · tonal

Case：b84dd6a488247b918e76-e58cd6518d895a8da5f3/chromium/0 #1；[原图](screens/rc-button/chromium/000302-5-actual.png)；SHA-256：147722f186e15539f079e2be6af102b2a90cadad2f0f0b50889965607aced09b；644×134。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 166. dark · s · pressed · outlined

Case：b84dd6a488247b918e76-e58cd6518d895a8da5f3/chromium/0 #2；[原图](screens/rc-button/chromium/000302-8-actual.png)；SHA-256：8254f3855f908d09097a3ad5ae0ad7e5478f2e8084183a46a22d763c302abe7e；644×134。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 167. dark · s · pressed · text

Case：b84dd6a488247b918e76-e58cd6518d895a8da5f3/chromium/0 #3；[原图](screens/rc-button/chromium/000302-11-actual.png)；SHA-256：118a593a7caadbc294669398d3d22fb5f623d284c7b954c385db82469fc6ba3e；644×134。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 168. dark · s · pressed · elevated

Case：b84dd6a488247b918e76-e58cd6518d895a8da5f3/chromium/0 #4；[原图](screens/rc-button/chromium/000302-14-actual.png)；SHA-256：c72af696c598f40a07b8b3771f5b558f28ab0d06db93c22df53ca367b1723da3；644×134。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 169. dark · s · disabled

Case：b84dd6a488247b918e76-98c0d69dda9e0bb519c4/chromium/0 #0；[原图](screens/rc-button/chromium/000303-2-actual.png)；SHA-256：cc64576a9af2f54fc3e41e3d4b503fdd9080ccfe49e14614867d1efaa5d64ad5；644×134。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观均明显减弱，标签和容器仍在；这是禁用静态外观，不从图像断言无法激活或使用普通态对比度门槛。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 170. dark · s · selected

Case：b84dd6a488247b918e76-042aed26b23ffb9868d8/chromium/0 #0；[原图](screens/rc-button/chromium/000304-2-actual.png)；SHA-256：682d4e077031eb1d2893698d72ab9773efbb42eceae87e48021fa7186c4fa961；644×134。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 可切换外观呈选中填充和配对文字；outlined 与未选中边界有清楚区别，Text 保持普通动作展示。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 171. dark · s · unselected

Case：b84dd6a488247b918e76-e095e9423408ce3f9455/chromium/0 #0；[原图](screens/rc-button/chromium/000305-2-actual.png)；SHA-256：a5d033ca9a95c63b92aae013449678e4a7a6a5f6f9ca92d8ed00e1a47abc1139；644×134。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×134 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 可切换外观回到未选中展示；outlined 保留细边界，Text 保持普通动作展示。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 172. dark · s · variants

Case：b84dd6a488247b918e76-7b7f471a4e936c761e1c/chromium/0 #0；[原图](screens/rc-button/chromium/000306-2-actual.png)；SHA-256：359a2614888288e08c0e165b138eb31d97e3ca42659198c14ecde887a938ed04；644×374。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 644×374 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 173. dark · m · default

Case：b84dd6a488247b918e76-819e0f65e266747d3492/chromium/0 #0；[原图](screens/rc-button/chromium/000307-2-actual.png)；SHA-256：66acd99087b4178630408054237694405291b95fd56dd9050609da4c8763e172；724×138。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 174. dark · m · hover · primary

Case：b84dd6a488247b918e76-584cbac90bcb7ef11113/chromium/0 #0；[原图](screens/rc-button/chromium/000308-2-actual.png)；SHA-256：a9f5e16774092c7113ba1b50eb14c3afa1cd407672bfe137f219d408ff1382e9；724×138。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 175. dark · m · hover · tonal

Case：b84dd6a488247b918e76-584cbac90bcb7ef11113/chromium/0 #1；[原图](screens/rc-button/chromium/000308-5-actual.png)；SHA-256：3edbf94f2880085fa19ebe35fda41ad705f77bee6ce8095f157e5a6eb329ddf0；724×138。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 176. dark · m · hover · outlined

Case：b84dd6a488247b918e76-584cbac90bcb7ef11113/chromium/0 #2；[原图](screens/rc-button/chromium/000308-8-actual.png)；SHA-256：2a8b8ed619f87fb3d42d544d05664e5ebd2be08418dcbdc6e19e243332eeb9b5；724×138。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 177. dark · m · hover · text

Case：b84dd6a488247b918e76-584cbac90bcb7ef11113/chromium/0 #3；[原图](screens/rc-button/chromium/000308-11-actual.png)；SHA-256：339e83cce9f2ff8cdc6a78741cdeb85e033b486acdbf82745bac3d283e3b22f1；724×138。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 178. dark · m · hover · elevated

Case：b84dd6a488247b918e76-584cbac90bcb7ef11113/chromium/0 #4；[原图](screens/rc-button/chromium/000308-14-actual.png)；SHA-256：5e2d0a508e9bd11f7fab156d18bca50b1fd5048177d5b87e520f22bae57c1462；724×138。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 179. dark · m · focus-visible · primary

Case：b84dd6a488247b918e76-ea36d525787c211840ab/chromium/0 #0；[原图](screens/rc-button/chromium/000309-2-actual.png)；SHA-256：66cea8dbdb4f2f5cf6f789d31ab550c40a1b59d6fa7f86984927f77689b0c76f；724×138。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 180. dark · m · focus-visible · tonal

Case：b84dd6a488247b918e76-ea36d525787c211840ab/chromium/0 #1；[原图](screens/rc-button/chromium/000309-5-actual.png)；SHA-256：43a2bc903bfe7ce90dbe1c611ba21597c9f73c9ccaebc113f2df314bd264cc50；724×138。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 181. dark · m · focus-visible · outlined

Case：b84dd6a488247b918e76-ea36d525787c211840ab/chromium/0 #2；[原图](screens/rc-button/chromium/000309-8-actual.png)；SHA-256：3f05d764da5e118a22cbc5c28107179845905b1a79f2de1f664db7016e9d9f43；724×138。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 182. dark · m · focus-visible · text

Case：b84dd6a488247b918e76-ea36d525787c211840ab/chromium/0 #3；[原图](screens/rc-button/chromium/000309-11-actual.png)；SHA-256：b62dc45a0e3e3c88bb4d76fec1cbf70f61e47dc7a7f4e3f3805713a26069e6c3；724×138。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 183. dark · m · focus-visible · elevated

Case：b84dd6a488247b918e76-ea36d525787c211840ab/chromium/0 #4；[原图](screens/rc-button/chromium/000309-14-actual.png)；SHA-256：eaff5d07a671076bc6b276379bb8e6dbb07866261f30f3db20cfce3e697fcec4；724×138。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 184. dark · m · pressed · primary

Case：b84dd6a488247b918e76-7860d7e437495bcef852/chromium/0 #0；[原图](screens/rc-button/chromium/000310-2-actual.png)；SHA-256：7bce6df70e7ef88f24c516a2680c7d73af1139d516cbc2fe75fa836bfd3fd77d；724×138。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 185. dark · m · pressed · tonal

Case：b84dd6a488247b918e76-7860d7e437495bcef852/chromium/0 #1；[原图](screens/rc-button/chromium/000310-5-actual.png)；SHA-256：8b5e0ca80b304a4cc70cb927dda3334e6de12465a1ee75045a026152606f6c3d；724×138。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 186. dark · m · pressed · outlined

Case：b84dd6a488247b918e76-7860d7e437495bcef852/chromium/0 #2；[原图](screens/rc-button/chromium/000310-8-actual.png)；SHA-256：6252cf31eafb2d4bf265fe7e9cd3ae81325cdf64fe06c25e7e54bae19e6f2b0a；724×138。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 187. dark · m · pressed · text

Case：b84dd6a488247b918e76-7860d7e437495bcef852/chromium/0 #3；[原图](screens/rc-button/chromium/000310-11-actual.png)；SHA-256：47520f722d5e21559521611693359ce0c6f05f47a678a14607867bb8c7f0e4c7；724×138。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 188. dark · m · pressed · elevated

Case：b84dd6a488247b918e76-7860d7e437495bcef852/chromium/0 #4；[原图](screens/rc-button/chromium/000310-14-actual.png)；SHA-256：9300f0d6d4dff5352b35ce926f04d2849c2899f1486c7bc891f784022f3b4ec3；724×138。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 189. dark · m · disabled

Case：b84dd6a488247b918e76-3effb4ad6ed568fb3b6d/chromium/0 #0；[原图](screens/rc-button/chromium/000311-2-actual.png)；SHA-256：37094b2715480c5bf57e737c8ee4e6a2aa575807e16ab3931dad2f9702ea9a0c；724×138。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观均明显减弱，标签和容器仍在；这是禁用静态外观，不从图像断言无法激活或使用普通态对比度门槛。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 190. dark · m · selected

Case：b84dd6a488247b918e76-35bac1b8d6ac08519796/chromium/0 #0；[原图](screens/rc-button/chromium/000312-2-actual.png)；SHA-256：3d6b672c6877f6e6ccedc8a13d13a06386ee6c0c9af77337d9a01d4cfe6f806e；724×138。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 可切换外观呈选中填充和配对文字；outlined 与未选中边界有清楚区别，Text 保持普通动作展示。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 191. dark · m · unselected

Case：b84dd6a488247b918e76-4120859c3f28a3e87b1e/chromium/0 #0；[原图](screens/rc-button/chromium/000313-2-actual.png)；SHA-256：24928af6a43a36798a397086982a9bb630de16e3ce5764256a85da0a37418cbe；724×138。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×138 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 可切换外观回到未选中展示；outlined 保留细边界，Text 保持普通动作展示。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 192. dark · m · variants

Case：b84dd6a488247b918e76-8c82d0654235acf64f59/chromium/0 #0；[原图](screens/rc-button/chromium/000314-2-actual.png)；SHA-256：c9deca167b5ee50350caa38b873910cedde350ba00ba4b5980057f078858ea3a；724×394。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 724×394 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 193. dark · l · default

Case：b84dd6a488247b918e76-294988716228178d966f/chromium/0 #0；[原图](screens/rc-button/chromium/000315-2-actual.png)；SHA-256：e2800e92bc9b67d26425041803a3645a69c8233e68f907df98f464d1462ebeec；782×146。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 194. dark · l · hover · primary

Case：b84dd6a488247b918e76-8387a0548ab255c9c75a/chromium/0 #0；[原图](screens/rc-button/chromium/000316-2-actual.png)；SHA-256：3023e609831dba5b6bf80032e1861b3ff17c642fc410fc14a0ed6d4678ebb9fa；782×146。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 195. dark · l · hover · tonal

Case：b84dd6a488247b918e76-8387a0548ab255c9c75a/chromium/0 #1；[原图](screens/rc-button/chromium/000316-5-actual.png)；SHA-256：f2b6fe5b8029b3d79605a33b13d22584e7cb98f66e830afe1d00d3ff20aa46f7；782×146。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 196. dark · l · hover · outlined

Case：b84dd6a488247b918e76-8387a0548ab255c9c75a/chromium/0 #2；[原图](screens/rc-button/chromium/000316-8-actual.png)；SHA-256：2301cdd4e798a271c10c6886ff9f60b3455a8cfca2b5182433902b0f7b14ef34；782×146。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 197. dark · l · hover · text

Case：b84dd6a488247b918e76-8387a0548ab255c9c75a/chromium/0 #3；[原图](screens/rc-button/chromium/000316-11-actual.png)；SHA-256：fe87b7a5e7a994cf11b7d5c5474c91292b45f3d7ea0c699047fa8d2963c54060；782×146。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 198. dark · l · hover · elevated

Case：b84dd6a488247b918e76-8387a0548ab255c9c75a/chromium/0 #4；[原图](screens/rc-button/chromium/000316-14-actual.png)；SHA-256：d972ddac84584bd2ba42fb28da1e050011d38f8e09b13abb479b401e740fd94a；782×146。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 199. dark · l · focus-visible · primary

Case：b84dd6a488247b918e76-4fb2936ffcf79a092d4f/chromium/0 #0；[原图](screens/rc-button/chromium/000317-2-actual.png)；SHA-256：1da08d01bee6b824e368dd9a5393bfd7b9821bae85dab0998ec352534dcc2398；782×146。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 200. dark · l · focus-visible · tonal

Case：b84dd6a488247b918e76-4fb2936ffcf79a092d4f/chromium/0 #1；[原图](screens/rc-button/chromium/000317-5-actual.png)；SHA-256：ecc8d6af884ab784bbb2fc32cd8192c750e95d15f881d35f41eeec71be42406a；782×146。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 201. dark · l · focus-visible · outlined

Case：b84dd6a488247b918e76-4fb2936ffcf79a092d4f/chromium/0 #2；[原图](screens/rc-button/chromium/000317-8-actual.png)；SHA-256：5ae6f583b86305d1055055bbf2e27d71000082c3881f06752dd3e809ab47bc5e；782×146。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 202. dark · l · focus-visible · text

Case：b84dd6a488247b918e76-4fb2936ffcf79a092d4f/chromium/0 #3；[原图](screens/rc-button/chromium/000317-11-actual.png)；SHA-256：df0286d6a478fed1fcd1c347c631f6e900230429599773b814421754e7bbb54a；782×146。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 203. dark · l · focus-visible · elevated

Case：b84dd6a488247b918e76-4fb2936ffcf79a092d4f/chromium/0 #4；[原图](screens/rc-button/chromium/000317-14-actual.png)；SHA-256：ac6558866cef3672360e28f6ed927082cce09b70c6c2e5616ab0966d9468a20f；782×146。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 204. dark · l · pressed · primary

Case：b84dd6a488247b918e76-62338e04daa6312709e9/chromium/0 #0；[原图](screens/rc-button/chromium/000318-2-actual.png)；SHA-256：e59c43ba78f02a9077598ab85f8d27bbf33a64a3e5293913345ff3ef753fdfad；782×146。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 205. dark · l · pressed · tonal

Case：b84dd6a488247b918e76-62338e04daa6312709e9/chromium/0 #1；[原图](screens/rc-button/chromium/000318-5-actual.png)；SHA-256：efc0d90f983a32d607e05112958f6929d45474ad16979f5391e4756496af6bf8；782×146。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 206. dark · l · pressed · outlined

Case：b84dd6a488247b918e76-62338e04daa6312709e9/chromium/0 #2；[原图](screens/rc-button/chromium/000318-8-actual.png)；SHA-256：1b66581895c6f985f3d89b37767ddf823c3354896ac15b920d842bf86a9cc772；782×146。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 207. dark · l · pressed · text

Case：b84dd6a488247b918e76-62338e04daa6312709e9/chromium/0 #3；[原图](screens/rc-button/chromium/000318-11-actual.png)；SHA-256：bcee206bf3442a2c795d6d15cb09d6c176f60982e8d0fd22b32f353a9ab15476；782×146。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 208. dark · l · pressed · elevated

Case：b84dd6a488247b918e76-62338e04daa6312709e9/chromium/0 #4；[原图](screens/rc-button/chromium/000318-14-actual.png)；SHA-256：b7da5c05d5f0c07919d2220d0cda15051a8a01f5592daf00ff660afba7c1aeff；782×146。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 209. dark · l · disabled

Case：b84dd6a488247b918e76-3bf7b7048eedb2ef1b31/chromium/0 #0；[原图](screens/rc-button/chromium/000319-2-actual.png)；SHA-256：f01304b35c98badbd4f3a4fcc71682981b31d13e5e793b71160f84d5c85e01d7；782×146。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观均明显减弱，标签和容器仍在；这是禁用静态外观，不从图像断言无法激活或使用普通态对比度门槛。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 210. dark · l · selected

Case：b84dd6a488247b918e76-0f2efdcd77aec503a014/chromium/0 #0；[原图](screens/rc-button/chromium/000320-2-actual.png)；SHA-256：efc835f0dc64a9e42792cbbfa2875140855e67a8617bbba6b3783d1f8586bc0a；782×146。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 可切换外观呈选中填充和配对文字；outlined 与未选中边界有清楚区别，Text 保持普通动作展示。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 211. dark · l · unselected

Case：b84dd6a488247b918e76-7b0606d80272c904ce52/chromium/0 #0；[原图](screens/rc-button/chromium/000321-2-actual.png)；SHA-256：eaa2cd34a40763d877b73dd3a9f7779186140087dda8cca0800ad0f30e954d3c；782×146。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×146 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 可切换外观回到未选中展示；outlined 保留细边界，Text 保持普通动作展示。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 212. dark · l · variants

Case：b84dd6a488247b918e76-701075e65b60a0fe15ee/chromium/0 #0；[原图](screens/rc-button/chromium/000322-2-actual.png)；SHA-256：f93bb9ec51305a51ea7c42deb899ba1237e11513b75def39cf396dbebef529e5；782×434。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 782×434 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 213. dark · xl · default

Case：b84dd6a488247b918e76-83633ef94fb85745cd85/chromium/0 #0；[原图](screens/rc-button/chromium/000323-2-actual.png)；SHA-256：ba9992ef2e6631c97fd51a7ef7afe93c0d78f2f4e0a11f7b686c2aae5cf912c9；920×154。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 214. dark · xl · hover · primary

Case：b84dd6a488247b918e76-975bc6cf8719a27a9761/chromium/0 #0；[原图](screens/rc-button/chromium/000324-2-actual.png)；SHA-256：d02fe4f6820d79cf40eade5789e1eb61bcf503f238224f638dc2537053f4b5de；920×154。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 215. dark · xl · hover · tonal

Case：b84dd6a488247b918e76-975bc6cf8719a27a9761/chromium/0 #1；[原图](screens/rc-button/chromium/000324-5-actual.png)；SHA-256：f2b8116c8bb0661415ec8be50ec185f50b8e97be746a4f0f53f9164fd1bdef26；920×154。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 216. dark · xl · hover · outlined

Case：b84dd6a488247b918e76-975bc6cf8719a27a9761/chromium/0 #2；[原图](screens/rc-button/chromium/000324-8-actual.png)；SHA-256：0d7d634d074a838cee7b60fb063287b4e1e628dbd56f64eb7c857e08fa55b60f；920×154。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 217. dark · xl · hover · text

Case：b84dd6a488247b918e76-975bc6cf8719a27a9761/chromium/0 #3；[原图](screens/rc-button/chromium/000324-11-actual.png)；SHA-256：8d226db84770977640a0e9c93b69dc9c4b7654b4c4a5eadb2239b108c50805bb；920×154。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 218. dark · xl · hover · elevated

Case：b84dd6a488247b918e76-975bc6cf8719a27a9761/chromium/0 #4；[原图](screens/rc-button/chromium/000324-14-actual.png)；SHA-256：5a90c3459e4ebce5fdd3df91ec8f7344ca4b38d23b6062925e92e182b806e52a；920×154。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 可见对应悬停表面变化，标签位置与轮廓稳定；其他外观没有被此帧误计为已悬停。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 219. dark · xl · focus-visible · primary

Case：b84dd6a488247b918e76-51a38b446a1add9283ed/chromium/0 #0；[原图](screens/rc-button/chromium/000325-2-actual.png)；SHA-256：0a36ecc5b25425257859df58853a12ac91305705f661c5d197a43884ff9529db；920×154。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 220. dark · xl · focus-visible · tonal

Case：b84dd6a488247b918e76-51a38b446a1add9283ed/chromium/0 #1；[原图](screens/rc-button/chromium/000325-5-actual.png)；SHA-256：a7c0d95865ae77e29ee7395c58b96b251d3b37b597075ea736ae7a2834e995c8；920×154。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 221. dark · xl · focus-visible · outlined

Case：b84dd6a488247b918e76-51a38b446a1add9283ed/chromium/0 #2；[原图](screens/rc-button/chromium/000325-8-actual.png)；SHA-256：7b77fe6cfd31f9d7531d5595ff8bc643d3cf65650922f123b3d761fab5a61fb9；920×154。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 222. dark · xl · focus-visible · text

Case：b84dd6a488247b918e76-51a38b446a1add9283ed/chromium/0 #3；[原图](screens/rc-button/chromium/000325-11-actual.png)；SHA-256：348d4f25595a2d3aad667de931c763871fb51fca91e43f273a319ea7674ee5e8；920×154。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 223. dark · xl · focus-visible · elevated

Case：b84dd6a488247b918e76-51a38b446a1add9283ed/chromium/0 #4；[原图](screens/rc-button/chromium/000325-14-actual.png)；SHA-256：73152808dfe724d247cb2cb793851daf5790487b20ff96ee7915463efa8fd365；920×154。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 的外部焦点轮廓清楚且完整，和相邻按钮、标签保持分离；其他按钮作为同屏默认对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 224. dark · xl · pressed · primary

Case：b84dd6a488247b918e76-631a0e49e251038eea43/chromium/0 #0；[原图](screens/rc-button/chromium/000326-2-actual.png)；SHA-256：78721bf968795b530ab6a9513e5993b8537b4dd60fc8dad1ee07362c534d5d9e；920×154。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- primary 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 225. dark · xl · pressed · tonal

Case：b84dd6a488247b918e76-631a0e49e251038eea43/chromium/0 #1；[原图](screens/rc-button/chromium/000326-5-actual.png)；SHA-256：4a54a904f132a078d9e7334c9d3ad9dcbd028a4e6ace165957eba4efbbd628e1；920×154。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- tonal 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 226. dark · xl · pressed · outlined

Case：b84dd6a488247b918e76-631a0e49e251038eea43/chromium/0 #2；[原图](screens/rc-button/chromium/000326-8-actual.png)；SHA-256：9b6699ca6230e6860438fd61433ae616f2146e0b16bfba309c9c89ba80d2b08e；920×154。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- outlined 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 227. dark · xl · pressed · text

Case：b84dd6a488247b918e76-631a0e49e251038eea43/chromium/0 #3；[原图](screens/rc-button/chromium/000326-11-actual.png)；SHA-256：13f5620f93f5537099f8110ceee65e565bb3678e42b07e20ad35c331a315efef；920×154。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- text 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 228. dark · xl · pressed · elevated

Case：b84dd6a488247b918e76-631a0e49e251038eea43/chromium/0 #4；[原图](screens/rc-button/chromium/000326-14-actual.png)；SHA-256：2bd9399271dade6214c3ff12b69f0eec7e34349f70b85b6b0ddac25d1933b15c；920×154。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- elevated 可见按压表面反馈，未见文字移动、边框几何跳动或默认圆角被错误改为胶囊；其他外观为同屏对照。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 229. dark · xl · disabled

Case：b84dd6a488247b918e76-a118244e5fe0e5bae008/chromium/0 #0；[原图](screens/rc-button/chromium/000327-2-actual.png)；SHA-256：cb9e0651e6debe5a9ddb3a9cf5d5aae587464de3b6c72aeb5a6e1340bfbeb4f6；920×154。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观均明显减弱，标签和容器仍在；这是禁用静态外观，不从图像断言无法激活或使用普通态对比度门槛。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 230. dark · xl · selected

Case：b84dd6a488247b918e76-7b9fbd2ebbf25e3b3570/chromium/0 #0；[原图](screens/rc-button/chromium/000328-2-actual.png)；SHA-256：088087f5d9a86cc3bb96112faf817eed765c731d473ef698ce57e5cac67ccebc；920×154。

来源：inputs-worker-9.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 可切换外观呈选中填充和配对文字；outlined 与未选中边界有清楚区别，Text 保持普通动作展示。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 231. dark · xl · unselected

Case：b84dd6a488247b918e76-85f41e0e3fb419ee6aac/chromium/0 #0；[原图](screens/rc-button/chromium/000329-2-actual.png)；SHA-256：52da0a564a5b28fb635e8be15d2b747fdace1874975122f7ed405cfa42b70b02；920×154。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×154 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 可切换外观回到未选中展示；outlined 保留细边界，Text 保持普通动作展示。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 232. dark · xl · variants

Case：b84dd6a488247b918e76-e5c372854efdd6a9bdee/chromium/0 #0；[原图](screens/rc-button/chromium/000330-2-actual.png)；SHA-256：e18421aa74cda66ea908ca6d771cc8599032f44d8eb4f397fbaae61590093cdf；920×474。

来源：inputs-worker-8.json；原生结果：passed；复审结论：reviewed-scoped-no-additional-obvious-defect。

- 已单独打开并查看这张 920×474 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- 五个标准外观的文字、间距和圆角完整，没有可见文字重叠或行尾丢失。
- 形状与图标、危险操作、compatibility dashed/subtle 和长 fit 按钮均在此帧内呈现，文字及图标未见重叠。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。

## 233. light · medium · inventory-scope

Case：73019a0006cb75aa6498-80a248955a56e72196e8/chromium/0 #0；[原图](screens/rc-button/chromium/000335-0-inventory-actual.png)；SHA-256：a05a2a40b391e354a9d611bd3d74d396f9d68f8efdc1ca3407ac22708181d070；1280×720。

来源：inputs-worker-3.json；原生结果：passed；复审结论：reviewed-shape-parity-finding-not-accepted。

- 已单独打开并查看这张 1280×720 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- basic.demo.tsx 的“保存更改”主按钮为明显胶囊形，文字完整；与同候选公开入口 s/default 的约 8px 圆角矩形不同，默认形状不能据此批准。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。
- 仅默认库存视口；原生测试通过不消除实际形状差异。修复后需建立新候选复核 owner source 与 public ESM。

## 234. dark · medium · inventory-scope

Case：73019a0006cb75aa6498-a40cb8066323511b1608/chromium/0 #0；[原图](screens/rc-button/chromium/000336-0-inventory-actual.png)；SHA-256：7b957f1122521d693b597882db9375fa08cc1c0c52e9951d825da44bebc9a04e；1280×720。

来源：inputs-worker-7.json；原生结果：passed；复审结论：reviewed-shape-parity-finding-not-accepted。

- 已单独打开并查看这张 1280×720 原始 PNG；按钮本体已出现，无加载未就绪或空白画面取代组件。
- basic.demo.tsx 的“保存更改”主按钮为明显胶囊形，文字完整；与同候选公开入口 s/default 的约 8px 圆角矩形不同，默认形状不能据此批准。

未验与限制：

- 静态 PNG 不独立证明命中区域、语义、键盘/触控可达性或完整操作协议；自动通过状态只来自所绑定的原始 Playwright 报告。
- 本批全部为 Chromium 156；未以这些图验收 Firefox / WebKit，也没有跨平台像素比较或连续两次基准稳定性验证。
- compatibility dashed、subtle、link、danger，以及额外形状与 danger 组合主要出现在静态 variants/环境/zoom；不能据此宣称它们逐一完成独立 hover/focus/pressed/disabled 矩阵。
- 未建立或批准任何基准，未更新 verified 或生命周期；精确计算色值、文字对比度和实际字体选择不由截图印象推断。
- 仅默认库存视口；原生测试通过不消除实际形状差异。修复后需建立新候选复核 owner source 与 public ESM。

