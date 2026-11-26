import { useState } from 'react';
import PieChart from '@crab-dev/rc-pie-chart';

export const meta = {
    title: '查看工单的负责小组',
    description: '点击扇区或用键盘激活它，根据原始数据下标读取该类工单的负责小组。',
};

const requests = [
    { name: '商品咨询', value: 30, team: '商品支持组' },
    { name: '物流进度', value: 18, team: '配送组' },
    { name: '售后服务', value: 12, team: '售后组' },
];

export default function RequestsDemo() {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const selected = selectedIndex === null ? undefined : requests[selectedIndex];
    return (
        <div>
            <PieChart
                aria-label="今日客服工单按问题类型分布"
                width="auto"
                height={240}
                data={requests}
                formatValue={value => `${value} 件`}
                onSliceClick={({ index }) => setSelectedIndex(index)}
            />
            <p role="status">
                {selected ? `${selected.team}负责 ${selected.value} 件“${selected.name}”工单。` : '选择一个类别查看负责小组。'}
            </p>
        </div>
    );
}
