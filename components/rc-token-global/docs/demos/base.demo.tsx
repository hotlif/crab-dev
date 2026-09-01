
export const meta = {
    title: "按钮尺寸",
    description: "通过 `size` 属性设置按钮尺寸",
};

import { css } from "@crab-dev/css";
import token from "../../src/index.js";

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
