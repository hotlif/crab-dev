/**
 * title = "留白档位"
 * description = "线两侧的留白决定分组强度（格式塔接近性）: 留白越大, 两段内容「离得越远」。"
 */

import { css } from '@linaria/core';
import Divider from '../../src/index.js';

const rowStyle = css`
    margin: 0;
    padding: 4px 8px;
    background-color: oklch(0.97 0.002 286);
    border-radius: 6px;
`;

const SpacingDemo = () => {
    return (
        <div>
            <p className={rowStyle}>none — 线与内容贴合, 仅作切分</p>
            <Divider spacing="none" />
            <p className={rowStyle}>small</p>
            <Divider spacing="small" />
            <p className={rowStyle}>middle（默认）</p>
            <Divider spacing="middle" />
            <p className={rowStyle}>large — 留白最大, 分组感最强</p>
            <Divider spacing="large" />
            <p className={rowStyle}>末段</p>
        </div>
    );
};

export default SpacingDemo;
