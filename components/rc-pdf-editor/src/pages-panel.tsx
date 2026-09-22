import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import AutoSizer from '@crab-dev/rc-auto-sizer';
import Button from '@crab-dev/rc-button';
import Canvas, { CanvasImage, Group, Rect } from '@crab-dev/rc-canvas';
import Virtual, { type VirtualHandle } from '@crab-dev/rc-virtual';
import { bitmap, type PdfClient } from './client.js';
import type { PageInfo } from './protocol.js';
import { frameStyle, thumbnailCanvasStyle, pageListStyle, thumbStyle, thumbButtonStyle, thumbContentStyle, topSpacerStyle, bottomSpacerStyle, pageDragStatusStyle } from './styles.js';
import { THUMBNAIL_HEIGHT } from './page-selection.js';
import usePageDrag from './use-page-drag.js';
import token from './token.js';
import { useFrameBuffer, useFrameLease, type PreparedFrame } from './frame-buffer.js';

interface ThumbnailFrame { images: ImageBitmap[]; width: number; height: number }
function ThumbnailCanvas({ frame, visible, onPresent, onError }: {
    frame: PreparedFrame<ThumbnailFrame> | undefined; visible: boolean; onPresent: () => void; onError: (error: Error) => void;
}) {
    useFrameLease(frame);
    const loaded = useRef(false), presented = useRef(false);
    useLayoutEffect(() => { loaded.current = false; presented.current = false; }, [frame]);
    return <span className={frameStyle} data-visible={visible}><Canvas width={160} height={152} tabIndex={-1}
        onRender={() => { if (loaded.current && !presented.current) { presented.current = true; onPresent(); } }}>
        {frame && <Group key={frame.id}>
            <Rect x={(160 - frame.data.width) / 2} y={0} width={frame.data.width} height={frame.data.height} fill={token.canvas.paper['background-color']} />
            <CanvasImage src={frame.data.images[0]} x={(160 - frame.data.width) / 2} y={0} width={frame.data.width} height={frame.data.height} onLoad={() => { loaded.current = true; }} onError={onError} />
        </Group>}
    </Canvas></span>;
}

function Thumbnail({ client, page, revision, onError }: { client: PdfClient; page: PageInfo; revision: number; onError: (error: unknown) => void }) {
    const factor = Math.min(160 / page.width, 152 / page.height);
    const buffer = useFrameBuffer(client, `${page.id}:${page.contentRevision}`, async signal => ({
        images: [await bitmap(await client.thumbnail(page, revision, factor, signal))], width: page.width * factor, height: page.height * factor,
    }), onError);
    return <span aria-hidden="true" className={thumbnailCanvasStyle}>
        {buffer.slots.map((frame, slot) => <ThumbnailCanvas key={slot} frame={frame} visible={!!frame && frame === buffer.front}
            onPresent={() => { if (frame) buffer.present(frame); }} onError={error => { if (frame) buffer.reject(frame, error); }} />)}
    </span>;
}

interface PagesPanelProps {
    client: PdfClient;
    pages: PageInfo[];
    revision: number;
    current: number;
    selected: number[];
    disabled: boolean;
    readOnly: boolean;
    onSelect: (page: number, toggle: boolean) => void;
    onSelectAll: () => void;
    onMove: (pages: number[], to: number) => void;
    onError: (error: unknown) => void;
}

export default function PagesPanel(props: PagesPanelProps) {
    const { client, pages, revision, current, selected, disabled, readOnly, onSelect, onSelectAll, onMove, onError } = props;
    const [measuredHeight, setMeasuredHeight] = useState(0);
    const [focused, setFocused] = useState(current);
    const descriptionId = useId();
    // 可变实例状态：虚拟列表定位、指针捕获及尚未挂载的键盘焦点目标。
    const gridRef = useRef<VirtualHandle>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const focusRequest = useRef<number | undefined>(undefined);
    const { drop, cancel, handlers } = usePageDrag({ root: rootRef, grid: gridRef, selected, count: pages.length, revision, disabled, readOnly, onSelect, onMove });
    useEffect(() => { setFocused(current); if (measuredHeight > 0) gridRef.current?.scrollToCell({ rowIndex: current }); }, [current, measuredHeight]);
    function focusPage(index: number) {
        setFocused(index); focusRequest.current = index;
        gridRef.current?.scrollToCell({ rowIndex: index });
        const node = rootRef.current?.querySelector<HTMLButtonElement>(`[data-page-index="${index}"]`);
        if (node) { node.focus({ preventScroll: true }); focusRequest.current = undefined; }
    }
    function keyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.nativeEvent.isComposing) return;
        const toggle = event.ctrlKey || event.metaKey;
        const next = event.key === 'ArrowDown' ? Math.min(pages.length - 1, focused + 1) : event.key === 'ArrowUp' ? Math.max(0, focused - 1)
            : event.key === 'Home' ? 0 : event.key === 'End' ? pages.length - 1 : undefined;
        if (next !== undefined) {
            event.preventDefault(); event.stopPropagation();
            if (!disabled) { focusPage(next); if (!toggle) onSelect(next, event.shiftKey); }
        } else if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault(); event.stopPropagation(); if (!disabled) onSelect(focused, toggle || event.key === ' ');
        } else if (toggle && event.key.toLowerCase() === 'a') {
            event.preventDefault(); event.stopPropagation(); if (!disabled) onSelectAll();
        } else if (event.key === 'Escape') {
            event.preventDefault(); event.stopPropagation(); cancel(); if (!disabled) onSelect(current, false);
        } else if (['Delete', 'Backspace', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            // 页面列表不接管画布对象的移动/删除快捷键。
            event.preventDefault(); event.stopPropagation();
        }
    }
    return <div className={pageListStyle} ref={rootRef} role="listbox" aria-label="PDF 页面列表" aria-multiselectable="true" aria-describedby={descriptionId}
        aria-disabled={disabled} tabIndex={0} {...handlers} onKeyDown={keyDown} onFocus={event => { if (event.target === event.currentTarget && !disabled) focusPage(current); }}>
        <AutoSizer onResize={({ height }) => setMeasuredHeight(height)}>{({ width, height }) => <Virtual
        gridRef={gridRef}
        viewportWidth={width} viewportHeight={height}
        gridTemplateColumns={[width]} gridTemplateRows={{ count: pages.length, itemSize: THUMBNAIL_HEIGHT }} overscanRowCount={1}
        renderRows={([start, end]) => <><div className={topSpacerStyle} aria-hidden="true" />{pages.slice(start, end + 1).map(page => <div key={page.id} className={thumbStyle} data-page-row={page.index}
            ref={node => { if (node && focusRequest.current === page.index) { node.querySelector('button')?.focus({ preventScroll: true }); focusRequest.current = undefined; } }}
            data-drop={drop?.boundary === page.index ? 'before' : drop?.boundary === pages.length && page.index === pages.length - 1 ? 'after' : undefined}>
            <Button className={thumbButtonStyle} role="option" aria-selected={selected.includes(page.index)}
                appearance={selected.includes(page.index) ? 'tonal' : 'text'} isSelected={selected.includes(page.index)} aria-current={current === page.index ? 'page' : undefined}
                aria-label={`第 ${page.index + 1} 页`} aria-posinset={page.index + 1} aria-setsize={pages.length} tabIndex={-1}
                data-page-index={page.index} data-draggable={!readOnly && !disabled} data-dragging={drop?.pages.includes(page.index) || undefined}
                onFocus={() => setFocused(page.index)} onDragStart={event => event.preventDefault()} onClick={event => { if (!disabled) onSelect(page.index, event.ctrlKey || event.metaKey); }}>
                <span className={thumbContentStyle}>
                    <Thumbnail client={client} page={page} revision={revision} onError={onError} />
                    <span>{page.index + 1}</span>
                </span>
            </Button>
        </div>)}<div className={bottomSpacerStyle} aria-hidden="true" /></>} />}</AutoSizer>
        <span id={descriptionId} className={pageDragStatusStyle} role="status">{drop ? `正在移动 ${drop.pages.length} 页${drop.boundary === undefined ? '，移回列表后放置' : `，放到${drop.boundary === pages.length ? '文档末尾' : `第 ${drop.boundary + 1} 页前`}`}，Esc 取消` : '点击选页，Ctrl 或 Command 点击多选，拖拽排序。方向键浏览，空格切换选择。'}</span>
    </div>;
}
