# @crab-dev/rc-split-pane

通过拖拽或键盘调整两侧面板尺寸，支持复位与尺寸记忆。

- 水平（左右）/ 垂直（上下）分栏，`primary` 指定尺寸受控的一侧，另一侧 flex 填充；
- 指针拖拽（Pointer Events，触屏 / 触控笔可用）与键盘调整（方向键步进、Home/End 到边界、Enter 复位）双通道；
- 分隔条为 `role="separator"`，带 `aria-valuenow` 汇报当前尺寸；
- 双击分隔条复位到 `defaultSize`；`persistKey` 记住用户调整的尺寸；
- 拖拽机制来自 `@crab-dev/rc-hooks` 的 `useDragResize`，需要更自由的布局时可直接使用该 hook。

以下示例使用 Wake，组件样式由 Wake 自动加载。

```tsx
import SplitPane from '@crab-dev/rc-split-pane';

<SplitPane defaultSize={280} min={200} max={520} persistKey="editor-sidebar">
    <FileTree />
    <Editor />
</SplitPane>
```

## 文档

- [使用说明与 API](./docs/index.mdx)
- [示例源码](./docs/demos/)

在当前包目录运行 `yarn start` 可打开组件工作台，查看交互示例。
