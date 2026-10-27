import Select from "@crab-dev/rc-select";
export const meta = {
    title: "多列布局",
    description: "通过 `columns` 属性控制列数",
};

import { cx } from "@crab-dev/css";
import { itemStyle, heightStyles, controlStyle } from "../demo-style.js";
import { useState } from "react";
import Masonry from "../../src/index.js";

const items = [
    { height: 100 },
    { height: 160 },
    { height: 120 },
    { height: 200 },
    { height: 80 },
    { height: 140 },
    { height: 180 },
    { height: 110 },
];

const ColumnsDemo = () => {

    const [columns, setColumns] = useState(3);

    return (
        <div>
            <div className={controlStyle}>
                <Select label="列数" value={String(columns)}
                    options={[2, 3, 4, 5].map((count) => ({ label: `${count} 列`, value: String(count) }))}
                    onValueChange={(value) => { if (value) setColumns(Number(value)); }} />
            </div>
            <Masonry columns={columns} gutter={12}>
                {items.map((item, i) => (
                    <div
                        key={i}
                        className={cx.call(undefined, itemStyle, heightStyles[item.height])}

                    >
                        Item {i + 1}
                    </div>
                ))}
            </Masonry>
        </div>
    );
};

export default ColumnsDemo;
