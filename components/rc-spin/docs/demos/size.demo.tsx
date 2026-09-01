export const meta = {
    title: "尺寸",
    description: "通过 size 设置 small / middle / large 三档; 指示器与提示文案会一同缩放。",
};

import { css } from '@crab-dev/css';
import Spin from '../../src/index.js';

const rowStyle = css`
    display: flex;
    gap: 40px;
    align-items: center;
`;

const SizeDemo = () => {
    return (
        <div className={rowStyle}>
            <Spin size="small" />
            <Spin size="middle" />
            <Spin size="large" />
        </div>
    );
};

export default SizeDemo;
