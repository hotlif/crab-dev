import { afterAll, beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import PropertiesPanel, { draftFor } from '../properties-panel.js';
import type { PdfObject } from '../protocol.js';

const NativeResizeObserver = globalThis.ResizeObserver;
beforeAll(() => {
    // 此处只验证输入与焦点；不让 Select 的异步宽度测量越过 act 边界。
    globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
});
afterAll(() => { globalThis.ResizeObserver = NativeResizeObserver; });

const objects: PdfObject[] = [
    { index: 0, kind: 'shape', shape: 'rectangle', bounds: { x: 10, y: 20, width: 100, height: 80 } },
    { index: 1, kind: 'shape', shape: 'ellipse', bounds: { x: 10, y: 20, width: 100, height: 80 } },
    { index: 2, kind: 'text', text: '示例文字', bounds: { x: 10, y: 20, width: 100, height: 80 } },
    { index: 3, kind: 'image', bounds: { x: 10, y: 20, width: 100, height: 80 } },
];

describe('属性面板提交状态', () => {
    for (const object of objects) it(`${object.shape ?? object.kind}等待时保持控件、焦点和滚动，拦截输入并在结束后恢复`, async () => {
        const props = { object, draft: draftFor(object), fonts: [{ id: 'test', label: '测试字体', family: 'sans-serif' }], disabled: false,
            onDraft: mock.fn(), onApply: mock.fn(), onRemove: mock.fn(), onReplace: mock.fn(), onClose: mock.fn() };
        const view = await render(<PropertiesPanel {...props} busy={false} />);
        const fields = view.container.querySelector<HTMLElement>('[aria-label="属性字段"]')!;
        const label = [...fields.querySelectorAll('label')].find(node => node.textContent === '宽（pt）')!;
        const width = view.container.querySelector<HTMLInputElement>(`[id="${label.htmlFor}"]`)!;
        const controls = [...fields.querySelectorAll('input, textarea, button, [role="combobox"]')];
        const appearance = controls.map(node => [node.className, node.getAttribute('disabled'), node.getAttribute('aria-disabled')]);
        const actions = [...view.container.querySelectorAll<HTMLButtonElement>('[aria-label="对象操作"] button')];
        await act(async () => {
            width.focus();
            // 给独立面板真实的滚动边界，验证忙碌切换不会重置滚动位置。
            fields.style.height = '100px'; fields.style.flex = 'none'; fields.style.overflowY = 'auto'; fields.scrollTop = 36;
        });
        expect(fields.scrollTop).toBe(36);
        for (let turn = 0; turn < 2; turn++) {
            await view.rerender(<PropertiesPanel {...props} busy />);
            expect(document.activeElement).toBe(width);
            expect(fields.scrollTop).toBe(36);
            expect([...fields.querySelectorAll('input, textarea, button, [role="combobox"]')]).toEqual(controls);
            expect(controls.map(node => [node.className, node.getAttribute('disabled'), node.getAttribute('aria-disabled')])).toEqual(appearance);
            actions.forEach(node => expect(node.disabled).toBe(false));
            const value = width.value;
            await fireEvent.keyDown(width, { key: 'ArrowUp' });
            const input = new globalThis.InputEvent('beforeinput', { bubbles: true, cancelable: true, inputType: 'insertText', data: '9' });
            await fireEvent(width, input); expect(input.defaultPrevented).toBe(true);
            const wheel = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: -100 });
            await fireEvent(width, wheel);
            expect(wheel.defaultPrevented).toBe(false);
            expect(width.value).toBe(value);
            for (const action of actions) await fireEvent.click(action);
            expect(props.onApply).not.toHaveBeenCalled(); expect(props.onRemove).not.toHaveBeenCalled(); expect(props.onReplace).not.toHaveBeenCalled();
            expect(props.onDraft).not.toHaveBeenCalled();
            for (const options of [{ key: 'Tab' }, { key: 'c', ctrlKey: true }]) {
                const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...options });
                await fireEvent(width, event); expect(event.defaultPrevented).toBe(false);
            }
            await view.rerender(<PropertiesPanel {...props} busy={false} />);
            expect(document.activeElement).toBe(width); expect(fields.scrollTop).toBe(36);
        }
        await fireEvent.click(actions[0]); expect(props.onApply).toHaveBeenCalledTimes(1);
        await fireEvent.keyDown(width, { key: 'ArrowUp' });
        expect(props.onDraft).toHaveBeenCalledWith({ ...props.draft, transform: { ...props.draft.transform, width: 101 } });
        await view.rerender(<PropertiesPanel {...props} disabled busy={false} />);
        expect(width.disabled).toBe(true); actions.forEach(node => expect(node.disabled).toBe(true));
        await view.unmount();
    });
});
