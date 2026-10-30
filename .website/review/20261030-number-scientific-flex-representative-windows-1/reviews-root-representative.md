# Root 科学计数六代表逐图复审附记

root已明确报告逐项调用view_image查看12原PNG：三体系浅色中号的主数字与上标完整且对齐，只读/禁用外观无新增明显缺陷。此文件仅记录该实际复审，不改变原native报告与此前审计。

| 设计/状态 | 交互外观 | 原图 | 尺寸 | SHA-256 |
| --- | --- | --- | --- | --- |
| md3/scientific-read-only | outlined | screens/rc-number-edit/chromium/000001-4-actual.png | 332×230 | a96b6d6b6602b504378f3463d5ffddbb7f5239a8cd02b55354e37ff2aff7afdb |
| md3/scientific-read-only | filled | screens/rc-number-edit/chromium/000001-9-actual.png | 332×230 | 9d25aa0ea0e0ef5690c9d7f6a27b47d37f7ae6e8844e0e43999f98dd12b94b30 |
| md3/scientific-disabled | outlined | screens/rc-number-edit/chromium/000002-4-actual.png | 332×230 | dc8223b76afafb7d79105b4973963e5df2397fab6b2092e766c8066e7fd9bf81 |
| md3/scientific-disabled | filled | screens/rc-number-edit/chromium/000002-9-actual.png | 332×230 | dc8223b76afafb7d79105b4973963e5df2397fab6b2092e766c8066e7fd9bf81 |
| apple/scientific-read-only | outlined | screens/rc-number-edit/chromium/000003-4-actual.png | 302×255 | 7939578de6098a3b4dd5dd0f5b6dbcf79514e8c9b8ba66e793b8765eb7609540 |
| apple/scientific-read-only | filled | screens/rc-number-edit/chromium/000003-9-actual.png | 302×255 | 3017ac7a5788fa910139026e003e27d10dc9d2e65bc386195e490e8e58cf4aa0 |
| apple/scientific-disabled | outlined | screens/rc-number-edit/chromium/000004-4-actual.png | 302×255 | 466648e82cfc41307bf3e948607dbc5af3cdbfa2d378cefd69cebbb13f7acfae |
| apple/scientific-disabled | filled | screens/rc-number-edit/chromium/000004-9-actual.png | 302×255 | 466648e82cfc41307bf3e948607dbc5af3cdbfa2d378cefd69cebbb13f7acfae |
| shadcn/scientific-read-only | outlined | screens/rc-number-edit/chromium/000005-4-actual.png | 302×255 | 7d52c72b7def9cd43ee12d8c6141232fb150c9aeb8d9c34bb965ec423359b60c |
| shadcn/scientific-read-only | filled | screens/rc-number-edit/chromium/000005-9-actual.png | 302×255 | 08b6b2e7d07b36215c2b042338f7a6adfbff6ac14cf2aee7124ac80c43719ff3 |
| shadcn/scientific-disabled | outlined | screens/rc-number-edit/chromium/000006-4-actual.png | 302×255 | a38eb19f4e1a7ea22af4a336f5ea6349cab887c7e349006fc8ebe97d59eb0a1f |
| shadcn/scientific-disabled | filled | screens/rc-number-edit/chromium/000006-9-actual.png | 302×255 | a38eb19f4e1a7ea22af4a336f5ea6349cab887c7e349006fc8ebe97d59eb0a1f |

相同hash的原图仍逐张看过；包括000002与000006的-4/-9，不认定缺帧。静态原图不证明实际命中或键盘行为，也不替代完整scope、canonical Linux或其他引擎验收；不建立baseline/verified。
