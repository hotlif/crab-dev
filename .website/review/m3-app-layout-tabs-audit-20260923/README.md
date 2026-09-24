# AppMainLayout 标签栏可见性审查

日期：2026-09-23。范围：用户截图中的 AppMainLayout 基础示例及同一标签栏的键盘、窄屏行为。仅审查，未修改组件实现。

最新更正：用户明确要求保留原有 Chrome 式工作区标签。此前将它归为 M3 Primary Tabs、建议增加底部指示线的判断不符合用户意图，已经撤回。正确修复是恢复可见的选中容器、底部弧角和工具栏上方的位置，详见 [Chrome 式标签恢复记录](./CHROME-RESTORE.md)。下文仅保留当时的审查过程，不作为当前视觉改造依据。

## 结论与依据

标签 DOM 存在，浏览器中的 transform 为 none；截图问题来自静态视觉实现缺失。AppMainLayout 使用独立 TabBar，没有复用 rc-tabs，因此上一轮 rc-tabs 的选中指示器改进不覆盖这里。上一轮对 AppMainLayout 只验证了拖拽重排，漏查了标签的静态辨识度。

采用 M3 Tabs 作为审查基准。该布局的标签承载应用主要内容目的地，最接近 primary tabs；关闭、拖拽属于工作区扩展，不能将整个组合宣称为官方标准组件。现有实现仍保留 Chrome 风格曲线结构，但默认曲线宽度为 0，背景为透明，未完成对应的 M3 指示方式迁移。

## 确认的问题

### 1. P1：选中标签没有可见指示线

- 位置：`components/rc-app-main-layout/src/tabBar.tsx:99`、`components/rc-app-main-layout/token.toml:82`。
- 实测：选中项为 240×48px，背景透明；`::before` 宽度为 0，`::after` 为 display:none。组件声明了 indicator 颜色令牌，但标签源码没有消费或渲染指示器。
- 影响：只剩文字颜色表达选中状态；短标题与远端关闭符号之间没有明显的标签归属关系，表现为截图中的“看不到标签页”。
- 修复：补齐 primary tab 对应的底部选中指示线、标签布局与状态层，清理无效曲线结构。优先评估复用 rc-tabs 或共享其基础能力，保留工作区关闭、排序扩展。指示器应先在静态和减少动态效果状态下清晰，再接入选中移动动效。

### 2. P1：标签和关闭操作无法通过键盘使用

- 位置：`components/rc-app-main-layout/src/tabBar.tsx:531`、`:559`；`components/rc-app-main-layout/src/layout.tsx:263`。
- 实测及源码：tab 是 div，关闭按钮是 span，均无 tabIndex，浏览器返回 tabIndex=-1；源码没有标签键盘处理。标签没有 aria-controls，tabpanel 没有 id、aria-label 或 aria-labelledby。
- 影响：Tab 键不能进入标签操作；方向键切换、键盘关闭和可见焦点缺失，辅助技术也无法建立标签与面板的关联。
- 修复：实现 roving tabindex、方向键与激活/关闭行为、focus-visible 和关闭后焦点恢复；用 useId 建立 tab/tabpanel 关联。关闭扩展需有独立可访问名称及可操作的交互结构。

### 3. P2：关闭按钮过小，归属不清

- 位置：`components/rc-app-main-layout/src/tabBar.tsx:206`。
- 实测：命中区域只有 18×18px，内部图标为 10×10px；“概览”短标签仍占 240px，关闭符号远离标题。非选中项的关闭按钮默认 opacity:0，没有键盘焦点呈现规则。
- 影响：按钮难以发现和命中；结合缺失的选中指示，更像孤立符号。
- 修复：将视觉图标尺寸与交互命中区域分别定义，复用项目按钮能力；按所选布局调整标题和关闭操作的关系，并验证 hover、focus-visible、触摸及长标题截断。关闭动作是项目扩展，不直接照搬标准 tab 图标尺寸充当命中区域。

### 4. P2：窄屏隐藏全部标签操作，没有替代入口

- 位置：`components/rc-app-main-layout/src/header.tsx:81`。
- 实测：390×844 下标签栏父元素 display:none，标签列表矩形宽高均为 0；页面仅保留侧栏、通知、用户操作，未提供已打开标签列表或关闭入口。
- 影响：已打开标签的切换、关闭入口消失。侧栏菜单不能等价覆盖任意打开的标签与关闭动作。
- 修复：窄屏保留可横向滚动的标签栏，或提供能够切换和关闭已打开标签的入口，并处理长标题及关闭后的焦点。

## 验证与边界

- 在现有本地站点 `/components/rc-app-main-layout` 读取真实 DOM、计算样式和无障碍结构，与用户截图交叉核对。
- 桌面确认透明背景、无指示线、实际尺寸与不可聚焦；390×844 确认整栏隐藏，随后恢复视口并关闭临时页面。
- 本次没有修改组件，没有重跑构建或测试；未重新覆盖深色、多标签溢出、RTL 全部状态，不作全面合规声明。

## 官方参考

规范访问日期：2026-09-23。沿用前轮已核对的 Material Web 源码提交 `9200eb8a0eef99c6bd439ce3968952d76e9ec1b4`；本轮重新读取了 Material Web Tabs 文档，源码网络重取失败，源码对照沿用前轮记录。

- [M3 Tabs 使用指南](https://m3.material.io/components/tabs/guidelines)、[视觉规格](https://m3.material.io/components/tabs/specs)、[无障碍](https://m3.material.io/components/tabs/accessibility)
- [Material Web Tabs 文档](https://material-web.dev/components/tabs/)、[交互示例](https://material-web.dev/components/tabs/stories/)
- [Tab 行为实现](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tabs/internal/tab.ts)
- [Tab 基础样式](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tabs/internal/_tab.scss)、[Primary tab 样式](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tabs/internal/_primary-tab.scss)
- [Primary tab 令牌](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tokens/_md-comp-primary-tab.scss)
