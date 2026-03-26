
/**
 * title = "加载中"
 * description = "添加 `loading` 属性即可让按钮处于加载状态"
 */

import { css } from "@linaria/core";
import Button from "../../src/index";

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
        </div>
    )
}

export default SizeDemo;