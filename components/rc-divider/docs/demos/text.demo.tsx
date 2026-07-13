/**
 * title = "带文字"
 * description = "传入 children 即成为分节标题。textAlign 控制文字落点, plain 让文字退回正文字重。"
 */

import { css } from '@linaria/core';
import Divider from '../../src/index.js';

const stackStyle = css`
    display: flex;
    flex-direction: column;
`;

const TextDemo = () => {
    return (
        <div className={stackStyle}>
            <Divider>居中标题</Divider>
            <Divider textAlign="start">左侧标题</Divider>
            <Divider textAlign="end">右侧标题</Divider>
            <Divider plain>plain 说明文字</Divider>
        </div>
    );
};

export default TextDemo;
