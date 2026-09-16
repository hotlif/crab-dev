# @crab-dev/standards-typescript-preset

为浏览器 React 项目与 Node.js 项目提供严格模式的 TypeScript 配置。

## 选择预设

| 预设 | 使用场景 | 模块解析 |
| --- | --- | --- |
| `tsconfig.browser.react.json` | 浏览器 React 组件与页面 | `bundler` |
| `tsconfig.node.json` | Node.js 工具与脚本 | `NodeNext` |

在包根目录的 `tsconfig.json` 中继承所需预设，例如：

```json
{
    "extends": "@crab-dev/standards-typescript-preset/tsconfig.browser.react.json",
    "include": ["src", "docs"]
}
```

两个预设均使用 `target: ESNext`，并定义 `@/*` 与 `@@/*` 路径映射。浏览器预设包含 DOM 类型和 React JSX 支持。

工作区将本包声明为 `devDependencies`，内部依赖版本使用 `workspace:^`。按需要增补文件范围，不覆盖预设已有选项；运行包内 `yarn typecheck` 验证类型。

## 本仓库的 TypeScript 7 与 Yarn PnP

官方 TypeScript 7.0.2 的原生编译器尚不能解析本仓库的 Yarn PnP 依赖。仓库的 `yarn typecheck` 使用含原生 PnP 支持的 TypeScript **7.1.0-dev**，固定到 [上游 PR #63919](https://github.com/microsoft/TypeScript/pull/63919) 对应分支的提交 `568cafc40c371bede18a2c96ffb377abc9eb5234`。这是一份尚未合并的开发版编译器，不是官方 7.0.2 发布包。

- 根目录运行 `yarn typecheck`；组件目录继续运行 `yarn typecheck`。
- `yarn typecheck:prepare` 可以提前准备编译器。首次需要 Git、网络和 Go 1.27.1；缺少指定 Go 版本时，脚本会下载并校验官方 SDK，存入仓库 `.cache/typescript-pnp/`。Windows 需要 PowerShell 7，Linux/macOS 需要 tar。
- 后续运行使用带 SHA256 校验的本地编译器缓存。编译器提交、Go 版本及各平台 SDK 校验值保存在根目录 `scripts/typescript-pnp.lock.json`；源码和二进制缓存不提交。
- 可以用 `CRAB_GO` 指定现有的 Go 1.27.1 可执行文件。此选项只影响首次构建，不改变 TypeScript 版本。
- 不创建 `node_modules`，不降低严格模式，不过滤诊断，不使用 TypeScript 6 执行 Typecheck。请使用项目脚本；直接运行 `yarn tsc` 仍会调用安装的官方编译器。
- 包内 `yarn test` 先执行真实编译用例，再由 Wake Test 校验版本、PnP/JSX 解析、严格空值检查和错误退出码。此预设的发布文件列表不包含仓库专用脚本和测试。

更新固定提交时需重新审查 PnP 补丁、运行全仓 Typecheck 和本包测试。待官方发布支持 PnP 的 TypeScript 7 后，再移除这套构建入口；不要改用 `node_modules` 回避解析问题。
