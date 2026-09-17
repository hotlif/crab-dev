# Radio 的 Material Design 3 视觉适配

日期：2026-09-18。承接 Radio 基线修复，按用户指定的 Material Design 3 方向调整视觉与交互。

## 参考与取舍

- [Material Design 3 Radio](https://m3.material.io/components/radio-button/overview)。该页面需要 JavaScript，具体尺寸与状态角色同时核对官方 [Material Web Radio](https://material-web.dev/components/radio/) 及其 [Radio 令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-radio-button.scss)。
- 采用品牌色圆环和同色圆点、透明背景、40px 圆形状态层和 48px 粗指针命中区；默认图形为 20px，small / large 为 16 / 24px，圆点分别为 8 / 10 / 12px。
- 保留 Crab 的 Props、L2 明暗及单色品牌机制、禁用透明度和 `motion.interaction`。不引入 Material 组件依赖或运行时动画库。
- 与此次变更之前的基线报告相比，视觉尺寸和交互区有意更新；状态切换时保持相同 DOM、固定 2px 描边及固定布局的原则不变。

## 实现

- 交互区、视觉圆环、常驻绝对定位圆点分层；标签悬停也会触发 8% 状态层，聚焦和按压为 12%。键盘焦点另有 2px 轮廓。
- 选中环与圆点通过 L3 消费 L2 品牌色；禁用使用中性色与单次禁用透明度，保留选中形状，取消反馈与过渡。
- 保留减少动画与强制颜色媒体规则，支持 `aria-invalid` 校验色。RadioGroup 透传 `aria-label`、`aria-labelledby` 和 `aria-describedby`。
- Table 的选择单元格沿用既有 32px 交互区令牌，同时约束 Radio，防止 40 / 48px 的独立控件目标超出紧凑行。
- 文档第 3 步增加可操作的明暗对照：紫 / 蓝 / 绿品牌切换、可用 / 禁用 / 校验提示、三档尺寸。样式仍由 Wake 自动加载。

## 自动验证

- Radio：令牌生成、库构建、lint、类型检查、docgen 通过；24 项 Wake 测试通过。
- Table：令牌生成、库构建、lint、类型检查通过；适配后的 104 项 Wake 测试通过。
- 文档：生成一致性、lint、类型检查通过；26 项生成器测试通过。
- 最终生产构建：81 路由、2,574 文件；1,902 个生产 JavaScript 文件未发现未绑定引用。
- 受影响文件 `git diff --check` 通过。未重复执行全仓测试。

## 浏览器实测

生产预览 `http://127.0.0.1:4175/components/rc-radio`：

- 双主题状态矩阵中 22 个标签的外层、交互区、圆环及文字，频率和三档尺寸切换前后的相对坐标 / 尺寸最大差为 0px。
- 独立基础示例未选中 → 选中：外层 79.34375×40px，圆环 20×20px，外层、圆环、文字坐标不变，未复现旧基线问题。
- 浅色 / 深色选中圆环和圆点使用对应品牌色，内部透明；圆环实际为 16 / 20 / 24px，描边始终 2px。
- 紫、蓝、绿切换均更新两种主题的品牌色，禁用选项继续保持中性色。
- 原生 ArrowLeft 切换组内选中并显示 2px 焦点环；稳定后焦点状态层透明度 0.12，鼠标停留项为 0.08，取消选中圆点透明度为 0。
- 320×720 视口下，两个主题示例内部 clientWidth / scrollWidth 均为 185px，无内部横向溢出；恢复原视口。
- Table 行选中演示切到单选：交互区与状态层均为 32px，相邻行间距 35px；切换后前四行圆形控件的坐标和尺寸均不变，选中数量为 1。
- 本轮页面错误日志为空。

浏览器工具没有持续按住鼠标、粗指针、系统强制颜色及减少动画的模拟接口；这些分支已实现和检查源码，未将其列为设备实测通过。
