import globalToken, { vars } from "@crab-dev/rc-token-global";

export default function Example() {
    return (
        <dl>
            <dt>用于 CSS 属性值的引用</dt>
            <dd><code>{globalToken.blue[600]}</code></dd>
            <dt>用于变量声明的名称</dt>
            <dd><code>{vars["blue.600"]}</code></dd>
        </dl>
    );
}
