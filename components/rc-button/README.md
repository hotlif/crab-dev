<div align="center">
	<h1>@crab-dev/rc-button</h1>
	一个灵活、易用的 React 按钮组件，支持多种样式、尺寸、加载态、异步点击等特性。
</div>


## ✨ 特性
- 多种外观类型：primary、subtle、dashed、text、link
- 三种尺寸：large、middle、small
- 支持 loading 加载态
- 支持异步点击，防止重复点击
- 可设置自适应父容器宽度
- 良好的无障碍支持（aria）

## 📦 安装

```bash
yarn add @crab-dev/rc-button
# 或
npm install @crab-dev/rc-button
```

## 🔨 使用示例

```tsx
import Button from '@crab-dev/rc-button';

export default () => (
  <>
    <Button appearance="primary">主按钮</Button>
    <Button appearance="dashed">虚线按钮</Button>
    <Button appearance="link">链接按钮</Button>
    <Button loading>加载中</Button>
    <Button size="large">大按钮</Button>
    <Button disabled>禁用按钮</Button>
  </>
);
```

## API

| 属性                | 说明                 | 类型                                                                 | 默认值      |
|---------------------|----------------------|----------------------------------------------------------------------|------------|
| appearance          | 按钮类型             | 'primary' \| 'subtle' \| 'dashed' \| 'text' \| 'link'                | 'subtle'   |
| size                | 按钮尺寸             | 'large' \| 'middle' \| 'small'                                      | 'middle'   |
| loading             | 是否加载中           | boolean                                                              | false      |
| shouldFitContainer  | 是否撑满父容器宽度   | boolean                                                              | false      |
| disabled            | 是否禁用             | boolean                                                              | false      |
| onClick             | 点击回调（支持异步） | (e) => void \| Promise<void>                                          | -          |
| onClickCapture      | 捕获阶段点击回调     | (e) => void \| Promise<void>                                          | -          |
| children            | 按钮内容             | React.ReactNode                                                      | -          |
| aria-label          | 无内容时的无障碍文本 | string                                                               | -          |

> 其余原生 button 支持的属性也可透传。

## 常见问题

### 1. 如何防止异步点击时重复触发？
组件内部已自动处理，异步 onClick/onClickCapture 执行期间会锁定按钮，防止重复点击。

### 2. 如何自定义样式？
可通过 className 传入自定义类名，或覆盖 CSS 变量实现主题定制。

### 3. 如何只用图标无文本？
可将 children 设为图标，并设置 aria-label 提供无障碍文本。

```tsx
<Button aria-label="删除"><DeleteIcon /></Button>
```
