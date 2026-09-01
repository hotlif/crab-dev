export const meta = {
    title: "整卡可点击",
    description: "clickable 赋予按钮语义：浮起反馈、键盘激活与焦点环; extra 与 actions 的点击自动与整卡隔离。",
};

import { useState } from 'react';
import Button from '@crab-dev/rc-button';
import Card from '../../src/index.js';

const ClickableDemo = () => {
    const [message, setMessage] = useState('点击卡片任意位置, 或 Tab 聚焦后按 Enter');

    return (
        <Card
            clickable
            onClick={() => setMessage(`整卡点击 · ${new Date().toLocaleTimeString()}`)}
            title="可点击卡片"
            extra={
                <Button appearance="text" onClick={() => setMessage('点击了 extra, 未触发整卡')}>
                    更多
                </Button>
            }
            actions={[
                <Button key="edit" appearance="subtle" onClick={() => setMessage('点击了操作区, 未触发整卡')}>
                    编辑
                </Button>,
            ]}
            style={{ maxWidth: 360 }}
        >
            {message}
        </Card>
    );
};

export default ClickableDemo;
