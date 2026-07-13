/**
 * title = "基础用法"
 * description = "默认渲染一条语义分隔线（role=separator）, 用于切分上下两段内容。"
 */

import { css } from '@linaria/core';
import Divider from '../../src/index.js';

const textStyle = css`
    margin: 0;
    color: oklch(0.44 0.01 286);
`;

const BasicDemo = () => {
    return (
        <div>
            <p className={textStyle}>
                分割线把连续的内容切成可辨认的段落, 让「哪些属于一组」无需说明即可看出。
            </p>
            <Divider />
            <p className={textStyle}>
                它是一种视觉限制：用一条线收窄用户对内容边界的猜测范围。
            </p>
        </div>
    );
};

export default BasicDemo;
