import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-auto-sizer/css/index.css";
import "@crab-dev/rc-button/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
const frame = css`
    height: calc(${token.space["section-gap"]} * 8);
`;
const smallFrame = css`
    height: calc(${token.space["section-gap"]} * 8);
    width: 60%;
`;
export default function Example() {
    const [narrow, setNarrow] = useState(false);
    return (
        <div className={layout}>
            <Button onClick={() => setNarrow((value) => !value)}>切换容器宽度</Button>
            <div className={narrow ? smallFrame : frame}>
                <AutoSizer>
                    {({ width, height }) => (
                        <output>
                            容器：{Math.round(width)} × {Math.round(height)}
                        </output>
                    )}
                </AutoSizer>
            </div>
        </div>
    );
}
