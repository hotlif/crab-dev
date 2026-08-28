export const meta = {
    title: "尺寸",
    description: "通过 `size` 设置 `large`、`middle`、`small` 三档尺寸。",
};

import { css } from '@crab-dev/css';
import Segmented from '../../src/index.js';

const options = ['日', '周', '月'];

const SizeDemo = () => {
    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                gap: 1rem;
                align-items: flex-start;
            `}
        >
            <Segmented size="large" options={options} />
            <Segmented size="middle" options={options} />
            <Segmented size="small" options={options} />
        </div>
    );
};

export default SizeDemo;
