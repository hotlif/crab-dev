
/**
 * title = "外观设置"
 * description = "通过 `appearance` 属性设置按钮外观"
 */

import Button from "../../src/index";
import { css } from "@linaria/core";

const SizeDemo = () => {
    return (
        <div
            className={css`
                display: flex;
                align-items: center;
                gap: 1rem;
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