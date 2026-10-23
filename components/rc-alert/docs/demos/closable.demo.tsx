export const meta = {
    title: "可关闭",
    description: "设置 `closable` 属性可显示关闭按钮，点击关闭后组件从 DOM 中移除",
};

import { css } from "@crab-dev/css";
import { useState } from "react";
import Button from '@crab-dev/rc-button';
import token from '@crab-dev/rc-token-semantic';
import Alert from "../../src/index.js";

const stackStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space['section-gap']};
`;
const statusStyle = css`margin: 0; color: ${token.color.text.secondary};`;
const resetStyle = css`align-self: flex-start;`;

const ClosableDemo = () => {
    const [resetKey, setResetKey] = useState(0);
    const [closedCount, setClosedCount] = useState(0);
    const total = 4;

    const handleClose = () => {
        setClosedCount(count => count + 1);
    };

    const handleReset = () => {
        setResetKey((k) => k + 1);
        setClosedCount(0);
    };

    return (
        <div className={stackStyle}>
            <div key={resetKey} className={stackStyle}>
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
            <p className={statusStyle} role="status">已关闭 {closedCount} / {total} 条提示。</p>
            {closedCount > 0 && (
                <Button
                    appearance="outlined"
                    onClick={handleReset}
                    className={resetStyle}
                >
                    重新显示全部
                </Button>
            )}
        </div>
    );
};

export default ClosableDemo;
