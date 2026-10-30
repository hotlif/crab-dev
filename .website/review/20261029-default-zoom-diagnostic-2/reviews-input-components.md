# 输入组件组：Checkbox 默认与真实 200% 原图复审

候选：20261029-default-zoom-diagnostic-2。复审时间：2026-10-29T10:50:49.411Z。

本次只查看 Checkbox 的 24 张原图：Chromium 156.0.8078.4 下三体系 × 明暗 × 三档尺寸的 18 张默认帧，以及 6 张真实 200% 的选中与键盘焦点画面。所有图片均逐张以 view_image 的 original 级别查看，未改图。24 个旧测试报告通过，24 张哈希全部匹配；未发现新的明显外观缺陷，无组件缺失或加载未就绪图。

4 个引用 worker 的完整 before / after 记录一致，source / artifact / siteBuild 指纹均稳定；浏览器与同摘要官方 Linux 镜像一致。真实缩放 proof 为 chrome.tabs.setZoom=2、CSS 视口 1280→640、DPR 自然 1→2、外窗不变且 HTML / body zoom=1；1280×813 原图保存完整可见窗口。

本候选 source 为 sha256:c5ea450017e600100fe1cccf61ab8003a6e66f30194bb43af96bfb2e0f06d855，artifact 为 sha256:d411fe4077d7249e9800da4d85e8021dc80de63ce35104f0d57a7af0a5c89856。它是旧快照：不含后来的触控、双外观、文字几何和原生滚动断言，不能将新断言计为已运行。完整诊断批次因 35 项失败提前结束，另有 1969 项跳过，本局部复审不能宣称整批通过。

截图只支持已见外观结论，不能独立证明实际命中、可达性、读屏语义、全状态矩阵、其他浏览器或双次像素稳定性。没有建立基准、更新 verified 或改变生命周期。缩放图的选择器虽然显示 default，实际主控件已经选中并有焦点环，记录按实际状态解释。

| 序号 | 原 case id | 范围 | PNG 尺寸 | 原图 SHA-256 | 结论 |
| --- | --- | --- | --- | --- | --- |
| 1 | 4ce4212075a27b44e623-65fd4574814d908d8a62/chromium/0 | Checkbox md3 light real 200% zoom | 1280×813 | fbbef10b37234ca19a2fc3bb70401efd6dd9882c852b202fe81b6d2acfe169e6 | 已看，该范围未见明显缺陷 |
| 2 | 4ce4212075a27b44e623-3ab341506165a2af8361/chromium/0 | Checkbox md3 dark real 200% zoom | 1280×813 | 8ddadce057d7d6138c8b165ead0b4b20da34bdeaae52321a7649f7f01611e9b1 | 已看，该范围未见明显缺陷 |
| 3 | 4ce4212075a27b44e623-ac76c5494198d7837286/chromium/0 | Checkbox apple light real 200% zoom | 1280×813 | 23f8f7e80e4afe28c794bfdbe84817293799c2bc6d1a5bc285e5b34521febd49 | 已看，该范围未见明显缺陷 |
| 4 | 4ce4212075a27b44e623-eae32151e34a4990bfe0/chromium/0 | Checkbox apple dark real 200% zoom | 1280×813 | 6e7c9e317e93cbdc7eef4ba7e2b6e879a5918c677b7597d929b28af22c805cf6 | 已看，该范围未见明显缺陷 |
| 5 | 4ce4212075a27b44e623-b92f0932d5548ee9d8ef/chromium/0 | Checkbox shadcn light real 200% zoom | 1280×813 | 28b3c139d26e034e99f8934a71402e4eecede90eea9589f822873f73fa47bb90 | 已看，该范围未见明显缺陷 |
| 6 | 4ce4212075a27b44e623-dbd0a212559d6299cd02/chromium/0 | Checkbox shadcn dark real 200% zoom | 1280×813 | cfb03337a5d3252f33fcbb0a15116aefb1a71b873b8e864e322885ee6fa81618 | 已看，该范围未见明显缺陷 |
| 7 | f64d25927e4d5b779add-9e8bc9d6c24cad297527/chromium/0 | Checkbox md3 light small default | 352×218 | ebda84f4fefb108139482abd627d4ffced39ea80895c2265da78febaf2263f74 | 已看，该范围未见明显缺陷 |
| 8 | f64d25927e4d5b779add-9e7ab4e5b0e93ecadd27/chromium/0 | Checkbox md3 light medium default | 352×218 | 8710bfb30e2912ee022d89f0e75b81836bad61b1f2c5caf69c12e2f58eff8382 | 已看，该范围未见明显缺陷 |
| 9 | f64d25927e4d5b779add-772f189b81b5963cd8a8/chromium/0 | Checkbox md3 light large default | 388×218 | 48944df9c3a756ab85989447a75bf4fb19c8c19355b02c62151fffe8a5d1d17e | 已看，该范围未见明显缺陷 |
| 10 | f64d25927e4d5b779add-8f8b34ab668664c241e5/chromium/0 | Checkbox md3 dark small default | 352×218 | d9e375f069828137456ca824e2a9a11dee104e81a21047bc1af0f146216b0368 | 已看，该范围未见明显缺陷 |
| 11 | f64d25927e4d5b779add-f1e766e536ffce104d66/chromium/0 | Checkbox md3 dark medium default | 352×218 | 3478365b91d85052b4c3895838f2346d2fe1d44e6871cb65c7a12cce10e7221c | 已看，该范围未见明显缺陷 |
| 12 | f64d25927e4d5b779add-792b3f6280869b4f0201/chromium/0 | Checkbox md3 dark large default | 388×218 | f5a6fb780e643690f9204eaaaeb81b9ab786bbe305b78abaca3e4dd55d2e5776 | 已看，该范围未见明显缺陷 |
| 13 | f64d25927e4d5b779add-7ad62d709ef3ec9e5ec1/chromium/0 | Checkbox apple light small default | 328×170 | 9a8e54ac0c8141a4e599f5db8dedf6942efcf90d9469966caa27c2cd3df1180e | 已看，该范围未见明显缺陷 |
| 14 | f64d25927e4d5b779add-d582fb4084f6747ae542/chromium/0 | Checkbox apple light medium default | 328×170 | 8b2393410b5978f2ab5ea2a2d6ee973d24620ad96a46b2db6e47f3df955ee5e3 | 已看，该范围未见明显缺陷 |
| 15 | f64d25927e4d5b779add-343c2a03eb11a4e13a6c/chromium/0 | Checkbox apple light large default | 364×170 | 3c24012b62f6853ed76cd048a8c58c8e790c3054665ff6b77d31281aa6c06b4a | 已看，该范围未见明显缺陷 |
| 16 | f64d25927e4d5b779add-3e5502bd08857e746398/chromium/0 | Checkbox apple dark small default | 328×170 | 36675655cd544c5d88b980901d9056db92f639eb25454d488793d4b86213d490 | 已看，该范围未见明显缺陷 |
| 17 | f64d25927e4d5b779add-0ebc005fd9471a2053b0/chromium/0 | Checkbox apple dark medium default | 328×170 | cb1ab953a37a5d82e4ce806d77291f19bdcddc148f9e3948f0316f61678f0c62 | 已看，该范围未见明显缺陷 |
| 18 | f64d25927e4d5b779add-9c737bf8c7fda6ed1638/chromium/0 | Checkbox apple dark large default | 364×170 | 8718177414930b0c4a97aba617d237ee75d478242590297938574b93d2ccee0c | 已看，该范围未见明显缺陷 |
| 19 | f64d25927e4d5b779add-4f168b1c7628e5443d93/chromium/0 | Checkbox shadcn light small default | 328×170 | ee63d8a6b49653b859133e1283597af90e61060c38f92567ef1c0a80e1d3e092 | 已看，该范围未见明显缺陷 |
| 20 | f64d25927e4d5b779add-6acf7e267076ede1f0ea/chromium/0 | Checkbox shadcn light medium default | 328×170 | 7a9a990b1b82d5c5f231dfcdc27adfc91932db882a36b6f8b6419da240d774e2 | 已看，该范围未见明显缺陷 |
| 21 | f64d25927e4d5b779add-25f3ebc8d6d5f5e7312b/chromium/0 | Checkbox shadcn light large default | 400×174 | 4d489607aae318a3a50f833c1f3155de850c3c8ee12d91532637181d39f3b0c3 | 已看，该范围未见明显缺陷 |
| 22 | f64d25927e4d5b779add-e2a206d53ac9ae03eb5f/chromium/0 | Checkbox shadcn dark small default | 328×170 | abe2d7aa927607ed942afdda8699cefcfed3fc98ac4676997aef279d4e996e4b | 已看，该范围未见明显缺陷 |
| 23 | f64d25927e4d5b779add-c53d0ec3bbfa42711d74/chromium/0 | Checkbox shadcn dark medium default | 328×170 | ec8c27f2cd44e047f4a56709cbbd0649958d323daaedef8823fd4f6e0179f829 | 已看，该范围未见明显缺陷 |
| 24 | f64d25927e4d5b779add-1cc9767e2085e1c51bc4/chromium/0 | Checkbox shadcn dark large default | 400×174 | 8f7d809d629ea94442f33a09ed4f5b0712df78255483e6759961c6a4cd081873 | 已看，该范围未见明显缺陷 |

## 1. Checkbox md3 light real 200% zoom

Case：4ce4212075a27b44e623-65fd4574814d908d8a62/chromium/0；原图：[screens/rc-checkbox/chromium/000307-3-actual-zoom-200.png](screens/rc-checkbox/chromium/000307-3-actual-zoom-200.png)。

SHA-256：fbbef10b37234ca19a2fc3bb70401efd6dd9882c852b202fe81b6d2acfe169e6（重新读取文件核对一致）；尺寸 1280×813；来源 inputs-worker-11.json。

- 已逐张以 view_image(detail=original) 查看本张 1280×813 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 选中方框及反色勾选完整，圆形状态层和外圈清楚；焦点外圈未覆盖主标签。
- 浅色表面上主标签可读；第二项灰色的禁用选中方框、勾选和标签均可见。
- 放大画面中主项已选中且有可见键盘焦点；长中文标签、禁用选中行与“当前选择: on”均完整出现在可见画面。状态选择器仍显示 default，这是缩放环境中的实际 selected / focused 截图，不是未交互默认态。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该真实缩放画面及对应旧 proof；没有覆盖 small / large 缩放、横向滚动后页面、完整长页或全状态矩阵。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 2. Checkbox md3 dark real 200% zoom

Case：4ce4212075a27b44e623-3ab341506165a2af8361/chromium/0；原图：[screens/rc-checkbox/chromium/000308-3-actual-zoom-200.png](screens/rc-checkbox/chromium/000308-3-actual-zoom-200.png)。

SHA-256：8ddadce057d7d6138c8b165ead0b4b20da34bdeaae52321a7649f7f01611e9b1（重新读取文件核对一致）；尺寸 1280×813；来源 inputs-worker-12.json。

- 已逐张以 view_image(detail=original) 查看本张 1280×813 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 选中方框及反色勾选完整，圆形状态层和外圈清楚；焦点外圈未覆盖主标签。
- 深色表面上主标签可读；第二项较弱的禁用选中方框、勾选和标签均可见。
- 放大画面中主项已选中且有可见键盘焦点；长中文标签、禁用选中行与“当前选择: on”均完整出现在可见画面。状态选择器仍显示 default，这是缩放环境中的实际 selected / focused 截图，不是未交互默认态。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该真实缩放画面及对应旧 proof；没有覆盖 small / large 缩放、横向滚动后页面、完整长页或全状态矩阵。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 3. Checkbox apple light real 200% zoom

Case：4ce4212075a27b44e623-ac76c5494198d7837286/chromium/0；原图：[screens/rc-checkbox/chromium/000309-3-actual-zoom-200.png](screens/rc-checkbox/chromium/000309-3-actual-zoom-200.png)。

SHA-256：23f8f7e80e4afe28c794bfdbe84817293799c2bc6d1a5bc285e5b34521febd49（重新读取文件核对一致）；尺寸 1280×813；来源 inputs-worker-10.json。

- 已逐张以 view_image(detail=original) 查看本张 1280×813 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 蓝色选中圆角方框、反色勾选和蓝色外部焦点轮廓清楚，标签没有被外圈遮挡。
- 浅色表面上主标签可读；第二项灰色的禁用选中方框、勾选和标签均可见。
- 放大画面中主项已选中且有可见键盘焦点；长中文标签、禁用选中行与“当前选择: on”均完整出现在可见画面。状态选择器仍显示 default，这是缩放环境中的实际 selected / focused 截图，不是未交互默认态。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该真实缩放画面及对应旧 proof；没有覆盖 small / large 缩放、横向滚动后页面、完整长页或全状态矩阵。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 4. Checkbox apple dark real 200% zoom

Case：4ce4212075a27b44e623-eae32151e34a4990bfe0/chromium/0；原图：[screens/rc-checkbox/chromium/000310-3-actual-zoom-200.png](screens/rc-checkbox/chromium/000310-3-actual-zoom-200.png)。

SHA-256：6e7c9e317e93cbdc7eef4ba7e2b6e879a5918c677b7597d929b28af22c805cf6（重新读取文件核对一致）；尺寸 1280×813；来源 inputs-worker-13.json。

- 已逐张以 view_image(detail=original) 查看本张 1280×813 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 蓝色选中圆角方框、反色勾选和蓝色外部焦点轮廓清楚，标签没有被外圈遮挡。
- 深色表面上主标签可读；第二项较弱的禁用选中方框、勾选和标签均可见。
- 放大画面中主项已选中且有可见键盘焦点；长中文标签、禁用选中行与“当前选择: on”均完整出现在可见画面。状态选择器仍显示 default，这是缩放环境中的实际 selected / focused 截图，不是未交互默认态。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该真实缩放画面及对应旧 proof；没有覆盖 small / large 缩放、横向滚动后页面、完整长页或全状态矩阵。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 5. Checkbox shadcn light real 200% zoom

Case：4ce4212075a27b44e623-b92f0932d5548ee9d8ef/chromium/0；原图：[screens/rc-checkbox/chromium/000311-3-actual-zoom-200.png](screens/rc-checkbox/chromium/000311-3-actual-zoom-200.png)。

SHA-256：28b3c139d26e034e99f8934a71402e4eecede90eea9589f822873f73fa47bb90（重新读取文件核对一致）；尺寸 1280×813；来源 inputs-worker-10.json。

- 已逐张以 view_image(detail=original) 查看本张 1280×813 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 中性色选中方框、反色勾选和灰色外部焦点轮廓清楚，标签没有被外圈遮挡。
- 浅色表面上主标签可读；第二项灰色的禁用选中方框、勾选和标签均可见。
- 放大画面中主项已选中且有可见键盘焦点；长中文标签、禁用选中行与“当前选择: on”均完整出现在可见画面。状态选择器仍显示 default，这是缩放环境中的实际 selected / focused 截图，不是未交互默认态。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该真实缩放画面及对应旧 proof；没有覆盖 small / large 缩放、横向滚动后页面、完整长页或全状态矩阵。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 6. Checkbox shadcn dark real 200% zoom

Case：4ce4212075a27b44e623-dbd0a212559d6299cd02/chromium/0；原图：[screens/rc-checkbox/chromium/000312-3-actual-zoom-200.png](screens/rc-checkbox/chromium/000312-3-actual-zoom-200.png)。

SHA-256：cfb03337a5d3252f33fcbb0a15116aefb1a71b873b8e864e322885ee6fa81618（重新读取文件核对一致）；尺寸 1280×813；来源 inputs-worker-11.json。

- 已逐张以 view_image(detail=original) 查看本张 1280×813 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 中性色选中方框、反色勾选和灰色外部焦点轮廓清楚，标签没有被外圈遮挡。
- 深色表面上主标签可读；第二项较弱的禁用选中方框、勾选和标签均可见。
- 放大画面中主项已选中且有可见键盘焦点；长中文标签、禁用选中行与“当前选择: on”均完整出现在可见画面。状态选择器仍显示 default，这是缩放环境中的实际 selected / focused 截图，不是未交互默认态。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该真实缩放画面及对应旧 proof；没有覆盖 small / large 缩放、横向滚动后页面、完整长页或全状态矩阵。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 7. Checkbox md3 light small default

Case：f64d25927e4d5b779add-9e8bc9d6c24cad297527/chromium/0；原图：[screens/rc-checkbox/chromium/000313-2-actual.png](screens/rc-checkbox/chromium/000313-2-actual.png)。

SHA-256：ebda84f4fefb108139482abd627d4ffced39ea80895c2265da78febaf2263f74（重新读取文件核对一致）；尺寸 352×218；来源 inputs-worker-13.json。

- 已逐张以 view_image(detail=original) 查看本张 352×218 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 主项为未选中的近方形描边控件；large 的方框和文字相对 small / medium 更大。
- 浅色表面上主标签可读；第二项灰色的禁用选中方框、勾选和标签均可见。
- 主项长中文标签、禁用选中行与“当前选择: off”均在截图内完整显示；没有可见的文字重叠、行尾裁断或丢失勾选。默认图没有活动焦点环。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该命名尺寸的默认画面；其他可交互状态、错误、混合、悬停、按压和焦点状态未由此图验收。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 8. Checkbox md3 light medium default

Case：f64d25927e4d5b779add-9e7ab4e5b0e93ecadd27/chromium/0；原图：[screens/rc-checkbox/chromium/000314-2-actual.png](screens/rc-checkbox/chromium/000314-2-actual.png)。

SHA-256：8710bfb30e2912ee022d89f0e75b81836bad61b1f2c5caf69c12e2f58eff8382（重新读取文件核对一致）；尺寸 352×218；来源 inputs-worker-12.json。

- 已逐张以 view_image(detail=original) 查看本张 352×218 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 主项为未选中的近方形描边控件；large 的方框和文字相对 small / medium 更大。
- 浅色表面上主标签可读；第二项灰色的禁用选中方框、勾选和标签均可见。
- 主项长中文标签、禁用选中行与“当前选择: off”均在截图内完整显示；没有可见的文字重叠、行尾裁断或丢失勾选。默认图没有活动焦点环。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该命名尺寸的默认画面；其他可交互状态、错误、混合、悬停、按压和焦点状态未由此图验收。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 9. Checkbox md3 light large default

Case：f64d25927e4d5b779add-772f189b81b5963cd8a8/chromium/0；原图：[screens/rc-checkbox/chromium/000315-2-actual.png](screens/rc-checkbox/chromium/000315-2-actual.png)。

SHA-256：48944df9c3a756ab85989447a75bf4fb19c8c19355b02c62151fffe8a5d1d17e（重新读取文件核对一致）；尺寸 388×218；来源 inputs-worker-13.json。

- 已逐张以 view_image(detail=original) 查看本张 388×218 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 主项为未选中的近方形描边控件；large 的方框和文字相对 small / medium 更大。
- 浅色表面上主标签可读；第二项灰色的禁用选中方框、勾选和标签均可见。
- 主项长中文标签、禁用选中行与“当前选择: off”均在截图内完整显示；没有可见的文字重叠、行尾裁断或丢失勾选。默认图没有活动焦点环。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该命名尺寸的默认画面；其他可交互状态、错误、混合、悬停、按压和焦点状态未由此图验收。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 10. Checkbox md3 dark small default

Case：f64d25927e4d5b779add-8f8b34ab668664c241e5/chromium/0；原图：[screens/rc-checkbox/chromium/000316-2-actual.png](screens/rc-checkbox/chromium/000316-2-actual.png)。

SHA-256：d9e375f069828137456ca824e2a9a11dee104e81a21047bc1af0f146216b0368（重新读取文件核对一致）；尺寸 352×218；来源 inputs-worker-12.json。

- 已逐张以 view_image(detail=original) 查看本张 352×218 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 主项为未选中的近方形描边控件；large 的方框和文字相对 small / medium 更大。
- 深色表面上主标签可读；第二项较弱的禁用选中方框、勾选和标签均可见。
- 主项长中文标签、禁用选中行与“当前选择: off”均在截图内完整显示；没有可见的文字重叠、行尾裁断或丢失勾选。默认图没有活动焦点环。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该命名尺寸的默认画面；其他可交互状态、错误、混合、悬停、按压和焦点状态未由此图验收。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 11. Checkbox md3 dark medium default

Case：f64d25927e4d5b779add-f1e766e536ffce104d66/chromium/0；原图：[screens/rc-checkbox/chromium/000317-2-actual.png](screens/rc-checkbox/chromium/000317-2-actual.png)。

SHA-256：3478365b91d85052b4c3895838f2346d2fe1d44e6871cb65c7a12cce10e7221c（重新读取文件核对一致）；尺寸 352×218；来源 inputs-worker-10.json。

- 已逐张以 view_image(detail=original) 查看本张 352×218 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 主项为未选中的近方形描边控件；large 的方框和文字相对 small / medium 更大。
- 深色表面上主标签可读；第二项较弱的禁用选中方框、勾选和标签均可见。
- 主项长中文标签、禁用选中行与“当前选择: off”均在截图内完整显示；没有可见的文字重叠、行尾裁断或丢失勾选。默认图没有活动焦点环。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该命名尺寸的默认画面；其他可交互状态、错误、混合、悬停、按压和焦点状态未由此图验收。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 12. Checkbox md3 dark large default

Case：f64d25927e4d5b779add-792b3f6280869b4f0201/chromium/0；原图：[screens/rc-checkbox/chromium/000318-2-actual.png](screens/rc-checkbox/chromium/000318-2-actual.png)。

SHA-256：f5a6fb780e643690f9204eaaaeb81b9ab786bbe305b78abaca3e4dd55d2e5776（重新读取文件核对一致）；尺寸 388×218；来源 inputs-worker-11.json。

- 已逐张以 view_image(detail=original) 查看本张 388×218 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 主项为未选中的近方形描边控件；large 的方框和文字相对 small / medium 更大。
- 深色表面上主标签可读；第二项较弱的禁用选中方框、勾选和标签均可见。
- 主项长中文标签、禁用选中行与“当前选择: off”均在截图内完整显示；没有可见的文字重叠、行尾裁断或丢失勾选。默认图没有活动焦点环。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该命名尺寸的默认画面；其他可交互状态、错误、混合、悬停、按压和焦点状态未由此图验收。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 13. Checkbox apple light small default

Case：f64d25927e4d5b779add-7ad62d709ef3ec9e5ec1/chromium/0；原图：[screens/rc-checkbox/chromium/000319-2-actual.png](screens/rc-checkbox/chromium/000319-2-actual.png)。

SHA-256：9a8e54ac0c8141a4e599f5db8dedf6942efcf90d9469966caa27c2cd3df1180e（重新读取文件核对一致）；尺寸 328×170；来源 inputs-worker-13.json。

- 已逐张以 view_image(detail=original) 查看本张 328×170 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 主项为未选中的圆角描边控件，控件与单行标签对齐。
- 浅色表面上主标签可读；第二项灰色的禁用选中方框、勾选和标签均可见。
- 主项长中文标签、禁用选中行与“当前选择: off”均在截图内完整显示；没有可见的文字重叠、行尾裁断或丢失勾选。默认图没有活动焦点环。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该命名尺寸的默认画面；其他可交互状态、错误、混合、悬停、按压和焦点状态未由此图验收。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 14. Checkbox apple light medium default

Case：f64d25927e4d5b779add-d582fb4084f6747ae542/chromium/0；原图：[screens/rc-checkbox/chromium/000320-2-actual.png](screens/rc-checkbox/chromium/000320-2-actual.png)。

SHA-256：8b2393410b5978f2ab5ea2a2d6ee973d24620ad96a46b2db6e47f3df955ee5e3（重新读取文件核对一致）；尺寸 328×170；来源 inputs-worker-12.json。

- 已逐张以 view_image(detail=original) 查看本张 328×170 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 主项为未选中的圆角描边控件，控件与单行标签对齐。
- 浅色表面上主标签可读；第二项灰色的禁用选中方框、勾选和标签均可见。
- 主项长中文标签、禁用选中行与“当前选择: off”均在截图内完整显示；没有可见的文字重叠、行尾裁断或丢失勾选。默认图没有活动焦点环。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该命名尺寸的默认画面；其他可交互状态、错误、混合、悬停、按压和焦点状态未由此图验收。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 15. Checkbox apple light large default

Case：f64d25927e4d5b779add-343c2a03eb11a4e13a6c/chromium/0；原图：[screens/rc-checkbox/chromium/000321-2-actual.png](screens/rc-checkbox/chromium/000321-2-actual.png)。

SHA-256：3c24012b62f6853ed76cd048a8c58c8e790c3054665ff6b77d31281aa6c06b4a（重新读取文件核对一致）；尺寸 364×170；来源 inputs-worker-10.json。

- 已逐张以 view_image(detail=original) 查看本张 364×170 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 主项为未选中的圆角描边控件，控件与单行标签对齐。
- 浅色表面上主标签可读；第二项灰色的禁用选中方框、勾选和标签均可见。
- 主项长中文标签、禁用选中行与“当前选择: off”均在截图内完整显示；没有可见的文字重叠、行尾裁断或丢失勾选。默认图没有活动焦点环。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该命名尺寸的默认画面；其他可交互状态、错误、混合、悬停、按压和焦点状态未由此图验收。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 16. Checkbox apple dark small default

Case：f64d25927e4d5b779add-3e5502bd08857e746398/chromium/0；原图：[screens/rc-checkbox/chromium/000322-2-actual.png](screens/rc-checkbox/chromium/000322-2-actual.png)。

SHA-256：36675655cd544c5d88b980901d9056db92f639eb25454d488793d4b86213d490（重新读取文件核对一致）；尺寸 328×170；来源 inputs-worker-13.json。

- 已逐张以 view_image(detail=original) 查看本张 328×170 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 主项为未选中的圆角描边控件，控件与单行标签对齐。
- 深色表面上主标签可读；第二项较弱的禁用选中方框、勾选和标签均可见。
- 主项长中文标签、禁用选中行与“当前选择: off”均在截图内完整显示；没有可见的文字重叠、行尾裁断或丢失勾选。默认图没有活动焦点环。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该命名尺寸的默认画面；其他可交互状态、错误、混合、悬停、按压和焦点状态未由此图验收。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 17. Checkbox apple dark medium default

Case：f64d25927e4d5b779add-0ebc005fd9471a2053b0/chromium/0；原图：[screens/rc-checkbox/chromium/000323-2-actual.png](screens/rc-checkbox/chromium/000323-2-actual.png)。

SHA-256：cb1ab953a37a5d82e4ce806d77291f19bdcddc148f9e3948f0316f61678f0c62（重新读取文件核对一致）；尺寸 328×170；来源 inputs-worker-12.json。

- 已逐张以 view_image(detail=original) 查看本张 328×170 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 主项为未选中的圆角描边控件，控件与单行标签对齐。
- 深色表面上主标签可读；第二项较弱的禁用选中方框、勾选和标签均可见。
- 主项长中文标签、禁用选中行与“当前选择: off”均在截图内完整显示；没有可见的文字重叠、行尾裁断或丢失勾选。默认图没有活动焦点环。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该命名尺寸的默认画面；其他可交互状态、错误、混合、悬停、按压和焦点状态未由此图验收。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 18. Checkbox apple dark large default

Case：f64d25927e4d5b779add-9c737bf8c7fda6ed1638/chromium/0；原图：[screens/rc-checkbox/chromium/000324-2-actual.png](screens/rc-checkbox/chromium/000324-2-actual.png)。

SHA-256：8718177414930b0c4a97aba617d237ee75d478242590297938574b93d2ccee0c（重新读取文件核对一致）；尺寸 364×170；来源 inputs-worker-11.json。

- 已逐张以 view_image(detail=original) 查看本张 364×170 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 主项为未选中的圆角描边控件，控件与单行标签对齐。
- 深色表面上主标签可读；第二项较弱的禁用选中方框、勾选和标签均可见。
- 主项长中文标签、禁用选中行与“当前选择: off”均在截图内完整显示；没有可见的文字重叠、行尾裁断或丢失勾选。默认图没有活动焦点环。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该命名尺寸的默认画面；其他可交互状态、错误、混合、悬停、按压和焦点状态未由此图验收。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 19. Checkbox shadcn light small default

Case：f64d25927e4d5b779add-4f168b1c7628e5443d93/chromium/0；原图：[screens/rc-checkbox/chromium/000325-2-actual.png](screens/rc-checkbox/chromium/000325-2-actual.png)。

SHA-256：ee63d8a6b49653b859133e1283597af90e61060c38f92567ef1c0a80e1d3e092（重新读取文件核对一致）；尺寸 328×170；来源 inputs-worker-10.json。

- 已逐张以 view_image(detail=original) 查看本张 328×170 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 主项为未选中的中性圆角描边控件；large 中方框和标签明显大于 small / medium。
- 浅色表面上主标签可读；第二项灰色的禁用选中方框、勾选和标签均可见。
- 主项长中文标签、禁用选中行与“当前选择: off”均在截图内完整显示；没有可见的文字重叠、行尾裁断或丢失勾选。默认图没有活动焦点环。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该命名尺寸的默认画面；其他可交互状态、错误、混合、悬停、按压和焦点状态未由此图验收。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 20. Checkbox shadcn light medium default

Case：f64d25927e4d5b779add-6acf7e267076ede1f0ea/chromium/0；原图：[screens/rc-checkbox/chromium/000326-2-actual.png](screens/rc-checkbox/chromium/000326-2-actual.png)。

SHA-256：7a9a990b1b82d5c5f231dfcdc27adfc91932db882a36b6f8b6419da240d774e2（重新读取文件核对一致）；尺寸 328×170；来源 inputs-worker-12.json。

- 已逐张以 view_image(detail=original) 查看本张 328×170 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 主项为未选中的中性圆角描边控件；large 中方框和标签明显大于 small / medium。
- 浅色表面上主标签可读；第二项灰色的禁用选中方框、勾选和标签均可见。
- 主项长中文标签、禁用选中行与“当前选择: off”均在截图内完整显示；没有可见的文字重叠、行尾裁断或丢失勾选。默认图没有活动焦点环。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该命名尺寸的默认画面；其他可交互状态、错误、混合、悬停、按压和焦点状态未由此图验收。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 21. Checkbox shadcn light large default

Case：f64d25927e4d5b779add-25f3ebc8d6d5f5e7312b/chromium/0；原图：[screens/rc-checkbox/chromium/000327-2-actual.png](screens/rc-checkbox/chromium/000327-2-actual.png)。

SHA-256：4d489607aae318a3a50f833c1f3155de850c3c8ee12d91532637181d39f3b0c3（重新读取文件核对一致）；尺寸 400×174；来源 inputs-worker-13.json。

- 已逐张以 view_image(detail=original) 查看本张 400×174 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 主项为未选中的中性圆角描边控件；large 中方框和标签明显大于 small / medium。
- 浅色表面上主标签可读；第二项灰色的禁用选中方框、勾选和标签均可见。
- 主项长中文标签、禁用选中行与“当前选择: off”均在截图内完整显示；没有可见的文字重叠、行尾裁断或丢失勾选。默认图没有活动焦点环。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该命名尺寸的默认画面；其他可交互状态、错误、混合、悬停、按压和焦点状态未由此图验收。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 22. Checkbox shadcn dark small default

Case：f64d25927e4d5b779add-e2a206d53ac9ae03eb5f/chromium/0；原图：[screens/rc-checkbox/chromium/000328-2-actual.png](screens/rc-checkbox/chromium/000328-2-actual.png)。

SHA-256：abe2d7aa927607ed942afdda8699cefcfed3fc98ac4676997aef279d4e996e4b（重新读取文件核对一致）；尺寸 328×170；来源 inputs-worker-11.json。

- 已逐张以 view_image(detail=original) 查看本张 328×170 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 主项为未选中的中性圆角描边控件；large 中方框和标签明显大于 small / medium。
- 深色表面上主标签可读；第二项较弱的禁用选中方框、勾选和标签均可见。
- 主项长中文标签、禁用选中行与“当前选择: off”均在截图内完整显示；没有可见的文字重叠、行尾裁断或丢失勾选。默认图没有活动焦点环。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该命名尺寸的默认画面；其他可交互状态、错误、混合、悬停、按压和焦点状态未由此图验收。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 23. Checkbox shadcn dark medium default

Case：f64d25927e4d5b779add-c53d0ec3bbfa42711d74/chromium/0；原图：[screens/rc-checkbox/chromium/000329-2-actual.png](screens/rc-checkbox/chromium/000329-2-actual.png)。

SHA-256：ec8c27f2cd44e047f4a56709cbbd0649958d323daaedef8823fd4f6e0179f829（重新读取文件核对一致）；尺寸 328×170；来源 inputs-worker-10.json。

- 已逐张以 view_image(detail=original) 查看本张 328×170 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 主项为未选中的中性圆角描边控件；large 中方框和标签明显大于 small / medium。
- 深色表面上主标签可读；第二项较弱的禁用选中方框、勾选和标签均可见。
- 主项长中文标签、禁用选中行与“当前选择: off”均在截图内完整显示；没有可见的文字重叠、行尾裁断或丢失勾选。默认图没有活动焦点环。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该命名尺寸的默认画面；其他可交互状态、错误、混合、悬停、按压和焦点状态未由此图验收。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

## 24. Checkbox shadcn dark large default

Case：f64d25927e4d5b779add-1cc9767e2085e1c51bc4/chromium/0；原图：[screens/rc-checkbox/chromium/000330-2-actual.png](screens/rc-checkbox/chromium/000330-2-actual.png)。

SHA-256：8f7d809d629ea94442f33a09ed4f5b0712df78255483e6759961c6a4cd081873（重新读取文件核对一致）；尺寸 400×174；来源 inputs-worker-12.json。

- 已逐张以 view_image(detail=original) 查看本张 400×174 原始 PNG；组件本体已经出现，无加载占位或空白取代组件。
- 主项为未选中的中性圆角描边控件；large 中方框和标签明显大于 small / medium。
- 深色表面上主标签可读；第二项较弱的禁用选中方框、勾选和标签均可见。
- 主项长中文标签、禁用选中行与“当前选择: off”均在截图内完整显示；没有可见的文字重叠、行尾裁断或丢失勾选。默认图没有活动焦点环。

结论：reviewed-scoped-no-obvious-defect。未验范围：

- 这是一张静态图，不独立证明实际命中区域、焦点可达性、输入语义、读屏播报或完整交互流程；自动结果来自原始报告。
- 未核验 Firefox / WebKit、320px / 768px、触控、RTL、英文、品牌覆盖、强制颜色或减少动画。
- 仅该命名尺寸的默认画面；其他可交互状态、错误、混合、悬停、按压和焦点状态未由此图验收。
- 旧来源不含最新 touch / 双外观 / content-geometry / 原生文本滚动断言；这些新断言没有在本候选运行。
- 没有建立静态基准、执行两次像素稳定性验证或更新 verified / 生命周期；精确字体匹配、计算色值和对比度不由截图推断。

