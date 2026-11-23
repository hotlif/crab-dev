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

## 本仓库的 TypeScript 与 Yarn PnP

全工作区使用官方 TypeScript 7.0.2。包内 `yarn typecheck` 调用原生编译器，通过文件系统回调读取当前工程的 PnP 依赖图和归档。根 `yarn typecheck` 编排各工作区检查。

安装仓库依赖即可使用原生编译器和共享严格预设。编辑器 SDK 和文档生成器使用官方 6.0.2 的 JavaScript API。原生编译器提供 PnP 支持后可移除文件系统适配。

包内 test 先执行真实编译夹具，再由 Wake Test 验证版本、PnP/JSX 解析、严格空值、错误声明、缺失依赖和错误退出码。独立消费检查使用消费项目自己安装的官方编译器，避免从工作区意外解析依赖。

升级编译器时统一更新工作区依赖，刷新 lockfile、PnP 运行时和编辑器 SDK，并执行全仓类型检查、编译夹具及独立消费检查。编译器升级以官方发布工具的兼容证据为准。
