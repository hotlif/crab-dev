import { css } from '@crab-dev/css';
import { useState } from 'react';
import BarChart from '../../src/index.js';

export const meta = {
    title: '窄屏刻度与单位',
    description: '切换刻度写法，观察窄屏相邻刻度如何留出间距，并用键盘读值。',
};

const frame = css`max-inline-size: 28rem; min-inline-size: 0;`;
const categories = ['北区输水泵', '进水调节阀', '东侧远程监测设备支线', '回流管'];
const series = [
    { name: '日班', data: [24, 8, 15, 11] },
    { name: '夜班', data: [19, 0, 13, -7] },
];
const volume = (value: number) => `${value} m³`;

export default function CompactAxisDemo() {
    const [unitsOnTicks, setUnitsOnTicks] = useState(true);
    return <div className={frame}>
        <p>计量单位 m³</p>
        <label>
            <input type="checkbox" checked={unitsOnTicks} onChange={event => setUnitsOnTicks(event.currentTarget.checked)} />
            刻度显示单位
        </label>
        <BarChart
            width="auto"
            height={280}
            orientation="horizontal"
            aria-label="泵站分班用水量（立方米）"
            labels={{ legend: '班次图例' }}
            categories={categories}
            series={series}
            stacked
            showValues
            formatValue={volume}
            formatAxisValue={unitsOnTicks ? undefined : String}
        />
    </div>;
}
