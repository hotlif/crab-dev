import PieChart from '@crab-dev/rc-pie-chart';

export const meta = {
    title: '用圆环查看磁盘空间',
    description: '内圆半径设为外圆的 60%。隐藏可用空间后，圆环只比较两类已用容量。',
};

export default function StorageDemo() {
    return (
        <PieChart
            aria-label="128 GB 磁盘空间分配"
            width="auto"
            height={240}
            innerRadiusRatio={0.6}
            data={[
                { name: '应用', value: 64 },
                { name: '媒体', value: 48 },
                { name: '可用', value: 16 },
            ]}
            formatValue={value => `${value} GB`}
        />
    );
}
