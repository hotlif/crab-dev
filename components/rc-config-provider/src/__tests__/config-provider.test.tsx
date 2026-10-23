import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { render, screen } from '@crab-dev/wake/test/react';
import { StrictMode } from 'react';
import { createPortal } from 'react-dom';
import ConfigProvider from '../config-provider.js';
import ConfigBoundary from '../config-boundary.js';
import { useConfig } from '../context.js';
import { useComponentSize } from '../size.js';

function Probe({ name }: { name: string }) {
    const { theme, locale, size } = useConfig();
    return <output aria-label={name}>{`${theme}/${locale}/${size}`}</output>;
}

function BrandProbe({ name }: { name: string }) {
    return <output aria-label={name}>{useConfig().brandColor ?? 'default'}</output>;
}

function DesignProbe({ name }: { name: string }) {
    const { design, theme, brandColor, size } = useConfig();
    return <output aria-label={name}>{`${design}/${theme}/${brandColor ?? 'default'}/${size}`}</output>;
}

function SizeProbe({ size }: { size?: 'small' | 'middle' | 'large' }) {
    return <output aria-label="component size">{useComponentSize(size)}</output>;
}

describe('ConfigProvider', () => {
    it('keeps portal containers unthemed without a provider so native dark themes can inherit', async () => {
        const root = document.documentElement;
        const previousTheme = root.getAttribute('data-theme');
        const previousDesign = root.getAttribute('data-crab-design');
        root.setAttribute('data-theme', 'dark');
        root.setAttribute('data-crab-design', 'shadcn');
        try {
            await render(createPortal(<ConfigBoundary aria-label="native theme boundary" className="native-theme"><DesignProbe name="unconfigured portal" /></ConfigBoundary>, document.body));
            const boundary = screen.getByLabelText('native theme boundary');
            expect(boundary.tagName).toBe('DIV');
            expect(boundary.classList.contains('native-theme')).toBe(true);
            expect(boundary.hasAttribute('data-theme')).toBe(false);
            expect(boundary.hasAttribute('data-crab-design')).toBe(false);
            expect(boundary.hasAttribute('data-crab-size')).toBe(false);
            expect(boundary.querySelector('style')).toBeNull();
            expect(root.getAttribute('data-theme')).toBe('dark');
            expect(root.getAttribute('data-crab-design')).toBe('shadcn');
            expect(screen.getByLabelText('unconfigured portal').textContent).toBe('material/light/default/middle');
        } finally {
            if (previousTheme === null) root.removeAttribute('data-theme');
            else root.setAttribute('data-theme', previousTheme);
            if (previousDesign === null) root.removeAttribute('data-crab-design');
            else root.setAttribute('data-crab-design', previousDesign);
        }
    });

    it('rebuilds an existing provider configuration across a portal including brand and runtime changes', async () => {
        const { rerender } = await render(
            <ConfigProvider design="shadcn" theme="dark" size="small" brandColor="#AbC">
                {createPortal(<ConfigBoundary aria-label="configured portal"><DesignProbe name="configured portal value" /></ConfigBoundary>, document.body)}
            </ConfigProvider>,
        );
        const boundary = screen.getByLabelText('configured portal');
        expect(boundary.dataset.crabDesign).toBe('shadcn');
        expect(boundary.dataset.theme).toBe('dark');
        expect(boundary.dataset.crabSize).toBe('small');
        expect(boundary.querySelector('style')?.textContent).toContain(`[data-crab-design="shadcn"]`);
        expect(screen.getByLabelText('configured portal value').textContent).toBe('shadcn/dark/#aabbcc/small');
        await rerender(
            <ConfigProvider design="material" theme="light" size="large" brandColor={null}>
                {createPortal(<ConfigBoundary aria-label="configured portal"><DesignProbe name="configured portal value" /></ConfigBoundary>, document.body)}
            </ConfigProvider>,
        );
        expect(boundary.dataset.crabDesign).toBe('material');
        expect(boundary.dataset.theme).toBe('light');
        expect(boundary.dataset.crabSize).toBe('large');
        expect(boundary.querySelector('style')).toBeNull();
        expect(screen.getByLabelText('configured portal value').textContent).toBe('material/light/default/large');
    });

    it('defaults to Material and establishes a design boundary without changing theme or density', async () => {
        await render(<><DesignProbe name="outside" /><ConfigProvider aria-label="default design"><DesignProbe name="inside" /></ConfigProvider></>);
        expect(screen.getByLabelText('outside').textContent).toBe('material/light/default/middle');
        expect(screen.getByLabelText('inside').textContent).toBe('material/light/default/middle');
        expect(screen.getByLabelText('default design').dataset.crabDesign).toBe('material');
    });

    it('inherits macOS through nested and portal boundaries while retaining independent brand overrides', async () => {
        const { rerender } = await render(
            <ConfigProvider design="macos" theme="dark" brandColor="#1677ff" size="small">
                <ConfigProvider brandColor={null}><DesignProbe name="macos reset" /></ConfigProvider>
                <ConfigProvider design="shadcn"><DesignProbe name="explicit design" /></ConfigProvider>
                {createPortal(<ConfigBoundary aria-label="macos portal"><DesignProbe name="macos portal value" /></ConfigBoundary>, document.body)}
            </ConfigProvider>,
        );
        const boundary = screen.getByLabelText('macos portal');
        expect(screen.getByLabelText('macos reset').textContent).toBe('macos/dark/default/small');
        expect(screen.getByLabelText('macos reset').parentElement?.querySelector('style')).toBeNull();
        expect(screen.getByLabelText('explicit design').textContent).toBe('shadcn/dark/#1677ff/small');
        expect(screen.getByLabelText('macos portal value').textContent).toBe('macos/dark/#1677ff/small');
        expect(boundary.dataset.crabDesign).toBe('macos');
        expect(boundary.querySelector('style')?.textContent).toContain('[data-crab-design="macos"]');
        await rerender(
            <ConfigProvider design="macos" theme="light" brandColor={null} size="large">
                <ConfigProvider brandColor={null}><DesignProbe name="macos reset" /></ConfigProvider>
                <ConfigProvider design="shadcn"><DesignProbe name="explicit design" /></ConfigProvider>
                {createPortal(<ConfigBoundary aria-label="macos portal"><DesignProbe name="macos portal value" /></ConfigBoundary>, document.body)}
            </ConfigProvider>,
        );
        expect(screen.getByLabelText('macos portal value').textContent).toBe('macos/light/default/large');
        expect(boundary.querySelector('style')).toBeNull();
        expect(boundary.dataset.theme).toBe('light');
        expect(boundary.dataset.crabSize).toBe('large');
    });

    it('inherits designs, isolates explicit overrides and restores inheritance during runtime switches', async () => {
        const { rerender } = await render(
            <ConfigProvider design="material" theme="dark" brandColor="#1677ff" size="small">
                <ConfigProvider design="shadcn"><DesignProbe name="override" /></ConfigProvider>
                <ConfigProvider><DesignProbe name="inherited design" /></ConfigProvider>
            </ConfigProvider>,
        );
        expect(screen.getByLabelText('override').textContent).toBe('shadcn/dark/#1677ff/small');
        expect(screen.getByLabelText('inherited design').textContent).toBe('material/dark/#1677ff/small');
        await rerender(
            <ConfigProvider design="shadcn" theme="dark" brandColor="#1677ff" size="small">
                <ConfigProvider design="material"><DesignProbe name="override" /></ConfigProvider>
                <ConfigProvider><DesignProbe name="inherited design" /></ConfigProvider>
            </ConfigProvider>,
        );
        expect(screen.getByLabelText('override').textContent).toBe('material/dark/#1677ff/small');
        expect(screen.getByLabelText('inherited design').textContent).toBe('shadcn/dark/#1677ff/small');
        expect(screen.getByLabelText('inherited design').parentElement?.dataset.crabDesign).toBe('shadcn');
        await rerender(
            <ConfigProvider design="shadcn" theme="dark" brandColor="#1677ff" size="small">
                <ConfigProvider><DesignProbe name="override" /></ConfigProvider>
                <ConfigProvider><DesignProbe name="inherited design" /></ConfigProvider>
            </ConfigProvider>,
        );
        expect(screen.getByLabelText('override').textContent).toBe('shadcn/dark/#1677ff/small');
        expect(screen.getByLabelText('override').parentElement?.dataset.crabDesign).toBe('shadcn');
    });

    it('resets a brand to the active design defaults and keeps the reset when the design changes', async () => {
        const { rerender } = await render(
            <ConfigProvider design="shadcn" theme="dark" brandColor="#1677ff" size="large">
                <ConfigProvider brandColor={null}><DesignProbe name="design reset" /></ConfigProvider>
            </ConfigProvider>,
        );
        const output = screen.getByLabelText('design reset');
        const boundary = output.parentElement!;
        expect(output.textContent).toBe('shadcn/dark/default/large');
        expect(boundary.dataset.crabDesign).toBe('shadcn');
        expect(boundary.querySelector('style')).toBeNull();
        await rerender(
            <ConfigProvider design="material" theme="dark" brandColor="#1677ff" size="large">
                <ConfigProvider brandColor={null}><DesignProbe name="design reset" /></ConfigProvider>
            </ConfigProvider>,
        );
        expect(output.textContent).toBe('material/dark/default/large');
        expect(boundary.dataset.crabDesign).toBe('material');
        expect(boundary.dataset.theme).toBe('dark');
        expect(boundary.dataset.crabSize).toBe('large');
        expect(boundary.querySelector('style')).toBeNull();
        expect(boundary.hasAttribute('data-crab-brand')).toBe(false);
    });

    it('updates inherited component sizes, preserves explicit overrides and restores a nested boundary', async () => {
        const view = await render(<ConfigProvider size="small"><SizeProbe /><ConfigProvider size="middle" aria-label="standard" /></ConfigProvider>);
        expect(screen.getByLabelText('component size').textContent).toBe('small');
        expect(screen.getByLabelText('standard').dataset.crabSize).toBe('middle');
        await view.rerender(<ConfigProvider size="large"><SizeProbe size="small" /></ConfigProvider>);
        expect(screen.getByLabelText('component size').textContent).toBe('small');
        await view.rerender(<ConfigProvider size="large"><SizeProbe /></ConfigProvider>);
        expect(screen.getByLabelText('component size').textContent).toBe('large');
        expect(screen.getByLabelText('component size').parentElement?.dataset.crabSize).toBe('large');
    });
    it('inherits a normalized brand across theme boundaries and permits an explicit reset', async () => {
        await render(
            <ConfigProvider brandColor="#AbC" theme="light">
                <ConfigProvider theme="dark"><BrandProbe name="inherited" /></ConfigProvider>
                <ConfigProvider brandColor="#1677ff"><BrandProbe name="overridden" /></ConfigProvider>
                <ConfigProvider brandColor={null}><BrandProbe name="reset" /></ConfigProvider>
                {createPortal(<ConfigProvider><BrandProbe name="brand portal" /></ConfigProvider>, document.body)}
            </ConfigProvider>,
        );
        expect(screen.getByLabelText('inherited').textContent).toBe('#aabbcc');
        expect(screen.getByLabelText('overridden').textContent).toBe('#1677ff');
        expect(screen.getByLabelText('reset').textContent).toBe('default');
        expect(screen.getByLabelText('reset').parentElement?.querySelector('style')).toBeNull();
        expect(screen.getByLabelText('brand portal').textContent).toBe('#aabbcc');
        const scopes = ['inherited', 'overridden', 'brand portal'].map(name => screen.getByLabelText(name).parentElement!);
        expect(new Set(scopes.map(scope => scope.dataset.crabBrand)).size).toBe(3);
        for (const scope of scopes) {
            const sheet = scope.querySelector('style')?.textContent;
            expect(sheet).toContain(`[data-crab-brand="${scope.dataset.crabBrand}"][data-theme="light"]`);
            expect(sheet).toContain(`[data-crab-brand="${scope.dataset.crabBrand}"][data-theme="dark"]`);
            expect(sheet).toContain(`[data-crab-design="${scope.dataset.crabDesign}"]`);
            expect(sheet).toContain('@media (forced-colors: none)');
            expect(sheet).not.toContain('color-feedback');
            expect(sheet).toContain('--token-semantic-color-selection-background:');
            expect(sheet).toContain('--token-semantic-color-selection-foreground:');
            expect(sheet).not.toContain('--token-semantic-color-surface-');
            expect(scope.getAttribute('style')).toBeNull();
        }
    });

    it('updates scoped variables, forwards a CSP nonce and removes the sheet on reset/unmount', async () => {
        const head = document.head.innerHTML;
        const { rerender, unmount } = await render(
            <StrictMode><ConfigProvider brandColor="#1677ff" nonce="theme-nonce" aria-label="brand scope" /></StrictMode>,
        );
        const scope = screen.getByLabelText('brand scope');
        const sheet = scope.querySelector('style')!;
        const firstCss = sheet.textContent;
        expect(sheet.getAttribute('nonce')).toBe('theme-nonce');
        await rerender(<StrictMode><ConfigProvider brandColor="#e76f00" aria-label="brand scope" /></StrictMode>);
        expect(scope.querySelector('style')).toBe(sheet);
        expect(sheet.textContent).not.toBe(firstCss);
        expect(scope.querySelectorAll('style')).toHaveLength(1);
        await rerender(<StrictMode><ConfigProvider brandColor={null} aria-label="brand scope" /></StrictMode>);
        expect(scope.querySelector('style')).toBeNull();
        expect(scope.hasAttribute('data-crab-brand')).toBe(false);
        await rerender(<StrictMode><ConfigProvider brandColor="#1677ff" aria-label="brand scope" /></StrictMode>);
        const mountedSheet = scope.querySelector('style')!;
        expect(mountedSheet.isConnected).toBe(true);
        await unmount();
        expect(document.head.innerHTML).toBe(head);
        expect(sheet.isConnected).toBe(false);
        expect(mountedSheet.isConnected).toBe(false);
    });

    it('provides defaults without a provider', async () => {
        await render(<Probe name="defaults" />);
        expect(screen.getByLabelText('defaults').textContent).toBe('light/zh-CN/middle');
    });

    it('inherits each omitted field and isolates nested and sibling overrides', async () => {
        await render(
            <ConfigProvider theme="dark" locale="en-US" size="large">
                <Probe name="parent" />
                <ConfigProvider theme="light">
                    <Probe name="light" />
                    <ConfigProvider locale="zh-CN" size="small"><Probe name="nested" /></ConfigProvider>
                </ConfigProvider>
                <ConfigProvider><Probe name="sibling" /></ConfigProvider>
            </ConfigProvider>,
        );
        expect(screen.getByLabelText('parent').textContent).toBe('dark/en-US/large');
        expect(screen.getByLabelText('light').textContent).toBe('light/en-US/large');
        expect(screen.getByLabelText('nested').textContent).toBe('light/zh-CN/small');
        expect(screen.getByLabelText('sibling').textContent).toBe('dark/en-US/large');
        expect(screen.getByLabelText('light').parentElement?.dataset.theme).toBe('light');
    });

    it('updates inherited fields and restores inheritance when an override is removed', async () => {
        const { rerender } = await render(
            <ConfigProvider theme="dark" locale="en-US" size="large">
                <ConfigProvider theme="light"><Probe name="value" /></ConfigProvider>
            </ConfigProvider>,
        );
        await rerender(
            <ConfigProvider theme="dark" locale="zh-CN" size="small">
                <ConfigProvider><Probe name="value" /></ConfigProvider>
            </ConfigProvider>,
        );
        const output = screen.getByLabelText('value');
        expect(output.textContent).toBe('dark/zh-CN/small');
        expect(output.parentElement?.getAttribute('lang')).toBe('zh-CN');
        expect(output.parentElement?.dataset.theme).toBe('dark');
    });

    it('forwards native attributes and React 19 refs without mutating the document', async () => {
        const rootTheme = document.documentElement.getAttribute('data-theme');
        const cleanupRef = mock.fn();
        const ref = mock.fn(() => cleanupRef);
        const { unmount } = await render(
            <StrictMode>
                <ConfigProvider theme="dark" locale="en-US" ref={ref} id="scope" className="custom" aria-label="scope">
                    <Probe name="value" />
                </ConfigProvider>
            </StrictMode>,
        );
        const scope = screen.getByLabelText('scope');
        expect(scope.id).toBe('scope');
        expect(scope.classList.contains('custom')).toBe(true);
        expect(scope.getAttribute('style')).toBeNull();
        expect(ref).toHaveBeenCalledWith(scope);
        await unmount();
        expect(cleanupRef).toHaveBeenCalled();
        expect(document.documentElement.getAttribute('data-theme')).toBe(rootTheme);
    });

    it('can re-establish the CSS boundary inside a portal while inheriting context', async () => {
        const { rerender } = await render(
            <ConfigProvider design="shadcn" theme="dark" locale="en-US">
                {createPortal(<ConfigProvider><Probe name="portal" /><DesignProbe name="portal design" /></ConfigProvider>, document.body)}
            </ConfigProvider>,
        );
        const output = screen.getByLabelText('portal');
        expect(output.textContent).toBe('dark/en-US/middle');
        expect(output.parentElement?.dataset.theme).toBe('dark');
        expect(output.parentElement?.dataset.crabDesign).toBe('shadcn');
        expect(screen.getByLabelText('portal design').textContent).toBe('shadcn/dark/default/middle');
        await rerender(
            <ConfigProvider design="material" theme="dark" locale="en-US">
                {createPortal(<ConfigProvider><Probe name="portal" /><DesignProbe name="portal design" /></ConfigProvider>, document.body)}
            </ConfigProvider>,
        );
        expect(screen.getByLabelText('portal design').textContent).toBe('material/dark/default/middle');
        expect(screen.getByLabelText('portal').parentElement?.dataset.crabDesign).toBe('material');
    });
});
