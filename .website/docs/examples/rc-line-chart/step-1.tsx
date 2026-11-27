import LineChart from '@crab-dev/rc-line-chart';

export default function Example() {
    return (
        <LineChart
            aria-label="本周上游水位"
            width="auto"
            height={240}
            categories={['周一', '周二', '周三', '周四']}
            series={[{ name: '上游', data: [24, 30, 38, 32] }]}
            formatValue={value => `${value} cm`}
        />
    );
}
