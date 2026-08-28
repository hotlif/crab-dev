export const meta = {
    title: "多选模式",
    description: "设置 multiple 启用多选",
};

import Select from '../../src/index.js';

const options = Array.from({ length: 1000 }, (_, i) => ({
    label: `Framework ${i + 1}`,
    value: `framework-${i + 1}`,
}));

const MultipleDemo = () => {
    return (
        <Select
            aria-label="framework"
            multiple
            options={options}
            placeholder="请选择框架"
            defaultValue={["framework-1", "framework-2"]}
        />
    );
};

export default MultipleDemo;
