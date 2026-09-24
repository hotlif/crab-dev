import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import AppMainLayout, { AppMainLayoutProvider } from "@crab-dev/rc-app-main-layout";
const frame = css`
    height: calc(${token.space["section-gap"]} * 30);
    min-width: 0;
    overflow: hidden;
`;
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
                <AppMainLayout sidebarTitle="项目工作区" fullscreenable={false}
                    contentLandmark={{ role: "region", "aria-label": "项目工作区示例" }} />
            </AppMainLayoutProvider>
        </div>
    );
}
