# MD3 科学锁定定向原图复审

已实际逐张view_image查看40原PNG（重复也逐项查看）：Chromium24、Firefox8、WebKit8。仅科学只读/禁用，C覆盖浅深色与三尺寸，FF/WK覆盖浅深色medium；两外观均有独立交互截图。未见新增明显外观缺陷。

主数字1.25×10³、上标、浮动标签、轮廓开口、filled标签/数值和说明均完整。禁用内容和步进器呈弱化外观；静态图本身不能证明禁用语义、命中或键盘行为。引擎间字形/宽度差异单独保留，不做跨引擎像素互比。

source sha256:d8b989f07b3c96a70b995c70a1ebb8f698e6ee0e4fbfa63b92dcb12558265315
artifact sha256:6d245e97aa2cca11777ec8befc201c58c53e1a86a135fb744f206f22b8b53a6f
原生results SHA 523618f1366cc9650e35ed15f7fbc42c63d095f49db09153643cd0f1a08ae976
原生HTML SHA bbf16b18084c6cc778b7be8e3e4dcb0ef348c3cd449b4f4f9ad1a06f635958de

3份worker来源/产物前后稳定且core SHA均为修复后29bd68…；每图SHA、native JSON body、精确HTML PNG附件均字节一致。原生测量分别确认disabled/readOnly、1.25e+3与trusted wheel；所有10个MD3科学禁用case的HTML实际步骤均在两外观执行selector失焦、ArrowUp后状态/disabled核对以及截图前状态/disabled核对。选择器不在截图裁切内，状态保持结论来自这些已执行断言，不能称为图上所见。

| Case / 引擎 / 明暗 / 尺寸 / 状态 | 交互外观 | 原PNG | 实际尺寸 | SHA-256 | 逐图结论 |
| --- | --- | --- | --- | --- | --- |
| de8ba6359ae09f9a88d6-c9f99779c553bdba58ae/chromium/0 / chromium/light/small/scientific-read-only | outlined | screens/rc-number-edit/chromium/000001-4-actual.png | 332×230 | 3afc8de2fb52b4ec7cd07bb55297efb327d96010633743b84709c50227a3e97c | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-c9f99779c553bdba58ae/chromium/0 / chromium/light/small/scientific-read-only | filled | screens/rc-number-edit/chromium/000001-9-actual.png | 332×230 | 464a9ae0f9c6b7a351a87bbeba34c364ab660fc9369d29b8bcf2a2458e9f9413 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-7b746c1649dfd4d7557b/chromium/0 / chromium/light/small/scientific-disabled | outlined | screens/rc-number-edit/chromium/000002-4-actual.png | 332×230 | 846a1f8be93f2e0e3124a82032ea6c9a2182fe77c2b5c20fa85df6683cd002c0 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-7b746c1649dfd4d7557b/chromium/0 / chromium/light/small/scientific-disabled | filled | screens/rc-number-edit/chromium/000002-9-actual.png | 332×230 | 846a1f8be93f2e0e3124a82032ea6c9a2182fe77c2b5c20fa85df6683cd002c0 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-221c89f60cfa92eaa65c/chromium/0 / chromium/light/medium/scientific-read-only | outlined | screens/rc-number-edit/chromium/000003-4-actual.png | 338×230 | a26e576b0a052e50ce2b3dbd01b5df64f2a12009e5ba88eb2ae1605dbecf9ebc | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-221c89f60cfa92eaa65c/chromium/0 / chromium/light/medium/scientific-read-only | filled | screens/rc-number-edit/chromium/000003-9-actual.png | 338×230 | fa441ac248e2da6cd668a89b849ac535d74d2bd3254b10b9204d29c6e560406f | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-221c89f60cfa92eaa65c/firefox/0 / firefox/light/medium/scientific-read-only | outlined | screens/rc-number-edit/firefox/000004-4-actual.png | 346×230 | 175632a236e6633251daebb02d6b6b997900c6f0f36227cb243bb1e2a2acdda6 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-221c89f60cfa92eaa65c/firefox/0 / firefox/light/medium/scientific-read-only | filled | screens/rc-number-edit/firefox/000004-9-actual.png | 346×230 | b1de6788854092c7de69c8a514fd5abbb7d4c694bb70ef85d59d952017afd33c | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-221c89f60cfa92eaa65c/webkit/0 / webkit/light/medium/scientific-read-only | outlined | screens/rc-number-edit/webkit/000005-4-actual.png | 340×230 | 7c519b4648c57092c53c71e604d666f22eaf9d0d916b4b5ec09e6f6e3ef4ce76 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-221c89f60cfa92eaa65c/webkit/0 / webkit/light/medium/scientific-read-only | filled | screens/rc-number-edit/webkit/000005-9-actual.png | 340×230 | 366e9fa7a4467b4b3929d08e58a837053092f470e77eef2df087ecede52dd3ff | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-37838ad01730e73d33e3/chromium/0 / chromium/light/medium/scientific-disabled | outlined | screens/rc-number-edit/chromium/000006-4-actual.png | 338×230 | ad00193634c721456c3bb3e2d8bf6e200bd7eb18a26314e6d10d633aef7ccc77 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-37838ad01730e73d33e3/chromium/0 / chromium/light/medium/scientific-disabled | filled | screens/rc-number-edit/chromium/000006-9-actual.png | 338×230 | ad00193634c721456c3bb3e2d8bf6e200bd7eb18a26314e6d10d633aef7ccc77 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-37838ad01730e73d33e3/firefox/0 / firefox/light/medium/scientific-disabled | outlined | screens/rc-number-edit/firefox/000007-4-actual.png | 346×230 | 50179130ac6971d819d36e2907f90cb5a292aca0caf7619f9f66c58a58017e27 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-37838ad01730e73d33e3/firefox/0 / firefox/light/medium/scientific-disabled | filled | screens/rc-number-edit/firefox/000007-9-actual.png | 346×230 | 50179130ac6971d819d36e2907f90cb5a292aca0caf7619f9f66c58a58017e27 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-37838ad01730e73d33e3/webkit/0 / webkit/light/medium/scientific-disabled | outlined | screens/rc-number-edit/webkit/000008-4-actual.png | 340×230 | 5c0f9419f79c05bca3ff24fefae6cd424c83356c73f3b1fbf374c2bed0b87476 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-37838ad01730e73d33e3/webkit/0 / webkit/light/medium/scientific-disabled | filled | screens/rc-number-edit/webkit/000008-9-actual.png | 340×230 | 5c0f9419f79c05bca3ff24fefae6cd424c83356c73f3b1fbf374c2bed0b87476 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-96e291870c8999bcc203/chromium/0 / chromium/light/large/scientific-read-only | outlined | screens/rc-number-edit/chromium/000009-4-actual.png | 346×230 | f3630f55746f20195252bea042917ca0a220a1c1bff05c7ce6751e026e1442be | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-96e291870c8999bcc203/chromium/0 / chromium/light/large/scientific-read-only | filled | screens/rc-number-edit/chromium/000009-9-actual.png | 346×230 | 6a59b7e0fd39e780b3de4bd137069f2a13b8f00dfbcc68d48f7bec8c567ee6c0 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-3b39db6fe4da681f3456/chromium/0 / chromium/light/large/scientific-disabled | outlined | screens/rc-number-edit/chromium/000010-4-actual.png | 346×230 | 791ec32695df7e16d9dbd3de1db9ee5d2f40d9502c1527962701a62589908002 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-3b39db6fe4da681f3456/chromium/0 / chromium/light/large/scientific-disabled | filled | screens/rc-number-edit/chromium/000010-9-actual.png | 346×230 | 791ec32695df7e16d9dbd3de1db9ee5d2f40d9502c1527962701a62589908002 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-89e24212e66efbc7c560/chromium/0 / chromium/dark/small/scientific-read-only | outlined | screens/rc-number-edit/chromium/000011-4-actual.png | 332×230 | 1538ccd0297225a494a97f05c221e683e5ac055daf68a5b7a714b643af87a8eb | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-89e24212e66efbc7c560/chromium/0 / chromium/dark/small/scientific-read-only | filled | screens/rc-number-edit/chromium/000011-9-actual.png | 332×230 | 797a9f50f7e95183151aa48982a5f22db5f3ab4ca67aadd93663fa147b0b589a | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-e2e1c6b060235304959f/chromium/0 / chromium/dark/small/scientific-disabled | outlined | screens/rc-number-edit/chromium/000012-4-actual.png | 332×230 | 21d3e1dc9881853d3ba061b2fbadc6d751159a0ea239f54f467164cbddee593d | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-e2e1c6b060235304959f/chromium/0 / chromium/dark/small/scientific-disabled | filled | screens/rc-number-edit/chromium/000012-9-actual.png | 332×230 | 21d3e1dc9881853d3ba061b2fbadc6d751159a0ea239f54f467164cbddee593d | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-01e887fd60e9032a938d/chromium/0 / chromium/dark/medium/scientific-read-only | outlined | screens/rc-number-edit/chromium/000013-4-actual.png | 338×230 | 0958371153c945c1b4c84c7fa5c755a60f1b31d8748471d0bfad8863a62102b6 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-01e887fd60e9032a938d/chromium/0 / chromium/dark/medium/scientific-read-only | filled | screens/rc-number-edit/chromium/000013-9-actual.png | 338×230 | 6942a7ce0c3d4ce37b8b28634f24ea52d4d6deea4dd02869c629dc262d9dfa55 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-01e887fd60e9032a938d/firefox/0 / firefox/dark/medium/scientific-read-only | outlined | screens/rc-number-edit/firefox/000014-4-actual.png | 346×230 | 1b79118f4ff9a6e12800ac2506c138125a3b6ed900595db792411865179cdaa5 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-01e887fd60e9032a938d/firefox/0 / firefox/dark/medium/scientific-read-only | filled | screens/rc-number-edit/firefox/000014-9-actual.png | 346×230 | 5c194d63b66df5e5790f397ab461c14d10f44098197a2de3b731be0bbc1c7c57 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-01e887fd60e9032a938d/webkit/0 / webkit/dark/medium/scientific-read-only | outlined | screens/rc-number-edit/webkit/000015-4-actual.png | 340×230 | aefe642fed171ab02e0ad1a0cfe1f6bee0ab825f4b842b9c7117dff26aacf93c | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-01e887fd60e9032a938d/webkit/0 / webkit/dark/medium/scientific-read-only | filled | screens/rc-number-edit/webkit/000015-9-actual.png | 340×230 | 10e5dd17993d42b6b89369fc2d2ad05a8078dbc25e27eafa8a1fedb19316ebc3 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-6c5a170d0e76518e1d37/chromium/0 / chromium/dark/medium/scientific-disabled | outlined | screens/rc-number-edit/chromium/000016-4-actual.png | 338×230 | 69d87ff0c0b92f18d26dfae54f729e7822ec4541c9de4af119c51c52b5de0ea0 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-6c5a170d0e76518e1d37/chromium/0 / chromium/dark/medium/scientific-disabled | filled | screens/rc-number-edit/chromium/000016-9-actual.png | 338×230 | 69d87ff0c0b92f18d26dfae54f729e7822ec4541c9de4af119c51c52b5de0ea0 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-6c5a170d0e76518e1d37/firefox/0 / firefox/dark/medium/scientific-disabled | outlined | screens/rc-number-edit/firefox/000017-4-actual.png | 346×230 | a5d82b6971b58f073eff5f28b31520adc444b32d247a769c1bce4bd25e415a45 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-6c5a170d0e76518e1d37/firefox/0 / firefox/dark/medium/scientific-disabled | filled | screens/rc-number-edit/firefox/000017-9-actual.png | 346×230 | a5d82b6971b58f073eff5f28b31520adc444b32d247a769c1bce4bd25e415a45 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-6c5a170d0e76518e1d37/webkit/0 / webkit/dark/medium/scientific-disabled | outlined | screens/rc-number-edit/webkit/000018-4-actual.png | 340×230 | 340bab255e55ff02a0e918ae0da8b18cebda8f97a87221a7a92b362036354bfd | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-6c5a170d0e76518e1d37/webkit/0 / webkit/dark/medium/scientific-disabled | filled | screens/rc-number-edit/webkit/000018-9-actual.png | 340×230 | 340bab255e55ff02a0e918ae0da8b18cebda8f97a87221a7a92b362036354bfd | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-9c847b0af8a60432584e/chromium/0 / chromium/dark/large/scientific-read-only | outlined | screens/rc-number-edit/chromium/000019-4-actual.png | 346×230 | 1e098f9c90aed6fb943946d3ed32f2ed2670d91202f99a43619575758d5b0750 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-9c847b0af8a60432584e/chromium/0 / chromium/dark/large/scientific-read-only | filled | screens/rc-number-edit/chromium/000019-9-actual.png | 346×230 | 608b67083a5ba95a2f7d83602d1bee84ecf1b3afe724b1f4b34bc3e8454110d7 | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-764c3cb3311754922407/chromium/0 / chromium/dark/large/scientific-disabled | outlined | screens/rc-number-edit/chromium/000020-4-actual.png | 346×230 | 8361fd398e76786d852bc976dc2c5db9685fd3029deb52bf169809c1f9a311bb | 已看，范围内无新增明显缺陷 |
| de8ba6359ae09f9a88d6-764c3cb3311754922407/chromium/0 / chromium/dark/large/scientific-disabled | filled | screens/rc-number-edit/chromium/000020-9-actual.png | 346×230 | 8361fd398e76786d852bc976dc2c5db9685fd3029deb52bf169809c1f9a311bb | 已看，范围内无新增明显缺陷 |

此定向scope复审完成不代表全组件完成：其余状态/尺寸组合、环境、200%缩放、实际焦点与命中等不由这些静态图证明。旧repair-1失败保留，不混入本候选；不建立baseline或verified，不修改源/生成物/原生报告。
