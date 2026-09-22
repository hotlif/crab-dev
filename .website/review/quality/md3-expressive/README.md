# M3 Expressive 现有组件库与文档站升级

范围为现有 53 个组件工作区、公共主题与令牌、文档首页、组件页、示例和工作台。延续移除公开“设计语言”页面的决定。Wake / Crab CSS 均保持 0.1.45，无版本发布。

后续专项：[Radio 页面检查与重设计](./radio-page.md) 记录当前 Radio 页的新结构、48px 默认点击目标，以及 Chrome 真实 320px 视口验收；其结果不扩大为全库所有页面的窄屏验收。

文档站后续：[Material 官网参考优化](./documentation-refinement.md) 记录全站导航、标题、章节入口、首页与图形目录的调整，以及搜索和窄屏复核。

分类交互修正：[真实分类侧栏](./category-sidebar.md) 将导航轨改为侧栏分类控制；仅具体文档条目触发页面导航。

输入框专项：[LineEdit 文本字段与文档](./line-edit-page.md) 补齐填充、描边、浮动标签和辅助信息，并重排页面的交互示例。

## 来源与落点

| 官方来源 | 本仓库落点 | 验证方式 |
| --- | --- | --- |
| [Expressive 概览](https://m3.material.io/blog/building-with-m3-expressive) | 共用用途色、强调排版、形状变化、内容分组与动效；首页辅助图形分别消费主色、次要色与第三色容器 | 组件和文档源码审查、明暗主题页面检查 |
| [Motion Web conversion](https://m3.material.io/styles/motion/overview/specs) | L1 六条官方 Web 曲线；L2 spatial/effects 各 fast/default/slow，旧 motion 名称保留；L3 按属性映射 | 全库令牌生成与契约、组件测试、浏览器计算样式 |
| [Button specs](https://m3.material.io/components/buttons/specs) | 五种外观；32/40/56/96/136px；round/square；按压与选中形状；连接式 ButtonGroup | Button 单测、主题对比度、尺寸和形状示例 |
| [Slider specs](https://m3.material.io/components/sliders/specs) | 五档轨道尺寸、竖向手柄、间隙、终点标记、按压变细；拖动位置立即更新 | Slider 单测、交互示例、浏览器尺寸测量 |
| [Typography](https://m3.material.io/styles/typography/overview) | 15 个 emphasized 角色；文档与组件标题消费，正文和数据内容保留阅读层级 | 类型检查、组件页及首页检查 |

## 兼容与实现边界

- `primary` 对应 Filled，新增 `elevated`。默认普通按钮是 Outlined。旧 `subtle` 映射到 Outlined；旧公开 CSS 变量继续作为回退入口。
- Button 的 `small/middle/large` 分别兼容 `xs/s/m`；新的 `l/xl` 用于少量需要突出展示的操作。默认保持 40px，文档布局保留紧凑间距。
- Web 采用官方提供的弹簧曲线转换，不将 CSS 过渡描述为保持速度的物理弹簧运行时；Slider 拖动位置不使用补间。减少动态效果设置继续覆盖动画与过渡。
- 表格、图表、树、业务选择器等沿用现有交互模型并消费公共视觉角色。纯逻辑包没有独立 Expressive 外观。
- 本轮覆盖现有组件，不代表提供 Material 所有新增组件或全部配置，也不作完整规范兼容或第三方认证声明。

## 验证记录

- 全仓 `turbo run lint test typecheck build:library --concurrency=4 --output-logs=errors-only`：216 / 216 项通过；54 个测试工作区共 1459 项 Wake 测试通过。Button 36 项、Slider 30 项。
- 48 个令牌包重新生成并通过契约检查；工具 Lint 无错误、无告警，7 项工具契约通过。
- 最后补充的 Button 选中状态层已重新执行包内 lint、typecheck、36 项测试与 Library 构建。Slider 示例宽度修正重新执行包内 lint，并纳入最终文档生产构建。
- 最终生产构建通过：62 个路由、2544 个输出文件；1887 个生产 JavaScript 文件检查为 0 个未绑定引用。文档生成一致性为 53 个组件页、56 份教程、125 个教学示例、250 个唯一 Demo，0 个生成差异。
- 浏览器实测记录见 `validation.json`，各工作区的令牌与测试落点见 `components.json`。逐页加载检查与专门交互检查分别记录，不以页面能加载代表所有组件状态已验收。
- 53 个组件文档页分别在浅色、深色桌面视口打开，标题与页面布局正常，未发现整页横向溢出。Button 另查五种外观、25 组尺寸、键盘激活、选中形状、连接组与蓝色品牌的嵌套主题；Slider 另查尺寸、键盘、终点和嵌入工作台宽度。日期选择与 Dialog 另查浮层打开、确认/取消和焦点返回。
- 浏览器视口能力接受 320px 设置后，页面实际宽度仍为 1134px（独立预览为 1280px），因此不将这些桌面结果冒充 320px 验收。Slider 的嵌入式示例实测内容宽度 297px，五档轨道均完整展开。
- 生产页面检查发现并修正 Slider 示例宽度收缩，以及首页背景外扩造成的 8px 横向溢出；最终首页明暗主题横向溢出均为 0。最终产物重新验证按钮键盘操作，无浏览器警告或错误日志。
- 本次没有通过浏览器模拟 forced-colors、reduced-motion、200% 文字缩放或真实粗指针设备；相关源码分支保留并通过现有测试，仍需对应系统环境的人工复核。

历史 md3-standard 与 button-compact 记录不能替代本产物的验证。现有 Turbo 工作区循环依赖提示属于已有基线，不将其报告为新增告警或已消除。
