/**
 * title = "数值标签与参考线"
 * description = "showValues 在柱端标注数值（空间不足以容纳的自动省略；堆叠模式标注类目合计）；referenceLines 绘制均值 / 目标虚线，参考值自动纳入值轴刻度域。"
 */

import BarChart from '../../src/index.js';

const DATA = [820, 932, 901, 934, 690, 1290];
const AVERAGE = Math.round(DATA.reduce((a, b) => a + b, 0) / DATA.length);

const AnnotationsDemo = () => (
    <BarChart
        aria-label="各月销售额与均值目标"
        categories={['一月', '二月', '三月', '四月', '五月', '六月']}
        series={[{ name: '销售额', data: DATA }]}
        showValues
        referenceLines={[
            { value: AVERAGE, label: `均值 ${AVERAGE.toLocaleString()}` },
            { value: 1200, label: '目标 1,200', color: 'oklch(0.6226 0.1909 24.91)' },
        ]}
    />
);

export default AnnotationsDemo;
