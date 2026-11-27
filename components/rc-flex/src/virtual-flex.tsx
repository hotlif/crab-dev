import { css } from '@crab-dev/css';
import AutoSizer from '@crab-dev/rc-auto-sizer';
import Virtual, { type VirtualHandle } from '@crab-dev/rc-virtual';
import { useRef, type CSSProperties, type KeyboardEvent, type ReactElement } from 'react';
import type { FlexVirtualOptions, FlexVirtualProps } from './types.js';

const windowStyle = css`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    row-gap: var(--crab-rc-flex-gap);
    & > div {
        display: flex;
        height: var(--crab-rc-flex-item-height);
        column-gap: var(--crab-rc-flex-gap);
        justify-content: var(--crab-rc-flex-justify, normal);
    }
    & > div > [role='listitem'] {
        box-sizing: border-box;
        flex: 0 0 var(--crab-rc-flex-item-width);
        min-width: 0;
    }
`;

interface WindowStyle extends CSSProperties {
    '--crab-rc-flex-item-width': string;
    '--crab-rc-flex-item-height': string;
    '--crab-rc-flex-gap': string;
    '--crab-rc-flex-justify': CSSProperties['justifyContent'];
}

function renderVisibleRows([firstRow, lastRow]: [number, number], columns: number, options: FlexVirtualOptions) {
    const rows: ReactElement[] = [];
    // Group by the calculated row so subpixel rounding cannot move a card into another virtual row.
    for (let row = firstRow; row <= lastRow; row++) {
        const items: ReactElement[] = [];
        const end = Math.min(options.itemCount, (row + 1) * columns);
        for (let index = row * columns; index < end; index++) {
            items.push(
                <div key={options.getItemKey(index)} role="listitem" aria-posinset={index + 1} aria-setsize={options.itemCount}>
                    {options.renderItem(index)}
                </div>,
            );
        }
        rows.push(<div key={columns === 1 ? items[0]?.key : row}>{items}</div>);
    }
    return rows;
}

export default function VirtualFlex({
    virtual, gap = 0, justify, onKeyDown, tabIndex = 0, ...rest
}: FlexVirtualProps) {
    const gridRef = useRef<VirtualHandle>(null);
    // 最近提交的逻辑坐标可能超过浏览器原生滚动上限，键盘翻页从该位置继续。
    const scrollTop = useRef(0);
    const { itemCount, itemHeight, itemWidth, overscan = 2 } = virtual;
    const count = Number.isSafeInteger(itemCount) && itemCount > 0 ? itemCount : 0;
    const spacing = Number.isFinite(gap) && gap > 0 ? gap : 0;

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return;

        const position = scrollTop.current;
        const page = event.currentTarget.clientHeight;
        const stride = itemHeight + spacing;
        let top: number;
        switch (event.key) {
            case 'Home': top = 0; break;
            case 'End': top = Number.MAX_SAFE_INTEGER; break;
            case 'ArrowUp': top = position - stride; break;
            case 'ArrowDown': top = position + stride; break;
            case 'PageUp': top = position - page; break;
            case 'PageDown': top = position + page; break;
            default: return;
        }
        if (gridRef.current) {
            event.preventDefault();
            gridRef.current.scrollTo({ top });
        }
    }

    return (
        <div {...rest} role="list" tabIndex={tabIndex} onKeyDown={handleKeyDown}>
            <AutoSizer>
                {({ width, height }) => {
                    if (!count || width <= 0 || height <= 0 || !Number.isFinite(itemHeight) || itemHeight <= 0) return null;

                    const cardWidth = itemWidth != null && Number.isFinite(itemWidth) && itemWidth > 0
                        ? Math.min(width, itemWidth) : width;
                    const columns = Math.max(1, Math.floor((width + spacing) / (cardWidth + spacing)));
                    return (
                        <Virtual
                            viewportWidth={width}
                            viewportHeight={height}
                            gridTemplateColumns={{ count: 1, itemSize: width }}
                            gridTemplateRows={{ count: Math.ceil(count / columns), itemSize: itemHeight, gap: spacing }}
                            overscanRowCount={overscan}
                            gridRef={gridRef}
                            nativeVerticalScroll
                            tabIndex={-1}
                            onScrollPositionChange={({ top }) => { scrollTop.current = top; }}
                            renderWindow={(rowRange, _columnRange, padding) => {
                                const style: WindowStyle = {
                                    '--crab-rc-flex-item-width': `${cardWidth}px`,
                                    '--crab-rc-flex-item-height': `${itemHeight}px`,
                                    '--crab-rc-flex-gap': `${spacing}px`,
                                    '--crab-rc-flex-justify': justify ?? 'normal',
                                    paddingTop: padding.top,
                                    paddingBottom: padding.bottom,
                                };
                                return <div className={windowStyle} style={style}>{renderVisibleRows(rowRange, columns, virtual)}</div>;
                            }}
                        />
                    );
                }}
            </AutoSizer>
        </div>
    );
}
