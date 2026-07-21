+++
title = "SplitPane"
index = true
+++


# SplitPane

可拖拽调整尺寸的分栏面板。


## 何时使用

- 编辑器类界面的侧栏（文件树、属性面板、调试面板）需要用户按内容自行调宽时
- 上下分割的主区 + 控制台 / 日志区需要调整分配比例时
- 需要记住用户调整结果（`persistKey`）、或要求键盘也能完成调整的场景

拖拽机制来自 `@crab-dev/rc-hooks` 的 `useDragResize`；布局不适合两片式分栏时可直接使用该 hook 自装。


## 代码演示

<Demos path="/docs/demos" />

## API

<API path="./src/splitPane.tsx" />
