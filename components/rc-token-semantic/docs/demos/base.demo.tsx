
/**
 * title = "按钮尺寸"
 * description = "通过 `size` 属性设置按钮尺寸"
 */

import { css } from "@linaria/core";
import token from "../../src/index.js";

const BaseDemo = () => {

    return (
        <div
            className={css`
                margin-bottom: 1rem;
                background-color: ${token.color.background.surface};
                width: 100px;
                height: 100px;
            `}
        >
        </div>
    )
}

export default BaseDemo;