import { useState } from 'react';
import Avatar from '../../src/index.js';

export const meta = {
    title: '可操作头像',
    description: 'Tab 聚焦头像，Enter 或 Space 激活；禁用入口跳过键盘焦点。',
};

export default function ActionDemo() {
    const [count, setCount] = useState(0);
    return (
        <div>
            <Avatar aria-label="打开个人资料" onClick={() => setCount(count + 1)}>AB</Avatar>
            <Avatar aria-label="不可用的个人资料" disabled onClick={() => setCount(count + 1)}>CD</Avatar>
            <p role="status">个人资料打开次数：{count}</p>
        </div>
    );
}
