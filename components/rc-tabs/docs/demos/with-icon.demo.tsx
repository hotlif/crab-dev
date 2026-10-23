export const meta = {
    title: "带图标与额外内容",
    description: "通过 icon 为标签添加视觉标识，tabBarExtraContent 注入刷新操作，当前面板显示刷新次数。",
};

import Tabs from '../../src/index.js';
import Button from '@crab-dev/rc-button';
import { useState } from 'react';

const Icon = ({ path }: { path: string }) => (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
        <path d={path} fill="currentColor" />
    </svg>
);

const WithIconDemo = () => {
    const [refreshCount, setRefreshCount] = useState(0);
    return (
        <Tabs
            tabBarExtraContent={<Button size="small" onClick={() => setRefreshCount(count => count + 1)}>刷新</Button>}
            items={[
                {
                    key: 'home',
                    label: '首页',
                    icon: <Icon path="M8 1.5 1.5 7H3v6.5h3.5V10h3v3.5H13V7h1.5L8 1.5Z" />,
                    children: <p role="status">首页内容 · 已刷新 {refreshCount} 次</p>,
                },
                {
                    key: 'library',
                    label: '资源库',
                    icon: <Icon path="M3 2h10v2H3V2Zm0 4h10v2H3V6Zm0 4h10v4H3v-4Z" />,
                    children: <p role="status">资源库内容 · 已刷新 {refreshCount} 次</p>,
                },
                {
                    key: 'trash',
                    label: '回收站',
                    icon: <Icon path="M6 2h4v1h3.5v1.5H2.5V3H6V2Zm-2 3h8l-.6 8.1A1 1 0 0 1 10.4 14H5.6a1 1 0 0 1-1-.9L4 5Z" />,
                    children: <p role="status">回收站内容 · 已刷新 {refreshCount} 次</p>,
                },
            ]}
        />
    );
};

export default WithIconDemo;
