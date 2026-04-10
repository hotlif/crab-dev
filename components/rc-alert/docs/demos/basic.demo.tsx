/**
 * title = "基础用法"
 * description = "四种类型的警告提示，通过 `type` 属性设置"
 */

import { css } from "@linaria/core";
import Alert from "../../src/index.js";

const BasicDemo = () => {
    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                gap: 1rem;
            `}
        >
            <Alert type="success">Success — 操作成功完成</Alert>
            <Alert type="info">Info — 这是一条信息提示</Alert>
            <Alert type="warning">Warning — 请注意潜在的问题</Alert>
            <Alert type="error">Error — 发生了错误，请检查</Alert>
        </div>
    );
};

export default BasicDemo;
