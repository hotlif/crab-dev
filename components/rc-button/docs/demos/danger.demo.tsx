export const meta = {
    title: "危险操作",
    description: "用 danger 定制错误色角色，保留五种按钮各自的视觉层级。",
};
import Button from '../../src/index.js';
import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
const rowStyle = css`display: flex; align-items: center; gap: ${token.space['component-gap']}; flex-wrap: wrap;`;
export default function DangerDemo() {
    return <div className={rowStyle}>
        <Button appearance="primary" danger>删除项目</Button>
        <Button appearance="tonal" danger>移至回收站</Button>
        <Button appearance="elevated" danger>移除附件</Button>
        <Button danger>移除成员</Button>
        <Button appearance="text" danger>清空筛选</Button>
        <Button appearance="primary" danger disabled>不可删除</Button>
        <Button appearance="primary" danger loading>正在删除</Button>
    </div>;
}
