# 组件文档阅读顺序与示例留白

检查日期：2026-09-24。基于检查开始时已有的工作区修改继续调整。

## 确认的问题

- 普通组件页同时展示基础示例、分步教程和全部示例；基础示例直接复用了教程第一步，属于重复挂载。工作台示例又重复覆盖了其中的基础能力。
- 在 1920 × 855 视口的 DatePicker 页面中，基础示例标题位于文档 806px，全部示例位于 3593px，两处相隔 2787px；中间插入了教程、FAQ 和 API。
- 每个演示重复显示“先看效果、关键组件、关键属性、状态与事件、迁移到业务”等通用文字，实际预览被推到说明之后。
- Wake 的 `.demo-frame-root` 使用与 iframe 视口相关的最小高度，并让所有直接子元素继承。日期预览旁的空 portal 容器因此也占据一整屏，反复触发更大的高度测量；实测 iframe 最终达到 1200px，日期输入框位于其内部约 593px 处。

## 调整

- 普通组件页统一为简短用途介绍、示例、使用说明、常见问题、API。用途介绍复用组件目录的现有文案。
- 组件页只挂载一份工作台示例集合，全部 264 个工作台演示保留；业务实战继续使用分步教程，全局令牌保留专用参考布局。
- 演示保留自身标题、简短说明、预览、源码与工作台入口，移除重复的通用教学话术。
- 场景、实现要点和无障碍说明移到示例之后，采用顺序阅读的段落和列表；移除开头的四块说明网格。
- 保留“基础示例”和“全部示例”的旧锚点，两者均指向同一个示例区，并为移动顶栏预留定位偏移。
- 在现有工作台适配样式中取消根节点和直接子元素继承的最小高度，避免空 portal 容器放大预览。打开浮层或模态框时，为演示提供 640px 的可操作视口；这是文档演示容器的尺寸，并非组件尺寸。
- 同源预览通过 ResizeObserver 测量实际内容根节点，关闭弹层后恢复内容高度，并清理监听。Wake 的文档高度包含 iframe 自身视口，不能用于收起后的测量；无法直接访问内容时仍使用原有消息协议。

## 设计依据

延续现有 M3 Web 排版和文本按钮。文档阅读页与演示容器没有一一对应的官方组件，本次内容顺序与预览自适应高度属于项目布局决策。正文、标题、前景色和按钮继续消费既有语义令牌，没有新增视觉变体或第三方 UI 依赖。

实际查阅的资料如下；Material Web 源码为本次访问的 main 分支，字阶和文本按钮令牌引用 v0.192，不把它等同于完整的 Expressive 实现。

- [M3 Applying type](https://m3.material.io/styles/typography/applying-type)：标题与正文角色、Web 行高和间距、可读性及无障碍。
- [M3 Canonical layout examples](https://m3.material.io/foundations/layout/canonical-examples/overview)：主要内容、辅助目录和响应式布局。
- [Material Web Typography](https://material-web.dev/theming/typography/) 与 [Buttons 文档和示例](https://material-web.dev/components/button/)：字阶与复用文本操作的对照。
- [Material Web 字阶样式](https://github.com/material-components/material-web/blob/main/typography/_typescale.scss)、[样式入口](https://github.com/material-components/material-web/blob/main/typography/md-typescale-styles.scss)与 [v0.192 字阶令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-typescale.scss)。
- [按钮行为](https://github.com/material-components/material-web/blob/main/button/internal/button.ts)、[文本按钮样式](https://github.com/material-components/material-web/blob/main/button/internal/_text-button.scss)与 [v0.192 文本按钮令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-text-button.scss)。

## 验证

- 文档站 Lint：0 errors、0 warnings；类型检查通过。
- 文档生成器：31 项通过；站点 Wake 测试：64 项通过。新增回归覆盖弹层展开、收起、旧高度消息和监听清理。
- 共享主题包 Lint：0 errors、0 warnings；9 项主题测试通过。
- 生成一致性检查覆盖 54 个组件页、57 份教程及 264 个唯一 Demo。
- 单独检查 53 个普通组件页：每页仅挂载一次示例集合，没有重复的基础示例或教程区域，示例均位于使用说明之前。

- 生产预览抽查 DatePicker、Button、Select，核对短介绍、唯一示例区、说明和 API 的顺序；检查浅色、深色、1366px 桌面和 390px 手机布局。
- 日期预览在最终产物中为 132px，打开日历后为 640px，选中日期并确认后恢复 132px；日历面板的可见高度和滚动高度均为 424px，确认按钮完整可见。
- 390px 页面无正文横向溢出；“基础示例”旧链接定位到同一示例区，距离视口顶部 88px，避开 64px 顶栏。页内目录支持键盘展开和 API 跳转，API 筛选可用，Select 支持键盘打开和 Escape 关闭。
- 最终生产构建生成 64 个路由；1794 个生产 JavaScript 文件引用检查通过，0 个未绑定引用；浏览器未捕获到 warning 或 error。

开发服务的工作台懒编译在本机出现加载超时，组件专用工作台和生产预览正常；本次运行时验收使用生产预览，未修改 Wake 的开发加载配置。

本记录仅覆盖本次文档结构和预览布局，不是全组件库视觉合规认证。
