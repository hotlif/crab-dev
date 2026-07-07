<div align="center">
	<h1>里程碑</h1>
</div>

> 最后更新：2026-07-07 &nbsp;|&nbsp; 当前阶段：**Alpha（v0.x）**

---

## 总览

```
标准组件    ████████████████░░░░░░░░░░░░░░░░  38 / 75（51%）
基础设施    ████████████████████████████████  全部就绪
工具链      ████████████████████████████████  4/4 已发布
工程规范    ████████████████████████████████  3/3 已发布
设计令牌    ████████████████████████████░░░░  三层架构落地，深色主题待落地
```

| 指标 | 数值 |
|------|------|
| ✅ 已交付标准组件 | 38 |
| ✨ 图形与可视化（扩展赛道，不计入 75） | 2（Canvas 已发布 · FlowDiagram 待补单测） |
| 🚧 持续打磨 | `rc-flow-diagram` 单测 / 深色主题落地 |
| 🔴 P0 核心缺失 | 0 |
| ⬚ 待规划标准组件 | 37（P1: 12 · P2: 14 · P3: 11） |

> 本期重点：**新增图形与可视化赛道** —— `rc-canvas`（纯 WebGL 2 的 2D 绘制引擎，提供 Rect /
> Circle / Line / Image / Text / Group / Edge / Marker / Minimap 及拖拽 / 悬浮 / 键盘交互）
> 与基于其上的 `rc-flow-diagram`（ELK 自动布局 + 正交边路由）；`rc-empty` 落地并接入
> `rc-table` 空状态；`rc-protocol-table` 完成 hook 架构重写（侧边栏 / 错误重试态 / 拖拽约束）；
> `rc-select` 补齐键盘导航与选中态视觉令牌；`rc-dialog` / `rc-dropdown-container` 完成
> ref-as-prop 重构与嵌套浮层支持；新增组件设计原则规范（示能 / 意符 / 映射 / 反馈 / 限制）。

---

## 一、已完成的基础设施

| 领域 | 内容 |
|------|------|
| **Monorepo** | Turbo + Yarn 4.13 PnP + Corepack，全仓 ESM |
| **CI** | GitHub Actions（Jest + ESLint），`canary` 分支触发 |
| **构建** | `yarn build:library` 先建 packify，再经 Turbo 按拓扑编排全仓 |
| **AI 协作规范** | `CLAUDE.md` + `.claude/rules/`（技术栈 / 组件 / 设计原则 / 工作流 / 平台脚本五类 MUST 级约束） |
| **Packify** `v0.0.4` | Rollup 4 → ESM / CJS / 类型声明 / CSS，驱动 `generate:css-token`，CJS 输出自动 interop |
| **Crustify** `v0.0.19` | Webpack 5 + React Compiler + Linaria + SWC + MDX + 自动扫描插件，静态资源 loader / CSS 压缩修复 |
| **Lignify** `v0.0.3` | 零配置文档环境，自动扫描 demo/view/mdx，DemoMasonry 支持 density |
| **auto-import-style** `v0.0.3` | 编译时自动注入组件 CSS，已升级 Babel 8 API |
| **ESLint 预设** `v0.0.1` | 浏览器 React + Node 双配置 |
| **Jest 预设** `v0.0.1` | 浏览器 React + Node 双配置（ESM 原生，v30.4.1 + jsdom + React act 环境） |
| **TypeScript 预设** `v0.0.3` | 浏览器 React + Node 双配置（含 JSX） |
| **设计令牌** | 三层架构 · TOML → TS 生成 · `$ref()` CSS 变量链 · OKLCh 色彩 |
| **文档站** | 字体本地化（Google Fonts CDN → fontsource），生成式 manifest 收录全部组件（含 Canvas / FlowDiagram / Empty） |

---

## 二、组件全景图

> 状态：✅ 可用 &nbsp; 🚧 开发中 &nbsp; 🟡 P1 高优 &nbsp; 🔵 P2 中优 &nbsp; ⚪ P3 低优
> &nbsp;|&nbsp; 测试：✅ 有 · ⚠️ 待补 · — 不适用 &nbsp;|&nbsp; 令牌：✅ 有 · — 不适用

### 通用（general）

| 组件 | 状态 | 版本 | 测试 | 令牌 | 说明 |
|------|:----:|------|:----:|:----:|------|
| Button | ✅ | `0.0.1` | ✅ | ✅ | 按钮，用于即时操作（含 ButtonGroup：circle / link / danger 变体） |
| Avatar | ✅ | `0.0.1` | ✅ | ✅ | 头像（含 Group / 图标占位 / 失败回退） |
| Badge | ✅ | `0.0.1` | ✅ | ✅ | 徽标数（计数 / 圆点 / 状态点） |
| Tag | ✅ | `0.0.1` | ✅ | ✅ | 标签，用于分类与标记（含 closeAriaLabel 无障碍标注） |
| Skeleton | ✅ | `0.0.1` | ✅ | ✅ | 骨架屏（text / rect / circle / button / avatar / image · pulse / wave） |
| Icon | 🟡 | — | — | — | SVG 图标库，tree-shakable |
| Typography | 🔵 | — | — | — | 排版（Title / Text / Paragraph / Link） |

### 布局（layout）

| 组件 | 状态 | 版本 | 测试 | 令牌 | 说明 |
|------|:----:|------|:----:|:----:|------|
| AppMainLayout | ✅ | `0.0.3` | ✅ | ✅ | 应用主布局（标签栏 + 侧边栏折叠） |
| Masonry | ✅ | `0.0.1` | ✅ | ✅ | 瀑布流布局，多列自适应 |
| Grid | 🟡 | — | — | — | 栅格系统（Row / Col，响应式） |
| Space | 🔵 | — | — | — | 间距容器 |
| Divider | ⚪ | — | — | — | 分割线 |

### 导航（navigation）

| 组件 | 状态 | 版本 | 测试 | 令牌 | 说明 |
|------|:----:|------|:----:|:----:|------|
| Menu | ✅ | `0.0.2` | ✅ | ✅ | 菜单（含 inline-collapsed 折叠模式） |
| Tabs | ✅ | `0.0.1` | ✅ | ✅ | 标签页（line / card / pill 三形态） |
| Breadcrumbs | ✅ | `0.0.1` | ✅ | ✅ | 面包屑（maxCount 截断 + 自定义分隔符） |
| Pagination | ✅ | `0.0.1` | ✅ | ✅ | 分页器（快速跳转 / 总量显示 / 小尺寸） |
| Tree | ✅ | `0.1.1` | ✅ | ✅ | 树形控件：高效渲染 / 拖放（含拖拽手柄）/ checkable / 关键字筛选 / 行内编辑 / 键盘导航 |
| Steps | 🔵 | — | — | — | 步骤条 |
| Anchor | ⚪ | — | — | — | 锚点导航 |

### 数据录入（data-entry）

| 组件 | 状态 | 版本 | 测试 | 令牌 | 说明 |
|------|:----:|------|:----:|:----:|------|
| LineEdit | ✅ | `0.0.3` | ✅ | ✅ | 单行文本输入（status / allowClear / showCount / 密码可见性切换 / bordered） |
| Form | ✅ | `0.0.6` | ✅ | — | 高性能表单引擎（React 19 `use()` / `<Context>` 简写，令牌化网格布局 + 内联校验反馈） |
| Select | ✅ | `0.0.1` | ✅ | ✅ | 下拉选择（单选 / 多选 / 搜索，选中态高亮与滚动定位、键盘导航强化） |
| Checkbox | ✅ | `0.0.1` | ✅ | ✅ | 复选框（含 Group） |
| Radio | ✅ | `0.0.1` | ✅ | ✅ | 单选框（含 Group） |
| Switch | ✅ | `0.0.1` | ✅ | ✅ | 开关 |
| Slider | ✅ | `0.0.1` | ✅ | ✅ | 滑块 |
| DatePicker | ✅ | `0.0.1` | ✅ | ✅ | 日期选择器（选中态即时反馈） |
| ColorPicker | ✅ | `0.0.1` | ✅ | ✅ | 颜色选择器（受控模式 / 预设色板 / 格式切换，panel padding 拆 x/y 令牌） |
| Textarea | 🟡 | — | — | — | 多行文本 |
| InputNumber | 🟡 | — | — | — | 数字输入 |
| TimePicker | 🟡 | — | — | — | 时间选择器 |
| Upload | 🟡 | — | — | — | 文件上传 |
| AutoComplete | 🔵 | — | — | — | 自动完成 |
| Cascader | 🔵 | — | — | — | 级联选择 |
| Transfer | 🔵 | — | — | — | 穿梭框 |
| Rate | ⚪ | — | — | — | 评分 |
| Mention | ⚪ | — | — | — | @提及 |

### 数据展示（data-display）

| 组件 | 状态 | 版本 | 测试 | 令牌 | 说明 |
|------|:----:|------|:----:|:----:|------|
| Table | ✅ | `0.0.1` | ✅ | ✅ | 表格：列宽 / 排序 / 筛选 / 行选择 / 列拖拽 / 行编辑 / 单元格键盘导航 / 树形数据 / 关键字高亮 / 底部汇总 / 行展开 / 行号列 / 空状态集成 |
| ProtocolTable | ✅ | `0.1.1` | ✅ | — | 高阶 Table：hook 架构重写，封装分页 + 自适应容器 + 筛选栏 + 侧边栏 + 错误/重试态 + 拖拽约束 |
| Virtual | ✅ | `0.1.1` | ✅ | — | 虚拟滚动（Pointer 拖拽 / reservedBottomHeight / scrollToCell 智能定位） |
| Prose | ✅ | `0.0.1` | ✅ | ✅ | Markdown 排版容器（prose / 尺寸变体 / invert） |
| Empty | ✅ | `0.0.1` | ✅ | ✅ | 空状态，用于无数据 / 搜索无结果 / 无权限场景，已接入 `rc-table` |
| Card | 🟡 | — | — | — | 卡片容器 |
| Collapse | 🟡 | — | — | — | 折叠面板 / 手风琴 |
| Popover | 🟡 | — | — | — | 气泡卡片 |
| Descriptions | 🔵 | — | — | — | 描述列表 |
| Image | 🔵 | — | — | — | 图片预览 |
| List | 🔵 | — | — | — | 列表 |
| Timeline | 🔵 | — | — | — | 时间线 |
| Segmented | 🔵 | — | — | — | 分段控制器 |
| Carousel | ⚪ | — | — | — | 轮播 |
| Statistic | ⚪ | — | — | — | 统计数值 / 倒计时 |
| Calendar | ⚪ | — | — | — | 日历面板 |

### 反馈（feedback）

| 组件 | 状态 | 版本 | 测试 | 令牌 | 说明 |
|------|:----:|------|:----:|:----:|------|
| Dialog | ✅ | `0.0.1` | ✅ | ✅ | 对话框 / 模态框（ref-as-prop 重构，ESC / 遮罩处理与 pending 态） |
| Drawer | ✅ | `0.0.1` | ✅ | ✅ | 抽屉，边缘滑出浮层 |
| Notification | ✅ | `0.0.1` | ✅ | ✅ | 通知提醒 |
| Message | ✅ | `0.0.1` | ✅ | ✅ | 全局消息（轻量反馈） |
| Alert | ✅ | `0.0.1` | ✅ | ✅ | 警告提示（内联） |
| Tooltip | ✅ | `0.0.1` | ✅ | ✅ | 文字提示（Floating UI + CSS 箭头，保留消费方 props 合并） |
| Progress | 🟡 | — | — | — | 进度条 |
| Spin | 🟡 | — | — | — | 加载中 |
| Popconfirm | 🔵 | — | — | — | 气泡确认框 |
| Result | 🔵 | — | — | — | 结果页 |

### 图形与可视化（graphics）—— 扩展赛道，暂不计入 75 项标准组件总量

| 组件 | 状态 | 版本 | 测试 | 令牌 | 说明 |
|------|:----:|------|:----:|:----:|------|
| Canvas | ✅ | `0.0.1` | ✅ | — | 纯 WebGL 2 的 2D 绘制引擎：Rect / Circle / Line / Image / Text / Group / Edge / Marker / Minimap，含拖拽 / 悬浮 / 键盘交互与抗锯齿优化 |
| FlowDiagram | 🚧 | `0.0.1` | ⚠️ | — | 基于 Canvas 的流程图：Edge 连线 + ELK 自动布局 + 正交边路由（待补单测） |

### 基础 / 工具（primitive · utility）

| 组件 | 状态 | 版本 | 测试 | 令牌 | 说明 |
|------|:----:|------|:----:|:----:|------|
| TokenGlobal | ✅ | `0.0.1` | — | ✅ | 全局令牌（L1 原始基元） |
| TokenSemantic | ✅ | `0.0.1` | — | ✅ | 语义令牌（L2 语义映射，深色主题挂载点） |
| DropdownContainer | ✅ | `0.0.1` | ✅ | ✅ | 下拉浮层容器（嵌套浮层 FloatingTree 支持，跨 Dialog 挂载） |
| ComponentPreview | ✅ | `0.0.1` | — | ✅ | 组件预览与说明卡片 |
| AutoSizer | ✅ | `0.0.1` | ✅ | — | 自适应容器，测量宽高传入子渲染函数 |
| Hooks | ✅ | `0.0.1` | — | — | 通用 Hooks 库 |
| ConfigProvider | 🟡 | — | — | — | 全局配置（主题 / 语言 / 尺寸） |
| Portal | 🔵 | — | — | — | Portal 容器 |
| Watermark | ⚪ | — | — | — | 水印 |
| Affix | ⚪ | — | — | — | 固钉 |
| BackTop | ⚪ | — | — | — | 回到顶部 |
| Tour | ⚪ | — | — | — | 漫游式引导 |

---

## 三、路线图

### 当前迭代（本期已落地）

| 任务 | 状态 |
|------|------|
| `rc-canvas` WebGL 2D 绘制引擎（Rect/Circle/Line/Image/Text/Group/Edge/Marker/Minimap） | ✅ 新增 |
| `rc-flow-diagram` 流程图（ELK 自动布局 + 正交边路由） | ✅ 新增（待补单测） |
| `rc-empty` 空状态组件，并接入 `rc-table` | ✅ 新增 |
| `rc-protocol-table` hook 架构重写（侧边栏 / 错误重试态 / 拖拽约束 / 行号列） | ✅ 已完成 |
| `rc-select` 键盘导航修复、选中态视觉与聚焦环令牌、嵌套下拉支持 | ✅ 已完成 |
| `rc-dialog` / `rc-dropdown-container` ref-as-prop 重构、嵌套浮层（FloatingTree） | ✅ 已完成 |
| `rc-tree` 拖拽手柄 / checkable / 关键字筛选 / 行内编辑 / 键盘导航 | ✅ 已完成 |
| `rc-line-edit` status / allowClear / showCount / 密码可见性切换 | ✅ 已完成 |
| `rc-form` 迁移 React 19 `use()` / `<Context>` 简写，令牌化网格布局 | ✅ 已完成 |
| 组件设计原则规范固化（示能 / 意符 / 映射 / 反馈 / 限制五原则） | ✅ 新增 |
| `LineEdit` / `DatePicker` / `ProtocolTable` 单元测试补齐 | ✅ 已完成 |
| 深色主题语义令牌落地（L2 CSS 变量覆写） | 🚧 进行中 |

### 短期目标

- [ ] **深色主题切换** —— 语义层（L2）CSS 变量覆写 + 主题切换机制
- [ ] **ConfigProvider** —— 全局主题 / 语言 / 尺寸注入
- [ ] `rc-flow-diagram` 补齐单元测试
- [ ] `rc-table` / `rc-protocol-table` 发布正式版本号
- [ ] **P1 组件起步** —— Icon、Grid

### 中期目标

- [ ] **P1 组件交付** —— Textarea、InputNumber、TimePicker、Upload、Card、Collapse、Popover、Progress、Spin
- [ ] npm 发布流程（自动化版本管理 + CHANGELOG）
- [ ] 无障碍（a11y）合规审查
- [ ] 性能基准（打包体积 + 运行时）
- [ ] 国际化（i18n）基础支持

### 长期目标

- [ ] **P2 / P3 组件交付** —— 补齐剩余 25 个标准组件（P2 14 · P3 11）
- [ ] `rc-canvas` / `rc-flow-diagram` 生态深化（更多图形 / 布局算法）
- [ ] 设计令牌多平台产物（iOS / Android / Figma）
- [ ] 可视化令牌编辑器
- [ ] **组件库 v1.0 稳定版发布**

---

## 四、组件依赖关系

### 4.1 令牌分层

```
rc-token-global（L1 原始基元）──→ rc-token-semantic（L2 语义映射）──→ 各组件 token.ts（L3）
```

### 4.2 组件运行时复用关系

> 仅统计 `package.json` 的 `dependencies`（真实运行时复用），不含 `devDependencies` 中仅用于
> 文档 / demo 搭建预览页的组件（几乎每个组件的 docs 都会以 devDependency 引入
> `rc-component-preview` / `rc-masonry` / `rc-menu`，此类不构成产品级复用，不计入下表）。

| 组件 | 运行时复用的库内组件 |
|------|----------------------|
| rc-token-semantic | rc-token-global |
| rc-dropdown-container | rc-button、rc-line-edit、rc-token-semantic |
| rc-select | rc-checkbox、rc-dropdown-container、rc-line-edit、rc-tag、rc-virtual |
| rc-date-picker | rc-button、rc-dropdown-container、rc-line-edit |
| rc-color-picker | rc-button、rc-dropdown-container、rc-line-edit、rc-masonry、rc-select、rc-slider |
| rc-dialog | rc-button |
| rc-form | rc-tooltip |
| rc-pagination | rc-select |
| rc-app-main-layout | rc-breadcrumbs、rc-drawer、rc-menu、rc-skeleton |
| rc-tree | rc-checkbox、rc-hooks、rc-virtual |
| rc-table | rc-checkbox、rc-empty、rc-radio、rc-virtual |
| rc-protocol-table | rc-auto-sizer、rc-checkbox、rc-date-picker、rc-line-edit、rc-pagination、rc-table、rc-tree |
| rc-flow-diagram | rc-canvas |
