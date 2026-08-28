export const meta = {
    title: "基础用法",
    description: "最简单的数字徽标、圆点徽标与独立标记。",
};

import { css } from "@crab-dev/css";
import Badge from "../../src/index.js";

const BasicDemo = () => {
    return (
        <div
            className={css`
                display: flex;
                align-items: center;
                gap: 1.5rem;
                flex-wrap: wrap;
            `}
        >
            <Badge count={5} />
            <Badge count={0} showZero />
            <Badge count={120} overflowCount={99} />
            <Badge dot />
        </div>
    );
};

export default BasicDemo;
