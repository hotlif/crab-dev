# 按钮与面包屑：默认及真实 200% 复审

逐张通过 `view_image` 查看 66 张原始 PNG，覆盖 60 个 Chromium case：Breadcrumbs 24 图（默认三密度 18、真实 200% 6），Button 42 图（默认五尺寸 30、真实 200% 两帧共 12）。本组选中的原生 case 均 passed；整轮诊断仍有 35 unexpected 与 1969 skipped，不能报告全量通过。

本轮不建立 baseline，不更新 verified。默认图、200% 和完整状态矩阵分别记录；本组没有 Firefox/WebKit 图。

## 核对结果

- 66 PNG 实际 SHA-256 与 cases.json 一致，逐图输入匹配使用的 4 份稳定 worker 归档。
- 来源：`sha256:c5ea450017e600100fe1cccf61ab8003a6e66f30194bb43af96bfb2e0f06d855`。
- 构建产物：`sha256:d411fe4077d7249e9800da4d85e8021dc80de63ce35104f0d57a7af0a5c89856`。
- 站点：`sha256:b172805c04ebc260100858e4e853419df7bc2e9f0a1715b532e78294e2550bbf`。
- 浏览器：156.0.8078.4；平台 linux/x64。
- 镜像：`mcr.microsoft.com/playwright:v1.64.1-noble@sha256:47b510dd9230bf0b9bfc9b20102241e577ea7a99334ab4c3ca19f19770e9b8ea`。
- 18 张缩放图均核对 chrome.tabs.setZoom 1 → 2、CSS 视口 1280 → 640、外窗不变、CSS zoom 不变、visualViewport.scale=1；PNG 为实际可见视口，不冒充整页。
- 以上绑定归档候选，不声称等于后续工作树。Breadcrumbs 的后续密度修复尚需新构建与新图。

## 结论与限制

Breadcrumbs：默认路径、长链接、禁用项及当前位置完整；200% 键盘焦点和动作结果可见。三密度没有实际几何差异，违反本包已声明的间距契约；MD3、Apple light、shadcn 多组 PNG 完全重复。源码也确认 root.gap 指向固定 space.inline-gap。现已改为既有 L2 density.gap，生成与默认回归通过，但旧图不能作为修复后的验收证据。

Button：三体系浅深色下 xs/s/m/l/xl 默认外观逐张核对，文字与边界完整；MD3 xl 自然折成两行。200% 的 s 尺寸变体和长按钮可达，MD3 第一帧裁到长按钮下沿，第二滚动帧显示完整文字与边界。聚焦主要按钮有完整轮廓；未证明长按钮自身的键盘焦点或其他尺寸的 200% 行为。

shadcn light 的 dashed 兼容边界较弱但仍可见，当前为 neutral200 默认边界，与其浅色 outline 角色一致。记录为待设计复核，不断言上游或产品缺陷；本轮未修改 Button。

完整 hover、按下、禁用、选中、加载、折叠及环境矩阵仍待验收；没有进行跨引擎像素比较或数值对比度测量。

## 逐图索引

实际所见、未覆盖范围、输入与原生几何详见 [JSON](./reviews-actions-navigation.json)。

| 范围 / 配置 | Case / image ID | PNG SHA-256 | 结论 |
| --- | --- | --- | --- |
| rc-breadcrumbs / md3 light / zoom-200 | `5d3ac0066b4e41a3ca10-5b3abdcc3f46102c2176/chromium/0#image-0` | [4c85ab6e26c68d869803226ed75ebf0d48e7ff69244cda16e03db4ea19218d57](./screens/rc-breadcrumbs/chromium/000175-2-actual-zoom-200.png) | 已看；限实际展示范围 |
| rc-breadcrumbs / md3 dark / zoom-200 | `5d3ac0066b4e41a3ca10-8ee42297abe25e23855a/chromium/0#image-0` | [4f830933f7a4d214a3a4e591498b015a16c058c192bf7933965560d1737248f2](./screens/rc-breadcrumbs/chromium/000176-2-actual-zoom-200.png) | 已看；限实际展示范围 |
| rc-breadcrumbs / apple light / zoom-200 | `5d3ac0066b4e41a3ca10-b8aca3de965500454700/chromium/0#image-0` | [76b0b1d03a788ae646d21396380221937529a566c96e5495491e314fbd4e549b](./screens/rc-breadcrumbs/chromium/000177-2-actual-zoom-200.png) | 已看；限实际展示范围 |
| rc-breadcrumbs / apple dark / zoom-200 | `5d3ac0066b4e41a3ca10-9be92627fde59e8b2cf2/chromium/0#image-0` | [a9229ad96530f30d5b34ab53c4f8071c9185c5e885b4e21e8e6ea87b33410541](./screens/rc-breadcrumbs/chromium/000178-2-actual-zoom-200.png) | 已看；限实际展示范围 |
| rc-breadcrumbs / shadcn light / zoom-200 | `5d3ac0066b4e41a3ca10-30dd1140d0339fac36fd/chromium/0#image-0` | [e62e5a3e96dfa576713154398818e4f819196d6a04f50da735bf4de2238fe23e](./screens/rc-breadcrumbs/chromium/000179-2-actual-zoom-200.png) | 已看；限实际展示范围 |
| rc-breadcrumbs / shadcn dark / zoom-200 | `5d3ac0066b4e41a3ca10-e41d15ea12eecadbb755/chromium/0#image-0` | [cf40fe0f7521da470b28e918338e13db4cc5fb1bab72b87e0859ec6ad1b9c404](./screens/rc-breadcrumbs/chromium/000180-2-actual-zoom-200.png) | 已看；限实际展示范围 |
| rc-breadcrumbs / md3 light / medium compact | `3b575d840aefb246f5d8-d4012c6da32afc941b12/chromium/0#image-0` | [9e27e058983bdba53866b450062f61ae8f4346d109b9ed78c642f0baab24c3ec](./screens/rc-breadcrumbs/chromium/000181-1-actual.png) | 旧候选密度契约未满足 |
| rc-breadcrumbs / md3 light / medium standard | `3b575d840aefb246f5d8-23faa3939749952276a6/chromium/0#image-0` | [9e27e058983bdba53866b450062f61ae8f4346d109b9ed78c642f0baab24c3ec](./screens/rc-breadcrumbs/chromium/000182-1-actual.png) | 旧候选密度契约未满足 |
| rc-breadcrumbs / md3 light / medium comfortable | `3b575d840aefb246f5d8-ef8a0579b7f2d18ebdc2/chromium/0#image-0` | [9e27e058983bdba53866b450062f61ae8f4346d109b9ed78c642f0baab24c3ec](./screens/rc-breadcrumbs/chromium/000183-1-actual.png) | 旧候选密度契约未满足 |
| rc-breadcrumbs / md3 dark / medium compact | `3b575d840aefb246f5d8-01e4e25262c880d421eb/chromium/0#image-0` | [c964515dae0ce47ad02b0d027eaa951bd868af5930cd30620c104de86357fe54](./screens/rc-breadcrumbs/chromium/000184-1-actual.png) | 旧候选密度契约未满足 |
| rc-breadcrumbs / md3 dark / medium standard | `3b575d840aefb246f5d8-759d8a0c708091dd5cb9/chromium/0#image-0` | [c964515dae0ce47ad02b0d027eaa951bd868af5930cd30620c104de86357fe54](./screens/rc-breadcrumbs/chromium/000185-1-actual.png) | 旧候选密度契约未满足 |
| rc-breadcrumbs / md3 dark / medium comfortable | `3b575d840aefb246f5d8-9f6a0102b745b367e8bd/chromium/0#image-0` | [c964515dae0ce47ad02b0d027eaa951bd868af5930cd30620c104de86357fe54](./screens/rc-breadcrumbs/chromium/000186-1-actual.png) | 旧候选密度契约未满足 |
| rc-breadcrumbs / apple light / medium compact | `3b575d840aefb246f5d8-38a66f6eb559c2f97902/chromium/0#image-0` | [e7f47024c51384e5faf48eaf83e85cc6562358c8cd66699148131420470840a0](./screens/rc-breadcrumbs/chromium/000187-1-actual.png) | 旧候选密度契约未满足 |
| rc-breadcrumbs / apple light / medium standard | `3b575d840aefb246f5d8-b724b6fb2c2d8b47745a/chromium/0#image-0` | [e7f47024c51384e5faf48eaf83e85cc6562358c8cd66699148131420470840a0](./screens/rc-breadcrumbs/chromium/000188-1-actual.png) | 旧候选密度契约未满足 |
| rc-breadcrumbs / apple light / medium comfortable | `3b575d840aefb246f5d8-409bff5d0b9b99e32b08/chromium/0#image-0` | [e7f47024c51384e5faf48eaf83e85cc6562358c8cd66699148131420470840a0](./screens/rc-breadcrumbs/chromium/000189-1-actual.png) | 旧候选密度契约未满足 |
| rc-breadcrumbs / apple dark / medium compact | `3b575d840aefb246f5d8-8d74f94ab837b5e96276/chromium/0#image-0` | [064c2fe3872ff6c1e2fddad56dbe25e1a79a4a1970e8cb46d50f8872cee87b76](./screens/rc-breadcrumbs/chromium/000190-1-actual.png) | 旧候选密度契约未满足 |
| rc-breadcrumbs / apple dark / medium standard | `3b575d840aefb246f5d8-83d963bedc50544c519d/chromium/0#image-0` | [a7dd5b8dbdb7da1855b51a5a522aa9dbee827fa0d313b41a53f71edf758224e2](./screens/rc-breadcrumbs/chromium/000191-1-actual.png) | 旧候选密度契约未满足 |
| rc-breadcrumbs / apple dark / medium comfortable | `3b575d840aefb246f5d8-61529527804b59d534d2/chromium/0#image-0` | [a7dd5b8dbdb7da1855b51a5a522aa9dbee827fa0d313b41a53f71edf758224e2](./screens/rc-breadcrumbs/chromium/000192-1-actual.png) | 旧候选密度契约未满足 |
| rc-breadcrumbs / shadcn light / medium compact | `3b575d840aefb246f5d8-70523d4239cae2fed2e0/chromium/0#image-0` | [1319563ce01b39c1b85a8335ae165c24783e9b15c90f438a5ce57f33a24b2539](./screens/rc-breadcrumbs/chromium/000193-1-actual.png) | 旧候选密度契约未满足 |
| rc-breadcrumbs / shadcn light / medium standard | `3b575d840aefb246f5d8-d05a3972f78c64876baa/chromium/0#image-0` | [1319563ce01b39c1b85a8335ae165c24783e9b15c90f438a5ce57f33a24b2539](./screens/rc-breadcrumbs/chromium/000194-1-actual.png) | 旧候选密度契约未满足 |
| rc-breadcrumbs / shadcn light / medium comfortable | `3b575d840aefb246f5d8-7f85eb839902da047340/chromium/0#image-0` | [1319563ce01b39c1b85a8335ae165c24783e9b15c90f438a5ce57f33a24b2539](./screens/rc-breadcrumbs/chromium/000195-1-actual.png) | 旧候选密度契约未满足 |
| rc-breadcrumbs / shadcn dark / medium compact | `3b575d840aefb246f5d8-534f31e73d0d0699a39a/chromium/0#image-0` | [739c99cda94d93d2dbef9a31c14faf8488991ece457a1f99ae7ca237e0ec9b58](./screens/rc-breadcrumbs/chromium/000196-1-actual.png) | 旧候选密度契约未满足 |
| rc-breadcrumbs / shadcn dark / medium standard | `3b575d840aefb246f5d8-fb4b48835df80faa3ce3/chromium/0#image-0` | [739c99cda94d93d2dbef9a31c14faf8488991ece457a1f99ae7ca237e0ec9b58](./screens/rc-breadcrumbs/chromium/000197-1-actual.png) | 旧候选密度契约未满足 |
| rc-breadcrumbs / shadcn dark / medium comfortable | `3b575d840aefb246f5d8-e39eb7eb8020226d46c6/chromium/0#image-0` | [739c99cda94d93d2dbef9a31c14faf8488991ece457a1f99ae7ca237e0ec9b58](./screens/rc-breadcrumbs/chromium/000198-1-actual.png) | 旧候选密度契约未满足 |
| rc-button / md3 light / zoom-200 | `e0615b692a3cbec88509-2a0a130b124fb9d9bf0d/chromium/0#image-0` | [01782bf62faa9ef056b6f949c3918a5ef6e87133e92bfc203ca9b6d417cba140](./screens/rc-button/chromium/000199-2-actual-zoom-200.png) | 已看；限实际展示范围 |
| rc-button / md3 light / zoom-200 | `e0615b692a3cbec88509-2a0a130b124fb9d9bf0d/chromium/0#image-1` | [3bb1ce48f4995fb6ef98935fcdbf2393089e75a0fb7e5aaf5b1c633f53420197](./screens/rc-button/chromium/000199-4-actual-zoom-200.png) | 已看；限实际展示范围 |
| rc-button / md3 dark / zoom-200 | `e0615b692a3cbec88509-dafbfebee71f8ebf304a/chromium/0#image-0` | [26013f83c4be8df3b009a7f8b99078a37e3e9a9a73a023d43d6c4dbc7317d140](./screens/rc-button/chromium/000200-2-actual-zoom-200.png) | 已看；限实际展示范围 |
| rc-button / md3 dark / zoom-200 | `e0615b692a3cbec88509-dafbfebee71f8ebf304a/chromium/0#image-1` | [a7b71a23894096c872878a961b42e7ab3d811672df9712cb39e302a9d7382661](./screens/rc-button/chromium/000200-4-actual-zoom-200.png) | 已看；限实际展示范围 |
| rc-button / apple light / zoom-200 | `e0615b692a3cbec88509-01304900fb671d6816fc/chromium/0#image-0` | [d51add5ab5b45b9970ab4c5bf5a72df9e2bb2a7bb28e1612f1fcda2c3953bf42](./screens/rc-button/chromium/000201-2-actual-zoom-200.png) | 已看；限实际展示范围 |
| rc-button / apple light / zoom-200 | `e0615b692a3cbec88509-01304900fb671d6816fc/chromium/0#image-1` | [d51add5ab5b45b9970ab4c5bf5a72df9e2bb2a7bb28e1612f1fcda2c3953bf42](./screens/rc-button/chromium/000201-4-actual-zoom-200.png) | 已看；限实际展示范围 |
| rc-button / apple dark / zoom-200 | `e0615b692a3cbec88509-902c9e6fd4d2824b82a1/chromium/0#image-0` | [e0795077d75bf547b9089504328c37bc3233c9ef9d342736c2ca76df1a777359](./screens/rc-button/chromium/000202-2-actual-zoom-200.png) | 已看；限实际展示范围 |
| rc-button / apple dark / zoom-200 | `e0615b692a3cbec88509-902c9e6fd4d2824b82a1/chromium/0#image-1` | [e0795077d75bf547b9089504328c37bc3233c9ef9d342736c2ca76df1a777359](./screens/rc-button/chromium/000202-4-actual-zoom-200.png) | 已看；限实际展示范围 |
| rc-button / shadcn light / zoom-200 | `e0615b692a3cbec88509-48aec40d2200fc7a6571/chromium/0#image-0` | [a57afddf5fca029fc6a46a6e58191340d0dae2b6a0e612f08e12a766f22af6f3](./screens/rc-button/chromium/000203-2-actual-zoom-200.png) | 已看；弱边界待设计复核 |
| rc-button / shadcn light / zoom-200 | `e0615b692a3cbec88509-48aec40d2200fc7a6571/chromium/0#image-1` | [a57afddf5fca029fc6a46a6e58191340d0dae2b6a0e612f08e12a766f22af6f3](./screens/rc-button/chromium/000203-4-actual-zoom-200.png) | 已看；弱边界待设计复核 |
| rc-button / shadcn dark / zoom-200 | `e0615b692a3cbec88509-d5c54fc748740664280c/chromium/0#image-0` | [f0d6b4764665c663903fc3396fbe4c355185f71b3bddabee658ae6d041c94569](./screens/rc-button/chromium/000204-2-actual-zoom-200.png) | 已看；限实际展示范围 |
| rc-button / shadcn dark / zoom-200 | `e0615b692a3cbec88509-d5c54fc748740664280c/chromium/0#image-1` | [f0d6b4764665c663903fc3396fbe4c355185f71b3bddabee658ae6d041c94569](./screens/rc-button/chromium/000204-4-actual-zoom-200.png) | 已看；限实际展示范围 |
| rc-button / md3 light / xs standard | `b84dd6a488247b918e76-e9066dc52b06d2f1f2b9/chromium/0#image-0` | [9ae9c078b8c656da63daa03be2d759a2f8b19e61933c15fcf4ec7563fb1d9c33](./screens/rc-button/chromium/000205-2-actual.png) | 已看；限实际展示范围 |
| rc-button / md3 light / s standard | `b84dd6a488247b918e76-d7517f9ee31737f4335b/chromium/0#image-0` | [9b331a10e584739a0ae5b749f21abbe0f06302eb51513f990d7436768f6f3e1e](./screens/rc-button/chromium/000206-2-actual.png) | 已看；限实际展示范围 |
| rc-button / md3 light / m standard | `b84dd6a488247b918e76-1f9c7e10395a08aa769c/chromium/0#image-0` | [750614a239f345c481f77e7bb4d45501b1308d5990e1121522c635751d1141fe](./screens/rc-button/chromium/000207-2-actual.png) | 已看；限实际展示范围 |
| rc-button / md3 light / l standard | `b84dd6a488247b918e76-7287000dfb4726f707fa/chromium/0#image-0` | [49bcf3a890f04c46d5f8b51ffd0a857d6950f72a570dcea915a51ebc6cdb613b](./screens/rc-button/chromium/000208-2-actual.png) | 已看；限实际展示范围 |
| rc-button / md3 light / xl standard | `b84dd6a488247b918e76-d11286bd73833af358da/chromium/0#image-0` | [3fc8f4707fa8fd4dd55b0b4458935b8e3ee13a91af5dfe298c4da5f1760031b9](./screens/rc-button/chromium/000209-2-actual.png) | 已看；限实际展示范围 |
| rc-button / md3 dark / xs standard | `b84dd6a488247b918e76-3e915b2b9c257c92b902/chromium/0#image-0` | [e8900915df741345e60b06d5ba3bd50d10a4734532120c90c00fc8d655840ca2](./screens/rc-button/chromium/000210-2-actual.png) | 已看；限实际展示范围 |
| rc-button / md3 dark / s standard | `b84dd6a488247b918e76-a20a0cfc433a14ab4a48/chromium/0#image-0` | [97b0a0cd89c9b0138d7b92cbfaf1ceddc7fe831fed1d706b3297b5145f1d438c](./screens/rc-button/chromium/000211-2-actual.png) | 已看；限实际展示范围 |
| rc-button / md3 dark / m standard | `b84dd6a488247b918e76-6b510d003450e79cce54/chromium/0#image-0` | [1beb8c315754a8d359bef7b7b620c8b809bf57185e387dde5687edda17dbaa1e](./screens/rc-button/chromium/000212-2-actual.png) | 已看；限实际展示范围 |
| rc-button / md3 dark / l standard | `b84dd6a488247b918e76-428627d4054aacb9dca9/chromium/0#image-0` | [8a2df49952c08198939948523a62663c788b68e86b12ebf8c65b0bde8e726c40](./screens/rc-button/chromium/000213-2-actual.png) | 已看；限实际展示范围 |
| rc-button / md3 dark / xl standard | `b84dd6a488247b918e76-d98773871e45268ee630/chromium/0#image-0` | [b19c8f2e401015506d1729c802082a108e93f688a58867f80573d176a80a6c2f](./screens/rc-button/chromium/000214-2-actual.png) | 已看；限实际展示范围 |
| rc-button / apple light / xs standard | `b84dd6a488247b918e76-09283b8283ce632acf59/chromium/0#image-0` | [b1379e4ffc0f47ef3ad5380e45529fc410eb5931c044a56d14393e79e7fe037c](./screens/rc-button/chromium/000215-2-actual.png) | 已看；限实际展示范围 |
| rc-button / apple light / s standard | `b84dd6a488247b918e76-3cf122419c82e8f8181d/chromium/0#image-0` | [c45678c4174668decb7f3e9f1a9231faaa9c87aebe9cc3884cab4a687449c02a](./screens/rc-button/chromium/000216-2-actual.png) | 已看；限实际展示范围 |
| rc-button / apple light / m standard | `b84dd6a488247b918e76-35dde0dbdf9ed6f9421e/chromium/0#image-0` | [80f5b4ee8a4ced3fe61559b5c9e3a724539b2149291c781ee59888bd7fd30bfa](./screens/rc-button/chromium/000217-2-actual.png) | 已看；限实际展示范围 |
| rc-button / apple light / l standard | `b84dd6a488247b918e76-48aa4fb28304363d227c/chromium/0#image-0` | [b78230b90ebc9c6a27070a48bf45edf42aa92563a465a5d16b0ebcb3585c5a56](./screens/rc-button/chromium/000218-2-actual.png) | 已看；限实际展示范围 |
| rc-button / apple light / xl standard | `b84dd6a488247b918e76-cc86af1848eb5e61a544/chromium/0#image-0` | [471b43e4e3c94dabe51c166f05ce0cec1b0bef0c4dc0077c681557679c8ab8ba](./screens/rc-button/chromium/000219-2-actual.png) | 已看；限实际展示范围 |
| rc-button / apple dark / xs standard | `b84dd6a488247b918e76-1192e62e9fad5487a9ab/chromium/0#image-0` | [0ad828634bb7b18272bcaa219c39166d7128a8a790c255d9221fc2951c7ee4e7](./screens/rc-button/chromium/000220-2-actual.png) | 已看；限实际展示范围 |
| rc-button / apple dark / s standard | `b84dd6a488247b918e76-c9ab6a75580a3eb35a63/chromium/0#image-0` | [56b0cf8dd18e6eb279b479c513715eb82d30b5e7c359ea274fbeb43769befe66](./screens/rc-button/chromium/000221-2-actual.png) | 已看；限实际展示范围 |
| rc-button / apple dark / m standard | `b84dd6a488247b918e76-c58c2b4104e1b2a4e2be/chromium/0#image-0` | [fa2bdaafd7ec15df1006286762889f4899d7af66a1c3fd37db26d54d27fad3c2](./screens/rc-button/chromium/000222-2-actual.png) | 已看；限实际展示范围 |
| rc-button / apple dark / l standard | `b84dd6a488247b918e76-f18d6a056cc0ff84cace/chromium/0#image-0` | [576b4babbb6ac835d9ce9c70ec062ae2e05e9d3a8dcc2c3b0b3455fad77bd38d](./screens/rc-button/chromium/000223-2-actual.png) | 已看；限实际展示范围 |
| rc-button / apple dark / xl standard | `b84dd6a488247b918e76-30cc448f2aea34d3a1aa/chromium/0#image-0` | [1e226bc3aa56e9414b2a3d6df2011fa6e71b7587c4583c36f10575e96ebf1ae3](./screens/rc-button/chromium/000224-2-actual.png) | 已看；限实际展示范围 |
| rc-button / shadcn light / xs standard | `b84dd6a488247b918e76-e3a22af3de09e47ece28/chromium/0#image-0` | [76db48edd9f4eff0447e0cc3574ed822b8bb9a425f705e025381df9349ff8c50](./screens/rc-button/chromium/000225-2-actual.png) | 已看；限实际展示范围 |
| rc-button / shadcn light / s standard | `b84dd6a488247b918e76-747c3ec8557104695d73/chromium/0#image-0` | [b7962a5c9cc0d2a1e6ebc4c51b8afa4c47e56d288b8e0a5aa9c7b90b694e629c](./screens/rc-button/chromium/000226-2-actual.png) | 已看；限实际展示范围 |
| rc-button / shadcn light / m standard | `b84dd6a488247b918e76-a02f5313a28715b9ab0f/chromium/0#image-0` | [458eaceaa215d2c8d072ca132dcf9f95c5b7c26815c74cb750fe3124641e76bf](./screens/rc-button/chromium/000227-2-actual.png) | 已看；限实际展示范围 |
| rc-button / shadcn light / l standard | `b84dd6a488247b918e76-19e7575f68a46bfeeea0/chromium/0#image-0` | [c1b0549e5c8b201e6691645bc2ad86cb101c4240ac890a0880e3c228dd053885](./screens/rc-button/chromium/000228-2-actual.png) | 已看；限实际展示范围 |
| rc-button / shadcn light / xl standard | `b84dd6a488247b918e76-c1124855b65afb60042c/chromium/0#image-0` | [499d61dec52e51504a14709e9d0cdb748f0adc594b564f0e6664c5d31406773b](./screens/rc-button/chromium/000229-2-actual.png) | 已看；限实际展示范围 |
| rc-button / shadcn dark / xs standard | `b84dd6a488247b918e76-06e5c4fbf9430bd0aa50/chromium/0#image-0` | [31f4dd27e619471944c6c03cd944b75f4b3536d64d97c4f8728627344c6e1124](./screens/rc-button/chromium/000230-2-actual.png) | 已看；限实际展示范围 |
| rc-button / shadcn dark / s standard | `b84dd6a488247b918e76-2f3e66594a60100bf7eb/chromium/0#image-0` | [5a740846b42a1e6559b52671564f905e3c5e368352d0122149ab24a4d51b565c](./screens/rc-button/chromium/000231-2-actual.png) | 已看；限实际展示范围 |
| rc-button / shadcn dark / m standard | `b84dd6a488247b918e76-819e0f65e266747d3492/chromium/0#image-0` | [66acd99087b4178630408054237694405291b95fd56dd9050609da4c8763e172](./screens/rc-button/chromium/000232-2-actual.png) | 已看；限实际展示范围 |
| rc-button / shadcn dark / l standard | `b84dd6a488247b918e76-294988716228178d966f/chromium/0#image-0` | [e2800e92bc9b67d26425041803a3645a69c8233e68f907df98f464d1462ebeec](./screens/rc-button/chromium/000233-2-actual.png) | 已看；限实际展示范围 |
| rc-button / shadcn dark / xl standard | `b84dd6a488247b918e76-83633ef94fb85745cd85/chromium/0#image-0` | [ba9992ef2e6631c97fd51a7ef7afe93c0d78f2f4e0a11f7b686c2aae5cf912c9](./screens/rc-button/chromium/000234-2-actual.png) | 已看；限实际展示范围 |
