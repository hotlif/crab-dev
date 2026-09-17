# ConfigProvider 验证记录

日期：2026-09-17。环境：Windows / PowerShell 7.6.5、Node 22.15.0、Corepack Yarn 4.18.0、Wake 0.1.43、Crab CSS 0.1.38。

## 已通过

- `yarn install --immutable`：锁文件与 PnP 映射一致。
- `rc-config-provider` 包内 `yarn check`：lint 无错误或告警、类型检查通过、5 项测试通过。覆盖默认配置、字段继承、嵌套与兄弟隔离、动态更新、React 19 ref 清理和 Portal 重新建立主题边界。
- `rc-button` 包内 `yarn lint`、`yarn test`、`yarn typecheck`：27 项测试通过，覆盖显式尺寸 > Group > Provider 的优先级及 Group 间距。
- `rc-empty` 包内同样三项检查：14 项测试通过，覆盖英文预置文案、动态语言更新及显式文案/null 的优先级。
- `rc-theme` 包内 `yarn test`：7 项主题契约测试通过，包括 Light、Dark 与 forced-colors。
- 构建命令执行了受影响组件的 `generate:token`；没有令牌产物差异。
- `rc-config-provider` 的 `generate:docgen` 与文档站 `generate:docs`：所有产物由生成器写入。
- 文档站 `lint`、`typecheck`、`check:docs`：无错误或告警，无生成漂移；文档生成器 26 项测试通过。
- 根目录 `yarn docs:build`：53 个组件构建成功，81 条文档路由构建成功，1898 个生产 JavaScript 文件的引用检查通过，未发现未绑定引用。

## 生产页面浏览器检查

运行 `.website/scripts/preview-docs.mjs`，访问 `/components/rc-config-provider`，进入“交互切换与局部覆盖”：

| 检查 | 结果 |
| --- | --- |
| Light → Dark → Light | 背景在 `oklch(1 0 0)` 与 `oklch(0.14 0.004 286)` 间切换；color-scheme 同步更新 |
| Dark 中嵌套 Light | 内层背景保持 `oklch(1 0 0)`，语言继承 en-US |
| zh-CN → en-US | Empty 实时显示 No data 及英文描述 |
| middle → large | 继承尺寸的按钮高度从 32px 到 40px；显式 small 始终 24px；内层按钮同步变大 |
| 页面主题隔离 | 示例切换不修改 documentElement 的主题 |
| 键盘 | Tab 到 dark 后有 solid focus-visible 焦点环，空格可切换主题 |
| 320px 视口 | 文档和预览均无水平溢出；选项自动换行，焦点环可见 |
| 工作台 | “嵌套配置与主题边界” iframe 正常加载，显示 dark / light / dark 三个配置区域 |
| 控制台 | 示例检查期间未记录 error 或 warn |

## 验证限制

文档站完整 `yarn test` 尚未通过：现有 componentDemos、tutorial、ui 等测试直接导入 CSS，Wake 0.1.43 的测试模块解析将 CSS 当作 JavaScript；资料编辑测试另遇到 Framer Motion 的 `Cannot redefine property: VisualElement`。本次没有升级固定工具版本或改动这些测试。

同样的 CSS 解析限制也影响直接导入教学示例的 DOM/browser 测试，因此示例交互和真实 CSS 以以上生产页面浏览器结果验收；组件行为由包内 Wake 测试覆盖。

Yarn 安装仍显示 peer dependency 提示，Turbo 仍显示原有 Button / Spin / Menu / Masonry / ComponentPreview 开发依赖环；新增 Provider 不在该环中。

自动语言消费首批为 Empty，自动尺寸消费首批为 Button / ButtonGroup。其他组件可用 `useConfig()` 接入。主题 CSS 需由应用显式加载；Portal 的 CSS 继承边界需要由挂载位置或额外 Provider 明确建立。
