export const meta = {
    title: '居中标签',
    description: '标签未溢出时在可用区域居中；溢出时仍可访问起始标签。',
};

import Tabs from '../../src/tabs.js';

const CenteredDemo = () => <Tabs centered items={[
    { key: 'overview', label: '概览', children: '概览内容' },
    { key: 'settings', label: '设置', children: '设置内容' },
]} />;

export default CenteredDemo;
