import LineChart from '@crab-dev/rc-line-chart';

export const meta = {
    title: '区分零值和缺测',
    description: '凌晨四点测得零度，六点缺测。零度保留数据点，六点处断开连线。',
};

export default function MissingDataDemo() {
    return (
        <LineChart
            aria-label="山顶气象站两小时采样气温"
            width="auto"
            height={240}
            categories={['00:00', '02:00', '04:00', '06:00', '08:00', '10:00']}
            series={[{ name: '气温', data: [-3, -2, 0, null, 3, 7] }]}
            formatValue={value => `${value} °C`}
        />
    );
}
