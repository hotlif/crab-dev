<div align="center">
	<h1>@crab-dev/crustify</h1>
	<p>
		基于 Webpack 5 的零配置 React 19 构建工具，<br/>
		集成 React Compiler、Linaria、SWC、MDX 和组件自动扫描，开箱即用。
	</p>
</div>

## 特性

- **零配置启动** — 内置完整的 Webpack 5 + Babel 配置，支持 TypeScript、React 19、CSS-in-JS
- **React Compiler** — 通过 `babel-plugin-react-compiler` 自动优化 React 组件
- **Linaria / wyw-in-js** — 零运行时 CSS-in-JS，构建期提取为静态 CSS
- **SWC** — 用于 `bootstrap.tsx` 的运行时 TSX 转换和 React SSR HTML 生成
- **MDX** — 原生支持 `.mdx` / `.md` 文件，集成 `remark-gfm` 和 `remark-frontmatter`
- **LightningCSS** — 现代 CSS 处理和压缩
- **组件自动扫描** — 自动发现指定目录下的组件，生成懒加载模块并提取 TOML frontmatter
- **多线程编译** — 通过 `thread-loader` 加速 Babel 和 wyw-in-js 处理
- **插件系统** — `Modification` 接口支持自定义入口、Webpack 配置和 HTML 模板

## 安装

```bash
yarn add -D @crab-dev/crustify
```

## CLI 命令

```bash
crustify run-task app:dev     # 启动开发服务器（webpack-dev-server + HMR）
crustify run-task app:build   # 生产构建（输出到 dist/）
```

## 项目结构

```
src/
├── entry.tsx              # 应用入口文件
└── bootstrap.tsx          # HTML 外壳（通过 React SSR 渲染为 index.html）
.crustify.ts               # 配置文件
.tmp/                      # 自动生成（已 gitignore）
├── entry.tsx              # 生成的入口 → import("@/entry.tsx")
└── autoscan/
    └── tsconfig.json      # 自动扫描路径别名（IDE 支持）
dist/                      # 生产构建输出
```

> `.tmp/`、`.cache/`、`dist/` 无需提交到代码仓库。

## 配置

在项目根目录创建 `.crustify.ts`（也支持 `.mts`、`.js`、`.mjs` 等，通过 `unconfig` 加载）：

```ts
import { defineConfig } from "@crab-dev/crustify";

export default defineConfig({
    rootDir: process.cwd(),          // 项目根目录（默认 cwd）
    componentScan: [],               // 组件自动扫描规则
    mods: [],                        // 插件链
    devServer: {
        server: "http",              // "http" | "https"
        proxy: [],                   // 代理规则
    },
});
```

## 路径别名

| 别名 | 解析到 |
|------|--------|
| `@/` | `src/` |
| `@@/` | 项目根目录 |
| `@@@/{namespace}` | 自动扫描生成的模块 |

## 组件自动扫描

配置 `componentScan` 后，Crustify 会在编译前自动扫描目录，生成懒加载模块：

```ts
import { defineConfig } from "@crab-dev/crustify";
import { join } from "path";

export default defineConfig({
    componentScan: [{
        namespaces: "pages",                          // 通过 import pages from "@@@/pages" 访问
        cwd: join(process.cwd(), "src", "pages"),     // 扫描目录
        generateSourceCharacter: false,               // 是否在输出中包含源码
        include: undefined,                           // 文件包含正则
        exclude: undefined,                           // 文件排除正则
    }],
});
```

生成的模块（位于 `.tmp/`）结构如下：

```ts
const ___src_pages_index_page_tsx = import("@@/src/pages/index.page.tsx");

const components = [
    {
        name: "___src_pages_index_page_tsx",
        component: ___src_pages_index_page_tsx,
        path: "/src/pages/index.page.tsx",
        frontmatter: { "index": true },
        source: null,
    },
];

export default components;
```

**Frontmatter 提取：** `.tsx` / `.ts` 文件中的首个块注释会被解析为 TOML；`.mdx` / `.md` 文件使用标准 TOML frontmatter。

> 如果 `@@@/pages` 缺少类型提示，将 `.tmp/autoscan/tsconfig.json` 添加到 `tsconfig.json` 的 `extends` 字段中。

## 插件系统（Modification）

通过实现 `Modification` 接口扩展构建流程：

```ts
import type { Modification } from "@crab-dev/crustify";

const myMod: Modification = {
    // 修改 crustify 配置（最先执行）
    modifyConfig(config) { return config; },

    // 修改生成的入口文件内容
    modifyEntry(entry) { return entry; },

    // 修改 Webpack 配置
    modifyWebpack(configuration) { return configuration; },

    // 修改 bootstrap.tsx 查找路径
    modifyBootstrapPath(path) { return path; },
};
```

在配置中注册：

```ts
export default defineConfig({
    mods: [myMod],
});
```

## HTML 生成

Crustify 通过 React SSR 生成 `index.html`：

1. 使用 SWC 将 `src/bootstrap.tsx` 转换为 JS
2. 通过 `react-dom/server` 的 `renderToString()` 渲染为 HTML
3. 自动注入编译产物的 `<script defer>` 和 `<link>` 标签
4. 开发模式下监听 `bootstrap.tsx` 变更，支持 HMR

## 内置 Babel 配置

| 预设 / 插件 | 作用 |
|-------------|------|
| `@babel/preset-env` | 环境适配（排除 `plugin-transform-template-literals` 以兼容 wyw-in-js） |
| `@babel/preset-typescript` | TypeScript 转译 |
| `@babel/preset-react` | React JSX（automatic runtime） |
| `babel-plugin-react-compiler` | React 19 Compiler（target: '19'） |
| `@crab-dev/babel-plugin-auto-import-style` | 自动注入组件样式导入 |