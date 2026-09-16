export const meta = {
    title: "入场与数据更新动画",
    description: "首次挂载时柱体从零值基线逐类目生长；手动切换数据集时从旧值过渡到新值。系统偏好「减弱动态」时直接呈现结果。",
};

import { useState } from 'react';
import { css } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import token from '@crab-dev/rc-token-semantic';
import BarChart from '../../src/index.js';

const DATASETS = [
    [820, 932, 901, 934, 690],
    [620, 480, 720, 540, 880],
    [1020, 1132, 601, 834, 390],
];

const CATEGORIES = ['华东', '华南', '华北', '西南', '东北'];

const LiveUpdateDemo = () => {
    const [index, setIndex] = useState(0);

    return (
        <div className={css`display: flex; flex-direction: column; gap: ${token.space['stack-gap']}; min-width: 0; inline-size: 100%;`}>
            <BarChart
                width="auto"
                aria-label="各区域季度销售额"
                categories={CATEGORIES}
                series={[{ name: '销售额', data: DATASETS[index] }]}
            />
            <Button
                type="button"
                className={css`align-self: center;`}
                onClick={() => setIndex(prev => (prev + 1) % DATASETS.length)}
            >
                切换数据集
            </Button>
        </div>
    );
};

export default LiveUpdateDemo;
