export const meta = {
    title: "基础用法",
    description: "通过 items 快速配置基础面包屑",
};

import Breadcrumbs from '../../src/index.js';

const BasicDemo = () => {
    return (
        <Breadcrumbs
            items={[
                { title: '首页', href: '/' },
                { title: '组件', href: '/components' },
                { title: '面包屑' },
            ]}
        />
    );
};

export default BasicDemo;
