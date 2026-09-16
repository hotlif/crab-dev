import token from "@crab-dev/rc-token-semantic";
export default function Example() {
    return (
        <p>
            正文颜色引用：<code>{token.color.text.primary}</code>
        </p>
    );
}
