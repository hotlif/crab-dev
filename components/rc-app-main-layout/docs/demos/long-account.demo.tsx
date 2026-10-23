export const meta = {
    title: '长账号信息',
    description: '账号与角色文本在可用空间内省略，工具栏操作和头像保持可达。',
};

import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import Layout from '../../src/layout.js';
import AppMainLayoutProvider from '../../src/context.js';

const frameStyle = css`
    width: 100%;
    height: calc(${token.size['touch-target']} * 6);
`;

const loadUser = async () => ({
    name: 'administrator-with-a-long-account-name@example.com',
    roleName: '企业资源与全局系统权限管理工作组管理员',
});

const LongAccountDemo = () => <div className={frameStyle}>
    <AppMainLayoutProvider initialTabs={[{ key: 'overview', title: '概览', children: '工作区内容' }]}>
        <Layout headerLoadUser={loadUser} contentLandmark={{ role: 'region', 'aria-label': '长账号工作区示例' }} />
    </AppMainLayoutProvider>
</div>;

export default LongAccountDemo;
