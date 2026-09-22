# Material Design 3 视觉修正

本轮在已有未提交修改上继续修正，按文档站、组件的顺序实施。没有提交代码或升级依赖。

> 导航验收已在用户反馈后重新修正，以 [导航复查](navigation-review.md) 及 navigation-checks.json 为准。下方导航轨描述和旧截图保留为上一轮记录，不代表当前实现。

## 文档站

- 导航轨按 M3 baseline 使用 80px 容器、56×32px 指示区域，hover / focus / pressed 状态层位于图标容器内。
- 桌面搜索入口为 56px 高、24px 图标；移动端保留 48px 图标操作区，顶栏仍为 64px。
- 文档与首页标题使用对应 Display / Headline 的常规字重、行高；去掉额外负字距。
- 首页能力展示区使用语义表面角色，取消装饰渐变与浮层阴影；展示卡片增加 8% / 12% 状态层。
- 侧栏当前项保留选中色对并补充状态叠加，子项使用胶囊形状。目录操作在窄屏保持至少 48px。
- 按钮、复选框、分段选择、滑块、开关、标签、卡片的静态示意图同步实际 M3 外观。它们仍为装饰图，不增加交互节点。
- 纯展示能力卡片不再通过整卡 hover 暗示整卡可点击。

## 组件

| 组件 | 修正 |
| --- | --- |
| Card | elevated 使用 surface-container-low 且无描边；三种变体分别采用 1→2→1、0→1→0、0→1→0 阴影层级；状态层叠加在原表面上；移除封面 hover 缩放；默认 padding 16px；补充高对比度边界与完整状态示例 |
| Tabs | 主指示条随标签宽度变化，3px 高、最短 24px；移除布局测量和内部运行时 style；恢复上方圆角；补充状态层并排除禁用项；焦点环内置避免滚动区裁切；扩大关闭图标命中区；用 React 19 ref cleanup 维护键盘焦点引用 |
| ComponentPreview | 演示容器为静态描边表面，不再整体 hover 抬高；保留工具栏操作反馈；补充高对比度边界 |

令牌、docgen 和站点派生文件均通过项目命令生成。

## 参考依据

- [M3 Navigation rail](https://m3.material.io/components/navigation-rail/specs)、[Navigation drawer](https://m3.material.io/components/navigation-drawer/specs)、[Search](https://m3.material.io/components/search/specs)、[Typography](https://m3.material.io/styles/typography/type-scale-tokens)。本站保留 baseline 导航轨；官方同时提供新版 Expressive 折叠/展开导航轨。
- [M3 Cards](https://m3.material.io/components/cards/specs)、Material Web [实验卡片及示例](https://github.com/material-components/material-web/tree/main/labs/card)、[共享样式](https://github.com/material-components/material-web/blob/main/labs/card/internal/_shared.scss)、[elevated 令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-elevated-card.scss)、[filled 令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-filled-card.scss)、[outlined 令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-outlined-card.scss)。Material Web 的稳定官网没有独立 Card 文档页，采用 labs 实现与规范核对。
- [M3 Tabs](https://m3.material.io/components/tabs/specs)、[Material Web Tabs 文档及示例](https://material-web.dev/components/tabs/)、[实现样式](https://github.com/material-components/material-web/blob/main/tabs/internal/_tab.scss)、[主标签令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-primary-navigation-tab.scss)。
- 示意图：[Material Web Button](https://material-web.dev/components/button/)、[Button 样式](https://github.com/material-components/material-web/blob/main/button/internal/shared-styles.scss)、[Checkbox](https://material-web.dev/components/checkbox/)、[Checkbox 令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-checkbox.scss)、[Switch](https://material-web.dev/components/switch/)、[Switch 令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-switch.scss)、[Chips](https://material-web.dev/components/chip/)、[Filter chip 令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-filter-chip.scss)、[M3 Slider 尺寸](https://m3.material.io/components/sliders/specs)。

## 保留的扩展

- 紫色品牌、中文字体回退、首页展示容器尺寸保留项目主题；首页宣传块不是标准 Card 组件。
- Tabs 的 card / pill 外观和关闭操作属于业务扩展，使用同一色板、状态层和键盘约定。
- 焦点使用清晰的 2px 环；受滚动容器约束，Tabs 使用内置焦点环。`forced-colors` 使用系统色，减少动态效果时关闭非必要动画。
- Slider 示意图匹配仓库已有的新版 M3 16px 轨道 / 4×44px 手柄，而不是 Material Web 较旧的圆形手柄。

## 验证

最终生产构建通过：62 个路由、2559 个文件；1896 个生产 JavaScript 文件的绑定检查通过，0 个未定义引用。

包内 lint、测试、TypeScript 检查及 Library 构建：Card 16 项、Tabs 14 项、ComponentPreview 4 项通过。站点 lint、TypeScript、61 项测试与生成器 28 项测试通过。

浏览器定向检查 54 项通过；53 个组件文档页在桌面亮色、桌面暗色、320px 亮色下共 159 项首屏布局检查通过，未捕获运行异常。额外验证了移动工具栏和标签关闭按钮的 48px 命中区，以及标签长度改变后指示条同步。原生 disabled 属性的附加检查仅覆盖 CSS 状态层抑制，完整组件禁用行为由包内测试验证。新增卡片状态示例的尺寸令牌化之后，又核验了亮暗主题 × 320/1000px 的 4 个最终视图，默认内边距均为 16px。最终生产构建与浏览器记录见同目录 `browser.json`、`page-sweep.json` 和截图。浏览器巡检针对文档首屏及本轮受影响状态，不等同于逐一验收全部 252 个示例的所有交互或真实设备屏幕阅读器测试。

复核命令（仓库根目录；本地生产预览 4175，独立审查浏览器 CDP 9334）：

```powershell
node .website/review/quality/md3-corrections/verify.mjs
node .website/review/quality/md3-corrections/sweep.mjs
```
