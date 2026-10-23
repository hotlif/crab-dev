export const meta = {
    title: "包裹子节点",
    description: "将 Badge 包裹在按钮外部，展示计数、溢出计数与圆点提醒。",
};

import { css } from "@crab-dev/css";
import { useState } from 'react';
import Button from '@crab-dev/rc-button';
import token from '@crab-dev/rc-token-semantic';
import Badge from "../../src/index.js";

const stackStyle = css`display: grid; gap: ${token.space['section-gap']};`;
const rowStyle = css`
    display: flex;
    align-items: center;
    gap: ${token.space['section-gap']};
    flex-wrap: wrap;
    padding: ${token.space['component-gap']};
`;
const statusStyle = css`margin: 0; color: ${token.color.text.secondary};`;

const WrappedDemo = () => {
    const [message, setMessage] = useState('点击按钮查看提醒内容。');
    return (
        <div className={stackStyle}>
            <div className={rowStyle}>
                <Badge count={5}>
                    <Button aria-label="收件箱，5 条未读" onClick={() => setMessage('收件箱有 5 条未读消息。')}>收件箱</Button>
                </Badge>
                <Badge count={99}>
                    <Button aria-label="待办，99 项" onClick={() => setMessage('共有 99 项待办。')}>待办</Button>
                </Badge>
                <Badge count={200} overflowCount={99}>
                    <Button aria-label="归档，200 条记录" onClick={() => setMessage('归档中有 200 条记录，角标显示 99+。')}>归档</Button>
                </Badge>
                <Badge dot>
                    <Button aria-label="通知，有新提醒" onClick={() => setMessage('你有新的系统提醒。')}>通知</Button>
                </Badge>
            </div>
            <p className={statusStyle} role="status">{message}</p>
        </div>
    );
};

export default WrappedDemo;
