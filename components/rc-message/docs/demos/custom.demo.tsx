/**
 * title = "自定义图标与持续时间"
 * description = "通过 `icon` 自定义图标，通过 `duration` 设置持续时间，设为 0 则不自动关闭"
 */

import { css } from "@linaria/core";
import { useMessage } from "../../src/index.js";

const CustomDemo = () => {
    const [message, contextHolder] = useMessage();

    return (
        <div>
            {contextHolder}
            <div
                className={css`
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                `}
            >
                <button
                    onClick={() =>
                        message.open({
                            type: "success",
                            content: "自定义图标消息",
                            icon: <span>🎉</span>,
                        })
                    }
                >
                    自定义图标
                </button>
                <button
                    onClick={() =>
                        message.open({
                            type: "info",
                            content: "10 秒后关闭",
                            duration: 10000,
                        })
                    }
                >
                    10 秒持续时间
                </button>
            </div>
        </div>
    );
};

export default CustomDemo;
