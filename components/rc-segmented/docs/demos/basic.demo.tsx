export const meta = {
    title: "基础用法",
    description: "通过 options 传入选项, 默认选中第一个可用项。",
};

import Segmented from '../../src/index.js';

const BasicDemo = () => {
    return (
        <Segmented
            options={[
                { label: '日', value: 'day' },
                { label: '周', value: 'week' },
                { label: '月', value: 'month' },
            ]}
        />
    );
};

export default BasicDemo;
