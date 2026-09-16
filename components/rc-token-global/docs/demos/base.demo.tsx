import { css } from "@crab-dev/css";
import globalToken from "@crab-dev/rc-token-global";

export const meta = {
    title: "全局颜色与尺度",
    description: "直接引用全局基元构建色块，展示颜色、间距与圆角；说明文字继承工作台。",
};

const frame = css`
    display: grid;
    gap: ${globalToken.space[2]};
    padding: ${globalToken.space[5]};
    border-radius: ${globalToken.radius[4]};
`;
const swatch = css`
    width: ${globalToken.space[16]};
    height: ${globalToken.space[16]};
    background: ${globalToken.blue[600]};
    border-radius: ${globalToken.radius[3]};
`;

export default function BaseDemo() {
    return <div className={frame}><div className={swatch} aria-hidden="true" /><strong>Blue 600 · 原始色块</strong><p>颜色、尺寸与圆角来自全局基元；文字继承工作台的阅读样式。</p></div>;
}
