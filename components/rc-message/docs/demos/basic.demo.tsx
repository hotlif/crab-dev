export const meta = {
    title: "基础用法",
    description: "通过 `useMessage` Hook 创建消息实例，支持五种类型的消息提示",
};

import { css } from "@crab-dev/css";
import Button from "@crab-dev/rc-button";
import token from "@crab-dev/rc-token-semantic";
import { useMessage } from "../../src/index.js";

const BasicDemo = () => {
    const [message, contextHolder] = useMessage();

    return (
        <div>
            {contextHolder}
            <div
                className={css`
                    display: flex;
                    gap: ${token.space["component-gap"]};
                    flex-wrap: wrap;
                `}
            >
                <Button onClick={() => { message.success("操作成功"); }}>
                    Success
                </Button>
                <Button onClick={() => { message.error("操作失败"); }}>
                    Error
                </Button>
                <Button onClick={() => { message.warning("警告信息"); }}>
                    Warning
                </Button>
                <Button onClick={() => { message.info("提示信息"); }}>
                    Info
                </Button>
                <Button onClick={() => { message.loading("加载中..."); }}>
                    Loading
                </Button>
            </div>
        </div>
    );
};

export default BasicDemo;
