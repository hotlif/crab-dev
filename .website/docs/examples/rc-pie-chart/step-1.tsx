import PieChart from '@crab-dev/rc-pie-chart';

export default function Example() {
    return (
        <PieChart
            aria-label="周六烘焙坊售出的面包"
            width="auto"
            height={240}
            data={[
                { name: '法棍', value: 60 },
                { name: '可颂', value: 36 },
                { name: '吐司', value: 24 },
            ]}
            formatValue={value => `${value} 个`}
        />
    );
}
