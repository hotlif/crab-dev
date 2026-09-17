import Button from "@crab-dev/rc-button";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import AppMainLayout, {
    AppMainLayoutProvider,
    useAppMainLayoutTabs,
} from "@crab-dev/rc-app-main-layout";
import { MenuItemType } from "@crab-dev/rc-menu";
import Card from "@crab-dev/rc-card";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
const frame = css`
    height: calc(${token.space["section-gap"]} * 36);
    min-width: 0;
    overflow: hidden;
    border: 1px solid ${token.color.border.default};
    border-radius: ${token.radius.md};
`;
function Overview() {
    const { openTab } = useAppMainLayoutTabs();
    return (
        <Card title="项目概览">
            <p>本地演示工作区 · 2 位成员</p>
            <p>从菜单或下面的按钮进入成员管理。</p>
            <Button
                appearance="primary"
                onClick={() =>
                    openTab({
                        key: "members",
                        title: "成员管理",
                        children: <Members />,
                        closable: true,
                    })
                }
            >
                打开成员管理
            </Button>
        </Card>
    );
}
const overview = <Overview />;
const loadMenus = async () => [
    {
        key: "members",
        type: MenuItemType.Item,
        title: "成员管理",
    },
];
function Workspace() {
    const { openTab } = useAppMainLayoutTabs();
    return (
        <AppMainLayout
            sidebarTitle="Crab 工作区"
            onLogoClick={() =>
                openTab({
                    key: "overview",
                    title: "概览",
                    children: overview,
                    closable: false,
                })
            }
            onBell={() =>
                openTab({
                    key: "notifications",
                    title: "通知",
                    children: <Card title="通知中心">当前没有待处理通知。</Card>,
                    closable: true,
                })
            }
            onUserClick={() =>
                openTab({
                    key: "account",
                    title: "演示账号",
                    children: <Card title="演示账号">当前使用本地演示身份，不连接登录服务。</Card>,
                    closable: true,
                })
            }
            fullscreenable={false}
            sidebarLoadMenus={loadMenus}
            onSidebarMenuItemClick={() =>
                openTab({
                    key: "members",
                    title: "成员管理",
                    children: <Members />,
                    closable: true,
                })
            }
        />
    );
}
function Members() {
    return <Card title="成员管理">林晓 · 周宁</Card>;
}
export default function Example() {
    return (
        <div className={layout}>
            <p>本地模拟管理页面，编辑不会写入后端。</p>
            <div className={frame}>
                <AppMainLayoutProvider
                    initialTabs={[
                        {
                            key: "overview",
                            title: "概览",
                            children: overview,
                            closable: false,
                        },
                    ]}
                    initialActiveTabKey="overview"
                >
                    <Workspace />
                </AppMainLayoutProvider>
            </div>
        </div>
    );
}
