import ScatterChart from '@crab-dev/rc-scatter-chart';

export const meta = {
    title: '比较两条配送线路',
    description: '横轴为配送里程，纵轴为配送用时。点击图例切换线路，检查相近里程下的单次配送记录。',
};

export default function RoutesDemo() {
    return (
        <ScatterChart
            aria-label="城区线和滨河线的配送里程与用时"
            width="auto"
            height={285}
            labels={{ x: '里程', y: '用时' }}
            formatX={value => `${value} km`}
            formatY={value => `${value} 分`}
            series={[
                { name: '城区线', data: [
                    { x: 1.4, y: 12 }, { x: 2.1, y: 19 }, { x: 2.8, y: 16 },
                    { x: 3.5, y: 25 }, { x: 4.2, y: 22 }, { x: 4.8, y: 30 },
                    { x: 5.3, y: 36 }, { x: 5.7, y: 28 }, { x: 6.8, y: 39 },
                    { x: 7.5, y: 35 }, { x: 8.1, y: 46 }, { x: 9.2, y: 44 },
                ] },
                { name: '滨河线', data: [
                    { x: 1.7, y: 9 }, { x: 2.3, y: 12 }, { x: 3.1, y: 13 },
                    { x: 3.9, y: 18 }, { x: 4.4, y: 15 }, { x: 4.9, y: 22 },
                    { x: 5.5, y: 20 }, { x: 6.3, y: 27 }, { x: 6.7, y: 23 },
                    { x: 7.2, y: 30 }, { x: 8.4, y: 29 }, { x: 9.1, y: 34 },
                ] },
            ]}
        />
    );
}
