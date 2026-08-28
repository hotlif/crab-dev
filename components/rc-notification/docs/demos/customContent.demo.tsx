
export const meta = {
    title: "自定义内容",
    description: "一个自定义消息通知的示例",
};

import { useState } from "react";
import { useNotification } from "../../src/index.js";
import { css } from "@crab-dev/css";

const SizeDemo = () => {
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

export default SizeDemo;
