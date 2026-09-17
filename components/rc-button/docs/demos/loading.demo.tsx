
export const meta = {
    title: "加载中",
    description: "展示全部六种外观的 loading 状态；加载指示持续显示，方便比较。",
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
                loading
                appearance="primary"
            >
                primary
            </Button>
            <Button
                loading
                appearance="subtle"
            >
                subtle
            </Button>
            <Button
                loading
                appearance="dashed"
            >
                dashed
            </Button>
            <Button
                loading
                appearance="text"
            >
                text
            </Button>
            <Button
                loading
                appearance="link"
            >
                link
            </Button>
            <Button loading appearance="danger">danger</Button>
        </div>
    )
}

export default SizeDemo;
