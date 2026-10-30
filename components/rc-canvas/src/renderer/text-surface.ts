/** Both backends expose the same raster operations used by the text atlas. */
export type TextRasterContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

/** Keep worker rendering independent of Document; use the owning DOM only when
 * the browser does not provide a 2D OffscreenCanvas implementation. */
export function createTextRasterContext(width: number, height: number, ownerDocument?: Document): TextRasterContext {
    const Surface = ownerDocument?.defaultView?.OffscreenCanvas ?? globalThis.OffscreenCanvas;
    if (typeof Surface === 'function') {
        const context = new Surface(width, height).getContext('2d');
        if (context) return context;
    }
    const document = ownerDocument ?? globalThis.document;
    if (!document) throw new Error('Text rasterization requires an OffscreenCanvas or an owning Document.');
    const surface = document.createElement('canvas');
    surface.width = width;
    surface.height = height;
    const context = surface.getContext('2d');
    if (!context) throw new Error('Text rasterization requires a 2D canvas context.');
    return context;
}
