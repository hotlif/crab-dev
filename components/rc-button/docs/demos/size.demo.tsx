
/**
 * title = "按钮尺寸"
 * description = "通过 `size` 属性设置按钮尺寸"
 */

import Button from "@crab-dev/rc-button";
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
            <Button size="small">
                small
            </Button>
            <Button size="middle">
                medium
            </Button>
            <Button size="large">
                large
            </Button>
        </div>
    )
}

export default SizeDemo;