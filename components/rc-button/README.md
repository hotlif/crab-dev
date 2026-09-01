# @crab-dev/rc-button

用于提交、确认或触发即时操作的 React 按钮组件。

## 安装

```bash
yarn add @crab-dev/rc-button
```

## 使用

```tsx
import Button, { ButtonGroup } from '@crab-dev/rc-button';
import '@crab-dev/rc-button/css/index.css';

export default function Actions() {
    return (
        <ButtonGroup>
            <Button appearance="primary">保存</Button>
            <Button>取消</Button>
        </ButtonGroup>
    );
}
```

组件支持六种外观、三种尺寸、加载与选中状态、前后图标、圆形图标按钮和链接渲染。异步点击在 Promise 完成前自动去重。

## 组件控制台

```bash
yarn start
yarn generate:docgen
yarn exec wake docs build . --mode components
```

`yarn start` 会启动 Wake Components 工作台：左侧按组件和场景选择 Demo，中间显示隔离画布，右侧根据 Demo Props 和 JSDoc 自动生成属性控件。外观、尺寸、状态和视口会保存在 URL 中，便于刷新和分享。

`wake docs build` 会把可静态部署的组件控制台输出到 `components-dist`。
