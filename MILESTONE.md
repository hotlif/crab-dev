<div align="center">
	<h1>里程碑</h1>
</div>

> 最后更新：2026-03-30 &nbsp;|&nbsp; 当前阶段：**Alpha（v0.x）**

---

## 总览

```
组件进度    ██████████░░░░░░░░░░░░░░░░░░░░  18 / 61（30%）
基础设施    ████████████████████████████████  全部就绪
工具链      ████████████████████████████████  4/4 已发布
工程规范    ████████████████████████████████  3/3 已发布
设计令牌    ████████████████████████░░░░░░░░  核心完成，深色主题待适配
```

| 指标 | 数值 |
|------|------|
| ✅ 已完成组件 | 15 |
| 🚧 开发中组件 | 3（date-picker / color-picker / table） |
| 🔴 P0 核心缺失 | 8（Select / Checkbox / Radio / Switch / Tooltip / Tag / Alert / Message） |
| ⬚ 待规划组件 | 35（P1: 15 · P2: 12 · P3: 8） |

---

## 一、已完成的基础设施

| 领域 | 内容 |
|------|------|
| **Monorepo** | Nx（package.json 推断）+ Yarn 4 PnP + Corepack |
| **CI** | GitHub Actions（Jest + ESLint），`canary` 分支触发 |
| **构建** | `yarn build` 自动按依赖顺序编排 |
| **Packify** `v0.0.4` | Rollup 4 → ESM / CJS / 类型声明 / CSS |
| **Crustify** `v0.0.19` | Webpack 5 + React Compiler + Linaria + SWC + MDX（100% 测试覆盖） |
| **Lignify** `v0.0.3` | 零配置文档环境，自动扫描 demo/view/mdx |
| **auto-import-style** `v0.0.3` | 编译时自动注入组件 CSS |
| **ESLint 预设** `v0.0.1` | 浏览器 React + Node 双配置 |
| **Jest 预设** `v0.0.1` | 浏览器 React + Node 双配置（ESM 原生） |
| **TypeScript 预设** `v0.0.3` | 浏览器 React + Node 双配置（含 JSX） |
| **设计令牌** | 三层架构 · TOML → TS 生成 · `$ref()` CSS 变量链 · OKLCh 色彩 · RFC 定稿 |

---

## 二、组件全景图

> 状态含义：✅ 可用 &nbsp; 🚧 开发中 &nbsp; 🔴 P0 核心缺失 &nbsp; 🟡 P1 高优 &nbsp; 🔵 P2 中优 &nbsp; ⚪ P3 低优

### 通用

| 组件 | 状态 | 版本 | 测试 | 令牌 | 说明 |
|------|:----:|------|:----:|:----:|------|
| Button | ✅ | `0.0.1` | ✅ | ✅ | 按钮 |
| Icon | 🟡 | — | — | — | SVG 图标库，tree-shakable |
| Typography | 🔵 | — | — | — | 排版（Title / Text / Paragraph / Link） |

### 布局

| 组件 | 状态 | 版本 | 测试 | 令牌 | 说明 |
|------|:----:|------|:----:|:----:|------|
| AppMainLayout | ✅ | `0.0.3` | — | ✅ | 应用主布局 |
| Grid | 🟡 | — | — | — | 栅格系统（Row / Col，响应式） |
| Space | 🔵 | — | — | — | 间距容器 |
| Divider | ⚪ | — | — | — | 分割线 |

### 导航

| 组件 | 状态 | 版本 | 测试 | 令牌 | 说明 |
|------|:----:|------|:----:|:----:|------|
| Menu | ✅ | `0.0.2` | ✅ | ✅ | 菜单 |
| Tabs | 🟡 | — | — | — | 标签页 |
| Breadcrumb | 🟡 | — | — | — | 面包屑 |
| Pagination | 🟡 | — | — | — | 分页器 |
| Steps | 🔵 | — | — | — | 步骤条 |
| Anchor | ⚪ | — | — | — | 锚点导航 |

### 数据录入

| 组件 | 状态 | 版本 | 测试 | 令牌 | 说明 |
|------|:----:|------|:----:|:----:|------|
| LineEdit | ✅ | `0.0.3` | ✅ | ✅ | 单行文本输入 |
| Form | ✅ | `0.0.6` | ✅ | — | 表单引擎 |
| Slider | ✅ | `0.0.1` | ✅ | ✅ | 滑块 |
| DropdownContainer | ✅ | `0.0.1` | ✅ | ✅ | 下拉容器 |
| DatePicker | 🚧 | `0.0.1` | — | ✅ | 日期选择器 |
| ColorPicker | 🚧 | `0.0.1` | — | ✅ | 颜色选择器 |
| **Select** | 🔴 | — | — | — | 下拉选择（单选 / 多选 / 搜索） |
| **Checkbox** | 🔴 | — | — | — | 复选框（含 Group） |
| **Radio** | 🔴 | — | — | — | 单选框（含 Group） |
| **Switch** | 🔴 | — | — | — | 开关 |
| Textarea | 🟡 | — | — | — | 多行文本 |
| InputNumber | 🟡 | — | — | — | 数字输入 |
| TimePicker | 🟡 | — | — | — | 时间选择器 |
| Upload | 🟡 | — | — | — | 文件上传 |
| AutoComplete | 🔵 | — | — | — | 自动完成 |
| Cascader | 🔵 | — | — | — | 级联选择 |
| Transfer | 🔵 | — | — | — | 穿梭框 |
| Rate | ⚪ | — | — | — | 评分 |
| Mention | ⚪ | — | — | — | @提及 |

### 数据展示

| 组件 | 状态 | 版本 | 测试 | 令牌 | 说明 |
|------|:----:|------|:----:|:----:|------|
| Tree | ✅ | `0.1.1` | ✅ | ✅ | 树形控件 |
| Virtual | ✅ | `0.1.1` | — | — | 虚拟滚动 |
| ComponentPreview | ✅ | `0.0.1` | ✅ | ✅ | 组件预览 |
| Table | 🚧 | — | — | ✅ | 表格（虚拟滚动 + 排序 + 筛选） |
| **Tooltip** | 🔴 | — | — | — | 文字提示 |
| **Tag** | 🔴 | — | — | — | 标签 |
| Badge | 🟡 | — | — | — | 徽标数 |
| Avatar | 🟡 | — | — | — | 头像 |
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

### 反馈

| 组件 | 状态 | 版本 | 测试 | 令牌 | 说明 |
|------|:----:|------|:----:|:----:|------|
| Dialog | ✅ | — | ✅ | ✅ | 对话框 / 模态框 |
| Notification | ✅ | `0.0.1` | — | ✅ | 通知提示 |
| **Alert** | 🔴 | — | — | — | 警告提示（内联） |
| **Message** | 🔴 | — | — | — | 全局消息（轻量反馈） |
| Progress | 🟡 | — | — | — | 进度条 |
| Skeleton | 🟡 | — | — | — | 骨架屏 |
| Spin | 🟡 | — | — | — | 加载中 |
| Drawer | 🟡 | — | — | — | 抽屉 |
| Popconfirm | 🔵 | — | — | — | 气泡确认框 |
| Result | 🔵 | — | — | — | 结果页 |

### 基础 / 工具

| 组件 | 状态 | 版本 | 测试 | 令牌 | 说明 |
|------|:----:|------|:----:|:----:|------|
| TokenGlobal | ✅ | `0.0.1` | — | ✅ | 全局令牌（第 1 层） |
| TokenSemantic | ✅ | `0.0.1` | — | ✅ | 语义令牌（第 2 层） |
| Hooks | ✅ | `0.0.1` | — | — | 通用 Hooks |
| ConfigProvider | 🟡 | — | — | — | 全局配置（主题 / 语言 / 尺寸） |
| Portal | 🔵 | — | — | — | Portal 容器 |
| Watermark | ⚪ | — | — | — | 水印 |
| Affix | ⚪ | — | — | — | 固钉 |
| BackTop | ⚪ | — | — | — | 回到顶部 |
| Tour | ⚪ | — | — | — | 漫游式引导 |

---

## 三、路线图

### 当前迭代

| 任务 | 状态 |
|------|------|
| rc-date-picker 完善交互与测试 | 🚧 进行中 |
| rc-color-picker 完善交互与测试 | 🚧 进行中 |
| rc-table 核心功能开发 | 🚧 进行中 |
| RFC-MARKDOWN-THEME prose 令牌实现 | 🚧 进行中 |
| 深色主题语义令牌适配 | 🚧 进行中 |

### 短期目标

- [ ] **P0 组件交付** — Select、Checkbox、Radio、Switch、Tooltip、Tag、Alert、Message
- [ ] **ConfigProvider** — 全局主题 / 语言 / 尺寸注入机制
- [ ] 已有组件补齐单元测试（rc-notification / rc-virtual / rc-hooks / rc-app-main-layout）
- [ ] rc-dialog / rc-table 发布正式版本号
- [ ] 组件文档站点完善（lignify demo/mdx）
- [ ] 深色主题切换（语义层 CSS 变量覆盖）
- [ ] Markdown prose 排版令牌

### 中期目标

- [ ] **P1 组件交付** — Tabs、Breadcrumb、Pagination、Grid、Icon、Textarea、InputNumber、TimePicker、Upload、Badge、Avatar、Card、Collapse、Popover、Progress、Skeleton、Spin、Drawer
- [ ] npm 发布流程（自动化版本管理 + CHANGELOG）
- [ ] 无障碍（a11y）合规审查
- [ ] 性能基准（打包体积 + 运行时）
- [ ] 国际化（i18n）基础支持

### 长期目标

- [ ] **P2 / P3 组件交付** — 补齐剩余 20 个组件
- [ ] 设计令牌多平台产物（iOS / Android / Figma）
- [ ] 可视化令牌编辑器
- [ ] **组件库 v1.0 稳定版发布**

---

## 四、组件依赖关系

```
rc-token-global ──→ rc-token-semantic

rc-button ──────────→ rc-dialog
rc-button ─┬────────→ rc-dropdown-container ──→ rc-date-picker
rc-line-edit─┘                               ├──→ rc-color-picker ←── rc-slider

rc-hooks ──┬────────→ rc-tree
rc-virtual─┘
rc-virtual ─────────→ rc-table
rc-menu ────────────→ rc-app-main-layout
```
