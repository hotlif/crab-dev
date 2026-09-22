import { beforeAll, afterAll, describe, it, expect } from '@crab-dev/wake/test';
import wasmBase64 from '../../.fixtures/test-wasm.json';
import { PdfEngine } from '../engine.js';
import { fixture } from './fixture.js';
import { fontFixture } from './font-fixture.js';
import { passwordFixture } from './password-fixture.js';
import { DEFAULT_SHAPE_STYLE } from '../drawing.js';
import type { Drawing, ShapeKind } from '../protocol.js';
import { regionRaster } from '../regions.js';

let engine: PdfEngine;
beforeAll(async () => {
    engine = await PdfEngine.create(Uint8Array.from(atob(wasmBase64), character => character.charCodeAt(0)).buffer);
});
afterAll(() => engine?.dispose());

describe('PDFium 原生编辑与回读', () => {
    it('选区直接渲染与完整页面的对应像素一致，支持旋转和裁剪框', () => {
        for (const rotation of [0, 90, 180, 270]) {
            const page = engine.open(fixture(1, rotation)).pages[0];
            const bounds = { x: 10.25, y: 11.75, width: 50.5, height: 60.25 }, scale = 2;
            const full = engine.render(0, scale), region = engine.renderRegion(0, bounds, scale), plan = regionRaster(page, bounds, scale);
            expect(region.width).toBe(plan.width); expect(region.height).toBe(plan.height);
            const expected = new Uint8ClampedArray(region.rgba.length);
            for (let y = 0; y < region.height; y++) expected.set(full.rgba.subarray(((plan.top + y) * full.width + plan.left) * 4,
                ((plan.top + y) * full.width + plan.left + region.width) * 4), y * region.width * 4);
            expect(region.rgba).toEqual(expected);
        }
        expect(() => engine.renderRegion(0, { x: -1, y: 0, width: 20, height: 20 }, 2)).toThrow('选区');
        expect(() => engine.renderRegion(0, { x: 0, y: 0, width: 20, height: 20 }, Infinity)).toThrow('倍率');
    });
    it('页面标识随排序和历史保留，仅修改页失效，新文档不复用旧标识', () => {
        const opened = engine.open(fixture(3)), first = opened.pages[0];
        const edited = engine.edit({ kind: 'rotatePages', pages: [1], turns: 1 });
        expect(edited.pages[0]).toEqual(first);
        expect(edited.pages[1].contentRevision).not.toBe(opened.pages[1].contentRevision);
        const target = { page: 0, revision: opened.revision, pageId: first.id, contentRevision: first.contentRevision };
        expect(engine.resolvePage(target)).toBe(0);
        const moved = engine.edit({ kind: 'movePages', pages: [0], to: 2 });
        expect(moved.pages[2].id).toBe(first.id); expect(engine.resolvePage(target)).toBe(2);
        engine.undo(); expect(engine.resolvePage(target)).toBe(0);
        engine.redo(); expect(engine.resolvePage(target)).toBe(2);
        engine.edit({ kind: 'deletePages', pages: [2] }); expect(() => engine.resolvePage(target)).toThrow('页面已更新');
        engine.undo(); expect(engine.resolvePage(target)).toBe(2);
        engine.open(fixture()); expect(() => engine.resolvePage(target)).toThrow('页面已更新');
    });
    it('不连续多页整体排序保留原有顺序，单步撤销重做后导出回读一致', () => {
        engine.open(fixture(6));
        const texts = () => engine.info().pages.map(page => engine.page(page.index).objects[0].text);
        engine.edit({ kind: 'movePages', pages: [1, 3], to: 4 });
        expect(texts()).toEqual(['Page 1', 'Page 3', 'Page 5', 'Page 6', 'Page 2', 'Page 4']);
        engine.undo(); expect(texts()).toEqual(['Page 1', 'Page 2', 'Page 3', 'Page 4', 'Page 5', 'Page 6']);
        expect(engine.info().canUndo).toBe(false);
        engine.redo(); engine.open(engine.export());
        expect(texts()).toEqual(['Page 1', 'Page 3', 'Page 5', 'Page 6', 'Page 2', 'Page 4']);
    });
    it('矩形、椭圆、直线、箭头与手绘保存为原生路径，旋转裁剪页回读可继续编辑', () => {
        const shapes: ShapeKind[] = ['rectangle', 'ellipse', 'line', 'arrow', 'freehand'];
        for (const rotation of [0, 90, 180, 270]) for (const shape of shapes) {
            engine.open(fixture(1, rotation));
            const drawing: Drawing = { shape, points: [{ x: 50, y: 60 }, { x: 120, y: 130 }],
                style: { ...DEFAULT_SHAPE_STYLE, stroke: [255, 0, 0, 255], fill: [0, 128, 0, 255] } };
            if (shape === 'freehand') drawing.points.push({ x: 140, y: 80 });
            engine.edit({ kind: 'shape', page: 0, drawing });
            engine.open(engine.export());
            const object = engine.page(0).objects[2];
            expect(object.kind).toBe('shape');
            expect(object.shape).toBe(shape);
            expect(object.reason).toBeUndefined();
            expect(object.shapeStyle?.stroke).toEqual([255, 0, 0, 255]);
            expect(object.bounds.width).toBeGreaterThan(0);
            expect(object.bounds.height).toBeGreaterThan(0);
            expect(engine.page(0).objects[1].kind).toBe('unsupported');
            if (shape === 'ellipse' || shape === 'rectangle') {
                const pixels = engine.render(0, 1), offset = (95 * pixels.width + 85) * 4;
                expect([...pixels.rgba.slice(offset, offset + 3)]).toEqual([0, 128, 0]);
            }
        }
    });
    it('水平直线和竖线可选择，图形样式修改、变换、删除和历史保持一致', () => {
        for (const end of [{ x: 120, y: 80 }, { x: 50, y: 140 }]) {
            engine.open(fixture(1));
            engine.edit({ kind: 'shape', page: 0, drawing: { shape: 'line', points: [{ x: 50, y: 80 }, end], style: DEFAULT_SHAPE_STYLE } });
            const line = engine.page(0).objects[2];
            expect(line.reason).toBeUndefined();
            expect(line.bounds.width).toBeGreaterThan(0);
            expect(line.bounds.height).toBeGreaterThan(0);
            engine.edit({ kind: 'update', page: 0, object: 2, patch: { transform: { ...line.bounds, x: line.bounds.x + 10, rotation: 0 } } });
            expect(engine.page(0).objects[2].bounds.x - line.bounds.x).toBeCloseTo(10, 2);
            engine.edit({ kind: 'update', page: 0, object: 2, patch: { shapeStyle: { ...DEFAULT_SHAPE_STYLE, strokeWidth: 4, dashed: true, stroke: [0, 0, 255, 128] } } });
            engine.open(engine.export());
            expect(engine.page(0).objects[2].shapeStyle).toEqual({ ...DEFAULT_SHAPE_STYLE, strokeWidth: 4, dashed: true, stroke: [0, 0, 255, 128] });
            engine.edit({ kind: 'remove', page: 0, object: 2 });
            expect(engine.page(0).objects.length).toBe(2);
            engine.undo(); expect(engine.page(0).objects[2].shape).toBe('line');
            engine.redo(); expect(engine.page(0).objects.length).toBe(2);
        }
    });
    it('新建与修改半透明填充及描边，保存后仍保留透明度', () => {
        for (const shape of ['rectangle', 'ellipse'] as const) {
            engine.open(fixture(1));
            const style = { ...DEFAULT_SHAPE_STYLE, stroke: [255, 0, 0, 128] as const, fill: [0, 0, 255, 128] as const };
            engine.edit({ kind: 'shape', page: 0, drawing: { shape, points: [{ x: 50, y: 60 }, { x: 120, y: 130 }], style: { ...style, stroke: [...style.stroke], fill: [...style.fill] } } });
            engine.open(engine.export());
            expect(engine.page(0).objects[2].shapeStyle?.stroke[3]).toBe(128);
            expect(engine.page(0).objects[2].shapeStyle?.fill?.[3]).toBe(128);
            const pixels = engine.render(0, 1), offset = (95 * pixels.width + 85) * 4;
            expect([...pixels.rgba.slice(offset, offset + 3)]).toEqual([127, 127, 255]);
            const layers = engine.layers(0, 2, 1);
            const selectedOffset = ((95 - layers.bounds.y) * layers.selected.width + 85 - layers.bounds.x) * 4;
            expect([...layers.selected.rgba.slice(selectedOffset, selectedOffset + 4)]).toEqual([0, 0, 255, 128]);
            engine.edit({ kind: 'update', page: 0, object: 2, patch: { shapeStyle: { ...DEFAULT_SHAPE_STYLE, stroke: [0, 0, 0, 64], fill: [0, 255, 0, 64] } } });
            engine.open(engine.export());
            expect(engine.page(0).objects[2].shapeStyle?.stroke[3]).toBe(64);
            expect(engine.page(0).objects[2].shapeStyle?.fill?.[3]).toBe(64);
        }
    });
    it('无效绘制不会改变文档，一笔手绘只占一步历史', () => {
        engine.open(fixture(1));
        const initial = engine.info();
        expect(() => engine.edit({ kind: 'shape', page: 0, drawing: { shape: 'rectangle', points: [{ x: 1, y: 1 }, { x: 1, y: 1 }], style: DEFAULT_SHAPE_STYLE } })).toThrow();
        expect(() => engine.edit({ kind: 'shape', page: 0, drawing: { shape: 'line', points: [{ x: 1, y: 1 }, { x: 10, y: 20 }], style: { ...DEFAULT_SHAPE_STYLE, strokeWidth: -1 } } })).toThrow();
        expect(engine.info()).toEqual(initial);
        engine.edit({ kind: 'shape', page: 0, drawing: { shape: 'freehand', points: [{ x: 20, y: 20 }, { x: 30, y: 40 }, { x: 40, y: 20 }], style: DEFAULT_SHAPE_STYLE } });
        engine.undo(); expect(engine.page(0).objects.length).toBe(2); expect(engine.info().canUndo).toBe(false);
        engine.redo(); expect(engine.page(0).objects[2].shape).toBe('freehand');
    });
    it('密码错误保留原文档，用户权限限制修改，所有者保存保留加密', async () => {
        const protectedPdf = await passwordFixture(Uint8Array.from(atob(wasmBase64), character => character.charCodeAt(0)).buffer);
        engine.open(fixture());
        expect(() => engine.open(protectedPdf, 'wrong')).toThrow('密码');
        expect(engine.info().pages.length).toBe(2);
        expect(engine.open(protectedPdf, 'reader').editable).toBe(false);
        expect(() => engine.edit({ kind: 'insert', at: 1 })).toThrow('权限');
        expect(engine.open(protectedPdf, 'owner').editable).toBe(true);
        engine.edit({ kind: 'rotatePages', pages: [0], turns: 1 });
        const exported = engine.export();
        expect(() => engine.open(exported)).toThrow('密码');
        expect(engine.open(exported, 'reader').pages[0].rotation).toBe(1);
    });
    it('嵌入自有 TTF 并修改原文字为中文，回读 Unicode、颜色与顺序', async () => {
        const data = fontFixture();
        await new globalThis.FontFace('CrabPdfTest', data.buffer).load();
        engine.registerFonts([{ id: 'test', data }]);
        engine.open(fixture());
        engine.edit({ kind: 'update', page: 0, object: 0, patch: { text: '中文', fontId: 'test', fontSize: 22, color: [12, 34, 56, 255] } });
        engine.edit({ kind: 'text', page: 1, text: '世界', fontId: 'test', fontSize: 16, color: [0, 0, 0, 255], x: 10, y: 20 });
        engine.open(engine.export());
        expect(engine.page(0).objects[0].text).toBe('中文');
        expect(engine.page(0).objects[0].fontSize).toBe(22);
        expect(engine.page(0).objects[0].color).toEqual([12, 34, 56, 255]);
        expect(engine.page(0).objects[1].kind).toBe('unsupported');
        expect(engine.page(1).objects.some(object => object.text === '世界')).toBe(true);
        const revision = engine.info().revision;
        expect(() => engine.edit({ kind: 'update', page: 0, object: 0, patch: { text: '缺', fontId: 'test' } })).toThrow();
        expect(engine.info().revision).toBe(revision);
    });
    it('各旋转方向下的裁剪框坐标、图片方向和对象移动保持一致', () => {
        for (const rotation of [0, 90, 180, 270]) {
            engine.open(fixture(1, rotation));
            const before = engine.page(0).objects[0];
            engine.edit({ kind: 'update', page: 0, object: 0, patch: { transform: { ...before.bounds, x: before.bounds.x + 5, y: before.bounds.y + 7, rotation: 0 } } });
            const after = engine.page(0).objects[0];
            expect(Math.abs(after.bounds.x - before.bounds.x - 5)).toBeLessThan(0.01);
            expect(Math.abs(after.bounds.y - before.bounds.y - 7)).toBeLessThan(0.01);
            engine.edit({ kind: 'image', page: 0, image: { width: 1, height: 2, rgba: new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255]) }, bounds: { x: 100, y: 60, width: 20, height: 40 } });
            const pixels = engine.render(0, 1);
            const pixel = (x: number, y: number) => [...pixels.rgba.slice((y * pixels.width + x) * 4, (y * pixels.width + x) * 4 + 3)];
            expect(pixel(110, 65)).toEqual([255, 0, 0]);
            expect(pixel(110, 95)).toEqual([0, 255, 0]);
        }
    });
    it('连续历史只保留最近 50 步，并能重新回到最新状态', () => {
        engine.open(fixture(1));
        for (let i = 0; i < 52; i++) engine.edit({ kind: 'rotatePages', pages: [0], turns: 1 });
        let undone = 0;
        while (engine.info().canUndo) { engine.undo(); undone++; }
        expect(undone).toBe(50);
        expect(engine.info().pages[0].rotation).toBe(2);
        while (engine.info().canRedo) engine.redo();
        expect(engine.info().pages[0].rotation).toBe(0);
    });
    it('读取真实文字、裁剪尺寸、渲染及前后图层', () => {
        const info = engine.open(fixture());
        expect(info.pages.length).toBe(2);
        expect(info.pages[0].width).toBe(220);
        expect(engine.page(0).objects[0].text).toBe('Page 1');
        const pixels = engine.render(0, 1);
        expect(pixels.rgba.length).toBe(pixels.width * pixels.height * 4);
        const layers = engine.layers(0, 0, 1);
        expect(layers.selected.width).toBeGreaterThan(0);
        expect(engine.render(0, 1).rgba).toEqual(pixels.rgba);
    });
    it('改变原文字字号、颜色和坐标，导出后仍然是文字对象', () => {
        engine.open(fixture());
        const original = engine.page(0).objects[0];
        engine.edit({ kind: 'update', page: 0, object: 0, patch: { fontSize: 24, color: [255, 0, 0, 255], transform: { ...original.bounds, x: original.bounds.x + 15, rotation: 0 } } });
        const bytes = engine.export();
        engine.open(bytes);
        const text = engine.page(0).objects.find(o => o.kind === 'text')!;
        expect(text.text).toBe('Page 1');
        expect(text.fontSize).toBe(24);
        expect(text.color).toEqual([255, 0, 0, 255]);
        expect(text.bounds.x).toBeGreaterThan(original.bounds.x + 10);
    });
    it('新增透明图片、替换、删除以及撤销重做', () => {
        engine.open(fixture());
        const image = { width: 2, height: 1, rgba: new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 128]) };
        engine.edit({ kind: 'image', page: 0, image, bounds: { x: 20, y: 20, width: 60, height: 30 } });
        const index = engine.page(0).objects.find(o => o.kind === 'image')!.index;
        engine.edit({ kind: 'image', page: 0, image, bounds: { x: 0, y: 0, width: 1, height: 1 }, replace: index });
        engine.edit({ kind: 'remove', page: 0, object: index });
        expect(engine.page(0).objects.some(o => o.kind === 'image')).toBe(false);
        engine.undo();
        expect(engine.page(0).objects.some(o => o.kind === 'image')).toBe(true);
        engine.redo();
        expect(engine.page(0).objects.some(o => o.kind === 'image')).toBe(false);
    });
    it('页面插入、排序、旋转、提取、合并和删除可回读', () => {
        engine.open(fixture());
        engine.edit({ kind: 'insert', at: 1 });
        engine.edit({ kind: 'movePages', pages: [2], to: 0 });
        expect(engine.page(0).objects[0].text).toBe('Page 2');
        engine.edit({ kind: 'rotatePages', pages: [0], turns: 1 });
        expect(engine.info().pages[0].rotation).toBe(1);
        const extracted = engine.extract([0]);
        engine.edit({ kind: 'merge', bytes: extracted, password: '', at: 3 });
        expect(engine.info().pages.length).toBe(4);
        engine.edit({ kind: 'deletePages', pages: [1, 2, 3] });
        expect(engine.info().pages.length).toBe(1);
        expect(() => engine.edit({ kind: 'deletePages', pages: [0] })).toThrow();
        engine.open(engine.export());
        expect(engine.page(0).objects[0].text).toBe('Page 2');
    });
    it('失败回滚、打开失败保留文档、保存标记与历史一致', () => {
        engine.open(fixture());
        const before = engine.export();
        expect(() => engine.edit({ kind: 'update', page: 0, object: 0, patch: { text: '中文' } })).toThrow();
        expect(engine.export()).toEqual(before);
        expect(() => engine.open(new Uint8Array([1, 2]))).toThrow();
        expect(engine.page(0).objects[0].text).toBe('Page 1');
        const edited = engine.edit({ kind: 'rotatePages', pages: [0], turns: 1 });
        expect(edited.dirty).toBe(true);
        expect(engine.markSaved(edited.revision).dirty).toBe(false);
        expect(engine.undo().dirty).toBe(true);
        expect(engine.redo().dirty).toBe(false);
    });
});
