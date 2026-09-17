import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import BarChart from "@crab-dev/rc-bar-chart";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    return (
        <div className={layout}>
            <BarChart
                aria-label="本周任务数量"
                categories={["周一", "周二", "周三"]}
                series={[
                    {
                        name: "完成任务",
                        data: [8, 12, 10],
                    },
                ]}
                width="auto"
                height={240}
            />
            <p>完成任务：周一 8，周二 12，周三 10。</p>
        </div>
    );
}
