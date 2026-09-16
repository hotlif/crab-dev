import { useId, useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { DatePicker } from "@crab-dev/rc-date-picker";
import "@crab-dev/rc-date-picker/css/index.css";
const fieldStyle = css`
    display: grid;
    gap: ${token.space["component-gap"]};
    max-width: calc(${token.space["page-padding"]} * 12);
`;
export default function Example() {
    const id = useId();
    const [value, setValue] = useState<Temporal.ZonedDateTime | null>(null);
    return (
        <div className={fieldStyle}>
            <label htmlFor={id}>计划日期</label>
            <DatePicker id={id} timeZone="Asia/Shanghai" value={value} onValueChange={setValue} />
        </div>
    );
}
