import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import SplitPane from "@crab-dev/rc-split-pane";
import Button from "@crab-dev/rc-button";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
const frame = css`
    height: calc(${token.space["section-gap"]} * 10);
    min-width: 0;
`;
export default function Example() {
    const [size, setSize] = useState(120);
    return (
        <div className={layout}>
            <output>主面板：{size} px</output>
            <div className={frame}>
                <SplitPane defaultSize={120} size={size} onSizeChange={setSize} min={70} max={200}>
                    <p>导航区域</p>
                    <p>正文区域</p>
                </SplitPane>
            </div>
            <Button onClick={() => setSize(120)}>恢复尺寸</Button>
        </div>
    );
}
