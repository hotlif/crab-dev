# Wake 0.1.45 的 cx 修复验收

日期：2026-09-17。承接用户要求“更新到最新的 Wake，查看 cx 功能是否实现”。

## 升级结果

通过 npm 官方注册表查询，`@crab-dev/wake` 与 `@crab-dev/css` 的 `latest` 均为 `0.1.45`。56 处 Wake 直接依赖、52 处 Crab CSS 直接依赖统一精确锁定到该版本；同步更新项目约定，由 Yarn 生成 lockfile 与 PnP 映射。

首次安装遇到 Windows 文件锁：运行中的本仓库 Wake 0.1.44 文档开发服务占用了原生模块。核实进程后停止旧服务，重新安装及 `install --immutable` 均通过。新版开发服务已在 `http://127.0.0.1:5173/` 启动，生产预览在 `http://127.0.0.1:4175/`。

## cx 修复的实际实现

核对 Wake 仓库 `engineering/releases/0.1.45.md`、`wake_css_in_js` 的 `cx_replacement` 以及 `wake_bundler` 的产物执行回归测试：

- `cx()` API 此前已经存在；本次修复的是编译后的变量绑定丢失。
- 含变量、条件、数组、对象及嵌套表达式的调用保留原 AST 和类名合并函数，不再把参数源码拼接成脱离原作用域的新表达式。
- 仅安全的简单字面量调用折叠成字符串，不再引入可被局部变量遮蔽的 `Boolean` 引用。
- CSS 样式仍在构建期提取。保留类名合并函数不意味着恢复运行时 CSS 注入，也没有重新引入 Motion。

## 当前仓库的真实复现

撤除此前为绕过绑定问题而合并样式的两处处理，恢复正常组合：

```tsx
// Dialog：局部样式变量 + 内联静态 css
className={cx(fadeStyle, css`/* overlay geometry */`)}
className={cx(contentMotionStyle, css`/* content geometry */`)}

// Menu：两个局部样式变量
className={cx(ulStyle, ulChildrenStyle)}
```

样式值和交互逻辑保持一致；Dialog 的减少动画、强制颜色规则继续保留。没有修改生成的构建产物来规避检查。

## 自动验证

| 检查 | 结果 |
| --- | --- |
| `yarn install --immutable` | 通过；仍有原有 peer 和 PnP loader 提示 |
| `yarn build:library` | 53 / 53 任务通过，Wake 0.1.45 |
| `yarn lint` | 54 / 54 任务通过；0 个 lint 错误、0 个警告 |
| `yarn typecheck` | 108 / 108 任务通过，包含依赖构建 |
| 组件及预设 Wake Test | 53 个包，1,385 项通过，0 失败 |
| 文档生成检查 | 53 个组件页、56 份教程、124 个教学示例、247 个 Demo；0 个文件变化 |
| 生产文档 | 81 个路由、2,569 个文件；构建成功 |
| 生产绑定检查 | 1,899 个 JavaScript 文件，0 个未绑定引用 |

全仓 `yarn test --continue` 为 106 / 107 任务成功，唯一失败任务是文档站测试：45 项通过、14 项失败。失败用例和上一轮一致，仍涉及角色查询、替身、异步断言及其 act / timeout 清理问题，详见 [CSS 动画迁移记录](./css-motion-migration.md)。没有跳过失败用例或压制告警，不能宣称整仓测试全部通过。

## 页面实测

- 开发版 Dialog：遮罩和内容各得到两个正确类名，opacity 入场过渡实际运行，取消后焦点恢复；无浏览器错误。
- 生产版 Dialog：两种变量与内联 `css` 的组合正常；遮罩、表面、文字和按钮显示正确，200ms 入场过渡生效。取消后原生 dialog 关闭、背景滚动恢复、焦点回到“查看说明”；错误日志为空。
- 生产版 Menu 工作台：子菜单包含 `ulStyle_… ulChildrenStyle_…` 两个类名；“系统管理”可展开并显示“菜单维护 / 数据字典维护”。展开、收起的 Grid 行高过渡生效；错误日志为空。
- 开发版 Menu 工作台：两次导航均遇到浏览器控制连接超时，无法完成该模式的页面验收；这不作为 `cx()` 失败的证据，也不标记为通过。生产模式已独立验收。

结论：本仓库此前两处 `cx()` 编译绑定问题，在 Wake / Crab CSS 0.1.45 的生产构建和实际页面中均已验证修复，可以保留正常 `cx()` 写法。
