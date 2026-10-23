export const meta = {
    title: "基础用法",
    description: "title 与 extra 组成标题区, 裸内容自动落入内容区。",
};

import Button from '@crab-dev/rc-button';
import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import { useId, useState } from 'react';
import Card from '../../src/index.js';

const cardStyle = css`max-width: calc(${token.size[64]} * 5 + ${token.size[40]});`;
const detailsStyle = css`margin-block: ${token.space['component-gap']};`;
const statusStyle = css`margin-block-end: 0; color: ${token.color.text.secondary};`;

const BasicDemo = () => {
    const [expanded, setExpanded] = useState(false);
    const detailsId = useId();
    return (
        <Card
            title="项目周报"
            extra={<Button appearance="text" aria-expanded={expanded} aria-controls={detailsId}
                onClick={() => setExpanded(value => !value)}>{expanded ? '收起' : '更多'}</Button>}
            className={cardStyle}
        >
            本周完成卡片组件的令牌设计与交互实现, 覆盖三种视觉变体与整卡点击语义,
            下周进入文档与回归测试阶段。
            <p id={detailsId} hidden={!expanded} className={detailsStyle}>已完成浅深色与键盘操作核对，下一步补充业务页面中的使用示例。</p>
            <p role="status" className={statusStyle}>{expanded ? '已展开周报详情。' : '当前显示周报摘要。'}</p>
        </Card>
    );
};

export default BasicDemo;
