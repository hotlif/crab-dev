---
name: token-change
description: 修改颜色、排版、形状、尺寸、动效或语义令牌时使用。覆盖 L1/L2/L3 分层选择、$ref 与 OKLCh 规则、generate:token 生成、check:tokens 契约校验和设计体系覆盖边界。排查令牌契约失败或组件需要新变量时加载本技能。
---

# 令牌改动

## 何时使用

- 改设计令牌值、新增语义角色，或组件样式需要新变量而不是硬编码。
- `yarn check:tokens` 失败，需要定位是分层、引用还是键名问题。

## 三层

先运行 `yarn ai:context <令牌文件或包名>`，按实际修改读取[组件规则的样式与设计体系](../../../components/AGENTS.md#样式与设计体系)及[设计规范](../../../.website/docs/guides/design-styles.mdx)。分层与颜色约束以规则和规范为准。

| 层 | 位置 | 职责 |
| --- | --- | --- |
| L1 全局 | `components/rc-token-global/token.toml` | 原始尺度 |
| L2 语义 | `components/rc-token-semantic/token.toml` | 语义角色，以及设计体系 / 明暗 / 密度映射 |
| L3 组件 | `components/rc-*/token.toml` | 组件局部变量 |

L3 的 `[build]` 声明 `output`、`prefix` 与 `imports`，默认输出 `src/token.ts`；个别包用 `package.json#crab.generatedArtifacts["generate:token"]` 声明额外生成物。

## 流程

1. 先按规则确定修改层级，再查引用该角色的消费方；`--dependents` 可补充直接使用方，不能替代逐层影响分析。
2. 修改源 TOML 与必要的生成器，确认引用解析及受影响角色。
3. 生成：
   - 单包 `yarn workspace @crab-dev/rc-<name> generate:token`
   - 全库 `yarn generate:token`（Turbo 按令牌依赖序执行）
4. 不手改 `src/token.ts`。它会被生成覆盖；漂移由 `yarn check:generated:local` 的重新生成比对暴露。
5. 跑契约 `yarn check:tokens`：校验 L1/L2 存在、必需语义角色、键名规范（kebab-case 点路径）、`$ref` 可解析与反馈/状态角色完整性。
6. 令牌影响面大，按范围核对三体系 × 明暗 × 尺寸的真实构建 CSS；必要时在浏览器里读 `--*` 计算值。
7. 视觉可感知变化补 changeset。

## 验证

| 改动 | 至少运行 |
| --- | --- |
| L1 / L2 值 | `yarn generate:token`、`yarn check:tokens`、`yarn workspace @crab-dev/rc-token-global check` |
| L3 组件令牌 | 包内 `generate:token`、`yarn check:tokens`、包内 `check` |
| 密度、几何生成 | 上述 + `yarn workspace @crab-dev/rc-token-semantic check` |

`rc-token-semantic` 的 `generate:token` 还会执行 `scripts/generate-density-geometry.mjs`，不要绕过包脚本手工只跑 `wake library token`。

## 完成定义

- 源 TOML 与生成物同步，`check:tokens` 通过。
- 涉及的体系、明暗、尺寸已实际核对；未核对的范围标注为未验证。
