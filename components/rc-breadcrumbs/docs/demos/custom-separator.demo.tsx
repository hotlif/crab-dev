/**
 * title = "自定义分隔符"
 * description = "通过 separator 属性替换默认斜杠分隔"
 */

import Breadcrumbs from '../../src/index.js';

const CustomSeparatorDemo = () => {
    return (
        <Breadcrumbs
            separator="→"
            items={[
                { title: 'Design', href: '/design' },
                { title: 'Navigation', href: '/design/navigation' },
                { title: 'Breadcrumbs' },
            ]}
        />
    );
};

export default CustomSeparatorDemo;
