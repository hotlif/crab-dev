export const meta = {
    title: "带标题",
    description: "通过 `title` 属性设置标题，适合展示更多详情",
};

import { css } from "@crab-dev/css";
import Alert from "../../src/index.js";

const TitleDemo = () => {
    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                gap: 1rem;
            `}
        >
            <Alert type="success" title="操作成功">
                你的修改已经保存，可以继续编辑其他内容。
            </Alert>
            <Alert type="info" title="提示信息">
                本功能目前处于测试阶段，可能会有变更。
            </Alert>
            <Alert type="warning" title="注意">
                你的存储空间即将用尽，请及时清理。
            </Alert>
            <Alert type="error" title="提交失败">
                网络连接异常，请检查你的网络设置后重试。
            </Alert>
        </div>
    );
};

export default TitleDemo;
