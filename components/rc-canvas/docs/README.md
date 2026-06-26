+++
title = "Canvas"
index = true
+++


# Canvas

基于纯 **WebGL 2** 的 2D 声明式绘制组件库。用 React 组件描述图形，底层经一套渲染队列 +
正交投影矩阵 + SDF 着色器在 GPU 上完成抗锯齿绘制，零第三方渲染依赖。


## 何时使用

- 需要绘制大量 2D 图元（矩形、圆、线、文字、图片）且追求 GPU 加速与流畅动画时。
- 需要以声明式 React 组件树组织画面，而非命令式操作 Canvas 2D API 时。
- 需要对图形做分组变换（平移 / 旋转 / 缩放）并保持嵌套坐标系时。


## 功能特性

- **纯 WebGL2**：无 PixiJS 等第三方渲染库，全部图元自带着色器。
- **声明式 API**：`<Canvas>` 内嵌套 `<Rect>` / `<Circle>` / `<Line>` / `<Image>` / `<Text>` / `<Group>`。
- **SDF 抗锯齿**：圆角矩形与圆形通过有符号距离场实现亚像素级平滑边缘。
- **任意角度直线**：顶点着色器端挤出（line extrusion），支持任意斜率与线宽。
- **分组变换**：`<Group>` 维护 TRS 矩阵栈，子孙坐标随父级叠加，支持任意层级嵌套。
- **OKLCh 颜色**：颜色解析支持 `oklch()`、十六进制与 `rgb()/rgba()`。
- **设备像素比自适应**：自动按 `devicePixelRatio` 放大画布，高清屏不糊。


## 代码演示

<Demos path="/docs/demos" columns={1} density="compact" />

## API

<API path="./src/canvas.tsx" />
