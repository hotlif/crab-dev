export const meta = {
    title: "药丸形态",
    description: "type='pill' 提供紧凑的切换样式，常用于工具栏或筛选面板。",
};

import Tabs from '../../src/index.js';

const PillDemo = () => {
    return (
        <Tabs
            type="pill"
            size="small"
            items={[
                { key: 'all', label: '全部', children: <p>全部任务</p> },
                { key: 'active', label: '进行中', children: <p>正在进行的任务</p> },
                { key: 'done', label: '已完成', children: <p>已完成的任务</p> },
            ]}
        />
    );
};

export default PillDemo;
