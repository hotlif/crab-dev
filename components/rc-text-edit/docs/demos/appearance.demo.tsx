export const meta = {
    title: "随主题切换的文本字段",
    description: "对比当前主题下 outlined 与 filled 的表面和边框，标签保持上置。",
};

import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import TextEdit from '@crab-dev/rc-text-edit';

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
            <TextEdit label="项目背景" appearance="filled" rows={3} defaultValue="记录项目目标、范围和交付要求。" />
            <TextEdit label="暂不可编辑" appearance="filled" rows={2} disabled defaultValue="字段恢复编辑后可继续补充。" />
        </div>
    );
}
