<div align="center">
	<h1>里程碑</h1>
</div>

> 最后更新：2026-04-21 &nbsp;|&nbsp; 当前阶段：**Alpha（v0.x）**

---

## 总览

```
组件进度    █████████████░░░░░░░░░░░░░░░░░░░  27 / 63（43%）
基础设施    ████████████████████████████████  全部就绪
工具链      ████████████████████████████████  4/4 已发布
工程规范    ████████████████████████████████  3/3 已发布
设计令牌    ████████████████████████░░░░░░░░  核心完成，深色主题待适配
```

| 指标 | 数值 |
|------|------|
| ✅ 已完成组件 | 27 |
| 🚧 开发中组件 | 1（Table） |
| 🔴 P0 核心缺失 | 0 |
| ⬚ 待规划组件 | 37（P1: 16 · P2: 14 · P3: 7） |

---

## 一、已完成的基础设施

| 领域 | 内容 |
|------|------|
| **Monorepo** | Turbo + Yarn 4 PnP + Corepack |
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
| AppMainLayout | ✅ | `0.0.3` | ✅ | ✅ | 应用主布局（标签栏 + 侧边栏折叠） |
| Masonry | ✅ | `0.0.1` | ✅ | ✅ | 瀑布流布局 |
| Grid | 🟡 | — | — | — | 栅格系统（Row / Col，响应式） |
| Space | 🔵 | — | — | — | 间距容器 |
| Divider | ⚪ | — | — | — | 分割线 |

### 导航

| 组件 | 状态 | 版本 | 测试 | 令牌 | 说明 |
|------|:----:|------|:----:|:----:|------|
| Menu | ✅ | `0.0.2` | ✅ | ✅ | 菜单（含 inline-collapsed 折叠模式） |
| Tabs | ✅ | `0.0.1` | ✅ | ✅ | 标签页（line / card / pill 三种形态） |
| Breadcrumbs | ✅ | `0.0.1` | ✅ | ✅ | 面包屑（含 maxCount 截断 + 自定义分隔符） |
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
| DatePicker | ✅ | `0.0.1` | ✅ | ✅ | 日期选择器 |
| ColorPicker | ✅ | `0.0.1` | ✅ | ✅ | 颜色选择器 |
| **Select** | ✅ | `0.0.1` | ✅ | ✅ | 下拉选择（单选 / 多选 / 搜索） |
| Checkbox | ✅ | `0.0.1` | ✅ | ✅ | 复选框（含 Group） |
| Radio | ✅ | `0.0.1` | ✅ | ✅ | 单选框（含 Group） |
| Switch | ✅ | `0.0.1` | ✅ | ✅ | 开关 |
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
| Virtual | ✅ | `0.1.1` | ✅ | — | 虚拟滚动（含滚动条 Pointer 拖拽优化，100% 覆盖率） |
| ComponentPreview | ✅ | `0.0.1` | ✅ | ✅ | 组件预览 |
| Table | 🚧 | — | — | ✅ | 表格（虚拟滚动 + 排序 + 筛选） |
| **Tooltip** | ✅ | `0.0.1` | ✅ | ✅ | 文字提示（Floating UI + CSS 箭头） |
| Tag | ✅ | `0.0.1` | ✅ | ✅ | 标签 |
| Badge | ✅ | `0.0.1` | ✅ | ✅ | 徽标数（计数 / 圆点 / 状态点） |
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
| Notification | ✅ | `0.0.1` | ✅ | ✅ | 通知提示 |
| **Alert** | ✅ | `0.0.1` | ✅ | ✅ | 警告提示（内联） |
| **Message** | ✅ | `0.0.1` | ✅ | ✅ | 全局消息（轻量反馈） |
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
| **Prose** | ✅ | `0.0.1` | ✅ | ✅ | Markdown 排版容器（prose / 尺寸变体 / invert） |
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
| rc-date-picker 完善交互与测试 | ✅ 已完成 |
| rc-color-picker 完善交互与测试 | ✅ 已完成 |
| rc-alert 警告提示组件 | ✅ 已完成 |
| rc-tooltip 文字提示组件 | ✅ 已完成 |
| rc-tag 标签组件 | ✅ 已完成 |
| rc-table 核心功能开发（新增过滤栏与受控筛选 API） | 🚧 进行中 |
| rc-virtual 滚动条拖拽升级 Pointer Events | ✅ 已完成 |
| rc-masonry 瀑布流布局组件 | ✅ 已完成 |
| lignify 集成 rc-masonry 替换手动瀑布流布局 | ✅ 已完成 |
| rc-notification 补充单元测试 | ✅ 已完成 |
| rc-prose Markdown 排版组件 | ✅ 已完成 |
| RFC-MARKDOWN-THEME prose 令牌实现 | ✅ 已完成 |
| rc-breadcrumbs 面包屑组件 | ✅ 已完成 |
| rc-menu inline-collapsed 折叠模式 | ✅ 已完成 |
| rc-app-main-layout 标签栏 + 侧边栏折叠 | ✅ 已完成 |
| rc-virtual 分支覆盖率达 100% | ✅ 已完成 |
| rc-tabs 标签页组件 | ✅ 已完成 |
| 深色主题语义令牌适配 | 🚧 进行中 |

### 短期目标

- [x] **P0 组件交付** — Message
- [ ] **ConfigProvider** — 全局主题 / 语言 / 尺寸注入机制
- [ ] 已有组件补齐单元测试（rc-hooks）
- [x] rc-app-main-layout 补充单元测试
- [x] rc-dialog / rc-table 发布正式版本号
- [x] 组件文档站点完善（lignify demo/mdx）
- [ ] 深色主题切换（语义层 CSS 变量覆盖）
- [x] Markdown prose 排版令牌
- [x] **P1 组件交付** — Breadcrumbs、Tabs

### 中期目标

- [ ] **P1 组件交付** — Pagination、Grid、Icon、Textarea、InputNumber、TimePicker、Upload、Badge、Avatar、Card、Collapse、Popover、Progress、Skeleton、Spin、Drawer
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
rc-masonry ─────────→ lignify (template)
```
