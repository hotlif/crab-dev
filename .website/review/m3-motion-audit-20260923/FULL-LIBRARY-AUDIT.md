# 全组件动效复查

日期：2026-09-23。本次为审查，未修改组件实现、配色、布局或用户的系统/浏览器偏好。

## 结论与直接原因

当前 Chrome 将 `prefers-reduced-motion: reduce` 报告为 `true`。用户正在查看的 Form 页面，以及另开的 Drawer 页面，按钮计算样式均为 `transition: none`；Drawer 面板也是 `transition: none`。文档站的 [siteStyles.ts:273](C:/Users/zhang/Desktop/crab-dev/.website/docs/site/siteStyles.ts:273) 在这个条件下，对文档区后代统一设置 `animation: none !important; transition: none !important`。组件自身也有相应降级规则。

同一开发站在独立预览浏览器中报告 `reduce = false`，Button、Drawer、Switch、Tabs、Dialog 都能读取到过渡或运动中的中间值。因此，大面积静态效果的直接原因已经确认，不能据此认定全库没有实现动效。尚未确认 Chrome 的偏好来自 Windows 设置、浏览器启动配置还是 DevTools 模拟；本轮没有替用户改变这些设置。

`prefers-reduced-motion` 用于响应减少非必要运动的偏好，移除大幅位移是合理行为；轻微透明度反馈可以作为替代，并非必须把所有反馈都禁用。[MDN 说明与示例](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)

## 范围与方法

- 扫描 `components/` 下全部 54 个包、408 份非测试、非生成的 `src` 文件，检查 CSS transition / animation、WAAPI、requestAnimationFrame、组件复用、退出保留与 reduced motion。逐文件线索见 [library-inventory.json](C:/Users/zhang/Desktop/crab-dev/.website/review/m3-motion-audit-20260923/library-inventory.json)。该文件是检索索引，命中数量不能当作完成度。
- 对疑点进一步阅读状态切换、条件挂载、令牌消费及动画清理代码；浏览器抽查 Button、Drawer、Switch、Tabs、Alert、Tree、Dialog、Spin，并读取用户当前 Form 页的偏好和按钮样式。
- 延续现有 M3 组件体系及 expressive motion scheme。Drawer 左右面板按 modal side sheet 理解；Tree、虚拟表格、内联 Alert 是项目扩展，不能把体验建议表述成官方逐项强制要求。AppMainLayout 保留用户要求的 Chrome 风格工作区标签。
- 本轮不是 54 个包的所有变体、主题、方向、屏幕和连续中断场景的完整运行验收，也未进行逐帧性能录制。仅新增审查文件，不运行无关组件构建或测试。

## 问题与建议

### 1. P2：站点统一降级覆盖了组件特意保留的柔和反馈

位置：[siteStyles.ts:273](C:/Users/zhang/Desktop/crab-dev/.website/docs/site/siteStyles.ts:273)、[Spin indicator.tsx:60](C:/Users/zhang/Desktop/crab-dev/components/rc-spin/src/indicator.tsx:60)。

Spin 在 reduced motion 下已将旋转改为低频透明度呼吸，但站点的 `animation: none !important` 又把呼吸覆盖掉。Chrome 的 Spin 基础示例中，加载圆环实测 `animation: none`。加载文字和 `role=status` 仍保留，丢失的是组件已经设计好的持续视觉反馈。类似的统一关闭还让所有轻微颜色过渡一并消失。

建议按组件职责降级：空间运动停掉；是否保留轻微 effects 和加载反馈由组件明确处理。站点自身导航也应有自己的规则。先补齐独立组件遗漏的降级分支，再收窄全局强制覆盖，避免删掉总开关后恢复不必要的大幅运动。可在文档预览中显示当前动效偏好，减少把降级误认为组件失效的情况；显式预览选项属于可选的文档体验优化。

证据：源码与 Chrome 实测。

### 2. P2：部分关闭交互直接卸载，已有 transition 无法播放退出过程

| 范围 | 源码行为 | 影响与建议 |
| --- | --- | --- |
| Alert | [alert.tsx:156](C:/Users/zhang/Desktop/crab-dev/components/rc-alert/src/alert.tsx:156) 在 `closed` 时立即 `return null`；现有 transition 只覆盖颜色 | 关闭后提示及占位直接消失。可增加短退出及占位收缩，关闭语义立即生效，视觉结束再卸载。 |
| AppMainLayout 标签右键菜单 | [tabBar.tsx:525](C:/Users/zhang/Desktop/crab-dev/components/rc-app-main-layout/src/tabBar.tsx:525) 清空 `menuState`；[tabContextMenu.tsx:47](C:/Users/zhang/Desktop/crab-dev/components/rc-app-main-layout/src/tabContextMenu.tsx:47) 只有入场 animation | 入场有动画、退出硬切。复用退出保留机制，保留菜单操作即时响应及已有 Chrome 标签形状。 |
| Tag 删除 | [tag.tsx:193](C:/Users/zhang/Desktop/crab-dev/components/rc-tag/src/tag.tsx:193) 只通知 `onClose`，删除通常由父组件完成 | 当前 API 没有提供退出保留流程；不能仅给 Tag 加 transition 就声称删除已平滑。需要由列表或明确的可见性协议协调，列为后续能力改进。 |

Alert 的教程关闭操作已执行，关闭后相应提示消失；没有观察到退出容器保留。右键菜单与 Tag 项为源码确认。新增动画时，不应把业务回调延后到动画完成。

### 3. P2：Tree 和 Table 的展开内容没有空间连续性

- Tree：[tree.tsx:320](C:/Users/zhang/Desktop/crab-dev/components/rc-tree/src/tree.tsx:320) 直接重建可见节点列表。普通动效模式的基础示例中，收起后节点数由 3 变为 1；节点现有过渡为背景、文字和透明度，移除前没有退出状态。箭头还有过渡，子内容已消失。
- Table：[useRowExpansion.ts:42](C:/Users/zhang/Desktop/crab-dev/components/rc-table/src/hooks/useRowExpansion.ts:42) 直接增删展开行，[table.tsx:1196](C:/Users/zhang/Desktop/crab-dev/components/rc-table/src/table.tsx:1196) 渲染详情内容；没有详情区域的进出保留或高度过渡。此项为源码确认。

建议优先为小规模展开内容提供克制的进入、退出反馈。两者都涉及虚拟布局，不能给所有虚拟行直接添加 height/transform 过渡，否则会破坏滚动定位与测量；需要设计可见区域内的展开过程并保留大数据场景的直接更新路径。这是体验改进项，M3 没有为这两个项目组件规定某个必须使用的展开动画。

### 4. P2：Drawer 已有动画，但贴边运动和定制入口需要打磨

位置：[drawer.tsx:141](C:/Users/zhang/Desktop/crab-dev/components/rc-drawer/src/drawer.tsx:141)、[Drawer token.toml:43](C:/Users/zhang/Desktop/crab-dev/components/rc-drawer/token.toml:43)、[语义动效令牌:266](C:/Users/zhang/Desktop/crab-dev/components/rc-token-semantic/token.toml:266)。

- 当前面板滑入为 500ms expressive default spatial，退出为 350ms expressive fast spatial，遮罩为 200ms effects。时间不同本身不构成缺陷，实际节奏仍应配合面板运动。
- 贴边面板使用会越过终点的曲线；独立预览中右侧 420px 面板曾采样到 `translate: -0.0548966%`，确实越过零点后回位。该样本不是最大过冲值。贴边元素短暂离开锚定边缘，会呈现不必要的弹回感。
- `panel.animation-duration` / `panel.animation-timing-function` 及其 `--drawer-transition-duration` / `--drawer-transition-easing` 仍在令牌定义中，却没有被 Drawer 源码消费；实际使用的是 `motion.expand/exit.transition`。修改旧入口不会影响现有动画。
- 锚定使用逻辑方向、平移使用物理正负方向，RTL 下有方向不一致的源码风险，尚未做 RTL 运行复现，应在修改 Drawer 时一并验证。

建议为贴边面板选择稳妥的运动路径，验证四方向、进出过程、快速反向与遮罩配合，并明确旧定制变量的兼容关系。不要重设抽屉颜色、宽度或整体外观。现有曲线来自官方 Web 转换表，问题是具体场景的应用，不能把曲线本身称为错误参数。[M3 Motion Specs](https://m3.material.io/styles/motion/overview/specs)、[Side sheets Guidelines](https://m3.material.io/components/side-sheets/guidelines)

### 5. P2：独立组件的减少动态效果和中途停止策略不完整

| 位置 | 已确认的源码缺口 | 建议 |
| --- | --- | --- |
| [Masonry masonry.tsx:21](C:/Users/zhang/Desktop/crab-dev/components/rc-masonry/src/masonry.tsx:21) | 重排有 transform 过渡，组件没有 reduced motion 分支 | 独立使用也应直接到达最终布局；不能依赖文档站样式兜底。 |
| [Menu icon.tsx:11](C:/Users/zhang/Desktop/crab-dev/components/rc-menu/src/icon.tsx:11) | 箭头伪元素写死 300ms，未处理 reduced motion；父项关闭 transition 不会传递给伪元素 | 补全箭头自身的降级，并接入动效令牌。 |
| [BarChart useBarTransition.ts:158](C:/Users/zhang/Desktop/crab-dev/components/rc-bar-chart/src/hooks/useBarTransition.ts:158) 与 [useCategoryDim.ts:45](C:/Users/zhang/Desktop/crab-dev/components/rc-bar-chart/src/hooks/useCategoryDim.ts:45) | 只在初始化/更新时读取媒体偏好，没有监听 change；目标签名去重还发生在检查 `animate=false` 之前 | 动画中关闭 animate、且目标数据未变时，当前 rAF 不会立即停止；动态开启 reduced motion 也没有主动收尾路径。应先处理停止/降级，再做目标去重。 |

这些是源码确认项；本轮没有修改系统设置来逐项运行复现。尝试打开 Masonry 独立工作台时，直达示例未得到可测量的内容，因此不把该尝试算作浏览器通过。

### 6. P3：动效令牌和局部细节仍不统一

- [Drawer 关闭按钮:264](C:/Users/zhang/Desktop/crab-dev/components/rc-drawer/src/drawer.tsx:264)、[Select 箭头:224](C:/Users/zhang/Desktop/crab-dev/components/rc-select/src/selectInput.tsx:224)、[TablePro 列管理:45](C:/Users/zhang/Desktop/crab-dev/components/rc-table-pro/src/hooks/useColumnManagement.tsx:45) 等仍使用局部固定时长/曲线。
- [Tree 箭头:78](C:/Users/zhang/Desktop/crab-dev/components/rc-tree/src/nodeItem.tsx:78) 将旋转和颜色共用 effects 角色；应分别映射几何与颜色用途。
- Form 状态图标直接切换，但已有固定占位、校验中 Spin 和消息 Tooltip，不属于完全无反馈；图标淡变可作为细节优化。
- DatePicker 月份、Tabs 内容、教程步骤主要直接替换内容。可以按场景补充轻微反馈，但不要求所有内容区都滑动，不应为淡入同时运行两份带副作用的示例。

## 全包覆盖表

“已有”表示存在实现线索及对应代码核对，不等于本轮验证了该包所有状态。组合组件复用子组件动效，无须重复实现动画。

| 包（省略 rc-） | 本轮结论 |
| --- | --- |
| alert | 有颜色过渡；关闭立即卸载，见问题 2。 |
| app-main-layout | 有标签拖拽、侧栏、头像菜单动效；标签右键菜单退出缺口，见问题 2。 |
| auto-sizer | 尺寸测量基础能力，不要求独立装饰动画。 |
| avatar | 有状态、阴影及组内交互过渡。 |
| badge | 有颜色/状态过渡和状态点脉冲；计数直接更新可后续打磨。 |
| bar-chart | 有 rAF 柱形生长、数据补间及聚焦淡化；停止策略见问题 5。 |
| breadcrumbs | 有交互颜色过渡，部分操作复用基础组件。 |
| button | 有状态层、颜色、圆角和阴影过渡；普通模式浏览器确认。 |
| canvas | 有渲染循环、动态虚线及媒体偏好监听，并非没有动画。 |
| card | 有表面、状态层、封面交互，loading 复用 Skeleton。 |
| checkbox | 有框体、勾选图形和状态层过渡。 |
| color-picker | 复用 DropdownContainer、Button、LineEdit、Slider 等，不能按自身 CSS 零命中判缺失。 |
| component-preview | 有源码区展开/收起及交互过渡。 |
| config-provider | 配置基础能力，不要求独立动画。 |
| cron-picker | 复用下拉、Tabs、输入和选择控件，也有局部 opacity 过渡。 |
| date-picker | 有浮层、输入、日期状态过渡；月份内容切换可后续打磨。 |
| dialog | 有遮罩淡变、内容位移、退出保留；普通模式浏览器确认。 |
| divider | 静态分隔，无须强加动画。 |
| drawer | 有进出场；当前 Chrome 降级关闭，普通模式路径及旧令牌问题见问题 4。 |
| dropdown-container | 有 opacity/translate、starting-style 和退出保留。 |
| empty | 静态空态，不要求插图持续运动。 |
| flow-diagram | 复用 Canvas 动态连线等能力；节点直接操控应即时响应。 |
| form | 复用输入组件、Spin、Tooltip；状态图标本体直接切换。 |
| hooks | 提供 usePresence/useMediaQuery 等支持能力，不是可视组件。 |
| line-edit | 有边框/状态及浮动标签过渡。 |
| masonry | 有位置重排过渡，独立 reduced motion 缺口见问题 5。 |
| menu | 有状态、子菜单展开和浮层；箭头独立降级缺口见问题 5。 |
| message | 有提示进出位移/透明度、退出保留及加载反馈。 |
| notification | 有方向相关进出位移、透明度和退出保留。 |
| number-edit | 复用 LineEdit、Button，已有基础交互过渡。 |
| pagination | 有页码、按钮和输入交互过渡，局部时长尚未完全令牌化。 |
| pdf-editor | 复用输入、按钮、弹层、加载、树和画布能力；不是自身 CSS 零命中就无动效。 |
| prose | 有链接颜色过渡；静态正文无须统一入场。 |
| radio | 有圆点、边框和状态层过渡。 |
| realm | 有内容淡入，等待/错误复用 Spin / Alert / Button。 |
| router | 路由基础能力；不要求导航时强制全页面滑动。 |
| segmented | 有背景、颜色和状态层过渡；不应套用 Tabs 滑动下划线。 |
| select | 有浮层、浮动标签、选项状态和箭头过渡；多选删除依赖 Tag/列表。 |
| skeleton | 有 pulse / wave 和降级处理。 |
| slider | 有手柄尺寸/状态反馈；拖动位置应及时跟手。 |
| spin | 有旋转、入场、内容淡化及 Expressive 变体；站点覆盖柔和降级反馈，见问题 1。 |
| split-pane | 分隔条有状态过渡；拖动尺寸不需要额外延迟追赶。 |
| switch | 有滑块位移、缩放和颜色过渡；浏览器采样到中间值。 |
| table | 有行状态、箭头和编辑反馈；展开内容硬切，见问题 3。 |
| table-pro | 复用 Table 及输入/菜单等组件，局部列管理过渡未统一。 |
| tabs | 指示器已有 WAAPI 连续移动及中断处理，本次浏览器仍可读到中间 transform。 |
| tag | 有颜色/选中状态过渡；父级移除的生命周期缺口见问题 2。 |
| text-edit | 有状态和浮动标签过渡。 |
| theme | 主题基础能力；不要求全页面统一颜色渐变。 |
| token-global | 已有 duration / easing 基元及 Expressive Web 曲线。 |
| token-semantic | 已有 spatial/effects 分档与用途角色。 |
| tooltip | 有透明度进出场及退出保留。 |
| tree | 有行状态和箭头过渡，子节点增删硬切，见问题 3。 |
| virtual | 有滚动条淡变；虚拟项随滚动复用时不应反复播放入场。 |

## 浏览器证据摘要

| 场景 | 观测 |
| --- | --- |
| 用户 Chrome Form 页面 | reduce=true；“读取表单”按钮 transition=none。 |
| Chrome Drawer 页面 | reduce=true；触发按钮、右侧面板 transition=none。 |
| 独立预览 Button | reduce=false；状态 effects 150ms，圆角 spatial 350ms。 |
| 独立预览 Drawer | 位移 500ms；420px 面板采样到负 translate，证明经过终点后回位。 |
| 独立预览 Switch | 位移/缩放 350ms、颜色 150ms；切换后滑块采样 translate≈-0.200059px、scale≈0.663333。 |
| 独立预览 Tabs | 选中“活动”后指示线采样 transform matrix 的 x 偏移≈0.643256px，已有运动。 |
| 独立预览 Alert | 教程中关闭对应提示后，从可见提示列表移除；源码没有退出保留。 |
| 独立预览 Tree | 基础示例收起，treeitem 数量 3→1；另一示例仍为 3。 |
| 独立预览 Dialog | 遮罩 opacity 200ms；内容 opacity 200ms、translate 350ms，采样到非零位移。 |
| Chrome Spin 页面 | reduce=true；加载圆环 animation=none，组件定义的低频呼吸被站点覆盖。 |

以上为计算样式、DOM 和少量中间几何采样，不能用来推断完整帧率或最大过冲。当前视口为 Chrome 1920×855、独立预览 1280×720；未重新执行全部主题与窄屏矩阵。

## 修复顺序

1. 明确当前 Chrome 动效偏好来源，文档页提供可理解的状态；按组件收窄站点的统一覆盖。
2. 处理 Alert / 右键菜单退出，以及 Drawer 的贴边运动与定制入口。
3. 为 Tree / Table 展开设计兼容虚拟布局的反馈；补全独立组件降级和 rAF 中途停止。
4. 统一零散动效令牌，再打磨图标、月份、内容替换等可选细节。

整个过程应保持现有颜色、布局与 Chrome 风格标签外形。所有组件统一增加弹跳、统一延长时长或直接移除 reduced motion 规则，都不能解决本轮发现的不同原因。

## 参考与核对边界

访问日期均为 2026-09-23。

- [M3 Motion Specs / Web 转换表](https://m3.material.io/styles/motion/overview/specs)：通过真实浏览器读取；现有 expressive spatial/effects 曲线与表中参数一致。当前使用 CSS 曲线/WAAPI 近似，没有因此获得真实弹簧的中断速度连续性保证。
- [Side sheets Guidelines](https://m3.material.io/components/side-sheets/guidelines)、[Specs](https://m3.material.io/components/side-sheets/specs)、[Accessibility](https://m3.material.io/components/side-sheets/accessibility)：读取 modal / standard 区别、边缘位置、RTL、模态语义与关闭要求。Material Web 未找到可直接对照的 Side Sheet 实现；上下方向 Drawer 是项目扩展，本轮不作这两种方向的全面 M3 对齐声明。
- [Material Web Dialog 文档](https://material-web.dev/components/dialog/)、[行为源码](https://github.com/material-components/material-web/blob/main/dialog/internal/dialog.ts)、[样式](https://github.com/material-components/material-web/blob/main/dialog/internal/_dialog.scss)、[令牌](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-dialog.scss)：本次读取 main 页面快照；令牌文件引用 `versions/v0_192/md-comp-dialog`，并非 Expressive 全组件实现。源码确认分别提供打开/关闭动画及动画结束的生命周期。
- [Material Web Tabs 文档](https://material-web.dev/components/tabs/)、[Tab 行为源码](https://github.com/material-components/material-web/blob/main/tabs/internal/tab.ts)：保留前后指示器矩形到平移/缩放的参考，不把其中 250ms 时长强行套到本项目 Expressive 令牌上。
- [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)：浏览器偏好解释与替代反馈。未因默认开启该偏好而判定用户设置有误。

本轮没有逐一重放全部 Material Web 官方组件示例，部分固定提交 URL 的抓取失败后使用了 main 页面；因此报告提供的是全库动效线索审查与重点运行证据，不宣称全库视觉/交互已通过 M3 合规验收。
