import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import AppMainLayout, { AppMainLayoutProvider } from "@crab-dev/rc-app-main-layout";
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
const overview = (
    <Card title="项目概览">
        <p>本地演示工作区 · 2 位成员</p>
        <p>从侧栏进入成员管理，练习编辑与页面切换。</p>
    </Card>
);
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
                    <AppMainLayout sidebarTitle="Crab 工作区" fullscreenable={false}
                        contentLandmark={{ role: "region", "aria-label": "后台工作区示例" }} />
                </AppMainLayoutProvider>
            </div>
        </div>
    );
}
