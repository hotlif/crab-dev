export const meta = {
    title: "多行字段状态",
    description: "使用文档站主题菜单对照三套标签、容器和焦点规则；文字、计数和辅助说明保持关联。",
};

import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import TextEdit from "../../src/index.js";

const layout = css`
    display: grid;
    gap: ${token.space['group-gap']};
    padding: ${token.space['section-gap']};
`;

export default function FieldStatesDemo() {
    return <div className={layout}>
        <TextEdit label="项目说明" placeholder="描述项目目标" rows={3} showCount maxLength={200} defaultValue="为团队提供一致的工作体验。" supportingText="请简要说明本次项目的目标。" />
        <TextEdit label="审核意见" appearance="filled" rows={3} errorText="请说明需要修改的具体内容。" />
        <TextEdit label="归档说明" rows={2} disabled defaultValue="项目已归档，说明暂不可编辑。" />
    </div>;
}
