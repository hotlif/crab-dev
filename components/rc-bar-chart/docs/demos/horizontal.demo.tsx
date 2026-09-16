export const meta = {
    title: "横向条形与自适应宽度",
    description: "横向条形让类目沿纵轴排列；设置 width 为 auto，通过 rc-auto-sizer 跟随父容器宽度。调整窗口宽度可查看布局变化。",
};

import BarChart from '../../src/index.js';
import { css } from '@crab-dev/css';

const HorizontalDemo = () => (
    <div className={css`inline-size: 100%; min-width: 0;`}>
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
