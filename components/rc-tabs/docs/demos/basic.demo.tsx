/**
 * title = "基础用法"
 * description = "通过 items 配置基础标签页，默认使用 line 形态。"
 */

import Tabs from '../../src/index.js';

const BasicDemo = () => {
    return (
        <Tabs
            items={[
                { key: 'overview', label: '概览', children: <p>概览内容：展示关键指标与最新动态。</p> },
                { key: 'logs', label: '日志', children: <p>日志内容：按时间倒序的操作记录。</p> },
                { key: 'settings', label: '设置', children: <p>设置内容：调整偏好与权限。</p> },
            ]}
        />
    );
};

export default BasicDemo;
