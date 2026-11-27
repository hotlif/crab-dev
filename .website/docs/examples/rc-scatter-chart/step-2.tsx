import ScatterChart from '@crab-dev/rc-scatter-chart';

export default function Example() {
    return (
        <ScatterChart
            aria-label="通勤路与绿道骑行里程和耗时"
            width="auto"
            height={240}
            labels={{ x: '里程', y: '耗时' }}
            formatX={value => `${value} km`}
            formatY={value => `${value} 分钟`}
            series={[
                { name: '通勤路', data: [
                    { x: 4, y: 16, label: '周一' }, { x: 6, y: 23, label: '周三' },
                    { x: 11, y: 34, label: '周五' },
                ] },
                { name: '绿道', data: [
                    { x: 5, y: 14, label: '周二' }, { x: 9, y: 24, label: '周四' },
                    { x: 13, y: 33, label: '周六' },
                ] },
            ]}
        />
    );
}
