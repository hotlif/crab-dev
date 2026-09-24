# M3 动效专项审查

后续状态：以下 5 项问题已完成实现与验证，详见[修复记录](C:/Users/zhang/Desktop/crab-dev/.website/review/m3-motion-audit-20260923/FIXES.md)。本文件保留修复前的审查证据。

审查日期：2026-09-23。范围：文档站的目录、导航、教程切换，以及 Button、Tabs、Switch、Dialog、Drawer、DropdownContainer、Message、Notification、ComponentPreview、AppMainLayout 和共享动效令牌、usePresence。本轮只审查，未修改组件或站点实现。

## 结论

确实存在让界面显得生硬的动效缺口，但不是全站没有动画。优先补齐目录展开、移动端分类展开和 Tabs 指示器的空间连续性，再统一动效角色，并补全 AppMainLayout 的减少动态效果处理。

沿用仓库现有 M3 / Expressive 设计与 expressive motion scheme。L1 / L2 已有官方 Web 转换表对应的 spatial / effects 曲线；无需重建令牌系统，也不能把缺少真实弹簧引擎直接判为不合规。Material Web 的标签页仍使用 250ms 的既有实现，本报告参考其运动路径与中断处理，不要求把当前 Expressive 令牌替换为该时长。

## 已确认的问题

### 1. P2：页内目录展开、收起和箭头翻转没有过渡

- 位置：[documentNavigation.tsx:85](C:/Users/zhang/Desktop/crab-dev/.website/docs/site/documentNavigation.tsx:85)、[documentStyles.ts:65](C:/Users/zhang/Desktop/crab-dev/.website/docs/site/documentStyles.ts:65)。
- 实际行为：目录通过 `hidden` / `display: none` 立即切换，箭头直接变为 `rotate(180deg)`。浏览器中，Button 页面在 1081 × 912 视口下，目录从 0 变为 336px，正文顶部从 456px 变为 792px；目录和箭头的 `transition-duration` 均为 `0s`。
- 影响：正文大幅跳动，箭头与内容之间没有连贯的展开过程。这是上轮新增折叠目录后尚未补齐的动效。
- 建议：为内容尺寸采用 spatial 角色，为箭头采用 fast spatial；退出完成后再隐藏。折叠期间用 `inert` / 适当的隐藏语义处理不可交互内容，并支持快速反向切换和 reduced motion。这里的具体展开方式是基于 M3 motion 的项目设计选择，M3 没有单独定义“文档页目录”组件。

### 2. P2：移动端导航一级分类硬切，和二级分组、外层抽屉不一致

- 位置：[ui.tsx:233](C:/Users/zhang/Desktop/crab-dev/.website/docs/site/ui.tsx:233)。一级分类使用 `hidden` 加条件挂载；二级分组已有持续挂载的 `grid-template-rows` 过渡。
- 实测：390 × 844 下打开“导航”，“组件”分类内容高度为 702px，收起后直接归零；分类内容的过渡时长为 `0s`。箭头却有 150ms 旋转，因此出现“箭头在动，内容已经消失”的不一致。
- 对照：同一抽屉外层有 500ms 位移和 200ms 遮罩淡变，问题在抽屉内部的一级分类，不在 Drawer 的进出动画。
- 建议：复用二级分组的展开容器与交互语义，再按第 4 项修正其空间动效角色。切换分类时协调关闭和打开，避免瞬间替换整段导航。

### 3. P2：Tabs 选中线只有原地缩放，没有旧位置到新位置的移动

- 位置：[tabs.tsx:162](C:/Users/zhang/Desktop/crab-dev/components/rc-tabs/src/tabs.tsx:162)、[token.toml:47](C:/Users/zhang/Desktop/crab-dev/components/rc-tabs/token.toml:47)。范围为默认 `line` 变体，按 primary tabs 的标签宽度指示器核对。
- 实际行为：每个标签自己的 `::after` 在 `scaleX(0)` 和 `scaleX(1)` 之间变化。浏览器中的基础示例证实两条独立指示线交替缩放，使用 350ms fast spatial；没有从旧标签位置向新标签位置的平移。
- 影响：虽然已经有动画，选中状态仍像在两个位置分别消失、出现，缺少导航的连续感。
- 对照：[Material Web tab.ts](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tabs/internal/tab.ts) 根据前后指示器矩形计算 `translateX` 和 `scaleX`，取消已有动画后重新定向；减少动态效果时避免这段空间运动。
- 建议：让当前指示器从前一位置连续移动并调整宽度，保留现有标签宽度、语义、键盘操作和令牌。验证不同文本宽度、字体加载、RTL、快速反复切换与 reduced motion。这里是与官方实现的行为差异，不是“所有 tabpanel 都必须加淡入动画”。

### 4. P2：部分几何变化用了 effects 曲线，另有硬编码动效绕过令牌

| 位置 | 当前实现 | 建议 |
| --- | --- | --- |
| [homeStyles.ts:32](C:/Users/zhang/Desktop/crab-dev/.website/docs/site/homeStyles.ts:32) | 首页功能卡片的圆角和背景都用 `motion.interaction` | 圆角使用 spatial，颜色保留 effects |
| [siteStyles.ts:120](C:/Users/zhang/Desktop/crab-dev/.website/docs/site/siteStyles.ts:120) | 箭头旋转使用 `motion.interaction`，即 150ms effects | 使用 fast spatial |
| [siteStyles.ts:123](C:/Users/zhang/Desktop/crab-dev/.website/docs/site/siteStyles.ts:123) | 展开高度使用 `motion.fade`，即 200ms effects | 使用与展开规模匹配的 spatial 角色 |
| [header.tsx:157](C:/Users/zhang/Desktop/crab-dev/components/rc-app-main-layout/src/header.tsx:157) | 颜色、背景和 transform 共用硬编码 `160ms ease` | 将颜色与几何变化分开映射到组件令牌 |
| [tabBar.tsx:174](C:/Users/zhang/Desktop/crab-dev/components/rc-app-main-layout/src/tabBar.tsx:174) | 拖拽回位、让位使用硬编码 220ms / 180ms 曲线 | 接入适合拖拽的动效角色，不能机械地替换为同一个固定时长 |

M3 当前 motion 指南明确区分几何变化与颜色、透明度变化。现有 [L2 令牌](C:/Users/zhang/Desktop/crab-dev/components/rc-token-semantic/token.toml:365) 已提供这两类角色。修复重点是正确使用这些角色，并根据范围选择 fast / default / slow，而不是统一延长所有动画。

### 5. P2：AppMainLayout 标签拖拽未完整处理 reduced motion

- 位置：[tabBar.tsx:172](C:/Users/zhang/Desktop/crab-dev/components/rc-app-main-layout/src/tabBar.tsx:172)、[tabBar.tsx:343](C:/Users/zhang/Desktop/crab-dev/components/rc-app-main-layout/src/tabBar.tsx:343)。
- 源码确认：释放后的 220ms 回位、其他标签的 180ms 让位没有组件自身的 `prefers-reduced-motion` 分支；重排提交还固定等待 220ms。文档站的全局减少动效样式不能覆盖独立使用该组件的消费方。
- 建议：减少动态效果时直接进入最终位置并及时提交重排；普通模式按实际动画完成或取消处理收尾，避免仅靠固定计时器。手势直接跟随指针与松手后的附加缓动应分别处理。
- 验证边界：此项为源码确认，本轮没有切换操作系统的减少动态效果设置，也没有在独立消费页面完成拖拽运行时复现，修复时需补充验证。

## 可以进一步打磨，但不列为强制规范缺陷

- 教程步骤： [tutorial.tsx:249](C:/Users/zhang/Desktop/crab-dev/.website/docs/site/tutorial.tsx:249) 直接更新内容并通过 `key={step.id}` 重建 Preview；可以给步骤说明加短促的 effects 过渡，减少替换感。不要为了动画同时挂载两个有副作用的交互示例，也不必给每次页面导航加大范围位移。
- 按压反馈：Button 已有状态层与圆角变化，不能称为“没有按压动画”。Material Web 的 ripple 可作为后续体验对照；是否需要扩散波纹应按具体变体决定，不能将它视作所有控件都必须添加的装饰。

## 已有动效，暂不需要重做

| 范围 | 已有机制 | 本轮证据 |
| --- | --- | --- |
| 全局、语义令牌 | Expressive Web 曲线及 spatial / effects 的 fast / default / slow 角色 | 与 M3 官方转换表核对 |
| Button | 状态层、颜色、圆角过渡及 reduced motion | 源码核对 |
| Switch | 滑块位置、尺寸和颜色过渡 | 源码核对 |
| Dialog / Drawer / DropdownContainer | `@starting-style` 入场、关闭状态、位移或透明度过渡 | 源码核对；移动导航 Drawer 的计算样式确认 |
| Message / Notification | 位移、透明度；Notification 另有缩放 | 源码核对 |
| usePresence | 等待实际退出动画完成，重新打开时取消旧的退出收尾 | 源码核对，未在本轮全面复测中断行为 |
| ComponentPreview | 源码区 `0fr → 1fr` 展开，使用 `motion.expand` | 源码核对；不要和站点其他直接隐藏的容器混淆 |
| 站点二级导航分组 | 高度和箭头过渡 | 源码核对；角色需按第 4 项调整 |

## 复核记录与限制

- 使用现有生产文档产物在本地预览，浏览器视口为 1081 × 912、390 × 844；读取计算样式并实际切换页内目录、Tabs、移动导航分类。
- 浏览器 `prefers-reduced-motion: reduce` 为 `false`，因此上述 0s 不是用户的减少动态效果偏好导致。
- 浏览器查阅了 M3 Motion 的 How it works / Specs、Tabs Guidelines，以及 Material Web Tabs 文档和官方示例的实际渲染；标签指示器的详细运动路径以固定提交的源码为证据。
- 没有修改运行代码，因此未重跑组件测试或构建。本轮不是全站全部主题、全部状态的合规认证，也未完成逐帧性能或所有快速中断场景的验证。
- 桌面侧栏当前保持常驻，不把未触发的 `display: none` CSS 分支误列为“桌面侧栏开合动画缺失”。

## 参考资料

访问日期均为 2026-09-23；Material Web 源码固定在 `9200eb8a0eef99c6bd439ce3968952d76e9ec1b4`。

- [M3 Motion：机制、方案与角色](https://m3.material.io/styles/motion/overview/how-it-works)
- [M3 Motion：规格与 Web 转换表](https://m3.material.io/styles/motion/overview/specs)
- [M3 Tabs Guidelines](https://m3.material.io/components/tabs/guidelines)
- [Material Web Tabs：变体、示例与无障碍关联](https://material-web.dev/components/tabs/)
- [Material Web Tabs 交互示例](https://material-web.dev/components/tabs/stories/)
- [Material Web Tab 行为源码](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tabs/internal/tab.ts)
- [Material Web Tab 共享样式](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tabs/internal/_tab.scss)
- [Material Web Primary Tab 样式](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tabs/internal/_primary-tab.scss)
- [Material Web Primary Tab 令牌](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tokens/_md-comp-primary-tab.scss)
- [Material Web Ripple：状态层说明](https://material-web.dev/components/ripple/)
