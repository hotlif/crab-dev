export const meta = {
    title: "校验状态",
    description: "设置 status 以展示 error 或 warning 状态",
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

const StatusDemo = () => {
    return (
        <div className={containerStyle}>
            <Select aria-label="error" status="error" options={options} placeholder="Error 状态" />
            <Select aria-label="warning" status="warning" options={options} placeholder="Warning 状态" />
        </div>
    );
};

export default StatusDemo;
