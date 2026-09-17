export const meta = {
    title: "三种变体",
    description: "elevated 微投影（默认）/ outlined 描边 / filled 弱灰底, 按承载面的层次选用。",
};

import { css } from '@crab-dev/css';
import Card from '../../src/index.js';

const rowStyle = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
`;

const VariantDemo = () => {
    return (
        <div className={rowStyle}>
            <Card variant="elevated" title="Elevated">
                浮层表面 + 弱边框 + 微投影，暗黑模式仍能区分层次。
            </Card>
            <Card variant="outlined" title="Outlined">
                普通表面 + 1px 弱描边，适合信息密集的平铺列表。
            </Card>
            <Card variant="filled" title="Filled">
                弱填充、无描边，适合在内容容器内部做轻分组。
            </Card>
        </div>
    );
};

export default VariantDemo;
