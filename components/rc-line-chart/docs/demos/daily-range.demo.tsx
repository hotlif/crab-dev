import LineChart from '@crab-dev/rc-line-chart';

export const meta = {
    title: '比较一周的最高与最低气温',
    description: '悬停同一天读取两条曲线的温度，点击图例可单独观察其中一个系列。',
};

export default function DailyRangeDemo() {
    return (
        <LineChart
            aria-label="一周最高与最低气温"
            width="auto"
            height={260}
            categories={['周一', '周二', '周三', '周四', '周五', '周六', '周日']}
            series={[
                { name: '最高气温', data: [16, 18, 21, 20, 17, 19, 22] },
                { name: '最低气温', data: [8, 10, 12, 11, 9, 10, 12] },
            ]}
            formatValue={value => `${value} °C`}
        />
    );
}
