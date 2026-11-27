import PieChart from '@crab-dev/rc-pie-chart';

export const meta = {
    title: '比较各书架的销量占比',
    description: '文学类售出 120 本，占当天销量的一半。点击图例可比较其余书架。',
};

export default function BookSalesDemo() {
    return (
        <PieChart
            aria-label="书店今日各书架售出册数"
            width="auto"
            height={240}
            data={[
                { name: '文学', value: 120 },
                { name: '社科', value: 80 },
                { name: '少儿', value: 40 },
            ]}
            formatValue={value => `${value} 本`}
        />
    );
}
