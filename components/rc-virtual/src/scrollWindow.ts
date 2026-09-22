// Keep each spacer well below browser layout limits. Scrollbars and public indices
// use logical coordinates; only the rendered window uses these local coordinates.
const MAX_PADDING_SIZE = 1_000_000;

export function getScrollWindow(start: number, end: number, totalSize: number, position: number) {
    const paddingStart = Math.min(start, MAX_PADDING_SIZE);
    const paddingEnd = Math.min(Math.max(0, totalSize - end), MAX_PADDING_SIZE);

    return {
        paddingStart,
        paddingEnd,
        position: position - (start - paddingStart),
    };
}
