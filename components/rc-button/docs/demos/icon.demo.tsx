export const meta = {
    title: "图标按钮",
    description: "通过 icon 设置按钮图标，使用切换按钮对照正常与加载状态。",
};

import { css } from "@crab-dev/css";
import { Lollipop } from 'lucide-react';
import token from "@crab-dev/rc-token-semantic";
import { useState } from "react";
import Button from "../../src/index.js";

const IconDemo = () => {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <div>
            <div
                className={css`
                    margin-bottom: ${token.space["section-gap"]};
                `}
            >
                <Button isSelected={isLoading} onClick={() => setIsLoading(loading => !loading)}>显示加载状态</Button>
            </div>
            <div
                className={css`
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: ${token.space["section-gap"]};
                    margin-bottom: calc(${token.space["section-gap"]} * 2);
                `}
            >
                
                <Button
                    loading={isLoading}
                    icon={<Lollipop />}
                    appearance="primary"
                >
                    primary
                </Button>
                <Button
                    loading={isLoading}
                    icon={<Lollipop />}
                    appearance="outlined"
                >
                    Outlined
                </Button>
                <Button
                    loading={isLoading}
                    icon={<Lollipop />}
                    appearance="text"
                >
                    text
                </Button>
            </div>
        </div>
    )
}

export default IconDemo;
