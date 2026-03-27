
/**
 * title = "禁用状态"
 * description = "添加 `disabled` 属性即可让按钮处于禁用状态"
 */

import { css } from "@linaria/core";
import Button from "../../src/index.js";

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
        </div>
    )
}

export default SizeDemo;