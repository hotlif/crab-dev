/**
 * title = "三种变体"
 * description = "elevated 微投影（默认）/ outlined 描边 / filled 弱灰底, 按承载面的层次选用。"
 */

import { css } from '@linaria/core';
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
                白底 + 静态微投影, 适合置于灰底页面之上。
            </Card>
            <Card variant="outlined" title="Outlined">
                白底 + 1px 描边, 适合信息密集的平铺列表。
            </Card>
            <Card variant="filled" title="Filled">
                弱灰底无描边, 适合嵌在白底容器内部做轻分组。
            </Card>
        </div>
    );
};

export default VariantDemo;
