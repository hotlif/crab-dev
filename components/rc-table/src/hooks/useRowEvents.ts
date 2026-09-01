import { type HTMLAttributes, type Key, type MouseEvent as ReactMouseEvent, useEffect, useRef } from "react";
import type { Row } from "../types.js";
import type { InternalExpandedRow, InternalGroupRow } from "../util.js";
import { isInternalRow } from "../util.js";

/**
 * 行内的交互控件 —— 点在这些元素上，用户的意图是操作该控件，不是"点这一行"。
 *
 * 覆盖表格自带的全部控件：行展开图标与分组展开是 <button>，树形展开与排序头带 role="button"，
 * 行选择复选框来自 rc-checkbox（内部为原生 <input>）；也覆盖使用方在 cellRender 里放的
 * 按钮、链接、单选框与输入控件。<label> 一并排除：点它会把点击转发给关联的 input。
 */
const INTERACTIVE_SELECTOR = [
    "button",
    "a[href]",
    "input",
    "select",
    "textarea",
    "label",
    '[role="button"]',
    '[role="checkbox"]',
    '[role="radio"]',
    '[role="switch"]',
    '[role="link"]',
    '[contenteditable="true"]',
].join(",");

/**
 * 按下到抬起的位移超过该像素即视为拖拽，不再算作点击。
 *
 * 单元格拖选按住鼠标横跨同一行的多个格时，mouseup 落在另一个格上，click 会在两者的公共祖先
 * ——也就是行——上触发。若不做位移判定，一次拖选就会误报成一次行点击。
 */
const DRAG_SLOP = 4;

export type RowEventHandler<T> = (
    row: T,
    rowIndex: number,
    event: ReactMouseEvent<HTMLDivElement> | KeyboardEvent,
) => void;

export type RowEventProps = Pick<
    HTMLAttributes<HTMLDivElement>,
    "onMouseDown" | "onClick" | "onDoubleClick"
>;

export interface UseRowEventsResult<T extends Row> {
    hasRowEvents: boolean;
    getRowEventProps: (row: T, rowIndex: number, isEditingThisRow: boolean) => RowEventProps;
}

interface UseRowEventsOptions<T extends Row> {
    onRowClick?: RowEventHandler<T>;
    onRowDoubleClick?: RowEventHandler<T>;
    /** editType === "row"：双击进入行编辑，该次双击由行编辑消费 */
    isRowEditMode: boolean;
    startRowEdit: (rowId: Key) => void;
    /** 当前处于编辑态的行；不为 null 时，键盘 Enter 不触发行点击 */
    currentEditingRowId: Key | null;
    displayRows: Array<T | InternalGroupRow<T> | InternalExpandedRow<T>>;
    /** 键盘触发的锚点：用户最后一次点选的单元格所在行 */
    anchorCell: { rowId: Key; columnIndex: number } | null;
    rowIdToIndex: Map<Key, number>;
    isInteractionActive: () => boolean;
}

export function useRowEvents<T extends Row>(options: UseRowEventsOptions<T>): UseRowEventsResult<T> {
    // 其余字段（currentEditingRowId / displayRows / anchorCell / rowIdToIndex）仅供键盘监听器
    // 在 effect 内经 latestRef 读取最新值，不在渲染期直接使用。
    const { onRowClick, onRowDoubleClick, isRowEditMode, startRowEdit } = options;

    const hasRowEvents = onRowClick != null || onRowDoubleClick != null;

    /*
     * 例外白名单 1 —— 可变实例状态 ref：记录 mousedown 时的指针位置，用于在 click 时判定
     * 这究竟是一次点击还是一次拖选。跨事件持有、且不应触发渲染。
     */
    const pressPointRef = useRef<{ x: number; y: number } | null>(null);

    /*
     * 例外白名单 2 —— latest-ref：window keydown 监听只挂一次，但需要读到最新的行数据与回调。
     * 把它们放进 effect 依赖会导致每次 rows 变化都重新绑定监听器。
     */
    const latestRef = useRef<UseRowEventsOptions<T>>(options);
    latestRef.current = options;

    /** 点击是否落在行内的交互控件上（展开图标、复选框、单选框、按钮、链接、输入框…）。 */
    const isFromInteractive = (event: ReactMouseEvent<HTMLDivElement>): boolean => {
        const target = event.target as HTMLElement | null;
        const control = target?.closest?.(INTERACTIVE_SELECTOR);
        // 限定在当前行内：closest 会一路向上，命中行外的祖先控件不算。
        return control != null && event.currentTarget.contains(control);
    };

    /**
     * 键盘可达 —— 行点击不能只对鼠标可用。
     *
     * 选中某个单元格（点击或拖选留下的锚点）后按 Enter，即触发该行的行点击。
     * Enter 在单元格编辑器内另有语义（提交并跳到下一格），因此焦点位于输入控件、
     * 或有行正处于编辑态时，一律让位。
     */
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Enter") return;
            if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) return;

            const current = latestRef.current;
            if (!current.isInteractionActive()) return;
            if (current.onRowClick == null) return;
            if (current.currentEditingRowId != null) return;

            const active = document.activeElement as HTMLElement | null;
            const tag = active?.tagName?.toLowerCase();
            if (tag === "input" || tag === "textarea" || tag === "select") return;
            if (active?.isContentEditable) return;

            const anchor = current.anchorCell;
            if (anchor == null) return;

            const rowIndex = current.rowIdToIndex.get(anchor.rowId);
            if (rowIndex == null) return;

            const row = current.displayRows[rowIndex];
            if (!row || isInternalRow(row)) return;

            event.preventDefault();
            current.onRowClick(row as T, rowIndex, event);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    /**
     * 生成挂到 BodyRow 上的事件属性。没有任何行事件、且不处于行编辑模式时返回空对象，
     * 纯展示的表格不会平白多挂一堆监听。
     */
    const getRowEventProps = (
        row: T,
        rowIndex: number,
        isEditingThisRow: boolean,
    ): RowEventProps => {
        if (!hasRowEvents && !isRowEditMode) return {};

        return {
            onMouseDown: (event) => {
                pressPointRef.current = { x: event.clientX, y: event.clientY };
            },

            onClick: (event) => {
                const pressPoint = pressPointRef.current;
                pressPointRef.current = null;

                if (onRowClick == null) return;
                // 编辑态的行：点击属于编辑器与确认/取消按钮，不是"点这一行"
                if (isEditingThisRow) return;
                if (isFromInteractive(event)) return;

                // 拖选（或任何拖动）之后的 click 不算点击
                if (pressPoint != null) {
                    const moved = Math.hypot(
                        event.clientX - pressPoint.x,
                        event.clientY - pressPoint.y,
                    );
                    if (moved > DRAG_SLOP) return;
                }

                onRowClick(row, rowIndex, event);
            },

            onDoubleClick: (event) => {
                /*
                 * 行编辑优先：editType="row" 时双击本就是"进入行编辑"的既有语义，
                 * 该次双击被行编辑消费，不再上报 onRowDoubleClick，避免一次双击触发两种行为。
                 * （editType="cell" 的双击进编辑在 bodyCell 内就已停止冒泡，到不了这里。）
                 */
                if (isRowEditMode && !isEditingThisRow) {
                    startRowEdit(row.id);
                    return;
                }

                if (onRowDoubleClick == null) return;
                if (isEditingThisRow) return;
                if (isFromInteractive(event)) return;

                onRowDoubleClick(row, rowIndex, event);
            },
        };
    };

    return { hasRowEvents, getRowEventProps };
}
