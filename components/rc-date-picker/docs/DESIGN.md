# 日期与时间选择器设计核对

核对日期：2026-09-24。采用 M3 baseline 的 docked date picker、time picker 的 input / vertical dial 面板与 outlined / filled text field，未迁移 Expressive。按产品要求，独立时间选择器使用字段下方的非模态下拉层；M3 标准时间选择器使用模态层，因此这里明确记录为项目交互扩展。

## 时间选择器

- 独立 `TimePicker` 复用日期选择器已有的 `rc-dropdown-container`：以字段为锚点，从下方展开，空间不足时翻转、平移并限制可滚动高度。没有遮罩、页面滚动锁定或背景禁用。浮层仍是包含多个输入和操作的 `role="dialog"`，设置 `aria-modal="false"`；它不是选项列表，不使用 `listbox` 或 `menu` 语义。
- 输入模式使用 96×72 CSS px 的小时、分钟字段、45px 数字、字段下方的标签和冒号；表盘模式使用 96×80 的选择区域（24 小时为 114×80）、57px 数字和 256×256 表盘。选择手柄 48、中心点 8、指针 2。容器内边距 24、圆角 28。dp 对应 CSS px；外部字段的三档密度不缩放时间面板。下拉层沿用项目浮层的边框、阴影与退出动画。
- 颜色由 L2 / L3 令牌提供：surface-container-high 面板，surface-container-highest 数字区和表盘，primary-container / on-primary-container 的当前时间段，primary / on-primary 的表针与手柄，tertiary-container / on-tertiary-container 的 AM / PM。
- 默认打开 24 小时制表盘，`defaultMode="input"` 可改为键盘输入。12 小时制提供 AM / PM 单选语义，始终向业务传递 0–23 小时。午夜 12 AM 映射为 0，中午 12 PM 映射为 12。
- 表盘可点击、拖动，选完小时后进入分钟。时间槽复用 Button，支持原生 Enter / Space，方向键在可见刻度之间移动并同步焦点（小时步长 1、分钟步长 5），避免调整后 Enter 又选回旧数字。任意分钟可拖动或输入，输入框方向键步长为 1。输入与表盘共享草稿，切换模式后焦点移到对应时间段；非法、超范围或空输入有就近错误，并阻止确定和切换到表盘。
- 每次打开用当前受控值初始化草稿，输入变化立即更新草稿，不依赖 blur 提交；输入法组合期间的 Enter 不确认。受控值更新或隐藏秒字段时同步清理过期的校验结果。确定后触发回调；取消、Escape 或点击外部丢弃草稿。Tab 聚焦外部字段不自动展开；点击、Enter、Space 或 ↓ 打开。打开时聚焦首个时间控件；确定、取消与 Escape 恢复字段焦点。Tab 不在面板首尾循环，移出面板或 iframe 时关闭并允许焦点继续前进；点击外部也不抢回焦点。
- 宽度低于 360 或高度低于 560 时使用输入模式，避免缩小表盘；回退时恢复字段焦点，窗口扩大后保留输入模式与未完成文本，可手动切回表盘。窄屏和粗指针把 AM / PM 横向排列为 48px 高目标；这是为浏览器可用空间与触控作出的适配，M3 水平 period selector 的视觉高度为 38dp。
- 默认显示 HH:mm。为兼容现有值形状保留 `second`；隐藏时保留已有秒值，空值初始化为 0。`showSeconds` 显式启用秒输入并固定为输入模式。秒输入及 `DateTimePicker` 的日期 / 时间组合是项目扩展，不能作为 M3 独立时间选择器的标准变体。
- 日期时间组合复用同一数字输入和校验，继续保留原有日期选择层与秒精度。独立 Panel 的容器、提交与取消由消费方负责。

## 字段操作区

- 日历 / 时钟与清除共用一个固定按钮位置。按用户要求，有值且未禁用时悬停字段切换为清除，移动到图标内部不切回；键盘聚焦按钮也显示清除，无 hover 设备有值时直接显示清除。这是项目的交互选择，不是 M3 强制切换规则。
- 清除回调为 `onValueChange(null)`，并恢复字段焦点，不重新打开面板。受控用法由调用方同步更新 value。
- 外部字段的 onBlur 只转发给调用方。三种选择器的外部点击关闭均由 DropdownContainer 处理。
- 按钮尺寸读取宿主 LineEdit 的公开变量：small / middle / large 为 32 / 40 / 48 CSS px；图标 24，粗指针目标 48。较紧凑的桌面字段档位是项目密度扩展。

## 参考

M3 页面按本次查阅时的内容核对；Material Web 没有 Time picker 实现，因此时间面板以 M3 为准。此次下拉扩展参照 Material Web Menu 的锚点定位、外部点击和焦点离开处理，不套用菜单项的视觉或语义。源码查阅 `main`，未固定提交；Menu 令牌引用 `v0_192`。

- [Time pickers overview](https://m3.material.io/components/time-pickers/overview)、[guidelines](https://m3.material.io/components/time-pickers/guidelines)、[specs 与令牌模块](https://m3.material.io/components/time-pickers/specs)、[accessibility](https://m3.material.io/components/time-pickers/accessibility)
- [Material Web Menu 文档与示例](https://material-web.dev/components/menu/)、[行为源码](https://github.com/material-components/material-web/blob/main/menu/internal/menu.ts)、[定位控制器](https://github.com/material-components/material-web/blob/main/menu/internal/controllers/surfacePositionController.ts)、[样式](https://github.com/material-components/material-web/blob/main/menu/internal/_menu.scss)、[令牌](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-menu.scss)
- [Material Web Text field](https://material-web.dev/components/text-field/)、[Icon button](https://material-web.dev/components/icon-button/)、[字段行为](https://github.com/material-components/material-web/blob/main/textfield/internal/text-field.ts)、[字段样式](https://github.com/material-components/material-web/blob/main/textfield/internal/_shared.scss)、[字段令牌](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-outlined-text-field.scss)
- [Material Android TimePicker](https://github.com/material-components/material-components-android/blob/master/docs/components/TimePicker.md)（仅作平台对照，未引入依赖）
- [Date pickers guidelines](https://m3.material.io/components/date-pickers/guidelines)、[specs](https://m3.material.io/components/date-pickers/specs)、[accessibility](https://m3.material.io/components/date-pickers/accessibility)

## 验证范围

本次核对范围为独立 TimePicker 从模态层迁移到下拉层。DatePicker 包 81 项测试、lint（0 errors / 0 warnings）、typecheck、令牌生成和 library 构建通过；文档生成器 31 项测试通过，生成文档检查无差异。文档生产构建生成 64 个路由，1793 份 JavaScript 产物检查为 0 个未绑定引用。依赖安装与 immutable 校验完成。几何定位交由真实浏览器检查，单元测试保留真实的 portal、上下文与外部点击关闭，只替换无布局环境下的异步几何更新。

浏览器检查浅色 24 小时与深色 12 小时下拉面板，确认 10:30 与 02:15 PM 回填，Escape / 取消 / 点击其他字段均丢弃草稿；点击其他字段可继续打开对应下拉层。Tab 离开 iframe 后面板收起。实测下拉层与字段相距 6px，没有原生 dialog、模态遮罩或 body 滚动锁定。

320×640 独立示例回退输入模式，面板宽 304px，左右各留 8px，页面无横向溢出。390px 文档页面中的 277px 示例视口也无横向溢出。生产文档中三档字段示例收起高度 202px，12 小时示例收起高度 80px；展开为 640px，关闭后回到内容高度。嵌入式预览初次打开时可因收起状态的视口高度进入输入模式，展开后可通过底部图标切换表盘。生产预览无 console error / warn。

未进行真实读屏或真机软键盘验收，不据此声明全产品或所有辅助技术符合性。M3 对时间面板的参考不等于其非模态容器是官方标准变体。
