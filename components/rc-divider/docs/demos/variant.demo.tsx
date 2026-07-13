/**
 * title = "线型"
 * description = "solid 用于正式分区; dashed / dotted 语义更轻, 常用于表达「可选」或「临时」的边界。"
 */

import { css } from '@linaria/core';
import Divider from '../../src/index.js';

const stackStyle = css`
    display: flex;
    flex-direction: column;
`;

const VariantDemo = () => {
    return (
        <div className={stackStyle}>
            <Divider>solid</Divider>
            <Divider variant="dashed">dashed</Divider>
            <Divider variant="dotted">dotted</Divider>
        </div>
    );
};

export default VariantDemo;
