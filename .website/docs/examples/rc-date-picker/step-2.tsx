import { useId, useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { DatePicker } from "@crab-dev/rc-date-picker";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-date-picker/css/index.css";
import "@crab-dev/rc-button/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["component-gap"]};
    max-width: calc(${token.space["page-padding"]} * 12);
`;
export default function Example() {
    const id = useId();
    const [value, setValue] = useState<Temporal.ZonedDateTime | null>(null);
    return (
        <div className={layout}>
            <label htmlFor={id}>计划日期</label>
            <DatePicker id={id} timeZone="Asia/Shanghai" value={value} onValueChange={setValue} />
            <output>业务日期：{value?.toPlainDate().toString() ?? "未选择"}</output>
            <Button onClick={() => setValue(null)}>清空日期</Button>
        </div>
    );
}
