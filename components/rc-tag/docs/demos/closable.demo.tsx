export const meta = {
    title: "可关闭标签",
    description: "添加 `closable` 属性使标签可关闭，配合 `onClose` 回调处理关闭逻辑",
};

import { css } from "@crab-dev/css";
import Button from "@crab-dev/rc-button";
import token from "@crab-dev/rc-token-semantic";
import { useState } from "react";
import Tag from "../../src/index.js";

const colors = ["default", "primary", "success", "warning", "error"] as const;

const ClosableDemo = () => {
    const [visible, setVisible] = useState<Record<string, boolean>>(
        Object.fromEntries(colors.map(c => [c, true]))
    );

    const handleClose = (color: string) => {
        setVisible(prev => ({ ...prev, [color]: false }));
    };

    const allHidden = colors.every(c => !visible[c]);

    return (
        <div>
            <div
                className={css`
                    display: flex;
                    align-items: center;
                    gap: ${token.space["component-gap"]};
                    flex-wrap: wrap;
                    min-height: 32px;
                `}
            >
                {colors.map(color =>
                    visible[color] ? (
                        <Tag
                            key={color}
                            color={color}
                            closable
                            onClose={() => handleClose(color)}
                        >
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                        </Tag>
                    ) : null
                )}
                {allHidden && (
                    <Button
                        onClick={() => setVisible(Object.fromEntries(colors.map(c => [c, true])))}
                    >
                        重置
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ClosableDemo;
