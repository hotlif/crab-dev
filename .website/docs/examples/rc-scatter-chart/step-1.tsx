import ScatterChart from '@crab-dev/rc-scatter-chart';

export default function Example() {
    return (
        <ScatterChart
            aria-label="通勤路骑行里程与耗时"
            width="auto"
            height={240}
            labels={{ x: '里程', y: '耗时' }}
            formatX={value => `${value} km`}
            formatY={value => `${value} 分钟`}
            series={[{ name: '通勤路', data: [
                { x: 4, y: 16, label: '周一' },
                { x: 6, y: 23, label: '周三' },
                { x: 11, y: 34, label: '周五' },
            ] }]}
        />
    );
}
