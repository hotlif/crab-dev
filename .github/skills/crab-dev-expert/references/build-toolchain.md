# Build Toolchain Reference

## Packify — Rollup 4 Library Bundler

**Source:** `toolbox/packify/src/index.ts`
**CLI:** `packify build` / `packify generate:css-token`

### Rollup Plugin Chain (in order)

1. **`@wyw-in-js/rollup`** — Linaria/wyw-in-js extraction. Transforms `css``...`` ` tagged templates into static CSS class names. Uses shared Babel config for parsing.
2. **`rollup-plugin-css-only`** — Collects all extracted CSS and writes to `css/index.css`.
3. **`@rollup/plugin-node-resolve`** — Resolves `.js/.jsx/.ts/.tsx` extensions.
4. **`@rollup/plugin-babel`** — Transpilation with:
   - `@babel/preset-env` (targets: `"defaults"`)
   - `@babel/preset-typescript`
   - `@babel/preset-react` (automatic runtime)
   - `babel-plugin-react-compiler` (target: `'19'`)
   - Excludes `__tests__/` and `docs/` files

### Output

| Format | Directory | Extension |
|--------|-----------|-----------|
| ESM | `esm/` | `.mjs` |
| CJS | `cjs/` | `.cjs` |
| Declarations | `declarations/` | `.d.ts` (via `rollup-plugin-dts`) |
| CSS | `css/` | `index.css` |

### CSS Token Generation (`generate:css-token`)

**Source:** `toolbox/packify/src/generateCssToken.ts`

1. Reads `token.toml` from CWD, parses with `smol-toml`
2. Resolves `$ref()` by recursively loading imported token packages
3. Generates `token.ts` with:
   - `vars` map: `{ 'dotted.key': '--prefix-dotted-key' }`
   - `token` nested object: values wrapped in `` `var(${vars['key']}, fallback)` ``
   - `$ref()` → chained `var(--prefix-key, var(--upstream-prefix-key, rawValue))`

---

## Crustify — Webpack 5 Dev Server / Builder

**Source:** `toolbox/crustify/src/index.ts`, `toolbox/crustify/src/conf.ts`

### Configuration

Reads `.crustify.{ts,mts,js,mjs,...}` config file from CWD via `unconfig`.

```typescript
interface CrustifyConfig {
    rootDir: string;
    componentScan: ComponentScanRule[];
    mods: Mod[];
    devServer: DevServerConfig;
}
```

**Modification system:** Mods can modify entry, Webpack config, bootstrap path, and crustify config.

### Webpack Loader Chain for `.tsx?/.jsx?`

```
Source → @wyw-in-js/webpack-loader → thread-loader → babel-loader → Output
```

**Babel presets/plugins:**
- `@babel/preset-env` (excludes `@babel/plugin-transform-template-literals` for wyw-in-js compatibility)
- `@babel/preset-typescript`
- `@babel/preset-react` (automatic runtime)
- `babel-plugin-react-compiler` (target: `'19'`)
- `@crab-dev/babel-plugin-auto-import-style`

### Webpack Loader Chain for `.mdx?`

```
Source → @wyw-in-js/webpack-loader → thread-loader → babel-loader → @mdx-js/loader → Output
```

MDX loader uses `remark-gfm` and `remark-frontmatter` (TOML format).

### CSS Loader Chain

```
Source → style-loader (dev) / MiniCssExtractPlugin.loader (prod) → css-loader → lightningcss-loader → Output
```

### Webpack Plugins

| Plugin | Purpose |
|--------|---------|
| **WebpackBar** | Build progress bar (name: "Crustify") |
| **AutoScanWebpackPlugin** | Auto-scans dirs for `*.view.tsx`, `*.demo.tsx`, `*.mdx`; generates import maps |
| **TerserWebpackPlugin** | Production minification (strips comments) |
| **MiniCssExtractPlugin** | CSS extraction in production |
| **ReactWebpackPlugin** | SSR-renders `bootstrap.tsx` into `index.html`, injects asset tags |

### Resolve Configuration

| Alias | Target |
|-------|--------|
| `@` | `src/` |
| `@@` | CWD (project root) |
| `@@@/namespace` | Auto-scanned import maps |

- Extension aliases: `.js` resolves to `.ts/.tsx/.js`
- Fallbacks: `buffer`, `string_decoder`

### AutoScanWebpackPlugin

- Runs at `beforeCompile` hook
- Recursively walks `componentScan` directories matching `include`/`exclude` regexps
- Extracts frontmatter from TSX (leading JSDoc as TOML) and MDX (TOML frontmatter blocks)
- Generates `.ts` import-map files in `.tmp/` using Eta templates
- Optionally copies source files as `.raw` assets for live source display

### ReactWebpackPlugin

- At `thisCompilation.processAssets`, SSR-renders the `bootstrap.tsx` component
- Injects `<script>` and `<link>` tags for all emitted JS/CSS assets
- Outputs `index.html` as a `RawSource` Webpack asset

---

## Lignify — Zero-Config Doc/Dev Environment

**Source:** `toolbox/lignify/src/index.ts`, `toolbox/lignify/src/mod.ts`

Thin wrapper around Crustify that provides a `LignifyMod`:

1. **`modifyEntry()`** — Replaces entry with `import("@@/.tmp/lignify/entry.tsx")`
2. **`modifyBootstrapPath()`** — Points bootstrap to `.tmp/lignify/`
3. **`modifyConfig()`** — Injects three `componentScan` rules:

| Namespace | Directory | Pattern | Purpose |
|-----------|-----------|---------|---------|
| `pages` | `.tmp/lignify/pages/` | `*.view.tsx` | Page entries |
| `demos` | `docs/` | `*.demo.tsx` | Live demos (with source char gen) |
| `mdxs` | `docs/` | `*.mdx` | Documentation |

4. **Template copying:** Copies its `template/` directory into `.tmp/lignify/` at construction

**Invocation:** `lignify run-task app:dev` → `cRun({ mods: [new LignifyMod()] })` → Crustify Webpack dev server

---

## babel-plugin-auto-import-style

**Source:** `toolbox/babel-plugin-auto-import-style/src/index.ts`

Babel 7 plugin that automatically injects CSS imports at compile time:

1. **Program visitor** — Collects existing `@crab-dev/rc-*/css/index.css` imports into a `seenStyleImports` set
2. **ImportDeclaration visitor** — For each non-type import matching `/^@crab-dev\/rc-[a-zA-Z0-9_-]+$/`:
   - Skips if CSS import already exists
   - Uses `createRequire().resolve()` to check if `{package}/css/index.css` exists on disk
   - If found, inserts `import "@crab-dev/rc-{name}/css/index.css"` after the component import

**Effect:** `import Button from '@crab-dev/rc-button'` automatically gets `import "@crab-dev/rc-button/css/index.css"` injected during Crustify's Webpack build.
