import type { PdfEditorErrorCode } from './types.js';

export interface Bounds { x: number; y: number; width: number; height: number }
export interface Transform extends Bounds { rotation: number }
export type Rgba = [number, number, number, number];
export type ShapeKind = 'rectangle' | 'ellipse' | 'line' | 'arrow' | 'freehand';
export interface Point { x: number; y: number }
export interface ShapeStyle { stroke: Rgba; strokeWidth: number; fill: Rgba | null; dashed: boolean }
export interface Drawing { shape: ShapeKind; points: Point[]; style: ShapeStyle }
export interface PdfObject {
    index: number;
    kind: 'text' | 'image' | 'shape' | 'unsupported';
    bounds: Bounds;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    color?: Rgba;
    reason?: string;
    shape?: ShapeKind;
    shapeStyle?: ShapeStyle;
}
export interface PageInfo { id: number; contentRevision: number; index: number; width: number; height: number; rotation: number }
export interface PageTarget { page: number; revision: number; pageId?: number; contentRevision?: number }
export interface DocumentInfo {
    pages: PageInfo[];
    revision: number;
    dirty: boolean;
    canUndo: boolean;
    canRedo: boolean;
    editable: boolean;
}
export interface Pixels { width: number; height: number; rgba: Uint8ClampedArray<ArrayBuffer> }
export interface ObjectPatch { text?: string; fontId?: string; fontSize?: number; color?: Rgba; transform?: Transform; shapeStyle?: ShapeStyle }
export type EditCommand =
    | { kind: 'update'; page: number; object: number; patch: ObjectPatch }
    | { kind: 'remove'; page: number; object: number }
    | { kind: 'text'; page: number; text: string; fontId: string; fontSize: number; color: Rgba; x: number; y: number }
    | { kind: 'image'; page: number; image: Pixels; bounds: Bounds; replace?: number }
    | { kind: 'shape'; page: number; drawing: Drawing }
    | { kind: 'insert'; at: number }
    | { kind: 'deletePages'; pages: number[] }
    | { kind: 'rotatePages'; pages: number[]; turns: number }
    | { kind: 'movePages'; pages: number[]; to: number }
    | { kind: 'merge'; bytes: Uint8Array<ArrayBuffer>; password: string; at: number };

export interface RequestMap {
    init: { wasm: ArrayBuffer };
    open: { bytes: Uint8Array<ArrayBuffer>; password: string };
    closeDocument: undefined;
    fonts: { fonts: { id: string; data: Uint8Array<ArrayBuffer> }[] };
    page: PageTarget;
    render: PageTarget & { scale: number };
    region: PageTarget & { bounds: Bounds; scale: number };
    layers: PageTarget & { object: number; scale: number };
    frame: PageTarget & { object?: number; scale: number };
    edit: { command: EditCommand; revision: number };
    undo: undefined;
    redo: undefined;
    export: undefined;
    extract: { pages: number[] };
    saved: { revision: number };
}
export interface ResponseMap {
    init: undefined;
    open: DocumentInfo;
    closeDocument: undefined;
    fonts: undefined;
    page: { info: PageInfo; objects: PdfObject[] };
    render: Pixels;
    region: Pixels;
    layers: { below: Pixels; selected: Pixels; above: Pixels; bounds: Bounds };
    frame: { info: PageInfo; objects: PdfObject[] } & ({ image: Pixels; layers?: never } | { image?: never; layers: ResponseMap['layers'] });
    edit: DocumentInfo;
    undo: DocumentInfo;
    redo: DocumentInfo;
    export: Uint8Array<ArrayBuffer>;
    extract: Uint8Array<ArrayBuffer>;
    saved: DocumentInfo;
}
export type Request = { [K in keyof RequestMap]: { id: number; type: K; data: RequestMap[K] } }[keyof RequestMap];
export type Response = { id: number } & (
    | { ok: true; data: ResponseMap[keyof ResponseMap] }
    | { ok: false; error: { code: PdfEditorErrorCode; message: string } }
);
