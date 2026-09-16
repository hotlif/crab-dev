import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
const sample = css`
    padding: ${token.space["card-padding"]};
    color: ${token.color.text.primary};
    background: ${token.color.background.sunken};
    border: 1px solid ${token.color.border.default};
    border-radius: ${token.radius.md};
`;
export default function Example() {
    return (
        <div className={sample}>
            <strong>项目说明</strong>
            <p>边框、间距与文字均来自语义令牌。</p>
        </div>
    );
}
