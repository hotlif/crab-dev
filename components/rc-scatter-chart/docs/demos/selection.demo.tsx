import { useState } from 'react';
import ScatterChart, { type ScatterChartPoint } from '@crab-dev/rc-scatter-chart';

export const meta = {
    title: '选择包裹查看处理记录',
    description: '读取包裹重量与分拣耗时，点击数据点或用键盘激活样本，在图下显示所选记录。',
};

export default function SelectionDemo() {
    const [parcel, setParcel] = useState<ScatterChartPoint | null>(null);
    return (
        <div>
            <ScatterChart
                aria-label="包裹重量与分拣耗时"
                width="auto"
                height={245}
                labels={{ x: '重量', y: '分拣耗时' }}
                formatX={value => `${value} kg`}
                formatY={value => `${value} 秒`}
                series={[{ name: '包裹', data: [
                    { x: 0.6, y: 11, label: 'A01' }, { x: 1.4, y: 18, label: 'A02' },
                    { x: 2.2, y: 42, label: 'A03' }, { x: 3.5, y: 26, label: 'A04' },
                ] }]}
                onPointClick={({ point }) => setParcel(point)}
            />
            <p role="status">
                {parcel ? `${parcel.label} 重 ${parcel.x} kg，分拣耗时 ${parcel.y} 秒。` : '选择一个包裹查看分拣记录。'}
            </p>
        </div>
    );
}
