import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import AutoSizer from "@crab-dev/rc-auto-sizer";
const frame = css`
    height: calc(${token.space["section-gap"]} * 8);
`;
export default function Example() {
    return (
        <div className={frame}>
            <AutoSizer>
                {({ width, height }) => (
                    <output>
                        可用空间：{Math.round(width)} × {Math.round(height)}
                    </output>
                )}
            </AutoSizer>
        </div>
    );
}
