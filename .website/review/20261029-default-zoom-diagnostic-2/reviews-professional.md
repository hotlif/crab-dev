# Professional review: default and real 200%

逐张查看 BarChart24 / Canvas12 张原始 PNG，全部为 Chromium。源与产物绑定旧隔离 Linux 快照，不能替代后续 owner DI、Realm 网络或 BarChart 密度修正后的候选。没有更新 baseline、verified 或原 cases.json。

Source: sha256:c5ea450017e600100fe1cccf61ab8003a6e66f30194bb43af96bfb2e0f06d855
Artifact: sha256:d411fe4077d7249e9800da4d85e8021dc80de63ce35104f0d57a7af0a5c89856

原全量运行因35项失败提前停止；框架原始 skipped=1969，细分为1967项未跑与2项中断；这里的36项原生检查通过不代表全库通过。四份相关worker的before/after、清单摘要及36张PNG SHA均匹配。

- 18张BarChart默认图：真实8柱/图例/网格/110目标线可见，但各设计明暗下三档密度图逐字节相同，记为pending-density-contract。
- 6张BarChart真实200%：4柱/首柱焦点/提示/目标线可见；只接受观察到的viewport，未接受被裁出的完整宿主操作区或淡化数值的文字对比度。
- 12张Canvas：实际字形、矩形、长虚线均出现；默认/200%分别记录。shadcn中性图形边界偏弱，保留对比度复核事项。未把默认帧算成编辑/拖动等状态验收。

| Case | 原图 SHA-256 | 结论 |
| --- | --- | --- |
| 5e5c3f0dbbeaf8e6af3d-1146dbbf3792bd6b749a/chromium/0 · md3 light chart at real 200% | c5e79e46fd276ee282b44753d04422a62180adc65cb4e66dc88859c5dc50242f | accepted-observed-presentation-with-followups |
| 5e5c3f0dbbeaf8e6af3d-77899412a8fccee5c686/chromium/0 · md3 dark chart at real 200% | 6fb372639b22f33a0115e0b2024ad242b7febe88ff1df33691ee19e135f0ed34 | accepted-observed-presentation-with-followups |
| 5e5c3f0dbbeaf8e6af3d-d142053e0f9ae591326e/chromium/0 · apple light chart at real 200% | ba996c8135f3fabe58e506a01cafc82f381e8ab5f4cd1443466a268db9963cf0 | accepted-observed-presentation-with-followups |
| 5e5c3f0dbbeaf8e6af3d-091a962ff86e1c35a529/chromium/0 · apple dark chart at real 200% | aa8958440ce8e42c1fe5d3a1a07e80e87f55284d77acc538def72edc37cf8bf7 | accepted-observed-presentation-with-followups |
| 5e5c3f0dbbeaf8e6af3d-ec7084b9fa32cfbc6b10/chromium/0 · shadcn light chart at real 200% | c94c1551e59ea7b3476677f59354823c9f2c3c5418fd4cd98edb3ee5acb4de61 | accepted-observed-presentation-with-followups |
| 5e5c3f0dbbeaf8e6af3d-496f65f1b6362f9d8937/chromium/0 · shadcn dark chart at real 200% | 4e5bee29543e336b820cfd1a8fa773e0fd6704707feb5fc6881122133387891d | accepted-observed-presentation-with-followups |
| c01e53bc109454311a0d-87f5f117a14996bed4bb/chromium/0 · md3 light medium compact default | 9e4aa29db067bbe43579aedf8abadd9f64ecadf8be61255de0861039f49d760e | pending-density-contract |
| c01e53bc109454311a0d-7c950821b2aa80bdbb60/chromium/0 · md3 light medium standard default | 9e4aa29db067bbe43579aedf8abadd9f64ecadf8be61255de0861039f49d760e | pending-density-contract |
| c01e53bc109454311a0d-822dd43c2b62132450b9/chromium/0 · md3 light medium comfortable default | 9e4aa29db067bbe43579aedf8abadd9f64ecadf8be61255de0861039f49d760e | pending-density-contract |
| c01e53bc109454311a0d-babbae995eb3095ac967/chromium/0 · md3 dark medium compact default | a0e136499e282cc563d218b40146788592cd4576296a240217458c478baf487f | pending-density-contract |
| c01e53bc109454311a0d-95123e0aa8fb3d143704/chromium/0 · md3 dark medium standard default | a0e136499e282cc563d218b40146788592cd4576296a240217458c478baf487f | pending-density-contract |
| c01e53bc109454311a0d-f7127b8e1695e1d5fd69/chromium/0 · md3 dark medium comfortable default | a0e136499e282cc563d218b40146788592cd4576296a240217458c478baf487f | pending-density-contract |
| c01e53bc109454311a0d-6e4943f65588c037c6cc/chromium/0 · apple light medium compact default | d744470de734b082cbe5698edfa09726b50394012f00ec9cdfc7bab10d7f8627 | pending-density-contract |
| c01e53bc109454311a0d-a3cfddff3c2368fcfcb6/chromium/0 · apple light medium standard default | d744470de734b082cbe5698edfa09726b50394012f00ec9cdfc7bab10d7f8627 | pending-density-contract |
| c01e53bc109454311a0d-fc3a49ad34deb134313f/chromium/0 · apple light medium comfortable default | d744470de734b082cbe5698edfa09726b50394012f00ec9cdfc7bab10d7f8627 | pending-density-contract |
| c01e53bc109454311a0d-3a131b76ee0e4737d034/chromium/0 · apple dark medium compact default | c04c2738122d1eb768e0e4c37dddd5d99275549980e9d5f483e66dabcac61b91 | pending-density-contract |
| c01e53bc109454311a0d-75ddff6e7bde8dfb3183/chromium/0 · apple dark medium standard default | c04c2738122d1eb768e0e4c37dddd5d99275549980e9d5f483e66dabcac61b91 | pending-density-contract |
| c01e53bc109454311a0d-73060689006b2ae13bff/chromium/0 · apple dark medium comfortable default | c04c2738122d1eb768e0e4c37dddd5d99275549980e9d5f483e66dabcac61b91 | pending-density-contract |
| c01e53bc109454311a0d-bf5598105f403122ebdf/chromium/0 · shadcn light medium compact default | 7499573b8e0cfeab000fac8ff9f50e8b42ded9286b69b0feb23cb1fe927027ad | pending-density-contract |
| c01e53bc109454311a0d-d08ee3ca17702e807030/chromium/0 · shadcn light medium standard default | 7499573b8e0cfeab000fac8ff9f50e8b42ded9286b69b0feb23cb1fe927027ad | pending-density-contract |
| c01e53bc109454311a0d-ff005e857c22dd46f569/chromium/0 · shadcn light medium comfortable default | 7499573b8e0cfeab000fac8ff9f50e8b42ded9286b69b0feb23cb1fe927027ad | pending-density-contract |
| c01e53bc109454311a0d-ce08f2adc2eedd6a8353/chromium/0 · shadcn dark medium compact default | 7731e293f6fca51e42ece0f8e9a878fe49553c497556b0e086eacfcf7d7c2fdc | pending-density-contract |
| c01e53bc109454311a0d-c7548e804899d6b1199d/chromium/0 · shadcn dark medium standard default | 7731e293f6fca51e42ece0f8e9a878fe49553c497556b0e086eacfcf7d7c2fdc | pending-density-contract |
| c01e53bc109454311a0d-c26286f6665303b75cbc/chromium/0 · shadcn dark medium comfortable default | 7731e293f6fca51e42ece0f8e9a878fe49553c497556b0e086eacfcf7d7c2fdc | pending-density-contract |
| 0146f274ee4bb5d0d5c6-f39e6196e3690a79da26/chromium/0 · md3 light real 200% | ba096843b0884c02065fa03775e0f27d6df4b19ddeb93897952b7cffa76d2e17 | accepted-observed-presentation-with-followups |
| 0146f274ee4bb5d0d5c6-7fdbff31a5f6c20cadfd/chromium/0 · md3 dark real 200% | 29d4aaaa8834716f7fb23cd566d1c0f4c438baf5ca32ca6eb8cdb2b51c57e2b5 | accepted-observed-presentation-with-followups |
| 0146f274ee4bb5d0d5c6-ed95aea38d50a3b4e942/chromium/0 · apple light real 200% | 750ca8d7774f3667e60751887c480291e26567df28d06c96308b5452866aae49 | accepted-observed-presentation-with-followups |
| 0146f274ee4bb5d0d5c6-21da27bb3c0085fd6d31/chromium/0 · apple dark real 200% | 7209d6598cc6cba4844953c02756857d47ef284fff5ac81b32544caeddd8e093 | accepted-observed-presentation-with-followups |
| 0146f274ee4bb5d0d5c6-990a20fcd05f0cb0d37b/chromium/0 · shadcn light real 200% | a8fa6375182eab7ee135b77487b98cf1b42d10ed6e49a30aa6cff9983f6622cc | accepted-observed-presentation-with-followups |
| 0146f274ee4bb5d0d5c6-9b14b4c111f3ec87fea3/chromium/0 · shadcn dark real 200% | ac97c7afaca8bdde95ba97010b00f17c9ead37e506cd656d20479adb7a55d90a | accepted-observed-presentation-with-followups |
| b1bc45b6f6f997f2003d-c83d644b7d737e30dbaf/chromium/0 · md3 light default | 8f91da8f92e0cbe3b4d8efa66c372262839f5bfaa8456c07f7d36ce1d2ec17f8 | accepted-observed-presentation-with-followups |
| b1bc45b6f6f997f2003d-35f73948f3935ac5ff7c/chromium/0 · md3 dark default | 8d52bd9f806d866db5049eeb0727e7c24de2a5c6c4dc1442b64ebbfddc172f50 | accepted-observed-presentation-with-followups |
| b1bc45b6f6f997f2003d-cd0e2c731842d9aa5e12/chromium/0 · apple light default | a195423d441bdcb29424997c8d18e43666faa3c18c03e129262ce19f28eea2c3 | accepted-observed-presentation-with-followups |
| b1bc45b6f6f997f2003d-935930b8a1836b4c649d/chromium/0 · apple dark default | 8f3aa7adf8ae36c2f027eda23f8a9f7444d9cdd34272383ea75064c88c4b718b | accepted-observed-presentation-with-followups |
| b1bc45b6f6f997f2003d-07ace4daeac4be95a9ab/chromium/0 · shadcn light default | 38a7309e8bd7c1ae80889ea31df005dfacdde7167698821cd10a3bbea7098388 | accepted-observed-presentation-with-followups |
| b1bc45b6f6f997f2003d-64b6de4138abb7a36784/chromium/0 · shadcn dark default | 11ae7df1cea137000925fd020979081d5918c884edd1dd8d143e99a2be8388d1 | accepted-observed-presentation-with-followups |

逐项观察、图片尺寸、输入审计与相同密度分组见 reviews-professional.json。
