import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import CronPicker from "@crab-dev/rc-cron-picker";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-cron-picker/css/index.css";
import "@crab-dev/rc-button/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [value, setValue] = useState("0 9 * * *");
    return (
        <div className={layout}>
            <CronPicker
                value={value}
                onChange={setValue}
                previewCount={3}
                aria-label="任务执行规则"
            />
            <output>待保存规则：{value}</output>
            <Button onClick={() => setValue("0 9 * * 1-5")}>仅工作日</Button>
        </div>
    );
}
