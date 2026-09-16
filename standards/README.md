# 共享工程预设

仓库的代码检查使用根目录 `wake.config.toml` 和 `wake lint`。此目录提供共享 TypeScript 配置，并保留已发布的 ESLint 预设兼容接口。

| 包 | 用途 |
| --- | --- |
| [@crab-dev/standards-eslint-preset](./eslint-preset/README.md) | 历史消费方的兼容接口；本仓库不再使用其执行 lint |
| [@crab-dev/standards-typescript-preset](./typescript-preset/README.md) | 浏览器 React 与 Node.js 的 TypeScript 配置 |

各工作区继承与运行环境匹配的预设，不重复声明或覆盖已有选项。需要调整全仓规则时，在对应预设中修改，并选择受影响的下游包验证。
