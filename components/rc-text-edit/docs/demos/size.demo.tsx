export const meta = {
    title: "尺寸与多行几何",
    description: "比较无标签、Outlined 与 Filled。Apple/shadcn 分档调整内边距和最小高度；MD3 三档保持标准字段几何，正文不随 size 缩放。rows 决定内容行数",
};

import { css } from "@crab-dev/css";
import TextEdit from "@crab-dev/rc-text-edit";

const wrapperStyle = css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    max-width: 480px;
    & > section { display: grid; gap: 1rem; }
    & h3 { margin: 0; }
`;

const SizeDemo = () => {
    return (
        <div className={wrapperStyle}>
            {(["small", "medium", "large"] as const).map(size => (
                <section key={size} data-demo-size={size}>
                    <h3>{size}{size === "medium" ? "（默认）" : ""}</h3>
                    <TextEdit size={size} rows={2} aria-label={`${size} 无标签备注`} placeholder="无标签文本域，使用可访问名称" />
                    <TextEdit size={size} rows={2} label={`${size} 项目说明`} defaultValue="各档保留相同正文排版。" />
                    <TextEdit size={size} rows={2} label={`${size} 审核意见`} appearance="filled" defaultValue="清除后可以继续输入。" allowClear />
                </section>
            ))}
        </div>
    );
};

export default SizeDemo;
