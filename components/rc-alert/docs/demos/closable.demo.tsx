export const meta = {
    title: "可关闭",
    description: "设置 `closable` 属性可显示关闭按钮，点击关闭后组件从 DOM 中移除",
};

import { css } from "@crab-dev/css";
import { useState } from "react";
import Alert from "../../src/index.js";

const ClosableDemo = () => {
    const [resetKey, setResetKey] = useState(0);
    const [allClosed, setAllClosed] = useState(false);
    const closedCount = { current: 0 };
    const total = 4;

    const handleClose = () => {
        closedCount.current += 1;
        if (closedCount.current >= total) {
            setAllClosed(true);
        }
    };

    const handleReset = () => {
        setResetKey((k) => k + 1);
        setAllClosed(false);
    };

    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                gap: 1rem;
            `}
        >
            <div
                key={resetKey}
                className={css`
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                `}
            >
                <Alert type="info" closable onClose={handleClose}>
                    这条提示可以被关闭
                </Alert>
                <Alert type="warning" title="警告" closable onClose={handleClose}>
                    这条带标题的警告可以被关闭
                </Alert>
                <Alert
                    type="error"
                    closable
                    closeIcon={<span>×</span>}
                    onClose={handleClose}
                >
                    自定义关闭图标
                </Alert>
                <Alert type="success" closable onClose={handleClose}>
                    关闭后触发 onClose 回调
                </Alert>
            </div>
            {allClosed && (
                <button
                    type="button"
                    onClick={handleReset}
                    className={css`
                        align-self: flex-start;
                        padding: 4px 12px;
                        border: 1px solid #d9d9d9;
                        border-radius: 6px;
                        background: #fff;
                        cursor: pointer;
                    `}
                >
                    重新显示全部
                </button>
            )}
        </div>
    );
};

export default ClosableDemo;
