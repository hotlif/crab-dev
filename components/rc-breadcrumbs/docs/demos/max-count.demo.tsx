export const meta = {
    title: "路径折叠",
    description: "使用 maxCount 折叠中间层级，保持界面简洁",
};

import Breadcrumbs from '../../src/index.js';

const MaxCountDemo = () => {
    return (
        <Breadcrumbs
            maxCount={4}
            items={[
                { title: 'Home', href: '/' },
                { title: 'Design', href: '/design' },
                { title: 'Navigation', href: '/navigation' },
                { title: 'Breadcrumbs', href: '/breadcrumbs' },
                { title: 'Examples', href: '/examples' },
                { title: 'Current Page' },
            ]}
        />
    );
};

export default MaxCountDemo;
