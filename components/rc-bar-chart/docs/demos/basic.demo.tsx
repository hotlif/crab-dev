/**
 * title = "基础用法"
 * description = "单系列柱状图：单系列不出现图例，悬停任意类目列即可读取数值，完整数据同时以隐藏数据表提供给辅助技术。"
 */

import BarChart from '../../src/index.js';

const CATEGORIES = ['一月', '二月', '三月', '四月', '五月', '六月'];

const BasicDemo = () => (
    <BarChart
        aria-label="上半年月度销量"
        categories={CATEGORIES}
        series={[{ name: '销量', data: [3200, 4100, 3650, 5200, 4780, 6100] }]}
    />
);

export default BasicDemo;
