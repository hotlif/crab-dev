# 表单与导航默认展示复审

已通过 `view_image` 逐张查看 7 包的 126 张原始 PNG：Chromium、Firefox、WebKit 各覆盖三体系 × 浅深色，默认配置为 medium / standard / zh-CN / ltr。未发现明确的文本截断、重叠、错位或明暗层级缺陷。

本轮只完成默认库存图复审。所有完整状态、尺寸、密度和环境矩阵仍待验收；未建立像素基准，未更新设计覆盖为 verified。关闭的 Cron 与日期触发器不能证明面板外观。

## 采集绑定与核对

- 原生整轮库存：900 passed，0 skipped、0 unexpected、0 flaky；本组 126 个 case 均 passed。
- 本组 126 张 PNG 的 SHA-256 同时匹配 cases.json、inventory-scope 明细与实际文件；case ID 和引擎/设计/明暗组合无重复或缺项。
- 9 份 inputs-worker 归档记录均 stable，采集前后的来源与构建产物指纹相同。记录绑定归档候选，不声称覆盖后续工作树改动。
- 来源指纹：`sha256:534445b00b1ed14ed75191f408df3bb8ecd81a438390eede24d923e5dc4c52d8`。
- 构建产物指纹：`sha256:f41393b2474f34fd3aec15ca962eca71583239c52916ca92f388eda6617e13bd`。
- Linux 镜像：`mcr.microsoft.com/playwright:v1.64.1-noble@sha256:47b510dd9230bf0b9bfc9b20102241e577ea7a99334ab4c3ca19f19770e9b8ea`。
- 截图尺寸：1280 × 720。浏览器版本：chromium 156.0.8078.4；firefox 157.0；webkit 27.2。
- cases.json SHA-256：`8338009311df77532eb1b8ed9b441bb0715024ba90aa140c474ef8d1a5ed814a`。

逐个 case 的配置、Demo、图像路径、完整哈希、输入绑定、实际所见和未覆盖项见 [JSON 记录](./reviews-forms-navigation.json)。

## 组件范围

| 包 | 已查看 | 实际所见与限制 |
| --- | ---: | --- |
| rc-breadcrumbs | 18 / 18 | 三段短路径、分隔符和当前位置完整；动作、禁用、折叠、长文本与焦点待验收。 |
| rc-cron-picker | 18 / 18 | 表达式、帮助文字和解释输出完整；仅关闭触发器，五段面板、模式、只读展开及预览待验收。 |
| rc-date-picker | 18 / 18 | 尺寸切换按钮和 medium 空值字段完整；small/large 未实际展示，日历、今天标记、时间与日期时间面板待验收。 |
| rc-form | 18 / 18 | 两个已填字段、必填标记、密码显隐和操作区完整；外置/组标签、校验状态、禁用和焦点待验收。 |
| rc-pagination | 18 / 18 | 默认第一页、禁用上一页、页码和后翻箭头完整；快速跳转、页容量菜单、交互、空数据待验收。 |
| rc-tabs | 18 / 18 | 三项导航、当前概览及正文完整；其他变体、切换、键盘、禁用和溢出待验收。 |
| rc-tag | 18 / 18 | 五种默认语义色可辨、文字完整；选中、关闭、禁用、焦点和其他尺寸待验收；未作对比度数值测量。 |

观察：Apple Form 的操作区在 Chromium 为 4+2 行，在 Firefox/WebKit 为 5+1 行，属于自然换行，所有按钮标签完整。三引擎文字栅格化略有差别；未进行跨引擎像素比较。

## 逐图索引

结论 `已复审默认图` 仅表示本张实际展示未见明显缺陷，不表示完整视觉验收通过。

| 包 / 引擎 / 配置 | Case ID | PNG SHA-256 | 结论 |
| --- | --- | --- | --- |
| rc-breadcrumbs / chromium / md3 light | `73019a0006cb75aa6498-bf2baeceaa3d9ee18a10/chromium/0` | [7be029f7a3f9d0f47f8840c1e0d0aa1bf9b727405e4bbe67238447dc0aa473f2](./screens/rc-breadcrumbs/chromium/000091-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-breadcrumbs / firefox / md3 light | `73019a0006cb75aa6498-bf2baeceaa3d9ee18a10/firefox/0` | [5daa3cd167136280515b0606b23cce5222adee6c58cb87370e33bc5750a39e73](./screens/rc-breadcrumbs/firefox/000092-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-breadcrumbs / webkit / md3 light | `73019a0006cb75aa6498-bf2baeceaa3d9ee18a10/webkit/0` | [2f3f56b3b45429182aa07acf6eb7b452b975f06296a96ab88e009e85233b23d7](./screens/rc-breadcrumbs/webkit/000093-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-breadcrumbs / chromium / md3 dark | `73019a0006cb75aa6498-cfa6ef287bfe1f906456/chromium/0` | [f148c48b0c52068e8039a80b45c49a481cd9c83b6a5184492bffb9852f972136](./screens/rc-breadcrumbs/chromium/000094-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-breadcrumbs / firefox / md3 dark | `73019a0006cb75aa6498-cfa6ef287bfe1f906456/firefox/0` | [8c060989df20ab7744e71ca8101517353db003c4fec2ae687acd6e0b5e6316cd](./screens/rc-breadcrumbs/firefox/000095-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-breadcrumbs / webkit / md3 dark | `73019a0006cb75aa6498-cfa6ef287bfe1f906456/webkit/0` | [1b0141c2e741c05b4f424ddbc441f21922fa458ff8600010a3ed259f1088a7eb](./screens/rc-breadcrumbs/webkit/000096-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-breadcrumbs / chromium / apple light | `73019a0006cb75aa6498-5d10924c0b2b99c11a75/chromium/0` | [baf70f245ce3f61de656792b96022dde9f7da724f050c02395c8e2bdf45fd6d8](./screens/rc-breadcrumbs/chromium/000097-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-breadcrumbs / firefox / apple light | `73019a0006cb75aa6498-5d10924c0b2b99c11a75/firefox/0` | [187e55e63206d57cacf464329169c3d7eb407c64f5c2129ac3a1adf402270d49](./screens/rc-breadcrumbs/firefox/000098-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-breadcrumbs / webkit / apple light | `73019a0006cb75aa6498-5d10924c0b2b99c11a75/webkit/0` | [631854642c75a314b86b6367cc09eaf668ec76f2aaa73c2e122c06a2d48f49c6](./screens/rc-breadcrumbs/webkit/000099-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-breadcrumbs / chromium / apple dark | `73019a0006cb75aa6498-578971d7ff73b0b7382d/chromium/0` | [f592b57db2e848fff75092bd286152780331fd1258e98f88638a58262abe62fc](./screens/rc-breadcrumbs/chromium/000100-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-breadcrumbs / firefox / apple dark | `73019a0006cb75aa6498-578971d7ff73b0b7382d/firefox/0` | [4b8ffb7639edbd6a9e53bcd964b946d8e77dd1bb3200b290600d699dc76305a0](./screens/rc-breadcrumbs/firefox/000101-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-breadcrumbs / webkit / apple dark | `73019a0006cb75aa6498-578971d7ff73b0b7382d/webkit/0` | [30fa0a8a85559c4ef72e0f7573daaf6630c3cf0bc0d199eb0b9ff5b2a5fe4dcf](./screens/rc-breadcrumbs/webkit/000102-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-breadcrumbs / chromium / shadcn light | `73019a0006cb75aa6498-c1249d20f592491dcaff/chromium/0` | [a31579d550a8aeb6878ab7cad5253772a05b98b4cdb56c4d059a076b8c186cac](./screens/rc-breadcrumbs/chromium/000103-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-breadcrumbs / firefox / shadcn light | `73019a0006cb75aa6498-c1249d20f592491dcaff/firefox/0` | [a6e7cd7c7c2271f517303d71f1c7dac5c34551be0c93f2cc0846f8d0c7713540](./screens/rc-breadcrumbs/firefox/000104-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-breadcrumbs / webkit / shadcn light | `73019a0006cb75aa6498-c1249d20f592491dcaff/webkit/0` | [000c7284ad2db9b6b6269c1a02f201a7c0d1454566b5b5c538069a2786a6d901](./screens/rc-breadcrumbs/webkit/000105-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-breadcrumbs / chromium / shadcn dark | `73019a0006cb75aa6498-e8162e2b1621f5122357/chromium/0` | [d3c08ee0f55218b2d206e00f8659defb443609610a0b7e564667d48d659b5df3](./screens/rc-breadcrumbs/chromium/000106-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-breadcrumbs / firefox / shadcn dark | `73019a0006cb75aa6498-e8162e2b1621f5122357/firefox/0` | [51a1858d7fd87d045495bf7f985d2342fcd0ec2fd9f81f28645d3d8c74f6f683](./screens/rc-breadcrumbs/firefox/000107-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-breadcrumbs / webkit / shadcn dark | `73019a0006cb75aa6498-e8162e2b1621f5122357/webkit/0` | [860a86aa75f701377300e5ab01499194ee6d670b77072124f2d57cc44feb4d6e](./screens/rc-breadcrumbs/webkit/000108-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-cron-picker / chromium / md3 light | `73019a0006cb75aa6498-d37224dc065fb364408a/chromium/0` | [794377aa9b1774be6fba2902f586e280f1d8871d1bd93baf8ce57f8d518bf0c6](./screens/rc-cron-picker/chromium/000235-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-cron-picker / firefox / md3 light | `73019a0006cb75aa6498-d37224dc065fb364408a/firefox/0` | [b7c9acfe4b79a2e5f171e915a3d305b8a2b02b44ce522fd9579c9affc4847434](./screens/rc-cron-picker/firefox/000236-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-cron-picker / webkit / md3 light | `73019a0006cb75aa6498-d37224dc065fb364408a/webkit/0` | [4a705dbc232974f435edf2edb68e8d9a58617944341134d2298754762ed1efab](./screens/rc-cron-picker/webkit/000237-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-cron-picker / chromium / md3 dark | `73019a0006cb75aa6498-44d21bc13ae599a39bc5/chromium/0` | [3023f26b8e66c07ce97127ad254d6385ecfd51f9fd96e1c42f6f62faefc0ce73](./screens/rc-cron-picker/chromium/000238-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-cron-picker / firefox / md3 dark | `73019a0006cb75aa6498-44d21bc13ae599a39bc5/firefox/0` | [43b98172f16fc056cd2bd6dea41e9a4a916881942e31eaae8013b62cf13407e3](./screens/rc-cron-picker/firefox/000239-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-cron-picker / webkit / md3 dark | `73019a0006cb75aa6498-44d21bc13ae599a39bc5/webkit/0` | [ad9d32ce5889913d8354f01079df4a6e26675de41e14f9c55ab83a868a173754](./screens/rc-cron-picker/webkit/000240-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-cron-picker / chromium / apple light | `73019a0006cb75aa6498-c6189a447c26536bd6f4/chromium/0` | [5e8f0afb15b0c32bd8fcb4f878d00c0593b68de069c7cd15865719b4c7c8efcb](./screens/rc-cron-picker/chromium/000241-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-cron-picker / firefox / apple light | `73019a0006cb75aa6498-c6189a447c26536bd6f4/firefox/0` | [41a1e87d7f1b2bbb0a508c45937137883f89e949e039e155cc4614042c0acc8d](./screens/rc-cron-picker/firefox/000242-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-cron-picker / webkit / apple light | `73019a0006cb75aa6498-c6189a447c26536bd6f4/webkit/0` | [165de127535b01b01527d5da35112be59b20ceeef1752abb3b088fb587478831](./screens/rc-cron-picker/webkit/000243-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-cron-picker / chromium / apple dark | `73019a0006cb75aa6498-b6af50107ecdda6b553a/chromium/0` | [f3c9c4fb9ba00c7192ea73646b06b4d5d8a5d7af4a2e95818f6a9994f1fbf6f2](./screens/rc-cron-picker/chromium/000244-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-cron-picker / firefox / apple dark | `73019a0006cb75aa6498-b6af50107ecdda6b553a/firefox/0` | [c5c48e500e3bd5c6c2d7a5a97f8c6c0945d4983badcb9931a28524409c78eec1](./screens/rc-cron-picker/firefox/000245-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-cron-picker / webkit / apple dark | `73019a0006cb75aa6498-b6af50107ecdda6b553a/webkit/0` | [f9599470eaaddcc26fd91cfc5cce8c47de798a349d0fab130affbee8214709f3](./screens/rc-cron-picker/webkit/000246-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-cron-picker / chromium / shadcn light | `73019a0006cb75aa6498-e1a10eb49c573a1ca698/chromium/0` | [bf86552f34066fef9e68d30126d4e34fb10f952f01bd295a199322c335136077](./screens/rc-cron-picker/chromium/000247-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-cron-picker / firefox / shadcn light | `73019a0006cb75aa6498-e1a10eb49c573a1ca698/firefox/0` | [0ec6cd2e5537130c6b572b5fcd7c6aab4ba0058f4c68ecffc85ff02251a06258](./screens/rc-cron-picker/firefox/000248-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-cron-picker / webkit / shadcn light | `73019a0006cb75aa6498-e1a10eb49c573a1ca698/webkit/0` | [92df6f4a60a0886f28b556aab5ac3afd4b82acfd2715aeac3ef241090544e343](./screens/rc-cron-picker/webkit/000249-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-cron-picker / chromium / shadcn dark | `73019a0006cb75aa6498-d247dcdbb6523869d345/chromium/0` | [db8e16309aa3b8adfff0c0264363791ab3c773e70e7a1b289f13a5faee769e06](./screens/rc-cron-picker/chromium/000250-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-cron-picker / firefox / shadcn dark | `73019a0006cb75aa6498-d247dcdbb6523869d345/firefox/0` | [b08e641615a1e3a166834a684a74420564b59a42251f433545ebf9ec6607c5e1](./screens/rc-cron-picker/firefox/000251-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-cron-picker / webkit / shadcn dark | `73019a0006cb75aa6498-d247dcdbb6523869d345/webkit/0` | [3c5b4b60e7bc9d2f8baca08734a3015453881bc2fdf173d81d88b37781eedf6e](./screens/rc-cron-picker/webkit/000252-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-date-picker / chromium / md3 light | `73019a0006cb75aa6498-647f57d9dfb87a29d025/chromium/0` | [0a105d3267eace238ab10348c22fffdf2e20b1eebdd2d97d367980d33d088f33](./screens/rc-date-picker/chromium/000253-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-date-picker / firefox / md3 light | `73019a0006cb75aa6498-647f57d9dfb87a29d025/firefox/0` | [d846d1454a8dc000023724e7c5b5226cf3bb5785c6cbd167462912ebfc0305c1](./screens/rc-date-picker/firefox/000254-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-date-picker / webkit / md3 light | `73019a0006cb75aa6498-647f57d9dfb87a29d025/webkit/0` | [6d3ee1d8a8fa1dbc33f3ef5537ab360b6a40f4ab2af7c270783c8691b3c9106e](./screens/rc-date-picker/webkit/000255-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-date-picker / chromium / md3 dark | `73019a0006cb75aa6498-15c0711d787a5b2feb23/chromium/0` | [c30e5b9599204de379cb758f05287dff5c823cd63899e3902971786d1fdef6f0](./screens/rc-date-picker/chromium/000256-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-date-picker / firefox / md3 dark | `73019a0006cb75aa6498-15c0711d787a5b2feb23/firefox/0` | [bc5197734787c76e86f6f7a8e2dfaa89d3d53bfbcae063eb29bb1aca9fab5fc3](./screens/rc-date-picker/firefox/000257-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-date-picker / webkit / md3 dark | `73019a0006cb75aa6498-15c0711d787a5b2feb23/webkit/0` | [e7519ae7006bf0ddadf3f32498741931b798d296447e5d4c2af01bdf57aab16f](./screens/rc-date-picker/webkit/000258-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-date-picker / chromium / apple light | `73019a0006cb75aa6498-f04c8c7ce1744501981e/chromium/0` | [895205005cf62c3ccb525191ab88ac443a2f49a01e38b759080ca03a6ee3fc67](./screens/rc-date-picker/chromium/000259-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-date-picker / firefox / apple light | `73019a0006cb75aa6498-f04c8c7ce1744501981e/firefox/0` | [00f8df8da0b637dc967d2002d608c33083e7753891bfa0d0ce1e7c09b4357ea7](./screens/rc-date-picker/firefox/000260-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-date-picker / webkit / apple light | `73019a0006cb75aa6498-f04c8c7ce1744501981e/webkit/0` | [dbcc46226d0fcdd221019829785f1bf9e8f015a85bd53e4d496760a6baa95f32](./screens/rc-date-picker/webkit/000261-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-date-picker / chromium / apple dark | `73019a0006cb75aa6498-cf092da75a06933a39e8/chromium/0` | [94f5f356a50374c832e53589c8587ab2b665dc39d9ae980e7127431bdcdfaeef](./screens/rc-date-picker/chromium/000262-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-date-picker / firefox / apple dark | `73019a0006cb75aa6498-cf092da75a06933a39e8/firefox/0` | [b872075ed237135e9b7258f431828a696c1347fb2af329315fa4795920ddd9c4](./screens/rc-date-picker/firefox/000263-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-date-picker / webkit / apple dark | `73019a0006cb75aa6498-cf092da75a06933a39e8/webkit/0` | [4c4bcf36a199fdccc023977ca011bc5ba73aa9373db723c0d3c94713504cd1a8](./screens/rc-date-picker/webkit/000264-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-date-picker / chromium / shadcn light | `73019a0006cb75aa6498-ea272b7f1d099743d91d/chromium/0` | [f81ce8ed4abc346c29354d7467fec6ee2f2757f758e194e6827ca2e9cc501611](./screens/rc-date-picker/chromium/000265-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-date-picker / firefox / shadcn light | `73019a0006cb75aa6498-ea272b7f1d099743d91d/firefox/0` | [a5a0d2fd43695a991d2ab74c7b2d5a5ecc4bba74d6ea73a4302f26cee1a1c1fa](./screens/rc-date-picker/firefox/000266-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-date-picker / webkit / shadcn light | `73019a0006cb75aa6498-ea272b7f1d099743d91d/webkit/0` | [8e9f149e085b6fce39a63fe42a2f8494ccdbe4759a466e97c2e8dd85872d05b0](./screens/rc-date-picker/webkit/000267-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-date-picker / chromium / shadcn dark | `73019a0006cb75aa6498-9246feeb8c6fbeb2ce19/chromium/0` | [850daf039acf18b992c03e72e751a781d19eda55ef393305c3be49ae18ea34f9](./screens/rc-date-picker/chromium/000268-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-date-picker / firefox / shadcn dark | `73019a0006cb75aa6498-9246feeb8c6fbeb2ce19/firefox/0` | [03b7c3284a9061988f4064a7d45f2a2cb2c48e4ee51ce8e0bc63e434837b0efa](./screens/rc-date-picker/firefox/000269-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-date-picker / webkit / shadcn dark | `73019a0006cb75aa6498-9246feeb8c6fbeb2ce19/webkit/0` | [813de5e1df847c484210b48718d6e7ae234d2e5010d71abe1e8dc1820447e486](./screens/rc-date-picker/webkit/000270-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-form / chromium / md3 light | `73019a0006cb75aa6498-3f570c7528edcd9e7f51/chromium/0` | [2d84b8ec11adb82a06e89e385c6514f20f5284b2073e83c5989dbb75f160bf49](./screens/rc-form/chromium/000379-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-form / firefox / md3 light | `73019a0006cb75aa6498-3f570c7528edcd9e7f51/firefox/0` | [467573322eca4024dc45da16bbcfe2b178db45790a65833b4b5cba261f025147](./screens/rc-form/firefox/000380-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-form / webkit / md3 light | `73019a0006cb75aa6498-3f570c7528edcd9e7f51/webkit/0` | [c96e497a91033016cbf06d3bb50dfb1e7da188d6149900ed0c5b7f56c5a3bb8f](./screens/rc-form/webkit/000381-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-form / chromium / md3 dark | `73019a0006cb75aa6498-02a8bceecd616719c4f2/chromium/0` | [a1581bc5c1b5099f648abe1dd738c02bbf9973fc97fdd42f688f3e3a3fa5f19e](./screens/rc-form/chromium/000382-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-form / firefox / md3 dark | `73019a0006cb75aa6498-02a8bceecd616719c4f2/firefox/0` | [2e7a3a2ffa15b116f04d434e5116a4578ef54b7806266e124bb287812536839c](./screens/rc-form/firefox/000383-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-form / webkit / md3 dark | `73019a0006cb75aa6498-02a8bceecd616719c4f2/webkit/0` | [d6784cb70c397e9fa2d9d5d5a72f746c793c3b693f49e54a8e4b84dca8ee1f6b](./screens/rc-form/webkit/000384-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-form / chromium / apple light | `73019a0006cb75aa6498-c6852c7d510fbe01fa12/chromium/0` | [2e25726d126350cd0c52c981ee2e7208fa1a7e2ffc6e31a90ffdf205763bbb1f](./screens/rc-form/chromium/000385-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-form / firefox / apple light | `73019a0006cb75aa6498-c6852c7d510fbe01fa12/firefox/0` | [d209d3fed6a9399ea10da65de427d7098570459d816d16581358acf548d37997](./screens/rc-form/firefox/000386-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-form / webkit / apple light | `73019a0006cb75aa6498-c6852c7d510fbe01fa12/webkit/0` | [4cb773b9bf9ab0fc50b3edbc6a01128c5ea7fbdd85ae27b880883d5819543514](./screens/rc-form/webkit/000387-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-form / chromium / apple dark | `73019a0006cb75aa6498-136fbf47fd33815fb82f/chromium/0` | [db7f098568173f60b54edc036a604a50aa4537100082ecd07a1d322f0ff66525](./screens/rc-form/chromium/000388-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-form / firefox / apple dark | `73019a0006cb75aa6498-136fbf47fd33815fb82f/firefox/0` | [33ecdac245c1066a5770e71576109cbc3bdddb1893507a11bb11a886c089642a](./screens/rc-form/firefox/000389-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-form / webkit / apple dark | `73019a0006cb75aa6498-136fbf47fd33815fb82f/webkit/0` | [8e4945a9adff88dacc372051ee8390579296b70b26726ebc58d451c0485da3de](./screens/rc-form/webkit/000390-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-form / chromium / shadcn light | `73019a0006cb75aa6498-6c344a5ff78d5b023e42/chromium/0` | [75cf06efa41cc396cad1e69e0758a157ddb9ff87b007fa4ec4a125393e8ced1b](./screens/rc-form/chromium/000391-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-form / firefox / shadcn light | `73019a0006cb75aa6498-6c344a5ff78d5b023e42/firefox/0` | [50cf6126d21e05d628fbe3201992ea0f12eac1a4d65bb3ea5dda963c533e517a](./screens/rc-form/firefox/000392-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-form / webkit / shadcn light | `73019a0006cb75aa6498-6c344a5ff78d5b023e42/webkit/0` | [9ae3be583ec4ebf4b31cfe77fee2f82c769b8d51c1708e7cee32b12fa7dbd599](./screens/rc-form/webkit/000393-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-form / chromium / shadcn dark | `73019a0006cb75aa6498-56c5bfe997b8c8c07f9e/chromium/0` | [6d199450407db29ab15076ae511808e881d9b3a691d818d433d63361a381ed75](./screens/rc-form/chromium/000394-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-form / firefox / shadcn dark | `73019a0006cb75aa6498-56c5bfe997b8c8c07f9e/firefox/0` | [d276152f27618537a64e4af67e3422bac100a8c11682db95d0ebb05b9de6fdcb](./screens/rc-form/firefox/000395-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-form / webkit / shadcn dark | `73019a0006cb75aa6498-56c5bfe997b8c8c07f9e/webkit/0` | [aba95354548da0bb8124ece3a15482606ecdb8c8ecad6969c53da328f92fd2bd](./screens/rc-form/webkit/000396-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-pagination / chromium / md3 light | `73019a0006cb75aa6498-de3ed499b1d4e75f948b/chromium/0` | [1a0fc8d66665c9b7708860b974933238e599fcea7bfdf15fc9b15403bdc399bd](./screens/rc-pagination/chromium/000505-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-pagination / firefox / md3 light | `73019a0006cb75aa6498-de3ed499b1d4e75f948b/firefox/0` | [9fe339b8a55b52258041a8fe6010643bb60cb1844405c48306d2cd7eccb7c89a](./screens/rc-pagination/firefox/000506-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-pagination / webkit / md3 light | `73019a0006cb75aa6498-de3ed499b1d4e75f948b/webkit/0` | [951f77bb55389cf3a99cb21d018fdebf0c25c696343271c22b0806eff4555d23](./screens/rc-pagination/webkit/000507-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-pagination / chromium / md3 dark | `73019a0006cb75aa6498-a5edad584d38ed5b0d53/chromium/0` | [206d3041cb3f9d66d90a5711edc407d4f1a28f927f366edfde90e28590764bbf](./screens/rc-pagination/chromium/000508-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-pagination / firefox / md3 dark | `73019a0006cb75aa6498-a5edad584d38ed5b0d53/firefox/0` | [ba95fd0ac16412a63fbafe6b8535ee69aa79ef2fd9d30107ca6f4da1b81fce65](./screens/rc-pagination/firefox/000509-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-pagination / webkit / md3 dark | `73019a0006cb75aa6498-a5edad584d38ed5b0d53/webkit/0` | [fdaf768898fc08e685326dd74e6dd09028260f61d2a5558969c70c2aa9874e03](./screens/rc-pagination/webkit/000510-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-pagination / chromium / apple light | `73019a0006cb75aa6498-4a2713914f4934907aa1/chromium/0` | [5834c7513df48f63d5f237af7fda0d5c1a4e3ff3dffb0d4a5658ef7e1b11a2ab](./screens/rc-pagination/chromium/000511-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-pagination / firefox / apple light | `73019a0006cb75aa6498-4a2713914f4934907aa1/firefox/0` | [880dc53be15c842ec0e98b36be4d0b7c53138e141ed7561dfd2eed52b604aba0](./screens/rc-pagination/firefox/000512-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-pagination / webkit / apple light | `73019a0006cb75aa6498-4a2713914f4934907aa1/webkit/0` | [36cb2fe05ec14bc415607f79f17df1a91f6bba15364a4f8792510aa4595104b1](./screens/rc-pagination/webkit/000513-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-pagination / chromium / apple dark | `73019a0006cb75aa6498-317b2e985d9b67c32f70/chromium/0` | [64d7adfcd27fbc36a19b9c4369b0735e0a9beaba35294db6d0e078c0a4507988](./screens/rc-pagination/chromium/000514-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-pagination / firefox / apple dark | `73019a0006cb75aa6498-317b2e985d9b67c32f70/firefox/0` | [7f4cd1ee18e6d66b8aa9b5284c3fadd973dff54deab56d1009959e6aa0cc9abf](./screens/rc-pagination/firefox/000515-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-pagination / webkit / apple dark | `73019a0006cb75aa6498-317b2e985d9b67c32f70/webkit/0` | [d9cc918bd41155bfffaee04eb83081d8fa99b679ac24648d7fee7ea1fcdc391a](./screens/rc-pagination/webkit/000516-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-pagination / chromium / shadcn light | `73019a0006cb75aa6498-2dc3a0d8e9f1e331b875/chromium/0` | [d6ce10284c82611acbf11d9a364f40aa63bb824830182cd236de3adafaa7b787](./screens/rc-pagination/chromium/000517-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-pagination / firefox / shadcn light | `73019a0006cb75aa6498-2dc3a0d8e9f1e331b875/firefox/0` | [e5d301033e78b1a64ad9ee7bc33477b289ea638c5cd74324dc59fc67832b99c5](./screens/rc-pagination/firefox/000518-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-pagination / webkit / shadcn light | `73019a0006cb75aa6498-2dc3a0d8e9f1e331b875/webkit/0` | [6aeae58e6ee57e5c8d0398297566f51c8617e7a4a59bbaca08197c1a8e5f7f67](./screens/rc-pagination/webkit/000519-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-pagination / chromium / shadcn dark | `73019a0006cb75aa6498-3a8723800bcb2b5940a3/chromium/0` | [4e3c3f1ea1619c0ad35dcef6198e33f8080a49635f96eb4ce4001dd6bd3cfd75](./screens/rc-pagination/chromium/000520-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-pagination / firefox / shadcn dark | `73019a0006cb75aa6498-3a8723800bcb2b5940a3/firefox/0` | [21c8a9a4fa5c0085bd9f167f45c7034625e6b4f0e3872690ac1cf1eb7c9089b2](./screens/rc-pagination/firefox/000521-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-pagination / webkit / shadcn dark | `73019a0006cb75aa6498-3a8723800bcb2b5940a3/webkit/0` | [2d443c887ae25b261abef42ee94fa60961c04611887461ecee2e10901be8feb3](./screens/rc-pagination/webkit/000522-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tabs / chromium / md3 light | `73019a0006cb75aa6498-48b4435c92fe1be843c0/chromium/0` | [a796bb5be1c83de5c8863b38f2e02895bf5caf7506bac890c0bf09ac15b433e9](./screens/rc-tabs/chromium/000757-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tabs / firefox / md3 light | `73019a0006cb75aa6498-48b4435c92fe1be843c0/firefox/0` | [cdedf4d6a47271351503f70c8dff746ed60b92a4cce1c072c337872f6687e67e](./screens/rc-tabs/firefox/000758-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tabs / webkit / md3 light | `73019a0006cb75aa6498-48b4435c92fe1be843c0/webkit/0` | [8c6f8b7e2d282e9427a0b6a3bc22e0ca31d6779ca7bd3f6c4fd979a9f3023d77](./screens/rc-tabs/webkit/000759-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tabs / chromium / md3 dark | `73019a0006cb75aa6498-b719a679880907e993bc/chromium/0` | [e9816372e294ab7ceb385963eb544b5313b960ac458d249d61106d340c1a4e73](./screens/rc-tabs/chromium/000760-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tabs / firefox / md3 dark | `73019a0006cb75aa6498-b719a679880907e993bc/firefox/0` | [912050b6a3209bd0ded562e95329f1ed9db94b0aa1f773b01f5bbe4e7df05ce4](./screens/rc-tabs/firefox/000761-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tabs / webkit / md3 dark | `73019a0006cb75aa6498-b719a679880907e993bc/webkit/0` | [214cf9c33a503b8fb8f630cf4b4f2c786bb535fc96e32221e36b2e32b278065a](./screens/rc-tabs/webkit/000762-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tabs / chromium / apple light | `73019a0006cb75aa6498-ef2a0ca02f3ee257ce6e/chromium/0` | [38a7740cb1188193c1d59725ec0a86ebf85ed26888f3d4b5f8cb95538b3654c8](./screens/rc-tabs/chromium/000763-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tabs / firefox / apple light | `73019a0006cb75aa6498-ef2a0ca02f3ee257ce6e/firefox/0` | [6d57524f039483e724dd27ca9e9e6460af482d99230882fd7322affa0d1f498b](./screens/rc-tabs/firefox/000764-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tabs / webkit / apple light | `73019a0006cb75aa6498-ef2a0ca02f3ee257ce6e/webkit/0` | [57e4e470f222ec51776086f97334539ca024a4990731e3f367b0fa020037c1b6](./screens/rc-tabs/webkit/000765-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tabs / chromium / apple dark | `73019a0006cb75aa6498-93fc710cc243137384c3/chromium/0` | [5d018a4cf9cd668392ad026813fbc5a1dcef8649550d31b5780cdd2658cef771](./screens/rc-tabs/chromium/000766-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tabs / firefox / apple dark | `73019a0006cb75aa6498-93fc710cc243137384c3/firefox/0` | [cc21fa5e15ee00aa3658b3573e2e859d54ee0daa778c13c31876e9442530202c](./screens/rc-tabs/firefox/000767-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tabs / webkit / apple dark | `73019a0006cb75aa6498-93fc710cc243137384c3/webkit/0` | [58052bfccac8dd7a6b6c9f94d93221847228a70457aef7e17d80b5ea7f1436f5](./screens/rc-tabs/webkit/000768-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tabs / chromium / shadcn light | `73019a0006cb75aa6498-98d81a275d69841ec982/chromium/0` | [f6a5e5d4ba1fb0501e24b0a1b5d0095b80fcadd1aa104cd1772abc3d08303289](./screens/rc-tabs/chromium/000769-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tabs / firefox / shadcn light | `73019a0006cb75aa6498-98d81a275d69841ec982/firefox/0` | [fabd1b9a17f45deb569bc10f6851d419af3f2fe456428bc0c8ad86d93c99e6c6](./screens/rc-tabs/firefox/000770-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tabs / webkit / shadcn light | `73019a0006cb75aa6498-98d81a275d69841ec982/webkit/0` | [0657eb4af1b3a53cf8ef593917c87420c4cf1fb50a872add4bbf5c8d6bdc0628](./screens/rc-tabs/webkit/000771-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tabs / chromium / shadcn dark | `73019a0006cb75aa6498-29e8ca49dfd88166b72b/chromium/0` | [c8cee1d324848d00c8a479a9f0939ea30d36672be24ba42d3c25f144efe4c4e1](./screens/rc-tabs/chromium/000772-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tabs / firefox / shadcn dark | `73019a0006cb75aa6498-29e8ca49dfd88166b72b/firefox/0` | [620dc5edf66c68bd62439f60d853e27aef7a82489bb204bff35296fad0c22c5a](./screens/rc-tabs/firefox/000773-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tabs / webkit / shadcn dark | `73019a0006cb75aa6498-29e8ca49dfd88166b72b/webkit/0` | [aa2422c1a81c736e66fc6804607a824a5fc21a54cc2d4227fd84012c70132f9e](./screens/rc-tabs/webkit/000774-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tag / chromium / md3 light | `73019a0006cb75aa6498-34fff036b3f46f7a368a/chromium/0` | [f77ac996e0db0d4718a73a5954da10211c5d7f2eaff551497d2cf0456a8bb16a](./screens/rc-tag/chromium/000775-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tag / firefox / md3 light | `73019a0006cb75aa6498-34fff036b3f46f7a368a/firefox/0` | [31897f836c48adc1867e0dfb9a04fd0468c8608b6533decb555873b80b1046d9](./screens/rc-tag/firefox/000776-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tag / webkit / md3 light | `73019a0006cb75aa6498-34fff036b3f46f7a368a/webkit/0` | [7eec18b6142bf8cd18a35a383ad01a16d8b81ea1ad78af2f219e4a6ac2849870](./screens/rc-tag/webkit/000777-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tag / chromium / md3 dark | `73019a0006cb75aa6498-4a7084cea7ce6418e61b/chromium/0` | [573390d001ad9b4255421fc48600443103bd012543dcf7ac125d789613773198](./screens/rc-tag/chromium/000778-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tag / firefox / md3 dark | `73019a0006cb75aa6498-4a7084cea7ce6418e61b/firefox/0` | [0dd41159b1c4d0fca22ef1315dcca96dc43e221086f3701725324b89cdcef301](./screens/rc-tag/firefox/000779-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tag / webkit / md3 dark | `73019a0006cb75aa6498-4a7084cea7ce6418e61b/webkit/0` | [f2d3bfe4bbff06260f061da359cfb959de3d43673b99497a112c36e35ceb479f](./screens/rc-tag/webkit/000780-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tag / chromium / apple light | `73019a0006cb75aa6498-d97c81212299642b1d5f/chromium/0` | [8493585a49950f3abe0cc7f6e505ed73cec6430a4167b33c0b7b2f511285781f](./screens/rc-tag/chromium/000781-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tag / firefox / apple light | `73019a0006cb75aa6498-d97c81212299642b1d5f/firefox/0` | [4ad5a2fa0a3a02ea858dd15392f6d978b067b31bc680628652da756852580057](./screens/rc-tag/firefox/000782-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tag / webkit / apple light | `73019a0006cb75aa6498-d97c81212299642b1d5f/webkit/0` | [6d2ac3a0b3aedd15e4a8a1cd0e4dc755e1f688d8af55314471f8506fac12eb98](./screens/rc-tag/webkit/000783-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tag / chromium / apple dark | `73019a0006cb75aa6498-7b7378ae1fa4f6b71270/chromium/0` | [bb23c5067f101168bf0f45ec6c0749be74516baef85a260ce81f83b4d16d44b4](./screens/rc-tag/chromium/000784-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tag / firefox / apple dark | `73019a0006cb75aa6498-7b7378ae1fa4f6b71270/firefox/0` | [c4b73ed8c20203c4ea9b1627a35c581f9b33ec65a59dc505e81bf29232668500](./screens/rc-tag/firefox/000785-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tag / webkit / apple dark | `73019a0006cb75aa6498-7b7378ae1fa4f6b71270/webkit/0` | [d31fd5aeafd563526f4dd9902374aeec95ef29f5bdd107d1a26694e69c31e1eb](./screens/rc-tag/webkit/000786-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tag / chromium / shadcn light | `73019a0006cb75aa6498-4ac143e9fb7ba0a71d34/chromium/0` | [244c72222f680861a18f29b73e6ae8f0677706e7fdcf06ea7d984fb6e23dd677](./screens/rc-tag/chromium/000787-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tag / firefox / shadcn light | `73019a0006cb75aa6498-4ac143e9fb7ba0a71d34/firefox/0` | [5b9bdce809ae67da8ccca30e17f003a367cdea738f4a819d9578510fbe84f7b0](./screens/rc-tag/firefox/000788-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tag / webkit / shadcn light | `73019a0006cb75aa6498-4ac143e9fb7ba0a71d34/webkit/0` | [8f9fb414814427ecc82f3b00009280a6ff35168dd22178f874abee8e56a387c6](./screens/rc-tag/webkit/000789-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tag / chromium / shadcn dark | `73019a0006cb75aa6498-b8a620d6f9b129fe7da5/chromium/0` | [8a78312a38eaa65297080efe4af23cf6d7b7cd0442ece1758dbcbeb2240c8690](./screens/rc-tag/chromium/000790-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tag / firefox / shadcn dark | `73019a0006cb75aa6498-b8a620d6f9b129fe7da5/firefox/0` | [8e06814c6d91c69f3625a9350b3b56561788c8fb8804e2738781f88256b31213](./screens/rc-tag/firefox/000791-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |
| rc-tag / webkit / shadcn dark | `73019a0006cb75aa6498-b8a620d6f9b129fe7da5/webkit/0` | [c424cb1c6eb71e6901fa4a00bb72e273e358f020015b3fcc0f8cb82432d9c547](./screens/rc-tag/webkit/000792-0-inventory-actual.png) | 已复审默认图；矩阵待验收 |

完整矩阵还需覆盖真实悬停、焦点、按下、选中、错误、加载、展开等适用状态，全部公开尺寸及密度、窄屏、触控、RTL、中英文、长文本、品牌、强制颜色、减少动画、真实 200% 缩放、嵌套边界、Portal、iframe、Shadow DOM 和切换配置后的草稿保持；不以此默认图替代。
