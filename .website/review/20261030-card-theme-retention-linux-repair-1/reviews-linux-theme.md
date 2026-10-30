# Linux Card 主题切换复审

18/18原PNG已实际逐张查看（18唯一SHA）。三引擎各6原生用例全部通过；72组四variant RAF已独立复核，693自然采样/656已提交配置采样均满足原断言。每图字节与cases、native附件、HTML图片一致；72JSON也与原生及HTML字节绑定一致。3worker前后稳定。

源 sha256:aa0bc1a807c98d2ba57df07a7bf15f4c270dc736eb3a8e63a82bc96b9f55542c；产物 sha256:c3b3ab0afdd15f2c75792a7e54fe4e95afd28f69a97562d5d72c371968c5fb07。本批仅medium/standard主题切换：default/elevated/outlined/filled；原PNG都为4次切换后返回各case初始设计/明暗的default端点，不是全部Card矩阵。完整状态/尺寸/密度/环境仍pending，scope=filtered/complete=false，未批准baseline/canonical/verified。

18原生保留录像各只用Windows官方Playwright FFmpeg解码1/3和2/3两请求点，共36观察帧（内存查看，没有新PNG文件）。仅35帧有Card，Firefox MD3/light1.680s为加载预览；请求seek不是精确PTS，rAF时间也不是全部实际合成帧。没有完整播放录像。WebKit录像细字/边线像素较粗；Chromium Apple/dark2.293s有放大/右灰填充，不当作真实200%缩放或源Card几何缺陷。原容器video路径宿主不可读，录像SHA绑定原生HTML保留副本及对应case附件。

最终PNG没有错位配色、文字缺失或Card轮廓裁切。部分顶部有极细白/蓝边缘片段，frame不覆盖外部草稿控件完整焦点；其值/节点保持另有原生RAF行为证据。WebKit两张shadcn标题视觉更粗，本批没有fontWeight测量，不推断原因。

## 逐图与录像索引

- 0 | chromium | Card environment md3 light theme-retention | 0184f3e33b8f813a8f58-fe8d17aaa82ee83024da/chromium/0
  - 原PNG screens/rc-card/chromium/000001-6-actual.png；SHA256 87200882e659d38621e2fddb91a59f448aebfca417443025f2e7db0e935465da；native/HTML相同，已实际查看。
  - RAF default:11/10、elevated:12/12、outlined:10/10、filled:3/3（总帧/已提交帧），各项复核全部通过。
  - 录像 .website/review/20261030-card-theme-retention-linux-repair-1/report/data/951671793446bb5c8dbfcf39cd8ca7116e6d5e91.webm；SHA256 7668f6134be70182042577ba1083f6291f8cf266c112d5c09932aa7558ca1c47；176967 bytes；未完整播放。
  - 请求1.8s观察帧，SHA256 60ae536c54376bca4ddde4a7d8f08209b7c1dad966c7c01365c4315b0285c093：浅色default卡片，标题/正文/Meta及外部输入可见。
  - 请求3.6s观察帧，SHA256 a81b7f90ddccb0d8247ba95e2fa098c71474f8f16f9c001136c4d43cc3e4a6ed：深色filled卡片，浅色前景与灰色表面对应，未见白字落在浅底。
- 1 | firefox | Card environment md3 light theme-retention | 0184f3e33b8f813a8f58-fe8d17aaa82ee83024da/firefox/0
  - 原PNG screens/rc-card/firefox/000002-6-actual.png；SHA256 8934b43a2e9b6a27b34a3114283474bbe25bebfa699c315e961acf8be05b21e1；native/HTML相同，已实际查看。
  - RAF default:9/9、elevated:13/12、outlined:10/9、filled:3/3（总帧/已提交帧），各项复核全部通过。
  - 录像 .website/review/20261030-card-theme-retention-linux-repair-1/report/data/c6dce76c941f438db901d5d439291d00a2463295.webm；SHA256 36e203a8682b0d9cb7e18633853ae446edc42c6eca4a0631de8f9f618269ed00；142098 bytes；未完整播放。
  - 请求1.68s观察帧，SHA256 4262cc984eb6d93887612bcbe245aef7806bb479c724dfe414c791bf9359f268：仅“正在加载预览”准备帧，尚无Card，不能计组件外观验收。
  - 请求3.36s观察帧，SHA256 4cc9f02623e9c194675421c36a1af6e26eae694c952f733d9c4f288015027c3b：深色filled卡片与外部草稿输入可见，主次文字没有明显错色。
- 2 | webkit | Card environment md3 light theme-retention | 0184f3e33b8f813a8f58-fe8d17aaa82ee83024da/webkit/0
  - 原PNG screens/rc-card/webkit/000003-6-actual.png；SHA256 8f6b686403e35a4aefffc5b4bdb2ca932a16c7a6fdee0c5724aa3aadbdcc35b5；native/HTML相同，已实际查看。
  - RAF default:3/3、elevated:5/5、outlined:10/10、filled:4/3（总帧/已提交帧），各项复核全部通过。
  - 录像 .website/review/20261030-card-theme-retention-linux-repair-1/report/data/ba3261108d59a6eb314053caadfbbe248ab13863.webm；SHA256 85d8e22d35098c3d3d1b32c4f639488cb8e3b4840fa17cf2e6ed5ba15753d69f；156954 bytes；未完整播放。
  - 请求1.853s观察帧，SHA256 cc4c760beeefa0934927f6d6a38fd820d123e1138c582f76521965456aa5f064：深色default卡片可见；低分辨录像中文字/边线有锯齿，不能代替原PNG字形验收。
  - 请求3.707s观察帧，SHA256 ff82d3c4f22fdb30b7c93cc630ff628bbe159e10a8d52c049b822e4fbaec789c：深色filled卡片；同样只评录像低分辨可见范围。
- 3 | chromium | Card environment md3 dark theme-retention | 0184f3e33b8f813a8f58-89ca3fbb7b8500e7c815/chromium/0
  - 原PNG screens/rc-card/chromium/000004-6-actual.png；SHA256 fc01d1cbc7d1b279fc4ca79c3fa69185c501984968adde43e7937bb6160de11c；native/HTML相同，已实际查看。
  - RAF default:10/10、elevated:13/13、outlined:10/10、filled:3/3（总帧/已提交帧），各项复核全部通过。
  - 录像 .website/review/20261030-card-theme-retention-linux-repair-1/report/data/e480d51686ebab730209925e2ca157b62debb777.webm；SHA256 1e53ed8046a12a2afe7ea35cf7e6790b0cca26b51b54bd07fe8bf7947d48d215；149297 bytes；未完整播放。
  - 请求1.227s观察帧，SHA256 5ff00a03486862b3b234d508f66e31718daf3e3cdcb925b08b29c6c0c694ee50：深色elevated卡片与浅色文字可见。
  - 请求2.453s观察帧，SHA256 a15391f4d3693fca3373ab077bfced552c651e1109b27193a7c8d2e047bc26cc：深色default返回端点，Card及计数完整。
- 4 | firefox | Card environment md3 dark theme-retention | 0184f3e33b8f813a8f58-89ca3fbb7b8500e7c815/firefox/0
  - 原PNG screens/rc-card/firefox/000005-6-actual.png；SHA256 f6c3dfb3a97faf0b3c9cd8cb4e5db5bfbc7d9cfa6ee13c4ab54dd42effa5e432；native/HTML相同，已实际查看。
  - RAF default:10/9、elevated:12/12、outlined:11/9、filled:3/3（总帧/已提交帧），各项复核全部通过。
  - 录像 .website/review/20261030-card-theme-retention-linux-repair-1/report/data/095c2088ea0af3fbb8593ddfaffd1e828c5dc898.webm；SHA256 e2d7d869c5d19736b0bd967d15eacead1275aafb6b30767d4a7f440df01dd793；134092 bytes；未完整播放。
  - 请求1.133s观察帧，SHA256 d45b1f3b67981562457d426fcc37aa98eef726bfd522f2493ba18740804031c8：深色elevated卡片，正文与Meta可见。
  - 请求2.267s观察帧，SHA256 2b6df3a66fec5be94cf9030318ee3139ddba7c5f5081ee2d18638abddab0202f：深色default返回端点，外部草稿输入焦点可见。
- 5 | webkit | Card environment md3 dark theme-retention | 0184f3e33b8f813a8f58-89ca3fbb7b8500e7c815/webkit/0
  - 原PNG screens/rc-card/webkit/000006-6-actual.png；SHA256 fad658116f101441034171ab610a43e6fad1aab0d682d3ec4dc64253d2484bcf；native/HTML相同，已实际查看。
  - RAF default:8/8、elevated:13/13、outlined:10/10、filled:3/3（总帧/已提交帧），各项复核全部通过。
  - 录像 .website/review/20261030-card-theme-retention-linux-repair-1/report/data/e00e3f5ae7f5fc664a772971fb5bcc894cda01c1.webm；SHA256 0a121cf1515b29f717f143950a9d4d6db8e1d7560e672a120ee2498d600746b7；121440 bytes；未完整播放。
  - 请求1.093s观察帧，SHA256 f1c2eea3a8b39d05b5cc56815ac8323cc494cec0547ecd245f0f1510470a3a79：深色outlined卡片，文字和细边可见；录像边缘像素弱化。
  - 请求2.187s观察帧，SHA256 42a90e09565c0f8fa56549a2db947a5a1690613df26c11dc20e045715bd01243：深色default端点；录像字形细节弱，不替代PNG。
- 6 | chromium | Card environment apple light theme-retention | 0184f3e33b8f813a8f58-9c7e2f538efdecc74563/chromium/0
  - 原PNG screens/rc-card/chromium/000007-6-actual.png；SHA256 8e95571f09f64de6ca6c18cdc8775d3fe69854272323ca2724ff960493d122e8；native/HTML相同，已实际查看。
  - RAF default:13/13、elevated:10/9、outlined:13/13、filled:4/3（总帧/已提交帧），各项复核全部通过。
  - 录像 .website/review/20261030-card-theme-retention-linux-repair-1/report/data/d586878a9467749fd4d41eb877fcf4402b4f0a21.webm；SHA256 9e88488e16ed26dac0e2e46b355ac4c290f637493b6560ac7a5bb81434535872；166983 bytes；未完整播放。
  - 请求1.24s观察帧，SHA256 ecee8735726fd6c359f2fddf50998946346930b33e29a14df68a5e99cada2c44：浅色elevated卡片，深色前景和Meta灰字可见。
  - 请求2.48s观察帧，SHA256 715519371d4954a6bdaf0cec66809faab44389f5127f28603eb058903520236a：浅色default返回端点，细边和文字完整。
- 7 | firefox | Card environment apple light theme-retention | 0184f3e33b8f813a8f58-9c7e2f538efdecc74563/firefox/0
  - 原PNG screens/rc-card/firefox/000008-6-actual.png；SHA256 1961342d2df4cc657ec457f4cc1f29fc16514be40ca44fe43dab2adbbca4951b；native/HTML相同，已实际查看。
  - RAF default:13/12、elevated:10/9、outlined:12/12、filled:5/3（总帧/已提交帧），各项复核全部通过。
  - 录像 .website/review/20261030-card-theme-retention-linux-repair-1/report/data/b93e0596a5edfd50ad41563ddbfdb0e8fa9c3145.webm；SHA256 d0b598103a61c510517980278e09e84bda52bc2c8fdf357c069368ac2bb865ff；139343 bytes；未完整播放。
  - 请求1.053s观察帧，SHA256 a0be03255ae554b1fefe9e74235a219ee835cc1f0442c0ea757a2a417f254275：浅色elevated卡片，外部草稿控件可见。
  - 请求2.107s观察帧，SHA256 295452f26d4e54acff64609e329f4fed76bdf0d25ea3216ad270d27aa336c578：浅色default返回端点，主次文字层次可见。
- 8 | webkit | Card environment apple light theme-retention | 0184f3e33b8f813a8f58-9c7e2f538efdecc74563/webkit/0
  - 原PNG screens/rc-card/webkit/000009-6-actual.png；SHA256 cd1540b8b35131f3af8050e45eb4b9652c61bd28d4fef4e3c44a05b5a05c4b91；native/HTML相同，已实际查看。
  - RAF default:14/13、elevated:11/10、outlined:13/13、filled:3/3（总帧/已提交帧），各项复核全部通过。
  - 录像 .website/review/20261030-card-theme-retention-linux-repair-1/report/data/085f58da1b22641799e2598bbab53486963ca88b.webm；SHA256 4a4404f9c31e1aa2fe6c4d10b0996d6045f800bed0f66d8def8b3233c907434c；124947 bytes；未完整播放。
  - 请求1s观察帧，SHA256 6cad9e836d1c98b067ae19c7fb1a78a7e18534051228a994b61a1775a8a8dd43：浅色outlined卡片；录像边框和字形较弱，未见错色组合。
  - 请求2s观察帧，SHA256 5acaf4eca5c487a5baa79821c7124aa7e78f32ef2899dfd9f4c2e0ddff08e8d6：浅色default返回端点，压缩字形不作像素基准。
- 9 | chromium | Card environment apple dark theme-retention | 0184f3e33b8f813a8f58-804aa2a169d1f49c5a6a/chromium/0
  - 原PNG screens/rc-card/chromium/000010-6-actual.png；SHA256 8b1b85ae2b7756b30ff50f583b24da3de79c080d0f1786bc3ec4d24da1aa25ac；native/HTML相同，已实际查看。
  - RAF default:13/12、elevated:10/9、outlined:12/12、filled:3/3（总帧/已提交帧），各项复核全部通过。
  - 录像 .website/review/20261030-card-theme-retention-linux-repair-1/report/data/fe633fab320214cc1bb1d3c1bd26be6375441203.webm；SHA256 cc6358bdcf64fc26945a49df15b27acb7c53e1bf104ea04b2befc5e1a53b0ebb；149427 bytes；未完整播放。
  - 请求1.147s观察帧，SHA256 c04fb176da32103f47e37a1e5a103ba58ee22450453772b10cf13dd5517b3cf1：深色outlined卡片，正文/Meta浅字与暗底对应。
  - 请求2.293s观察帧，SHA256 2cd4f2806d70c024a2410bbd9aca47a4bbe5440e467e970bea13ea5adfca4533：Card画面明显放大且右侧灰填充，仍可见完整Card和计数；原因未定位，不当作真实200%缩放或同几何比较证据。
- 10 | firefox | Card environment apple dark theme-retention | 0184f3e33b8f813a8f58-804aa2a169d1f49c5a6a/firefox/0
  - 原PNG screens/rc-card/firefox/000011-6-actual.png；SHA256 22f5373d6d6f66f8162e04d86694312c3a798903aa2c58dc0b33e5ba30d92b7f；native/HTML相同，已实际查看。
  - RAF default:13/12、elevated:9/9、outlined:12/12、filled:5/3（总帧/已提交帧），各项复核全部通过。
  - 录像 .website/review/20261030-card-theme-retention-linux-repair-1/report/data/659c912668aabb94546148a4ef6221ec623c10f5.webm；SHA256 d7b3913559e105bfdb67f70aa22a9f265b017da950e44d68982d27c4ff59231e；143466 bytes；未完整播放。
  - 请求1.187s观察帧，SHA256 24074e9dfb32772a98475bf44bf418b81830d4feba41d8a0b6e14ada5de02c61：深色elevated卡片，面板边界较弱但文字可见。
  - 请求2.373s观察帧，SHA256 0ce82dd2b3adde935cffcece44ce85f80bc43da2d8818657223e9e06f8993f85：深色default返回端点，细边和浅色文字完整。
- 11 | webkit | Card environment apple dark theme-retention | 0184f3e33b8f813a8f58-804aa2a169d1f49c5a6a/webkit/0
  - 原PNG screens/rc-card/webkit/000012-6-actual.png；SHA256 99cfd69e4382cfaa3e0d4de8aac99bff0835a5a54862b2a1d689e384d898fd75；native/HTML相同，已实际查看。
  - RAF default:13/13、elevated:10/10、outlined:13/13、filled:3/3（总帧/已提交帧），各项复核全部通过。
  - 录像 .website/review/20261030-card-theme-retention-linux-repair-1/report/data/5369c01efd944cef59d38c2ce5f447b17eadc0f8.webm；SHA256 e2d227e98a61350b5eda8315dc553c8e941975a4b241da36d2efd2c80fe7fadb；129736 bytes；未完整播放。
  - 请求0.973s观察帧，SHA256 ddb7ce661a00fbf7ab3c23cfa274c0a3861e660d9061a6030cc2f940f43966fa：深色outlined卡片，录像字形/边线锯齿，主次文字可见。
  - 请求1.947s观察帧，SHA256 f073b4b0037511f6f46887f5b688e8a593088738f62ca3cf98ec699bd0eb8c8d：深色default返回端点，未见浅底浅字混配。
- 12 | chromium | Card environment shadcn light theme-retention | 0184f3e33b8f813a8f58-37a2b74341be95d8b2da/chromium/0
  - 原PNG screens/rc-card/chromium/000013-6-actual.png；SHA256 b40c8c143c0d053f8822c04e412e790e2a230f3147a98d3f7e04f46e23ea34e5；native/HTML相同，已实际查看。
  - RAF default:13/12、elevated:13/12、outlined:13/13、filled:3/3（总帧/已提交帧），各项复核全部通过。
  - 录像 .website/review/20261030-card-theme-retention-linux-repair-1/report/data/7282e88b5efba7798b482acf7762af51689c3b2d.webm；SHA256 a9cc161b4e9b8d2b84fb54db9696feeb37035a64699655b7e9054f284a3d57b4；140351 bytes；未完整播放。
  - 请求1.347s观察帧，SHA256 e14ce18d71b183c8be195bc2873b586e9ea0031a88755c8eadd5771a557c39ec：浅色elevated卡片，深色标题/正文和次要文字可见。
  - 请求2.693s观察帧，SHA256 cd9bb053637c928fa33ec776d4cc170b53d48609143033c068ec95052f757472：浅色default返回端点，完整Card边界。
- 13 | firefox | Card environment shadcn light theme-retention | 0184f3e33b8f813a8f58-37a2b74341be95d8b2da/firefox/0
  - 原PNG screens/rc-card/firefox/000014-6-actual.png；SHA256 a26d55df61c8f5f338634b1c16b52038c8f03b5f2627cf78ec9cb88255d877da；native/HTML相同，已实际查看。
  - RAF default:13/12、elevated:12/12、outlined:14/12、filled:5/3（总帧/已提交帧），各项复核全部通过。
  - 录像 .website/review/20261030-card-theme-retention-linux-repair-1/report/data/67d620ba7f3a2a6deafcc9d82bbd2488d95fabd7.webm；SHA256 88abf825f61e5467ca7642ef3fac49c2f0773ba1ce611825ea4a1663b81dd385；130527 bytes；未完整播放。
  - 请求1.347s观察帧，SHA256 a4c3d326d8fd7c4217422164e2b9914ab0d7787d800e3e56c041abda5fed7213：浅色elevated卡片，内容与草稿输入可见。
  - 请求2.693s观察帧，SHA256 1d3b1fb20f89585487b3247400e3d03304f21ac0aadac9943297b963ee7a795f：浅色default返回端点，完整Card及计数。
- 14 | webkit | Card environment shadcn light theme-retention | 0184f3e33b8f813a8f58-37a2b74341be95d8b2da/webkit/0
  - 原PNG screens/rc-card/webkit/000015-6-actual.png；SHA256 452ffd3e0cd827ce4e5a174d755b99829bde7b2300a11b42ce037fc96ae4af6c；native/HTML相同，已实际查看。
  - RAF default:13/13、elevated:13/13、outlined:12/12、filled:3/3（总帧/已提交帧），各项复核全部通过。
  - 录像 .website/review/20261030-card-theme-retention-linux-repair-1/report/data/f42ac7f65bd683217677e274a1230c78b3768a6d.webm；SHA256 c54307a182ae77b7b6a00281f94b4b5a81fcd211f15f20ffe1b65559b23cdbdd；125170 bytes；未完整播放。
  - 请求1.08s观察帧，SHA256 409659789defad4dbd0e6a8847fd9e438f315d6873184598db423d7b99c9e37c：浅色outlined卡片，标题视觉较粗；录像细字较弱。
  - 请求2.16s观察帧，SHA256 5489cf06923305b604792a7a27874874d1f02155a5296e1f9e5f155e0447af71：浅色default返回端点，较粗标题和正文均可见。
- 15 | chromium | Card environment shadcn dark theme-retention | 0184f3e33b8f813a8f58-b6953c2f1092aac26a78/chromium/0
  - 原PNG screens/rc-card/chromium/000016-6-actual.png；SHA256 c97a0e188f142caa408c12fcf49bed28bf4fd50f0068a627e21e609989d00509；native/HTML相同，已实际查看。
  - RAF default:13/12、elevated:14/13、outlined:13/12、filled:4/3（总帧/已提交帧），各项复核全部通过。
  - 录像 .website/review/20261030-card-theme-retention-linux-repair-1/report/data/1fe89a69ec69ce38e567d07d8b9e2ca4f21a71f2.webm；SHA256 681ecf823ab775cfca69421e703d40d9de82663d674544c6eb89b85c82df1e1c；155794 bytes；未完整播放。
  - 请求1.36s观察帧，SHA256 0a933f922c016035ee7c6c96c8bf312e8f6ffb97224c31eceefc916154303f5f：深色elevated卡片，浅色前景与深色表面对应。
  - 请求2.72s观察帧，SHA256 88c64b6db0b1e83275c6e615d0aadf9d17bf62c78d353ff386a2d99a89265461：深色default返回端点，Card与计数可见。
- 16 | firefox | Card environment shadcn dark theme-retention | 0184f3e33b8f813a8f58-b6953c2f1092aac26a78/firefox/0
  - 原PNG screens/rc-card/firefox/000017-6-actual.png；SHA256 5edae6904677701a1267eead7b9bedf45876bc9c766615d0bc05c87a24feee57；native/HTML相同，已实际查看。
  - RAF default:12/12、elevated:12/12、outlined:14/12、filled:5/3（总帧/已提交帧），各项复核全部通过。
  - 录像 .website/review/20261030-card-theme-retention-linux-repair-1/report/data/70ed7c97a032f718c2d4213e596f544500b8dc7b.webm；SHA256 6025fd49735df1a7c15fdf9444331bb0ec9ea667fb8ce317289b03284abc92db；131295 bytes；未完整播放。
  - 请求1.333s观察帧，SHA256 bc05c04db5b68b7eb92834168eaba0adb857db23b17ff69048332f5e5741c880：深色elevated卡片，正文和Meta层次可见。
  - 请求2.667s观察帧，SHA256 0d0508ab16ad0624ba8b20e24ed9840a292710d57a73f330806d8349120f40de：深色default返回端点，未见旧浅底配新浅字。
- 17 | webkit | Card environment shadcn dark theme-retention | 0184f3e33b8f813a8f58-b6953c2f1092aac26a78/webkit/0
  - 原PNG screens/rc-card/webkit/000018-6-actual.png；SHA256 b87c7fa0f24fd352d1fcf23b4fc0fb1326f8020de05e4dffa32c114ce453b201；native/HTML相同，已实际查看。
  - RAF default:14/13、elevated:14/13、outlined:12/12、filled:3/3（总帧/已提交帧），各项复核全部通过。
  - 录像 .website/review/20261030-card-theme-retention-linux-repair-1/report/data/794ad89070bb7aa023fda360a0a05fee433072a5.webm；SHA256 f51e3401c0491ccc6c79c8aa340595ea4c0b0f76fb702264574c4fdc67acf987；135271 bytes；未完整播放。
  - 请求1.24s观察帧，SHA256 fbf8ab871f92e6075756fc8f93896c9bb0a8aff827fa05cb463fb380670e2df4：深色outlined卡片，标题较粗，录像字形/边线弱化。
  - 请求2.48s观察帧，SHA256 876860a1174b1d1ffcfffdeaa38c16062330a75839f36fc433083a3af32c62c3：深色default返回端点，Card文本完整可见。
