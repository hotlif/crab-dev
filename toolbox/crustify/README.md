<div align="center">
	<h1>@crab-dev/crustify</h1>
	<p>
		一个用于构建 React 应用的现代化构建工具，<br/>
		内置 Babel、Linaria 等常用配置，开箱即用，专注于 <b>性能</b> 与 <b>可维护性</b>。
	</p>
</div>

## ✨ 特性

- ⚡ **零配置启动**：内置 React 常用构建配置，无需从零搭建 Webpack / Babel
- 🧩 **现代 Babel 预设**：默认集成 `@babel/preset-env`、`@babel/preset-react`、`@babel/preset-typescript`
- 🎨 **CSS-in-JS 支持**：原生支持 `Linaria` 和 `@wyw-in-js`，构建期提取样式，无运行时开销
- 📦 **模块化配置**：用户可实现 `Modification` 接口进行自定义模块扩展

## 📦 安装

```bash
npm install @crab-dev/crustify --save-dev

yarn add -D @crab-dev/crustify

pnpm add -D @crab-dev/crustify
```

## 🚀 快速开始

### 项目结构

大部分场景下，文件结构遵循约定生成。推荐的项目目录结构如下：

```
├─ .cache              # 缓存目录，CSS 加载问题时可尝试删除
├─ .tmp                # 临时文件目录，可安全删除
├─ dist                # 打包输出目录，用于发布
├─ public              # 静态资源目录
├─ src                 # 源码目录
│   ├─ bootstrap.tsx   # 用于生成 index.html 的入口文件（通过 React 服务端渲染）
│   └─ entry.tsx       # 默认应用入口文件
├─ package.json        # 项目配置
├─ tsconfig.json       # TypeScript 配置
└─ .crustify.ts        # Crustify 配置文件，包括插件等
```

> **注意**：`.tmp`、`.cache` 和 `dist` 目录无需提交到代码仓库。

### 基本配置

在项目根目录创建 `.crustify.ts` 配置文件：

```ts
import { defineConfig } from "@crab-dev/crustify";

export default defineConfig({
  // 基础配置选项
});
```

### 构建命令

添加以下脚本到 `package.json`：

```json
{
  "scripts": {
    "build": "crustify build",
    "dev": "crustify dev",
    "start": "crustify start"
  }
}
```

## 🧩 自动扫描组件

Crustify 支持自动扫描和导入组件。以下示例配置自动扫描 `src/pages` 目录下的文件，并通过 `import pages from "@@@pages"` 方式加载：

```ts
import { defineConfig } from "@crab-dev/crustify";
import { join } from "path";

export default defineConfig({
  componentScan: [{
    namespaces: "pages",
    cwd: join(process.cwd(), "src", "pages"),
    generateSourceCharacter: false,
  }]
});
```

自动生成的 `@@@pages` 内容示例（位于 `.tmp` 目录，无需手动修改）：

```ts
import { lazy } from "react";

const ___src_pages_error_404_page_tsx = import("@@/src/pages/error/404.page.tsx");
const ___src_pages_index_page_tsx = import("@@/src/pages/index.page.tsx");

const components = [
  {
    name: "___src_pages_error_404_page_tsx",
    component: ___src_pages_error_404_page_tsx,
    path: "/src/pages/error/404.page.tsx",
    frontmatter: { "path": "*" },
    source: null
  },
  {
    name: "___src_pages_index_page_tsx",
    component: ___src_pages_index_page_tsx,
    path: "/src/pages/index.page.tsx",
    frontmatter: { "index": true },
    source: null
  }
];

export default components;
```

> **提示**：如果 `import pages from "@@@pages"` 缺少代码提示，请将 `"./.tmp/autoscan/tsconfig.json"` 添加到 `tsconfig.json` 的 `extends` 字段中。

## 📚 更多配置

详细配置选项请参考 [配置文档](./docs/configuration.md)（如果有）或查看源码中的类型定义。