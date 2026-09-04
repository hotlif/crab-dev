export const meta = {
    title: "基础用法",
    description: "单选模式下的基础选择",
    group: "数据录入",
    component: "Select 选择器",
    order: 10,
};

import Select from '../../src/index.js';

const options = Array.from({ length: 1000 }, (_, i) => ({
    label: `City ${i + 1}`,
    value: `city-${i + 1}`,
}));

const BasicDemo = () => {
    return <Select aria-label="city" options={options} placeholder="请选择城市" />;
};

export default BasicDemo;
