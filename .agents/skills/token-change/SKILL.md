---
name: token-change
description: 修改颜色、排版、形状、尺寸、动效或语义令牌时使用。覆盖 L1/L2/L3 分层选择、$ref 与 OKLCh 规则、generate:token 生成、check:tokens 契约校验和设计体系覆盖边界。排查令牌契约失败或组件需要新变量时加载本技能。
---

# 令牌改动

## 何时使用

- 改设计令牌值、新增语义角色，或组件样式需要新变量而不是硬编码。
- `yarn check:tokens` 失败，需要定位是分层、引用还是键名问题。

## 三层

| 层 | 位置 | 职责 |
| --- | --- | --- |
| L1 全局 | `components/rc-token-global/token.toml` | 原始尺度：颜色（OKLCh）、字号、间距、动效、触控尺寸 |
| L2 语义 | `components/rc-token-semantic/token.toml` | 语义角色，以及设计体系 / 明暗 / 密度映射 |
| L3 组件 | `components/rc-*/token.toml` | 组件局部变量，用 `$ref()` 引用上层 |

L3 的 `[build]` 声明 `output`、`prefix` 与 `imports`，默认输出 `src/token.ts`；个别包用 `package.json#crab.generatedArtifacts["generate:token"]` 声明额外生成物。

## 流程

1. 先定层级：原始值进 L1，角色与体系差异进 L2，组件私有进 L3。能用 `$ref()` 就不复制值。
2. 颜色写 OKLCh；设计体系、明暗、密度的覆盖只在 L2 完成，组件不按旧设计名分支。
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

## 常见错误

- 在组件里写死颜色、间距或时长，或内联样式绕过令牌。
- 把设计体系差异塞进 L3，或按 `material` / `macos` 旧名分支。
- 直接改 `src/token.ts`、`css/` 产物或发布包里的 CSS。
- 契约失败后放宽 `scripts/check-token-contract.mjs`，而不是修令牌。
- 只改 L2 值却没重新生成，留下过期 `src/token.ts`。

## 完成定义

- 源 TOML 与生成物同步，`check:tokens` 通过。
- 涉及的体系、明暗、尺寸已实际核对；未核对的范围标注为未验证。
