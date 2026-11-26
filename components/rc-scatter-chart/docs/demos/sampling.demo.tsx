import ScatterChart from '@crab-dev/rc-scatter-chart';

export const meta = {
    title: '保留不规则采样间隔',
    description: '按实际经过的分钟定位水温样本，前两分钟的三次观测与后段的稀疏观测共享同一数值轴。',
};

export default function SamplingDemo() {
    return (
        <ScatterChart
            aria-label="关闭加热后经过的时间与水温"
            width="auto"
            height={245}
            labels={{ x: '经过时间', y: '水温' }}
            formatX={value => `${value} 分`}
            formatY={value => `${value} °C`}
            series={[{ name: '水温', data: [
                { x: 0, y: 84, label: '停止加热' },
                { x: 1, y: 80, label: '首次复测' },
                { x: 2, y: 76, label: '二次复测' },
                { x: 8, y: 59, label: '八分钟复测' },
                { x: 17, y: 41, label: '最终复测' },
            ] }]}
        />
    );
}
