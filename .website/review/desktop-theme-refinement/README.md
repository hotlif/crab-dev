# 三主题视觉精修与 MD3 桌面紧凑化

本轮实现与本地验证已完成。默认库存、专项矩阵、视觉抽查和像素基线分别记录，不升级产品清单中缺少完整证据的设计覆盖状态。用户已有的 component-theme-audit/pixel-ci.md 改动保持不动。

视觉复核由本次助手查看实际浏览器截图完成，与自动断言结果分开记录。

## 实现

MD3 继承尺寸按钮 32/36/40px，单行字段 32/40/48px，Tab 32/36/40px；外置标签 14/20px，间距 4px。Outlined 使用连续边框，Filled 保留色调表面和状态底线。TextEdit 内边距及最小高度跟随三档，rows/autoSize 继续决定实际内容高度。

默认 Switch 轨道 40×24px、桌面布局最小高度 36px；Apple/shadcn 的原桌面布局预留由主题映射恢复。Dialog 内边距 20px，标题 20/28px。粗指针按钮在布局中预留至少 48px，避免相邻命中重叠。

修复三主题 Select 标签扣除内部操作位而过早省略、禁用描边角色，以及继承尺寸图标按钮的内边距覆盖。移除 LineEdit 的标签测量与 MD3 专属定位，保持实际输入节点。

## 三主题前后对照

每张图按 MD3、Apple、shadcn 分列，浅色修改前/后、深色修改前/后分行。每组前后使用相同裁切区域和比例，没有分别放大较小控件。截图来自同一固定 Linux 镜像、Chromium 156.0.8078.4 和字体环境，前后各 300 项采集均通过；全部工作进程的输入在采集期间保持不变。详见[环境与输入指纹](./comparison/evidence.json)。

| 对照 | 预期变化与复核结果 |
| --- | --- |
| [LineEdit](./comparison/rc-line-edit.png) | MD3 标签外置、无缺口边框、40px 默认控件；Apple/shadcn 保留原比例。 |
| [TextEdit](./comparison/rc-text-edit.png) | MD3 标签移出填充表面、内边距收紧；内容行数和正文大小保留。 |
| [Select](./comparison/rc-select.png) | MD3 标签与占位文字同时可见，Filled 保留底线；三主题标签可使用完整字段宽度。 |
| [Form](./comparison/rc-form.png) | 外置标签和必填标记正确关联；默认 MD3 提交动作收紧至 36px。 |
| [Button](./comparison/rc-button.png) | 此默认 Demo 显式指定尺寸，规格保持不变；继承配置的变化见 Form 和实际尺寸断言。 |
| [Switch](./comparison/rc-switch.png) | MD3 默认轨道由 52×32 收紧至 40×24；Apple/shadcn 的轨道和布局预留保留。 |
| [Tabs](./comparison/rc-tabs.png) | MD3 默认高度由 48 收紧至 36px，指示条与文字对齐。 |
| [DatePicker](./comparison/rc-date-picker.png) | 日期字段采用外置标签，图标和输入文字在较小控件内居中。 |
| [NumberEdit](./comparison/rc-number-edit.png) | 外置标签、数值与增减动作对齐；说明保留。 |
| [Dialog 展开态](./comparison/rc-dialog.png) | MD3 标题和容器内边距收紧，关闭目标、正文与底部动作保留空间；Apple/shadcn 保持原视觉层级。 |

整个字段的高度包括外置标签、4px 间距和说明。控件本体变矮不意味着整组字段总高度等比例缩小。迁移指南要求移除围绕旧 56px 几何的固定总高度和浮动标签自定义样式。

[实际边界测量](./geometry-measurements.json)包含三主题、浅深色、三档尺寸的 54 条 LineEdit/Switch 默认状态记录。MD3 的 outlined 与 filled 字段本体均实测为 32/40/48px，输入行高 24px、标签高度 20px、标签间距 4px；默认 Switch 实测为 40×24px。该表是普通指针、standard 密度下的采样，尺寸/密度切换与触控目标由专项浏览器用例另外验证。

## 默认库存

[逐包记录](./inventory-review.json)从产品清单派生，包含 50 个可视包 × 三主题 × 浅深色，共 300 项。最终自动检查全部通过，默认视口逐项视觉复核完成。最终 261 张 PNG 与已复核首轮字节相同；另外 39 张重新查看了最终六宫格。记录包含每项 SHA-256、Demo 和浏览器版本，以及每包六宫格链接。

按基础控件、表单与选择器、导航与弹层、数据组件、编辑器及文档展示复核了文字/图标对齐、主题表面、边框和可见内容。实际修正集中在字段标签布局与宽度、Select 禁用描边、继承尺寸的图标按钮内边距，以及 MD3 Switch 桌面留白。

加载中的 Realm、Spin、Skeleton 和部分 AppMainLayout 展示会有动画相位差异。Dialog、Drawer、Tooltip、Message 等默认库存主要是触发器，不能据此声称弹层展开状态已经验收；专项场景另行记录。TablePro 与 Masonry 六宫格使用首轮完整视口裁切，六项原始 PNG 均与最终轮字节相同。

画布、流程图和 PDF 默认视口保留实际内容渲染，未缩放内容坐标或页面；表格和树的密度、虚拟行几何未改动。本轮没有为未验证的能力补写 complete。

## 验证状态

专项矩阵已完成：Chromium 6264 项，Firefox 747 项，WebKit 747 项，共 7758 个唯一用例全部通过。按浏览器、文件、用例标题合并原始轮次、组件分组、两个最终分片和定向复测，未把重复执行计入总数；详见[逐包结果及复测历史](./matrix-results.json)。首轮的 8 个失败用例均保留原始记录并已通过复测，没有未覆盖或未解决的用例。

| 组件 | Chromium | Firefox | WebKit |
| --- | ---: | ---: | ---: |
| Button | 342 | 18 | 18 |
| DatePicker | 1752 | 174 | 174 |
| Dialog | 127 | 103 | 103 |
| Form | 558 | 84 | 84 |
| LineEdit | 373 | 49 | 49 |
| NumberEdit | 463 | 48 | 48 |
| Select | 679 | 97 | 97 |
| Switch | 301 | 30 | 30 |
| Tabs | 1368 | 120 | 120 |
| TextEdit | 301 | 24 | 24 |

矩阵覆盖适用的三档尺寸、三档密度、焦点、错误、禁用、只读、加载、清除、选择、弹层与配置保持，以及窄屏、触控、长文本、RTL、真实 200% 缩放、强制颜色和减少动画。各包沿用现有适用轴及跨浏览器子集，不把不适用组合伪装成完整笛卡尔积。全部采集工作进程的输入稳定，见[输入指纹](./matrix-input-stability.json)；主动停止的轮次仅用于组件分组，后续已按用例标识补齐。

统一工程检查 `yarn check` 已完整通过，覆盖架构、令牌契约、生成物、lint、库构建、导出、独立消费、类型、单元测试、49 项登记附加检查与文档站构建。最后补充的纯文案修正另外完成公开生成、零漂移检查与 52 项生成器测试，最终站点构建包含这些修正。见[工程结果](./engineering-results.json)和[迭代记录](./iteration-log.json)。

核心组件 168 项默认尺寸/密度场景已通过。其中 36 项 Chromium medium / standard / default 场景对应 48 张原生基线，LineEdit/TextEdit 分别保存 outlined 与 filled。已逐项视觉复核、通过公开命令建立基线，并以原项目的 `maxDiffPixels: 0` 设置单独复测通过，详见[核心基线记录](./baseline-review.json)和[原生转移记录](./baseline-transfer.json)。未放宽比较设置。

原仓库没有已跟踪的像素基线，本轮只建立上述明确复核的范围。最终 PNG 中 40 张与候选图字节相同；其余 8 张只有 2–172 个边缘像素、1–5 级颜色通道差异，已重新查看最终图片，几何和内容相同，详见[候选差异记录](./baseline-candidate-diff.json)。这些候选图差异与后续通过的独立基线比较分开记录。

另对 Firefox 的 MD3 深色 Select、Dialog 和 Tabs 的 11 张环境截图作了视觉抽查，涵盖适用的窄屏、触控、RTL 与强制颜色，见[逐图记录](./environment/firefox-evidence.json)。Dialog 截图停在长内容底部；顶部文字截断反映滚动位置，底部操作仍可见。该抽查不等同于逐张审查整个状态矩阵。

Chromium 另抽查 7 张 MD3 深色环境截图：LineEdit 的强制颜色、RTL、触控和真实 200% 缩放，Switch 的触控和真实 200% 缩放，以及 Select 的真实 200% 缩放。见[字段记录](./environment/chromium-fields/chromium-evidence.json)与[选择及导航记录](./environment/chromium-navigation/chromium-evidence.json)；同目录其余采集图明确标记为仅自动检查通过，未计入视觉复核数。

最终库存对应的 975 个运行时、令牌与 Demo 文件已与当前源码核对，内容一致，见[源码一致性记录](./comparison/runtime-equivalence.json)。之后的修正仅涉及测试和文档说明。

原始本地证据目录：修改前 `.tmp/theme-before-evidence`，修改后 `.tmp/theme-after-evidence`，修改前展开 Dialog `.tmp/theme-before-dialog-evidence`。所有对照均为本轮新采集，不引用历史截图充当验收。

## 验证边界

- 50 个可视包的默认视口已逐项复核；完整状态矩阵集中于上表 10 个受影响组件，并沿用各包的适用轴。其余组件不因此获得所有交互状态或所有浏览器的视觉验收。
- 触控、强制颜色、减少动画等使用真实浏览器的对应环境配置；200% 使用浏览器实际缩放。未测试物理触屏设备、macOS/iOS 系统整合或真实 Safari；Linux WebKit 结果不替代这些环境。
- 已建立的像素基线仅限视觉复核的 48 张图。其余专项候选通过行为、几何等自动断言，不等同于新增像素基线获批。
- 本地验证及本轮截图不替代同一提交的远端 CI；本次没有远端 CI 结果。产品清单设计覆盖状态保持原值，未将未验证范围升级为 complete。
