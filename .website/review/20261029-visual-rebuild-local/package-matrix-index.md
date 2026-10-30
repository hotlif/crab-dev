# 全组件视觉矩阵本地工作索引

派生时间：2026-10-29T16:13:14.997Z。产品身份来自 [产品清单](../../../library.manifest.json)，轴和不适用理由来自各包视觉规格；计算复用共享矩阵契约。完整 SHA 绑定与实际结果在 [JSON 索引](package-matrix-index.json)。本页不是第二产品清单或验收状态来源。

本次覆盖 54 个清单产品、50 份视觉规格；4 个产品按清单不适用视觉矩阵。声明的核心单元：Chromium 14514，Firefox 1362，WebKit 1362；Chromium 环境单元 2994。这些是待执行范围，不能视为通过。

所有产品：基准均未建立；连续两次普通像素比较均未证明；最终同一候选的 Windows / 本地 Linux 统一全量入口均待完成。所有既有结果仅绑定各自保留的源码/资产指纹，不声称当前全库通过。

## 声明矩阵与实际证据

核心数顺序为 Chromium / Firefox / WebKit；环境数仅计算共享契约要求的 Chromium 场景。包内额外边界、库存、领域断言及多外观截图不会被混加为核心单元。

| 产品（规格链接） | 核心单元 C / F / W | 环境 C | 实际保留范围 |
| --- | ---: | ---: | --- |
| [rc-alert](../../../components/rc-alert/docs/visual.json) | 48 / 18 / 18 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-app-main-layout](../../../components/rc-app-main-layout/docs/visual.json) | 270 / 24 / 24 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-auto-sizer（清单 N/A）](../../../library.manifest.json) | 0 / 0 / 0 | 0 | 清单三体系均 N/A |
| [rc-avatar](../../../components/rc-avatar/docs/visual.json) | 144 / 18 / 18 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-badge](../../../components/rc-badge/docs/visual.json) | 84 / 6 / 6 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-bar-chart](../../../components/rc-bar-chart/docs/visual.json) | 180 / 24 / 24 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-breadcrumbs](../../../components/rc-breadcrumbs/docs/visual.json) | 126 / 30 / 30 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-button](../../../components/rc-button/docs/visual.json) | 270 / 18 / 18 | 60 | [历史，需新源重跑](../20261029-button-all-appearances-linux-2/README.md) |
| [rc-canvas](../../../components/rc-canvas/docs/visual.json) | 60 / 24 / 24 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-card](../../../components/rc-card/docs/visual.json) | 486 / 18 / 18 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-checkbox](../../../components/rc-checkbox/docs/visual.json) | 270 / 24 / 24 | 60 | [Windows Chromium 候选全复审](../20261029-checkbox-full-windows-2/README.md) |
| [rc-color-picker](../../../components/rc-color-picker/docs/visual.json) | 126 / 24 / 24 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-component-preview](../../../components/rc-component-preview/docs/visual.json) | 144 / 18 / 18 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-config-provider](../../../components/rc-config-provider/docs/visual.json) | 216 / 18 / 18 | 60 | [历史，需新源重跑](../20261029-config-boundaries-linux-1/README.md) |
| [rc-cron-picker](../../../components/rc-cron-picker/docs/visual.json) | 1674 / 78 / 78 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-date-picker](../../../components/rc-date-picker/docs/visual.json) | 1674 / 114 / 114 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-dialog](../../../components/rc-dialog/docs/visual.json) | 48 / 30 / 30 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-divider](../../../components/rc-divider/docs/visual.json) | 144 / 6 / 6 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-drawer](../../../components/rc-drawer/docs/visual.json) | 108 / 24 / 24 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-dropdown-container](../../../components/rc-dropdown-container/docs/visual.json) | 72 / 24 / 24 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-empty](../../../components/rc-empty/docs/visual.json) | 144 / 18 / 18 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-flow-diagram](../../../components/rc-flow-diagram/docs/visual.json) | 48 / 24 / 24 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-form](../../../components/rc-form/docs/visual.json) | 486 / 30 / 30 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-hooks（清单 N/A）](../../../library.manifest.json) | 0 / 0 / 0 | 0 | 清单三体系均 N/A |
| [rc-line-edit](../../../components/rc-line-edit/docs/visual.json) | 162 / 24 / 24 | 60 | [Linux 三引擎候选全复审](../20261029-line-edit-all-engines-linux-candidate-1/README.md) |
| [rc-masonry](../../../components/rc-masonry/docs/visual.json) | 72 / 24 / 24 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-menu](../../../components/rc-menu/docs/visual.json) | 198 / 48 / 48 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-message](../../../components/rc-message/docs/visual.json) | 48 / 6 / 6 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-notification](../../../components/rc-notification/docs/visual.json) | 66 / 18 / 18 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-number-edit](../../../components/rc-number-edit/docs/visual.json) | 288 / 24 / 24 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-pagination](../../../components/rc-pagination/docs/visual.json) | 486 / 36 / 36 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-pdf-editor](../../../components/rc-pdf-editor/docs/visual.json) | 702 / 36 / 36 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-prose](../../../components/rc-prose/docs/visual.json) | 96 / 18 / 18 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-radio](../../../components/rc-radio/docs/visual.json) | 216 / 24 / 24 | 60 | [Windows Chromium 候选全复审](../20261029-radio-full-windows-1/README.md) |
| [rc-realm](../../../components/rc-realm/docs/visual.json) | 126 / 36 / 36 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-router（清单 N/A）](../../../library.manifest.json) | 0 / 0 / 0 | 0 | 清单三体系均 N/A |
| [rc-segmented](../../../components/rc-segmented/docs/visual.json) | 162 / 24 / 24 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-select](../../../components/rc-select/docs/visual.json) | 594 / 30 / 30 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-skeleton](../../../components/rc-skeleton/docs/visual.json) | 90 / 6 / 6 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-slider](../../../components/rc-slider/docs/visual.json) | 240 / 30 / 30 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-spin](../../../components/rc-spin/docs/visual.json) | 108 / 24 / 24 | 54 | 矩阵自动/视觉验收待完成 |
| [rc-split-pane](../../../components/rc-split-pane/docs/visual.json) | 48 / 30 / 30 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-switch](../../../components/rc-switch/docs/visual.json) | 216 / 24 / 24 | 60 | [失败候选，修正后待跑](../20261029-switch-full-windows-1/README.md) |
| [rc-table](../../../components/rc-table/docs/visual.json) | 432 / 24 / 24 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-table-pro](../../../components/rc-table-pro/docs/visual.json) | 864 / 60 / 60 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-tabs](../../../components/rc-tabs/docs/visual.json) | 1296 / 66 / 66 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-tag](../../../components/rc-tag/docs/visual.json) | 378 / 24 / 24 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-text-edit](../../../components/rc-text-edit/docs/visual.json) | 198 / 24 / 24 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-theme](../../../components/rc-theme/docs/visual.json) | 18 / 18 / 18 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-token-global](../../../components/rc-token-global/docs/visual.json) | 6 / 6 / 6 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-token-semantic](../../../components/rc-token-semantic/docs/visual.json) | 12 / 12 / 12 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-tooltip](../../../components/rc-tooltip/docs/visual.json) | 30 / 24 / 24 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-tree](../../../components/rc-tree/docs/visual.json) | 540 / 30 / 30 | 60 | 矩阵自动/视觉验收待完成 |
| [rc-virtual（清单 N/A）](../../../library.manifest.json) | 0 / 0 / 0 | 0 | 清单三体系均 N/A |

## 规格轴与不适用理由

### rc-alert

[视觉规格](../../../components/rc-alert/docs/visual.json)（SHA-256 `8d142195087bb8a020a9bff1ebef196938f019b87067901076192042ad746a23`）；Demo：`visual-matrix.demo.tsx`。

尺寸：medium。密度：standard。状态：default / title / action / hover / focus-visible / pressed / error / closed。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / pressed。

- `size`：This component has no public named size prop; medium identifies the inherited configuration, not a new component size.（[包内理由来源](../../../components/rc-alert/docs/visual.json)）。
- `density`：This component has fixed presentation geometry; density does not change its geometry.（[包内理由来源](../../../components/rc-alert/docs/visual.json)）。
- `selection`：This display/feedback component has no selected or checked protocol.（[包内理由来源](../../../components/rc-alert/docs/visual.json)）。
- `error`：Error is an explicit semantic state in the matrix.（[包内理由来源](../../../components/rc-alert/docs/visual.json)）。
- `interaction`：Hover/focus/press apply only to the genuine public interactive control, never to the display surface.（[包内理由来源](../../../components/rc-alert/docs/visual.json)）。

### rc-app-main-layout

[视觉规格](../../../components/rc-app-main-layout/docs/visual.json)（SHA-256 `ffe5895f127a9f8a05e431b33d955b434197746d53f69ddbcab9854a6e006a99`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：compact / standard / comfortable。状态：default / hover / focus-visible / collapsed / account。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / collapsed / account。

- `error`：Layout delegates request errors to supplied page/menu content.（[包内理由来源](../../../components/rc-app-main-layout/docs/visual.json)）。
- `disabled`：Navigation destinations remain available; the layout has no global disabled mode.（[包内理由来源](../../../components/rc-app-main-layout/docs/visual.json)）。
- `loading`：Initial account/sidebar skeletons are transitional; fixed fulfilled requests establish deterministic default captures.（[包内理由来源](../../../components/rc-app-main-layout/docs/visual.json)）。

### rc-auto-sizer

[清单来源](../../../library.manifest.json)：清单三体系均 not-applicable；不以协议测试推导视觉矩阵。

### rc-avatar

[视觉规格](../../../components/rc-avatar/docs/visual.json)（SHA-256 `41063ab196690d5aee97351f23c81b4afd26d943408fdb455190e1a615389be2`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：standard。状态：default / image / fallback / disabled / hover / focus-visible / pressed / group。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / pressed。

- `size`：All public named sizes are listed. Open numeric/string dimensions use documented representative samples, not an exhaustive claim.（[包内理由来源](../../../components/rc-avatar/docs/visual.json)）。
- `density`：This component has fixed presentation geometry; density does not change its geometry.（[包内理由来源](../../../components/rc-avatar/docs/visual.json)）。
- `selection`：This display/feedback component has no selected or checked protocol.（[包内理由来源](../../../components/rc-avatar/docs/visual.json)）。
- `error`：Errors belong to the owning data/action flow, not an invented presentation state.（[包内理由来源](../../../components/rc-avatar/docs/visual.json)）。
- `interaction`：Hover/focus/press apply only to the genuine public interactive control, never to the display surface.（[包内理由来源](../../../components/rc-avatar/docs/visual.json)）。

### rc-badge

[视觉规格](../../../components/rc-badge/docs/visual.json)（SHA-256 `8f683b8902a2e999525ccffe48766325c6d699ad3a8d76c8850a26f98bc46942`）；Demo：`visual-matrix.demo.tsx`。

尺寸：default / small。密度：standard。状态：default / zero / overflow / dot / status / error / processing。

Firefox / WebKit 子集：尺寸 default；密度 standard；状态 default。

- `size`：All public named sizes are listed. Open numeric/string dimensions use documented representative samples, not an exhaustive claim.（[包内理由来源](../../../components/rc-badge/docs/visual.json)）。
- `density`：This component has fixed presentation geometry; density does not change its geometry.（[包内理由来源](../../../components/rc-badge/docs/visual.json)）。
- `selection`：This display/feedback component has no selected or checked protocol.（[包内理由来源](../../../components/rc-badge/docs/visual.json)）。
- `error`：Error is an explicit semantic state in the matrix.（[包内理由来源](../../../components/rc-badge/docs/visual.json)）。
- `interaction`：The display surface does not expose a user action; hover, focus and pressed are not synthesized.（[包内理由来源](../../../components/rc-badge/docs/visual.json)）。
- `motion`：Continuous states are recorded naturally with video/time-series in a separate file; they are never frozen into a static pixel baseline.（[包内理由来源](../../../components/rc-badge/docs/visual.json)）。

### rc-bar-chart

[视觉规格](../../../components/rc-bar-chart/docs/visual.json)（SHA-256 `53ad4b2f7ef8d5ba5420fdd0e8f9f35fdcfe05939f2249be00ee00debf015c2a`）；Demo：`visual-matrix.demo.tsx`。

尺寸：medium。密度：compact / standard / comfortable。状态：default / hover / focus-visible / pressed / selected / empty / horizontal / stacked / negative / refresh。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / selected / empty。

- `size`：The chart has explicit width/height domain geometry and no control-size prop; provider size does not rescale chart coordinates.（[包内理由来源](../../../components/rc-bar-chart/docs/visual.json)）。
- `disabled`：The chart does not expose a disabled prop. Hidden series are real selected/unselected legend states.（[包内理由来源](../../../components/rc-bar-chart/docs/visual.json)）。
- `error`：Loading and transport errors are owned by the data source. BarChart accepts complete synchronous data; refresh preserves existing chart data.（[包内理由来源](../../../components/rc-bar-chart/docs/visual.json)）。
- `loading`：Finite data transitions are captured naturally in a dedicated video scenario, never frozen or replaced by a loading style.（[包内理由来源](../../../components/rc-bar-chart/docs/visual.json)）。
- `expanded`：The chart has no disclosure or popup protocol.（[包内理由来源](../../../components/rc-bar-chart/docs/visual.json)）。

### rc-breadcrumbs

[视觉规格](../../../components/rc-breadcrumbs/docs/visual.json)（SHA-256 `b01027f3ad740d4a20cdecb3e8c92bcd0a4b2bb12373b0ff7f6329d9e8aad2cc`）；Demo：`visual-matrix.demo.tsx`。

尺寸：medium。密度：compact / standard / comfortable。状态：default / hover / focus-visible / pressed / disabled / action / collapsed。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / disabled / action / collapsed。

- `size`：Breadcrumbs exposes no size prop and uses shared body typography. The provider size is fixed to medium; density independently changes inline spacing.（[包内理由来源](../../../components/rc-breadcrumbs/docs/visual.json)）。
- `selected`：The current page is a non-interactive aria-current location visible in every frame, not a selectable item.（[包内理由来源](../../../components/rc-breadcrumbs/docs/visual.json)）。
- `error`：Navigation items do not validate input.（[包内理由来源](../../../components/rc-breadcrumbs/docs/visual.json)）。
- `loading`：Navigation has no loading protocol.（[包内理由来源](../../../components/rc-breadcrumbs/docs/visual.json)）。
- `expanded`：maxCount creates a non-interactive ellipsis and does not expose an expansion protocol.（[包内理由来源](../../../components/rc-breadcrumbs/docs/visual.json)）。

### rc-button

[视觉规格](../../../components/rc-button/docs/visual.json)（SHA-256 `919d0e80f367ab84aeba578db927338adca3c222b8e68a710b5cb1e6177ca02f`）；Demo：`visual-matrix.demo.tsx`。

尺寸：xs / s / m / l / xl。密度：standard。状态：default / hover / focus-visible / pressed / disabled / selected / unselected / variants / loading。

Firefox / WebKit 子集：尺寸 s；密度 standard；状态 default / focus-visible / pressed。

- `density`：Button uses its five explicit public size values; density does not alter action geometry.（[包内理由来源](../../../components/rc-button/docs/visual.json)）。
- `error`：Errors belong to the surrounding action result; danger is a separate appearance semantic.（[包内理由来源](../../../components/rc-button/docs/visual.json)）。
- `expanded`：Expansion belongs to the owning popup or disclosure component.（[包内理由来源](../../../components/rc-button/docs/visual.json)）。

### rc-canvas

[视觉规格](../../../components/rc-canvas/docs/visual.json)（SHA-256 `dc99fc4b3a63232d4ce6e1bb722ad97e906256c5e06aa1e1a968000897865966`）；Demo：`visual-matrix.demo.tsx`。

尺寸：medium。密度：standard。状态：default / hover / focus-visible / selected / dragged / editing / committed / cancelled / restored / flowing。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / editing / committed。

- `size`：Canvas width/height are explicit domain coordinates rather than ConfigProvider control sizes.（[包内理由来源](../../../components/rc-canvas/docs/visual.json)）。
- `density`：Drawing geometry is not multiplied by collection density.（[包内理由来源](../../../components/rc-canvas/docs/visual.json)）。
- `disabled`：Canvas has no blanket disabled protocol; applications control their own editing modes.（[包内理由来源](../../../components/rc-canvas/docs/visual.json)）。
- `error`：Engine initialization failures are surfaced as failures rather than simulated error styles.（[包内理由来源](../../../components/rc-canvas/docs/visual.json)）。
- `loading`：Resource and context recovery are covered by real browser lifecycle checks; this fixture contains no external images.（[包内理由来源](../../../components/rc-canvas/docs/visual.json)）。

### rc-card

[视觉规格](../../../components/rc-card/docs/visual.json)（SHA-256 `4f9d2923b8f1e7f8dc810325dbfa73275fa543089a9af677d7e2fbeeb28dae89`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：compact / standard / comfortable。状态：default / elevated / outlined / filled / hover / focus-visible / pressed / disabled / loading。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / pressed。

- `size`：All public named sizes are listed. Open numeric/string dimensions use documented representative samples, not an exhaustive claim.（[包内理由来源](../../../components/rc-card/docs/visual.json)）。
- `density`：All three layout density boundaries are exercised independently of size.（[包内理由来源](../../../components/rc-card/docs/visual.json)）。
- `selection`：This display/feedback component has no selected or checked protocol.（[包内理由来源](../../../components/rc-card/docs/visual.json)）。
- `error`：Errors belong to the owning data/action flow, not an invented presentation state.（[包内理由来源](../../../components/rc-card/docs/visual.json)）。
- `interaction`：Hover/focus/press apply only to the genuine public interactive control, never to the display surface.（[包内理由来源](../../../components/rc-card/docs/visual.json)）。
- `motion`：Continuous states are recorded naturally with video/time-series in a separate file; they are never frozen into a static pixel baseline.（[包内理由来源](../../../components/rc-card/docs/visual.json)）。

### rc-checkbox

[视觉规格](../../../components/rc-checkbox/docs/visual.json)（SHA-256 `aeda04717b2ee5583566815efe967c411db5213cf649dd04083427ea63e88438`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：standard。状态：default / hover / focus-visible / pressed / selected / selected-hover / selected-focus-visible / selected-pressed / error / selected-error / disabled / disabled-selected / indeterminate / indeterminate-error / disabled-indeterminate。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / selected / disabled-selected。

- `density`：Standalone selection controls follow public size. Density controls collection spacing and does not resize this control.（[包内理由来源](../../../components/rc-checkbox/docs/visual.json)）。
- `loading`：Pending asynchronous changes belong to the owning form; this control has no loading contract.（[包内理由来源](../../../components/rc-checkbox/docs/visual.json)）。

### rc-color-picker

[视觉规格](../../../components/rc-color-picker/docs/visual.json)（SHA-256 `4e2d14822a069d1409f1589e6b8eed3811383fb69a91326cdf3a3f2364cf85bb`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：standard。状态：default / hover / focus-visible / pressed / disabled / expanded / edited。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / expanded / edited。

- `density`：Picker geometry follows its public size; no collection row density applies.（[包内理由来源](../../../components/rc-color-picker/docs/visual.json)）。
- `selected`：Current color and edited draft are covered by expanded/edited states.（[包内理由来源](../../../components/rc-color-picker/docs/visual.json)）。
- `error`：The picker has no public validation status; invalid color input remains covered by behavior tests.（[包内理由来源](../../../components/rc-color-picker/docs/visual.json)）。
- `loading`：No standalone picker loading prop exists. Native EyeDropper session pending uses Button loading and needs real system selection evidence; it is not faked or counted as exercised by this browser matrix.（[包内理由来源](../../../components/rc-color-picker/docs/visual.json)）。

### rc-component-preview

[视觉规格](../../../components/rc-component-preview/docs/visual.json)（SHA-256 `c7ac8a588f0ef038d457f617bb830024ea107f451604646e7f1467a50eac10d1`）；Demo：`visual-matrix.demo.tsx`。

尺寸：medium。密度：compact / standard / comfortable。状态：default / expanded / dark-source / copy-success / copy-error / focus-visible / external / loading。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / expanded / focus-visible。

- `size`：Preview has no public component size; action buttons choose their own compact toolbar size.（[包内理由来源](../../../components/rc-component-preview/docs/visual.json)）。
- `disabled`：Preview does not expose a disabled state.（[包内理由来源](../../../components/rc-component-preview/docs/visual.json)）。
- `pressed`：Action button press feedback is verified in Button; Preview verifies source expansion and action callbacks.（[包内理由来源](../../../components/rc-component-preview/docs/visual.json)）。
- `densityNames`：The demo maps ConfigProvider compact/standard/comfortable to public Preview compact/regular/spacious; these are independent protocols.（[包内理由来源](../../../components/rc-component-preview/docs/visual.json)）。

### rc-config-provider

[视觉规格](../../../components/rc-config-provider/docs/visual.json)（SHA-256 `44366927fedb94b97f82db3a62e839c73e029958be6a64b5b9a7e50e5bb6d952`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：compact / standard / comfortable。状态：default / brand / portal / focus-visible。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / portal / focus-visible。

- `disabled`：A configuration boundary has no disabled protocol; descendants retain their own disabled state.（[包内理由来源](../../../components/rc-config-provider/docs/visual.json)）。
- `selected`：The boundary chooses configuration rather than a selectable value.（[包内理由来源](../../../components/rc-config-provider/docs/visual.json)）。
- `error`：Invalid configuration is covered by strict types and runtime brand validation, not a visual error surface.（[包内理由来源](../../../components/rc-config-provider/docs/visual.json)）。
- `loading`：Configuration inheritance is synchronous.（[包内理由来源](../../../components/rc-config-provider/docs/visual.json)）。

### rc-cron-picker

[视觉规格](../../../components/rc-cron-picker/docs/visual.json)（SHA-256 `a5545c94222ee5b6a4a527c35d1854e6871cd3b249ab3fd56144f5a231937fa9`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：compact / standard / comfortable。状态：default / hover / focus-visible / pressed / disabled / read-only / warning / error / committed / expanded / minute-step / field-hour / field-day / field-month / field-week / editor-minute-every / editor-minute-range / editor-hour-every / editor-hour-step / editor-hour-range / editor-day-step / editor-day-range / editor-day-list / editor-month-step / editor-month-range / editor-month-list / editor-week-every / editor-week-list / read-only-step / read-only-range / read-only-week-range。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / read-only / error / committed / expanded / minute-step / editor-minute-range / editor-day-list / editor-month-list / editor-week-list / read-only-step / read-only-week-range。

- `loading`：Cron parsing, description and occurrence preview are synchronous public capabilities; no loading prop is exposed.（[包内理由来源](../../../components/rc-cron-picker/docs/visual.json)）。
- `selected`：The expanded editor has five field selection states and the minute-step state; the input itself is not a toggle.（[包内理由来源](../../../components/rc-cron-picker/docs/visual.json)）。
- `preview-clock`：The package test fixes Date via Playwright clock.setFixedTime to make occurrence text deterministic; product timers and animations continue normally.（[包内理由来源](../../../components/rc-cron-picker/docs/visual.json)）。
- `weekday-step`：The weekday editor exposes every, continuous range and explicit list choices; it has no fixed-interval control. The other four fields cover interval parameter editing.（[包内理由来源](../../../components/rc-cron-picker/docs/visual.json)）。

### rc-date-picker

[视觉规格](../../../components/rc-date-picker/docs/visual.json)（SHA-256 `b38eee56f8cb5abc2af06a05476610dc0e9aa7aff1d9dd518db8189a9544663a`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：compact / standard / comfortable。状态：default / hover / focus-visible / disabled / error / warning / cleared / date-open / date-selected / date-today / datetime-open / time-dial-open / time-input-open / time-error / time-12-dial-hour / time-12-dial-minute / time-24-dial-minute / time-12-input / time-24-input / time-24-seconds / time-minute-error / time-second-error / time-empty-error / time-period-pm / time-keyboard-steps / time-mode-switch / datetime-12-open / datetime-time-error / datetime-no-seconds / datetime-12-no-seconds / time-dial-keyboard。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / cleared / date-open / date-selected / date-today / datetime-open / time-dial-open / time-input-open / time-error / time-12-dial-minute / time-24-input / time-second-error / time-period-pm / time-keyboard-steps / time-mode-switch / datetime-time-error / datetime-12-no-seconds / time-dial-keyboard。

- `pressed`：The read-only picker field has no pressed value state. Calendar, dial and confirm actions are verified through real opening and selection interactions.（[包内理由来源](../../../components/rc-date-picker/docs/visual.json)）。
- `loading`：Date and time calculations are local and synchronous; these pickers expose no loading protocol.（[包内理由来源](../../../components/rc-date-picker/docs/visual.json)）。
- `today-clock`：Public business values and ranges are fixed. The package test fixes Date with clock.setFixedTime for today's marker without freezing timers or animations.（[包内理由来源](../../../components/rc-date-picker/docs/visual.json)）。
- `read-only`：Date/time fields are intrinsically text-read-only because values are chosen through the popup; this is independent of disabled.（[包内理由来源](../../../components/rc-date-picker/docs/visual.json)）。

### rc-dialog

[视觉规格](../../../components/rc-dialog/docs/visual.json)（SHA-256 `d21160e58c4691773a0a1c07768d8db1a09615d449a2b92fb4ab3934c461e3e8`）；Demo：`visual-matrix.demo.tsx`。

尺寸：medium。密度：standard。状态：default / hover / focus-visible / pressed / long-content / error / pending-confirm / pending-cancel。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / long-content / pending-confirm / pending-cancel。

- `size`：Dialog has no public size variants; its viewport-constrained surface uses overlay roles.（[包内理由来源](../../../components/rc-dialog/docs/visual.json)）。
- `density`：Modal surface geometry does not use collection density.（[包内理由来源](../../../components/rc-dialog/docs/visual.json)）。
- `disabled`：The modal itself is not a disabled action; disabled sibling actions are exercised by pending-confirm/pending-cancel.（[包内理由来源](../../../components/rc-dialog/docs/visual.json)）。
- `selected`：A modal does not select data.（[包内理由来源](../../../components/rc-dialog/docs/visual.json)）。
- `loading`：The modal surface has no independent loading prop; its real pending-confirm/pending-cancel actions retain natural animation frames and video.（[包内理由来源](../../../components/rc-dialog/docs/visual.json)）。

### rc-divider

[视觉规格](../../../components/rc-divider/docs/visual.json)（SHA-256 `ba698ff98567f4b18fabffdf90f5e74cc91045999d31a80397f5edbfbfb2f45e`）；Demo：`visual-matrix.demo.tsx`。

尺寸：medium。密度：compact / standard / comfortable。状态：default / dashed / dotted / with-text / start / end / vertical / decorative。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default。

- `size`：This component has no public named size prop; medium identifies the inherited configuration, not a new component size.（[包内理由来源](../../../components/rc-divider/docs/visual.json)）。
- `density`：All three layout density boundaries are exercised independently of size.（[包内理由来源](../../../components/rc-divider/docs/visual.json)）。
- `selection`：This display/feedback component has no selected or checked protocol.（[包内理由来源](../../../components/rc-divider/docs/visual.json)）。
- `error`：Errors belong to the owning data/action flow, not an invented presentation state.（[包内理由来源](../../../components/rc-divider/docs/visual.json)）。
- `interaction`：The display surface does not expose a user action; hover, focus and pressed are not synthesized.（[包内理由来源](../../../components/rc-divider/docs/visual.json)）。

### rc-drawer

[视觉规格](../../../components/rc-drawer/docs/visual.json)（SHA-256 `def17b1154b84f13191b070d31c2ffba12f8411732a087604337feda1386a039`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：standard。状态：default / focus-visible / left / top / bottom / long-content。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / left / long-content。

- `density`：Edge panel size is independent of child collection density.（[包内理由来源](../../../components/rc-drawer/docs/visual.json)）。
- `hover`：Hover feedback belongs to the public Button used for closing, not the panel surface.（[包内理由来源](../../../components/rc-drawer/docs/visual.json)）。
- `pressed`：Pressed actions are public Button behavior.（[包内理由来源](../../../components/rc-drawer/docs/visual.json)）。
- `disabled`：The panel is not an action and has no disabled prop.（[包内理由来源](../../../components/rc-drawer/docs/visual.json)）。
- `selected`：The panel does not select data.（[包内理由来源](../../../components/rc-drawer/docs/visual.json)）。
- `error`：Validation belongs to the content supplied by callers.（[包内理由来源](../../../components/rc-drawer/docs/visual.json)）。
- `loading`：Drawer exposes no loading state.（[包内理由来源](../../../components/rc-drawer/docs/visual.json)）。

### rc-dropdown-container

[视觉规格](../../../components/rc-dropdown-container/docs/visual.json)（SHA-256 `4cadf81c9a664c2190fb15c020588c89faace90b8843736376e5cdc3822fb05b`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：standard。状态：default / expanded / focus-visible / content-focus。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / expanded / focus-visible / content-focus。

- `density`：DropdownContainer positions arbitrary content; collection density belongs to its consumer.（[包内理由来源](../../../components/rc-dropdown-container/docs/visual.json)）。
- `hover`：The surface does not activate on hover; trigger visuals belong to Button.（[包内理由来源](../../../components/rc-dropdown-container/docs/visual.json)）。
- `pressed`：The surface does not expose a pressed state.（[包内理由来源](../../../components/rc-dropdown-container/docs/visual.json)）。
- `disabled`：Disabling belongs to the reference control.（[包内理由来源](../../../components/rc-dropdown-container/docs/visual.json)）。
- `selected`：Selection belongs to overlay content.（[包内理由来源](../../../components/rc-dropdown-container/docs/visual.json)）。
- `error`：Validation belongs to the owning field.（[包内理由来源](../../../components/rc-dropdown-container/docs/visual.json)）。
- `loading`：Loading belongs to overlay content.（[包内理由来源](../../../components/rc-dropdown-container/docs/visual.json)）。

### rc-empty

[视觉规格](../../../components/rc-empty/docs/visual.json)（SHA-256 `cbd0d02dcf83da2cd3801136b5b27702feb96fd703500dfc2b86eb2e675603a3`）；Demo：`visual-matrix.demo.tsx`。

尺寸：medium。密度：compact / standard / comfortable。状态：default / search / no-permission / action / hover / focus-visible / pressed / custom。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / pressed。

- `size`：This component has no public named size prop; medium identifies the inherited configuration, not a new component size.（[包内理由来源](../../../components/rc-empty/docs/visual.json)）。
- `density`：All three layout density boundaries are exercised independently of size.（[包内理由来源](../../../components/rc-empty/docs/visual.json)）。
- `selection`：This display/feedback component has no selected or checked protocol.（[包内理由来源](../../../components/rc-empty/docs/visual.json)）。
- `error`：Errors belong to the owning data/action flow, not an invented presentation state.（[包内理由来源](../../../components/rc-empty/docs/visual.json)）。
- `interaction`：Hover/focus/press apply only to the genuine public interactive control, never to the display surface.（[包内理由来源](../../../components/rc-empty/docs/visual.json)）。

### rc-flow-diagram

[视觉规格](../../../components/rc-flow-diagram/docs/visual.json)（SHA-256 `2378508c609bd4c5bbc5385ba4555d83dc69529fb918b87c69eac208d709ec57`）；Demo：`visual-matrix.demo.tsx`。

尺寸：medium。密度：standard。状态：default / focus-visible / selected / dragged / empty / error / manual-route / refresh。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / selected / error。

- `size`：Nodes, text, ports and canvas use explicit world geometry; global control size must not rescale diagram coordinates.（[包内理由来源](../../../components/rc-flow-diagram/docs/visual.json)）。
- `density`：Diagram layout and world spacing are domain parameters. The component has no density geometry override.（[包内理由来源](../../../components/rc-flow-diagram/docs/visual.json)）。
- `disabled`：FlowDiagram has no disabled prop; edit permissions belong to the render-prop host.（[包内理由来源](../../../components/rc-flow-diagram/docs/visual.json)）。
- `hover`：FlowNode has no hover state API; pointer hit testing is exercised by real selection and dragging.（[包内理由来源](../../../components/rc-flow-diagram/docs/visual.json)）。
- `pressed`：Transient pointer press has no independent diagram style; actual pointer capture is exercised during dragging.（[包内理由来源](../../../components/rc-flow-diagram/docs/visual.json)）。
- `loading`：ELK loading is transient and uses the real asynchronous layout; video and ready/error assertions cover it without extending its duration.（[包内理由来源](../../../components/rc-flow-diagram/docs/visual.json)）。
- `expanded`：The diagram exposes no expansion protocol.（[包内理由来源](../../../components/rc-flow-diagram/docs/visual.json)）。

### rc-form

[视觉规格](../../../components/rc-form/docs/visual.json)（SHA-256 `716abb7af930cfc9851ffe05a27ca272d13c430938e1e6a775fa628c9b30fa26`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：compact / standard / comfortable。状态：default / hover / focus-visible / disabled / read-only / error / warning / success / validating。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / error / warning / success。

- `pressed`：Form does not expose a pressed container; submit action feedback belongs to Button and fields retain their own interactions.（[包内理由来源](../../../components/rc-form/docs/visual.json)）。
- `selected`：Form manages field records rather than a selectable container.（[包内理由来源](../../../components/rc-form/docs/visual.json)）。
- `expanded`：Popup fields own expansion; the Form layout has no expansion protocol.（[包内理由来源](../../../components/rc-form/docs/visual.json)）。
- `loading`：The equivalent applicable state is validating, sampled with live animation and video in form-motion.visual.spec.mjs.（[包内理由来源](../../../components/rc-form/docs/visual.json)）。

### rc-hooks

[清单来源](../../../library.manifest.json)：清单三体系均 not-applicable；不以协议测试推导视觉矩阵。

### rc-line-edit

[视觉规格](../../../components/rc-line-edit/docs/visual.json)（SHA-256 `7dcf264ca0ad35d941269b9a59ec383358578a8c1b8c9297d7e5cf7469f8d828`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：standard。状态：default / hover / focus-visible / filled / clear / error / warning / disabled / read-only。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / error / clear。

- `density`：Field geometry follows public size; collection density does not resize standalone fields.（[包内理由来源](../../../components/rc-line-edit/docs/visual.json)）。
- `pressed`：Text fields receive text selection and caret interaction rather than an action pressed surface.（[包内理由来源](../../../components/rc-line-edit/docs/visual.json)）。
- `loading`：Asynchronous loading belongs to the owning form or selector.（[包内理由来源](../../../components/rc-line-edit/docs/visual.json)）。

### rc-masonry

[视觉规格](../../../components/rc-masonry/docs/visual.json)（SHA-256 `189773f4163822f3bd4234d642320e3fe91c0a46874a5fe075cadd06fbb16c40`）；Demo：`visual-matrix.demo.tsx`。

尺寸：medium。密度：compact / standard / comfortable。状态：default / sequential / inserted / empty。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / sequential / inserted / empty。

- `size`：Layout consumes available width and item measurements; control size does not alter its geometry.（[包内理由来源](../../../components/rc-masonry/docs/visual.json)）。
- `hover`：The layout has no interactive surface; child content owns interaction states.（[包内理由来源](../../../components/rc-masonry/docs/visual.json)）。
- `selected`：Selection belongs to the supplied item component.（[包内理由来源](../../../components/rc-masonry/docs/visual.json)）。
- `disabled`：The layout does not disable content.（[包内理由来源](../../../components/rc-masonry/docs/visual.json)）。
- `error`：Request and content errors belong to the consumer.（[包内理由来源](../../../components/rc-masonry/docs/visual.json)）。
- `loading`：No asynchronous data lifecycle is owned by Masonry.（[包内理由来源](../../../components/rc-masonry/docs/visual.json)）。

### rc-menu

[视觉规格](../../../components/rc-menu/docs/visual.json)（SHA-256 `b16ca642ab73eeb51801f3222ddfe823412ff504ef6a0f70234f31971d08676f`）；Demo：`visual-matrix.demo.tsx`。

尺寸：medium。密度：compact / standard / comfortable。状态：default / hover / focus-visible / pressed / selected / expanded / horizontal / inline / collapsed / horizontal-expanded / collapsed-expanded。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / selected / expanded / horizontal / collapsed / horizontal-expanded / collapsed-expanded。

- `size`：Menu has no public size prop; row geometry follows density.navigation independently.（[包内理由来源](../../../components/rc-menu/docs/visual.json)）。
- `disabled`：Menu items expose no disabled property; inventing one would change the public API.（[包内理由来源](../../../components/rc-menu/docs/visual.json)）。
- `error`：Navigation exposes no validation state.（[包内理由来源](../../../components/rc-menu/docs/visual.json)）。
- `loading`：Loading is the caller's data state and no public Menu loading prop exists.（[包内理由来源](../../../components/rc-menu/docs/visual.json)）。

### rc-message

[视觉规格](../../../components/rc-message/docs/visual.json)（SHA-256 `a12b3a9ed6b6d6f959ad4ad69581b50633a7baa59d583bea4def67ace6b085ab`）；Demo：`visual-matrix.demo.tsx`。

尺寸：medium。密度：standard。状态：default / success / warning / error / long-content / updated / closed / loading。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default。

- `size`：This component has no public named size prop; medium identifies the inherited configuration, not a new component size.（[包内理由来源](../../../components/rc-message/docs/visual.json)）。
- `density`：This component has fixed presentation geometry; density does not change its geometry.（[包内理由来源](../../../components/rc-message/docs/visual.json)）。
- `selection`：This display/feedback component has no selected or checked protocol.（[包内理由来源](../../../components/rc-message/docs/visual.json)）。
- `error`：Error is an explicit semantic state in the matrix.（[包内理由来源](../../../components/rc-message/docs/visual.json)）。
- `interaction`：The display surface does not expose a user action; hover, focus and pressed are not synthesized.（[包内理由来源](../../../components/rc-message/docs/visual.json)）。
- `motion`：Continuous states are recorded naturally with video/time-series in a separate file; they are never frozen into a static pixel baseline.（[包内理由来源](../../../components/rc-message/docs/visual.json)）。

### rc-notification

[视觉规格](../../../components/rc-notification/docs/visual.json)（SHA-256 `4d0686538812e4fb7a769bd5be6abcd7df6c6ea22c7a5472bfce1c5f968f1ee9`）；Demo：`visual-matrix.demo.tsx`。

尺寸：medium。密度：standard。状态：default / hover / focus-visible / pressed / updated / closed / top / topLeft / bottom / bottomLeft / bottomRight。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / pressed。

- `size`：This component has no public named size prop; medium identifies the inherited configuration, not a new component size.（[包内理由来源](../../../components/rc-notification/docs/visual.json)）。
- `density`：This component has fixed presentation geometry; density does not change its geometry.（[包内理由来源](../../../components/rc-notification/docs/visual.json)）。
- `selection`：This display/feedback component has no selected or checked protocol.（[包内理由来源](../../../components/rc-notification/docs/visual.json)）。
- `error`：Errors belong to the owning data/action flow, not an invented presentation state.（[包内理由来源](../../../components/rc-notification/docs/visual.json)）。
- `interaction`：Hover/focus/press apply only to the genuine public interactive control, never to the display surface.（[包内理由来源](../../../components/rc-notification/docs/visual.json)）。

### rc-number-edit

[视觉规格](../../../components/rc-number-edit/docs/visual.json)（SHA-256 `bbb855cb6c9d03d0d7bf74b526cafe31e12ec4995dae31f0a4feeecba3837f11`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：standard。状态：default / hover / focus-visible / filled / error / warning / disabled / read-only / minimum / maximum / scientific / formatted / clear / keyboard-step / stepper-focus / long-press。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / keyboard-step / scientific。

- `density`：Field geometry follows public size; collection density does not change the field or its draft.（[包内理由来源](../../../components/rc-number-edit/docs/visual.json)）。
- `selected`：Text selection and scalar editing are native input behavior, not a binary selection surface.（[包内理由来源](../../../components/rc-number-edit/docs/visual.json)）。
- `loading`：Asynchronous state belongs to the form or the owner.（[包内理由来源](../../../components/rc-number-edit/docs/visual.json)）。

### rc-pagination

[视觉规格](../../../components/rc-pagination/docs/visual.json)（SHA-256 `acbd03ec08ee9be709496587a9d2830531018d9728fa352fa12287c4ca78abf4`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：compact / standard / comfortable。状态：default / hover / focus-visible / pressed / disabled / empty / selected / jump / size-menu。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / disabled / selected / jump / size-menu。

- `error`：Pagination has no data-fetch or error protocol; invalid jump text is clamped/ignored by its existing value rules.（[包内理由来源](../../../components/rc-pagination/docs/visual.json)）。
- `loading`：Fetching belongs to the owning data view. Pagination keeps its current location and can be disabled by that owner.（[包内理由来源](../../../components/rc-pagination/docs/visual.json)）。

### rc-pdf-editor

[视觉规格](../../../components/rc-pdf-editor/docs/visual.json)（SHA-256 `4296c753219e5f7389f60567516de242866c03ff40888452260a88628c1bf0e0`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：compact / standard / comfortable。状态：default / hover / focus-visible / pressed / disabled / selected / error / empty / read-only / expanded / edited / scroll / loading。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / selected / error / read-only / scroll。

包内未声明额外不适用项；本索引不补造理由。

### rc-prose

[视觉规格](../../../components/rc-prose/docs/visual.json)（SHA-256 `4c04d69cdf20d7c7643b01e440d11e67c89efc7e2c3115f99d542004265914f9`）；Demo：`visual-matrix.demo.tsx`。

尺寸：sm / base / lg / xl。密度：standard。状态：default / inverse / hover / focus-visible。

Firefox / WebKit 子集：尺寸 base；密度 standard；状态 default / inverse / focus-visible。

- `density`：Article rhythm follows its explicit four typography sizes, independently from data density.（[包内理由来源](../../../components/rc-prose/docs/visual.json)）。
- `selected`：Text selection is a browser interaction, not an article state.（[包内理由来源](../../../components/rc-prose/docs/visual.json)）。
- `disabled`：Readable content is not disabled.（[包内理由来源](../../../components/rc-prose/docs/visual.json)）。
- `error`：Validation and request feedback are supplied content.（[包内理由来源](../../../components/rc-prose/docs/visual.json)）。
- `loading`：Prose renders synchronous semantic HTML.（[包内理由来源](../../../components/rc-prose/docs/visual.json)）。

### rc-radio

[视觉规格](../../../components/rc-radio/docs/visual.json)（SHA-256 `7810171239400dad9ff6ea00ecce9469c2906abe33c5a837b57bf5043ab74a51`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：standard。状态：default / hover / focus-visible / pressed / selected / selected-hover / selected-focus-visible / selected-pressed / error / selected-error / disabled / disabled-selected。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / selected / disabled-selected。

- `density`：Standalone selection controls follow public size. Density controls collection spacing and does not resize this control.（[包内理由来源](../../../components/rc-radio/docs/visual.json)）。
- `loading`：Pending asynchronous changes belong to the owning form; this control has no loading contract.（[包内理由来源](../../../components/rc-radio/docs/visual.json)）。
- `indeterminate`：This control is binary and has no mixed-value protocol.（[包内理由来源](../../../components/rc-radio/docs/visual.json)）。

### rc-realm

[视觉规格](../../../components/rc-realm/docs/visual.json)（SHA-256 `17b92186814532024101929c5f66c2e7f6f6bb08eaa2e09e126cb60cfa2f9a7b`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：standard。状态：default / focus-visible / error / sandbox / loading / web-component-var / web-component-module。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / error / sandbox / web-component-var / web-component-module。

- `density`：Realm is a transparent transport host. Feedback and remote content own spacing; the wrapper does not add a second density system.（[包内理由来源](../../../components/rc-realm/docs/visual.json)）。
- `hover`：Remote content owns hover appearance; Realm adds none.（[包内理由来源](../../../components/rc-realm/docs/visual.json)）。
- `pressed`：Remote content owns press behavior; retry uses the public Button contract.（[包内理由来源](../../../components/rc-realm/docs/visual.json)）。
- `disabled`：Realm has no disabled protocol. Loading and failure expose actionable retry state.（[包内理由来源](../../../components/rc-realm/docs/visual.json)）。
- `selected`：Selection is remote application state, not a transport-host state.（[包内理由来源](../../../components/rc-realm/docs/visual.json)）。
- `expanded`：Realm has no disclosure state.（[包内理由来源](../../../components/rc-realm/docs/visual.json)）。

### rc-router

[清单来源](../../../library.manifest.json)：清单三体系均 not-applicable；不以协议测试推导视觉矩阵。

### rc-segmented

[视觉规格](../../../components/rc-segmented/docs/visual.json)（SHA-256 `15692d29f4ca00a24347e382b046481cb6b558b8329fb6d16ae80b7ab91b9715`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：standard。状态：default / hover / focus-visible / pressed / selected / selected-hover / selected-pressed / disabled / item-disabled。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / selected / disabled。

- `selected-focus-visible`：The focus-visible case uses native Tab and ArrowRight to select and focus Week; it already captures the selected keyboard-focus surface.（[包内理由来源](../../../components/rc-segmented/docs/visual.json)）。
- `density`：Density belongs to the containing collection. Segmented geometry follows size without changing the selected value.（[包内理由来源](../../../components/rc-segmented/docs/visual.json)）。
- `error`：Segmented has no field-validation appearance; the owning field provides validation text.（[包内理由来源](../../../components/rc-segmented/docs/visual.json)）。
- `loading`：Async view loading belongs to the selected content region.（[包内理由来源](../../../components/rc-segmented/docs/visual.json)）。

### rc-select

[视觉规格](../../../components/rc-select/docs/visual.json)（SHA-256 `6dcd42bdb982de103fd9631808560ea3890e554b50e1f7bc9db8d5a2b7570e5d`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：compact / standard / comfortable。状态：default / hover / focus-visible / expanded / selected / multiple / error / warning / disabled / empty / loading。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / expanded / selected / error。

- `pressed`：The field opens a collection; option activation is covered by selection rather than a latched action surface.（[包内理由来源](../../../components/rc-select/docs/visual.json)）。
- `read-only`：Select exposes disabled and controlled display; it has no readOnly prop.（[包内理由来源](../../../components/rc-select/docs/visual.json)）。

### rc-skeleton

[视觉规格](../../../components/rc-skeleton/docs/visual.json)（SHA-256 `66b29c5c382c3db1f4cccbd71bb3cc970f845de631288c5bbd0a087e03801390`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：standard。状态：default / inactive / loaded / round / wave。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default。

- `size`：All public named sizes are listed. Open numeric/string dimensions use documented representative samples, not an exhaustive claim.（[包内理由来源](../../../components/rc-skeleton/docs/visual.json)）。
- `density`：This component has fixed presentation geometry; density does not change its geometry.（[包内理由来源](../../../components/rc-skeleton/docs/visual.json)）。
- `selection`：This display/feedback component has no selected or checked protocol.（[包内理由来源](../../../components/rc-skeleton/docs/visual.json)）。
- `error`：Errors belong to the owning data/action flow, not an invented presentation state.（[包内理由来源](../../../components/rc-skeleton/docs/visual.json)）。
- `interaction`：The display surface does not expose a user action; hover, focus and pressed are not synthesized.（[包内理由来源](../../../components/rc-skeleton/docs/visual.json)）。
- `motion`：Continuous states are recorded naturally with video/time-series in a separate file; they are never frozen into a static pixel baseline.（[包内理由来源](../../../components/rc-skeleton/docs/visual.json)）。

### rc-slider

[视觉规格](../../../components/rc-slider/docs/visual.json)（SHA-256 `5fd6843c3c97932efe1aac6837d9a8886f25347af81f94f2331d1cc3ea198356`）；Demo：`visual-matrix.demo.tsx`。

尺寸：xs / s / m / l / xl。密度：standard。状态：default / hover / focus-visible / dragging / minimum / maximum / disabled / error。

Firefox / WebKit 子集：尺寸 xs；密度 standard；状态 default / focus-visible / dragging / minimum / maximum。

- `density`：Continuous scalar controls follow their explicit size. Collection density does not change track geometry.（[包内理由来源](../../../components/rc-slider/docs/visual.json)）。
- `selected`：The scalar value and active track express the selection; there is no binary selected state.（[包内理由来源](../../../components/rc-slider/docs/visual.json)）。
- `loading`：The slider has no asynchronous-loading protocol.（[包内理由来源](../../../components/rc-slider/docs/visual.json)）。

### rc-spin

[视觉规格](../../../components/rc-spin/docs/visual.json)（SHA-256 `3746b45c6628de882a1b5f7204fb758f31ddc8f1df5524effca9adfe5455fac1`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：standard。状态：default / expressive / overlay / idle / delayed / custom。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / expressive / overlay / idle。

- `zoom-200-static-baseline`：The loading indicator keeps its natural continuous animation at real browser zoom. Native video and timed full-viewport PNG samples are reviewed; moving states do not establish static pixel baselines.（[包内理由来源](../../../components/rc-spin/docs/visual.json)）。
- `touch`：The activity indicator has no pointer action or hit target; inert blocking is verified in the overlay state, and wrapped controls own touch geometry.（[包内理由来源](../../../components/rc-spin/docs/visual.json)）。
- `density`：Activity indicators use their explicit size and do not use collection density.（[包内理由来源](../../../components/rc-spin/docs/visual.json)）。
- `hover-focus-pressed`：The indicator itself is not interactive; wrapped content is inert while loading.（[包内理由来源](../../../components/rc-spin/docs/visual.json)）。
- `disabled-selected-error`：Loading is an activity state. Disabled and validation feedback belong to the owning content.（[包内理由来源](../../../components/rc-spin/docs/visual.json)）。

### rc-split-pane

[视觉规格](../../../components/rc-split-pane/docs/visual.json)（SHA-256 `6d32c19ec08db34635ff09b3ce532c13aa0466e04a44e76b5dcb946925397b14`）；Demo：`visual-matrix.demo.tsx`。

尺寸：medium。密度：standard。状态：default / hover / focus-visible / pressed / disabled / vertical / minimum / maximum。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / vertical / minimum / maximum。

- `size`：The public numeric size controls pane extent, not ConfigProvider control size. Min/max and resizing are explicit states.（[包内理由来源](../../../components/rc-split-pane/docs/visual.json)）。
- `density`：The separator follows pointer mode rather than data density.（[包内理由来源](../../../components/rc-split-pane/docs/visual.json)）。
- `selected`：A separator resizes panes and has no selected state.（[包内理由来源](../../../components/rc-split-pane/docs/visual.json)）。
- `error`：Constraint clamping handles out-of-range extents; no validation appearance exists.（[包内理由来源](../../../components/rc-split-pane/docs/visual.json)）。
- `loading`：Layout performs no asynchronous request.（[包内理由来源](../../../components/rc-split-pane/docs/visual.json)）。

### rc-switch

[视觉规格](../../../components/rc-switch/docs/visual.json)（SHA-256 `7810171239400dad9ff6ea00ecce9469c2906abe33c5a837b57bf5043ab74a51`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：standard。状态：default / hover / focus-visible / pressed / selected / selected-hover / selected-focus-visible / selected-pressed / error / selected-error / disabled / disabled-selected。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / selected / disabled-selected。

- `density`：Standalone selection controls follow public size. Density controls collection spacing and does not resize this control.（[包内理由来源](../../../components/rc-switch/docs/visual.json)）。
- `loading`：Pending asynchronous changes belong to the owning form; this control has no loading contract.（[包内理由来源](../../../components/rc-switch/docs/visual.json)）。
- `indeterminate`：This control is binary and has no mixed-value protocol.（[包内理由来源](../../../components/rc-switch/docs/visual.json)）。

### rc-table

[视觉规格](../../../components/rc-table/docs/visual.json)（SHA-256 `49748b99b892f339825976b74af6e667aeef070553577f2f0919bb1aa71b77d7`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：compact / standard / comfortable。状态：default / hover / focus-visible / selected / expanded / editing / scrolled / empty。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / selected / scrolled。

- `loading`：Table does not own requests or a loading state; TablePro covers real requests.（[包内理由来源](../../../components/rc-table/docs/visual.json)）。
- `error`：Request errors belong to TablePro. Table exposes custom empty content.（[包内理由来源](../../../components/rc-table/docs/visual.json)）。
- `disabled`：The grid remains navigable; individual selection controls may be disabled.（[包内理由来源](../../../components/rc-table/docs/visual.json)）。

### rc-table-pro

[视觉规格](../../../components/rc-table-pro/docs/visual.json)（SHA-256 `39a45ec0d9043db7cb7210c7a4907e24897f26b9ce96aea371c26f3c09e65174`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：compact / standard / comfortable。状态：default / focus-visible / selected / sidebar / editing / edit-committed / edit-cancelled / scrolled / empty / error / columns-error / loading / refreshing / refreshed / refresh-error / refresh-recovered。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / selected / sidebar / editing / scrolled / error / refreshed / refresh-error / refresh-recovered。

- `disabled`：Disable individual row selection through rowSelection; the complete grid remains navigable.（[包内理由来源](../../../components/rc-table-pro/docs/visual.json)）。

### rc-tabs

[视觉规格](../../../components/rc-tabs/docs/visual.json)（SHA-256 `600a8978f72a37ce407125a38d2a85a292a21c3c8b212e1454bc88e3201b5f3e`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：compact / standard / comfortable。状态：default / line:hover / line:focus-visible / line:pressed / line:disabled / line:selected / line:closed / line:overflow / card:default / card:hover / card:focus-visible / card:pressed / card:disabled / card:selected / card:closed / card:overflow / pill:default / pill:hover / pill:focus-visible / pill:pressed / pill:disabled / pill:selected / pill:closed / pill:overflow。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / line:focus-visible / line:selected / line:closed / line:overflow / card:default / card:focus-visible / card:overflow / pill:default / pill:focus-visible / pill:overflow。

- `error`：Tabs do not validate panel content; errors belong to the owning panel.（[包内理由来源](../../../components/rc-tabs/docs/visual.json)）。
- `loading`：Tabs have no loading prop; asynchronous panel content retains its own status and lifecycle.（[包内理由来源](../../../components/rc-tabs/docs/visual.json)）。
- `expanded`：All variants use a horizontal scrollable tab strip rather than a popup overflow menu.（[包内理由来源](../../../components/rc-tabs/docs/visual.json)）。

### rc-tag

[视觉规格](../../../components/rc-tag/docs/visual.json)（SHA-256 `dedbd57083e4cedaa68e17daac2e9e47f91b6b036cdf7388ff565cf8a5ef554d`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：compact / standard / comfortable。状态：default / hover / focus-visible / pressed / disabled / selected / removed。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / selected / removed。

- `checkable-size`：CheckableTag exposes a single chip geometry. The size axis changes Tag's public small/medium/large values only.（[包内理由来源](../../../components/rc-tag/docs/visual.json)）。
- `error`：Tag's error is a semantic preset visible in every frame rather than a validation state.（[包内理由来源](../../../components/rc-tag/docs/visual.json)）。
- `loading`：Neither Tag nor CheckableTag exposes an asynchronous loading protocol.（[包内理由来源](../../../components/rc-tag/docs/visual.json)）。
- `expanded`：Tags do not own a popup; close and selection are separate real interactions.（[包内理由来源](../../../components/rc-tag/docs/visual.json)）。

### rc-text-edit

[视觉规格](../../../components/rc-text-edit/docs/visual.json)（SHA-256 `7a85a1b2b715c854359775961725b56dc3370a17561a0b591362a4084cb88d69`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：standard。状态：default / hover / focus-visible / filled / error / warning / disabled / read-only / clear / auto-size / borderless。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / filled / clear。

- `density`：Field geometry follows public size; collection density does not change the field or its draft.（[包内理由来源](../../../components/rc-text-edit/docs/visual.json)）。
- `selected`：Text selection and scalar editing are native input behavior, not a binary selection surface.（[包内理由来源](../../../components/rc-text-edit/docs/visual.json)）。
- `loading`：Asynchronous state belongs to the form or the owner.（[包内理由来源](../../../components/rc-text-edit/docs/visual.json)）。
- `pressed`：The textarea uses caret placement and native text selection rather than an action pressed surface.（[包内理由来源](../../../components/rc-text-edit/docs/visual.json)）。

### rc-theme

[视觉规格](../../../components/rc-theme/docs/visual.json)（SHA-256 `26a985b3d59b39094daca0e1721772cdb2af39aea59a39840e3bf39bed2369e5`）；Demo：`visual-matrix.demo.tsx`。

尺寸：medium。密度：standard。状态：default / nested / focus-visible。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / nested / focus-visible。

- `size`：Theme exports CSS boundary mappings, without a public component size.（[包内理由来源](../../../components/rc-theme/docs/visual.json)）。
- `density`：Density geometry belongs to ConfigProvider and component measurements.（[包内理由来源](../../../components/rc-theme/docs/visual.json)）。
- `disabled`：A CSS mapping is not a disabled control.（[包内理由来源](../../../components/rc-theme/docs/visual.json)）。
- `selected`：Selection is represented by semantic roles consumed by each component.（[包内理由来源](../../../components/rc-theme/docs/visual.json)）。
- `loading`：Theme mappings are static CSS.（[包内理由来源](../../../components/rc-theme/docs/visual.json)）。
- `pressed`：Theme does not render an action target.（[包内理由来源](../../../components/rc-theme/docs/visual.json)）。

### rc-token-global

[视觉规格](../../../components/rc-token-global/docs/visual.json)（SHA-256 `e88290b0730d17c6c3408e7c63065ff4654523d911794f6b2e27d6ca15a95ea2`）；Demo：`base.demo.tsx`。

尺寸：medium。密度：standard。状态：default。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default。

- `size`：The displayed raw scale values are deliberately invariant to control sizes.（[包内理由来源](../../../components/rc-token-global/docs/visual.json)）。
- `density`：L1 primitives have no collection density.（[包内理由来源](../../../components/rc-token-global/docs/visual.json)）。
- `hover`：The raw swatch is not interactive.（[包内理由来源](../../../components/rc-token-global/docs/visual.json)）。
- `focus-visible`：The swatch has a text label and no keyboard action.（[包内理由来源](../../../components/rc-token-global/docs/visual.json)）。
- `pressed`：The swatch is not an action target.（[包内理由来源](../../../components/rc-token-global/docs/visual.json)）。
- `disabled`：A primitive value does not have disabled state.（[包内理由来源](../../../components/rc-token-global/docs/visual.json)）。
- `selected`：No value selection protocol is exposed by this sample.（[包内理由来源](../../../components/rc-token-global/docs/visual.json)）。
- `error`：Token syntax and references have separate contract checks.（[包内理由来源](../../../components/rc-token-global/docs/visual.json)）。
- `loading`：The sample consumes static primitives.（[包内理由来源](../../../components/rc-token-global/docs/visual.json)）。

### rc-token-semantic

[视觉规格](../../../components/rc-token-semantic/docs/visual.json)（SHA-256 `d753c9e67660639e0c2d25ac9ff8543d0754b0ed0c441bc0c610e2995d96a83f`）；Demo：`visual-matrix.demo.tsx`。

尺寸：medium。密度：standard。状态：default / focus-visible。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible。

- `size`：L2 publishes semantic values rather than a sized component.（[包内理由来源](../../../components/rc-token-semantic/docs/visual.json)）。
- `density`：Density geometry is validated by its consumers and shared numeric contract.（[包内理由来源](../../../components/rc-token-semantic/docs/visual.json)）。
- `disabled`：A token has no disabled lifecycle; its disabled color roles are tested by consumers.（[包内理由来源](../../../components/rc-token-semantic/docs/visual.json)）。
- `loading`：Token values do not load asynchronously.（[包内理由来源](../../../components/rc-token-semantic/docs/visual.json)）。
- `pressed`：This sample identifies role pairings; component pressed surfaces have their own matrices.（[包内理由来源](../../../components/rc-token-semantic/docs/visual.json)）。

### rc-tooltip

[视觉规格](../../../components/rc-tooltip/docs/visual.json)（SHA-256 `39c685e2a7791db4bbb4a11c51028b40a559a1e6eff11a27cfa0e340581b8508`）；Demo：`visual-matrix.demo.tsx`。

尺寸：medium。密度：standard。状态：default / hover / focus-visible / arrow / long-text。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / hover / focus-visible / long-text。

- `size`：Tooltip has no public size prop; trigger sizing belongs to the wrapped control.（[包内理由来源](../../../components/rc-tooltip/docs/visual.json)）。
- `density`：Plain tooltip typography and padding are independent of collection density.（[包内理由来源](../../../components/rc-tooltip/docs/visual.json)）。
- `pressed`：A tooltip supplements its trigger and does not activate a command.（[包内理由来源](../../../components/rc-tooltip/docs/visual.json)）。
- `disabled`：Disabled trigger behavior belongs to its control; a tooltip has no disabled prop.（[包内理由来源](../../../components/rc-tooltip/docs/visual.json)）。
- `selected`：A tooltip does not select data.（[包内理由来源](../../../components/rc-tooltip/docs/visual.json)）。
- `error`：Required errors belong to persistent field descriptions.（[包内理由来源](../../../components/rc-tooltip/docs/visual.json)）。
- `loading`：A tooltip does not load content or actions.（[包内理由来源](../../../components/rc-tooltip/docs/visual.json)）。

### rc-tree

[视觉规格](../../../components/rc-tree/docs/visual.json)（SHA-256 `fadfa93a309a469d08471a07e2eebdfb55d4f23520cd5145ab8e9460d6c441f3`）；Demo：`visual-matrix.demo.tsx`。

尺寸：small / medium / large。密度：compact / standard / comfortable。状态：default / hover / focus-visible / selected / checked / collapsed / editing / scrolled / empty / loading。

Firefox / WebKit 子集：尺寸 medium；密度 standard；状态 default / focus-visible / selected / collapsed / editing。

- `disabled`：Tree has no whole-tree disabled mode. Normal data scenes include a disabled leaf; empty, loading, collapsed and scrolled scenes do not claim disabled-node interaction coverage.（[包内理由来源](../../../components/rc-tree/docs/visual.json)）。
- `error`：Tree has no built-in error renderer; request error messaging belongs to its consuming application.（[包内理由来源](../../../components/rc-tree/docs/visual.json)）。

### rc-virtual

[清单来源](../../../library.manifest.json)：清单三体系均 not-applicable；不以协议测试推导视觉矩阵。

## 明确保留的实际结果

### line-edit-linux-1

[原报告](../20261029-line-edit-all-engines-linux-candidate-1/README.md)：三引擎完整包候选已运行且原图全复审；只证明其独立冻结候选。

原生计划 291 项；实际状态 `{"passed":291}`；有记录的 attempt 291；原图 558，字节 SHA 匹配 558，可从逐图复审记录明确绑定 558。未绑定的 0 张保持待确认，不以自动结果补齐。

源码指纹：`sha256:7beb88bd084e220beb63ca79e12e24e6bccac1d4b8374044f45ad967cc1e9414`。资产指纹：`sha256:f42ca21f373f12158e8e48f86aecfee0f23f7a250b747231049ff4f5df7aa84a`。

- [cases.json](../20261029-line-edit-all-engines-linux-candidate-1/cases.json) — SHA-256 `f4f22acb184a149e280b0b81db778aa7eab80677c5d92e6de343a2b618004ddc`。
- [results.json](../20261029-line-edit-all-engines-linux-candidate-1/results.json) — SHA-256 `dec3bc014343c20d3dfcf78f23a246cf81b7f111e4c07661eb98559eb2559569`。
- [matrix.json](../20261029-line-edit-all-engines-linux-candidate-1/matrix.json) — SHA-256 `bd924f920acdfdcca2af2c8876f814c43a69f981e0c7730f77ac0cb8d3505cd3`。
- [linux-environment.txt](../20261029-line-edit-all-engines-linux-candidate-1/linux-environment.txt) — SHA-256 `accc26f67279cd89fba68612fad7af5b08361b1d678e110cb7fdd6384128b324`。
- [reviews-apple.json](../20261029-line-edit-all-engines-linux-candidate-1/reviews-apple.json) — SHA-256 `9efce7015b77a09dee252de0a3fc39bdc81a97c1dba20b94c3d9309c67d81317`；明确绑定已看原图 186。
- [reviews-md3.json](../20261029-line-edit-all-engines-linux-candidate-1/reviews-md3.json) — SHA-256 `9865f83847fb971c6683aa9de09f48cf0325d2bed06bda2289ecc9aa5c71d033`；明确绑定已看原图 186。
- [reviews-shadcn.json](../20261029-line-edit-all-engines-linux-candidate-1/reviews-shadcn.json) — SHA-256 `11163f899f03f8b064555cf34241a8a7175d37511c6706506db3780468a36b93`；明确绑定已看原图 186。

### checkbox-windows-2

[原报告](../20261029-checkbox-full-windows-2/README.md)：第二轮 Windows Chromium 候选；FF/WebKit/Linux 尚无本索引引用的完整包验收。

原生计划 337 项；实际状态 `{"passed":337}`；有记录的 attempt 337；原图 336，字节 SHA 匹配 336，可从逐图复审记录明确绑定 336。未绑定的 0 张保持待确认，不以自动结果补齐。

源码指纹：`sha256:2eccc74e9526d65ff758563fe29c3ab605a43cb9e782830e31abbc17a15f4ec7`。资产指纹：`sha256:f545945a259e76a3cbb7fd6c42b29d431f00ac4a92e500600a96e0256cf6ef82`。

- [cases.json](../20261029-checkbox-full-windows-2/cases.json) — SHA-256 `54c0464e7c0ee9da70ba050dab6bc8e442e2cf0b7e9ad48427d60ace37750615`。
- [results.json](../20261029-checkbox-full-windows-2/results.json) — SHA-256 `319a6a668201605dbd0c8b10f5deb856b8a33b371b0fa2eb5b8c070ffe79d202`。
- [matrix.json](../20261029-checkbox-full-windows-2/matrix.json) — SHA-256 `4547f59c4164fdf8907ca184b22f7a27a3faa5f9a8604fc755eee85f155739b9`。
- [execution-audit.json](../20261029-checkbox-full-windows-2/execution-audit.json) — SHA-256 `7194e9d77b2c5dcbeaee01d2c3970fcec95db9feac794b72bf9c75ff0dddb665`。
- [reviews-apple.json](../20261029-checkbox-full-windows-2/reviews-apple.json) — SHA-256 `0a4b4d8dd72a1872033f89aa396ad4a00096de25d9ba855ee4b46502928aecd6`；明确绑定已看原图 112。
- [reviews-md3.json](../20261029-checkbox-full-windows-2/reviews-md3.json) — SHA-256 `2d0ee085578f85f78a3fe411d57ff1f142da1618ba4bade90c5d233517ace489`；明确绑定已看原图 112。
- [reviews-shadcn.json](../20261029-checkbox-full-windows-2/reviews-shadcn.json) — SHA-256 `dd45bdf9935215e6583ad2c11c17e41deac08b9b6ff275b9f5a970727c1dcfbf`；明确绑定已看原图 112。

### radio-windows-1

[原报告](../20261029-radio-full-windows-1/README.md)：Windows Chromium 候选；FF/WebKit/Linux 尚无本索引引用的完整包验收。

原生计划 283 项；实际状态 `{"passed":283}`；有记录的 attempt 283；原图 282，字节 SHA 匹配 282，可从逐图复审记录明确绑定 282。未绑定的 0 张保持待确认，不以自动结果补齐。

源码指纹：`sha256:9daf44b0af28600a9ca6a1eda4756b850b5aeab0c8d7c1d14c35f2a1eb7070ce`。资产指纹：`sha256:20443e4d84be8d1f47a655910cf136f8040f69d7fe1a3414def821b75e2135e7`。

- [cases.json](../20261029-radio-full-windows-1/cases.json) — SHA-256 `8d49bd6aaebd185cb1cf73f30435db6493653a14f53b166a411ed218cb33ba0b`。
- [results.json](../20261029-radio-full-windows-1/results.json) — SHA-256 `2ce9bacc3f744c443c9311408900641aaf65702480bbec8e47129e6a31c65f50`。
- [matrix.json](../20261029-radio-full-windows-1/matrix.json) — SHA-256 `5acb24ed4839a16e4ceac0953e31549ccb7f549198d953b2b301d1f266fdd77e`。
- [execution-audit.json](../20261029-radio-full-windows-1/execution-audit.json) — SHA-256 `541be8f7b2377fcae6a1eb51e1f49506526252a698e8cc8119a12a987d532b49`。
- [reviews-apple.json](../20261029-radio-full-windows-1/reviews-apple.json) — SHA-256 `2e5a9aa970e29c7539663cd704845965d76fa7c428a9c621c7dbb09ba795fa67`；明确绑定已看原图 94。
- [reviews-md3.json](../20261029-radio-full-windows-1/reviews-md3.json) — SHA-256 `42b62f13f167d2a83c26120be487118e24adf2754c2a2109c005498ee862d1ea`；明确绑定已看原图 94。
- [reviews-shadcn.json](../20261029-radio-full-windows-1/reviews-shadcn.json) — SHA-256 `3493046a3d10c8be2e63a888c5a6def7da478e1491d7115d3df1214a0c03b3d9`；明确绑定已看原图 94。

### switch-windows-1

[原报告](../20261029-switch-full-windows-1/README.md)：35 失败、1 中断、其余未运行；helper 修正后的候选待跑，本失败不能计为通过。

原生计划 283 项；实际状态 `{"not-run":247,"failed":35,"interrupted":1}`；有记录的 attempt 36；原图 72，字节 SHA 匹配 72，可从逐图复审记录明确绑定 0。未绑定的 72 张保持待确认，不以自动结果补齐。

源码指纹：`sha256:176fe602d97252447b1f8b343cb0d5224f48f01673de73419f1d73cf0cb037f1`。资产指纹：`sha256:69831c138b2af1787c171949e9110e39041a98eaede23b565ed7d8e17c80429d`。

- [cases.json](../20261029-switch-full-windows-1/cases.json) — SHA-256 `0dbd0f010b54ea8a71236ee95746616decf5109f27687dda8b5279e65ea7674d`。
- [results.json](../20261029-switch-full-windows-1/results.json) — SHA-256 `69a80d8f1206b843d8239fb73eda6500f244fc13e6cef8049673214eb4e2b170`。
- [matrix.json](../20261029-switch-full-windows-1/matrix.json) — SHA-256 `be31e444b1f4f6950c939cb196fad03b0b417c713dd6d6af86cb4a5ab795eae2`。
- [execution-audit.json](../20261029-switch-full-windows-1/execution-audit.json) — SHA-256 `166b28fc25726864156d55fbb1d31570bd2de62d75dbfffce5b7e0a08d718bda`。

### button-linux-2-historical

[原报告](../20261029-button-all-appearances-linux-2/README.md)：旧源 Chromium 候选 330/336 通过；六项失败与后续修复分开保留，当前源需重跑。

原生计划 336 项；实际状态 `{"failed":6,"passed":330}`；有记录的 attempt 336；原图 703，字节 SHA 匹配 703，可从逐图复审记录明确绑定 703。未绑定的 0 张保持待确认，不以自动结果补齐。

源码指纹：`sha256:f34f3b7a2a099b93ccd650e361c98ac2a61cdfc7261d5a0cc0d18a6db1d50002`。资产指纹：`sha256:32a4c6295a80d52f8c8f94cf18b1f44a32e420af48251783f4082313d4796f68`。

- [cases.json](../20261029-button-all-appearances-linux-2/cases.json) — SHA-256 `6f5db0c3718990c32fe6826ceb0b0918ea0bf587b0d3974c9ee4e62d9fd7d218`。
- [results.json](../20261029-button-all-appearances-linux-2/results.json) — SHA-256 `da7a1a8569677d7c1fe81eb7a00c5dd526ff6832ad2fba1f7dc1db4ff0d57754`。
- [matrix.json](../20261029-button-all-appearances-linux-2/matrix.json) — SHA-256 `86e25bec7e71b264a26e8bbeed2d82b7f8061c45b19f6d2f4ab2d2abfc7a6997`。
- [linux-environment.txt](../20261029-button-all-appearances-linux-2/linux-environment.txt) — SHA-256 `eb57b465fbf8ac6179345f4ef9786c473a3c514daa099e5ac29691f38c6fb71a`。
- [reviews-apple.json](../20261029-button-all-appearances-linux-2/reviews-apple.json) — SHA-256 `3f1c45bd3cb282837b02edede56e17472afbce50030f88f3ae6720549412a7ef`；明确绑定已看原图 234。
- [reviews-md3.json](../20261029-button-all-appearances-linux-2/reviews-md3.json) — SHA-256 `2829fa739ba3c8812836270c66b06fac26e3ac16a8e414009a5f53943dc821f1`；明确绑定已看原图 235。
- [reviews-motion-recordings.json](../20261029-button-all-appearances-linux-2/reviews-motion-recordings.json) — SHA-256 `3f198c57accbec1c69f94883bc6c3cbca67b73d9d37c335d34e7425dc7b3be5b`；明确绑定已看原图 0。
- [reviews-shadcn.json](../20261029-button-all-appearances-linux-2/reviews-shadcn.json) — SHA-256 `999bfdb845cd2f0e288193b67ce08c403b7fa8ae8b201cd60de0e7e5e6152b65`；明确绑定已看原图 234。

### config-provider-linux-1-historical

[原报告](../20261029-config-boundaries-linux-1/README.md)：旧源三引擎候选 366 项通过且全图复审；后续共享/触控变更需新源重跑。

原生计划 366 项；实际状态 `{"passed":366}`；有记录的 attempt 366；原图 366，字节 SHA 匹配 366，可从逐图复审记录明确绑定 366。未绑定的 0 张保持待确认，不以自动结果补齐。

源码指纹：`sha256:0e6258b9cb4ee540876e2a893c5ef3c819977f8b06cf2d11615275501a17a3fa`。资产指纹：`sha256:f8ab859af14b8b2dee4d8cafa5f24bc2a34a7b06ca7895848644c37025dbab8a`。

- [cases.json](../20261029-config-boundaries-linux-1/cases.json) — SHA-256 `134dad7596c776c86950eb3f23894fef5f822acaf70b91a21d81c4043269468b`。
- [results.json](../20261029-config-boundaries-linux-1/results.json) — SHA-256 `ae292d08aebeb8e3d36b36ea070f158d00e53a03a2be0182c1626c992be35cae`。
- [matrix.json](../20261029-config-boundaries-linux-1/matrix.json) — SHA-256 `93e7d19efa97ece65cb86cb464983adcb70ed879339a830193ec6a6bd4648567`。
- [linux-environment.txt](../20261029-config-boundaries-linux-1/linux-environment.txt) — SHA-256 `fe407277e3b056ade858b1261199f98c24db115ca5b3502731e60d63ec8a891c`。
- [reviews-config-boundaries.json](../20261029-config-boundaries-linux-1/reviews-config-boundaries.json) — SHA-256 `dd18aeff5ef6e4cc88f7dfde56deed8f219875a3e4c8e3d25040b77962c278ac`；明确绑定已看原图 366。

### inventory-linux-1-v2-historical

[原报告](../20261029-inventory-linux-1-v2/README.md)：历史 900 项默认 Demo 视口库存；不证明状态/尺寸矩阵或后续源码，不能计入当前组件矩阵通过。

原生计划 900 项；实际状态 `{"passed":900}`；有记录的 attempt 900；原图 900，字节 SHA 匹配 900，可从逐图复审记录明确绑定 900。未绑定的 0 张保持待确认，不以自动结果补齐。

源码指纹：`sha256:534445b00b1ed14ed75191f408df3bb8ecd81a438390eede24d923e5dc4c52d8`。资产指纹：`sha256:f41393b2474f34fd3aec15ca962eca71583239c52916ca92f388eda6617e13bd`。

- [cases.json](../20261029-inventory-linux-1-v2/cases.json) — SHA-256 `8338009311df77532eb1b8ed9b441bb0715024ba90aa140c474ef8d1a5ed814a`。
- [results.json](../20261029-inventory-linux-1-v2/results.json) — SHA-256 `fd6587546d56e42590d64dba74e25db50631181a7da309014aaf5f386f726eee`。
- [matrix.json](../20261029-inventory-linux-1-v2/matrix.json) — SHA-256 `9db2876f565657b3a8661e8bf599ecf3e2a5e942ca1ba3b8ed1e492833dbd105`。
- [linux-environment.txt](../20261029-inventory-linux-1-v2/linux-environment.txt) — SHA-256 `9aea54083816db648a9744874511b28c00db964bfb97b421284d645a926f8095`。
- [reviews-data-layout.json](../20261029-inventory-linux-1-v2/reviews-data-layout.json) — SHA-256 `f6c88e296b43ce8409fee7095877a8a38542e64c8a65dabe913308e0ef0fcc72`；明确绑定已看原图 126。
- [reviews-display-feedback.json](../20261029-inventory-linux-1-v2/reviews-display-feedback.json) — SHA-256 `e6d10dbe9f65f1116a0cdfb04f9e59c1bc49b893f744ed53e18e23d292ade7c0`；明确绑定已看原图 162。
- [reviews-forms-navigation.json](../20261029-inventory-linux-1-v2/reviews-forms-navigation.json) — SHA-256 `16a064c370317f25b459d9363320d5758930539c7d0bb957c351a9a46112d5ec`；明确绑定已看原图 126。
- [reviews-foundation.json](../20261029-inventory-linux-1-v2/reviews-foundation.json) — SHA-256 `4bf900b609b5ff24ad5683dc2c4e0249dcb596d71c4e76986ed869e9053099f0`；明确绑定已看原图 144。
- [reviews-input-components.json](../20261029-inventory-linux-1-v2/reviews-input-components.json) — SHA-256 `bf3e2e4e3c2a9462970cec860a2f618a9b7d0598754accbf56c96010370dd08e`；明确绑定已看原图 144。
- [reviews-professional.json](../20261029-inventory-linux-1-v2/reviews-professional.json) — SHA-256 `795e2d54368cc515f1675d53de92c759cd5b543c9ad05ab2c3e5aabeb2a9245f`；明确绑定已看原图 72。
- [reviews-selection-overlays.json](../20261029-inventory-linux-1-v2/reviews-selection-overlays.json) — SHA-256 `129377fed86d061d5b0d04b5f10274853ddab27a6fef4f862a62b359282a4b4d`；明确绑定已看原图 126。

## 使用边界

已看原图数量来自现有复审逐图标记；本次仅重新校验其路径/hash 与原始 case 索引相符，未重新宣称逐图人工验收。旧 Button、ConfigProvider 和默认库存均作为历史资料，不能证明当前源码。Switch 失败、中断和未运行均单列，不能计为通过。其他组件即使规格、Demo 和场景齐备，自动检查与外观复审仍待实际执行。

规格/证据审计问题：未发现缺失规格、规格引用错误或原图哈希不一致。
