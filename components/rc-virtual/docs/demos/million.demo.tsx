import { useId, useRef } from "react";
import { css } from "@crab-dev/css";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import Button from "@crab-dev/rc-button";
import token from "@crab-dev/rc-token-semantic";
import Virtual, { type VirtualHandle } from "../../src/virtual.js";

export const meta = {
    title: "百万条数据",
    description: "1,000,000 条等高记录，仅生成可见内容；可快速定位首条、中间与末条，并继续滚动。",
    order: 20,
};

const ROW_COUNT = 1_000_000;
// 与下方 token.size.field 的默认 56px 保持一致，采用 M3 单行列表高度。
const ROW_HEIGHT = 56;
const numberFormat = new Intl.NumberFormat("zh-CN");

const demoStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space["section-gap"]};
    width: 100%;
    min-width: 0;
    color: ${token.color.text.primary};
    font-family: ${token.typography.body.large["font-family"]};
    font-size: ${token.typography.body.large["font-size"]};
    font-weight: ${token.typography.body.large["font-weight"]};
    line-height: ${token.typography.body.large["line-height"]};
    @media (forced-colors: active) {
        color: CanvasText;
    }
`;

const actionsStyle = css`
    display: flex;
    flex-wrap: wrap;
    gap: ${token.space["component-gap"]};
`;

const captionStyle = css`
    margin: 0;
    color: ${token.color.text.secondary};
    font-size: ${token.typography.body.medium["font-size"]};
    line-height: ${token.typography.body.medium["line-height"]};
    @media (forced-colors: active) {
        color: CanvasText;
    }
`;

const viewportStyle = css`
    height: calc(${token.size.field} * 6);
    min-width: 0;
    background: ${token.color.surface.content};
    padding-block: ${token.space["component-gap"]};
    & [role="list"]:focus-visible {
        outline: calc(${token.space["inline-gap"]} / 2) solid ${token.color.focus.ring};
        outline-offset: calc(${token.space["inline-gap"]} / -2);
    }
    @media (forced-colors: active) {
        background: Canvas;
        & [role="list"]:focus-visible { outline-color: Highlight; }
    }
    @media (prefers-reduced-motion: reduce) {
        & [role="list"] { scroll-behavior: auto; }
    }
`;

const rowStyle = css`
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: ${token.size.field};
    padding-inline: ${token.space["section-gap"]};
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
`;

const topSpaceStyle = css`
    height: var(--crab-rc-virtual-top-padding-height, 0px);
`;

const bottomSpaceStyle = css`
    height: var(--crab-rc-virtual-bottom-padding-height, 0px);
`;

export default function MillionDemo() {
    const gridRef = useRef<VirtualHandle>(null);
    const listId = useId();
    const helpId = useId();

    const jumpTo = (rowIndex: number) => {
        gridRef.current?.scrollToCell({ rowIndex: Math.max(0, Math.min(ROW_COUNT - 1, rowIndex)) });
    };

    return (
        <div className={demoStyle}>
            <div>1,000,000 条记录</div>
            <div className={actionsStyle} role="group" aria-label="快速定位记录">
                <Button appearance="outlined" aria-controls={listId} onClick={() => jumpTo(0)}>第一条</Button>
                <Button appearance="outlined" aria-controls={listId} onClick={() => jumpTo(499_999)}>第 500,000 条</Button>
                <Button appearance="outlined" aria-controls={listId} onClick={() => jumpTo(ROW_COUNT - 1)}>最后一条</Button>
            </div>
            <p id={helpId} className={captionStyle}>滚轮或拖动滚动条浏览；聚焦列表后可用方向键、Page Up / Down、Home / End。</p>
            <div className={viewportStyle}>
                <AutoSizer>
                    {({ width, height }) => (
                        <Virtual
                            gridRef={gridRef}
                            id={listId}
                            role="list"
                            aria-label="百万条示例记录"
                            aria-describedby={helpId}
                            tabIndex={0}
                            viewportWidth={width}
                            viewportHeight={height}
                            gridTemplateColumns={{ count: 1, itemSize: width }}
                            gridTemplateRows={{ count: ROW_COUNT, itemSize: ROW_HEIGHT }}
                            overscanRowCount={2}
                            onKeyDown={event => {
                                const firstRow = gridRef.current?.getScrollCellPosition().rowIndex ?? 0;
                                const pageSize = Math.max(1, Math.ceil(height / ROW_HEIGHT));
                                const targets: Record<string, number> = {
                                    Home: 0,
                                    End: ROW_COUNT - 1,
                                    ArrowUp: firstRow - 1,
                                    ArrowDown: firstRow + pageSize,
                                    PageUp: firstRow - pageSize,
                                    PageDown: firstRow + pageSize * 2 - 1,
                                };
                                const target = targets[event.key];
                                if (target == null) return;
                                event.preventDefault();
                                jumpTo(target);
                            }}
                            renderRows={([start, end]) => (
                                <>
                                    <div className={topSpaceStyle} aria-hidden="true" />
                                    {Array.from({ length: end - start + 1 }, (_, offset) => {
                                        const index = start + offset;
                                        return (
                                            <div
                                                key={index}
                                                className={rowStyle}
                                                role="listitem"
                                                aria-posinset={index + 1}
                                                aria-setsize={ROW_COUNT}
                                            >
                                                记录 {numberFormat.format(index + 1)}
                                            </div>
                                        );
                                    })}
                                    <div className={bottomSpaceStyle} aria-hidden="true" />
                                </>
                            )}
                        />
                    )}
                </AutoSizer>
            </div>
            <p className={captionStyle}>仅挂载当前视口及上下各 2 条预渲染记录，不预先创建百万条对象或行高数组。</p>
        </div>
    );
}
