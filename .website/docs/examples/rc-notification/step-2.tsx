import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { useNotification } from "@crab-dev/rc-notification";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-notification/css/index.css";
import "@crab-dev/rc-button/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [notification, holder] = useNotification();
    const [left, setLeft] = useState(false);
    return (
        <div className={layout}>
            {holder}
            <Button onClick={() => setLeft((value) => !value)}>
                方向：{left ? "左上" : "右上"}
            </Button>
            <Button
                onClick={() =>
                    notification.open({
                        title: "后台任务完成",
                        description: "现在可以继续处理列表。",
                        direction: left ? "topLeft" : "topRight",
                        duration: 3000,
                    })
                }
            >
                显示通知
            </Button>
        </div>
    );
}
