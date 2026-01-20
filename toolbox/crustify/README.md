<div align="center">
	<h1>@crab-dev/crustify</h1>
	<p>
		一个用于构建 React 应用的现代化构建器，<br/>
		内置 Babel、Linaria 等常用配置，开箱即用，专注于 <b>性能</b> 与 <b>可维护性</b>。
	</p>
</div>


## ✨ 特性

- ⚡ **少量配置**  内置 React 常用构建配置，无需从零搭建 Webpack / Babel
- 🧩 **现代 Babel 预设** 默认预设 `@babel/preset-env` `@babel/preset-react` `@babel/preset-typescript`
- 🎨 **CSS-in-JS 支持** 原生支持 `Linaria` `@wyw-in-js` 构建期提取样式，无运行时开销
- 📦 **模组配置** 用户可以实现 `Modification` 接口进行自定义模组


## 📦 安装

```bash
npm install @crab-dev/crustify --save-dev

yarn add -D @crab-dev/crustify

pnpm add -D @crab-dev/crustify
```

## 📄 项目结构

大部分场景下文件都是约定生成的。 需要一个如下目录所示


```bash
├─.cache              # 缓存信息， 遇到 css 没加载的问题可以尝试删除这个文件夹重新构建
├─.tmp                # 生成的临时文件目录, 可以删除
├─dist                # 打包后的可以发版的文件信息
├─public              # 放在 public 的资源文件
└─src                 # 源码
    ├─bootstrap.tsx   # 生成 index.html 的文件， 通过 react 的 server render 生成
    └─entry.tsx       # 默认入口文件
├─package.json        # 包配置文件
├─tsconfig.json       # typescript 的配置文件
└─.crustify.ts        # 当前框架的一些配置信息，包括配置插件等等
```

其中 `.tmp`,`.cache` 还有 `dist` 不用提交到代码仓库


## 🚀 自动扫描组件


以下例子就是配置自动扫描包。 将所有 `src/pages` 的文件可通过 `import pages from "@@@pages";` 方式进行加载

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


`@@@pages` 的内容如下所示, 它是通过 `@crab-dev/crustify` 自动生成在 `.tmp` 无需修改此文件的内容


```ts
import { lazy } from "react";

const ___src_pages_error_404_page_tsx = import("@@/src/pages/error/404.page.tsx");
const ___src_pages_index_page_tsx = import("@@/src/pages/index.page.tsx");

const components = [
        { name:"___src_pages_error_404_page_tsx", component: ___src_pages_error_404_page_tsx, path: "/src/pages/error/404.page.tsx", frontmatter: {"path":"*"}, source: null},
        { name:"___src_pages_index_page_tsx", component: ___src_pages_index_page_tsx, path: "/src/pages/index.page.tsx", frontmatter: {"index":true}, source: null}
    ];

export default components;
```

> ⚠ 如果你在项目中发现 `import pages from "@@@pages";` 没有代码提示， 则需要将 `"./.tmp/autoscan/tsconfig.json"` 配置到 `tsconfig.json` 的 `extends` 字段