import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Virtual from "@crab-dev/rc-virtual";
const items = Array.from(
    {
        length: 1000,
    },
    (_, index) => `记录 ${index + 1}`,
);
const heights = items.map(() => 32);
const row = css`
    height: calc(${token.space["section-gap"]} * 2);
    box-sizing: border-box;
    border-bottom: 1px solid ${token.color.border.subtle};
`;
const topSpace = css`
    height: var(--crab-rc-virtual-top-padding-height, 0);
`;
const bottomSpace = css`
    height: var(--crab-rc-virtual-bottom-padding-height, 0);
`;
export default function Example() {
    return (
        <Virtual
            gridTemplateColumns={[240]}
            gridTemplateRows={heights}
            viewportWidth={240}
            viewportHeight={240}
            renderRows={([start, end]) => (
                <>
                    <div className={topSpace} />
                    {items.slice(start, end + 1).map((item) => (
                        <div className={row} key={item}>
                            {item}
                        </div>
                    ))}
                    <div className={bottomSpace} />
                </>
            )}
        />
    );
}
