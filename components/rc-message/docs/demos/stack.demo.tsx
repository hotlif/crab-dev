export const meta = {
    title: "消息堆叠",
    description: "当消息数量超过 3 条时，旧消息会自动折叠。最新的一条在最前面，后面的消息缩小并淡出",
};

import { css } from "@crab-dev/css";
import { useMessage } from "../../src/index.js";

let count = 0;

const StackDemo = () => {
    const [message, contextHolder] = useMessage();

    const handleBatch = () => {
        const types = ['success', 'info', 'warning', 'error', 'loading'] as const;
        for (let i = 0; i < 5; i++) {
            count += 1;
            const type = types[i % types.length];
            message.open({
                type,
                content: `第 ${count} 条消息 — ${type}`,
                duration: 5000,
            });
        }
    };

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
                <button onClick={handleBatch}>
                    一次发送 5 条消息
                </button>
                <button onClick={() => { count += 1; message.info(`单条消息 #${count}`, 8000); }}>
                    发送单条（8s）
                </button>
            </div>
        </div>
    );
};

export default StackDemo;
