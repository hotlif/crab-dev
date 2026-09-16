import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import BarChart from "@crab-dev/rc-bar-chart";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-bar-chart/css/index.css";
import "@crab-dev/rc-button/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [stacked, setStacked] = useState(false);
    return (
        <div className={layout}>
            <Button onClick={() => setStacked((value) => !value)}>
                模式：{stacked ? "堆叠" : "分组"}
            </Button>
            <BarChart
                aria-label="完成与待办任务"
                categories={["周一", "周二", "周三"]}
                series={[
                    {
                        name: "完成",
                        data: [8, 12, 10],
                    },
                    {
                        name: "待办",
                        data: [3, 2, 4],
                    },
                ]}
                stacked={stacked}
                width="auto"
                height={240}
            />
            <p>完成：8 / 12 / 10；待办：3 / 2 / 4。</p>
        </div>
    );
}
