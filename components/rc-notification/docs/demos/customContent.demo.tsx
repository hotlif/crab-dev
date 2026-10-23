export const meta = {
    title: "自定义内容",
    description: "在通知中编辑备注，每条通知独立维护输入内容；此示例需手动关闭。",
};

import { useState } from "react";
import { css } from "@crab-dev/css";
import Button from "@crab-dev/rc-button";
import TextEdit from "@crab-dev/rc-text-edit";
import token from "@crab-dev/rc-token-semantic";
import { useNotification } from "../../src/index.js";

const layoutStyle = css`
    margin-bottom: ${token.space["section-gap"]};
`;

const contentStyle = css`
    padding-block-start: ${token.space["component-gap"]};
`;

const NotificationContent = () => {
    const [value, setValue] = useState("");

    return (
        <div className={contentStyle}>
            <TextEdit
                label="通知备注"
                supportingText="备注仅保留在当前通知中，关闭后清除。"
                rows={3}
                value={value}
                onChange={event => setValue(event.target.value)}
            />
        </div>
    );
};

const CustomContentDemo = () => {
    const [notification, contextHolder] = useNotification();

    return (
        <div className={layoutStyle}>
            <Button
                onClick={() => {
                    notification.open({
                        title: "自定义内容",
                        description: <NotificationContent />,
                        direction: "bottomRight",
                        duration: 0,
                    });
                }}
            >
                发送通知
            </Button>
            {contextHolder}
        </div>
    );
};

export default CustomContentDemo;
