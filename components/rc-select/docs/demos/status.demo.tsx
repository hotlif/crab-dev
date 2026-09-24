export const meta = {
    title: "校验状态",
    description: "设置 status 以展示 error 或 warning 状态",
    group: "数据录入",
    component: "Select 选择器",
    order: 100,
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
            <Select label="工作城市" errorText="请选择一个工作城市。" options={options} />
            <Select label="备用城市" supportingText="建议选择交通便利的城市。" status="warning" options={options} />
            <Select appearance="filled" label="填充城市 · 错误状态" errorText="请选择一个工作城市。" searchable options={options} />
            <Select appearance="filled" label="填充城市 · 警告状态" supportingText="建议选择交通便利的城市。" status="warning" options={options} />
        </div>
    );
};

export default StatusDemo;
