
/**
 * title = "基本"
 * description = "一个基础的消息通知组件"
 */

import { useState } from "react";
import Notification, { Direction } from "../../src/index";
import { css } from "@linaria/core";

const SizeDemo = () => {
    const [open, setOpen] = useState(false)
    const [direction, setDirection] = useState<Direction>("topRight")
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

            <button onClick={() => setOpen(!open)}>切换状态</button>
            <Notification
                open={open}
                onOpenChange={setOpen}
                direction={direction}
                title="系统消息"
            >
                这是一个发送的系统消息信息
            </Notification>
        </div>
    )
}

export default SizeDemo;