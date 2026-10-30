import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import LineEdit from '@crab-dev/rc-line-edit';
import { MenuItemType, type MenuItem } from '@crab-dev/rc-menu';
import AppMainLayout, { AppMainLayoutProvider, useAppMainLayoutTabs, type TabItem } from '@crab-dev/rc-app-main-layout';

export const meta = {
    title: '工作区验收矩阵',
    description: '固定账户与菜单数据，核对导航、标签、账户浮层和窄屏抽屉；切换配置与标签保留输入草稿。',
};
const frame = css`
    width: 100%;
    max-width: 1080px;
    min-width: 0;
    height: 480px;
    padding: ${token.space['component-gap']};
    box-sizing: border-box;
    color: ${token.color.text.primary};
    background: ${token.color.surface.content};
`;
const page = css`
    padding: ${token.space['group-gap']};
    min-width: 0;
`;
function DraftPage({ name }: { name: string }) {
    return (
        <div className={page}>
            <h2>{name}</h2>
            <LineEdit label="工作备注" placeholder="保留当前草稿 / Keep this draft" />
        </div>
    );
}
const tabs: TabItem[] = [
    { key: 'overview', title: '概览 Overview', closable: false, children: <DraftPage name="概览 Overview" /> },
    { key: 'orders', title: '订单 Orders', children: <DraftPage name="订单 Orders" /> },
];
const menus: MenuItem[] = [
    { key: 'overview', title: '概览 Overview', type: MenuItemType.Item },
    { key: 'orders', title: '订单 Orders', type: MenuItemType.Item },
];
const loadMenus = () => Promise.resolve(menus);
const loadUser = () => Promise.resolve({ name: '张维 / Wei Zhang', roleName: '系统管理员 / Administrator' });
function Workspace() {
    const { openTab } = useAppMainLayoutTabs();
    return (
        <AppMainLayout
            sidebarTitle="Crab 专业工作区"
            sidebarLogo={<span aria-hidden>◈</span>}
            sidebarLoadMenus={loadMenus}
            headerLoadUser={loadUser}
            fullscreenable={false}
            hasNotification
            contentLandmark={{ role: 'region', 'aria-label': '工作区页面' }}
            onSwitchRole={() => {}}
            onLogout={() => {}}
            onSidebarMenuItemClick={({ item }) =>
                openTab({ key: item.key, title: item.title, children: <DraftPage name={item.title ?? ''} /> })
            }
        />
    );
}
export default function VisualMatrixDemo() {
    return (
        <section aria-label="AppMainLayout visual matrix" className={frame}>
            <AppMainLayoutProvider initialTabs={tabs}>
                <Workspace />
            </AppMainLayoutProvider>
        </section>
    );
}
