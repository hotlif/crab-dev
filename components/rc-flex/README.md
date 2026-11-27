# @crab-dev/rc-flex

Flex 排列一组 React 子元素。展示大量等高条目时，传入 `virtual` 配置即可按可见行渲染。

Wake 会按模块加载静态样式。使用其他构建器时，在应用样式入口引入 Flex 的 CSS。虚拟模式还需加载 AutoSizer 和 Virtual 的 CSS。在严格 Yarn PnP 项目中，把下列样式所属的包声明在应用依赖中。

```css
@import "@crab-dev/rc-auto-sizer/css/index.css";
@import "@crab-dev/rc-virtual/css/index.css";
@import "@crab-dev/rc-flex/css/index.css";
```

```tsx
import Flex from '@crab-dev/rc-flex';

export default function Archive() {
    return (
        <Flex
            aria-label="档案编号"
            style={{ height: 240 }}
            gap={8}
            virtual={{
                itemCount: 10_000,
                itemHeight: 32,
                getItemKey: index => index + 10001,
                renderItem: index => <span>档案 {index + 10001}</span>,
            }}
        />
    );
}
```

添加 `virtual.itemWidth` 可将单列列表变为随容器宽度换行的卡片布局。[使用说明与 API](./docs/index.mdx) · [示例源码](./docs/demos/)
