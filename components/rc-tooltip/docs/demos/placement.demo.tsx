export const meta = {
    title: "位置",
    description: "支持 12 个方向的弹出位置。",
};

import { css } from "@crab-dev/css";
import Tooltip from "../../src/index.js";

const gridStyle = css`
    display: grid;
    grid-template-columns: repeat(5, 80px);
    grid-template-rows: repeat(5, 40px);
    gap: 4px;
    justify-content: center;
    padding: 40px;
`;

const btnStyle = css`
    cursor: pointer;
    font-size: 12px;
`;

const PlacementDemo = () => {
    return (
        <div className={gridStyle}>
            {/* 第 1 行 */}
            <span />
            <Tooltip title="top-start" placement="top-start">
                <button className={btnStyle}>TL</button>
            </Tooltip>
            <Tooltip title="top" placement="top">
                <button className={btnStyle}>Top</button>
            </Tooltip>
            <Tooltip title="top-end" placement="top-end">
                <button className={btnStyle}>TR</button>
            </Tooltip>
            <span />

            {/* 第 2 行 */}
            <Tooltip title="left-start" placement="left-start">
                <button className={btnStyle}>LT</button>
            </Tooltip>
            <span />
            <span />
            <span />
            <Tooltip title="right-start" placement="right-start">
                <button className={btnStyle}>RT</button>
            </Tooltip>

            {/* 第 3 行 */}
            <Tooltip title="left" placement="left">
                <button className={btnStyle}>Left</button>
            </Tooltip>
            <span />
            <span />
            <span />
            <Tooltip title="right" placement="right">
                <button className={btnStyle}>Right</button>
            </Tooltip>

            {/* 第 4 行 */}
            <Tooltip title="left-end" placement="left-end">
                <button className={btnStyle}>LB</button>
            </Tooltip>
            <span />
            <span />
            <span />
            <Tooltip title="right-end" placement="right-end">
                <button className={btnStyle}>RB</button>
            </Tooltip>

            {/* 第 5 行 */}
            <span />
            <Tooltip title="bottom-start" placement="bottom-start">
                <button className={btnStyle}>BL</button>
            </Tooltip>
            <Tooltip title="bottom" placement="bottom">
                <button className={btnStyle}>Bottom</button>
            </Tooltip>
            <Tooltip title="bottom-end" placement="bottom-end">
                <button className={btnStyle}>BR</button>
            </Tooltip>
            <span />
        </div>
    );
};

export default PlacementDemo;
