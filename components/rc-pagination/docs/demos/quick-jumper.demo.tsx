/**
 * title = "快速跳转"
 * description = "开启 showQuickJumper 后，用户可直接输入目标页码并回车跳转"
 */
import { useState } from "react";
import Pagination from "../../src/index.js";

export default function QuickJumperDemo() {
    const [current, setCurrent] = useState(1);
    return (
        <Pagination
            current={current}
            total={500}
            pageSize={10}
            onChange={(page) => setCurrent(page)}
            showQuickJumper
        />
    );
}
