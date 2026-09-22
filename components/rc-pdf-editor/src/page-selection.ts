// 与 token.toml 中 thumbnail.height 保持一致，供虚拟列表计算行位置。
export const THUMBNAIL_HEIGHT = 200;

export function togglePageSelection(selected: number[], index: number, toggle: boolean): number[] {
    if (!toggle) return [index];
    return selected.includes(index) ? selected.filter(page => page !== index) : [...selected, index].sort((a, b) => a - b);
}

/** 插入线使用原列表的间隙序号；PDFium 使用移除所选页之后的目标序号。 */
export function pageDropDestination(selected: number[], boundary: number): number {
    return boundary - selected.filter(index => index < boundary).length;
}

export function pageMoveOrder(count: number, selected: number[], to: number): number[] | undefined {
    const moving = [...new Set(selected)].sort((a, b) => a - b);
    if (!moving.length || moving.some(index => !Number.isInteger(index) || index < 0 || index >= count)
        || !Number.isInteger(to) || to < 0 || to > count - moving.length) return;
    const chosen = new Set(moving);
    const order = Array.from({ length: count }, (_, index) => index).filter(index => !chosen.has(index));
    order.splice(to, 0, ...moving);
    return order.some((index, position) => index !== position) ? order : undefined;
}
