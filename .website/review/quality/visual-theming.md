# 视觉尺度与单色主题验收（2026-09-17）

本轮针对颜色、留白、边框、状态过渡与暗黑层次。直接调整 Button、LineEdit、TextEdit、Select、Checkbox、Radio、Switch、Card、Divider、Tabs、Menu、Drawer、ColorPicker；共享 L2 变更同时更新下游令牌回退。没有修改分页、键盘导航等无关行为。

## 视觉调整

| 问题 | 修改后的规则 |
| --- | --- |
| 暗黑主按钮按下接近白色，品牌色相中断 | 默认 Purple 80，悬停为 80/90 等量 OKLCh 混合，按下为 Purple 90 |
| 内容分隔与输入控件使用相同强边框 | Card、Divider、Tabs、Menu 横向边界、Drawer 内部分隔使用 border.subtle；控件边界保留 border.default |
| small 按钮横向 6px、输入与选择器 12px | 统一使用新增的 control-padding-x-small：8px |
| large 按钮 18px / 8px 圆角与表单不一致 | Button、LineEdit、Select 对齐 40px 高、16px 字号、6px 圆角；Checkbox / Radio 大号标签为 16px |
| Select 100ms、Card 200ms、Tabs 120/240ms 混用 | 即时状态统一 motion.interaction：150ms；Card 包含背景过渡，封面缩放保留 expand；Tabs / Menu 补齐减少动画规则 |
| 暗黑 elevated Card 与底面相同，黑色阴影难辨 | 使用 elevated 表面和弱边框，保持外尺寸稳定 |
| 暗黑未选中 Switch 的滑块融入轨道 | 新增 control.thumb / track / track-hover 角色；选中滑块使用 on-brand；清除工作台旧滑块色覆盖 |
| Button 外观示例缺失 gap 回退 | 直接消费 component-gap：8px |
| ColorPicker 不同长度标签使轨道错位 | 标签使用共享列宽，四条轨道起点一致 |

## 单色主题

```tsx
<ConfigProvider brandColor="#1677ff" theme="dark">
    <App />
</ConfigProvider>
```

- 接受不透明 #RGB / #RRGGBB。省略时继承，null 恢复默认紫色；无效输入抛出 RangeError。
- 从种子色生成 Light / Dark 两组 OKLCh 品牌角色，保持色相、调整亮度和色度以兼顾 sRGB 色域与可读性。
- 联动按钮默认/悬停/按下、链接、焦点、选中和品牌填充。中性背景、反馈及未选中开关轨道保持独立。
- 运行时只在 Provider 边界声明 L2 变量，组件 CSS 仍静态生成。支持 nonce，不改 html/body；强制颜色模式跳过品牌覆盖。
- 纯函数 createBrandTheme / normalizeBrandColor 由 rc-token-semantic 导出。未增加依赖，不处理 SSR。

## 自动验证

| 检查 | 结果 |
| --- | --- |
| generate:token | 已运行，源定义与生成文件同步 |
| 全仓 lint | 54 个任务通过，原生 Lint 0 错误 / 0 告警 |
| 全仓 typecheck | 108 个任务通过（含依赖构建） |
| build:library | 53 个库包通过 |
| 全仓组件及标准包测试 | 1,371 项通过，Drawer 1 项既有失败；其余包通过 |
| 新增主题测试 | 125 种 RGB 样本覆盖主按钮三态、链接、焦点、选中及色域；标准化、非法输入、色相连续性通过 |
| ConfigProvider | 共 7 项通过，覆盖嵌套、Portal、局部重置、动态更新、nonce、StrictMode 与样式清理 |
| Theme | 共 8 项通过，覆盖暗黑三态和开关对比度 |
| 文档生成器 / 一致性 | 26 项通过；53 个组件页、120 个教学示例、247 个 Demo，检查模式 0 个变化 |
| 文档设计配色契约 | 4 项通过；测试颜色解析器新增 OKLCh 混色支持 |
| 最终文档生产构建 | 81 条路由通过；1,897 个生产 JavaScript 文件检查通过，0 个未定义引用 |

已有的 Turbo 循环包拓扑警告仍存在。本轮未增加包依赖。

全量测试未标记为全绿：Drawer 的 dialog 名称查询失败；文档站 React 测试有 CSS 被当作 JS 解析、motion 模块加载错误和动效角色名称查询失败，结果为 2 个文件通过 / 5 个失败，20 项通过 / 1 项失败 / 4 项 pending。范围和错误与 [工具链验收记录](../toolchain/README.md) 一致，没有删除断言或增加跳过。

## 浏览器实测

生产预览的 ConfigProvider 教程新增第 3 步“一个品牌色，对照明暗主题”，可输入颜色、选择预设和尺寸，同时操作两侧控件。

- 蓝色改绿色后，两侧按钮、选中和开关联动，局部重置仍为紫色。
- 小号 Button / LineEdit / Select 实测均为 24px 高、8px 横向内边距、6px 圆角；大号为 40px 高、16px 字号、6px 圆角。
- 相关控件的实际 transition 为 0.15s；暗黑输入聚焦保留品牌边框和柔和外环。
- 展开暗黑 Select 后，Portal 仍位于 dark 边界内并继承当前品牌色；选项和中性底面可区分。
- 1440px 视口下浅色与暗黑并排；320px 下转为纵向，页面无横向溢出，两个面板宽度均为 235px。
- ColorPicker 四个标签列宽均为 64px，滑轨起点一致；Switch 独立工作台在明暗两种主题中具有不同的轨道/滑块颜色。
- 最终构建复验白色种子仍生成可读配色；不完整输入显示错误提示并保留上一个有效主题，控制台无运行错误。

数值和截图检查覆盖上述场景；不等同于全库所有业务组合、操作系统强制颜色或辅助技术已经完整验收。
