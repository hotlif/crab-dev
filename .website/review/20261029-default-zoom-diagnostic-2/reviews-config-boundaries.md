# 配置边界旧快照复审：前提不满足，不批准

已通过 `view_image` 逐张查看 **36 张原始 PNG**，涉及 24 个有图 case；另核对 1 个中断但无图的 case 元数据，共 25 个 case。本轮 **0 张批准**，不建立 baseline，不标记 verified。

这是已知 Wake 双 Context 错误的旧候选。宿主后续已实施 owner Provider 依赖注入和嵌套 Provider 的统一公共自引用，并报告 2 个 Windows 真实 case 通过；这些属于另一份新源证据，不能由本轮旧 Linux 图证明。

## 数量与来源

- 按原始 cases.json 求和，整轮为 **403 attempts / 475 PNG**，不是 575。
- 本组原生状态：7 passed、16 failed、2 interrupted。36 图全部核对实际 SHA-256；输入均匹配所引用的 17 份稳定 worker 归档，来源/构建/站点指纹在采集前后相同。
- 来源：`sha256:c5ea450017e600100fe1cccf61ab8003a6e66f30194bb43af96bfb2e0f06d855`。
- 构建产物：`sha256:d411fe4077d7249e9800da4d85e8021dc80de63ce35104f0d57a7af0a5c89856`。
- 站点：`sha256:b172805c04ebc260100858e4e853419df7bc2e9f0a1715b532e78294e2550bbf`。
- 浏览器：156.0.8078.4；linux/x64。
- 镜像：`mcr.microsoft.com/playwright:v1.64.1-noble@sha256:47b510dd9230bf0b9bfc9b20102241e577ea7a99334ab4c3ca19f19770e9b8ea`。
- 6 张 200% 图的 chrome.tabs.setZoom 1 → 2、外窗不变、CSS zoom 不变与可见视口前提已核对；这只证明真实缩放，不能证明继承正确。
- 后续工作树未与此旧快照等同；不跨 Windows/Linux 比较像素。

## 实际所见

原生失败的默认图中，业务草稿和两个边界面板可读，但 Inherited 摘要停留在 `md3 / light / medium / standard / zh-CN / ltr`，Nested 停留在 `apple / dark / small / standard / zh-CN / ltr`。请求 small、large、compact、comfortable 或 dark 时摘要不匹配；暗色外层中的继承面板仍是浅色。对应原失败明确标记为前提不满足，保留原图和诊断。

6 个原生通过的真实缩放 case 都保留 `200% draft`，但 Portal 摘要仍固定为 `md3 / light / medium / standard`；请求 Apple、shadcn 或 dark 时可直接看到不一致。原生草稿断言通过不能转换为配置继承批准。

唯一原生通过的默认图为 `md3/light/medium/standard`，恰好与隐式默认相同。在已知双 Context 前提错误下，该单元不能区分正确继承与默认回退，因此同样不批准。

12 张附图是纯白空白，没有控件、文字或几何可验收。保留其失败/中断关联，不把它们单独当作当前产品的空白渲染缺陷。另有 `apple/light/small/compact` 中断 case 没有 PNG 或 candidate-inputs，只核对元数据，不能声称逐图复审。

当前修复后的三体系、全部尺寸/密度、nonce、Portal、嵌套边界、草稿保持、iframe/Shadow DOM 和完整状态矩阵仍需绑定新源、新构建与新候选分别验收。

## 逐图索引

完整错误、输入、浏览器和逐图所见见 [JSON](./reviews-config-boundaries.json)。

| 请求配置 | 原生状态 | Case / image ID | PNG SHA-256 | 复审 |
| --- | --- | --- | --- | --- |
| md3/light/zoom-200 | passed | `64bcd20401a72868fb2f-150a582c49b6c88054fa/chromium/0#image-0` | [132e32e30d03654135fdd7d5b5e8391ae2174ed7f3a6beacd020baee8c8217d2](./screens/rc-config-provider/chromium/000379-2-actual-zoom-200.png) | 通过记录不足以证明继承；不批准 |
| md3/dark/zoom-200 | passed | `64bcd20401a72868fb2f-54165e66324bb81df3b7/chromium/0#image-0` | [207244c4e284fc6f44aaf1e90a66f2c4144c412fca6a67830b090b91151946b1](./screens/rc-config-provider/chromium/000380-2-actual-zoom-200.png) | 通过记录不足以证明继承；不批准 |
| apple/light/zoom-200 | passed | `64bcd20401a72868fb2f-a198a11a402e8f50d443/chromium/0#image-0` | [2fccd83f3d7f462768daf06ffda08d8f211ad22dfebb252a0a899ee80c462ce2](./screens/rc-config-provider/chromium/000381-2-actual-zoom-200.png) | 通过记录不足以证明继承；不批准 |
| apple/dark/zoom-200 | passed | `64bcd20401a72868fb2f-81eb0d352e5f1a9c96db/chromium/0#image-0` | [6fe476d137e74e9bf97bce5b1f0aa9f96aa4b2d282a20f28ba7df107ac0fe26b](./screens/rc-config-provider/chromium/000382-2-actual-zoom-200.png) | 通过记录不足以证明继承；不批准 |
| shadcn/light/zoom-200 | passed | `64bcd20401a72868fb2f-bc396555005f7145a75f/chromium/0#image-0` | [2fccd83f3d7f462768daf06ffda08d8f211ad22dfebb252a0a899ee80c462ce2](./screens/rc-config-provider/chromium/000383-2-actual-zoom-200.png) | 通过记录不足以证明继承；不批准 |
| shadcn/dark/zoom-200 | passed | `64bcd20401a72868fb2f-ffb6f736a115450c09c7/chromium/0#image-0` | [9a58ea924bee0eeb3ef55312004d24d165bbe7a6e8a2c827b6190e2d3db3062a](./screens/rc-config-provider/chromium/000384-2-actual-zoom-200.png) | 通过记录不足以证明继承；不批准 |
| md3/light/small/compact/default | failed | `c6f9d0b7f12b9e9ff102-558a9e51ec65b52112e7/chromium/0#image-0` | [9905b6ce4a6cef3a1b837265870df142baa9959dfaeafb3b1db3ca9a43b50751](./screens/rc-config-provider/chromium/000385-0-screenshot.png) | 失败前提不满足；不批准 |
| md3/light/small/standard/default | failed | `c6f9d0b7f12b9e9ff102-de32e48a4bca73ce3534/chromium/0#image-0` | [9905b6ce4a6cef3a1b837265870df142baa9959dfaeafb3b1db3ca9a43b50751](./screens/rc-config-provider/chromium/000386-0-screenshot.png) | 失败前提不满足；不批准 |
| md3/light/small/comfortable/default | failed | `c6f9d0b7f12b9e9ff102-9f649b9ce5a2c1149757/chromium/0#image-0` | [9905b6ce4a6cef3a1b837265870df142baa9959dfaeafb3b1db3ca9a43b50751](./screens/rc-config-provider/chromium/000387-0-screenshot.png) | 失败前提不满足；不批准 |
| md3/light/medium/compact/default | failed | `c6f9d0b7f12b9e9ff102-1a09668d9ad6e23f84d8/chromium/0#image-0` | [9905b6ce4a6cef3a1b837265870df142baa9959dfaeafb3b1db3ca9a43b50751](./screens/rc-config-provider/chromium/000388-0-screenshot.png) | 失败前提不满足；不批准 |
| md3/light/medium/standard/default | passed | `c6f9d0b7f12b9e9ff102-ff96d2c082b444f6361b/chromium/0#image-0` | [9625378d3bb1c2795919c1bc68949dd706b24d0eab1941c18a9b7f250ca35136](./screens/rc-config-provider/chromium/000389-1-actual.png) | 通过记录不足以证明继承；不批准 |
| md3/light/medium/comfortable/default | failed | `c6f9d0b7f12b9e9ff102-3117f7544ad23b751d6b/chromium/0#image-0` | [9905b6ce4a6cef3a1b837265870df142baa9959dfaeafb3b1db3ca9a43b50751](./screens/rc-config-provider/chromium/000390-0-screenshot.png) | 失败前提不满足；不批准 |
| md3/light/medium/comfortable/default | failed | `c6f9d0b7f12b9e9ff102-3117f7544ad23b751d6b/chromium/0#image-1` | [3878570f4a62a0d65f57cf1754e0269e56ec797f4e36e26b44c172eb6e800401](./screens/rc-config-provider/chromium/000390-3-screenshot.png) | 空白关联证据；不批准 |
| md3/light/large/compact/default | failed | `c6f9d0b7f12b9e9ff102-9f0d223e079fab195eab/chromium/0#image-0` | [9905b6ce4a6cef3a1b837265870df142baa9959dfaeafb3b1db3ca9a43b50751](./screens/rc-config-provider/chromium/000391-0-screenshot.png) | 失败前提不满足；不批准 |
| md3/light/large/compact/default | failed | `c6f9d0b7f12b9e9ff102-9f0d223e079fab195eab/chromium/0#image-1` | [3878570f4a62a0d65f57cf1754e0269e56ec797f4e36e26b44c172eb6e800401](./screens/rc-config-provider/chromium/000391-3-screenshot.png) | 空白关联证据；不批准 |
| md3/light/large/standard/default | failed | `c6f9d0b7f12b9e9ff102-9b0b9a1291b7b8230cd7/chromium/0#image-0` | [9905b6ce4a6cef3a1b837265870df142baa9959dfaeafb3b1db3ca9a43b50751](./screens/rc-config-provider/chromium/000392-0-screenshot.png) | 失败前提不满足；不批准 |
| md3/light/large/standard/default | failed | `c6f9d0b7f12b9e9ff102-9b0b9a1291b7b8230cd7/chromium/0#image-1` | [3878570f4a62a0d65f57cf1754e0269e56ec797f4e36e26b44c172eb6e800401](./screens/rc-config-provider/chromium/000392-3-screenshot.png) | 空白关联证据；不批准 |
| md3/light/large/comfortable/default | failed | `c6f9d0b7f12b9e9ff102-b52c9c72b8b4aa20bec6/chromium/0#image-0` | [9905b6ce4a6cef3a1b837265870df142baa9959dfaeafb3b1db3ca9a43b50751](./screens/rc-config-provider/chromium/000393-0-screenshot.png) | 失败前提不满足；不批准 |
| md3/dark/small/compact/default | failed | `c6f9d0b7f12b9e9ff102-b175ebc428173e02c1e7/chromium/0#image-0` | [78ec6b48871aa0e3584ba80ae21e865dcafc840a59b4c6194369c3cff0e446ac](./screens/rc-config-provider/chromium/000394-0-screenshot.png) | 失败前提不满足；不批准 |
| md3/dark/small/compact/default | failed | `c6f9d0b7f12b9e9ff102-b175ebc428173e02c1e7/chromium/0#image-1` | [3878570f4a62a0d65f57cf1754e0269e56ec797f4e36e26b44c172eb6e800401](./screens/rc-config-provider/chromium/000394-3-screenshot.png) | 空白关联证据；不批准 |
| md3/dark/small/standard/default | failed | `c6f9d0b7f12b9e9ff102-03f3981378e10c2ca4e2/chromium/0#image-0` | [78ec6b48871aa0e3584ba80ae21e865dcafc840a59b4c6194369c3cff0e446ac](./screens/rc-config-provider/chromium/000395-0-screenshot.png) | 失败前提不满足；不批准 |
| md3/dark/small/standard/default | failed | `c6f9d0b7f12b9e9ff102-03f3981378e10c2ca4e2/chromium/0#image-1` | [3878570f4a62a0d65f57cf1754e0269e56ec797f4e36e26b44c172eb6e800401](./screens/rc-config-provider/chromium/000395-3-screenshot.png) | 空白关联证据；不批准 |
| md3/dark/small/comfortable/default | failed | `c6f9d0b7f12b9e9ff102-de250b8fe8083c86f30d/chromium/0#image-0` | [78ec6b48871aa0e3584ba80ae21e865dcafc840a59b4c6194369c3cff0e446ac](./screens/rc-config-provider/chromium/000396-0-screenshot.png) | 失败前提不满足；不批准 |
| md3/dark/small/comfortable/default | failed | `c6f9d0b7f12b9e9ff102-de250b8fe8083c86f30d/chromium/0#image-1` | [3878570f4a62a0d65f57cf1754e0269e56ec797f4e36e26b44c172eb6e800401](./screens/rc-config-provider/chromium/000396-3-screenshot.png) | 空白关联证据；不批准 |
| md3/dark/medium/compact/default | failed | `c6f9d0b7f12b9e9ff102-98496691c5e24c43b357/chromium/0#image-0` | [78ec6b48871aa0e3584ba80ae21e865dcafc840a59b4c6194369c3cff0e446ac](./screens/rc-config-provider/chromium/000397-0-screenshot.png) | 失败前提不满足；不批准 |
| md3/dark/medium/compact/default | failed | `c6f9d0b7f12b9e9ff102-98496691c5e24c43b357/chromium/0#image-1` | [3878570f4a62a0d65f57cf1754e0269e56ec797f4e36e26b44c172eb6e800401](./screens/rc-config-provider/chromium/000397-3-screenshot.png) | 空白关联证据；不批准 |
| md3/dark/medium/standard/default | failed | `c6f9d0b7f12b9e9ff102-c2c53baa6d99ca34296a/chromium/0#image-0` | [78ec6b48871aa0e3584ba80ae21e865dcafc840a59b4c6194369c3cff0e446ac](./screens/rc-config-provider/chromium/000398-0-screenshot.png) | 失败前提不满足；不批准 |
| md3/dark/medium/standard/default | failed | `c6f9d0b7f12b9e9ff102-c2c53baa6d99ca34296a/chromium/0#image-1` | [3878570f4a62a0d65f57cf1754e0269e56ec797f4e36e26b44c172eb6e800401](./screens/rc-config-provider/chromium/000398-3-screenshot.png) | 空白关联证据；不批准 |
| md3/dark/medium/comfortable/default | failed | `c6f9d0b7f12b9e9ff102-a9188c981d4d39bbedad/chromium/0#image-0` | [f90b50436c106baeb2d8f5b628bfa9685818771ea2974a8acabaee443ffd353e](./screens/rc-config-provider/chromium/000399-0-screenshot.png) | 失败前提不满足；不批准 |
| md3/dark/medium/comfortable/default | failed | `c6f9d0b7f12b9e9ff102-a9188c981d4d39bbedad/chromium/0#image-1` | [3878570f4a62a0d65f57cf1754e0269e56ec797f4e36e26b44c172eb6e800401](./screens/rc-config-provider/chromium/000399-3-screenshot.png) | 空白关联证据；不批准 |
| md3/dark/large/compact/default | failed | `c6f9d0b7f12b9e9ff102-7ef933d917c97e67658d/chromium/0#image-0` | [78ec6b48871aa0e3584ba80ae21e865dcafc840a59b4c6194369c3cff0e446ac](./screens/rc-config-provider/chromium/000400-0-screenshot.png) | 失败前提不满足；不批准 |
| md3/dark/large/compact/default | failed | `c6f9d0b7f12b9e9ff102-7ef933d917c97e67658d/chromium/0#image-1` | [3878570f4a62a0d65f57cf1754e0269e56ec797f4e36e26b44c172eb6e800401](./screens/rc-config-provider/chromium/000400-3-screenshot.png) | 空白关联证据；不批准 |
| md3/dark/large/standard/default | failed | `c6f9d0b7f12b9e9ff102-fbf8f432de03777571c4/chromium/0#image-0` | [78ec6b48871aa0e3584ba80ae21e865dcafc840a59b4c6194369c3cff0e446ac](./screens/rc-config-provider/chromium/000401-0-screenshot.png) | 失败前提不满足；不批准 |
| md3/dark/large/standard/default | failed | `c6f9d0b7f12b9e9ff102-fbf8f432de03777571c4/chromium/0#image-1` | [3878570f4a62a0d65f57cf1754e0269e56ec797f4e36e26b44c172eb6e800401](./screens/rc-config-provider/chromium/000401-3-screenshot.png) | 空白关联证据；不批准 |
| md3/dark/large/comfortable/default | interrupted | `c6f9d0b7f12b9e9ff102-a7dc553fedf292a88859/chromium/0#image-0` | [f90b50436c106baeb2d8f5b628bfa9685818771ea2974a8acabaee443ffd353e](./screens/rc-config-provider/chromium/000402-0-screenshot.png) | 中断且前提不满足；不批准 |
| md3/dark/large/comfortable/default | interrupted | `c6f9d0b7f12b9e9ff102-a7dc553fedf292a88859/chromium/0#image-1` | [3878570f4a62a0d65f57cf1754e0269e56ec797f4e36e26b44c172eb6e800401](./screens/rc-config-provider/chromium/000402-3-screenshot.png) | 空白关联证据；不批准 |

无图中断 case：`c6f9d0b7f12b9e9ff102-fae0780cda6880d231f3/chromium/0`；未实际视觉复审，不批准。
