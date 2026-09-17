export const meta = {
    title: "多条通知层叠",
    description: "连续发送通知，观察缩放、表面色和阴影的层级。点击前层的关闭按钮，后层会平滑接替；此示例需手动关闭。",
};

import { useRef, useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Button from "@crab-dev/rc-button";
import { useNotification, type Direction } from "../../src/index.js";

const layout = css`
    display: grid;
    gap: ${token.space["section-gap"]};
`;
const row = css`
    display: flex;
    flex-wrap: wrap;
    gap: ${token.space["component-gap"]};
`;
const directions: { value: Direction; label: string }[] = [
    { value: "topLeft", label: "左上方" },
    { value: "top", label: "顶部居中" },
    { value: "topRight", label: "右上方" },
    { value: "bottomLeft", label: "左下方" },
    { value: "bottom", label: "底部居中" },
    { value: "bottomRight", label: "右下方" },
];

export default function StackDemo() {
    const [direction, setDirection] = useState<Direction>("topRight");
    const [notification, holder] = useNotification();
    // Instance state: number notifications from event handlers without rendering.
    const sequence = useRef(0);
    const send = (count: number) => {
        for (let index = 0; index < count; index += 1) {
            sequence.current += 1;
            notification.open({
                title: `任务完成 · ${sequence.current}`,
                description: sequence.current % 2 === 0
                    ? "报表已生成，相关文件已经保存。关闭这条通知后，可以继续查看之前完成的任务。"
                    : "项目数据已同步，可以继续处理下一项任务。",
                direction,
                duration: 0,
            });
        }
    };
    return (
        <div className={layout}>
            <div className={row} role="group" aria-label="通知显示位置">
                {directions.map(item => (
                    <Button key={item.value} aria-pressed={direction === item.value}
                        onClick={() => setDirection(item.value)}>{item.label}</Button>
                ))}
            </div>
            <div className={row}>
                <Button appearance="primary" onClick={() => send(3)}>连续发送 3 条</Button>
                <Button onClick={() => send(1)}>再添加 1 条</Button>
            </div>
            {holder}
        </div>
    );
}
