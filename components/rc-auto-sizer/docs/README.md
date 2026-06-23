+++
title = "AutoSizer 自适应容器"
index = true
+++


# AutoSizer 自适应容器

自动测量容器的宽高，并将 `{ width, height }` 通过渲染函数传递给子组件。常与 `Virtual` 虚拟滚动组件配合使用。


## 何时使用

- 需要将外层容器的实际像素尺寸传入子组件（如虚拟列表的 `viewportWidth` / `viewportHeight`）。
- 需要在容器大小变化时自动重新布局（响应式窗口调整、面板拖拽等场景）。
- 希望组件与具体容器尺寸解耦，只接收数值而非自行测量 DOM。


## 代码演示

<Demos path="/docs/demos" />


## API

<API path="./src/auto-sizer.tsx" />
