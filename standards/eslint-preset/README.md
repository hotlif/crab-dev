# @crab-dev/standards-eslint-preset

本包保留已发布的兼容接口。Crab 仓库已迁移到 `wake lint`，不再由组件工作区依赖或执行本预设；以下接入方式仅面向原有外部消费方。

本预设内部固定 `typescript@6.0.2`，仅为 typescript-eslint 提供仍需的 JavaScript 编译器 API；这不会替代工作区的 TypeScript 7 Typecheck。不要把它改回由消费方提供的 TypeScript peer，否则 Yarn PnP 会将不兼容的 TS 7 API 注入解析器。该分工符合 [TypeScript 官方并行运行说明](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0)。ESLint 与 `@eslint/js` 使用 9.39.5，以满足当前 React 和 import 插件的 peer 范围。

为浏览器 React 代码和 Node.js 工具提供共享 ESLint 配置。

## 浏览器 React 项目

在包根目录的 `eslint.config.js` 中继承 `Browser.react`：

```js
import { Browser } from "@crab-dev/standards-eslint-preset";

export default [...Browser.react];
```

## Node.js 项目

```js
import { Node } from "@crab-dev/standards-eslint-preset";

export default [...Node];
```

原有外部消费项目可继续将本包声明为 `devDependencies`，并通过其 ESLint 脚本使用以上配置。本仓库已迁移至 `yarn lint`（Wake 原生检查），不再使用该预设执行检查。
