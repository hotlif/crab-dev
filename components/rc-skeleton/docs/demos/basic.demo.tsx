/**
 * title = "基础用法"
 * description = "默认渲染一行文本占位；通过 `rows` 控制行数，末行自动收窄。"
 */

import Skeleton from "../../src/index.js";

const BasicDemo = () => {
    return <Skeleton rows={3} />;
};

export default BasicDemo;
