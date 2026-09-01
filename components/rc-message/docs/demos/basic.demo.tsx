export const meta = {
    title: "基础用法",
    description: "通过 `useMessage` Hook 创建消息实例，支持五种类型的消息提示",
};

import { css } from "@crab-dev/css";
import { useMessage } from "../../src/index.js";

const BasicDemo = () => {
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
                <button onClick={() => message.success("操作成功")}>
                    Success
                </button>
                <button onClick={() => message.error("操作失败")}>
                    Error
                </button>
                <button onClick={() => message.warning("警告信息")}>
                    Warning
                </button>
                <button onClick={() => message.info("提示信息")}>
                    Info
                </button>
                <button onClick={() => message.loading("加载中...")}>
                    Loading
                </button>
            </div>
        </div>
    );
};

export default BasicDemo;
