import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Prose from "@crab-dev/rc-prose";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-prose/css/index.css";
import "@crab-dev/rc-button/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [large, setLarge] = useState(false);
    return (
        <div className={layout}>
            <Button onClick={() => setLarge((value) => !value)}>切换阅读尺寸</Button>
            <Prose size={large ? "lg" : "base"}>
                <h2>项目说明</h2>
                <p>使用相同内容比较两档阅读尺寸。</p>
            </Prose>
        </div>
    );
}
