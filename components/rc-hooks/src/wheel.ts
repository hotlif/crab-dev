/** Modified wheel gestures belong to the browser; zero vertical delta is scrolling. */
export function isVerticalWheelStep(event: Pick<WheelEvent, 'deltaY' | 'ctrlKey' | 'metaKey'>): boolean {
    return event.deltaY !== 0 && !event.ctrlKey && !event.metaKey;
}
