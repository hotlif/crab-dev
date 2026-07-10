/**
 * title = "自由拼装"
 * description = "传入 Card.Cover / Header / Body / Footer 结构子组件时切换为自由模式, 完全掌控区块次序。"
 */

import { css } from '@linaria/core';
import Button from '@crab-dev/rc-button';
import Tag from '@crab-dev/rc-tag';
import Card from '../../src/index.js';

const coverArtStyle = css`
    height: 120px;
    background: linear-gradient(135deg, oklch(0.75 0.13 60), oklch(0.68 0.17 20));
`;

const CompositionDemo = () => {
    return (
        <Card hoverable style={{ maxWidth: 340 }}>
            <Card.Header title="自由拼装模式" extra={<Tag color="primary">Beta</Tag>} />
            <Card.Body>结构子组件可任意排布 —— 这里把封面放在了正文与操作区之间。</Card.Body>
            <Card.Cover>
                <div className={coverArtStyle} />
            </Card.Cover>
            <Card.Footer>
                <Button appearance="text">取消</Button>
                <Button appearance="primary">确认</Button>
            </Card.Footer>
        </Card>
    );
};

export default CompositionDemo;
