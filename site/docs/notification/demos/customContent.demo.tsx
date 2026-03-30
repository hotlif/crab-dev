/**
 * title = "自定义内容"
 * description = "一个自定义消息通知的示例"
 */

import { useState } from "react";
import { useNotification } from "@crab-dev/rc-notification";
import { css } from "@linaria/core";

let i = 0;

const CustomContentDemo = () => {
    const [value, setValue] = useState<string>("")
    const [notification, contextHolder] = useNotification();
    return (
        <div
            className={css`
                margin-bottom: 1rem;
            `}
        >
            <button
                onClick={() => {
                    i += 1;
                    notification.open({
                        title: "自定义内容",
                        description: (
                            <textarea
                                value={value}
                                onChange={e => setValue(e.target.value)}
                            />
                        ),
                        direction: "bottomRight",
                        duration: 0
                    })
                }}
            >
                发送通知
            </button>
            {contextHolder}
        </div>
    )
}

export default CustomContentDemo;
