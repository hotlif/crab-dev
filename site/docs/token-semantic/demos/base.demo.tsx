/**
 * title = "语义令牌"
 * description = "展示语义化设计令牌的颜色应用"
 */

import { css } from "@linaria/core";
import token from "@crab-dev/rc-token-semantic";

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
