<div align="center">
	<h1>@crab-dev/babel-plugin-auto-import-style</h1>
	<p>
		编译期为 <code>@crab-dev/rc-*</code> 组件自动注入样式导入，<br/>
		消费方只 import 组件，样式自动跟随，且传递依赖的样式按正确的级联顺序一并注入。
	</p>
</div>

## 它解决什么

零运行时的 Linaria 把样式提取成了独立的 `css/index.css`，代价是消费方每引入一个组件，就得手写一行样式导入——组件的传递依赖还得自己补齐，漏一行就少一截样式。

本插件把这件事挪到编译期：

```tsx
// 你写的
import Dialog from '@crab-dev/rc-dialog';
```

```tsx
// 编译后（rc-dialog 内部复用了 rc-button）
import Dialog from '@crab-dev/rc-dialog';
import '/abs/path/to/rc-button/css/index.css';   // 依赖在前
import '/abs/path/to/rc-dialog/css/index.css';   // 本体在后
```

## 安装

```bash
yarn add -D @crab-dev/babel-plugin-auto-import-style
```

通常无需单独安装：`@crab-dev/crustify` 已在其内置 Babel 配置中注册了本插件，用 crustify 开发即自动生效。

## 手动注册

```js
// babel.config.js
export default {
    plugins: ["@crab-dev/babel-plugin-auto-import-style"],
};
```

插件**没有任何选项**，注册即用。

## 行为

- **匹配范围** — 仅处理形如 `@crab-dev/rc-*` 的 import；`import type` 不触发注入。
- **传递依赖** — 沿被引入包的 `dependencies` 递归收集所有 `@crab-dev/rc-*` 依赖的 `css/index.css`。
- **级联顺序** — 依赖在前、本体在后，与 CSS 层叠语义一致：父组件的令牌得以覆盖子组件的默认值。
- **去重** — 同一份 CSS 在一个模块内只注入一次；文件里已手写的样式导入也会被识别，不重复注入。
- **注入绝对路径** — 注入的是解析后的绝对文件路径，而非 `@crab-dev/rc-*/css/index.css` 这样的包名路径。

> **为何是绝对路径：** Yarn PnP 的严格模式禁止一个包直接访问「孙依赖」的 bare specifier——即便该包在磁盘上确实存在。插件沿 manifest 链逐跳解析（每一跳都在各自包的 PnP 边界内完成），最终把绝对路径写进消费方源码，从而完全绕过消费端对包名的二次解析。

## 定位

内部工具，服务于 `@crab-dev/*` 组件库的样式分发，不面向通用场景。
