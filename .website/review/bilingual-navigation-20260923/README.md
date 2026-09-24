# 组件导航双语标签

核对日期：2026-09-23。范围：文档站桌面侧栏和移动导航中的组件名称。

## 实现

- 英文组件名作为主标签，中文释义紧跟英文名，整组靠左，以既有间距令牌分隔。辅助文字无底色、无边框，不增加交互或焦点。
- 沿用页面标题数据；`LineEdit`、`TextEdit` 等与组件 API 对应，`PdfEditor` 的 `PDF 编辑器` 和 `Canvas` 的 `WebGL 画布` 保留为完整释义。令牌包保留 `Global Tokens`、`Semantic Tokens` 双词名称。
- 分组和非组件页面保留原始标题。链接继续使用完整标题作为可访问名称和悬停提示，保留 `aria-current`、路由和修饰键行为。
- 桌面侧栏从 240px 增至 320px。中英文保持单行，极端空间不足时省略；不通过缩小英文主标签字号容纳内容。

## 设计依据与差异

延续现有 M3 baseline 导航抽屉，不迁移到 Expressive expanded navigation rail。双语辅助文字属于项目扩展，参考 Material Web List 的 trailing supporting text；不将它当作可操作 chip 或通知 badge。

M3 抽屉规格给出 360dp 宽、56dp 指示器高度；本项目保留既有 48px 行高，采用 320px 文档侧栏宽度。中文使用既有 label-medium 字号和 body-small 字重，保证中文可读性。此处仅核对本次标签布局、颜色角色和导航行为，不声称整个侧栏完全符合标准抽屉的尺寸与键盘模型。

实际参考：

- [M3 Navigation drawer Guidelines](https://m3.material.io/components/navigation-drawer/guidelines)：单行标签、溢出省略、整行选中指示。
- [M3 Navigation drawer Specs](https://m3.material.io/components/navigation-drawer/specs)：baseline 规格、文字与选中容器颜色角色。
- [M3 Navigation drawer Accessibility](https://m3.material.io/components/navigation-drawer/accessibility)：名称、键盘焦点和激活反馈。
- [Material Web List 文档与示例](https://material-web.dev/components/list/)：主标签与 trailing supporting text。
- [Material Web ListItem 行为源码](https://github.com/material-components/material-web/blob/main/list/internal/listitem/list-item.ts)。
- [Material Web ListItem 样式源码](https://github.com/material-components/material-web/blob/main/list/internal/listitem/_list-item.scss)。
- [Material Web ListItem 令牌](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-list-item.scss)：本次读取 main，文件引用 v0_192 令牌。

## 验证

- `corepack yarn workspace @crab-dev/rc-token-semantic generate:token` 通过。
- `corepack yarn workspace @crab-dev/website lint`：0 errors、0 warnings。
- `corepack yarn workspace @crab-dev/website typecheck` 通过。
- `corepack yarn workspace @crab-dev/website test docs/site/__tests__/ui.test.tsx`：28 项生成器检查、文档一致性检查、22 项界面测试通过。
- 真实浏览器检查浅色和深色桌面侧栏，以及 390px、320px 移动抽屉。54 个组件的中英文均未发生文本裁切；320px 下无页面横向溢出。
- 移动端 Tab 可到达下一导航项，显示 2px 实线焦点；Enter 跳转 CronPicker 页面并关闭抽屉。
