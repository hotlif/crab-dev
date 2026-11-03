# 组件动效审查（2026-11-02）

范围来自当前产品清单。目标为精致克制，保留 MD3、Apple、shadcn 各自的空间与 effects 合同；静态组件不增加装饰动画。下表“源码核验”不等于完整的视觉验收，浏览器与人工证据单独记录，不据此提升产品设计覆盖。

## 逐包结论

| 包 | 处理 | 检查与修复 |
| --- | --- | --- |
| rc-alert | 源码核验 | 有界高度与间距折叠；复用修正后的退出生命周期。 |
| rc-app-main-layout | 修复 | 侧栏宽度及内边距改用 layout；保留直接拖动与已有标签重排中断路径。 |
| rc-auto-sizer | 不适用 | 尺寸测量与调度，无装饰动效。 |
| rc-avatar | 修复 | 减少动画时的阴影反馈使用主题 effects 令牌，保留静态位置。 |
| rc-badge | 修复 | 状态脉冲周期及曲线归入 L3；减少动画时停止脉冲。 |
| rc-bar-chart | 修复 | 图例只过渡背景及透明度；保留数据更新重定向、尺寸变化及减少动画策略。 |
| rc-breadcrumbs | 源码核验 | 仅颜色反馈，焦点不依赖动画。 |
| rc-button | 修复 | 链接下划线使用独立空间令牌；保留键盘激活反馈与禁用清理。 |
| rc-canvas | 源码核验 | 流动虚线监听动态偏好；直接缩放与拖动不引入补间。 |
| rc-card | 源码核验 | 容器、封面与状态层分开；减少动画移除移动和缩放。 |
| rc-checkbox | 源码核验 | 标记节点稳定，颜色/透明度与空间角色分开，禁用和 reduce 路径完整。 |
| rc-color-picker | 源码核验 | 复用共享浮层修复；直接指针取色保持同步。 |
| rc-component-preview | 修复 | 源码展开使用有界 layout，避免过冲裁切。 |
| rc-config-provider | 不适用 | 无独立装饰动画；作为嵌套配置与 Portal 边界参与回归。 |
| rc-cron-picker | 源码核验 | 复用字段与共享浮层；预览刷新计时是数据行为。 |
| rc-date-picker | 源码核验 | 日期格仅颜色反馈，字段浮层继承共享修复。 |
| rc-dialog | 修复 | 短有界退出、替换动画保留、重开草稿及有效焦点；新增连续性示例。 |
| rc-divider | 不适用 | 静态分隔。 |
| rc-drawer | 修复 | 遮罩较快退出；保留边缘面板有界进出场并恢复反转时的有效焦点。 |
| rc-dropdown-container | 修复 | 定位就绪后按实际方位入场，反转保持就绪，退出不被定位状态重置截断。 |
| rc-empty | 不适用 | 静态空状态，反馈由调用方状态表达。 |
| rc-flow-diagram | 源码核验 | 复用 Canvas 流动边降级，拖动保持直接操控。 |
| rc-form | 源码核验 | 标签与校验依赖真实字段；不增加整表单进场或刷新动画。 |
| rc-hooks | 修复 | 退出重新观察有效有限动画；覆盖替换、取消、重开、卸载与无限子动画。 |
| rc-line-edit | 修复 | MD3 标签保持稳定对齐，完整插值位移及文字度量；Apple/shadcn 保持上置标签。 |
| rc-masonry | 源码核验 | 位置与透明度使用既有令牌，减少动画取消过渡。 |
| rc-menu | 修复 | 折叠网格使用有界 layout；切换跟随宿主实际宽度动画并支持反转及减少动画。 |
| rc-message | 修复 | 消息小幅入场、较短退出；堆叠与功能倒计时各自独立。 |
| rc-notification | 修复 | 保留方向语义，长距离飞入改为轻微位移，退出使用有界角色。 |
| rc-number-edit | 源码核验 | 复用 LineEdit；长按步进的加速计时属于输入行为，不做动画延迟。 |
| rc-pagination | 修复 | 省略/跳转图标透明度使用主题交互令牌。 |
| rc-pdf-editor | 源码核验 | 复用公共控件；文档绘制的逐帧调度属于渲染，不附加编辑补间。 |
| rc-prose | 修复 | 链接颜色使用 L3 effects 令牌，退出作用域契约保持。 |
| rc-radio | 源码核验 | 稳定选中标记，空间与 effects 分开，保留原生输入与减少动画。 |
| rc-realm | 源码核验 | 加载内容只做透明度出现，reduce 直接呈现。 |
| rc-router | 不适用 | 路由集成，不引入页面转场平台。 |
| rc-segmented | 修复 | 稳定标记与图标节点，交叉反馈、文字位移连续且支持 RTL。 |
| rc-select | 修复 | MD3 标签稳定对齐；补齐实际使用的 transform、行高及间距过渡，继承共享浮层。 |
| rc-skeleton | 源码核验 | 循环节奏已有 L3；减少动画停止波纹及脉冲。 |
| rc-slider | 修复 | 光晕尺寸使用 spatial、透明度使用 effects；数值位置紧跟指针。 |
| rc-spin | 修复 | 必要的减少动画呼吸曲线归入 L3；既有低频反馈及宿主 reset 兼容保持。 |
| rc-split-pane | 源码核验 | 仅分隔条颜色反馈，调整尺寸不补间。 |
| rc-switch | 修复 | 轨道、手柄、光晕独立声明属性，保留 root.transition 兼容覆盖。 |
| rc-table | 源码核验 | 展开行复用有界行尺寸插值；保留小列表限制、普通滚动/排序即时更新。 |
| rc-table-pro | 源码核验 | 复用 Table 及共享字段浮层，刷新保留现有数据。 |
| rc-tabs | 源码核验 | 既有指示器从中断位置重定向；零时长、RTL、动态 reduce 有行为回归。 |
| rc-tag | 源码核验 | 颜色与选中反馈，关闭动作复用 Button；无多余列表编排。 |
| rc-text-edit | 修复 | 补齐 transform、行高及间距实际过渡，文字布局保持有界。 |
| rc-theme | 源码核验 | 三体系完整重置共享动效角色，嵌套边界继承正确角色。 |
| rc-token-global | 源码核验 | 保留官方 MD3 Web 转换参数，无全局缩短或更换曲线。 |
| rc-token-semantic | 源码核验 | 保留三体系独立合同与有界 sheet/layout 角色。 |
| rc-tooltip | 源码核验 | 仅透明度过渡，继承退出生命周期修复。 |
| rc-tree | 源码核验 | 图标空间角色与有界行尺寸分开，虚拟测量限制保持。 |
| rc-virtual | 源码核验 | 滚动条透明度与测量调度分开；滚动不增加空间补间。 |

## 验证记录

- 令牌契约：修改后的 49 个令牌包通过；公开生成入口重现 54 份声明生成物，无内容漂移。
- `usePresence`：6 个 DOM 行为测试通过；共享 overlay 原生浏览器 13 项、原生组合树和 presence 5 项通过。另增加跨 Chromium / Firefox / WebKit 的原生 Animation 替换与无限子动画用例，18 项全部通过。
- 开关：最终版本通过原生 `transitionrun` 记录开始状态，随后自然播放并连续反转、运行中切换减少动画；三浏览器 30 项全部通过。驱动往返可能晚于短过渡，WebKit 的 React 提交也可能晚于第一个逐帧回调，因此不再以单次远程读取是否碰巧命中动画作为动效存在的证据。
- 边界检查：受影响的布局、菜单、开关、分段、字段和弹层，三体系及浅深色的窄屏、触控、RTL、强制颜色、减少动画与配置保留共 297 项 Chromium 检查全部通过。
- 最终专项结果：自然播放与中断 996 项、实时偏好 954 项、环境边界 297 项、原生生命周期 18 项，共 2,265 个场景通过，无未通过场景。各测试范围采用修正后的最新批次；原始失败批次保留，详见下表和[机器可核对的索引](component-motion-audit/verification.json)。矩阵按真实 `visual.json` 尺寸和密度设置，专用尺寸通过示例的真实控件设置。
- 全仓 `yarn check` 最终通过，进程退出码为 0：架构、令牌、生成、lint、库构建、导出、独立消费、类型、默认测试、全部登记附加检查和站点构建共 11 个阶段全部通过。日期原生套件为 156 项通过、0 失败、0 未运行；站点检查 2,028 份生产 JavaScript，未发现未绑定引用。
- 运行条件与先前失败：Windows 的日期原生 iframe 键盘旅程在并行验收期间多次超过 90 秒，Linux 尝试另遇 Wake 的 `Runtime.removeBinding` 清理超时。保留原始失败与单项诊断记录，未改断言、超时或绕过登记用例。所有专项批次结束后，在 Windows / Node 22.15.0 / Yarn 4.18.0、仓库临时目录与 `RAYON_NUM_THREADS=2` 下单独运行统一入口，以上全链路通过结果来自这一完整批次。
- Windows 使用本机缓存的 Yarn 4.18.0，临时文件放在仓库 `.tmp`。本机 Firefox 启动失败，跨浏览器证据改用仓库锁定的本地 Linux Playwright 镜像；不修改依赖、锁文件、浏览器版本或基线规避环境限制。

## 证据索引

以下为本地候选证据；`local-linux-snapshot.json` 保存完整命令参数和逐文件 SHA-256，运行目录中的 `inputs-worker-*.json` 记录捕获前后来源、构建与字体指纹，`results.json` 和 `report/` 保存实际结果与附件。不同批次的测试脚本改进单独列出；组件运行代码、令牌、演示和依赖合同共 1,033 个文件的指纹在所有批次及当前交付中一致。候选捕获不等同于像素基线批准。

| 范围 | 入口与证据 |
| --- | --- |
| 原生替换 / 无限子动画，三浏览器 | `components/rc-dialog/docs/presence-lifecycle.visual.spec.mjs`；`.tmp/visual-linux-2026-11-02T13-36-46-741Z/evidence/`，18 项通过。 |
| 开关自然播放最终脚本，三浏览器 | `components/rc-switch/docs/switch-motion.visual.spec.mjs`；`.tmp/visual-linux-2026-11-02T13-24-50-339Z/evidence/`，30 项通过。 |
| 交互与环境边界 | 各受影响包的 `*-environment.visual.spec.mjs`；`.tmp/visual-linux-2026-11-02T13-24-02-411Z/evidence/`，297 项通过。 |
| 原有循环、图表、表格刷新及扩展自然播放 | `.tmp/visual-linux-2026-11-02T13-19-50-412Z/evidence/` 中其余动效规格 660 项通过。整批原始结果为 1,943 通过、7 失败；旧偏好脚本的悬停及标签起始条件分别由以下批次替代，不将整批原始结果改写为通过。 |
| 固定视口自然播放与中断 | `.tmp/visual-linux-2026-11-02T14-20-21-357Z/evidence/`，原始 335 / 336 通过，1 项为初始主题几何尚未稳定的字段首帧；两个字段完整范围以下述最终批次为准，其余 276 项通过。 |
| 字段与选择标签最终脚本 | `.tmp/visual-linux-2026-11-02T14-40-05-801Z/evidence/` 与 `.tmp/visual-linux-2026-11-02T14-40-20-008Z/evidence/`，各 30 项通过。自然等待主题字体与几何稳定，再单独观察焦点过渡；不快进或结束动效，保留首帧连续性断言。 |
| 实时减少动画最终脚本 | `test/visual/motion-contract.visual.spec.mjs`；`.tmp/visual-linux-2026-11-02T13-57-56-567Z/evidence/`，954 项通过。针对可见控件操作，原生选择控件使用标签，字段使用包含标签与输入的实际交互区域。 |
| 全仓统一检查 | 最终通过 `.tmp/motion-check-isolated-final.log`，全部阶段结果保存在[验证索引](component-motion-audit/verification.json)。Windows 前两轮 `.tmp/motion-final-repository-check.log`、`.tmp/motion-repository-verified.log`，单项复查 `.tmp/motion-date-rtl-recheck.log`，Linux `.tmp/motion-repository-linux-complete.log`。Linux 视觉快照补入原有审查导航文件的原文与哈希，说明在对应快照 `check-inputs-supplement.json`，没有更改校验规则。 |

## 画面复核

- 已查看 LineEdit 的空值、浮动、清空，Segmented 的标记和文字，Select 的标签，以及 Dialog / Drawer / Dropdown 的连续帧。覆盖 MD3 深色、Apple 浅色和 shadcn 深色代表场景；此前也在真实浏览器中核对 MD3 两类空标签的中心与输入区域一致。
- 弹窗与抽屉同时查看了原始自然播放视频解码的整视口帧，检查退出中重开、草稿保留与最终焦点恢复。局部元素截图可能跟随元素边界裁切，不能单独用于证明相对视口的位移；结合整视口视频、实际边界时间序列和焦点断言判断。
- 已复核的帧中未见节点替换闪烁、叠影或突跳；必要的选中与焦点意符保留。截图、自动布局断言与视觉观察分别作为证据，不互相替代。
- 另外查看固定 Linux 渲染环境下的 MD3 窄屏长字段、RTL 分段和触控开关：标签、文字与操作区未互相覆盖，焦点标记完整。对应提取文件为 `.tmp/motion-review/env-*.png`。
- 本地提取索引与代表帧保留在 `.tmp/motion-review/`。人工复核是上述代表场景，不宣称逐张审阅整个自动矩阵，也未执行全库像素基线更新。
- 原速录像另随本记录保留：[MD3 对话框反转](component-motion-audit/dialog-md3-dark.webm)、[Apple 通知进出场](component-motion-audit/notification-apple-light.webm)、[shadcn 开关连续操作](component-motion-audit/switch-shadcn-dark.webm)。均为未变速、未稳定画面的原始播放；来源、大小与 SHA-256 见[录像索引](component-motion-audit/evidence.json)。

## 未验证范围

- Chromium 使用各包声明的全部适用尺寸和密度；Firefox / WebKit 采用声明的代表尺寸与密度，并补充共享生命周期场景，未声称覆盖这两个引擎的每个尺寸组合。
- 触控与强制颜色为浏览器原生模拟及真实事件检查，没有额外开展实体移动设备、所有操作系统或旧版浏览器回归。缺少动画 API 的即时完成路径由行为测试验证。
- 未运行全库逐像素基线更新或发布 CI。产品清单中的原有 `partial` / 验收证据状态保持，不以本轮工程检查替代完整设计覆盖。

## 依据与边界

- [M3 motion physics 与角色](https://m3.material.io/styles/motion/overview/how-it-works)、[Web 转换规格](https://m3.material.io/styles/motion/overview/specs)，查阅日期 2026-11-02。继续使用当前 Web 曲线近似，不宣称与实时弹簧速度连续性完全等价。
- Apple 与 shadcn 延续 L2 已有项目合同及已锁定参考版本。本轮精修不将项目选择冒充新的原生平台规格。
- 本轮新增动效偏好矩阵由产品清单、组件 visual.json 和真实源动效派生；逐类自然播放测试与静态截图/布局测试分开。
- 未更新像素基线。用户已有主题审查改动保持独立。
