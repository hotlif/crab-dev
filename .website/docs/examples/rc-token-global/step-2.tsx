import { css } from "@crab-dev/css";
import globalToken from "@crab-dev/rc-token-global";
import token from "@crab-dev/rc-token-semantic";


const frame = css`
    display: grid;
    gap: ${token.space["component-gap"]};
    padding: ${token.space["card-padding"]};
    color: ${token.color.text.primary};
    background: ${token.color.background.surface};
    border-radius: ${token.radius.lg};
`;
const swatch = css`
    width: ${globalToken.space[16]};
    height: ${globalToken.space[16]};
    background: ${globalToken.blue[600]};
    border-radius: ${globalToken.radius[3]};
`;

export default function Example() {
    return <div className={frame}><div className={swatch} aria-hidden="true" /><strong>Blue 600 · 原始色块</strong><p>色块读取全局基元；说明文字与容器使用语义令牌。</p></div>;
}
