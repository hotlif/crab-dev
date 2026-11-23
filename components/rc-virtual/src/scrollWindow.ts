// Keep each spacer well below browser layout limits. Scrollbars and public indices
// use logical coordinates; only the rendered window uses these local coordinates.
const MAX_PADDING_SIZE = 1_000_000;
const RECENTER_STEP = MAX_PADDING_SIZE / 2;

export function getScrollWindow(start: number, end: number, totalSize: number, position: number) {
    // Keep the same origin across ordinary row changes deep inside a large list.
    const origin = Math.max(0, Math.ceil((start - MAX_PADDING_SIZE) / RECENTER_STEP) * RECENTER_STEP);
    const paddingEnd = Math.min(Math.max(0, totalSize - end), MAX_PADDING_SIZE);

    return {
        paddingStart: start - origin,
        paddingEnd,
        position: position - origin,
        origin,
    };
}
