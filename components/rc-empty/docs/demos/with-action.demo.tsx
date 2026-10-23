
export const meta = {
    title: "带操作区域",
    description: "通过 `action` 插槽提供行动引导，将空状态从「终点」转变为「起点」，减少用户挫败感。",
};

import Empty from "../../src/index.js";
import { css } from "@crab-dev/css";
import { useState } from 'react';
import Button from '@crab-dev/rc-button';
import token from '@crab-dev/rc-token-semantic';

const stackStyle = css`
    display: grid;
    justify-items: center;
    gap: ${token.space['section-gap']};
    color: ${token.color.text.primary};
`;
const statusStyle = css`margin: 0; color: ${token.color.text.secondary};`;

const WithActionDemo = () => {
    const [created, setCreated] = useState(false);
    return (
        <div className={stackStyle}>
            {created ? <>
                <strong>示例项目</strong>
                <span>现在可以添加内容。</span>
                <Button appearance="outlined" onClick={() => setCreated(false)}>重置演示</Button>
            </> : <Empty
                preset="default"
                title="暂无项目"
                description="创建第一个项目以开始整理内容。"
                action={<Button appearance="primary" onClick={() => setCreated(true)}>立即创建</Button>}
            />}
            <p className={statusStyle} role="status">{created ? '已创建 1 个项目。' : '当前没有项目。'}</p>
        </div>
    );
};

export default WithActionDemo;
