export const meta = {
    title: "受控模式",
    description: "通过 current 与 onChange 完全托管页码状态",
};
import { useState } from "react";
import { css } from "@crab-dev/css";
import Pagination from "../../src/index.js";

const DATA = Array.from({ length: 87 }, (_, i) => `记录 #${i + 1}`);
const PAGE_SIZE = 8;

const stackStyle = css`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const listStyle = css`
    margin: 0;
    padding-left: 20px;
`;

export default function ControlledDemo() {
    const [current, setCurrent] = useState(1);
    const items = DATA.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

    return (
        <div className={stackStyle}>
            <ul className={listStyle}>
                {items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <Pagination
                current={current}
                total={DATA.length}
                pageSize={PAGE_SIZE}
                onChange={setCurrent}
                showTotal
            />
        </div>
    );
}
