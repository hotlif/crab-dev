---
name: link-workspace-packages
description: '在 Yarn 4 PnP monorepo 中链接 workspace 包。使用场景：（1）刚创建或生成了新包，需要连通它们之间的依赖；（2）用户从兄弟包中导入符号，需要将其登记为依赖；（3）出现 workspace 包（@org/*）的解析错误，如 "cannot find module"、"failed to resolve import"、"TS2307" 或 "cannot resolve"。禁止通过 tsconfig paths 或手编 package.json 绕过问题 —— 必须使用 Yarn workspace 命令修复真实的链接关系。'
---

# 链接 Workspace 包（Yarn 4 PnP）

为 Yarn 4 Plug'n'Play monorepo 中的包之间建立依赖关系。

## 识别环境

- 锁文件：`yarn.lock`
- 运行时：`.pnp.cjs`（Plug'n'Play 模式，没有 `node_modules`）
- 依赖以 zip 归档存放于 `.yarn/cache/`
- 根 `package.json` 的 `packageManager` 字段为 `"yarn@4.x.x"`

## 工作流

1. 识别消费方包（发起 import 的一方）
2. 识别提供方包（被 import 的一方）
3. 使用 `yarn workspace` 命令登记依赖
4. 通过 `.pnp.cjs` 验证解析（PnP 模式下没有软链）

---

## 命令

```bash
# 将一个 workspace 兄弟包添加为依赖
yarn workspace @org/app add @org/ui

# 移除一个 workspace 依赖
yarn workspace @org/app remove @org/ui
```

消费方 `package.json` 中结果形态：

```json
{ "dependencies": { "@org/ui": "workspace:^" } }
```

## 示例

**示例 1：将一个组件链接到另一个组件**

```bash
yarn workspace @crab-dev/rc-dialog add @crab-dev/rc-button
```

**示例 2：将内部工具作为 devDependency 链接**

```bash
yarn workspace @crab-dev/rc-button add -D @crab-dev/standards-eslint-preset
```

**示例 2.1：补齐高频漏项 `rc-masonry`（推荐固定检查）**

```bash
yarn workspace @crab-dev/rc-xxx add -D @crab-dev/rc-masonry
```

适用场景：
1. 新建 `rc-*` 组件后可启动测试，但 `yarn start`（lignify）偶发解析失败
2. 消费方包里已有 `@crab-dev/rc-component-preview`、`@crab-dev/rc-menu`，但漏了 `@crab-dev/rc-masonry`

**示例 3：排查 "Cannot find module"**

1. 确认依赖是否已声明在消费方的 `package.json` 中
2. 若未声明，添加之：`yarn workspace <consumer> add <provider>`
3. 若该包无法从 zip 加载（ESM 问题），在根 `package.json` 中将其标记为 unplugged：
   ```json
   { "dependenciesMeta": { "problematic-pkg": { "unplugged": true } } }
   ```
4. 执行 `yarn install` 将其解压

## 备忘

- Yarn 4 PnP **不使用** `node_modules`，依赖通过 `.pnp.cjs` 解析
- 依赖以 zip 归档形式存放于 `.yarn/cache/`
- `workspace:^` 在开发期解析为本地包，发布时会被替换为实际版本号
- 部分包（如含原生二进制或 ESM 损坏的包）可能需要在 `dependenciesMeta` 中配置 `"unplugged": true`
- 根 `package.json` 应设置 `"private": true`，防止误发布
