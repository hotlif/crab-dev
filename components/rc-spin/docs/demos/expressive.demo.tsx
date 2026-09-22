export const meta = {
    title: 'M3 Expressive 加载指示器',
    description: '需要更醒目的品牌反馈时使用 expressive 形变；紧凑控件内继续使用默认 circular 指示环。',
};

import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import Spin from '../../src/index.js';

const comparisonStyle = css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${token.space['section-gap']};
`;

const itemStyle = css`
    display: grid;
    justify-items: center;
    gap: ${token.space['component-gap']};
    color: ${token.color.text.secondary};
    font-family: ${token.typography.label['font-family']};
    font-size: ${token.typography.label['font-size']};
    font-weight: ${token.typography.label['font-weight']};
    line-height: ${token.typography.label['line-height']};
`;

const ExpressiveDemo = () => (
    <div className={comparisonStyle}>
        <div className={itemStyle}>
            <Spin size="large" variant="expressive" label="正在生成内容" />
            <span>Expressive</span>
        </div>
        <div className={itemStyle}>
            <Spin size="large" label="正在加载" />
            <span>Circular</span>
        </div>
    </div>
);

export default ExpressiveDemo;
