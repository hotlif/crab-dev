
export const meta = {
    title: "基本",
    description: "一个基础的消息通知组件",
};

import { useState } from "react";
import { type Direction, useNotification } from "../../src/index.js";
import { css } from "@crab-dev/css";
import Button from "@crab-dev/rc-button";
import Select from "@crab-dev/rc-select";
import token from "@crab-dev/rc-token-semantic";

const directionOptions: Array<{ label: string; value: Direction }> = [
    { label: "Top", value: "top" },
    { label: "Top Left", value: "topLeft" },
    { label: "Top Right", value: "topRight" },
    { label: "Bottom", value: "bottom" },
    { label: "Bottom Left", value: "bottomLeft" },
    { label: "Bottom Right", value: "bottomRight" },
];

const layoutStyle = css`
    display: grid;
    gap: ${token.space["section-gap"]};
    width: 100%;
    max-width: calc(${token.size[64]} * 5);
    margin-bottom: ${token.space["section-gap"]};
`;

let i = 0;

const SizeDemo = () => {
    const [direction, setDirection] = useState<Direction>("topRight")
    const [notification, contextHolder] = useNotification();
    return (
        <div className={layoutStyle}>
            <Select
                label="请选择方向"
                value={direction}
                options={directionOptions}
                onChange={value => {
                    const option = directionOptions.find(item => item.value === value);
                    if (option) setDirection(option.value);
                }}
            />

            <Button
                onClick={() => {
                    i += 1;
                    notification.open({
                        title: "系统消息",
                        description: `这是一个发送的系统消息信息 ${i}`,
                        direction: direction,
                        duration: 3000
                    })
                }}
            >
                发送通知
            </Button>
            {contextHolder}
        </div>
    )
}

export default SizeDemo;
