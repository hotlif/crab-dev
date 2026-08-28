
export const meta = {
    title: "危险操作",
    description: "使用 `appearance=\\\"danger\\\"` 标识删除、清空等破坏性操作",
};

import Button from '../../src/index.js';
import { css } from '@crab-dev/css';

const DangerDemo = () => {
    return (
        <div
            className={css`
                display: flex;
                align-items: center;
                gap: 1rem;
                flex-wrap: wrap;
            `}
        >
            <Button appearance="danger">删除</Button>
            <Button appearance="danger" disabled>禁用</Button>
            <Button appearance="danger" loading>删除中</Button>
        </div>
    );
};

export default DangerDemo;
