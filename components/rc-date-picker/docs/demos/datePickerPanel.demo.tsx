
/**
 * title = "基本"
 * description = "一个基础的消息通知组件"
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