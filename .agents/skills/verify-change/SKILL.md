---
name: verify-change
description: 不确定一次改动要跑哪些检查、需要全量验证入口、或本地与 CI 失败要定位原因时使用。覆盖变更类型到最小充分验证、yarn check 全量链路、生成物漂移与缓存排查、验证结果报告规范。交付前确认证据完整性时加载本技能。
---

# 验证与报告

## 何时使用

- 要判断一次改动的最小充分验证范围。
- 本地或 CI 失败，需要区分环境、依赖、生成物漂移与缓存。
- 交付前写清已验证与未验证范围。

## 变更类型 → 最小充分验证

| 改动 | 至少运行 |
| --- | --- |
| 组件源码、类型、测试 | `yarn workspace @crab-dev/rc-<name> check` |
| 令牌 | 包内 `generate:token`、`yarn check:tokens` |
| 产品清单、拓扑 | `yarn check:architecture`、`yarn test:architecture` |
| 文档站 | 站点 `generate:docs`、`check:docs`、`test:generator`、`yarn docs:build` |
| 依赖、导出 | `yarn install --immutable`、`yarn build:library`、`yarn check:exports`、`yarn check:consumer` |
| 根脚本、命令契约 | `yarn lint:tools`（含 `test:lint`、`test:architecture`） |
| 提交 | pre-commit 跑 `yarn typecheck`、`yarn lint`、`yarn test` |

## 全量入口

`yarn check` 依次执行：

`check:architecture` → `check:tokens` → `check:generated:local` → `lint` → `build:library` → `check:exports` → `check:consumer` → `typecheck` → `test` → `test:required` → `docs:build`

它耗时长，用于跨包改动、发布前或维护者要求时。局部改动用上表，并在交付说明里写清跳过了什么。

## 失败排查顺序

1. 命令是否从仓库根执行；Node ≥ 22；Yarn 4 PnP（Corepack 指定版本）且没有 `node_modules`。
2. 生成物漂移：`yarn check:generated:local` 会重新生成并比对，先改源再重跑，不要反向改生成物。
3. 依赖变化后是否跑了 `yarn install --immutable`，lockfile 与 PnP 运行时是否一致。
4. 缓存：命中的 `.turbo` 旧输出可能掩盖问题；清对应缓存或按当前 Turbo 版本的 `--help` 加 `--force` 重跑目标任务。
5. 环境差异：浏览器、日期/Intl、平台能力的测试按包内声明的环境判断，不改成 DOM 测试掩盖。
6. 必跑项是否漏跑：`yarn test:required --list` 列出全部登记项。

## 报告

- 写实际执行的命令与真实结果；通过、失败、跳过、未覆盖分开列。
- 测试、构建、截图、人工评审不能互相替代。
- 视觉结论绑定具体源码与产物；失败原图和前提错误的采集分别保留。
- 不把“没跑”写成“已验证”，不引用历史证据充当当前结论。

