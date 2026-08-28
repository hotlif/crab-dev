export const meta = {
    title: "可关闭标签",
    description: "开启 closable 并监听 onTabClose 管理标签页的增删。",
};

import { useState } from 'react';

import Tabs from '../../src/index.js';
import type { TabsItem } from '../../src/index.js';

const initialItems: TabsItem[] = [
    { key: 'tab-1', label: '编辑器 1', children: <p>编辑器 1 的内容</p>, closable: true },
    { key: 'tab-2', label: '编辑器 2', children: <p>编辑器 2 的内容</p>, closable: true },
    { key: 'tab-3', label: '编辑器 3', children: <p>编辑器 3 的内容</p>, closable: true },
];

const ClosableDemo = () => {
    const [items, setItems] = useState<TabsItem[]>(initialItems);
    const [activeKey, setActiveKey] = useState<string>('tab-1');

    const handleClose = (key: string) => {
        const index = items.findIndex(item => item.key === key);
        const nextItems = items.filter(item => item.key !== key);
        setItems(nextItems);
        if (key === activeKey && nextItems.length > 0) {
            const fallback = nextItems[Math.max(0, index - 1)] ?? nextItems[0]!;
            setActiveKey(fallback.key);
        }
    };

    return (
        <Tabs
            items={items}
            activeKey={activeKey}
            onChange={setActiveKey}
            onTabClose={handleClose}
        />
    );
};

export default ClosableDemo;
