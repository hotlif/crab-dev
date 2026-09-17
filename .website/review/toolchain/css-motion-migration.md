# CSS 动画迁移与 Crab CSS 复查

日期：2026-09-17。承接“动画尽量使用 CSS，去掉 Motion”以及“Crab CSS 已修复，请检查并继续”。

后续更新：本文记录的两处 `cx()` 编译问题已在 0.1.45 中复测通过，并恢复正常组合写法，见 [Wake 0.1.45 验收](./wake-0145-cx.md)。以下保留 0.1.44 迁移时的历史记录。

## 修复接入

- Wake 与 Crab CSS 的直接依赖统一精确锁定到 `0.1.44`，安装生成 lockfile 与 PnP 映射；`yarn install --immutable` 通过。
- 核对 Wake 仓库的 0.1.44 发布说明与 `@starting-style` 编译测试后，在实际组件和生产文档中验证。此前 0.1.43 拒绝该规则的问题已解除。
- 移除 `motion`、`framer-motion`、`motion-dom`、`motion-utils` 依赖链；源码、依赖清单、lockfile 和 PnP 映射均无这些库的导入或依赖项。设计令牌的 `motion.*` 名称继续保留。
- 没有新增 JavaScript CSS 副作用导入，仍由 Wake 自动加载组件样式。

## 实现

| 组件 | CSS 动画 |
| --- | --- |
| Dialog | 遮罩淡入淡出、内容透明度和位移 |
| Drawer | 四个方向的面板位移、遮罩淡入淡出 |
| DropdownContainer | 透明度与独立 `translate`，保留 Floating UI 的定位 `transform` |
| Tooltip | 透明度过渡 |
| Menu | Grid `1fr / 0fr` 展开与收起 |
| AppMainLayout | 用户菜单透明度与位移 |
| Message / Notification | 入场、退场、堆叠位移、CSS keyframes 倒计时进度条 |

入场使用原生 `@starting-style`。新增 `usePresence` 只观察目标元素的有限 CSS 动画是否结束，负责退场后的卸载；不逐帧更新 React，也不通过延时常量猜测 CSS 时长。重新打开或卸载会使旧的完成回调失效，无动画时立即完成。

新增 `useCountdown` 只管理自动关闭的单次定时器。悬停、内容获得焦点、旧消息被新消息覆盖时暂停；恢复后继续剩余时长。进度条由 CSS 驱动，任意用户时长通过 ref 设置运行时 CSS 变量。`duration=0` 不计时、不显示进度条。

过渡使用 L3 令牌引用 L2 `motion.*`。保留减少动画和强制颜色规则；修正 Dialog / Drawer 关闭态过渡选择器优先级，确保减少动画规则也覆盖退场。无 SSR、发布或组件版本升级。

## 编译中发现的剩余问题

`@starting-style` 本身已可编译，但以下样式组合在生产构建中仍曾丢失绑定：

```tsx
className={cx(fadeStyle, css`/* geometry */`)}
className={cx(ulStyle, ulChildrenStyle)}
```

第一处位于 Dialog，初次生产检查共发现 110 处 `fadeStyle` / `contentMotionStyle` 未绑定引用，浏览器打开 Dialog 也复现 `ReferenceError`。第二处位于新提取的 Menu 子菜单，生产工作台发现 2 处未绑定引用。

当前消费方已改为完整静态样式块，直接传入 `className`；没有修改生成的构建产物，也没有关闭绑定检查。最终 1,899 个生产 JavaScript 文件检查通过，未绑定引用为 0。这两种组合仍可作为后续 Crab CSS 编译器回归的线索，不能据此宣称任意 `cx()` 组合都已验证。

## 自动验证

| 检查 | 结果 |
| --- | --- |
| 令牌生成 | 通过，源 TOML 与生成 token.ts 同步 |
| 全仓 Library 构建 | 53 / 53 任务通过 |
| 全仓 Lint | 54 / 54 任务通过；0 个 lint 错误或警告 |
| 全仓类型检查 | 108 / 108 任务通过，包含依赖构建 |
| 组件与预设 Wake Test | 53 个包，1,385 项通过，0 失败 |
| 新增回归 | CSS 退场等待、快速重开、取消动画、卸载清理、倒计时暂停恢复、回调更新、消息堆叠、通知方向独立计时与焦点暂停 |
| 最后功能调整 | Dialog / Drawer / Menu 的 lint、test、library 及依赖共 30 / 30 任务通过 |
| 最终源码复查 | lint、test、typecheck 及依赖共 215 / 216 任务通过；唯一失败任务仍为下文的站点测试 |
| 文档生成与检查 | 53 个组件页、56 份教程、124 个教学示例、247 个 Demo；检查无差异 |
| 文档生产构建 | 81 个路由，2,569 个文件；1,899 个 JavaScript 文件无未绑定引用 |

安装仍会显示仓库既存的 peer / PnP loader 提示；Turbo 的已有依赖环提示未在本次处理。以上不表述为安装过程零提示。

## 浏览器实测

使用 `http://127.0.0.1:4175` 的生产产物进行交互，未用构建结果代替页面检查。

- Dialog：浅色、深色、320px 下标题、正文和操作可见，无内部横向溢出；取消与 Escape 关闭后，焦点回到“查看说明”，滚动锁解除。Escape 后观察到原生 dialog 在 CSS 退场期间继续挂载，结束后关闭。
- Drawer：右侧面板正常显示；打开时锁定背景滚动，关闭后恢复触发器焦点与滚动。实际样式为面板位移 300ms、遮罩淡入淡出 200ms。
- Message：悬停后 `animation-play-state: paused`，超过自动关闭时长仍保留，进度矩阵保持相同；离开后继续进度并自动消失。
- Notification：深色及 320px 下内容与关闭按钮可见；键盘焦点位于关闭按钮时暂停进度，Enter 关闭后通知移除。
- DropdownContainer：实际定位 `transform` 与 CSS `translate` 同时生效；点击外部后移除浮层。
- Tooltip：键盘聚焦后观察到 opacity 从约 0.329 到 1；Escape 进入退场，立即设置 `aria-hidden`。
- Menu 工作台：展开时 Grid 行高从中间值到目标高度；收起时观察到接近 0 的行高与 `data-state="closed"`；工作台无运行错误。
- AppMainLayout 工作台：用户菜单可通过键盘聚焦打开，Escape 触发淡出，观察到中间透明度约 0.464。

减少动画与强制颜色分支已检查源码，无动画退场路径有 Hook 测试覆盖；当前浏览器工具没有媒体特征模拟接口，本轮没有声称完成这两项系统设置下的视觉实测。

## 文档站 Wake Test 尚未全部通过

此前记录见 [Wake CSS 自动加载复查](./wake-css-loading.md)。移除 Motion 后，原来的 `Cannot redefine property: VisualElement` 初始化阻塞消失；补齐现有模块替身的 ESM 标记后，教程测试也通过。

最新站点结果为 **45 项通过、14 项失败，3 个套件通过、4 个套件失败**。此前有 25 项因初始化错误未执行，因此不能仅凭失败数量判断新增回归。

| 套件 | 未通过项目 |
| --- | --- |
| componentDemos | 超时重试用例查询到多个相同 role 的元素（1 项） |
| tokenReference | 主动播放用例未找到预期 role（1 项） |
| ui | `main`、`banner`、`dialog` 等角色查询、延迟挂载与全屏预览替身（8 项）；另有 DropdownContainer 的 act 告警 |
| profile | 确认层角色查询、校验与提交时序、加载按钮的旧 `disabled` 属性断言（4 项）；失败路径遗留 timeout |

没有跳过、删除失败用例或抑制 act / 资源泄漏告警。整仓测试命令仍因站点测试返回非零，不能标记为“所有测试通过”。

## 2026-09-18 提交前复核

完成 Drawer、Notification 和 Radio 后重新执行全仓检查：类型检查及依赖构建 108 / 108 任务通过；lint 54 / 54 任务通过。组件与预设共 1,393 项测试通过；整仓测试为 106 / 107 任务成功，文档站仍为上述 45 项通过、14 项失败，失败用例与此前记录一致，包含 act 告警和失败路径遗留 timeout。

最新文档生产构建通过：81 条路由、2,574 个文件；1,902 个生产 JavaScript 文件无未绑定引用。文档生成检查、类型检查、lint 和 26 项生成器测试通过。分组提交期间使用 Yarn 生成工具链升级所需的中间依赖产物，最终恢复既有已验证的依赖文件并通过 `install --immutable`，未手改 lockfile、PnP 或令牌产物。
