# Radio shadcn：完整Windows候选原图复审

94张原PNG（含重复）已逐张view_image original查看，94/94 SHA与原生JSON附件及分组索引一致。仅接受本次Windows候选所见范围，无本次未解决的图像问题，不建立canonical/baseline/verified。

原生包级283通过、0失败、0跳过；216/216核心及60/60环境是原始自动结果，不替代人工观察。本次shadcn范围72核心图（3尺寸×明暗×12状态）、18九环境×明暗、2真实200%视口、2默认库存，共94。两worker before/after稳定。source sha256:9daf44b0af28600a9ca6a1eda4756b850b5aeab0c8d7c1d14c35f2a1eb7070ce；artifact sha256:20443e4d84be8d1f47a655910cf136f8040f69d7fe1a3414def821b75e2135e7。

重点：6张disabled-selected（32、44、56、68、80、92）灰色圆环/中心点与on输出一致。原生反馈助手读取实际DOM checked并核对本地化输出，不照抄Demo属性；人工确认对应原图所见，证据分开。三尺寸选中中心点、错误红/浅粉圆环及点、禁用对照均可辨，外焦点圈未裁边或压标签。暗色普通空环较弱的观察保留，未作数值对比度合规认定。

触控标记仍小，原生control命中区≥48×48px；RTL右侧控制/标签/结果镜像正确，窄屏自然两行、英文完整，品牌和系统强制颜色有据记录。真实200%两图显示实际可见视口中的主项、禁用对照、on及完整圆形焦点圈，绑定chrome.tabs.setZoom证明，不冒称全页。

本批70种原PNG字节，12重复SHA组，超首次重复24张；每张仍实际查看。静态相同不视为额外状态差异；按下仅为真实mouse.down期间外观，减少动画仅静态观察。

| 序号 | 原图/配置 | SHA-256 | 实际观察 |
| --- | --- | --- | --- |
| 1 | screens/rc-radio/chromium/000038-2-actual.png · shadcn-light-narrow.png | f448d19a8941762a0bff9704a1e97b776d75e47d131f18819f4ffbd9e58f25b2 | 主项深色圆环和中心点完整，on反馈对应实际选中；禁用对照灰度或系统色可辨。 窄屏标签自然换成两行，圆环/文字/输出均未横溢或裁切。 |
| 2 | screens/rc-radio/chromium/000039-2-actual.png · shadcn-light-tablet.png | 738ffdecbabe54c210a9caf2ffdd0973a8e97e4c5337a2351ef351ea72cca263 | 主项深色圆环和中心点完整，on反馈对应实际选中；禁用对照灰度或系统色可辨。 |
| 3 | screens/rc-radio/chromium/000040-2-actual.png · shadcn-light-desktop.png | 738ffdecbabe54c210a9caf2ffdd0973a8e97e4c5337a2351ef351ea72cca263 | 主项深色圆环和中心点完整，on反馈对应实际选中；禁用对照灰度或系统色可辨。 |
| 4 | screens/rc-radio/chromium/000041-2-actual.png · shadcn-light-touch.png | ccd257705ea7e50d6063ba1ce4f82a357b98c70ab7c6f57165a5186ce1a47aa6 | 主项深色圆环和中心点完整，on反馈对应实际选中；禁用对照灰度或系统色可辨。 可见小圆标记保持紧凑，外侧control真实触控命中区由原生测量≥48×48px，不能把圆点本身当48px。 |
| 5 | screens/rc-radio/chromium/000042-2-actual.png · shadcn-light-rtl.png | 92360c3a9d43fbc4b8b5164631abd9b0463524c447b6b5b2a6aa033653b0a4b7 | 主项深色圆环和中心点完整，on反馈对应实际选中；禁用对照灰度或系统色可辨。 圆环位于右边，标签和结果右对齐，逻辑镜像正确。 |
| 6 | screens/rc-radio/chromium/000043-2-actual.png · shadcn-light-english.png | b9cd4034c6d203519a893f00e4a8e048e4a56d48bff9a09a5a2151efaae1ddcc | 主项深色圆环和中心点完整，on反馈对应实际选中；禁用对照灰度或系统色可辨。 英文长标签、禁用说明及Selection: on完整。 |
| 7 | screens/rc-radio/chromium/000044-2-actual.png · shadcn-light-brand.png | 052f6d6708f6ea57d788c4f224d96a0883d03884f7c8db72d3f6ec71a464ddfa | 主项紫色圆环和中心点完整，on反馈对应实际选中；禁用对照灰度或系统色可辨。 品牌圆环/点清楚，禁用对照保持灰度。 |
| 8 | screens/rc-radio/chromium/000045-2-actual.png · shadcn-light-forced-colors.png | 9ce0d895bd05797dc11cccdad0627c41e883b16b48d493fde9750abe16d517f9 | 主项紫色圆环和中心点完整，on反馈对应实际选中；禁用对照灰度或系统色可辨。 禁用对照深红色是所见系统调色板，未误作普通模式error语义；文字和中心点可辨。 |
| 9 | screens/rc-radio/chromium/000046-2-actual.png · shadcn-light-reduced-motion.png | 738ffdecbabe54c210a9caf2ffdd0973a8e97e4c5337a2351ef351ea72cca263 | 主项深色圆环和中心点完整，on反馈对应实际选中；禁用对照灰度或系统色可辨。 仅确认该条件的静态外观，不从PNG证明动画时长。 |
| 10 | screens/rc-radio/chromium/000047-2-actual.png · shadcn-dark-narrow.png | 2fa69ef711ccb16af22b0d0465d8a9f9aea1d2119ce9d81b6e1e51d4b706f292 | 主项白色圆环和中心点完整，on反馈对应实际选中；禁用对照灰度或系统色可辨。 窄屏标签自然换成两行，圆环/文字/输出均未横溢或裁切。 |
| 11 | screens/rc-radio/chromium/000048-2-actual.png · shadcn-dark-tablet.png | 37fe2515c3065cfa05093fb29b8b0cff5fb2b51d6cf60ca106dd7d74ab7f510a | 主项白色圆环和中心点完整，on反馈对应实际选中；禁用对照灰度或系统色可辨。 |
| 12 | screens/rc-radio/chromium/000049-2-actual.png · shadcn-dark-desktop.png | 37fe2515c3065cfa05093fb29b8b0cff5fb2b51d6cf60ca106dd7d74ab7f510a | 主项白色圆环和中心点完整，on反馈对应实际选中；禁用对照灰度或系统色可辨。 |
| 13 | screens/rc-radio/chromium/000050-2-actual.png · shadcn-dark-touch.png | 53c4d7c9321a2e219a11ecbd2e187b6158f9a303e6e413d8402e652280eb4f4a | 主项白色圆环和中心点完整，on反馈对应实际选中；禁用对照灰度或系统色可辨。 可见小圆标记保持紧凑，外侧control真实触控命中区由原生测量≥48×48px，不能把圆点本身当48px。 |
| 14 | screens/rc-radio/chromium/000051-2-actual.png · shadcn-dark-rtl.png | 9802714524d84bcb1c39e1c862b410a97384db5ef3a1a6d2ed03b71d92c50e20 | 主项白色圆环和中心点完整，on反馈对应实际选中；禁用对照灰度或系统色可辨。 圆环位于右边，标签和结果右对齐，逻辑镜像正确。 |
| 15 | screens/rc-radio/chromium/000052-2-actual.png · shadcn-dark-english.png | 57f19dfcd3d7def9f6ead8f5f4cc48efdcd36c91ad06e2b5622da44af41ed014 | 主项白色圆环和中心点完整，on反馈对应实际选中；禁用对照灰度或系统色可辨。 英文长标签、禁用说明及Selection: on完整。 |
| 16 | screens/rc-radio/chromium/000053-2-actual.png · shadcn-dark-brand.png | 8fce78247bc8962a9a560f876276270c24daa3beec83381735b9409943ad57eb | 主项淡紫色圆环和中心点完整，on反馈对应实际选中；禁用对照灰度或系统色可辨。 品牌圆环/点清楚，禁用对照保持灰度。 |
| 17 | screens/rc-radio/chromium/000054-2-actual.png · shadcn-dark-forced-colors.png | da605816a95bb97f455b28945b1736ddefc41b9af3a6aa519fd627fc34eee192 | 主项青色圆环和中心点完整，on反馈对应实际选中；禁用对照灰度或系统色可辨。 禁用对照绿色是所见系统调色板，未误作普通模式error语义；文字和中心点可辨。 |
| 18 | screens/rc-radio/chromium/000055-2-actual.png · shadcn-dark-reduced-motion.png | 37fe2515c3065cfa05093fb29b8b0cff5fb2b51d6cf60ca106dd7d74ab7f510a | 主项白色圆环和中心点完整，on反馈对应实际选中；禁用对照灰度或系统色可辨。 仅确认该条件的静态外观，不从PNG证明动画时长。 |
| 19 | screens/rc-radio/chromium/000060-4-actual-zoom-200.png · shadcn-light-zoom-200.png | 89bf38aea152067362cf8fdf73cb36aa90156f2679f0dbc19d40795d35beefdd | 真实200%可见视口里主项选中中心点、禁用对照、on输出与圆形外焦点环均完整，长标签未裁；仅可见视口，不冒称全页/其他缩放。 |
| 20 | screens/rc-radio/chromium/000061-4-actual-zoom-200.png · shadcn-dark-zoom-200.png | 914e3eac5da045d40043ac3c4d37cb8718734a1ddd1e48689a236010e2963906 | 真实200%可见视口里主项选中中心点、禁用对照、on输出与圆形外焦点环均完整，长标签未裁；仅可见视口，不冒称全页/其他缩放。 |
| 21 | screens/rc-radio/chromium/000206-2-actual.png · shadcn-light-small-default.png | b7b5c1013143237fea8edddbea0cd1889dac9fd1cd1eab80efbe046bcea05626 | 深色空圆和标签完整，未选off对应实际状态。 |
| 22 | screens/rc-radio/chromium/000207-2-actual.png · shadcn-light-small-hover.png | da4cb674bdf90bec9a3971fe59bb7a080bd6fe7b16bdb4bbe4a897ea8d2a1cb5 | 深色空圆和标签完整，未选off对应实际状态。 悬停环/点可辨；差异较轻，真实hover动作不由静态PNG替代。 |
| 23 | screens/rc-radio/chromium/000208-2-actual.png · shadcn-light-small-focus-visible.png | e6f1365f3a52e71435704956240af7433905046d4269aed5f51ce6bb96e71024 | 深色空圆和标签完整，未选off对应实际状态。 实际键盘圆形外焦点环完整，四边未裁，未与标签重叠。 |
| 24 | screens/rc-radio/chromium/000209-2-actual.png · shadcn-light-small-pressed.png | da4cb674bdf90bec9a3971fe59bb7a080bd6fe7b16bdb4bbe4a897ea8d2a1cb5 | 深色空圆和标签完整，未选off对应实际状态。 原生mouse.down时采集；静态按下差异小，不据此宣称独立明显压下动画。 |
| 25 | screens/rc-radio/chromium/000210-2-actual.png · shadcn-light-small-selected.png | c2f7199599f746d69dd96b8d0a937d67d29e20c29670a29adb8b0a9cd1a8bf69 | 深色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 |
| 26 | screens/rc-radio/chromium/000211-2-actual.png · shadcn-light-small-selected-hover.png | c2f7199599f746d69dd96b8d0a937d67d29e20c29670a29adb8b0a9cd1a8bf69 | 深色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 悬停环/点可辨；差异较轻，真实hover动作不由静态PNG替代。 |
| 27 | screens/rc-radio/chromium/000212-2-actual.png · shadcn-light-small-selected-focus-visible.png | 02cebb9f1c3a78179cb80a0f605e2f57d345e721278b9aedf9af006b4e38f85d | 深色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 实际键盘圆形外焦点环完整，四边未裁，未与标签重叠。 |
| 28 | screens/rc-radio/chromium/000213-2-actual.png · shadcn-light-small-selected-pressed.png | c2f7199599f746d69dd96b8d0a937d67d29e20c29670a29adb8b0a9cd1a8bf69 | 深色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 原生mouse.down时采集；静态按下差异小，不据此宣称独立明显压下动画。 |
| 29 | screens/rc-radio/chromium/000214-2-actual.png · shadcn-light-small-error.png | db080e858b1472d515fbc6002bd54c55a2e5a9e27b082de51dbca631475e9b90 | 深色空圆和标签完整，未选off对应实际状态。 红色错误环/选中点及错误说明句可见，无裁字。 |
| 30 | screens/rc-radio/chromium/000215-2-actual.png · shadcn-light-small-selected-error.png | 9b7c1198f5e494ef1aa5d638169becad0f5721a1f14fab5549acaa4f51129883 | 红色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 红色错误环/选中点及错误说明句可见，无裁字。 |
| 31 | screens/rc-radio/chromium/000216-2-actual.png · shadcn-light-small-disabled.png | f692164c3afa2e49cf7c5beb154e866c2d7b4544a80b846db4e3e5cfdf412b5c | 禁用灰色空圆和标签完整，未选off对应实际状态。 |
| 32 | screens/rc-radio/chromium/000217-2-actual.png · shadcn-light-small-disabled-selected.png | a945608f5b3f888bd3002dbb7d8b5e6d3a814cd1c561646c952476f86fb6974f | 主项实际灰色中心点和圆环完整，标签呈禁用灰度；输出为on，与实际checked=true一致，无已选却off矛盾。 |
| 33 | screens/rc-radio/chromium/000218-2-actual.png · shadcn-light-medium-default.png | 84ba0097bd23a25f27ae9fff39aa30bf0aa558f431a5ba63a7b7cf8ecd950bac | 深色空圆和标签完整，未选off对应实际状态。 |
| 34 | screens/rc-radio/chromium/000219-2-actual.png · shadcn-light-medium-hover.png | 6ed158d378bcbccbb66b57bf0dd943027ee76aa4291693342b832dd83249f0dc | 深色空圆和标签完整，未选off对应实际状态。 悬停环/点可辨；差异较轻，真实hover动作不由静态PNG替代。 |
| 35 | screens/rc-radio/chromium/000220-2-actual.png · shadcn-light-medium-focus-visible.png | 4721ed28e671691076c78f6ec5c70c2ce68deceb5bd6d14734d319a085b4df04 | 深色空圆和标签完整，未选off对应实际状态。 实际键盘圆形外焦点环完整，四边未裁，未与标签重叠。 |
| 36 | screens/rc-radio/chromium/000221-2-actual.png · shadcn-light-medium-pressed.png | 6ed158d378bcbccbb66b57bf0dd943027ee76aa4291693342b832dd83249f0dc | 深色空圆和标签完整，未选off对应实际状态。 原生mouse.down时采集；静态按下差异小，不据此宣称独立明显压下动画。 |
| 37 | screens/rc-radio/chromium/000222-2-actual.png · shadcn-light-medium-selected.png | 738ffdecbabe54c210a9caf2ffdd0973a8e97e4c5337a2351ef351ea72cca263 | 深色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 |
| 38 | screens/rc-radio/chromium/000223-2-actual.png · shadcn-light-medium-selected-hover.png | 738ffdecbabe54c210a9caf2ffdd0973a8e97e4c5337a2351ef351ea72cca263 | 深色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 悬停环/点可辨；差异较轻，真实hover动作不由静态PNG替代。 |
| 39 | screens/rc-radio/chromium/000224-2-actual.png · shadcn-light-medium-selected-focus-visible.png | cd0163d2dd81330cb8913791c5065bb44f79e76c8bc9fa0384c8d3c91a6d4b0d | 深色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 实际键盘圆形外焦点环完整，四边未裁，未与标签重叠。 |
| 40 | screens/rc-radio/chromium/000225-2-actual.png · shadcn-light-medium-selected-pressed.png | 738ffdecbabe54c210a9caf2ffdd0973a8e97e4c5337a2351ef351ea72cca263 | 深色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 原生mouse.down时采集；静态按下差异小，不据此宣称独立明显压下动画。 |
| 41 | screens/rc-radio/chromium/000226-2-actual.png · shadcn-light-medium-error.png | e6d1debd922d71bd6ffbef0a0013958dc082dfbf12dd83a5233228433e73335c | 深色空圆和标签完整，未选off对应实际状态。 红色错误环/选中点及错误说明句可见，无裁字。 |
| 42 | screens/rc-radio/chromium/000227-2-actual.png · shadcn-light-medium-selected-error.png | 133fd46f6676ee4d8d30d39f204ab9c188ddd7a055dd7f0a2b2a68139265218b | 红色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 红色错误环/选中点及错误说明句可见，无裁字。 |
| 43 | screens/rc-radio/chromium/000228-2-actual.png · shadcn-light-medium-disabled.png | 9851f357598f61ea41a6b4f75208764211f6ba0e29727cc45817114d64587b6a | 禁用灰色空圆和标签完整，未选off对应实际状态。 |
| 44 | screens/rc-radio/chromium/000229-2-actual.png · shadcn-light-medium-disabled-selected.png | 4a771b1537ae069c27458109e5abd77cba0583048958a7f9a7d9d3442b22eabe | 主项实际灰色中心点和圆环完整，标签呈禁用灰度；输出为on，与实际checked=true一致，无已选却off矛盾。 |
| 45 | screens/rc-radio/chromium/000230-2-actual.png · shadcn-light-large-default.png | 1f53818b5e25c19402c8099101567fa495f20824617d7b24cf72ed89d7a53100 | 深色空圆和标签完整，未选off对应实际状态。 |
| 46 | screens/rc-radio/chromium/000231-2-actual.png · shadcn-light-large-hover.png | bf3ac4f971894af7803ba8424aeed59d030cf7383338d665df8dcbfc8e7d5ede | 深色空圆和标签完整，未选off对应实际状态。 悬停环/点可辨；差异较轻，真实hover动作不由静态PNG替代。 |
| 47 | screens/rc-radio/chromium/000232-2-actual.png · shadcn-light-large-focus-visible.png | b6f8efeb6cb2c01da642029770f10e8d25aa8a42169aa50bd0107a344b12a363 | 深色空圆和标签完整，未选off对应实际状态。 实际键盘圆形外焦点环完整，四边未裁，未与标签重叠。 |
| 48 | screens/rc-radio/chromium/000233-2-actual.png · shadcn-light-large-pressed.png | bf3ac4f971894af7803ba8424aeed59d030cf7383338d665df8dcbfc8e7d5ede | 深色空圆和标签完整，未选off对应实际状态。 原生mouse.down时采集；静态按下差异小，不据此宣称独立明显压下动画。 |
| 49 | screens/rc-radio/chromium/000234-2-actual.png · shadcn-light-large-selected.png | b9f8ce5bf7867cb657b5e432385ef79001cee13890520c53df93acabe23d3a8a | 深色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 |
| 50 | screens/rc-radio/chromium/000235-2-actual.png · shadcn-light-large-selected-hover.png | b9f8ce5bf7867cb657b5e432385ef79001cee13890520c53df93acabe23d3a8a | 深色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 悬停环/点可辨；差异较轻，真实hover动作不由静态PNG替代。 |
| 51 | screens/rc-radio/chromium/000236-2-actual.png · shadcn-light-large-selected-focus-visible.png | aabde18c18f66bfba7a225759c4c4d8adb7b6ae9df74ea6a5dfb8902515f94f0 | 深色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 实际键盘圆形外焦点环完整，四边未裁，未与标签重叠。 |
| 52 | screens/rc-radio/chromium/000237-2-actual.png · shadcn-light-large-selected-pressed.png | b9f8ce5bf7867cb657b5e432385ef79001cee13890520c53df93acabe23d3a8a | 深色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 原生mouse.down时采集；静态按下差异小，不据此宣称独立明显压下动画。 |
| 53 | screens/rc-radio/chromium/000238-2-actual.png · shadcn-light-large-error.png | 150a584f9df5b3c4f2c039f4add8a99ca4366c4a823e8f47712a10daa1d0db8c | 深色空圆和标签完整，未选off对应实际状态。 红色错误环/选中点及错误说明句可见，无裁字。 |
| 54 | screens/rc-radio/chromium/000239-2-actual.png · shadcn-light-large-selected-error.png | aaa3e56d4707b446e4f49651e0cf20bf1957cd046116e258fe62e6cdbfb53c87 | 红色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 红色错误环/选中点及错误说明句可见，无裁字。 |
| 55 | screens/rc-radio/chromium/000240-2-actual.png · shadcn-light-large-disabled.png | ebd4ca6211ae623d43727555451af1515b8d18bdec90cfd1ebc49f63735b2c40 | 禁用灰色空圆和标签完整，未选off对应实际状态。 |
| 56 | screens/rc-radio/chromium/000241-2-actual.png · shadcn-light-large-disabled-selected.png | 19e69a0e46f4bebfbfdf82633de4c24a7eced1602aa84f21a904b0b8b943d660 | 主项实际灰色中心点和圆环完整，标签呈禁用灰度；输出为on，与实际checked=true一致，无已选却off矛盾。 |
| 57 | screens/rc-radio/chromium/000242-2-actual.png · shadcn-dark-small-default.png | 45d8e47daad76e8402065f7787fb580eb069e354192b922e17939fe6ca6c5694 | 灰色空圆和标签完整，未选off对应实际状态。 暗色普通空环层级较弱但可见；本次无数值对比度测量，未据此签署合规。 |
| 58 | screens/rc-radio/chromium/000243-2-actual.png · shadcn-dark-small-hover.png | 911c3db36347e5d42d44b8fdb092f39d815aac5f2de66bbaeeb1f080e5ad5d76 | 灰色空圆和标签完整，未选off对应实际状态。 悬停环/点可辨；差异较轻，真实hover动作不由静态PNG替代。 暗色普通空环层级较弱但可见；本次无数值对比度测量，未据此签署合规。 |
| 59 | screens/rc-radio/chromium/000244-2-actual.png · shadcn-dark-small-focus-visible.png | 74bec305bd7d3eb9402fdf9b2a8faf77f7c53844c0a970d69f49a8caada640c6 | 灰色空圆和标签完整，未选off对应实际状态。 实际键盘圆形外焦点环完整，四边未裁，未与标签重叠。 暗色普通空环层级较弱但可见；本次无数值对比度测量，未据此签署合规。 |
| 60 | screens/rc-radio/chromium/000245-2-actual.png · shadcn-dark-small-pressed.png | 911c3db36347e5d42d44b8fdb092f39d815aac5f2de66bbaeeb1f080e5ad5d76 | 灰色空圆和标签完整，未选off对应实际状态。 原生mouse.down时采集；静态按下差异小，不据此宣称独立明显压下动画。 暗色普通空环层级较弱但可见；本次无数值对比度测量，未据此签署合规。 |
| 61 | screens/rc-radio/chromium/000246-2-actual.png · shadcn-dark-small-selected.png | 1fc664c57f31cb9c4cd16807619801ec7efb4738061a7dbf0d179029dab1af75 | 白色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 |
| 62 | screens/rc-radio/chromium/000247-2-actual.png · shadcn-dark-small-selected-hover.png | 1fc664c57f31cb9c4cd16807619801ec7efb4738061a7dbf0d179029dab1af75 | 白色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 悬停环/点可辨；差异较轻，真实hover动作不由静态PNG替代。 |
| 63 | screens/rc-radio/chromium/000248-2-actual.png · shadcn-dark-small-selected-focus-visible.png | 8582b3ec6207280215a2e4bdd9afe58a2212831d651fc59340a0cd84a4f59d02 | 白色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 实际键盘圆形外焦点环完整，四边未裁，未与标签重叠。 |
| 64 | screens/rc-radio/chromium/000249-2-actual.png · shadcn-dark-small-selected-pressed.png | 1fc664c57f31cb9c4cd16807619801ec7efb4738061a7dbf0d179029dab1af75 | 白色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 原生mouse.down时采集；静态按下差异小，不据此宣称独立明显压下动画。 |
| 65 | screens/rc-radio/chromium/000250-2-actual.png · shadcn-dark-small-error.png | 9a5f96f36773eb75560900774d3fee0920a7ae00b7a1866eefa1defe1ea83d0d | 灰色空圆和标签完整，未选off对应实际状态。 浅粉色错误环/选中点及错误说明句可见，无裁字。 |
| 66 | screens/rc-radio/chromium/000251-2-actual.png · shadcn-dark-small-selected-error.png | 8e60d3626e2d2787371c1dcabf3dcb7ba6e9bb04c622742d6dca7a699ad5e04b | 浅粉色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 浅粉色错误环/选中点及错误说明句可见，无裁字。 |
| 67 | screens/rc-radio/chromium/000252-2-actual.png · shadcn-dark-small-disabled.png | 807bfa31ea5385feea2d42462fb1faea5b47f2cc2274a09fda4dffc106245c8e | 禁用灰色空圆和标签完整，未选off对应实际状态。 暗色普通空环层级较弱但可见；本次无数值对比度测量，未据此签署合规。 |
| 68 | screens/rc-radio/chromium/000253-2-actual.png · shadcn-dark-small-disabled-selected.png | 343b5d4bdc95e0dc39e1276268e9c776334fb4632598c14344d22508b9e763fa | 主项实际灰色中心点和圆环完整，标签呈禁用灰度；输出为on，与实际checked=true一致，无已选却off矛盾。 暗色普通空环层级较弱但可见；本次无数值对比度测量，未据此签署合规。 |
| 69 | screens/rc-radio/chromium/000254-2-actual.png · shadcn-dark-medium-default.png | da2759c6bd91b04b1d3f7faf0a729cead63395453128c841c5f50547c05afbd9 | 灰色空圆和标签完整，未选off对应实际状态。 暗色普通空环层级较弱但可见；本次无数值对比度测量，未据此签署合规。 |
| 70 | screens/rc-radio/chromium/000255-2-actual.png · shadcn-dark-medium-hover.png | f108a7b1348b7fa6bb7f84240b3b09769f788949a03d0121ea0dad7d4525a987 | 灰色空圆和标签完整，未选off对应实际状态。 悬停环/点可辨；差异较轻，真实hover动作不由静态PNG替代。 暗色普通空环层级较弱但可见；本次无数值对比度测量，未据此签署合规。 |
| 71 | screens/rc-radio/chromium/000256-2-actual.png · shadcn-dark-medium-focus-visible.png | c4daff997d381065f24243161addbae3756e90c0907d6dbfbe372baf692cba2c | 灰色空圆和标签完整，未选off对应实际状态。 实际键盘圆形外焦点环完整，四边未裁，未与标签重叠。 暗色普通空环层级较弱但可见；本次无数值对比度测量，未据此签署合规。 |
| 72 | screens/rc-radio/chromium/000257-2-actual.png · shadcn-dark-medium-pressed.png | f108a7b1348b7fa6bb7f84240b3b09769f788949a03d0121ea0dad7d4525a987 | 灰色空圆和标签完整，未选off对应实际状态。 原生mouse.down时采集；静态按下差异小，不据此宣称独立明显压下动画。 暗色普通空环层级较弱但可见；本次无数值对比度测量，未据此签署合规。 |
| 73 | screens/rc-radio/chromium/000258-2-actual.png · shadcn-dark-medium-selected.png | 37fe2515c3065cfa05093fb29b8b0cff5fb2b51d6cf60ca106dd7d74ab7f510a | 白色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 |
| 74 | screens/rc-radio/chromium/000259-2-actual.png · shadcn-dark-medium-selected-hover.png | 37fe2515c3065cfa05093fb29b8b0cff5fb2b51d6cf60ca106dd7d74ab7f510a | 白色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 悬停环/点可辨；差异较轻，真实hover动作不由静态PNG替代。 |
| 75 | screens/rc-radio/chromium/000260-2-actual.png · shadcn-dark-medium-selected-focus-visible.png | 3e9b7f41ccac401f087bcada6d5abe67ca7fddea44afb31dcae9a10513f730b7 | 白色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 实际键盘圆形外焦点环完整，四边未裁，未与标签重叠。 |
| 76 | screens/rc-radio/chromium/000261-2-actual.png · shadcn-dark-medium-selected-pressed.png | 37fe2515c3065cfa05093fb29b8b0cff5fb2b51d6cf60ca106dd7d74ab7f510a | 白色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 原生mouse.down时采集；静态按下差异小，不据此宣称独立明显压下动画。 |
| 77 | screens/rc-radio/chromium/000262-2-actual.png · shadcn-dark-medium-error.png | b58fff5ce4f6d22ba6f9810528f81b5edc1639e6e8c56bdbaba6ea12a3a0c0e8 | 灰色空圆和标签完整，未选off对应实际状态。 浅粉色错误环/选中点及错误说明句可见，无裁字。 |
| 78 | screens/rc-radio/chromium/000263-2-actual.png · shadcn-dark-medium-selected-error.png | afdf5cc405d1cf5f7fbedb6e90491af32b7be48be60d02494951fdb60d217490 | 浅粉色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 浅粉色错误环/选中点及错误说明句可见，无裁字。 |
| 79 | screens/rc-radio/chromium/000264-2-actual.png · shadcn-dark-medium-disabled.png | 0b0a8eaa8d1b377c4ceadbe0e433bbb60053ea15afe47a4a4078c62789bbcc6d | 禁用灰色空圆和标签完整，未选off对应实际状态。 暗色普通空环层级较弱但可见；本次无数值对比度测量，未据此签署合规。 |
| 80 | screens/rc-radio/chromium/000265-2-actual.png · shadcn-dark-medium-disabled-selected.png | 167549e483d115b7a8f53319d29bde4fc04bd222ee354f71f126c03da8699717 | 主项实际灰色中心点和圆环完整，标签呈禁用灰度；输出为on，与实际checked=true一致，无已选却off矛盾。 暗色普通空环层级较弱但可见；本次无数值对比度测量，未据此签署合规。 |
| 81 | screens/rc-radio/chromium/000266-2-actual.png · shadcn-dark-large-default.png | 3384d9252b8b26bb92ba3323fe3e24b8a1239ceaf9d62f1bf51af808d1cbe848 | 灰色空圆和标签完整，未选off对应实际状态。 暗色普通空环层级较弱但可见；本次无数值对比度测量，未据此签署合规。 |
| 82 | screens/rc-radio/chromium/000267-2-actual.png · shadcn-dark-large-hover.png | 98a98cf128254b4ebcb726b0756276f723e01c6139a95200917abd0fbd62b8d0 | 灰色空圆和标签完整，未选off对应实际状态。 悬停环/点可辨；差异较轻，真实hover动作不由静态PNG替代。 暗色普通空环层级较弱但可见；本次无数值对比度测量，未据此签署合规。 |
| 83 | screens/rc-radio/chromium/000268-2-actual.png · shadcn-dark-large-focus-visible.png | c4727b3c357db029deecf88a979d8bb1721d6e25737ab8be577f112ddb1b893c | 灰色空圆和标签完整，未选off对应实际状态。 实际键盘圆形外焦点环完整，四边未裁，未与标签重叠。 暗色普通空环层级较弱但可见；本次无数值对比度测量，未据此签署合规。 |
| 84 | screens/rc-radio/chromium/000269-2-actual.png · shadcn-dark-large-pressed.png | 98a98cf128254b4ebcb726b0756276f723e01c6139a95200917abd0fbd62b8d0 | 灰色空圆和标签完整，未选off对应实际状态。 原生mouse.down时采集；静态按下差异小，不据此宣称独立明显压下动画。 暗色普通空环层级较弱但可见；本次无数值对比度测量，未据此签署合规。 |
| 85 | screens/rc-radio/chromium/000270-2-actual.png · shadcn-dark-large-selected.png | 73af3a19bc82a91eb582a0aa27b81bc6f0b5e0402ef49d39c709b8609648b754 | 白色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 |
| 86 | screens/rc-radio/chromium/000271-2-actual.png · shadcn-dark-large-selected-hover.png | 73af3a19bc82a91eb582a0aa27b81bc6f0b5e0402ef49d39c709b8609648b754 | 白色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 悬停环/点可辨；差异较轻，真实hover动作不由静态PNG替代。 |
| 87 | screens/rc-radio/chromium/000272-2-actual.png · shadcn-dark-large-selected-focus-visible.png | c41fd6b8c6061b353a1ef93e39ce8a31f247479a2cbf8e0515e6a157cce41704 | 白色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 实际键盘圆形外焦点环完整，四边未裁，未与标签重叠。 |
| 88 | screens/rc-radio/chromium/000273-2-actual.png · shadcn-dark-large-selected-pressed.png | 73af3a19bc82a91eb582a0aa27b81bc6f0b5e0402ef49d39c709b8609648b754 | 白色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 原生mouse.down时采集；静态按下差异小，不据此宣称独立明显压下动画。 |
| 89 | screens/rc-radio/chromium/000274-2-actual.png · shadcn-dark-large-error.png | 58db9ebcf2562f2e4e9bc7f520df20f9e6407fb9edb311e0a632884cfb5ad558 | 灰色空圆和标签完整，未选off对应实际状态。 浅粉色错误环/选中点及错误说明句可见，无裁字。 |
| 90 | screens/rc-radio/chromium/000275-2-actual.png · shadcn-dark-large-selected-error.png | 874d6c630345a193e98529f91c8c8ea943c82d6a8537b289f51559b12c038552 | 浅粉色圆环及中心点清楚，on反馈一致，禁用已选对照层次可区分。 浅粉色错误环/选中点及错误说明句可见，无裁字。 |
| 91 | screens/rc-radio/chromium/000276-2-actual.png · shadcn-dark-large-disabled.png | 68b004c834832fc02b0c0b3c121c6271db0bd48aeba3ad8e9cb1d1b94518ca6c | 禁用灰色空圆和标签完整，未选off对应实际状态。 暗色普通空环层级较弱但可见；本次无数值对比度测量，未据此签署合规。 |
| 92 | screens/rc-radio/chromium/000277-2-actual.png · shadcn-dark-large-disabled-selected.png | 7318de4637c024439e81414eb7fff4f5cea09fc0d2026298e53e470e929f4842 | 主项实际灰色中心点和圆环完整，标签呈禁用灰度；输出为on，与实际checked=true一致，无已选却off矛盾。 暗色普通空环层级较弱但可见；本次无数值对比度测量，未据此签署合规。 |
| 93 | screens/rc-radio/chromium/000282-0-inventory-actual.png · test/visual/inventory.visual.spec.mjs | c78210d60b345368ec4e15712d1ba919dfc015493da27b7849cc7108ec3d17aa | 公开默认库存仅空圆及Radio标签，位于1280×720视口上部且完整；不是12状态矩阵替代证据。 |
| 94 | screens/rc-radio/chromium/000283-0-inventory-actual.png · test/visual/inventory.visual.spec.mjs | 38c4174d33cf064930642ceb0526a306760e58fd0a1142c158f34774d07e04c0 | 公开默认库存仅空圆及Radio标签，位于1280×720视口上部且完整；不是12状态矩阵替代证据。 |

重复SHA组（全部逐张实际看过）：

- 738ffdecbabe54c210a9caf2ffdd0973a8e97e4c5337a2351ef351ea72cca263：序号2、3、9、37、38、40。
- 37fe2515c3065cfa05093fb29b8b0cff5fb2b51d6cf60ca106dd7d74ab7f510a：序号11、12、18、73、74、76。
- da4cb674bdf90bec9a3971fe59bb7a080bd6fe7b16bdb4bbe4a897ea8d2a1cb5：序号22、24。
- c2f7199599f746d69dd96b8d0a937d67d29e20c29670a29adb8b0a9cd1a8bf69：序号25、26、28。
- 6ed158d378bcbccbb66b57bf0dd943027ee76aa4291693342b832dd83249f0dc：序号34、36。
- bf3ac4f971894af7803ba8424aeed59d030cf7383338d665df8dcbfc8e7d5ede：序号46、48。
- b9f8ce5bf7867cb657b5e432385ef79001cee13890520c53df93acabe23d3a8a：序号49、50、52。
- 911c3db36347e5d42d44b8fdb092f39d815aac5f2de66bbaeeb1f080e5ad5d76：序号58、60。
- 1fc664c57f31cb9c4cd16807619801ec7efb4738061a7dbf0d179029dab1af75：序号61、62、64。
- f108a7b1348b7fa6bb7f84240b3b09769f788949a03d0121ea0dad7d4525a987：序号70、72。
- 98a98cf128254b4ebcb726b0756276f723e01c6139a95200917abd0fbd62b8d0：序号82、84。
- 73af3a19bc82a91eb582a0aa27b81bc6f0b5e0402ef49d39c709b8609648b754：序号85、86、88。

完整case id、配置、原生附件索引、来源文件SHA、自动几何/真zoom原记录及独立人工观察见reviews-shadcn.json。无新浏览器、构建、采集、图像编辑或源码改动。
