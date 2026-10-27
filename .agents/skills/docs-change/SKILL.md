---
name: docs-change
description: 修改 .website 文档站、组件文档源、可运行示例或指南正文时使用。覆盖源文件与生成物边界、generate:docs 与 check:docs、生成器契约测试、站点构建和实际浏览器验收。文档站构建失败、生成物漂移或要新增指南页时加载本技能。
---

# 文档与示例

## 何时使用

- 改 `.website/docs/guides/` 的规范正文、组件 `docs/index.mdx`、`docs/demos/` 示例。
- 站点构建失败、`check:docs` 报生成物漂移，或要新增指南页。

## 源与生成物

| 内容 | 源 | 生成物 |
| --- | --- | --- |
| 规范正文 | `.website/docs/guides/*.mdx` | 直接发布 |
| 组件文档 | `components/rc-*/docs/index.mdx`、`docs/demos/*.demo.tsx` | `.website/docs/components/*.mdx` |
| 教学文字 | `.website/content/` | `.website/docs/learn/`、`_generated_tutorials/` |
| 运行示例 | `.website/docs/examples/` | `_generated_sources/` |
| 导航、API、覆盖 | `library.manifest.json`、组件类型、docgen | `navigation.toml`、`_generated/`、`_generated_api/` |

生成文件带 `THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.` 标记，一律改源后重新生成。产品元数据只维护根清单，导航与数量由生成器派生。

## 流程

1. 改源：组件文档与示例放包内，规范正文放 `.website/docs/guides/`。
2. 生成 `yarn workspace @crab-dev/website generate:docs`。
3. 漂移检查 `yarn workspace @crab-dev/website check:docs`。
4. 生成器或契约变化：`yarn workspace @crab-dev/website test:generator`、`test:build`。
5. 构建 `yarn docs:build`（先 `build:library`，再生成并构建站点）。
6. 运行界面变化另做实际浏览器验收：三体系、明暗、窄屏、键盘、焦点、强制颜色、减少动画，按范围取舍并记录。

## 示例规则

- 只用公开包入口，复制到独立项目可运行。
- 不引用组件 `src`、相邻示例或隐藏辅助文件。
- 复用已有控件与公共 registry，默认 MD3 Expressive；设计体系、明暗、尺寸、密度各自独立。

## 验证

| 改动 | 至少运行 |
| --- | --- |
| 指南、组件正文 | 站点 `generate:docs`、`check:docs`、`test:generator`、`yarn docs:build` |
| 示例代码 | 上述 + 站点 `lint`、`typecheck`、`test` |
| 生成器脚本 | `test:generator`、`test:build`、`check:docs` |

站点 `test` 已串联生成器、构建绑定与 `check:docs`；只跑其中一项时说明未覆盖的部分。

