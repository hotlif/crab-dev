# Checkbox MD3 视觉验收

日期：2026-09-17。

以 [Material Web Checkbox 官方令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-checkbox.scss) 为视觉基准，保留 Crab 的三档尺寸、L2 语义配色与 `motion.interaction`。没有引入第三方 UI 依赖。

## 实现

- 默认方框 18px，描边与圆角均为 2px；small / middle / large 方框分别为 16 / 18 / 20px。
- 独立控件使用 40px 圆形状态层；hover 为 8%，focus / pressed 为 12%。粗指针 CSS 将命中区域扩展为 48px。
- 选中和半选分别用勾选与横杠表达，图标常驻并绝对定位；固定描边、外框及行内对齐，避免状态切换改变布局。
- 品牌色、暗黑模式与错误色消费 L2 变量；禁用使用中性颜色与 38% 透明度；保留焦点环、系统强制颜色及减少动画规则。
- Select 选项自身负责交互，内部 Checkbox 保持 18px 装饰区域。Table 选择列使用 32px 紧凑目标与状态层，适配默认 35px 行高。
- 文档教程新增第 3 步「MD3 状态与明暗主题」，可切换品牌色、全选 / 半选、错误状态，并对照两种主题。

## 浏览器实测

使用本地生产预览的 Chrome 页面进行点击、键盘操作、截图及 DOM 几何量测。

| 场景 | 结果 |
| --- | --- |
| 基础复选框选中 → 未选中 → 选中 | 方框 18×18px，外层 128×40px；方框、标签和外层坐标变化均为 0px |
| 半选 → 全选 | 横杠切换为勾选，外层与方框坐标不变 |
| 三种尺寸 | 方框分别 16 / 18 / 20px，独立控件外层高度均为 40px |
| 键盘 Space | 选中状态正常更新，focus-visible 环为 2px，状态层透明度为 12% |
| 悬停整段标签 | 状态层透明度为 8%，方框和标签不移动 |
| 禁用选中项 | 点击后仍选中，透明度为 38%，不显示悬停状态层 |
| 明暗主题换色 | 紫色切换绿色后，两侧品牌填充同时更新；暗黑使用较亮填充和较深标记 |
| 暗黑半选 / 全选 / 清空 | 三态方框和标签坐标不变 |
| 错误提示 | 勾选服务条款后 aria-invalid=false，红色轮廓恢复品牌填充 |
| 320px 视口 | 明暗面板纵向排列，宽度均为 235px；页面及面板无横向溢出 |
| Select 多选 | 选项保持 32px 高，18px 方框切换前后位置不变 |
| Table 选择列 | 32px 目标位于 40×35px 单元格内，纵向偏移 1.5px；选中不改变行高 |
| 最终示例控制台 | 无 error 日志 |

48px 粗指针、forced-colors 和 reduced-motion 已在 CSS 中实现；本轮未进行真实触控设备或操作系统辅助显示设置验收。

## 自动验证

- Checkbox：lint、typecheck、library build 通过，21 项测试通过。
- Select：lint、typecheck、library build 通过，24 项测试通过。
- Table：lint、typecheck、library build 通过，104 项测试通过。
- 文档：26 项生成器测试通过，lint、typecheck 通过；生成器覆盖 53 个组件页、121 个教学示例、247 个 Demo。
- 文档生产构建：81 条路由通过；1,898 个生产 JavaScript 文件检查通过，0 个未定义引用。

验证范围为本次改动及直接受影响的集成，不代表全仓历史测试问题已解决。
