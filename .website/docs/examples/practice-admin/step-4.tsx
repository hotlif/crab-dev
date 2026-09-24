import { useState, useId } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import AppMainLayout, {
    AppMainLayoutProvider,
    useAppMainLayoutTabs,
} from "@crab-dev/rc-app-main-layout";
import { MenuItemType } from "@crab-dev/rc-menu";
import Card from "@crab-dev/rc-card";
import Button from "@crab-dev/rc-button";
import Drawer from "@crab-dev/rc-drawer";
import LineEdit from "@crab-dev/rc-line-edit";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
    & > p { margin: 0; color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; }
    & > button { justify-self: start; min-height: calc(${token.space["card-padding"]} * 2 + ${token.space["inline-gap"]}); }
`;
const drawerStyle = css`
    --drawer-header-border-color: ${token.color.border.subtle};
    --drawer-close-width: calc(${token.space["card-padding"]} * 2 + ${token.space["inline-gap"]});
`;
const frame = css`
    height: calc(${token.space["section-gap"]} * 36);
    min-width: 0;
    overflow: hidden;
    border: 1px solid ${token.color.border.default};
    border-radius: ${token.radius.md};
`;
const cards = css`
    display: grid;
    grid-template-columns: repeat(
        auto-fit,
        minmax(min(100%, calc(${token.space["section-gap"]} * 12)), 1fr)
    );
    gap: ${token.space["group-gap"]};
    padding: ${token.space["group-gap"]};
    min-width: 0;
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
            contentLandmark={{ role: "region", "aria-label": "后台工作区示例" }}
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
    const [people, setPeople] = useState([
        {
            id: "lin",
            name: "林晓",
            team: "设计",
        },
        {
            id: "zhou",
            name: "周宁",
            team: "研发",
        },
    ]);
    const [editing, setEditing] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [saved, setSaved] = useState("");
    const helpId = useId();
    return (
        <div className={cards}>
            {people.map((person) => (
                <Card
                    key={person.id}
                    title={person.name}
                    extra={
                        <Button
                            onClick={() => {
                                setEditing(person.id);
                                setName(person.name);
                            }}
                        >
                            编辑 {person.name}
                        </Button>
                    }
                >
                    {person.team}团队
                </Card>
            ))}
            <output aria-live="polite">{saved}</output>
            <Drawer className={drawerStyle}
                title="编辑成员"
                open={editing !== null}
                onOpenChange={(open) => {
                    if (!open) setEditing(null);
                }}
            >
                <div className={layout}>
                    <label className={fieldStyle}>
                        姓名（最多 30 字）
                        <LineEdit
                            value={name}
                            maxLength={30}
                            onChange={(event) => setName(event.target.value)}
                            aria-describedby={helpId}
                        />
                    </label>
                    <p id={helpId}>
                        {name.trim()
                            ? "修改只保存在本地示例，重置后恢复。"
                            : "姓名不能为空，请填写后保存。"}
                    </p>
                    <Button
                        appearance="primary"
                        disabled={!name.trim()}
                        onClick={() => {
                            // 业务接入位置：真实项目先等待保存接口成功，再更新列表。
                            setPeople((current) =>
                                current.map((person) =>
                                    person.id === editing
                                        ? {
                                            ...person,
                                            name: name.trim(),
                                        }
                                        : person,
                                ),
                            );
                            setSaved(`已保存：${name.trim()}`);
                            setEditing(null);
                        }}
                    >
                        保存成员
                    </Button>
                </div>
            </Drawer>
        </div>
    );
}
const fieldStyle = css`
    display: grid;
    gap: ${token.space["component-gap"]};
    width: 100%;
    min-width: 0;
    max-width: calc(${token.space["section-gap"]} * 24);
    font-size: ${token.font.size.body};
    font-weight: ${token.font.weight.label};
`;
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
