import { iconStyle } from './styles.js';

// 本组件自绘图标，统一使用 24 × 24 坐标和 currentColor。
const paths = {
    select: 'M5 2v19l5-5 4 7 3-2-4-7h7L5 2Zm2 4.4 7.8 5.6H10l-3 3V6.4Z',
    pan: 'M8 12V5a2 2 0 0 1 4 0v5h1V3a2 2 0 0 1 4 0v7h1V6a2 2 0 0 1 4 0v10a7 7 0 0 1-7 7h-1a7 7 0 0 1-5.5-2.7L2 12l1.6-1.2L8 15v-3Zm2-7v12l-5-4 5 6a5 5 0 0 0 4 2h1a5 5 0 0 0 5-5V6h-1v6h-4V3h-1v9h-4V5Z',
    rectangle: 'M3 4h18v16H3V4Zm2 2v12h14V6H5Z',
    ellipse: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 2a7 7 0 1 1 0 14 7 7 0 0 1 0-14Z',
    line: 'm3 19 16-16 2 2L5 21l-2-2Z',
    arrow: 'M10 3h11v11h-2V6.4L4.4 21 3 19.6 17.6 5H10V3Z',
    freehand: 'm16 2 6 6-12 12-8 2 2-8L16 2Zm0 3-10 10-1 4 4-1L19 8l-3-3ZM8 14l2 2-1.4 1.4-2-2L8 14Z',
    open: 'M3 7V5h6l2 2h10v2H10L8 7H3Zm0 3h19l-4 10H2V8h2v10h12.6l2.4-6H3v-2Z',
    undo: 'M8 4 2 10l6 6v-5h5a6 6 0 0 1 6 6v2h2v-2a8 8 0 0 0-8-8H8V4Z',
    redo: 'm16 4 6 6-6 6v-5h-5a6 6 0 0 0-6 6v2H3v-2a8 8 0 0 1 8-8h5V4Z',
    text: 'M3 4h14v3h-5v13H8V7H3V4Zm16 7h2v4h3v2h-3v4h-2v-4h-3v-2h3v-4Z',
    image: 'M3 3h12v2H5v14h14v-8h2v10H3V3Zm15-2h2v3h3v2h-3v3h-2V6h-3V4h3V1ZM7 17l4-5 3 4 2-2 2 3H7ZM9 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z',
    insertPage: 'M4 2h10l6 6v14H4V2Zm2 2v16h12V9h-5V4H6Zm9 1.4V7h1.6L15 5.4ZM11 11h2v3h3v2h-3v3h-2v-3H8v-2h3v-3Z',
    merge: 'M2 2h7v6H7V4H4v6h4v2H2V2Zm13 0h7v10h-6v-2h4V4h-3v4h-2V2ZM7 9l5 5 5-5 1.4 1.4-5.4 5.4V18h3l-4 4-4-4h3v-2.2l-5.4-5.4L7 9Z',
    rotatePage: 'M12 2a10 10 0 0 1 9.8 8h-2.1A8 8 0 0 0 6.3 6H10v2H3V1h2v3.9A10 10 0 0 1 12 2ZM8 10h8v12H8V10Zm2 2v8h4v-8h-4Z',
    deletePage: 'M9 2h6v2h5v2H4V4h5V2ZM6 8h12v14H6V8Zm2 2v10h8V10H8Zm2 1h1v7h-1v-7Zm3 0h1v7h-1v-7Z',
    pageUp: 'M3 2h9v2H5v16h7v2H3V2Zm14 3 6 6-1.4 1.4-3.6-3.6V20h-2V8.8l-3.6 3.6L11 11l6-6Z',
    pageDown: 'M3 2h9v2H5v16h7v2H3V2Zm13 2h2v11.2l3.6-3.6L23 13l-6 6-6-6 1.4-1.4 3.6 3.6V4Z',
    extract: 'M3 2h10v2H5v16h12v-6h2v8H3V2Zm12 3h7v7h-2V8.4l-8.3 8.3-1.4-1.4L18.6 7H15V5Z',
    save: 'M3 3h14l4 4v14H3V3Zm2 2v14h14V8l-3-3H5Zm6 3h2v5h3l-4 4-4-4h3V8Z',
    fitPage: 'M3 3h6v2H5v4H3V3Zm12 0h6v6h-2V5h-4V3ZM3 15h2v4h4v2H3v-6Zm16 0h2v6h-6v-2h4v-4ZM8 6h8v12H8V6Zm2 2v8h4V8h-4Z',
    panelLeft: 'M3 4h18v16H3V4Zm2 2v12h4V6H5Zm6 0v12h8V6h-8Z',
    panelLeftFilled: 'M3 4h18v16H3V4Zm8 2v12h8V6h-8Z',
    panelRight: 'M3 4h18v16H3V4Zm2 2v12h8V6H5Zm10 0v12h4V6h-4Z',
    panelRightFilled: 'M3 4h18v16H3V4Zm2 2v12h8V6H5Z',
    collapseLeft: 'm14.6 6-1.4-1.4L5.8 12l7.4 7.4 1.4-1.4-6-6 6-6Z',
    collapseRight: 'm9.4 6 1.4-1.4 7.4 7.4-7.4 7.4L9.4 18l6-6-6-6Z',
    textObject: 'M4 4h16v3h-6v13h-4V7H4V4Z',
    imageObject: 'M3 3h18v18H3V3Zm2 2v14h14V5H5Zm2 12 4-5 3 4 2-2 2 3H7ZM9 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z',
    otherObject: 'm12 2 10 6-10 6L2 8l10-6Zm0 2.3L5.9 8l6.1 3.7L18.1 8 12 4.3ZM3 12l9 5.4 9-5.4 1 1.7-10 6-10-6L3 12Zm0 4 9 5.4 9-5.4 1 1.7-10 6-10-6L3 16Z',
} as const;

export type PdfIconName = keyof typeof paths;

export default function PdfIcon({ name }: { name: PdfIconName }) {
    return <svg className={iconStyle} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d={paths[name]} /></svg>;
}
