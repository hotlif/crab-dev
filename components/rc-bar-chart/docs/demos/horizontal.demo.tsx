export const meta = {
    title: "横向条形与自适应宽度",
    description: "orientation=\\\"horizontal\\\" 类目沿纵轴、条横向生长，长类目名更耐读；width=\\\"auto\\\" 经 rc-auto-sizer 跟随父容器宽度，拖动窗口观察布局与动画同步跟随。",
};

import BarChart from '../../src/index.js';

const HorizontalDemo = () => (
    <div style={{ inlineSize: '100%' }}>
        <BarChart
            aria-label="各区域年度销售额排名"
            categories={['华东大区（含江浙沪）', '华南大区', '华北大区', '西南大区', '东北大区']}
            series={[{ name: '销售额', data: [1290, 934, 901, 690, 540] }]}
            orientation="horizontal"
            width="auto"
            showValues
        />
    </div>
);

export default HorizontalDemo;
