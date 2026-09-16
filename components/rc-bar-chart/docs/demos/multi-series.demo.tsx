export const meta = {
    title: "多系列分组",
    description: "多系列在类目内并列分组，颜色按分类色板顺序分配并跟随系列；提供 onBarClick 后柱子呈现 pointer 光标。",
};

import { useState } from 'react';
import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import BarChart from '../../src/index.js';
import type { BarClickInfo } from '../../src/index.js';

const CATEGORIES = ['华东', '华南', '华北', '西南'];

const MultiSeriesDemo = () => {
    const [picked, setPicked] = useState<BarClickInfo | null>(null);

    return (
        <div className={css`display: flex; flex-direction: column; gap: ${token.space['component-gap']}; min-width: 0; inline-size: 100%;`}>
            <BarChart
                width="auto"
                aria-label="各区域分渠道销售额"
                categories={CATEGORIES}
                series={[
                    { name: '线上', data: [820, 932, 901, 934] },
                    { name: '线下', data: [620, 710, 660, 540] },
                    { name: '经销商', data: [450, 380, 520, 410] },
                ]}
                onBarClick={setPicked}
            />
            <div role="status" className={css`font-size: ${token.font.size.caption}; color: ${token.color.text.secondary};`}>
                {picked
                    ? `已选中：${picked.category} · ${picked.seriesName} = ${picked.value}`
                    : '点击任意柱子查看回调数据'}
            </div>
        </div>
    );
};

export default MultiSeriesDemo;
