<div align="center">
	<h1>里程碑</h1>
</div>

> 最后更新：2026-06-26 &nbsp;|&nbsp; 当前阶段：**Alpha（v0.x）**

---

## 总览

```
组件进度    ███████████████░░░░░░░░░░░░░░░░  37 / 75（49%）
基础设施    ████████████████████████████████  全部就绪
工具链      ████████████████████████████████  4/4 已发布
工程规范    ████████████████████████████████  3/3 已发布
设计令牌    ████████████████████████████░░░░  三层架构落地，深色主题待落地
```

| 指标 | 数值 |
|------|------|
| ✅ 已交付组件包 | 37 |
| 🚧 持续打磨 | Table / 高阶 Table 生态 |
| 🔴 P0 核心缺失 | 0 |
| ⬚ 待规划组件 | 38（P1: 12 · P2: 15 · P3: 11） |

> 本期重点：**Table 表格生态成型** —— `rc-table` 核心能力全面补齐（列宽 / 排序 / 筛选 /
> 行选择 / 列拖拽 / 行编辑 / 单元格键盘导航 / 树形数据 / 关键字高亮 / 底部汇总行 / 行展开），
> 并在其上新增高阶表格 `rc-protocol-table` 与自适应容器 `rc-auto-sizer`。

---

## 一、已完成的基础设施

| 领域 | 内容 |
|------|------|
| **Monorepo** | Turbo + Yarn 4.13 PnP + Corepack，全仓 ESM |
| **CI** | GitHub Actions（Jest + ESLint），`canary` 分支触发 |
| **构建** | `yarn build:library` 先建 packify，再经 Turbo 按拓扑编排全仓 |
| **AI 协作规范** | `CLAUDE.md` + `.claude/rules/`（技术栈 / 组件 / 工作流 / 平台脚本四类 MUST 级约束） |
| **Packify** `v0.0.4` | Rollup 4 → ESM / CJS / 类型声明 / CSS，驱动 `generate:css-token` |
| **Crustify** `v0.0.19` | Webpack 5 + React Compiler + Linaria + SWC + MDX + 自动扫描 |
| **Lignify** `v0.0.3` | 零配置文档环境，自动扫描 demo/view/mdx |
| **auto-import-style** `v0.0.3` | 编译时自动注入组件 CSS |
| **ESLint 预设** `v0.0.1` | 浏览器 React + Node 双配置 |
| **Jest 预设** `v0.0.1` | 浏览器 React + Node 双配置（ESM 原生） |
| **TypeScript 预设** `v0.0.3` | 浏览器 React + Node 双配置（含 JSX） |
| **设计令牌** | 三层架构 · TOML → TS 生成 · `$ref()` CSS 变量链 · OKLCh 色彩 |
| **文档站** | 字体本地化（Google Fonts CDN → fontsource），生成式 manifest 收录全部组件 |

---

## 二、组件全景图

> 状态：✅ 可用 &nbsp; 🚧 开发中 &nbsp; 🟡 P1 高优 &nbsp; 🔵 P2 中优 &nbsp; ⚪ P3 低优
> &nbsp;|&nbsp; 测试：✅ 有 · ⚠️ 待补 · — 不适用 &nbsp;|&nbsp; 令牌：✅ 有 · — 不适用

### 通用（general）

| 组件 | 状态 | 版本 | 测试 | 令牌 | 说明 |
|------|:----:|------|:----:|:----:|------|
| Button | ✅ | `0.0.1` | ✅ | ✅ | 按钮，用于即时操作 |
| Avatar | ✅ | `0.0.1` | ✅ | ✅ | 头像（含 Group / 图标占位 / 失败回退） |
| Badge | ✅ | `0.0.1` | ✅ | ✅ | 徽标数（计数 / 圆点 / 状态点） |
| Tag | ✅ | `0.0.1` | ✅ | ✅ | 标签，用于分类与标记 |
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
| Tree | ✅ | `0.1.1` | ✅ | ✅ | 树形控件（高效渲染 + 拖放） |
| Steps | 🔵 | — | — | — | 步骤条 |
| Anchor | ⚪ | — | — | — | 锚点导航 |

### 数据录入（data-entry）

| 组件 | 状态 | 版本 | 测试 | 令牌 | 说明 |
|------|:----:|------|:----:|:----:|------|
| LineEdit | ✅ | `0.0.3` | ⚠️ | ✅ | 单行文本输入（待补单测） |
| Form | ✅ | `0.0.6` | ✅ | — | 高性能表单引擎 |
| Select | ✅ | `0.0.1` | ✅ | ✅ | 下拉选择（单选 / 多选 / 搜索） |
| Checkbox | ✅ | `0.0.1` | ✅ | ✅ | 复选框（含 Group） |
| Radio | ✅ | `0.0.1` | ✅ | ✅ | 单选框（含 Group） |
| Switch | ✅ | `0.0.1` | ✅ | ✅ | 开关 |
| Slider | ✅ | `0.0.1` | ✅ | ✅ | 滑块 |
| DatePicker | ✅ | `0.0.1` | ⚠️ | ✅ | 日期选择器（待补单测） |
| ColorPicker | ✅ | `0.0.1` | ✅ | ✅ | 颜色选择器（panel padding 拆 x/y 令牌） |
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
| Table | ✅ | `0.0.1` | ✅ | ✅ | 表格：列宽 / 排序 / 筛选 / 行选择 / 列拖拽 / 行编辑 / 单元格键盘导航 / 树形数据 / 关键字高亮 / 底部汇总 / 行展开 |
| ProtocolTable | ✅ | `0.1.1` | ⚠️ | — | 高阶 Table，封装分页 + 自适应容器 + 筛选栏（待补单测） |
| Virtual | ✅ | `0.1.1` | ✅ | — | 虚拟滚动（Pointer 拖拽 / reservedBottomHeight / scrollToCell 智能定位） |
| Prose | ✅ | `0.0.1` | ✅ | ✅ | Markdown 排版容器（prose / 尺寸变体 / invert） |
| Card | 🟡 | — | — | — | 卡片容器 |
| Collapse | 🟡 | — | — | — | 折叠面板 / 手风琴 |
| Popover | 🟡 | — | — | — | 气泡卡片 |
| Descriptions | 🔵 | — | — | — | 描述列表 |
| Empty | 🔵 | — | — | — | 空状态 |
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
| Dialog | ✅ | `0.0.1` | ✅ | ✅ | 对话框 / 模态框 |
| Drawer | ✅ | `0.0.1` | ✅ | ✅ | 抽屉，边缘滑出浮层 |
| Notification | ✅ | `0.0.1` | ✅ | ✅ | 通知提醒 |
| Message | ✅ | `0.0.1` | ✅ | ✅ | 全局消息（轻量反馈） |
| Alert | ✅ | `0.0.1` | ✅ | ✅ | 警告提示（内联） |
| Tooltip | ✅ | `0.0.1` | ✅ | ✅ | 文字提示（Floating UI + CSS 箭头） |
| Progress | 🟡 | — | — | — | 进度条 |
| Spin | 🟡 | — | — | — | 加载中 |
| Popconfirm | 🔵 | — | — | — | 气泡确认框 |
| Result | 🔵 | — | — | — | 结果页 |

### 基础 / 工具（primitive · utility）

| 组件 | 状态 | 版本 | 测试 | 令牌 | 说明 |
|------|:----:|------|:----:|:----:|------|
| TokenGlobal | ✅ | `0.0.1` | — | ✅ | 全局令牌（L1 原始基元） |
| TokenSemantic | ✅ | `0.0.1` | — | ✅ | 语义令牌（L2 语义映射，深色主题挂载点） |
| DropdownContainer | ✅ | `0.0.1` | ✅ | ✅ | 下拉浮层容器 |
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
| rc-table 列宽调整 / 排序 / 列拖拽 | ✅ 已完成 |
| rc-table 行选择 / 行编辑 / 单元格键盘导航 | ✅ 已完成 |
| rc-table 树形数据 / 关键字高亮搜索 | ✅ 已完成 |
| rc-table 底部汇总行 / 行展开详情面板 | ✅ 已完成 |
| rc-table 设计令牌系统接入 | ✅ 已完成 |
| rc-protocol-table 高阶表格（分页 + 自适应 + 筛选栏） | ✅ 新增 |
| rc-auto-sizer 自适应容器组件 | ✅ 新增 |
| rc-virtual reservedBottomHeight / scrollToCell 智能定位 | ✅ 已完成 |
| rc-color-picker panel padding 拆分 x/y 令牌 | ✅ 已完成 |
| 文档站字体本地化（CDN → fontsource） | ✅ 已完成 |
| 仓库接入 CLAUDE.md + `.claude/rules` 规范 | ✅ 已完成 |
| rc-table / rc-protocol-table 补齐单元测试 | 🚧 进行中 |
| 深色主题语义令牌落地（L2 CSS 变量覆写） | 🚧 进行中 |

### 短期目标

- [ ] **深色主题切换** —— 语义层（L2）CSS 变量覆写 + 主题切换机制
- [ ] **ConfigProvider** —— 全局主题 / 语言 / 尺寸注入
- [ ] 补齐缺测组件单测（rc-date-picker、rc-line-edit、rc-protocol-table、rc-hooks）
- [ ] rc-table / rc-protocol-table 发布正式版本号
- [ ] **P1 组件起步** —— Icon、Grid

### 中期目标

- [ ] **P1 组件交付** —— Textarea、InputNumber、TimePicker、Upload、Card、Collapse、Popover、Progress、Spin
- [ ] npm 发布流程（自动化版本管理 + CHANGELOG）
- [ ] 无障碍（a11y）合规审查
- [ ] 性能基准（打包体积 + 运行时）
- [ ] 国际化（i18n）基础支持

### 长期目标

- [ ] **P2 / P3 组件交付** —— 补齐剩余 26 个组件
- [ ] 设计令牌多平台产物（iOS / Android / Figma）
- [ ] 可视化令牌编辑器
- [ ] **组件库 v1.0 稳定版发布**

---

## 四、组件依赖关系

```
rc-token-global ──→ rc-token-semantic

rc-button ─┬────────────────────────────→ rc-dialog
rc-line-edit ┘
rc-button ─┬──→ rc-dropdown-container ─┬─→ rc-date-picker ←── rc-line-edit
rc-slider ─┘                          └─→ rc-color-picker

rc-hooks ──┬───────────────→ rc-tree
rc-virtual ┘
rc-checkbox ┐
rc-radio ───┼──────────────→ rc-table ──┐
rc-virtual ─┘                           │
rc-auto-sizer ──┐                       ├─→ rc-protocol-table
rc-pagination ──┼───────────────────────┤
rc-date-picker ─┘                       ┘

rc-menu ────────→ rc-app-main-layout
rc-masonry ─────→ lignify (template)
```
