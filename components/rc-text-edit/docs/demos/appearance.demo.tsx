export const meta = {
    title: "随主题切换的文本字段",
    description: "三主题统一使用上置标签；对比 MD3、Apple 和 shadcn 的 outlined / filled 表面与边框。",
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
            <TextEdit label="项目背景" appearance="filled" rows={3} defaultValue="让三套设计体系共享同一份内容。" />
            <TextEdit label="暂不可编辑" appearance="filled" rows={2} disabled defaultValue="字段恢复编辑后可继续补充。" />
        </div>
    );
}
