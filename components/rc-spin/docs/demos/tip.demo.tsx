/**
 * title = "提示文案"
 * description = "tip 说明「正在做什么」, 比一枚沉默的转圈更能安抚等待。它同时成为读屏播报的内容。"
 */

import { css } from '@linaria/core';
import Spin from '../../src/index.js';

const rowStyle = css`
    display: flex;
    gap: 48px;
    align-items: flex-start;
`;

const TipDemo = () => {
    return (
        <div className={rowStyle}>
            <Spin tip="加载中" />
            <Spin size="large" tip="正在同步 3 个文件…" />
        </div>
    );
};

export default TipDemo;
