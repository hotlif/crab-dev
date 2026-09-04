
export const meta = {
    title: "外观设置",
    description: "通过 `appearance` 属性设置按钮外观",
};

import Button from "../../src/index.js";
import { css } from "@crab-dev/css";

const SizeDemo = () => {
    return (
        <div
            className={css`
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                gap: var(--token-semantic-space-component-gap);
            `}
        >
            <Button
                appearance="primary"
            >
                primary
            </Button>
            <Button appearance="subtle">
                subtle
            </Button>
            <Button appearance="dashed">
                dashed
            </Button>
            <Button appearance="text">
                text
            </Button>
            <Button appearance="link">
                link
            </Button>
        </div>
    )
}

export default SizeDemo;
