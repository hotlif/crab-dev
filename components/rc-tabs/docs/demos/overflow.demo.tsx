export const meta = {
    title: '溢出标签',
    description: '初始激活最后一项，自动滚动标签条以显示当前位置。',
};

import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import Tabs from '../../src/tabs.js';

const widthStyle = css`max-width: calc(${token.size['touch-target']} * 6);`;
const labels = ['产品概览', '分析报告', '成员管理', '操作记录', '通知设置', '权限设置'];

const OverflowDemo = () => <Tabs className={widthStyle} defaultValue="权限设置" items={labels.map(label => ({
    key: label,
    label,
    children: `${label}的内容`,
}))} />;

export default OverflowDemo;
