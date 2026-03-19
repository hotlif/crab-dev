/**
 * title = "日期面板"
 * description = "基础的日期选择面板组件示例。"
 */

import { Temporal } from "@js-temporal/polyfill";
import DatePickerPanel from "../../src/panels/datePickerPanel";


const now = Temporal.Now.zonedDateTimeISO();

const SizeDemo = () => {

    return (
        <div>
            <DatePickerPanel
                value={now}
                weekStartDay={1}
                range={{
                    start: now.subtract({ days: 7 }),
                    end: now.add({ days: 7 }),
                }}
            />
        </div>
    )
}

export default SizeDemo;