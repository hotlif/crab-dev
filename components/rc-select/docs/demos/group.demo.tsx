/**
 * title = "分组选项"
 * description = "使用 { label, options } 结构对选项进行分组"
 */

import Select from '../../src/index.js';

const options = [
    {
        label: '水果',
        options: [
            { label: '苹果', value: 'apple' },
            { label: '香蕉', value: 'banana' },
            { label: '橙子', value: 'orange' },
        ],
    },
    {
        label: '蔬菜',
        options: [
            { label: '胡萝卜', value: 'carrot' },
            { label: '西兰花', value: 'broccoli' },
            { label: '菠菜', value: 'spinach' },
        ],
    },
];

const GroupDemo = () => {
    return (
        <Select
            aria-label="group"
            options={options}
            placeholder="请选择食物"
        />
    );
};

export default GroupDemo;
