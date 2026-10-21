export const meta = {
    title: "三种变体",
    description: "outlined 描边 / elevated 微投影 / filled 弱灰底；省略 variant 时随统一设计风格切换。",
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
                低层级表面 + 一级阴影，无描边；暗色模式仍能区分层次。
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
