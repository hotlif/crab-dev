export const meta = {
    title: "入场与数据更新动画",
    description: "首次挂载时柱体从零值基线逐类目生长；切换数据集时高度从旧值平滑补间到新值。WebGL 逐帧插值，数百根柱同时过渡仍流畅；系统偏好「减弱动态」时自动降级为直接呈现。",
};

import { useState } from 'react';
import type { CSSProperties } from 'react';
import BarChart from '../../src/index.js';

const DATASETS = [
    [820, 932, 901, 934, 690],
    [620, 480, 720, 540, 880],
    [1020, 1132, 601, 834, 390],
];

const CATEGORIES = ['华东', '华南', '华北', '西南', '东北'];

const buttonStyle: CSSProperties = {
    padding: '6px 16px',
    fontSize: 13,
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    background: '#fff',
    color: '#334155',
    cursor: 'pointer',
};

const LiveUpdateDemo = () => {
    const [index, setIndex] = useState(0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <BarChart
                aria-label="各区域季度销售额"
                categories={CATEGORIES}
                series={[{ name: '销售额', data: DATASETS[index] }]}
            />
            <button
                type="button"
                style={buttonStyle}
                onClick={() => setIndex(prev => (prev + 1) % DATASETS.length)}
            >
                切换数据集（观察柱体补间）
            </button>
        </div>
    );
};

export default LiveUpdateDemo;
