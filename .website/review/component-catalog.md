# 组件概览改版验收

日期：2026-09-14。目标页面：`/learn/components`。

## 交付范围

- 保留现有 7 个分类、52 个组件与工具入口、分类锚点、顶部和侧栏。
- 每张卡片展示中英文名称、对应静态示意图与用途介绍，整卡链接进入原组件文档。
- 用途介绍集中于 `content/catalog/overview.json`；插图按输入、展示、结构与基础能力拆分在 `docs/site/catalog/`；布局维护在 `catalogStyles.ts`。
- 插图用于概览识别，不是交互示例。没有加载 iframe、引入新依赖或修改公共组件 API；真实演示继续保留在详情文档。
- 配色复用当前 Material 基准紫色的 L2 语义变量；站点候选布局令牌标记未来 L3 归属。插图禁止事件、额外焦点与非 SVG 控件；读屏通过链接名称及 `aria-describedby` 读取用途。
- `learn/components.mdx` 由现有生成器更新，未手改生成文件。

## 自动检查

- 修改前 ESLint：通过，日志 `catalog-baseline-eslint.log`。
- 最终 ESLint：通过，日志 `catalog-eslint.log`。
- TypeScript：通过，日志 `catalog-typecheck.log`。
- Wake 纯色彩契约：11 项通过，覆盖配色等价性、正文和焦点对比度；日志 `catalog-palette-test.log`。
- 生成器回归：24 项通过。新增覆盖全部 52 项介绍与插图一一对应、无交互焦点，更新目录介绍与锚点回归。
- 生成一致性：52 个组件页、55 份教程、117 个教学示例、246 个 Demo，0 文件变化。
- Wake 导航测试仍受既有版本限制阻断：Wake 0.1.38 要求 React/DOM `>=19.2.8 <19.3.0`，仓库为 `19.3.0`。未降级依赖，详见 `catalog-test.log`。
- 构建过程中观察到工作区临时新增又移除 `fixedColumns.demo.tsx`，曾导致分组检查失败；对应的临时分组登记也已撤回，最终未改变表格示例源码或分组定义。随后生成一致性通过。

## 浏览器与构建

最终完整 `yarn build` 通过：80 个路由、2540 个文件，1890 个生产 JavaScript 文件未发现未绑定引用。日期示意图经过浏览器检查后加宽数字列间距，截图与最终构建一致；记录见 `catalog-build-final.log`。

Chrome 生产预览 `http://127.0.0.1:4173/learn/components`：

| 检查 | 结果 |
| --- | --- |
| 浅色 / 深色 × 1440、768、320px | 52 张卡片及插图全部渲染，页面和单卡均无横向溢出 |
| 分类索引 | 输入、反馈、数据等锚点正确定位，7 个分类及数量保留 |
| 键盘 | Button 卡片按 Tab 到 Checkbox，2px 实线焦点环清晰；Shift+Tab 返回，Enter 进入 Button 文档 |
| 前进 / 后退 | 在概览和 `/components/rc-button` 间正确切换，主题保持 |
| 移动导航 | 在 320px 深色下正常打开和关闭，主题同步 |
| 全局搜索 | 搜索 Button 可显示组件与示例结果，Esc 关闭后焦点恢复搜索按钮 |
| 减少动态效果 | 系统实际设置为 reduce，卡片计算后的 transition-duration 为 0s |
| 强制颜色 | 已提供 Canvas / CanvasText 映射；当前浏览器未启用 forced-colors，仅完成静态规则检查 |

示意图使用 `aria-hidden` 和 `focusable=false`，卡片内没有嵌套交互控件。标题与用途文字通过正常文档文本提供等价说明；示意图中的简化线条属于装饰，不用于传达独立操作状态。

最终截图：`screenshots/catalog-light.png`、`screenshots/catalog-dark.png`、`screenshots/catalog-mobile-dark.png`。`catalog-browser.json` 记录最终 320px 深色页面的 DOM 核验：52 张卡片、52 个隐藏于读屏的插图、52 个有效用途说明关联、无重复 ID、无页面或单卡溢出。生产页控制台没有记录警告或错误。

验收完成后已恢复原浅色偏好和浏览器视口，并关闭验收专用标签页。未修改组件库默认令牌或公共 Props，未发布网站。
