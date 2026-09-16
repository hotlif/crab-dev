# @crab-dev/rc-token-global

提供 Crab 第一层设计基元：颜色、间距、圆角、字体、行高、阴影、时长、缓动、透明度与层级。设计系统通过语义层为这些原始值赋予用途；业务界面通常消费语义令牌与现有组件。

## 主要功能

- 定义颜色、间距、圆角、排版和阴影等基础值。
- 作为 L1 令牌，为语义层提供统一来源。

## 文档

- [详细手册与完整参数](./docs/index.mdx)
- [示例源码](./docs/demos/)

在当前包目录运行 `yarn start` 可打开组件工作台，查看交互示例。

## 公共入口

```ts
import globalToken, { vars } from "@crab-dev/rc-token-global";

globalToken.space["0-5"]; // 带 2px 回退值的 CSS var(...) 引用
vars["space.0-5"]; // CSS 变量名称
```

默认导出不是 JavaScript 数字或组件 Props；本包没有公开 CSS 文件子路径。字体令牌声明字体回退顺序，不负责加载字体。明暗主题通常覆盖语义层，不自动反转每个原始色阶。

## 文档维护

说明正文维护于 `docs/index.mdx`，生产站点 `/components/rc-token-global` 提供完整可视化参考。参数与静态样本由站点生成器读取 `token.toml` 生成，MDX 中的 `token-reference` 标记负责指定各类目录的位置；工作台只显示独立示例。

仅修改说明或示例时，在 `.website` 运行 `yarn generate:docs` 与文档验证。修改公共定义时，先在本包运行 `yarn generate:token`，再同步文档并验证受影响消费者；不得手改 `src/token.ts` 或文档生成产物。
