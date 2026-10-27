import { describe, expect, it } from '@crab-dev/wake/test';
import { fireEvent, render, screen } from '@crab-dev/wake/test/react';
import { useId, useState } from 'react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import { usePdfLocale } from '../locale.js';
import DrawingSurface from '../drawing-surface.js';
import RegionSelector from '../region-selector.js';
import { DEFAULT_SHAPE_STYLE } from '../drawing.js';
import { layoutDocument } from '../document-layout.js';

function EditorCopyProbe() {
    const { text, actionLabel } = usePdfLocale();
    const id = useId();
    const [content, setContent] = useState('PDF 中的原文');
    return <>
        <button type="button">{actionLabel('open')}</button>
        <label htmlFor={id}>{text('文字内容')}</label><input id={id} value={content} onInput={event => setContent(event.currentTarget.value)} />
        <output>{text('第 {page} / {total} 页', { page: 2, total: 8 })}</output>
        <output>{text('重试页面渲染')}</output>
    </>;
}

describe('PDF editor locale', () => {
    it('inherits the current locale while preserving the document editing draft', async () => {
        const view = await render(<ConfigProvider locale="zh-CN"><EditorCopyProbe /></ConfigProvider>);
        expect(screen.getByRole('button', { name: '打开 PDF' })).toBeTruthy();
        expect(screen.getByText('第 2 / 8 页')).toBeTruthy();
        await fireEvent.input(screen.getByRole('textbox', { name: '文字内容' }), { target: { value: 'Edited document content' } });

        await view.rerender(<ConfigProvider locale="en-US"><EditorCopyProbe /></ConfigProvider>);
        expect(screen.getByRole('button', { name: 'Open PDF' })).toBeTruthy();
        expect(screen.getByText('Page 2 of 8')).toBeTruthy();
        expect(screen.getByText('Retry rendering page')).toBeTruthy();
        expect((screen.getByRole('textbox', { name: 'Text content' }) as HTMLInputElement).value).toBe('Edited document content');
    });
    it('localizes drawing and region accessibility labels with local overrides taking precedence', async () => {
        const page = { id: 1, contentRevision: 1, index: 0, width: 180, height: 130, rotation: 0 };
        const drawing = { tool: 'rectangle' as const, style: DEFAULT_SHAPE_STYLE, disabled: false, page, revision: 1, viewport: { zoom: 1, panX: 0, panY: 0 }, width: 180, height: 130, onDraw: () => {} };
        const region = { layout: layoutDocument([page], 1, 180, 0), scroll: { left: 0, top: 0 }, width: 180, height: 130, onComplete: () => {}, onCancel: () => {}, onReveal: () => {} };
        const view = await render(<ConfigProvider locale="en-US"><DrawingSurface {...drawing}>{() => null}</DrawingSurface><RegionSelector {...region} /></ConfigProvider>);
        expect(view.container.querySelector('[aria-label="Drawing area"]')).toBeTruthy();
        expect(screen.getByRole('region', { name: 'PDF region selection' }).getAttribute('aria-description')).toContain('Shift + arrow keys');
        await view.rerender(<ConfigProvider locale="en-US"><DrawingSurface {...drawing} aria-label="Customer drawing">{() => null}</DrawingSurface><RegionSelector {...region} aria-label="Customer region" aria-description="Customer guidance" /></ConfigProvider>);
        expect(view.container.querySelector('[aria-label="Customer drawing"]')).toBeTruthy();
        expect(screen.getByRole('region', { name: 'Customer region' }).getAttribute('aria-description')).toBe('Customer guidance');
    });
});
