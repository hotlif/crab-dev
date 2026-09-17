import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import SplitPane from "@crab-dev/rc-split-pane";
const frame = css`
    height: calc(${token.space["section-gap"]} * 10);
    min-width: 0;
`;
export default function Example() {
    return (
        <div className={frame}>
            <SplitPane defaultSize={120} min={70} max={200}>
                <p>导航区域</p>
                <p>正文区域：拖动分隔条调整空间。</p>
            </SplitPane>
        </div>
    );
}
