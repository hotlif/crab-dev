# 令牌兼容别名清理（2026-09-23）

本次移除了 `--switch-transition` 一类额外变量回退，统一由 `token.toml` 生成的正式变量提供覆盖入口。保留正式 L1 / L2 / L3 引用和必要的变量联动；不修改默认颜色、尺寸或动效参数。

## 修改范围

- 44 个包的 TOML 清理了 571 个非正式变量名；其中倒计时变量迁移到正式进度令牌。共享 L2 变化通过生成命令传播到下游。
- 移除 `scripts/token-compatibility.json`，令牌契约检查改为拒绝未定义的 CSS 变量引用；保留命名、分层、引用环及其他已有检查。
- 移除 7 份手写 `token-vars.ts` 兼容映射。保留已有 `TokenVars`、`vars` 等具名导出，但统一指向生成的正式映射，不再提供旧键。
- 修正 13 个不符合命名规则的令牌路径，并迁移其组件消费点。
- Message / Notification 通过生成的 `vars` 写入倒计时时长与延迟；AvatarGroup 间距使用正式变量。Dialog 的 top、transform、max-height 继续共享正式顶部坐标覆盖。
- 更新组件文档、文档站、演示和回归测试；生成文件均通过仓库命令刷新。

## 消费方迁移

这是对旧自定义变量和旧映射键的破坏性调整。已使用正式变量的消费方无需修改；旧 CSS 覆盖须改用组件公开的 `TokenVars`。

| 旧名称 / 键 | 正式名称 / 键 |
| --- | --- |
| `--switch-transition` | `--switch-root-transition` |
| `--avatar-group-overlap` | `--avatar-group-margin` |
| `--dialog-top` | `--dialog-root-top`，顶部坐标和居中计算继续联动 |
| `--drawer-transition-duration` | `--drawer-panel-animation-duration` |
| `--message-countdown-duration` / `--message-countdown-delay` | `--message-progress-animation-duration` / `--message-progress-animation-delay` |
| `--notification-countdown-duration` / `--notification-countdown-delay` | `--notification-progress-animation-duration` / `--notification-progress-animation-delay` |
| `spinVars['ring.track-color']` | `TokenVars['ring.track.stroke']` |
| `vars['size.large.border.radius']` | `TokenVars['size.large.border-radius']` |
| `--token-semantic-color-feedback-error` | 按用途覆盖 `error-text`、`error-icon`、`error-border`、`error-solid` 对应的正式变量 |

[migration.json](./migration.json) 记录全部移除变量的原消费令牌与路径重命名。`aliases` 的数组表示旧变量曾影响哪些正式令牌，并非所有条目都能机械地一对一替换；复合属性与反馈角色需要按用途迁移。

## 验证

- `corepack yarn generate:token`：49 个令牌包通过。
- `corepack yarn check:tokens`：49 个令牌包通过，原 14 项失败已消除。
- `corepack yarn build:library`：54 项任务通过。
- `corepack yarn lint`：55 项任务通过，零错误、零告警。
- `corepack yarn test`：109 项任务通过，1,649 项测试通过，无失败、无 pending。
- `corepack yarn typecheck`：110 项任务通过。
- 文档使用 `corepack yarn workspace @crab-dev/website generate:docs` 刷新，`check:docs` 确认无生成漂移；`git diff --check` 通过。
- 2,526 个生成令牌的回退表达式与清理前去除旧别名后的表达式一致；13 个键按重命名映射比较，Dialog 顶部计算显式保留正式变量联动。见 [default-equivalence.json](./default-equivalence.json)。
- 活动组件源码和演示中的被移除变量引用为 0；生成令牌中的未定义变量引用为 0。剩余 51 处 TOML 原生变量引用均指向正式令牌，用于同层联动等表达。
