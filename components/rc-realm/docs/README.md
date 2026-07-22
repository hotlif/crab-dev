+++
title = "Realm"
index = true
+++

# Realm 沙箱容器

运行时加载 webpack Module Federation 远程模块并嵌入宿主页面：注入 `remoteEntry.js` →
`init(shareScope)` → `get(module)` → 渲染。核心承诺是**完美嵌入**——远程 React 组件与宿主
共享同一 React 实例、同树内联渲染, 宿主 context、合成事件、portal 全部穿透。

- 宿主**是否** webpack MF 环境均可工作：优先复用宿主的 `default` share scope, 否则自建
  scope 并注入宿主的 `react` / `react-dom` / `react-dom/client` / `react/jsx-runtime` 四件套；
- 同一 remote 多实例只加载一次（Promise 缓存并发去重）, 失败与超时自动失效, 重试重走全链；
- 加载态复用 `rc-spin`（`delay` 防闪烁）, 错误态复用 `rc-alert` + `rc-button` 就近重试。

<Demos path="/docs/demos" />

## 两种接入协议

### component（默认）：远程导出 React 组件

远程与宿主共享同一 React 实例, 直接在宿主 React 树中内联渲染, 零额外包装。
`remoteProps` 变化即普通的 props 更新, 不触发重新加载。

```tsx
<Realm entry="https://cdn.example.com/remoteEntry.js" scope="orders" module="./OrderTable"
       remoteProps={{ tenantId }} />
```

### mount：远程导出生命周期对象

适配**跨框架**或**与宿主不同 React 版本**的远程。远程导出
`{ mount(container, props), update?(props), unmount?(container) }`：

- `mount` 必须幂等且与 `unmount` 成对可重入；可返回 cleanup 函数（卸载时 cleanup 先于 unmount 调用）；
- 提供 `update` 则 `remoteProps` 变化走增量更新, 否则 Realm 换 key 走 unmount → mount 全量重挂。

此协议下可开启 `sandbox`（Shadow DOM 样式隔离）。**component 协议在类型层禁用 sandbox**：
标准 MF React 远程的样式注入 `document.head`, Shadow 隔离必然导致样式丢失。

## remote 侧的 shared 配置（唯一受支持样板）

```js
// 远程应用的 webpack.config.js → ModuleFederationPlugin
shared: {
    react: { singleton: true, requiredVersion: '^19.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
}
```

- **必须** `singleton: true`——Realm 注入的宿主 React 条目带 `loaded: 1`, singleton 消费端
  优先选取已加载版本, 从根上杜绝"双 React"（invalid hook call 的最大来源）；
- **禁配** `strictVersion: true` 与 `eager: true`：前者在版本不合时直接抛错而非回退,
  后者把依赖打进 remoteEntry 主包并绕过 share scope, 二者都会破坏宿主注入机制。

## sandbox 边界

- 隔离的是**样式**：远程样式须自包含（构建进 JS）或经 `styleSheets` 由宿主注入 shadow root；
- 主题令牌的 **CSS 自定义属性天然穿透** shadow 边界——远程样式可直接引用
  `var(--token-semantic-*)`, 这是隔离下唯一"应该穿透"的东西, 行为正确；
- 远程若用 portal 弹层（tooltip / dropdown）, 弹层会逃逸 shadow root 挂到 `document.body`,
  不受沙箱样式约束；若宿主处于原生 `<dialog>`（showModal）的 top-layer 中, 远程弹层应挂进
  `node.closest('dialog')` 子树（参考 `rc-tooltip` / `rc-dropdown-container` 的 portalRoot 先例）。

## RealmError 错误码

| code | 阶段 |
|------|------|
| `ssr` | 非浏览器环境触发加载 |
| `script` | remoteEntry 网络加载失败（script onerror / module import 失败） |
| `container` | 加载成功但 `globalThis[scope]` 不存在或形状不符（scope 名错 / 非 MF remote） |
| `init` | `container.init(shareScope)` 抛错 |
| `factory` | `container.get(module)` 或模块工厂执行抛错 |
| `timeout` | 全程超过 `timeout`（默认 15s）期限 |
| `protocol` | 模块形态与所选协议不符（错误信息会指向另一协议） |
| `render` | 远程组件渲染期 / `mount()` 执行期抛错 |

失败与超时会自动使缓存失效, 错误态的"重试"按钮即可重走完整加载链路。

## 工具函数

组件之外具名导出加载原语, 供高级场景直接使用：

```ts
import { loadRemoteModule, preloadRemote, clearRemoteCache } from '@crab-dev/rc-realm';

// 绕过组件直接取远程模块（共享同一套缓存）
const mod = await loadRemoteModule({ entry, scope, module: './util' });
// hover 预热（吞错, 失败留给正式加载重试）
preloadRemote({ entry, scope, module: './OrderTable' });
// 清缓存（测试隔离 / 热更新用, 生产慎用；不删除 globalThis[scope]）
clearRemoteCache(entry, scope);
```

## API

<API path="./src/realm.tsx" />
