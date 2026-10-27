import { afterEach, beforeEach, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import { useState } from 'react';
import { flushSync } from 'react-dom';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Canvas from '../canvas.js';
import Text from '../shapes/text.js';
import { createWebGL2Mock } from './__mocks__/webgl-mock.js';

const originalOffscreenCanvas = Object.getOwnPropertyDescriptor(globalThis, 'OffscreenCanvas');

beforeEach(() => {
    const gl = createWebGL2Mock();
    mock.spyOn(HTMLCanvasElement.prototype, 'getContext').implement(((type: string) => type === 'webgl2' ? gl : null) as typeof HTMLCanvasElement.prototype.getContext);
    // DOM 环境没有 WebGL/OffscreenCanvas；保留真实 Canvas 命中与编辑流程，仅替换绘制平台。
    const context = {
        font: '', fillStyle: '',
        fillRect: mock.fn(), fillText: mock.fn(),
        measureText: mock.fn(() => ({ width: 80 })),
        getImageData: mock.fn((_x: number, _y: number, width: number, height: number) => ({
            data: new Uint8Array(width * height * 4).fill(200),
        })),
    };
    (globalThis as Record<string, unknown>).OffscreenCanvas = class {
        constructor(public width: number, public height: number) { }
        getContext() { return context; }
    };
    // 不调度渲染循环；双击检测固定时钟，避免测试机器速度改变 300ms 阈值。
    mock.spyOn(globalThis, 'requestAnimationFrame').implement(() => 1);
    mock.spyOn(globalThis, 'cancelAnimationFrame').implement(() => { });
    mock.spyOn(performance, 'now').implement(() => 0);
});

afterEach(() => {
    mock.restoreAll();
    if (originalOffscreenCanvas) Object.defineProperty(globalThis, 'OffscreenCanvas', originalOffscreenCanvas);
    else delete (globalThis as Record<string, unknown>).OffscreenCanvas;
});

async function doubleClickText(container: HTMLElement) {
    const canvas = container.querySelector('canvas')!;
    // Wake DOM 不提供布局测量；只为本画布实例提供与 width/height 一致的矩形。
    Object.defineProperty(canvas, 'getBoundingClientRect', {
        configurable: true,
        value: () => ({
            x: 0, y: 0, left: 0, top: 0, right: 320, bottom: 160, width: 320, height: 160,
            toJSON: () => ({ x: 0, y: 0, width: 320, height: 160 }),
        }),
    });
    // Canvas 依据两轮真实 pointer down/up 分派双击，不能直接触发 Text 内部 setter。
    for (let click = 0; click < 2; click += 1) {
        await fireEvent(canvas, new globalThis.PointerEvent('pointerdown', {
            bubbles: true, clientX: 24, clientY: 34, pointerId: 1, button: 0,
        }));
        await fireEvent(canvas, new globalThis.PointerEvent('pointerup', {
            bubbles: true, clientX: 24, clientY: 34, pointerId: 1, button: 0,
        }));
    }
}

describe('Canvas Text inline editor', () => {
    it('双击图元后使用默认中文名称，并聚焦选中原文', async () => {
        const view = await render(<Canvas width={320} height={160}><Text x={20} y={30} editable>原始文本</Text></Canvas>);
        expect(screen.queryByRole('textbox')).toBeNull();
        await doubleClickText(view.container);
        const editor = screen.getByRole('textbox', { name: '编辑画布文本' }) as HTMLTextAreaElement;
        expect(document.activeElement).toBe(editor);
        expect(editor.value).toBe('原始文本');
        expect(editor.selectionStart).toBe(0);
        expect(editor.selectionEnd).toBe(editor.value.length);
    });

    it('默认名称继承最近英文 Provider，原生编辑器仍挂载于 Canvas 容器', async () => {
        const view = await render(<ConfigProvider locale="zh-CN"><ConfigProvider locale="en-US">
            <Canvas width={320} height={160}><Text x={20} y={30} editable>Original text</Text></Canvas>
        </ConfigProvider></ConfigProvider>);
        await doubleClickText(view.container);
        const editor = screen.getByRole('textbox', { name: 'Edit canvas text' });
        expect(view.container.querySelector('canvas')?.parentElement?.contains(editor)).toBe(true);
    });

    it('editorLabel 优先于默认名称，空白名称回退到本地化名称', async () => {
        const view = await render(<ConfigProvider locale="en-US"><Canvas width={320} height={160}>
            <Text x={20} y={30} editable editorLabel="流程节点标题">Node</Text>
        </Canvas></ConfigProvider>);
        await doubleClickText(view.container);
        expect(screen.getByRole('textbox', { name: '流程节点标题' })).toBeTruthy();
        await view.rerender(<ConfigProvider locale="en-US"><Canvas width={320} height={160}>
            <Text x={20} y={30} editable editorLabel="   ">Node</Text>
        </Canvas></ConfigProvider>);
        expect(screen.getByRole('textbox', { name: 'Edit canvas text' })).toBeTruthy();
    });

    it('语言更新保留编辑器、草稿和已有光标选区', async () => {
        const view = await render(<ConfigProvider locale="zh-CN"><Canvas width={320} height={160}>
            <Text x={20} y={30} editable>原文</Text>
        </Canvas></ConfigProvider>);
        await doubleClickText(view.container);
        const editor = screen.getByRole('textbox', { name: '编辑画布文本' }) as HTMLTextAreaElement;
        await fireEvent.input(editor, { target: { value: '草稿 draft' } });
        editor.setSelectionRange(2, 4);
        await view.rerender(<ConfigProvider locale="en-US"><Canvas width={320} height={160}>
            <Text x={20} y={30} editable>原文</Text>
        </Canvas></ConfigProvider>);
        expect(screen.getByRole('textbox', { name: 'Edit canvas text' })).toBe(editor);
        expect(document.activeElement).toBe(editor);
        expect(editor.value).toBe('草稿 draft');
        expect(editor.selectionStart).toBe(2);
        expect(editor.selectionEnd).toBe(4);
    });

    it('Enter 每次编辑提交一次，关闭编辑器并把焦点交还画布', async () => {
        const onEdit = mock.fn();
        const view = await render(<Canvas width={320} height={160}><Text x={20} y={30} editable onEdit={onEdit}>原文</Text></Canvas>);
        const canvasContainer = view.container.querySelector('canvas')!.parentElement;
        await doubleClickText(view.container);
        const editor = screen.getByRole('textbox', { name: '编辑画布文本' });
        await fireEvent.input(editor, { target: { value: '已修改' } });
        await fireEvent.keyDown(editor, { key: 'Enter' });
        expect(onEdit).toHaveBeenCalledTimes(1);
        expect(onEdit).toHaveBeenCalledWith('已修改');
        expect(screen.queryByRole('textbox')).toBeNull();
        expect(document.activeElement).toBe(canvasContainer);

        await doubleClickText(view.container);
        const nextEditor = screen.getByRole('textbox', { name: '编辑画布文本' });
        await fireEvent.input(nextEditor, { target: { value: '再次编辑' } });
        await fireEvent.keyDown(nextEditor, { key: 'Enter' });
        expect(onEdit).toHaveBeenCalledTimes(2);
        expect(onEdit).toHaveBeenCalledWith('再次编辑');
        expect(document.activeElement).toBe(canvasContainer);
    });

    it('失焦提交一次，Shift+Enter 不提前提交', async () => {
        const onEdit = mock.fn();
        const view = await render(<><Canvas width={320} height={160}>
            <Text x={20} y={30} editable onEdit={onEdit}>原文</Text>
        </Canvas><button>下一步</button></>);
        await doubleClickText(view.container);
        const editor = screen.getByRole('textbox', { name: '编辑画布文本' });
        await fireEvent.keyDown(editor, { key: 'Enter', shiftKey: true });
        expect(onEdit).not.toHaveBeenCalled();
        expect(screen.getByRole('textbox', { name: '编辑画布文本' })).toBe(editor);
        await fireEvent.input(editor, { target: { value: '第一行\n第二行' } });
        const nextButton = screen.getByRole('button', { name: '下一步' });
        await act(() => { nextButton.focus(); });
        expect(onEdit).toHaveBeenCalledTimes(1);
        expect(onEdit).toHaveBeenCalledWith('第一行\n第二行');
        expect(screen.queryByRole('textbox')).toBeNull();
        expect(document.activeElement).toBe(nextButton);
    });

    it('onEdit 主动移焦引发 blur 时仍只提交一次且不抢回焦点', async () => {
        const onEdit = mock.fn(() => { screen.getByRole('button', { name: '下一步' }).focus(); });
        const view = await render(<><Canvas width={320} height={160}>
            <Text x={20} y={30} editable onEdit={onEdit}>原文</Text>
        </Canvas><button>下一步</button></>);
        await doubleClickText(view.container);
        const editor = screen.getByRole('textbox', { name: '编辑画布文本' });
        await fireEvent.input(editor, { target: { value: '移焦提交' } });
        await fireEvent.keyDown(editor, { key: 'Enter' });
        expect(onEdit).toHaveBeenCalledTimes(1);
        expect(onEdit).toHaveBeenCalledWith('移焦提交');
        expect(screen.queryByRole('textbox')).toBeNull();
        expect(document.activeElement).toBe(screen.getByRole('button', { name: '下一步' }));
    });

    it('onEdit 同步卸载画布后不尝试恢复到已移除的容器', async () => {
        const onEdit = mock.fn();
        function UnmountOnCommit() {
            const [mounted, setMounted] = useState(true);
            return mounted ? <Canvas width={320} height={160}>
                <Text x={20} y={30} editable onEdit={value => {
                    onEdit(value);
                    flushSync(() => { setMounted(false); });
                }}>原文</Text>
            </Canvas> : <button>完成</button>;
        }
        const view = await render(<UnmountOnCommit />);
        const canvasContainer = view.container.querySelector('canvas')!.parentElement!;
        const onCanvasFocus = mock.fn();
        canvasContainer.addEventListener('focus', onCanvasFocus);
        await doubleClickText(view.container);
        const editor = screen.getByRole('textbox', { name: '编辑画布文本' });
        await fireEvent.keyDown(editor, { key: 'Enter' });
        expect(onEdit).toHaveBeenCalledTimes(1);
        expect(canvasContainer.isConnected).toBe(false);
        expect(onCanvasFocus).not.toHaveBeenCalled();
        expect(document.activeElement).not.toBe(canvasContainer);
        expect(screen.queryByRole('textbox')).toBeNull();
        expect(screen.getByRole('button', { name: '完成' })).toBeTruthy();
    });

    it('Escape 取消草稿，不通知 onEdit 或 Canvas 键盘处理器', async () => {
        const onEdit = mock.fn();
        const onKeyDown = mock.fn();
        const view = await render(<Canvas width={320} height={160} onKeyDown={onKeyDown}>
            <Text x={20} y={30} editable onEdit={onEdit}>原文</Text>
        </Canvas>);
        await doubleClickText(view.container);
        const editor = screen.getByRole('textbox', { name: '编辑画布文本' });
        await fireEvent.input(editor, { target: { value: '不保存的草稿' } });
        await fireEvent.keyDown(editor, { key: 'Escape' });
        expect(onEdit).not.toHaveBeenCalled();
        expect(onKeyDown).not.toHaveBeenCalled();
        expect(screen.queryByRole('textbox')).toBeNull();
        expect(document.activeElement).toBe(view.container.querySelector('canvas')!.parentElement);
    });

    it('输入法组合态的 Enter 和 Escape 留给输入法，不提交或关闭编辑器', async () => {
        const onEdit = mock.fn();
        const onKeyDown = mock.fn();
        const view = await render(<Canvas width={320} height={160} onKeyDown={onKeyDown}>
            <Text x={20} y={30} editable onEdit={onEdit}>原文</Text>
        </Canvas>);
        await doubleClickText(view.container);
        const editor = screen.getByRole('textbox', { name: '编辑画布文本' });
        await fireEvent.input(editor, { target: { value: '拼音候选' } });
        for (const key of ['Enter', 'Escape']) {
            const event = new globalThis.KeyboardEvent('keydown', {
                key, bubbles: true, cancelable: true, isComposing: true,
            });
            await fireEvent(editor, event);
            expect(event.defaultPrevented).toBe(false);
            expect(screen.getByRole('textbox', { name: '编辑画布文本' })).toBe(editor);
            expect(document.activeElement).toBe(editor);
        }
        expect(onEdit).not.toHaveBeenCalled();
        expect(onKeyDown).not.toHaveBeenCalled();
        await fireEvent.keyDown(editor, { key: 'Enter' });
        expect(onEdit).toHaveBeenCalledTimes(1);
        expect(onEdit).toHaveBeenCalledWith('拼音候选');
        expect(document.activeElement).toBe(view.container.querySelector('canvas')!.parentElement);
    });

    it('输入法结束时 isComposing 已复位但 keyCode=229 的 Enter 不提前提交', async () => {
        const onEdit = mock.fn();
        const view = await render(<Canvas width={320} height={160}>
            <Text x={20} y={30} editable onEdit={onEdit}>原文</Text>
        </Canvas>);
        await doubleClickText(view.container);
        const editor = screen.getByRole('textbox', { name: '编辑画布文本' });
        const event = new globalThis.KeyboardEvent('keydown', {
            key: 'Enter', keyCode: 229, bubbles: true, cancelable: true, isComposing: false,
        });
        await fireEvent(editor, event);
        expect(event.defaultPrevented).toBe(false);
        expect(onEdit).not.toHaveBeenCalled();
        expect(screen.getByRole('textbox', { name: '编辑画布文本' })).toBe(editor);
        expect(document.activeElement).toBe(editor);
    });
});
