# LineEdit shadcn：Windows 第二候选原图复审

150张原PNG已逐张使用view_image以原始细节查看，包括重复SHA；150/150哈希与原生附件及导出索引相同。未重新采集、裁切、编辑、拼图、运行浏览器或构建。

来源：.website/review/20261029-line-edit-full-windows-2。source sha256:95a3abd61ba6be7b449451f18c0ad5af3dc762e51bb7f51913f04b216717f399；artifact sha256:20cff7604eb26c306fb4d8daad817f43ee39d28c14025d686a2465772c7de3f7。两worker前后输入相同且stable=true。原生包级229通过、0失败、0跳过；162/162核心与60/60环境为原生自动结果，不替代本次人工记录。

shadcn人工范围：76用例/150图；核心54格×两外观=108图，九环境×明暗×两外观=36图，真实200%两用例/4图，默认库存2图。三尺寸small/medium/large、light/dark、standard密度、九状态（default、hover、focus-visible、filled、clear、error、warning、disabled、read-only）。

重点所见：各尺寸焦点外圈及清空后目标焦点完整，标签/错误/支持文未裁切；悬停加深目标边界；清空X不压住值，空值时X消失。触控控件/清空命中区域的原生记录≥48px，原图内外环完整。RTL位置正确，英文、品牌、强制颜色及减少动画条件的静态呈现已看。暗色普通细边界层级弱但仍有轮廓；此观察保留，未做数值对比度认证。

真实200%由原生chrome.tabs.setZoom证明：tabZoom1→2，CSSzoom保持1，视口1264×805→632×402；四张1264×805原图是实际可见视口，两个字段与目标焦点环均可见。长值仅显示输入视窗内一段；原生105字符全选及Home/End滚动证明独立记录，不声称PNG展示全文。普通环境73字符长草稿亦如此。

重复SHA共40组；150图中106种独立字节，重复项超过首次44张。每张仍已查看，重复组与所有原图路径/case id/SHA见JSON。两外观静态相同不被当成额外状态或不同视觉表现的证据。

自动几何、文本关联、真实选择/滚动、触控和缩放记录与人工观察分别写入JSON。全局配置切换用例没有独立shadcn PNG，本次不把它说成已看过的截图。仅接受这些Windows候选原图所见范围；不推广Linux canonical、Firefox/WebKit、baseline或verified。

| 序号 | 原图/配置 | SHA-256 | 人工观察 |
| --- | --- | --- | --- |
| 1 | screens/rc-line-edit/chromium/000037-2-actual.png · shadcn-light-outlined-narrow.png | e2b92826f5d0146725749c1df02f676b23f7ed62040b96ff92cbb2d256a5a2aa | narrow环境的outlined清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 |
| 2 | screens/rc-line-edit/chromium/000037-5-actual.png · shadcn-light-filled-narrow.png | 811447456bb69acae9c72320a6af9272583c6a7e25fe3057280452c6c01a2358 | narrow环境的filled清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 |
| 3 | screens/rc-line-edit/chromium/000038-2-actual.png · shadcn-light-outlined-tablet.png | abba3822573d0a20ad5f6b20c2db4d7cc315393a7edec8836b346b972304cd40 | tablet环境的outlined清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 |
| 4 | screens/rc-line-edit/chromium/000038-5-actual.png · shadcn-light-filled-tablet.png | 01f7781287d772f109829726424cd71bee3d1f1f4cd37fa31d2617372e6dd1fd | tablet环境的filled清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 |
| 5 | screens/rc-line-edit/chromium/000039-2-actual.png · shadcn-light-outlined-desktop.png | abba3822573d0a20ad5f6b20c2db4d7cc315393a7edec8836b346b972304cd40 | desktop环境的outlined清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 |
| 6 | screens/rc-line-edit/chromium/000039-5-actual.png · shadcn-light-filled-desktop.png | 01f7781287d772f109829726424cd71bee3d1f1f4cd37fa31d2617372e6dd1fd | desktop环境的filled清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 |
| 7 | screens/rc-line-edit/chromium/000040-2-actual.png · shadcn-light-outlined-touch.png | 72219e4a2e3ad90ccf742a03144ba2e67cc2f3e82961b9e5611f2cdfe16b2773 | touch环境的outlined清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 实际粗指针目标扩大，清空框与外环完整，无相邻内容遮挡；原生几何记录控件及清空命中区域≥48px。 |
| 8 | screens/rc-line-edit/chromium/000040-5-actual.png · shadcn-light-filled-touch.png | 8bbb7d3a4d74032afe381a30719816b0febf4e0d99af2f3a172242338d093387 | touch环境的filled清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 实际粗指针目标扩大，清空框与外环完整，无相邻内容遮挡；原生几何记录控件及清空命中区域≥48px。 |
| 9 | screens/rc-line-edit/chromium/000041-2-actual.png · shadcn-light-outlined-rtl.png | 23401c5e5a4b8c1915db5d9c6be8a31c7a1288e4fb3e5bda21ec89b457f034a4 | rtl环境的outlined清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 标签右对齐、清空按钮在逻辑末端镜像位置，显示长英文尾段且未越过按钮。 |
| 10 | screens/rc-line-edit/chromium/000041-5-actual.png · shadcn-light-filled-rtl.png | 9526eb1e5e4e93f33d054d3ef5b13d0ad02cd582dfa83870ce1a15abcbdeaa9c | rtl环境的filled清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 标签右对齐、清空按钮在逻辑末端镜像位置，显示长英文尾段且未越过按钮。 |
| 11 | screens/rc-line-edit/chromium/000042-2-actual.png · shadcn-light-outlined-english.png | 52b58452944a554ae00ee949975c0d7ce5274fa7070674d2bacd391b9c776210 | english环境的outlined清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 Project name标签与英文支持文完整；草稿值本身仍是夹具中英混排长值。 |
| 12 | screens/rc-line-edit/chromium/000042-5-actual.png · shadcn-light-filled-english.png | 9de8ca074e93ee45df43885ffdc307dd222a87bf579414818a450d0c4389f0fe | english环境的filled清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 Project name标签与英文支持文完整；草稿值本身仍是夹具中英混排长值。 |
| 13 | screens/rc-line-edit/chromium/000043-2-actual.png · shadcn-light-outlined-brand.png | d828e969853c47fd79ac4de572905afc0cf5fbbe4028dd55155e6efcb8f0c083 | brand环境的outlined清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 品牌焦点外环为紫色，目标清空按钮焦点和文字仍清楚。 |
| 14 | screens/rc-line-edit/chromium/000043-5-actual.png · shadcn-light-filled-brand.png | 23c161e4da4107a1ea12000a8c83a974fafb38e16c1165e921ac807addb81092 | brand环境的filled清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 品牌焦点外环为紫色，目标清空按钮焦点和文字仍清楚。 |
| 15 | screens/rc-line-edit/chromium/000044-2-actual.png · shadcn-light-outlined-forced-colors.png | 8dda7aabd3692b09e01f6d5bd1d16d968aa3dfb660cdae882bff17db06e78415 | forced-colors环境的outlined清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 强制颜色使用黑色普通边界/紫色焦点，正文和清空X清楚。 |
| 16 | screens/rc-line-edit/chromium/000044-5-actual.png · shadcn-light-filled-forced-colors.png | 8f8d8ead6f5be3231f6b89cb824fb876a71bb53586c1b08a987fe33f1536035c | forced-colors环境的filled清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 强制颜色使用黑色普通边界/紫色焦点，正文和清空X清楚。 |
| 17 | screens/rc-line-edit/chromium/000045-2-actual.png · shadcn-light-outlined-reduced-motion.png | abba3822573d0a20ad5f6b20c2db4d7cc315393a7edec8836b346b972304cd40 | reduced-motion环境的outlined清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 PNG仅确认该媒体条件下的静态外观，不凭静态图证明动画行为。 |
| 18 | screens/rc-line-edit/chromium/000045-5-actual.png · shadcn-light-filled-reduced-motion.png | 01f7781287d772f109829726424cd71bee3d1f1f4cd37fa31d2617372e6dd1fd | reduced-motion环境的filled清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 PNG仅确认该媒体条件下的静态外观，不凭静态图证明动画行为。 |
| 19 | screens/rc-line-edit/chromium/000046-2-actual.png · shadcn-dark-outlined-narrow.png | 9730ab1c13276da2942affe61878c1fa2c9b770596c55234950979f2c27796f3 | narrow环境的outlined清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 20 | screens/rc-line-edit/chromium/000046-5-actual.png · shadcn-dark-filled-narrow.png | 25f90360f95f0963d51abf062de62f45cb69cc1201ae325c9bd907d4bb0f8cb7 | narrow环境的filled清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 21 | screens/rc-line-edit/chromium/000047-2-actual.png · shadcn-dark-outlined-tablet.png | e87b26b85094af1fb61a85441d915f50b14ece9351dd4a717e2d34723728e689 | tablet环境的outlined清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 22 | screens/rc-line-edit/chromium/000047-5-actual.png · shadcn-dark-filled-tablet.png | 1be476af484a8eed7c5a8719525749c2524bb2b9f2e16db7918b7f1cd37627b4 | tablet环境的filled清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 23 | screens/rc-line-edit/chromium/000048-2-actual.png · shadcn-dark-outlined-desktop.png | e87b26b85094af1fb61a85441d915f50b14ece9351dd4a717e2d34723728e689 | desktop环境的outlined清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 24 | screens/rc-line-edit/chromium/000048-5-actual.png · shadcn-dark-filled-desktop.png | 1be476af484a8eed7c5a8719525749c2524bb2b9f2e16db7918b7f1cd37627b4 | desktop环境的filled清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 25 | screens/rc-line-edit/chromium/000049-2-actual.png · shadcn-dark-outlined-touch.png | 592e431392569ba2c09744ce4d45e4925e82f6a922d6737c91d1875dc109a57e | touch环境的outlined清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 实际粗指针目标扩大，清空框与外环完整，无相邻内容遮挡；原生几何记录控件及清空命中区域≥48px。 |
| 26 | screens/rc-line-edit/chromium/000049-5-actual.png · shadcn-dark-filled-touch.png | cedf41258125003f1f470ffcf711df7a6b3a9d953df4d15aceeaa445c4211e23 | touch环境的filled清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 实际粗指针目标扩大，清空框与外环完整，无相邻内容遮挡；原生几何记录控件及清空命中区域≥48px。 |
| 27 | screens/rc-line-edit/chromium/000050-2-actual.png · shadcn-dark-outlined-rtl.png | 0b91716f7c36f6029f2331df504a03d72d52aad571560c7bddb64c02f6e219ba | rtl环境的outlined清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 标签右对齐、清空按钮在逻辑末端镜像位置，显示长英文尾段且未越过按钮。 |
| 28 | screens/rc-line-edit/chromium/000050-5-actual.png · shadcn-dark-filled-rtl.png | b8727d206671ea5396c4165fe803bb75c004415d61075307e2d707fee7e4a3f0 | rtl环境的filled清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 标签右对齐、清空按钮在逻辑末端镜像位置，显示长英文尾段且未越过按钮。 |
| 29 | screens/rc-line-edit/chromium/000051-2-actual.png · shadcn-dark-outlined-english.png | 2b64f3d83be1e4b0639441f48915f91eb5f63d47a54b7339ce91ea35a51eaf6a | english环境的outlined清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 Project name标签与英文支持文完整；草稿值本身仍是夹具中英混排长值。 |
| 30 | screens/rc-line-edit/chromium/000051-5-actual.png · shadcn-dark-filled-english.png | 3466f04c26b2e1505f7d113e922effa5d2e9815e275f3bb55a66995f5b10e384 | english环境的filled清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 Project name标签与英文支持文完整；草稿值本身仍是夹具中英混排长值。 |
| 31 | screens/rc-line-edit/chromium/000052-2-actual.png · shadcn-dark-outlined-brand.png | 3917a3ca9191f8265660bf2c24af51bd5f33544bf003f4406d0f033a629e3e6a | brand环境的outlined清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 品牌焦点外环为紫色，目标清空按钮焦点和文字仍清楚。 |
| 32 | screens/rc-line-edit/chromium/000052-5-actual.png · shadcn-dark-filled-brand.png | 0dbc55ea2951ad44737364a37f7c2f0965574f2c910ee11769fc6d5137452183 | brand环境的filled清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 品牌焦点外环为紫色，目标清空按钮焦点和文字仍清楚。 |
| 33 | screens/rc-line-edit/chromium/000053-2-actual.png · shadcn-dark-outlined-forced-colors.png | 6432af12c1562989a2b8654c815d2e69f76ed0f61a1005423e30f8e6e33a10ed | forced-colors环境的outlined清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 强制颜色使用白色普通边界/青色焦点，正文和清空X清楚。 |
| 34 | screens/rc-line-edit/chromium/000053-5-actual.png · shadcn-dark-filled-forced-colors.png | ad32b6b0e48e93e1e5751502a6207f5cda06e9171c4191f331651e556b254d72 | forced-colors环境的filled清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 强制颜色使用白色普通边界/青色焦点，正文和清空X清楚。 |
| 35 | screens/rc-line-edit/chromium/000054-2-actual.png · shadcn-dark-outlined-reduced-motion.png | e87b26b85094af1fb61a85441d915f50b14ece9351dd4a717e2d34723728e689 | reduced-motion环境的outlined清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 PNG仅确认该媒体条件下的静态外观，不凭静态图证明动画行为。 |
| 36 | screens/rc-line-edit/chromium/000054-5-actual.png · shadcn-dark-filled-reduced-motion.png | 1be476af484a8eed7c5a8719525749c2524bb2b9f2e16db7918b7f1cd37627b4 | reduced-motion环境的filled清空按钮有可见焦点，长值限于输入视窗；标签/帮助文未裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 PNG仅确认该媒体条件下的静态外观，不凭静态图证明动画行为。 |
| 37 | screens/rc-line-edit/chromium/000059-3-actual-zoom-200.png · shadcn-light-outlined-zoom200.png | 98e38024846c73e460be516cca194f3d887a40b68181a8608c29c7e7ccda16c1 | 实际200%视口内outlined及另一字段均可见，清空按钮焦点环完整。长草稿只显示单行视窗的一段；全文选择/两端滚动由原生记录证明，图中不是全长文档。 |
| 38 | screens/rc-line-edit/chromium/000059-6-actual-zoom-200.png · shadcn-light-filled-zoom200.png | 067eeff2a007c38c9e1aae85cb2ceabf8c27cc975893bf76a7415230bb41fb41 | 实际200%视口内filled及另一字段均可见，清空按钮焦点环完整。长草稿只显示单行视窗的一段；全文选择/两端滚动由原生记录证明，图中不是全长文档。 |
| 39 | screens/rc-line-edit/chromium/000060-3-actual-zoom-200.png · shadcn-dark-outlined-zoom200.png | ee52bd0e73a3e2d634a6751d514440a1192f4f2034c50dc648091ae1e36854ad | 实际200%视口内outlined及另一字段均可见，清空按钮焦点环完整。长草稿只显示单行视窗的一段；全文选择/两端滚动由原生记录证明，图中不是全长文档。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 40 | screens/rc-line-edit/chromium/000060-6-actual-zoom-200.png · shadcn-dark-filled-zoom200.png | f26e4463515669e9ed02c5860c6e35d837e9b4a8a89bffa1b6d5d6b97b7a736c | 实际200%视口内filled及另一字段均可见，清空按钮焦点环完整。长草稿只显示单行视窗的一段；全文选择/两端滚动由原生记录证明，图中不是全长文档。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 41 | screens/rc-line-edit/chromium/000169-2-actual.png · shadcn-light-small-outlined-default.png | 9988d24a83c4903591ba8e9fca21813bb2ec3ca32b7cefa9f08fa6413a4e8cf6 | 两个空字段的标签、占位、支持文和圆角边界完整。 |
| 42 | screens/rc-line-edit/chromium/000169-5-actual.png · shadcn-light-small-filled-default.png | 9988d24a83c4903591ba8e9fca21813bb2ec3ca32b7cefa9f08fa6413a4e8cf6 | 两个空字段的标签、占位、支持文和圆角边界完整。 |
| 43 | screens/rc-line-edit/chromium/000170-2-actual.png · shadcn-light-small-outlined-hover.png | 7dbf9438ceef08711aa841ef7ba1c1e9b4cc00b7bec8b7a408e531d72e036d1e | outlined悬停边界加深/变亮，另一字段保持普通边界。 |
| 44 | screens/rc-line-edit/chromium/000170-5-actual.png · shadcn-light-small-filled-hover.png | 2a785b1ac99dd6ce88568da1182287448b7f351aa2387e8ce0dc99080e4b9aa5 | filled悬停边界加深/变亮，另一字段保持普通边界。 |
| 45 | screens/rc-line-edit/chromium/000171-2-actual.png · shadcn-light-small-outlined-focus-visible.png | 0e4416bf98f9748b8f4343b5e7e5b23c4aed78f472d822708b885fcd24fad211 | 真实键盘焦点位于outlined；完整外环可见，标签与帮助文未被环裁切。 |
| 46 | screens/rc-line-edit/chromium/000171-5-actual.png · shadcn-light-small-filled-focus-visible.png | 124960502140b8e1a183380aaf134b93b474415f3568f511e72f632b8fde289b | 真实键盘焦点位于filled；完整外环可见，标签与帮助文未被环裁切。 |
| 47 | screens/rc-line-edit/chromium/000172-2-actual.png · shadcn-light-small-outlined-filled.png | b728e5af35d7314bd2e1f9dc55343fa75fad65087a0e9d1cbc37bd572ee19aa5 | 两字段均显示“设计工作台”和清空X，字形与图标不重叠；静态相同外观另列重复SHA。 |
| 48 | screens/rc-line-edit/chromium/000172-5-actual.png · shadcn-light-small-filled-filled.png | b728e5af35d7314bd2e1f9dc55343fa75fad65087a0e9d1cbc37bd572ee19aa5 | 两字段均显示“设计工作台”和清空X，字形与图标不重叠；静态相同外观另列重复SHA。 |
| 49 | screens/rc-line-edit/chromium/000173-2-actual.png · shadcn-light-small-outlined-clear.png | 6b7d7864ea953a2e60c621725170d7acd68d86a88f00a599a409461fb8332be7 | 清空后的outlined显示占位，清空X已消失，输入仍有可见目标焦点外环。 |
| 50 | screens/rc-line-edit/chromium/000173-5-actual.png · shadcn-light-small-filled-clear.png | e323111ba7d542c7692f029366c06992bbc74a2e317db5d157dcd3d6c04fb161 | 清空后的filled显示占位，清空X已消失，输入仍有可见目标焦点外环。 |
| 51 | screens/rc-line-edit/chromium/000174-2-actual.png · shadcn-light-small-outlined-error.png | 5042a1100f89a98b452c03e04f44150cdad3426b5bf182e79f9bfdaf0c99354c | 红色标签/边框及错误帮助文完整，未见文案裁切。 |
| 52 | screens/rc-line-edit/chromium/000174-5-actual.png · shadcn-light-small-filled-error.png | 5042a1100f89a98b452c03e04f44150cdad3426b5bf182e79f9bfdaf0c99354c | 红色标签/边框及错误帮助文完整，未见文案裁切。 |
| 53 | screens/rc-line-edit/chromium/000175-2-actual.png · shadcn-light-small-outlined-warning.png | f5cf07c6ec15bc65228954cffe68aaedd63ee7ea999f0a80329f316f41c556f6 | 橙色边框、标签及支持文完整可辨。 |
| 54 | screens/rc-line-edit/chromium/000175-5-actual.png · shadcn-light-small-filled-warning.png | f5cf07c6ec15bc65228954cffe68aaedd63ee7ea999f0a80329f316f41c556f6 | 橙色边框、标签及支持文完整可辨。 |
| 55 | screens/rc-line-edit/chromium/000176-2-actual.png · shadcn-light-small-outlined-disabled.png | f3b17606751c3f3020ee6104c3af9658cd95e273172f3bd68e080e289b110a64 | 禁用标签与支持文变淡，框和占位仍可辨；实际disabled由原生断言确认。 |
| 56 | screens/rc-line-edit/chromium/000176-5-actual.png · shadcn-light-small-filled-disabled.png | f3b17606751c3f3020ee6104c3af9658cd95e273172f3bd68e080e289b110a64 | 禁用标签与支持文变淡，框和占位仍可辨；实际disabled由原生断言确认。 |
| 57 | screens/rc-line-edit/chromium/000177-2-actual.png · shadcn-light-small-outlined-read-only.png | bd236d6cf76aa1b4df13b2640a8e6e348bdd28c3b5731207ab5c2e41aa9ccccf | 只读静态外观接近普通空字段；框、标签和支持文完整，readonly行为不由PNG替代。 |
| 58 | screens/rc-line-edit/chromium/000177-5-actual.png · shadcn-light-small-filled-read-only.png | bd236d6cf76aa1b4df13b2640a8e6e348bdd28c3b5731207ab5c2e41aa9ccccf | 只读静态外观接近普通空字段；框、标签和支持文完整，readonly行为不由PNG替代。 |
| 59 | screens/rc-line-edit/chromium/000178-2-actual.png · shadcn-light-medium-outlined-default.png | b84ded8f0b1b422a19bf27947086aab2979bb47231b5f57178859356c706e852 | 两个空字段的标签、占位、支持文和圆角边界完整。 |
| 60 | screens/rc-line-edit/chromium/000178-5-actual.png · shadcn-light-medium-filled-default.png | b84ded8f0b1b422a19bf27947086aab2979bb47231b5f57178859356c706e852 | 两个空字段的标签、占位、支持文和圆角边界完整。 |
| 61 | screens/rc-line-edit/chromium/000179-2-actual.png · shadcn-light-medium-outlined-hover.png | 56f102b1d8bbfc0a18079e193cdc3b3302a42cee1019b03db0a5842d4f464a60 | outlined悬停边界加深/变亮，另一字段保持普通边界。 |
| 62 | screens/rc-line-edit/chromium/000179-5-actual.png · shadcn-light-medium-filled-hover.png | 5d983d6d1a5a40176a092c16af101ed8c8901570250ec4d5c2fbf214f090cf4f | filled悬停边界加深/变亮，另一字段保持普通边界。 |
| 63 | screens/rc-line-edit/chromium/000180-2-actual.png · shadcn-light-medium-outlined-focus-visible.png | de76bbee0441f3ea78e5f4e8e102eed0f9d9db9b74385f82ba7beab73524f345 | 真实键盘焦点位于outlined；完整外环可见，标签与帮助文未被环裁切。 |
| 64 | screens/rc-line-edit/chromium/000180-5-actual.png · shadcn-light-medium-filled-focus-visible.png | 9b0e847092e9a4ae24ec67c496e980a0e517c9033215c14074b662b9a361fa06 | 真实键盘焦点位于filled；完整外环可见，标签与帮助文未被环裁切。 |
| 65 | screens/rc-line-edit/chromium/000181-2-actual.png · shadcn-light-medium-outlined-filled.png | 3bbca7843cd2219a546bd8c12751b1f57e0378a4c44d97e969c5e90530c7861d | 两字段均显示“设计工作台”和清空X，字形与图标不重叠；静态相同外观另列重复SHA。 |
| 66 | screens/rc-line-edit/chromium/000181-5-actual.png · shadcn-light-medium-filled-filled.png | 3bbca7843cd2219a546bd8c12751b1f57e0378a4c44d97e969c5e90530c7861d | 两字段均显示“设计工作台”和清空X，字形与图标不重叠；静态相同外观另列重复SHA。 |
| 67 | screens/rc-line-edit/chromium/000182-2-actual.png · shadcn-light-medium-outlined-clear.png | bbcde95b79f4c627511679d8ba3046749bf8b0c318c3b87819894bc78dd665a3 | 清空后的outlined显示占位，清空X已消失，输入仍有可见目标焦点外环。 |
| 68 | screens/rc-line-edit/chromium/000182-5-actual.png · shadcn-light-medium-filled-clear.png | 65f6298615b056546e6590550a7d8bf8df640f014f0e7ee7438525f2a2a54f92 | 清空后的filled显示占位，清空X已消失，输入仍有可见目标焦点外环。 |
| 69 | screens/rc-line-edit/chromium/000183-2-actual.png · shadcn-light-medium-outlined-error.png | 6ae4c9c5e5559fa6f70d388323e1dc1f36e29d44ddb04aa36263bd4517e92dd7 | 红色标签/边框及错误帮助文完整，未见文案裁切。 |
| 70 | screens/rc-line-edit/chromium/000183-5-actual.png · shadcn-light-medium-filled-error.png | 6ae4c9c5e5559fa6f70d388323e1dc1f36e29d44ddb04aa36263bd4517e92dd7 | 红色标签/边框及错误帮助文完整，未见文案裁切。 |
| 71 | screens/rc-line-edit/chromium/000184-2-actual.png · shadcn-light-medium-outlined-warning.png | 20b34a5673dfa11948f83ef265274bb69dadb4231bdf824c8afd215b963a8ae4 | 橙色边框、标签及支持文完整可辨。 |
| 72 | screens/rc-line-edit/chromium/000184-5-actual.png · shadcn-light-medium-filled-warning.png | 20b34a5673dfa11948f83ef265274bb69dadb4231bdf824c8afd215b963a8ae4 | 橙色边框、标签及支持文完整可辨。 |
| 73 | screens/rc-line-edit/chromium/000185-2-actual.png · shadcn-light-medium-outlined-disabled.png | a5f60f22e63e90fac672add967d606939512912bdc9d25193dbe040049d8ff21 | 禁用标签与支持文变淡，框和占位仍可辨；实际disabled由原生断言确认。 |
| 74 | screens/rc-line-edit/chromium/000185-5-actual.png · shadcn-light-medium-filled-disabled.png | a5f60f22e63e90fac672add967d606939512912bdc9d25193dbe040049d8ff21 | 禁用标签与支持文变淡，框和占位仍可辨；实际disabled由原生断言确认。 |
| 75 | screens/rc-line-edit/chromium/000186-2-actual.png · shadcn-light-medium-outlined-read-only.png | a1c262196a6363da79a44c1b049ca375210f03c651b69e5c8f1da572e5dd88cd | 只读静态外观接近普通空字段；框、标签和支持文完整，readonly行为不由PNG替代。 |
| 76 | screens/rc-line-edit/chromium/000186-5-actual.png · shadcn-light-medium-filled-read-only.png | a1c262196a6363da79a44c1b049ca375210f03c651b69e5c8f1da572e5dd88cd | 只读静态外观接近普通空字段；框、标签和支持文完整，readonly行为不由PNG替代。 |
| 77 | screens/rc-line-edit/chromium/000187-2-actual.png · shadcn-light-large-outlined-default.png | 2ce07d976dcdc79224d50dfe3cec65db316f60ab27e5f25e39db5b989da60773 | 两个空字段的标签、占位、支持文和圆角边界完整。 |
| 78 | screens/rc-line-edit/chromium/000187-5-actual.png · shadcn-light-large-filled-default.png | 2ce07d976dcdc79224d50dfe3cec65db316f60ab27e5f25e39db5b989da60773 | 两个空字段的标签、占位、支持文和圆角边界完整。 |
| 79 | screens/rc-line-edit/chromium/000188-2-actual.png · shadcn-light-large-outlined-hover.png | 32f9e83a1c20466a14638b55aa48cc2fefdeb21821c1df51f4281a594f4e7ca9 | outlined悬停边界加深/变亮，另一字段保持普通边界。 |
| 80 | screens/rc-line-edit/chromium/000188-5-actual.png · shadcn-light-large-filled-hover.png | 887db9ff38812ec22c1268d997f3094349bd696c174055a03cff24b9fcb40297 | filled悬停边界加深/变亮，另一字段保持普通边界。 |
| 81 | screens/rc-line-edit/chromium/000189-2-actual.png · shadcn-light-large-outlined-focus-visible.png | e75e64b6f3f4508e3212d0d5bd852c864598c731584c2f776dc3c1d65b924733 | 真实键盘焦点位于outlined；完整外环可见，标签与帮助文未被环裁切。 |
| 82 | screens/rc-line-edit/chromium/000189-5-actual.png · shadcn-light-large-filled-focus-visible.png | 730dfcbb8dafe2a0517be4e5d8b693ddabef655a9734c2e9cacbdd90d7953909 | 真实键盘焦点位于filled；完整外环可见，标签与帮助文未被环裁切。 |
| 83 | screens/rc-line-edit/chromium/000190-2-actual.png · shadcn-light-large-outlined-filled.png | aec7c41c2ec16cb167eaadc0720500d73c453549135aba7ccf5fea47df4c0c97 | 两字段均显示“设计工作台”和清空X，字形与图标不重叠；静态相同外观另列重复SHA。 |
| 84 | screens/rc-line-edit/chromium/000190-5-actual.png · shadcn-light-large-filled-filled.png | aec7c41c2ec16cb167eaadc0720500d73c453549135aba7ccf5fea47df4c0c97 | 两字段均显示“设计工作台”和清空X，字形与图标不重叠；静态相同外观另列重复SHA。 |
| 85 | screens/rc-line-edit/chromium/000191-2-actual.png · shadcn-light-large-outlined-clear.png | 685cee0c5e3963c2c534f15b2d9a2b4e78f786c5fffa57ee86b9a143058f44bb | 清空后的outlined显示占位，清空X已消失，输入仍有可见目标焦点外环。 |
| 86 | screens/rc-line-edit/chromium/000191-5-actual.png · shadcn-light-large-filled-clear.png | c9dd5cb0fbfd2a2abfdaee24ce75a08a17fd0a49841895f05f670c12f6e2d7e2 | 清空后的filled显示占位，清空X已消失，输入仍有可见目标焦点外环。 |
| 87 | screens/rc-line-edit/chromium/000192-2-actual.png · shadcn-light-large-outlined-error.png | eeb3f9578c0c5b67d3554102db04682ac63c94c1ae144c7f562ea4aa590c065e | 红色标签/边框及错误帮助文完整，未见文案裁切。 |
| 88 | screens/rc-line-edit/chromium/000192-5-actual.png · shadcn-light-large-filled-error.png | eeb3f9578c0c5b67d3554102db04682ac63c94c1ae144c7f562ea4aa590c065e | 红色标签/边框及错误帮助文完整，未见文案裁切。 |
| 89 | screens/rc-line-edit/chromium/000193-2-actual.png · shadcn-light-large-outlined-warning.png | edd3307793e2b3a2385015f91fb71ca4acd975336be8b490f487ce3c6fa0a21e | 橙色边框、标签及支持文完整可辨。 |
| 90 | screens/rc-line-edit/chromium/000193-5-actual.png · shadcn-light-large-filled-warning.png | edd3307793e2b3a2385015f91fb71ca4acd975336be8b490f487ce3c6fa0a21e | 橙色边框、标签及支持文完整可辨。 |
| 91 | screens/rc-line-edit/chromium/000194-2-actual.png · shadcn-light-large-outlined-disabled.png | f08857e8277317a489546bda8d66691a2f67a417a2321caeaf98654b67a05967 | 禁用标签与支持文变淡，框和占位仍可辨；实际disabled由原生断言确认。 |
| 92 | screens/rc-line-edit/chromium/000194-5-actual.png · shadcn-light-large-filled-disabled.png | f08857e8277317a489546bda8d66691a2f67a417a2321caeaf98654b67a05967 | 禁用标签与支持文变淡，框和占位仍可辨；实际disabled由原生断言确认。 |
| 93 | screens/rc-line-edit/chromium/000195-2-actual.png · shadcn-light-large-outlined-read-only.png | 01fde45e2bc4862d3737bf9891cb2677f157984d973e7281b1d4b7da8b6d2863 | 只读静态外观接近普通空字段；框、标签和支持文完整，readonly行为不由PNG替代。 |
| 94 | screens/rc-line-edit/chromium/000195-5-actual.png · shadcn-light-large-filled-read-only.png | 01fde45e2bc4862d3737bf9891cb2677f157984d973e7281b1d4b7da8b6d2863 | 只读静态外观接近普通空字段；框、标签和支持文完整，readonly行为不由PNG替代。 |
| 95 | screens/rc-line-edit/chromium/000196-2-actual.png · shadcn-dark-small-outlined-default.png | 6a2b39788ff1eb0192ee6a2087dac5b2c3b4ef9bf712db8571004812a13a1713 | 两个空字段的标签、占位、支持文和圆角边界完整。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 96 | screens/rc-line-edit/chromium/000196-5-actual.png · shadcn-dark-small-filled-default.png | 6a2b39788ff1eb0192ee6a2087dac5b2c3b4ef9bf712db8571004812a13a1713 | 两个空字段的标签、占位、支持文和圆角边界完整。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 97 | screens/rc-line-edit/chromium/000197-2-actual.png · shadcn-dark-small-outlined-hover.png | e69179280586cf3211dd4be78db95d8468983949388632e9a45f739af9406d83 | outlined悬停边界加深/变亮，另一字段保持普通边界。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 98 | screens/rc-line-edit/chromium/000197-5-actual.png · shadcn-dark-small-filled-hover.png | 611c4ab06dd6a5eec2f50f202288278d4c7e5f5ac4a018eb2c0a391f356806b9 | filled悬停边界加深/变亮，另一字段保持普通边界。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 99 | screens/rc-line-edit/chromium/000198-2-actual.png · shadcn-dark-small-outlined-focus-visible.png | dc3fa4cb0107bd69fb3c1a5c3e9e6b128eb5daea07731baed8e38e316d5042f9 | 真实键盘焦点位于outlined；完整外环可见，标签与帮助文未被环裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 100 | screens/rc-line-edit/chromium/000198-5-actual.png · shadcn-dark-small-filled-focus-visible.png | f1d32041eb56e9807d4136c1e70a1361bea78d8762b172923fff57a6bda85b84 | 真实键盘焦点位于filled；完整外环可见，标签与帮助文未被环裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 101 | screens/rc-line-edit/chromium/000199-2-actual.png · shadcn-dark-small-outlined-filled.png | 5f82f4d6a28dc2ef0cecd2a9b45ac6f1fe56add4b4a8c3c6c5c8bda8a70ad0c6 | 两字段均显示“设计工作台”和清空X，字形与图标不重叠；静态相同外观另列重复SHA。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 102 | screens/rc-line-edit/chromium/000199-5-actual.png · shadcn-dark-small-filled-filled.png | 5f82f4d6a28dc2ef0cecd2a9b45ac6f1fe56add4b4a8c3c6c5c8bda8a70ad0c6 | 两字段均显示“设计工作台”和清空X，字形与图标不重叠；静态相同外观另列重复SHA。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 103 | screens/rc-line-edit/chromium/000200-2-actual.png · shadcn-dark-small-outlined-clear.png | 086154d7d971a54fed0023e0aa27a5b6b9dd042b3b22ef95f274ff1cf0315f0f | 清空后的outlined显示占位，清空X已消失，输入仍有可见目标焦点外环。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 104 | screens/rc-line-edit/chromium/000200-5-actual.png · shadcn-dark-small-filled-clear.png | d3c8f4f53cce5d5d15c3934fd7730303c44ffbd1829979c2177ded7ee318a364 | 清空后的filled显示占位，清空X已消失，输入仍有可见目标焦点外环。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 105 | screens/rc-line-edit/chromium/000201-2-actual.png · shadcn-dark-small-outlined-error.png | 6a1e6f6364cb062f2f278d18e523113826b0460ae486c09553b5eeea0c206dc4 | 浅红标签/边框及错误帮助文完整，未见文案裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 106 | screens/rc-line-edit/chromium/000201-5-actual.png · shadcn-dark-small-filled-error.png | 6a1e6f6364cb062f2f278d18e523113826b0460ae486c09553b5eeea0c206dc4 | 浅红标签/边框及错误帮助文完整，未见文案裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 107 | screens/rc-line-edit/chromium/000202-2-actual.png · shadcn-dark-small-outlined-warning.png | c904708208985712165c3dcefd1cad73a352bcc6744bd770ac28b5a25a08e81f | 橙黄边框、标签及支持文完整可辨。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 108 | screens/rc-line-edit/chromium/000202-5-actual.png · shadcn-dark-small-filled-warning.png | c904708208985712165c3dcefd1cad73a352bcc6744bd770ac28b5a25a08e81f | 橙黄边框、标签及支持文完整可辨。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 109 | screens/rc-line-edit/chromium/000203-2-actual.png · shadcn-dark-small-outlined-disabled.png | dc36bd7515564a7d24d89ac463b0f939c9c36f2a012f92360130dbc443ba351c | 禁用标签与支持文变淡，框和占位仍可辨；实际disabled由原生断言确认。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 110 | screens/rc-line-edit/chromium/000203-5-actual.png · shadcn-dark-small-filled-disabled.png | dc36bd7515564a7d24d89ac463b0f939c9c36f2a012f92360130dbc443ba351c | 禁用标签与支持文变淡，框和占位仍可辨；实际disabled由原生断言确认。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 111 | screens/rc-line-edit/chromium/000204-2-actual.png · shadcn-dark-small-outlined-read-only.png | 5ac87f415473e8b11da459ea97593b2760cc117868ac516b42866722e68829dc | 只读静态外观接近普通空字段；框、标签和支持文完整，readonly行为不由PNG替代。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 112 | screens/rc-line-edit/chromium/000204-5-actual.png · shadcn-dark-small-filled-read-only.png | 5ac87f415473e8b11da459ea97593b2760cc117868ac516b42866722e68829dc | 只读静态外观接近普通空字段；框、标签和支持文完整，readonly行为不由PNG替代。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 113 | screens/rc-line-edit/chromium/000205-2-actual.png · shadcn-dark-medium-outlined-default.png | b96afb6df06a96c9fca4176ffce925e41c8debcc29ec07aa3ab033e010a17028 | 两个空字段的标签、占位、支持文和圆角边界完整。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 114 | screens/rc-line-edit/chromium/000205-5-actual.png · shadcn-dark-medium-filled-default.png | b96afb6df06a96c9fca4176ffce925e41c8debcc29ec07aa3ab033e010a17028 | 两个空字段的标签、占位、支持文和圆角边界完整。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 115 | screens/rc-line-edit/chromium/000206-2-actual.png · shadcn-dark-medium-outlined-hover.png | 9379a503f7410384ccba3afb72b6d9e049a4d534433ffcd516be27367db5f592 | outlined悬停边界加深/变亮，另一字段保持普通边界。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 116 | screens/rc-line-edit/chromium/000206-5-actual.png · shadcn-dark-medium-filled-hover.png | 1ff89c4c55207a7007b3d55681bae2061eb22a02a7b06cf9df56db20023e0b96 | filled悬停边界加深/变亮，另一字段保持普通边界。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 117 | screens/rc-line-edit/chromium/000207-2-actual.png · shadcn-dark-medium-outlined-focus-visible.png | 5ccd9c34f14f0b0974c3866b21cc095396d03232ebd0c82b998cd2153872b530 | 真实键盘焦点位于outlined；完整外环可见，标签与帮助文未被环裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 118 | screens/rc-line-edit/chromium/000207-5-actual.png · shadcn-dark-medium-filled-focus-visible.png | c83a152d98f15372f7e7fdce2e2fba4953ace5276081fde4a195172a3ab88a23 | 真实键盘焦点位于filled；完整外环可见，标签与帮助文未被环裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 119 | screens/rc-line-edit/chromium/000208-2-actual.png · shadcn-dark-medium-outlined-filled.png | 757ff43d36a86afe8a79b808a257de8c0fa420638c7bfca083cc71480fc41b9f | 两字段均显示“设计工作台”和清空X，字形与图标不重叠；静态相同外观另列重复SHA。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 120 | screens/rc-line-edit/chromium/000208-5-actual.png · shadcn-dark-medium-filled-filled.png | 757ff43d36a86afe8a79b808a257de8c0fa420638c7bfca083cc71480fc41b9f | 两字段均显示“设计工作台”和清空X，字形与图标不重叠；静态相同外观另列重复SHA。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 121 | screens/rc-line-edit/chromium/000209-2-actual.png · shadcn-dark-medium-outlined-clear.png | 83de78ae2f827512e249b00d1b6c554b56aa73a3be29169a1ffc66e3df551264 | 清空后的outlined显示占位，清空X已消失，输入仍有可见目标焦点外环。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 122 | screens/rc-line-edit/chromium/000209-5-actual.png · shadcn-dark-medium-filled-clear.png | fd5a4169b7c8f3c0f7541cfdee446fa58125c7c1d1ee65a42e9c9b822f4f0f60 | 清空后的filled显示占位，清空X已消失，输入仍有可见目标焦点外环。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 123 | screens/rc-line-edit/chromium/000210-2-actual.png · shadcn-dark-medium-outlined-error.png | 18506f03569808c653a51cf8af6ee89d3d3237045c26d6dc23421a45c0cc7bcd | 浅红标签/边框及错误帮助文完整，未见文案裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 124 | screens/rc-line-edit/chromium/000210-5-actual.png · shadcn-dark-medium-filled-error.png | 18506f03569808c653a51cf8af6ee89d3d3237045c26d6dc23421a45c0cc7bcd | 浅红标签/边框及错误帮助文完整，未见文案裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 125 | screens/rc-line-edit/chromium/000211-2-actual.png · shadcn-dark-medium-outlined-warning.png | 309cc39c50991882363b872aac17a34bfe79a9baef48fbf4e003bae18fe651aa | 橙黄边框、标签及支持文完整可辨。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 126 | screens/rc-line-edit/chromium/000211-5-actual.png · shadcn-dark-medium-filled-warning.png | 309cc39c50991882363b872aac17a34bfe79a9baef48fbf4e003bae18fe651aa | 橙黄边框、标签及支持文完整可辨。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 127 | screens/rc-line-edit/chromium/000212-2-actual.png · shadcn-dark-medium-outlined-disabled.png | 947c816ab2314da73c7f3c05ace6f81fa3bb9df3eb8f8c0a242d5edbeb77c5e4 | 禁用标签与支持文变淡，框和占位仍可辨；实际disabled由原生断言确认。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 128 | screens/rc-line-edit/chromium/000212-5-actual.png · shadcn-dark-medium-filled-disabled.png | 947c816ab2314da73c7f3c05ace6f81fa3bb9df3eb8f8c0a242d5edbeb77c5e4 | 禁用标签与支持文变淡，框和占位仍可辨；实际disabled由原生断言确认。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 129 | screens/rc-line-edit/chromium/000213-2-actual.png · shadcn-dark-medium-outlined-read-only.png | 8de38ddb1e8eaca1d9b2825267e37bfe472ac6984cd4e350f6dddec9a9cc0a91 | 只读静态外观接近普通空字段；框、标签和支持文完整，readonly行为不由PNG替代。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 130 | screens/rc-line-edit/chromium/000213-5-actual.png · shadcn-dark-medium-filled-read-only.png | 8de38ddb1e8eaca1d9b2825267e37bfe472ac6984cd4e350f6dddec9a9cc0a91 | 只读静态外观接近普通空字段；框、标签和支持文完整，readonly行为不由PNG替代。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 131 | screens/rc-line-edit/chromium/000214-2-actual.png · shadcn-dark-large-outlined-default.png | 54376f8d7c2a4b7d6b31573b8b9a6f301d525d214aa6ab7be3055465dfd2c0dc | 两个空字段的标签、占位、支持文和圆角边界完整。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 132 | screens/rc-line-edit/chromium/000214-5-actual.png · shadcn-dark-large-filled-default.png | 54376f8d7c2a4b7d6b31573b8b9a6f301d525d214aa6ab7be3055465dfd2c0dc | 两个空字段的标签、占位、支持文和圆角边界完整。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 133 | screens/rc-line-edit/chromium/000215-2-actual.png · shadcn-dark-large-outlined-hover.png | f4f9feab02118faadbbe2d4fc22cb3e633fcd1d23877e865649dcb65cdf2e657 | outlined悬停边界加深/变亮，另一字段保持普通边界。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 134 | screens/rc-line-edit/chromium/000215-5-actual.png · shadcn-dark-large-filled-hover.png | 5f87bd2cd8309f9e837cf1773135391198aa07b92c3b2d252dd43fb70da7ea82 | filled悬停边界加深/变亮，另一字段保持普通边界。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 135 | screens/rc-line-edit/chromium/000216-2-actual.png · shadcn-dark-large-outlined-focus-visible.png | 06b9bcdb22d5634ad5a10d59a0ae5e583d246ecb21a5717727e0355cd4f184a1 | 真实键盘焦点位于outlined；完整外环可见，标签与帮助文未被环裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 136 | screens/rc-line-edit/chromium/000216-5-actual.png · shadcn-dark-large-filled-focus-visible.png | f7162ca27e30c2e269bd8a97460db7dc7c7edf771b13b72ae09f37e56502778a | 真实键盘焦点位于filled；完整外环可见，标签与帮助文未被环裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 137 | screens/rc-line-edit/chromium/000217-2-actual.png · shadcn-dark-large-outlined-filled.png | e84c5c89baf9b65d69afa101d1bb795da719b356589bb94ffcc118a02abbeb9e | 两字段均显示“设计工作台”和清空X，字形与图标不重叠；静态相同外观另列重复SHA。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 138 | screens/rc-line-edit/chromium/000217-5-actual.png · shadcn-dark-large-filled-filled.png | e84c5c89baf9b65d69afa101d1bb795da719b356589bb94ffcc118a02abbeb9e | 两字段均显示“设计工作台”和清空X，字形与图标不重叠；静态相同外观另列重复SHA。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 139 | screens/rc-line-edit/chromium/000218-2-actual.png · shadcn-dark-large-outlined-clear.png | 43d85a93e80a29ca5413fffb18799d54c2a82081f6e4c45ab1e3105c52e3fb3a | 清空后的outlined显示占位，清空X已消失，输入仍有可见目标焦点外环。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 140 | screens/rc-line-edit/chromium/000218-5-actual.png · shadcn-dark-large-filled-clear.png | fd9d7ed7a458485b7c6f393b843239beda74915d8d3a166515217f03c92f55f5 | 清空后的filled显示占位，清空X已消失，输入仍有可见目标焦点外环。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 141 | screens/rc-line-edit/chromium/000219-2-actual.png · shadcn-dark-large-outlined-error.png | eac4264325dfa46a87a67748fff5ebca4481d4a73ae6ff3b388a328bc7697adc | 浅红标签/边框及错误帮助文完整，未见文案裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 142 | screens/rc-line-edit/chromium/000219-5-actual.png · shadcn-dark-large-filled-error.png | eac4264325dfa46a87a67748fff5ebca4481d4a73ae6ff3b388a328bc7697adc | 浅红标签/边框及错误帮助文完整，未见文案裁切。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 143 | screens/rc-line-edit/chromium/000220-2-actual.png · shadcn-dark-large-outlined-warning.png | 7cba4c61c7837bb56b25e1b8367800df1ca2c6e291912677f83c552f76250aaf | 橙黄边框、标签及支持文完整可辨。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 144 | screens/rc-line-edit/chromium/000220-5-actual.png · shadcn-dark-large-filled-warning.png | 7cba4c61c7837bb56b25e1b8367800df1ca2c6e291912677f83c552f76250aaf | 橙黄边框、标签及支持文完整可辨。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 145 | screens/rc-line-edit/chromium/000221-2-actual.png · shadcn-dark-large-outlined-disabled.png | f4f9d787433bf8a98d712c732732d2aada1b405a75b614fb9f8492cf5f69eb5c | 禁用标签与支持文变淡，框和占位仍可辨；实际disabled由原生断言确认。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 146 | screens/rc-line-edit/chromium/000221-5-actual.png · shadcn-dark-large-filled-disabled.png | f4f9d787433bf8a98d712c732732d2aada1b405a75b614fb9f8492cf5f69eb5c | 禁用标签与支持文变淡，框和占位仍可辨；实际disabled由原生断言确认。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 147 | screens/rc-line-edit/chromium/000222-2-actual.png · shadcn-dark-large-outlined-read-only.png | 0f38abf9a7cb5e854cc7e3582f65ec45957b70bf23ebca7f8a76195aa8f83d9b | 只读静态外观接近普通空字段；框、标签和支持文完整，readonly行为不由PNG替代。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 148 | screens/rc-line-edit/chromium/000222-5-actual.png · shadcn-dark-large-filled-read-only.png | 0f38abf9a7cb5e854cc7e3582f65ec45957b70bf23ebca7f8a76195aa8f83d9b | 只读静态外观接近普通空字段；框、标签和支持文完整，readonly行为不由PNG替代。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |
| 149 | screens/rc-line-edit/chromium/000228-0-inventory-actual.png · test/visual/inventory.visual.spec.mjs | efba6e07d630ebe811f361b8b8952c65dd3ff4a1aad0069bd22166f4e8478c91 | 公开默认Demo的项目名空字段及CRAB-2026编号和帮助文完整，居于1280×720视口上方；仅默认库存范围。 |
| 150 | screens/rc-line-edit/chromium/000229-0-inventory-actual.png · test/visual/inventory.visual.spec.mjs | aebe06cdd10a0160b60612bf5e422e6b6333dec23433e30e35acdace9b0b6a60 | 公开默认Demo的项目名空字段及CRAB-2026编号和帮助文完整，居于1280×720视口上方；仅默认库存范围。 暗色未聚焦细描边层级较弱但可辨；本次未做边界对比度数值测量，不能据此签署数值合规。 |

重复SHA分组（完整路径与case id见JSON）：

- abba3822573d0a20ad5f6b20c2db4d7cc315393a7edec8836b346b972304cd40：序号 3、5、17（每张已实际查看）。
- 01f7781287d772f109829726424cd71bee3d1f1f4cd37fa31d2617372e6dd1fd：序号 4、6、18（每张已实际查看）。
- e87b26b85094af1fb61a85441d915f50b14ece9351dd4a717e2d34723728e689：序号 21、23、35（每张已实际查看）。
- 1be476af484a8eed7c5a8719525749c2524bb2b9f2e16db7918b7f1cd37627b4：序号 22、24、36（每张已实际查看）。
- 9988d24a83c4903591ba8e9fca21813bb2ec3ca32b7cefa9f08fa6413a4e8cf6：序号 41、42（每张已实际查看）。
- b728e5af35d7314bd2e1f9dc55343fa75fad65087a0e9d1cbc37bd572ee19aa5：序号 47、48（每张已实际查看）。
- 5042a1100f89a98b452c03e04f44150cdad3426b5bf182e79f9bfdaf0c99354c：序号 51、52（每张已实际查看）。
- f5cf07c6ec15bc65228954cffe68aaedd63ee7ea999f0a80329f316f41c556f6：序号 53、54（每张已实际查看）。
- f3b17606751c3f3020ee6104c3af9658cd95e273172f3bd68e080e289b110a64：序号 55、56（每张已实际查看）。
- bd236d6cf76aa1b4df13b2640a8e6e348bdd28c3b5731207ab5c2e41aa9ccccf：序号 57、58（每张已实际查看）。
- b84ded8f0b1b422a19bf27947086aab2979bb47231b5f57178859356c706e852：序号 59、60（每张已实际查看）。
- 3bbca7843cd2219a546bd8c12751b1f57e0378a4c44d97e969c5e90530c7861d：序号 65、66（每张已实际查看）。
- 6ae4c9c5e5559fa6f70d388323e1dc1f36e29d44ddb04aa36263bd4517e92dd7：序号 69、70（每张已实际查看）。
- 20b34a5673dfa11948f83ef265274bb69dadb4231bdf824c8afd215b963a8ae4：序号 71、72（每张已实际查看）。
- a5f60f22e63e90fac672add967d606939512912bdc9d25193dbe040049d8ff21：序号 73、74（每张已实际查看）。
- a1c262196a6363da79a44c1b049ca375210f03c651b69e5c8f1da572e5dd88cd：序号 75、76（每张已实际查看）。
- 2ce07d976dcdc79224d50dfe3cec65db316f60ab27e5f25e39db5b989da60773：序号 77、78（每张已实际查看）。
- aec7c41c2ec16cb167eaadc0720500d73c453549135aba7ccf5fea47df4c0c97：序号 83、84（每张已实际查看）。
- eeb3f9578c0c5b67d3554102db04682ac63c94c1ae144c7f562ea4aa590c065e：序号 87、88（每张已实际查看）。
- edd3307793e2b3a2385015f91fb71ca4acd975336be8b490f487ce3c6fa0a21e：序号 89、90（每张已实际查看）。
- f08857e8277317a489546bda8d66691a2f67a417a2321caeaf98654b67a05967：序号 91、92（每张已实际查看）。
- 01fde45e2bc4862d3737bf9891cb2677f157984d973e7281b1d4b7da8b6d2863：序号 93、94（每张已实际查看）。
- 6a2b39788ff1eb0192ee6a2087dac5b2c3b4ef9bf712db8571004812a13a1713：序号 95、96（每张已实际查看）。
- 5f82f4d6a28dc2ef0cecd2a9b45ac6f1fe56add4b4a8c3c6c5c8bda8a70ad0c6：序号 101、102（每张已实际查看）。
- 6a1e6f6364cb062f2f278d18e523113826b0460ae486c09553b5eeea0c206dc4：序号 105、106（每张已实际查看）。
- c904708208985712165c3dcefd1cad73a352bcc6744bd770ac28b5a25a08e81f：序号 107、108（每张已实际查看）。
- dc36bd7515564a7d24d89ac463b0f939c9c36f2a012f92360130dbc443ba351c：序号 109、110（每张已实际查看）。
- 5ac87f415473e8b11da459ea97593b2760cc117868ac516b42866722e68829dc：序号 111、112（每张已实际查看）。
- b96afb6df06a96c9fca4176ffce925e41c8debcc29ec07aa3ab033e010a17028：序号 113、114（每张已实际查看）。
- 757ff43d36a86afe8a79b808a257de8c0fa420638c7bfca083cc71480fc41b9f：序号 119、120（每张已实际查看）。
- 18506f03569808c653a51cf8af6ee89d3d3237045c26d6dc23421a45c0cc7bcd：序号 123、124（每张已实际查看）。
- 309cc39c50991882363b872aac17a34bfe79a9baef48fbf4e003bae18fe651aa：序号 125、126（每张已实际查看）。
- 947c816ab2314da73c7f3c05ace6f81fa3bb9df3eb8f8c0a242d5edbeb77c5e4：序号 127、128（每张已实际查看）。
- 8de38ddb1e8eaca1d9b2825267e37bfe472ac6984cd4e350f6dddec9a9cc0a91：序号 129、130（每张已实际查看）。
- 54376f8d7c2a4b7d6b31573b8b9a6f301d525d214aa6ab7be3055465dfd2c0dc：序号 131、132（每张已实际查看）。
- e84c5c89baf9b65d69afa101d1bb795da719b356589bb94ffcc118a02abbeb9e：序号 137、138（每张已实际查看）。
- eac4264325dfa46a87a67748fff5ebca4481d4a73ae6ff3b388a328bc7697adc：序号 141、142（每张已实际查看）。
- 7cba4c61c7837bb56b25e1b8367800df1ca2c6e291912677f83c552f76250aaf：序号 143、144（每张已实际查看）。
- f4f9d787433bf8a98d712c732732d2aada1b405a75b614fb9f8492cf5f69eb5c：序号 145、146（每张已实际查看）。
- 0f38abf9a7cb5e854cc7e3582f65ec45957b70bf23ebca7f8a76195aa8f83d9b：序号 147、148（每张已实际查看）。

原始results/cases/index/matrix、PNG及此前失败候选保持原样。详细来源文件SHA、case id、原生附件索引、配置、逐图观察和重复组见reviews-shadcn.json。
