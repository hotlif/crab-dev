export const meta = {
    title: "自由拼装",
    description: "传入 Card.Cover / Header / Body / Footer 结构子组件时切换为自由模式, 完全掌控区块次序。",
};

import { css } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import Tag from '@crab-dev/rc-tag';
import token from '@crab-dev/rc-token-semantic';
import { useState } from 'react';
import Card from '../../src/index.js';

const cardStyle = css`max-width: calc(${token.size[64]} * 5 + ${token.size[20]});`;
const statusStyle = css`margin-block-end: 0; color: ${token.color.text.secondary};`;
const coverArtStyle = css`
    height: calc(${token.size[64]} * 2 - ${token.space['component-gap']});
    background: linear-gradient(135deg, ${token.color.brand.container}, ${token.color.secondary.container});
`;

const CompositionDemo = () => {
    const [message, setMessage] = useState('请选择确认或取消。');
    return (
        <Card hoverable className={cardStyle}>
            <Card.Header title="自由拼装模式" extra={<Tag color="primary">Beta</Tag>} />
            <Card.Body>
                结构子组件可任意排布，这里把封面放在了正文与操作区之间。
                <p className={statusStyle} role="status">{message}</p>
            </Card.Body>
            <Card.Cover>
                <div className={coverArtStyle} />
            </Card.Cover>
            <Card.Footer>
                <Button appearance="text" onClick={() => setMessage('已取消本次操作。')}>取消</Button>
                <Button appearance="primary" onClick={() => setMessage('已确认当前内容。')}>确认</Button>
            </Card.Footer>
        </Card>
    );
};

export default CompositionDemo;
