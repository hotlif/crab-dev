export const meta = {
    title: "标签与选择状态",
    description: "对照三套主题下的静态或浮动标签、选择面板、错误及禁用状态；切换主题保留当前值。",
};

import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Select from "../../src/index.js";

const layout = css`
    display: grid;
    gap: ${token.space['group-gap']};
    padding: ${token.space['section-gap']};
`;
const options = [
    { label: "产品设计", value: "design" },
    { label: "工程研发", value: "engineering" },
    { label: "市场运营", value: "marketing" },
    { label: "已归档团队", value: "archived", disabled: true },
];

export default function FieldStatesDemo() {
    return <div className={layout}>
        <Select label="所属团队" options={options} placeholder="选择团队" searchable allowClear defaultValue="design" supportingText="输入名称可以筛选团队。" />
        <Select label="审核团队" options={options} appearance="filled" required errorText="请选择一个审核团队。" />
        <Select label="参与团队" options={options} multiple defaultValue={['design', 'engineering']} />
        <Select label="归档团队" options={options} disabled defaultValue="archived" />
    </div>;
}
