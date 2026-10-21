export const meta = {
    title: "随主题切换的文本字段",
    description: "Material 下展示 outlined / filled 与浮动标签；切换至 shadcn 后，同一文本域自动采用上置标签和紧凑边框。",
};

import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import TextEdit from "../../src/index.js";

const wrapperStyle = css`
    display: grid;
    gap: ${token.space['section-gap']};
    padding: ${token.space['card-padding']};
    max-width: calc(${token.size[96]} * 5);
`;

export default function AppearanceDemo() {
    return (
        <div className={wrapperStyle}>
            <TextEdit label="项目目标" appearance="outlined" rows={3} supportingText="聚焦后可观察标签与轮廓。" />
            <TextEdit label="项目背景" appearance="filled" rows={3} defaultValue="让两套设计风格共享同一份内容。" />
            <TextEdit label="暂不可编辑" appearance="filled" rows={2} disabled defaultValue="字段恢复编辑后可继续补充。" />
        </div>
    );
}
