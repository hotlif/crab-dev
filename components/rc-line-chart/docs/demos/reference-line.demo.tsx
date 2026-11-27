import { useState } from 'react';
import LineChart, { type PointClickInfo } from '@crab-dev/rc-line-chart';

export const meta = {
    title: '检查超过目标的采样点',
    description: '以 200 ms 为延迟目标，点击数据点或用键盘激活后，在图外读取采样记录。',
};

export default function ReferenceLineDemo() {
    const [sample, setSample] = useState<PointClickInfo | null>(null);
    return (
        <div>
            <LineChart
                aria-label="上午六次请求延迟采样"
                width="auto"
                height={240}
                categories={['09:00', '09:10', '09:20', '09:30', '09:40', '09:50']}
                series={[{ name: '请求延迟', data: [145, 170, 225, 180, 135, 155] }]}
                referenceLines={[{ value: 200, label: '目标 200 ms' }]}
                formatValue={value => `${value} ms`}
                onPointClick={setSample}
            />
            <p role="status">
                {sample ? `${sample.category} 的请求延迟为 ${sample.value} ms。` : '选择一个采样点查看延迟。'}
            </p>
        </div>
    );
}
