import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import AppMainLayout, {
    AppMainLayoutProvider,
    useAppMainLayoutTabs,
} from "@crab-dev/rc-app-main-layout";
import { MenuItemType } from "@crab-dev/rc-menu";
const frame = css`
    height: calc(${token.space["section-gap"]} * 30);
    min-width: 0;
    overflow: hidden;
`;
const loadMenus = async () => [
    {
        key: "members",
        title: "成员管理",
        type: MenuItemType.Item,
    },
];
function Workspace() {
    const { openTab } = useAppMainLayoutTabs();
    return (
        <AppMainLayout
            sidebarTitle="项目工作区"
            sidebarLoadMenus={loadMenus}
            fullscreenable={false}
            onSidebarMenuItemClick={() =>
                openTab({
                    key: "members",
                    title: "成员管理",
                    children: <p>林晓 · 周宁</p>,
                    closable: true,
                })
            }
        />
    );
}
export default function Example() {
    return (
        <div className={frame}>
            <AppMainLayoutProvider
                initialTabs={[
                    {
                        key: "home",
                        title: "概览",
                        children: <p>欢迎进入项目工作区。</p>,
                    },
                ]}
                initialActiveTabKey="home"
            >
                <Workspace />
            </AppMainLayoutProvider>
        </div>
    );
}
