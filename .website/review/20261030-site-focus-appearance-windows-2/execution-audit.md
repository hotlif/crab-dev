# 站点第二批 Windows 执行证据审计

只读核对本批与原生报告及第1批证据；未看图批准、未改源/采集/构建、未建立基准或verified。

真实范围：36/36 passed，18 appearance+18 navigation，全部Chromium/Windows-native，0 skipped/unexpected/flaky，顶层errors0。共138 PNG、18 video、36条三时刻time-series记录，均与原生附件及导出SHA对应。110个原生HTML report文件及11个root记录逐文件字节相同；4个worker的source/artifact/完整siteBuild前后稳定。

与第1批比较：实际产品资产及完整siteBuild的指纹和每个文件hash均完全相同：true/true。源码从`sha256:233a188b4f1fab60925de9affbd22c76e13aea0b303b23031bf57471086a3e65`变为`sha256:4873b5ae3ae75e1ba5f1bf8d8dcae4ec72e361865304e630f8e5673fb36c31c7`，差异逐文件如下，属于测试/工程契约/文档修正，不是runtime UI改变：

| 文件 | 首批SHA | 二批SHA |
| --- | --- | --- |
| .website/docs/guides/contributing.mdx | bcdd7b4b053ebb1851bbdf35f76a44f65b49aadb32beb546ca96e3bfcac3dc87 | 981e38d6c703a46401ddea0386620b8a5304106f24edafa34c2a27217d2fdef7 |
| .website/docs/site/site-navigation.visual.spec.mjs | 45f3d5b4bf8330af8b00b81e0c982cf068ae412207dc897cac7385cf2bcace00 | 7722f339c4cfac6c1e12be3f71d0a38942c1a93868c16cd7faa253c4f9af8e35 |
| scripts/visual-contract.test.mjs | e891abdc1b58937c673a19dcd0e61e1966f32721b9ad9c2e7eefddf880e430f9 | 57c098e402d1c5a905a362a42bad1f953f98cffdd63c41fdc3d70b7ec7854e3b |
| scripts/visual/matrix-contract.mjs | 1d49ee55618caf66123236577a44bda7a4770c53b67fa16d95172f19adb3006a | 5029c4eaa9dbb3d1a8c3e38b523bb2128ca682a90d8f8b957d0f444fdd3f3b03 |

首批已封存execution-audit的SHA仍匹配既有锚点；其226个文件和174 PNG再次逐文件核对未变。旧批仍是18通过/18失败，不回写任何旧source指纹或将旧失败改成通过。

| 按图片实际渲染体系分组 | 全部图片 | 自然时间序列帧 | 导航过程capture |
| --- | ---: | ---: | ---: |
| md3 | 46 | 36 | 10 |
| apple | 46 | 36 | 10 |
| shadcn | 46 | 36 | 10 |

分派见design-image-index.json。每张图明确caseInitialConfig与renderedConfig、phase、engine、viewportPixels、attachmentIndex、snapshotTarget-role和hash。appearance-live前54帧在next设计+翻转明暗，tutorial-live后54帧恢复initial；导航30图维持initial。不能用case标题代替实际配置，也不能把108自然帧、视频时间序列或Windows-native candidate当静态golden。此处只准备逐图审查范围，不替代真实view_image/视频外观核对。

本批138 PNG均无failure/blank诊断图；首批36诊断图原样保留其原角色。导航修复在本批18例实际通过，此前同一错误签名只说明旧前提错误，不能改写旧结果。完整siteBuild仍`sha256:49e777a2a23e7732e5b17e077b53ce172e692c995ae68f3d7a1bc34d46963dd0`，artifact仍`sha256:caaa2e325183ae7c996c04ca4f771c13c77aa1ac188dea3485041171368aa719`。

审计一致性问题0，详见execution-audit.json。

视频边界补记：18段原生视频各自跨越next+flip与恢复initial两个阶段，不能整段按初始case标签分派设计；本审计只校验视频hash/原生绑定，不新增视频外观评审。design-image-index已按逐张PNG实际阶段分组，其内容在交付分派后未再修改。
