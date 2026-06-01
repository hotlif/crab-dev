
/**
 * title = "基本"
 * description = "一个基础的消息通知组件"
 */

import { useState } from "react";
import { type Direction, useNotification } from "../../src/index.js";
import { css } from "@linaria/core";


let i = 0;

const SizeDemo = () => {
    const [direction, setDirection] = useState<Direction>("topRight")
    const [notification, contextHolder] = useNotification();
    return (
        <div
            className={css`
                margin-bottom: 1rem;
            `}
        >
            <label>
                请选择方向
            </label>
            <select
                value={direction}
                onChange={e => setDirection(e.target.value as Direction)}
            >
                <option value="top">Top</option>
                <option value="topLeft">Top Left</option>
                <option value="topRight">Top Right</option>
                <option value="bottom">Bottom</option>
                <option value="bottomLeft">Bottom Left</option>
                <option value="bottomRight">Bottom Right</option>
            </select>

            <button
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
            </button>
            {contextHolder}
        </div>
    )
}

export default SizeDemo;
