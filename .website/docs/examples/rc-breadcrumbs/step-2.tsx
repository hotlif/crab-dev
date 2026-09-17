import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Breadcrumbs from "@crab-dev/rc-breadcrumbs";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [page, setPage] = useState("成员详情");
    return (
        <div className={layout}>
            <Breadcrumbs
                items={[
                    {
                        key: "home",
                        title: "工作区",
                        onClick: () => setPage("工作区"),
                    },
                    {
                        key: "users",
                        title: "成员",
                        onClick: () => setPage("成员"),
                    },
                    {
                        key: "detail",
                        title: "成员详情",
                    },
                ]}
            />
            <output aria-live="polite">当前示例位置：{page}</output>
        </div>
    );
}
