
/**
 * title = "基础的时间选择器带日期的"
 * description = "一个基础的时间选择器带日期的示例"
 */

import { Temporal } from "@js-temporal/polyfill";
import DateTimePickerPanel from "../../src/panels/dateTimePickerPanel";


const now = Temporal.Now.zonedDateTimeISO();

const SizeDemo = () => {

    return (
        <div>
            <DateTimePickerPanel
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