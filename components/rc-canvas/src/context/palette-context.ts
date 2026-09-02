import { createContext } from 'react';
import { DEFAULT_CANVAS_PALETTE, type CanvasPalette } from '../palette.js';

export interface CanvasPaletteContextValue {
    palette: CanvasPalette;
    /** 主题继承链变化时递增，促使图元重新解析显式 CSS 颜色表达式。 */
    revision: number;
}

export const CanvasPaletteContext = createContext<CanvasPaletteContextValue>({
    palette: DEFAULT_CANVAS_PALETTE,
    revision: 0,
});
