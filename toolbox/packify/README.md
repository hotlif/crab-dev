<div align="center">
	<h1>@crab-dev/packify</h1>
	<p>
		基于 Rollup 4 的零配置库打包器，<br/>
		一条命令产出 ESM / CJS / 类型声明 / 静态 CSS，并负责设计令牌与 API 文档的生成。
	</p>
</div>

## 特性

- **零配置** — 入口固定为 `src/index.ts`，无需配置文件，约定优于配置
- **四种产物** — 一次构建同时输出 `esm/`、`cjs/`、`declarations/`、`css/`
- **Linaria / wyw-in-js** — 零运行时 CSS-in-JS，构建期把样式提取为静态 `css/index.css`
- **类名包名前缀** — 生成的类名以包名为前缀，根除不同组件包之间的类名哈希碰撞
- **React Compiler** — 内置 `babel-plugin-react-compiler`（`target: '19'`）
- **依赖全部外置** — 所有 npm 包保持 external，不打进产物，交由消费方的打包器处理
- **设计令牌生成** — 从 `token.toml` 生成 `src/token.ts`，支持 `$ref()` 跨层引用
- **API 文档生成** — 经 react-docgen 生成 `public/docgen.json`

## 安装

```bash
yarn add -D @crab-dev/packify
```

## CLI 命令

```bash
packify build                # 构建库 → esm/ cjs/ declarations/ css/
packify test                 # 以 ESM 模式运行 Jest（透传参数与退出码）
packify generate:css-token   # token.toml → src/token.ts
packify generate:docgen      # react-docgen → public/docgen.json
```

## 构建产物

`packify build` 先清空四个产物目录，再从 `src/index.ts` 出发构建：

```
esm/index.mjs            # ES Module（terser 压缩）
cjs/index.cjs            # CommonJS（named exports，terser 压缩）
declarations/index.d.ts  # 类型声明（rollup-plugin-dts 打平为单文件）
css/index.css            # Linaria 构建期提取的静态样式
```

在 `package.json` 中声明产物目录，使其随包发布：

```json
{
    "files": ["esm", "cjs", "css", "declarations"]
}
```

## 内置 Babel 配置

| 预设 / 插件 | 作用 |
|-------------|------|
| `@babel/preset-env` | 环境适配（`targets: "defaults"`） |
| `@babel/preset-typescript` | TypeScript 转译 |
| `@babel/preset-react` | React JSX（automatic runtime） |
| `babel-plugin-react-compiler` | React 19 Compiler（`target: '19'`） |

测试文件（`__tests__/`、`*.test.*`、`*.spec.*`）与 `docs/` 不参与构建。

## 设计令牌（generate:css-token）

在包根目录放置 `token.toml`：

```toml
[build]
output = "./src/token.ts"                  # 生成目标
prefix = "button"                          # CSS 变量前缀 → --button-*
imports = ["@crab-dev/rc-token-semantic"]  # 上层令牌来源，供 $ref() 解析

[token]
opacity.disabled  = "0.4"
size.large.height = "40px"
size.large.gap    = "$ref(space.component-gap)"
```

`$ref(key)` 会解析为上层令牌的 CSS 变量并带上兜底值：

```
"$ref(space.component-gap)"
    → var(--token-semantic-space-component-gap, 8px)
```

`src/token.ts` 是生成产物，**不要手动编辑**——改 `token.toml` 后重新执行 `packify generate:css-token`。

## API 文档（generate:docgen）

以 `src/index.ts` 追溯到默认导出的组件源文件，经 react-docgen 解析 Props，输出到 `public/docgen.json`。

若入口无法自动追溯（例如 `index.ts` 只做重导出），可在 `package.json` 中显式指定：

```json
{
    "docgen": { "entry": "src/button.tsx" }
}
```

## 测试（test）

Jest 尚未原生支持 ESM，`packify test` 会以 `--experimental-vm-modules` 启动一个 node 子进程来运行**调用方自己的** Jest —— 各包自行掌控 Jest 版本与配置，packify 只负责以正确的方式启动它，并透传命令行参数与退出码。

```bash
packify test                          # 全量
packify test src/__tests__/x.test.tsx # 单文件
packify test -t "用例名"               # 按用例名过滤
```
