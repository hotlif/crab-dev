export const meta = {
    title: "日期时间面板",
    description: "基础的日期时间选择面板组件示例。",
};

import DateTimePickerPanel from "../../src/panels/dateTimePickerPanel.js";


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
