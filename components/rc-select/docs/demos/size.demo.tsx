export const meta = {
    title: "尺寸",
    description: "提供 large、middle、small 三种尺寸",
};

import { css } from '@crab-dev/css';
import Select from '../../src/index.js';

const containerStyle = css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 320px;
`;

const options = [
    { label: '选项一', value: '1' },
    { label: '选项二', value: '2' },
    { label: '选项三', value: '3' },
];

const SizeDemo = () => {
    return (
        <div className={containerStyle}>
            <Select aria-label="large" size="large" options={options} placeholder="Large" />
            <Select aria-label="middle" size="middle" options={options} placeholder="Middle (默认)" />
            <Select aria-label="small" size="small" options={options} placeholder="Small" />
        </div>
    );
};

export default SizeDemo;
