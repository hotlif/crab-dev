export const meta = {
    title: "堆叠模式",
    description: "stacked 开启堆叠：正值向上、负值向下分别累计，段与段之间保持 2px 表面留白，仅最外侧段带数据端圆角。",
};

import BarChart from '../../src/index.js';

const CATEGORIES = ['Q1', 'Q2', 'Q3', 'Q4'];

const StackedDemo = () => (
    <BarChart
        aria-label="季度收支结构"
        categories={CATEGORIES}
        stacked
        series={[
            { name: '产品收入', data: [1200, 1420, 1380, 1690] },
            { name: '服务收入', data: [680, 720, 810, 900] },
            { name: '成本支出', data: [-750, -820, -790, -880] },
        ]}
        formatValue={v => v.toLocaleString()}
    />
);

export default StackedDemo;
