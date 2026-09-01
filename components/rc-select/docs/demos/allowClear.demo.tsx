export const meta = {
    title: "可清除",
    description: "设置 allowClear 允许一键清空已选值",
};

import Select from '../../src/index.js';

const options = [
    { label: '北京', value: 'beijing' },
    { label: '上海', value: 'shanghai' },
    { label: '广州', value: 'guangzhou' },
    { label: '深圳', value: 'shenzhen' },
];

const AllowClearDemo = () => {
    return (
        <Select
            aria-label="clearable"
            allowClear
            defaultValue="beijing"
            options={options}
            placeholder="请选择城市"
        />
    );
};

export default AllowClearDemo;
