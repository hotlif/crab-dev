import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import BarChart from '../../src/barChart.js';

export const meta = {
    title: '八系列分类颜色',
    description: '完整展示八个系列，切换页面设计与明暗模式检查颜色区分；可通过图例隐藏系列或用键盘逐柱查看数据。',
};

const layoutStyle = css`width: 100%; min-width: 0; color: ${token.color.text.primary};`;
const series = ['产品', '服务', '订阅', '渠道', '支持', '培训', '咨询', '其他'].map((name, index) => ({
    name,
    data: [80 + index * 15, 160 - index * 12],
}));

export default function PaletteDemo() {
    return (
        <div className={layoutStyle}>
            <BarChart width="auto" height={300} categories={['本月', '上月']} series={series} aria-label="八个业务系列比较" />
        </div>
    );
}
