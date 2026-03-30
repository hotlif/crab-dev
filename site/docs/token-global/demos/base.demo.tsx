/**
 * title = "全局令牌"
 * description = "展示全局设计令牌的颜色应用"
 */

import { css } from "@linaria/core";
import token from "@crab-dev/rc-token-global";

const BaseDemo = () => {
    return (
        <div
            className={css`
                margin-bottom: 1rem;
                background-color: ${token.zinc[900]};
                width: 100px;
                height: 100px;
            `}
        >
        </div>
    )
}

export default BaseDemo;
