# Alert 触控关闭修复候选复审

6 个原生用例通过；12 张 cases 原始 PNG 已逐张实际查看并逐个核对 SHA-256。仅有限认可本候选已观察范围，coverage=partial；未批准 baseline、未更新 verified 或生命周期，整体全库尚未完成。

- 平台：Windows/x64、Chromium 156.0.8078.4、Playwright 1.64.1；medium / standard，三体系各明暗六种配置。
- 源：`sha256:bfd897ab345e64482c46312a80a978d3b59b8525afc7a7d97d6d4089fddf8219`
- 资产：`sha256:5d154efbac198cdabc6923ac53416360121b18b1ca1f4d8abba2627a58bf6cbc`
- `inputs-worker-0.json` stable=true，所有case源/资产和browser均匹配；逐个PNG哈希匹配，当前22个本包来源文件与候选源逐个SHA相符。
- 渲染：`ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 (0x00002484) Direct3D11 vs_5_0 ps_5_0, D3D11)`；WebGL2实际绘制成功，error=0。没有虚构Docker镜像或字体版本。

六种配置的原生几何均为 hit48×48、八个边缘点命中、首行与关闭SVG中心差0px；实际查看12图也确认×对齐，tap后只移除首条、计数1，成功/警告项完整重排。

范围限制：

- 仅 Windows/x64 原生 Chromium 156.0.8078.4 / Playwright Test 1.64.1；medium / standard，md3、apple、shadcn 各 light/dark 六种配置。本报告不推广到其他尺寸、密度、引擎、环境或完整组件状态矩阵。
- 仅有限认可实际看过的可见范围；未建立/批准 baseline、未更新 verified 或生命周期，整体全库仍未完成。
- 原始 cases.json、results.json、输入记录、PNG 和视频均未改写。静态外观、原生几何/行为断言及来源绑定分开记录。
- 候选 worker 的 before/after 源与资产指纹一致，且逐图 SHA-256 匹配。当前匹配仅复核本包来源文件，不宣称整个当前工作树都仍等于候选。
- 当前原生环境没有 Linux 镜像摘要/字体版本目录；不将其与 Linux 或其他平台像素基准交叉比较。
- 本批是 hasTouch 768×1024 场景的组件边界截图；PNG 尺寸是组件裁取范围，不冒充完整 viewport。
- 实际命中尺寸48×48、八个边缘点、真实外缘 tap、回调次数和 <=1px 中心断言由原生记录支持；人工仅核对图形对齐与前后结果，未从像素手算命中区域。
- 首条 default/info 可关闭状态及成功/警告伴随项被观察。title、action、error、hover、键盘焦点、按下、长文本、其他尺寸/密度等均未由本批补齐。

原始PNG逐图记录：

| case id / 参数 | 阶段 | 原图与 SHA-256 | 实际所见 |
| --- | --- | --- | --- |
| `3d2b7864b1d353bd7ad4-628a30012a3393343c97/chromium/0` · Alert environment md3 light touch | before-close | [PNG](screens/rc-alert/chromium/000001-2-actual.png) · `7b9b2fb4755b3ea666ae83129c0ad5cba8acf20c71353b2ddcac924f3ad9f90d` | 实际关闭前图：关闭×与首行信息图标/文字居中对齐，未再见旧3px上移；文字、描边与反馈表面清晰，操作次数0。48px与精确中心差由该case原生几何记录支持。 |
| `3d2b7864b1d353bd7ad4-628a30012a3393343c97/chromium/0` · Alert environment md3 light touch | after-real-tap | [PNG](screens/rc-alert/chromium/000001-4-actual.png) · `b93d2dc8555c503b66a8562f38fab863941d276085360b7ec590adecf801cc61` | 真实外缘tap后，首条信息Alert已移除，成功/警告两条完整重排，操作次数显示1；未见残留关闭图标或裁切。时序与回调次数另由原生断言证明。 |
| `3d2b7864b1d353bd7ad4-46a77a6ad9f50ec713eb/chromium/0` · Alert environment md3 dark touch | before-close | [PNG](screens/rc-alert/chromium/000002-2-actual.png) · `cae3a2fd51e72049dd729360924515435853228564f508191a039843199eed6b` | 实际关闭前图：关闭×与首行信息图标/文字居中对齐，未再见旧3px上移；文字、描边与反馈表面清晰，操作次数0。48px与精确中心差由该case原生几何记录支持。 |
| `3d2b7864b1d353bd7ad4-46a77a6ad9f50ec713eb/chromium/0` · Alert environment md3 dark touch | after-real-tap | [PNG](screens/rc-alert/chromium/000002-4-actual.png) · `c58c7a4e1ea1c3fca483c0736bfd5838f2447e9607200fcd82311d6831a13e7a` | 真实外缘tap后，首条信息Alert已移除，成功/警告两条完整重排，操作次数显示1；未见残留关闭图标或裁切。时序与回调次数另由原生断言证明。 |
| `3d2b7864b1d353bd7ad4-50c0f6187441aaa23824/chromium/0` · Alert environment apple light touch | before-close | [PNG](screens/rc-alert/chromium/000003-2-actual.png) · `f4b92e122f7e5902be7a4cd519e17abb03921e777c531774543ad86265725392` | 实际关闭前图：关闭×与首行信息图标/文字居中对齐，未再见旧3px上移；文字、描边与反馈表面清晰，操作次数0。48px与精确中心差由该case原生几何记录支持。 |
| `3d2b7864b1d353bd7ad4-50c0f6187441aaa23824/chromium/0` · Alert environment apple light touch | after-real-tap | [PNG](screens/rc-alert/chromium/000003-4-actual.png) · `b8ffb5e6fbc947035d7081f7481006ed7f58b668bcf04080f0a34eac36324ab9` | 真实外缘tap后，首条信息Alert已移除，成功/警告两条完整重排，操作次数显示1；未见残留关闭图标或裁切。时序与回调次数另由原生断言证明。 |
| `3d2b7864b1d353bd7ad4-43560a71267793d0acee/chromium/0` · Alert environment apple dark touch | before-close | [PNG](screens/rc-alert/chromium/000004-2-actual.png) · `59161c3a3dfba8d1371274e415d8104e5d28737f819202d7eb3ce4add4b416b7` | 实际关闭前图：×与首行信息图标/文字视觉中心对齐，三条反馈及轮廓完整；该设计明暗表面可辨，操作次数0。精确中心差0与48×48命中层属于原生几何证据。 |
| `3d2b7864b1d353bd7ad4-43560a71267793d0acee/chromium/0` · Alert environment apple dark touch | after-real-tap | [PNG](screens/rc-alert/chromium/000004-4-actual.png) · `fbbff1ff508c2d817a73cad4df461f8f8e05e15fe7d3aa8bbdac5f97ebb3a746` | 真实外缘tap后的图中首条已移除，成功/警告两条完整重排，计数1；无残留关闭图标或可见裁切。未把此图扩张为其他尺寸/状态验收。 |
| `3d2b7864b1d353bd7ad4-0d09832cd6c4af672b1d/chromium/0` · Alert environment shadcn light touch | before-close | [PNG](screens/rc-alert/chromium/000005-2-actual.png) · `35a504618879c133dd7c411a6313fa436ac75792a9d84b48c4c4c8792d4ee109` | 实际关闭前图：×与首行信息图标/文字视觉中心对齐，三条反馈及轮廓完整；该设计明暗表面可辨，操作次数0。精确中心差0与48×48命中层属于原生几何证据。 |
| `3d2b7864b1d353bd7ad4-0d09832cd6c4af672b1d/chromium/0` · Alert environment shadcn light touch | after-real-tap | [PNG](screens/rc-alert/chromium/000005-4-actual.png) · `d2483c2f5e1e1322f2cf6d52731a05cc64da29c8828e12b779ed6a4f7e07305d` | 真实外缘tap后的图中首条已移除，成功/警告两条完整重排，计数1；无残留关闭图标或可见裁切。未把此图扩张为其他尺寸/状态验收。 |
| `3d2b7864b1d353bd7ad4-1a3daca27356dcfe4d58/chromium/0` · Alert environment shadcn dark touch | before-close | [PNG](screens/rc-alert/chromium/000006-2-actual.png) · `779e0255fc27a599a6793ce648996b9fa1f50f4cfb01b29a0158a9aaffbafe3c` | 实际关闭前图：×与首行信息图标/文字视觉中心对齐，三条反馈及轮廓完整；该设计明暗表面可辨，操作次数0。精确中心差0与48×48命中层属于原生几何证据。 |
| `3d2b7864b1d353bd7ad4-1a3daca27356dcfe4d58/chromium/0` · Alert environment shadcn dark touch | after-real-tap | [PNG](screens/rc-alert/chromium/000006-4-actual.png) · `c3041fe69880a5e69d7b5114e0fd210a1e045cdbab0d4baba1cf34da6d87579b` | 真实外缘tap后的图中首条已移除，成功/警告两条完整重排，计数1；无残留关闭图标或可见裁切。未把此图扩张为其他尺寸/状态验收。 |

