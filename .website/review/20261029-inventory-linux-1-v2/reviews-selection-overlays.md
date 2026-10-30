# 选择、导航与浮层默认库存复审

复审记录时间：2026-10-29 09:29:08 UTC。实际逐项使用 `view_image` 查看七包共126张原始PNG（每包18张：三引擎×三体系×浅深色）；没有使用拼图、替代图或生成图。逐案ID、图片SHA-256、结论、问题和未验证范围见 [reviews-selection-overlays.json](reviews-selection-overlays.json)。

126张图片的实际SHA-256均与 `cases.json` 及各案 `inventory-scope.sha256` 一致。九个worker的before/after source和artifact指纹均稳定；126案的candidate-inputs与对应worker匹配。索引和worker文件本身的哈希也记录在JSON中。

- source：`sha256:534445b00b1ed14ed75191f408df3bb8ecd81a438390eede24d923e5dc4c52d8`
- artifact：`sha256:f41393b2474f34fd3aec15ca962eca71583239c52916ca92f388eda6617e13bd`
- 实际环境记录：[linux-environment.txt](linux-environment.txt)。该文件记录Node v24.22.1、Yarn 4.18.0及Linux/字体清单。

| 包 | 已实际查看 | 默认图结论 |
| --- | ---: | --- |
| rc-select | 18 | 可见默认部分未见明显缺陷；完整矩阵仍待验收 |
| rc-color-picker | 18 | 可见默认部分未见明显缺陷；完整矩阵仍待验收 |
| rc-dialog | 18 | 仅触发器/输入框；展开本体保持 pending |
| rc-drawer | 18 | 仅触发器/输入框；展开本体保持 pending |
| rc-dropdown-container | 18 | 仅触发器/输入框；展开本体保持 pending |
| rc-tooltip | 18 | 仅触发器/输入框；展开本体保持 pending |
| rc-menu | 18 | 可见默认部分未见明显缺陷；完整矩阵仍待验收 |

54张Select、ColorPicker和Menu默认图的可见部分未见明显缺字、遮挡、越界或截断。该结论仅适用于可见默认部分，不替代几何、焦点、交互、对比度测量或全尺寸/密度/状态矩阵。

Dialog、Drawer、DropdownContainer和Tooltip的72张图只显示打开按钮或闭合输入框，没有展示模态、抽屉、popover或tooltip本体。因此虽然已逐图查看，这四包的展开视觉仍为pending。Select和ColorPicker同样未展开面板；Menu只展示垂直默认首分支展开状态，没有选中、焦点、水平/折叠及浮动子菜单。

## 已反馈的问题

`rc-dropdown-container/docs/demos/base.demo.tsx` 的外置标签“浮层触发输入框”末字与输入边框几乎零间距紧贴，三引擎三体系浅深色的18图均可见。记为一项轻微Demo布局问题（`demo-label-gap`），建议在下一候选使用语义间距后重新采集；当前没有改产品、Demo或历史图片。该现象不能证明展开浮层定位有问题。

## 仍待验收

- 所有包完整状态、公开尺寸、适用密度与环境扩展矩阵；真实200%缩放和自然动效证据。
- Dialog/Drawer本体、遮罩、标题、操作区、长内容及焦点环。
- Select选项、ColorPicker面板/嵌套格式Portal、DropdownContainer和Tooltip展开外观。
- Menu选中与焦点、水平/折叠模式、浮动子菜单及不同密度。
- EyeDropper原生系统交互、跨Document、iframe/Shadow DOM及其他行为证据不能由默认PNG推断。

本复审未批准baseline，未提升任何设计覆盖或生命周期。900项原生自动检查通过与本组126张实际图片复审分开记录；未查看的其他组件图片不在本组结论内。
