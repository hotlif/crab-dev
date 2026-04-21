# 构建工具链参考

## Packify —— Rollup 4 库打包器

**源码：** `toolbox/packify/src/index.ts`
**CLI：** `packify build` / `packify generate:css-token`

### Rollup 插件链（按执行顺序）

1. **`@wyw-in-js/rollup`** —— Linaria / wyw-in-js 抽取。将 `` css`...` `` 标签模板编译为静态 CSS 类名。使用共享的 Babel 配置进行解析。
2. **`rollup-plugin-css-only`** —— 汇总所有抽取出的 CSS，写入 `css/index.css`。
3. **`@rollup/plugin-node-resolve`** —— 解析 `.js / .jsx / .ts / .tsx` 扩展名。
4. **`@rollup/plugin-babel`** —— 代码转译，配置：
   - `@babel/preset-env`（targets: `"defaults"`）
   - `@babel/preset-typescript`
   - `@babel/preset-react`（automatic runtime）
   - `babel-plugin-react-compiler`（target: `'19'`）
   - 排除 `__tests__/` 与 `docs/` 目录

### 产物

| 格式 | 目录 | 扩展名 |
|------|------|--------|
| ESM | `esm/` | `.mjs` |
| CJS | `cjs/` | `.cjs` |
| 类型声明 | `declarations/` | `.d.ts`（经 `rollup-plugin-dts`） |
| CSS | `css/` | `index.css` |

### CSS 令牌生成（`generate:css-token`）

**源码：** `toolbox/packify/src/generateCssToken.ts`

1. 从 CWD 读取 `token.toml`，以 `smol-toml` 解析
2. 递归加载被 import 的令牌包，解析 `$ref()`
3. 生成 `token.ts`，包含：
   - `vars` 映射：`{ 'dotted.key': '--prefix-dotted-key' }`
   - `token` 嵌套对象：值形如 `` `var(${vars['key']}, fallback)` ``
   - `$ref()` → 链式 `var(--prefix-key, var(--upstream-prefix-key, rawValue))`

---

## Crustify —— Webpack 5 开发服务器 / 构建器

**源码：** `toolbox/crustify/src/index.ts`、`toolbox/crustify/src/conf.ts`

### 配置

通过 `unconfig` 从 CWD 读取 `.crustify.{ts,mts,js,mjs,...}` 配置文件。

```typescript
interface CrustifyConfig {
    rootDir: string;
    componentScan: ComponentScanRule[];
    mods: Mod[];
    devServer: DevServerConfig;
}
```

**Modification 机制：** Mods 可修改 entry、Webpack 配置、bootstrap 路径与 crustify 配置本身。

### `.tsx?/.jsx?` 的 Webpack loader 链

```
源文件 → @wyw-in-js/webpack-loader → thread-loader → babel-loader → 输出
```

**Babel presets / plugins：**
- `@babel/preset-env`（排除 `@babel/plugin-transform-template-literals` 以兼容 wyw-in-js）
- `@babel/preset-typescript`
- `@babel/preset-react`（automatic runtime）
- `babel-plugin-react-compiler`（target: `'19'`）
- `@crab-dev/babel-plugin-auto-import-style`

### `.mdx?` 的 Webpack loader 链

```
源文件 → @wyw-in-js/webpack-loader → thread-loader → babel-loader → @mdx-js/loader → 输出
```

MDX loader 启用 `remark-gfm` 与 `remark-frontmatter`（TOML 格式）。

### CSS loader 链

```
源文件 → style-loader（dev） / MiniCssExtractPlugin.loader（prod） → css-loader → lightningcss-loader → 输出
```

### Webpack 插件

| 插件 | 用途 |
|------|------|
| **WebpackBar** | 构建进度条（名称：`"Crustify"`） |
| **AutoScanWebpackPlugin** | 自动扫描目录下的 `*.view.tsx`、`*.demo.tsx`、`*.mdx`，生成 import 映射 |
| **TerserWebpackPlugin** | 生产压缩（剥离注释） |
| **MiniCssExtractPlugin** | 生产环境 CSS 抽取 |
| **ReactWebpackPlugin** | SSR 渲染 `bootstrap.tsx` 为 `index.html`，注入资源标签 |

### Resolve 配置

| 别名 | 指向 |
|------|------|
| `@` | `src/` |
| `@@` | CWD（项目根） |
| `@@@/namespace` | 自动扫描生成的 import 映射 |

- 扩展名别名：`.js` 可解析到 `.ts / .tsx / .js`
- Fallback：`buffer`、`string_decoder`

### AutoScanWebpackPlugin

- 在 `beforeCompile` 钩子运行
- 按 `componentScan` 的 `include` / `exclude` 正则递归扫描目录
- 从 TSX 提取 frontmatter（文件首个 JSDoc 作为 TOML）；从 MDX 提取 TOML frontmatter 块
- 通过 Eta 模板在 `.tmp/` 下生成 `.ts` import 映射文件
- 可选：将源文件作为 `.raw` 资源复制，供源码展示使用

### ReactWebpackPlugin

- 在 `thisCompilation.processAssets` 阶段，对 `bootstrap.tsx` 组件做 SSR 渲染
- 为所有产物 JS / CSS 注入 `<script>` 与 `<link>` 标签
- 以 `RawSource` 资源形式输出 `index.html`

---

## Lignify —— 零配置文档 / 开发环境

**源码：** `toolbox/lignify/src/index.ts`、`toolbox/lignify/src/mod.ts`

围绕 Crustify 的薄封装，提供一个 `LignifyMod`：

1. **`modifyEntry()`** —— 将 entry 替换为 `import("@@/.tmp/lignify/entry.tsx")`
2. **`modifyBootstrapPath()`** —— 将 bootstrap 指向 `.tmp/lignify/`
3. **`modifyConfig()`** —— 注入三条 `componentScan` 规则：

| Namespace | 目录 | 匹配模式 | 用途 |
|-----------|------|----------|------|
| `pages` | `.tmp/lignify/pages/` | `*.view.tsx` | 页面入口 |
| `demos` | `docs/` | `*.demo.tsx` | 在线示例（附带源码字符生成） |
| `mdxs` | `docs/` | `*.mdx` | 文档 |

4. **模板复制：** 构造时将其 `template/` 目录复制到 `.tmp/lignify/`

**调用方式：** `lignify run-task app:dev` → `cRun({ mods: [new LignifyMod()] })` → Crustify Webpack 开发服务器

---

## babel-plugin-auto-import-style

**源码：** `toolbox/babel-plugin-auto-import-style/src/index.ts`

Babel 7 插件，在编译期自动注入 CSS import：

1. **Program visitor** —— 将已有的 `@crab-dev/rc-*/css/index.css` import 收集到 `seenStyleImports` 集合
2. **ImportDeclaration visitor** —— 对每个匹配 `/^@crab-dev\/rc-[a-zA-Z0-9_-]+$/` 的非 type-only import：
   - 若对应 CSS import 已存在则跳过
   - 通过 `createRequire().resolve()` 检查 `{package}/css/index.css` 是否在磁盘上存在
   - 若存在，则在组件 import 之后插入 `import "@crab-dev/rc-{name}/css/index.css"`

**效果：** `import Button from '@crab-dev/rc-button'` 在 Crustify 的 Webpack 构建过程中自动得到注入的 `import "@crab-dev/rc-button/css/index.css"`。
