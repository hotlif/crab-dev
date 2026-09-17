
export const meta = {
    title: "禁用状态",
    description: "展示全部六种外观的 disabled 状态；禁用按钮不会触发操作。",
};

import { css } from "@crab-dev/css";
import Button from "../../src/index.js";

const SizeDemo = () => {
    return (
        <div
            className={css`
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 1rem;
            `}
        >
            <Button
                disabled
                appearance="primary"
            >
                primary
            </Button>
            <Button
                disabled
                appearance="subtle"
            >
                subtle
            </Button>
            <Button
                disabled
                appearance="dashed"
            >
                dashed
            </Button>
            <Button
                disabled
                appearance="text"
            >
                text
            </Button>
            <Button
                disabled
                appearance="link"
            >
                link
            </Button>
            <Button disabled appearance="danger">danger</Button>
        </div>
    )
}

export default SizeDemo;
