import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { render, screen } from '@crab-dev/wake/test/react';
import { memo, StrictMode } from 'react';
import { createPortal } from 'react-dom';
import ConfigProvider from '../config-provider.js';
import ConfigBoundary from '../config-boundary.js';
import { useConfig } from '../context.js';
import { useLocale } from '../locale.js';
import { useComponentSize } from '../size.js';
import { useConfigStyleBoundary } from '../style-boundary.js';
import RuntimeDirectionProvider from '../runtime-direction-provider.js';

function NativeBoundaryProbe() {
    const boundary = useConfigStyleBoundary();
    return <dialog {...boundary.attributes} className={boundary.className}>{boundary.brandStyle}</dialog>;
}

function Probe({ name }: { name: string }) {
    const { colorMode, locale, size } = useConfig();
    return <output aria-label={name}>{`${colorMode}/${locale}/${size}`}</output>;
}

function BrandProbe({ name }: { name: string }) {
    return <output aria-label={name}>{useConfig().brandColor ?? 'default'}</output>;
}

function DesignProbe({ name }: { name: string }) {
    const { designSystem, colorMode, brandColor, size } = useConfig();
    return <output aria-label={name}>{`${designSystem}/${colorMode}/${brandColor ?? 'default'}/${size}`}</output>;
}

function SizeProbe({ size }: { size?: 'small' | 'medium' | 'large' }) {
    return <output aria-label="component size">{useComponentSize(size)}</output>;
}

function RuntimeConfigProbe({ name }: { name: string }) {
    return <output aria-label={name}>{JSON.stringify(useConfig())}</output>;
}

describe('ConfigProvider', () => {
    it('keeps portal containers unthemed without a provider so native dark themes can inherit', async () => {
        const root = document.documentElement;
        const previousTheme = root.getAttribute('data-theme');
        const previousDesign = root.getAttribute('data-crab-design');
        root.setAttribute('data-theme', 'dark');
        root.setAttribute('data-crab-design', 'shadcn');
        try {
            await render(createPortal(<ConfigBoundary aria-label="native colorMode boundary" className="native-theme"><DesignProbe name="unconfigured portal" /></ConfigBoundary>, document.body));
            const boundary = screen.getByLabelText('native colorMode boundary');
            expect(boundary.tagName).toBe('DIV');
            expect(boundary.classList.contains('native-theme')).toBe(true);
            expect(boundary.hasAttribute('data-theme')).toBe(false);
            expect(boundary.hasAttribute('data-crab-design')).toBe(false);
            expect(boundary.hasAttribute('data-crab-size')).toBe(false);
            expect(boundary.querySelector('style')).toBeNull();
            expect(root.getAttribute('data-theme')).toBe('dark');
            expect(root.getAttribute('data-crab-design')).toBe('shadcn');
            expect(screen.getByLabelText('unconfigured portal').textContent).toBe('md3/light/default/medium');
        } finally {
            if (previousTheme === null) root.removeAttribute('data-theme');
            else root.setAttribute('data-theme', previousTheme);
            if (previousDesign === null) root.removeAttribute('data-crab-design');
            else root.setAttribute('data-crab-design', previousDesign);
        }
    });

    it('rebuilds an existing provider configuration across a portal including brand and runtime changes', async () => {
        const { rerender } = await render(
            <ConfigProvider designSystem="shadcn" colorMode="dark" size="small" brandColor="#AbC">
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
            <ConfigProvider designSystem="md3" colorMode="light" size="large" brandColor={null}>
                {createPortal(<ConfigBoundary aria-label="configured portal"><DesignProbe name="configured portal value" /></ConfigBoundary>, document.body)}
            </ConfigProvider>,
        );
        expect(boundary.dataset.crabDesign).toBe('md3');
        expect(boundary.dataset.theme).toBe('light');
        expect(boundary.dataset.crabSize).toBe('large');
        expect(boundary.querySelector('style')).toBeNull();
        expect(screen.getByLabelText('configured portal value').textContent).toBe('md3/light/default/large');
    });

    it('defaults to md3 and establishes a designSystem boundary without changing colorMode or density', async () => {
        await render(<><DesignProbe name="outside" /><ConfigProvider aria-label="default designSystem"><DesignProbe name="inside" /></ConfigProvider></>);
        expect(screen.getByLabelText('outside').textContent).toBe('md3/light/default/medium');
        expect(screen.getByLabelText('inside').textContent).toBe('md3/light/default/medium');
        expect(screen.getByLabelText('default designSystem').dataset.crabDesign).toBe('md3');
    });

    it('inherits Apple through nested and portal boundaries while retaining independent brand overrides', async () => {
        const { rerender } = await render(
            <ConfigProvider designSystem="apple" colorMode="dark" brandColor="#1677ff" size="small">
                <ConfigProvider brandColor={null}><DesignProbe name="apple reset" /></ConfigProvider>
                <ConfigProvider designSystem="shadcn"><DesignProbe name="explicit designSystem" /></ConfigProvider>
                {createPortal(<ConfigBoundary aria-label="apple portal"><DesignProbe name="apple portal value" /></ConfigBoundary>, document.body)}
            </ConfigProvider>,
        );
        const boundary = screen.getByLabelText('apple portal');
        expect(screen.getByLabelText('apple reset').textContent).toBe('apple/dark/default/small');
        expect(screen.getByLabelText('apple reset').parentElement?.querySelector('style')).toBeNull();
        expect(screen.getByLabelText('explicit designSystem').textContent).toBe('shadcn/dark/#1677ff/small');
        expect(screen.getByLabelText('apple portal value').textContent).toBe('apple/dark/#1677ff/small');
        expect(boundary.dataset.crabDesign).toBe('apple');
        expect(boundary.querySelector('style')?.textContent).toContain('[data-crab-design="apple"]');
        await rerender(
            <ConfigProvider designSystem="apple" colorMode="light" brandColor={null} size="large">
                <ConfigProvider brandColor={null}><DesignProbe name="apple reset" /></ConfigProvider>
                <ConfigProvider designSystem="shadcn"><DesignProbe name="explicit designSystem" /></ConfigProvider>
                {createPortal(<ConfigBoundary aria-label="apple portal"><DesignProbe name="apple portal value" /></ConfigBoundary>, document.body)}
            </ConfigProvider>,
        );
        expect(screen.getByLabelText('apple portal value').textContent).toBe('apple/light/default/large');
        expect(boundary.querySelector('style')).toBeNull();
        expect(boundary.dataset.theme).toBe('light');
        expect(boundary.dataset.crabSize).toBe('large');
    });

    it('inherits designs, isolates explicit overrides and restores inheritance during runtime switches', async () => {
        const { rerender } = await render(
            <ConfigProvider designSystem="md3" colorMode="dark" brandColor="#1677ff" size="small">
                <ConfigProvider designSystem="shadcn"><DesignProbe name="override" /></ConfigProvider>
                <ConfigProvider><DesignProbe name="inherited designSystem" /></ConfigProvider>
            </ConfigProvider>,
        );
        expect(screen.getByLabelText('override').textContent).toBe('shadcn/dark/#1677ff/small');
        expect(screen.getByLabelText('inherited designSystem').textContent).toBe('md3/dark/#1677ff/small');
        await rerender(
            <ConfigProvider designSystem="shadcn" colorMode="dark" brandColor="#1677ff" size="small">
                <ConfigProvider designSystem="md3"><DesignProbe name="override" /></ConfigProvider>
                <ConfigProvider><DesignProbe name="inherited designSystem" /></ConfigProvider>
            </ConfigProvider>,
        );
        expect(screen.getByLabelText('override').textContent).toBe('md3/dark/#1677ff/small');
        expect(screen.getByLabelText('inherited designSystem').textContent).toBe('shadcn/dark/#1677ff/small');
        expect(screen.getByLabelText('inherited designSystem').parentElement?.dataset.crabDesign).toBe('shadcn');
        await rerender(
            <ConfigProvider designSystem="shadcn" colorMode="dark" brandColor="#1677ff" size="small">
                <ConfigProvider><DesignProbe name="override" /></ConfigProvider>
                <ConfigProvider><DesignProbe name="inherited designSystem" /></ConfigProvider>
            </ConfigProvider>,
        );
        expect(screen.getByLabelText('override').textContent).toBe('shadcn/dark/#1677ff/small');
        expect(screen.getByLabelText('override').parentElement?.dataset.crabDesign).toBe('shadcn');
    });

    it('resets a brand to the active designSystem defaults and keeps the reset when the designSystem changes', async () => {
        const { rerender } = await render(
            <ConfigProvider designSystem="shadcn" colorMode="dark" brandColor="#1677ff" size="large">
                <ConfigProvider brandColor={null}><DesignProbe name="designSystem reset" /></ConfigProvider>
            </ConfigProvider>,
        );
        const output = screen.getByLabelText('designSystem reset');
        const boundary = output.parentElement!;
        expect(output.textContent).toBe('shadcn/dark/default/large');
        expect(boundary.dataset.crabDesign).toBe('shadcn');
        expect(boundary.querySelector('style')).toBeNull();
        await rerender(
            <ConfigProvider designSystem="md3" colorMode="dark" brandColor="#1677ff" size="large">
                <ConfigProvider brandColor={null}><DesignProbe name="designSystem reset" /></ConfigProvider>
            </ConfigProvider>,
        );
        expect(output.textContent).toBe('md3/dark/default/large');
        expect(boundary.dataset.crabDesign).toBe('md3');
        expect(boundary.dataset.theme).toBe('dark');
        expect(boundary.dataset.crabSize).toBe('large');
        expect(boundary.querySelector('style')).toBeNull();
        expect(boundary.hasAttribute('data-crab-brand')).toBe(false);
    });

    it('updates inherited component sizes, preserves explicit overrides and restores a nested boundary', async () => {
        const view = await render(<ConfigProvider size="small"><SizeProbe /><ConfigProvider size="medium" aria-label="standard" /></ConfigProvider>);
        expect(screen.getByLabelText('component size').textContent).toBe('small');
        expect(screen.getByLabelText('standard').dataset.crabSize).toBe('medium');
        await view.rerender(<ConfigProvider size="large"><SizeProbe size="small" /></ConfigProvider>);
        expect(screen.getByLabelText('component size').textContent).toBe('small');
        await view.rerender(<ConfigProvider size="large"><SizeProbe /></ConfigProvider>);
        expect(screen.getByLabelText('component size').textContent).toBe('large');
        expect(screen.getByLabelText('component size').parentElement?.dataset.crabSize).toBe('large');
    });
    it('inherits a normalized brand across colorMode boundaries and permits an explicit reset', async () => {
        await render(
            <ConfigProvider brandColor="#AbC" colorMode="light">
                <ConfigProvider colorMode="dark"><BrandProbe name="inherited" /></ConfigProvider>
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
        expect(screen.getByLabelText('defaults').textContent).toBe('light/zh-CN/medium');
    });

    it('inherits each omitted field and isolates nested and sibling overrides', async () => {
        await render(
            <ConfigProvider colorMode="dark" locale="en-US" size="large">
                <Probe name="parent" />
                <ConfigProvider colorMode="light">
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
            <ConfigProvider colorMode="dark" locale="en-US" size="large">
                <ConfigProvider colorMode="light"><Probe name="value" /></ConfigProvider>
            </ConfigProvider>,
        );
        await rerender(
            <ConfigProvider colorMode="dark" locale="zh-CN" size="small">
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
                <ConfigProvider colorMode="dark" locale="en-US" ref={ref} id="scope" className="custom" aria-label="scope">
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
            <ConfigProvider designSystem="shadcn" colorMode="dark" locale="en-US">
                {createPortal(<ConfigProvider><Probe name="portal" /><DesignProbe name="portal designSystem" /></ConfigProvider>, document.body)}
            </ConfigProvider>,
        );
        const output = screen.getByLabelText('portal');
        expect(output.textContent).toBe('dark/en-US/medium');
        expect(output.parentElement?.dataset.theme).toBe('dark');
        expect(output.parentElement?.dataset.crabDesign).toBe('shadcn');
        expect(screen.getByLabelText('portal designSystem').textContent).toBe('shadcn/dark/default/medium');
        await rerender(
            <ConfigProvider designSystem="md3" colorMode="dark" locale="en-US">
                {createPortal(<ConfigProvider><Probe name="portal" /><DesignProbe name="portal designSystem" /></ConfigProvider>, document.body)}
            </ConfigProvider>,
        );
        expect(screen.getByLabelText('portal designSystem').textContent).toBe('md3/dark/default/medium');
        expect(screen.getByLabelText('portal').parentElement?.dataset.crabDesign).toBe('md3');
    });
});

function FullConfigProbe() {
    const { density, direction, nonce } = useConfig();
    const { messages } = useLocale();
    return <output aria-label="full config">{[density, direction, nonce, messages.common.close].join('/')}</output>;
}

describe('configuration dimensions', () => {
    it('inherits density, direction, locale and nonce across portal boundaries independently of control size', async () => {
        const view = await render(<ConfigProvider designSystem="apple" density="compact" size="large" direction="rtl" locale="en-US" nonce="inherited-nonce" brandColor="#123456">
            {createPortal(<ConfigBoundary aria-label="complete portal"><FullConfigProbe /></ConfigBoundary>, document.body)}
        </ConfigProvider>);
        const boundary = screen.getByLabelText('complete portal');
        expect(boundary.dataset.crabDensity).toBe('compact'); expect(boundary.dataset.crabSize).toBe('large');
        expect(boundary.getAttribute('dir')).toBe('rtl'); expect(boundary.getAttribute('lang')).toBe('en-US');
        expect(boundary.querySelector('style')?.getAttribute('nonce')).toBe('inherited-nonce');
        expect(screen.getByLabelText('full config').textContent).toBe('compact/rtl/inherited-nonce/Close');
        await view.rerender(<ConfigProvider density="comfortable" size="small" locale="zh-CN"><ConfigProvider density="standard"><FullConfigProbe /></ConfigProvider></ConfigProvider>);
        expect(screen.getByLabelText('full config').textContent).toBe('standard/ltr//关闭');
    });
});

describe('unconfigured overlay size boundaries', () => {
    it('propagates an explicit control size without forcing a native CSS theme', async () => {
        await render(<ConfigBoundary size="large" aria-label="size only"><SizeProbe /></ConfigBoundary>);
        const boundary = screen.getByLabelText('size only');
        expect(screen.getByLabelText('component size').textContent).toBe('large');
        expect(boundary.dataset.crabSize).toBe('large');
        expect(boundary.hasAttribute('data-theme')).toBe(false);
        expect(boundary.hasAttribute('data-crab-design')).toBe(false);
    });
});

describe('native configuration style boundary', () => {
    it('shares the ordinary provider brand rule, inherits all attributes and removes a reset', async () => {
        const view = await render(<ConfigProvider designSystem="apple" colorMode="dark" brandColor="#6750a4" density="comfortable" size="large" locale="en-US" direction="rtl" nonce="native-nonce"><NativeBoundaryProbe /></ConfigProvider>);
        const modal = view.container.querySelector('dialog');
        const sheet = modal?.querySelector('style');
        expect(modal?.getAttribute('data-crab-design')).toBe('apple');
        expect(modal?.getAttribute('data-theme')).toBe('dark');
        expect(modal?.getAttribute('data-crab-density')).toBe('comfortable');
        expect(modal?.getAttribute('data-crab-size')).toBe('large');
        expect(modal?.getAttribute('dir')).toBe('rtl');
        expect(modal?.getAttribute('lang')).toBe('en-US');
        expect(sheet?.getAttribute('nonce')).toBe('native-nonce');
        expect(sheet?.getAttribute('data-crab-brand-style')).toBe(modal?.getAttribute('data-crab-brand'));
        const providerSheet = view.container.querySelector('style[data-crab-brand-style]');
        const removeScope = (text: string | null | undefined) => text?.replace(/data-crab-brand="[^"]+"/g, 'data-crab-brand="scope"');
        expect(removeScope(sheet?.textContent)).toBe(removeScope(providerSheet?.textContent));
        await view.rerender(<ConfigProvider brandColor={null}><NativeBoundaryProbe /></ConfigProvider>);
        expect(modal?.getAttribute('data-crab-brand')).toBeNull();
        expect(modal?.querySelector('style')).toBeNull();
    });
});

describe('internal runtime direction boundary', () => {
    for (const initialDirection of ['ltr', 'rtl'] as const) {
        it(`does not invalidate memoized consumers on an unchanged ${initialDirection} boundary`, async () => {
            const reads = mock.fn();
            const Consumer = memo(function Consumer() {
                const config = useConfig();
                reads(config);
                return <output aria-label="stable runtime direction">{config.direction}</output>;
            });
            const field = (revision: number, direction: 'ltr' | 'rtl') => <>
                <span>{revision}</span>
                <RuntimeDirectionProvider direction={direction}><Consumer /></RuntimeDirectionProvider>
            </>;
            const view = await render(field(0, initialDirection));
            const initialReads = reads.calls.calls.length;
            expect(initialReads).toBeGreaterThan(0);
            await view.rerender(field(1, initialDirection));
            expect(reads).toHaveBeenCalledTimes(initialReads);
            const changed = initialDirection === 'ltr' ? 'rtl' : 'ltr';
            await view.rerender(field(2, changed));
            expect(reads).toHaveBeenCalledTimes(initialReads + 1);
            expect(screen.getByLabelText('stable runtime direction').textContent).toBe(changed);
        });
    }

    it('changes only direction without creating DOM or dropping inherited configuration', async () => {
        await render(
            <ConfigProvider aria-label="direction host" designSystem="apple" colorMode="dark" brandColor="#AbC" locale="en-US" size="large" density="compact" direction="rtl" nonce="direction-nonce">
                <RuntimeDirectionProvider direction="ltr"><RuntimeConfigProbe name="runtime direction" /></RuntimeDirectionProvider>
                <RuntimeConfigProbe name="outside runtime" />
            </ConfigProvider>,
        );
        const host = screen.getByLabelText('direction host');
        const inherited = { designSystem: 'apple', colorMode: 'dark', brandColor: '#aabbcc', locale: 'en-US', size: 'large', density: 'compact', direction: 'rtl', nonce: 'direction-nonce' };
        expect(screen.getByLabelText('runtime direction').textContent).toBe(JSON.stringify({ ...inherited, direction: 'ltr' }));
        expect(screen.getByLabelText('outside runtime').textContent).toBe(JSON.stringify(inherited));
        expect(screen.getByLabelText('runtime direction').parentElement).toBe(host);
        expect(host.getAttribute('dir')).toBe('rtl');
        expect(host.querySelectorAll('div')).toHaveLength(0);
        expect(host.querySelectorAll('style')).toHaveLength(1);
    });

    it('uses the nearest complete configuration and scopes nested runtime directions independently', async () => {
        await render(
            <ConfigProvider designSystem="apple" colorMode="dark" brandColor="#123456" locale="en-US" size="large" density="compact" direction="ltr" nonce="outer-nonce">
                <ConfigProvider aria-label="nearest direction host" designSystem="shadcn" brandColor={null} size="small" density="comfortable" direction="rtl" nonce="nearest-nonce">
                    <RuntimeDirectionProvider direction="ltr">
                        <RuntimeConfigProbe name="nearest runtime" />
                        <RuntimeDirectionProvider direction="rtl"><RuntimeConfigProbe name="nested runtime" /></RuntimeDirectionProvider>
                    </RuntimeDirectionProvider>
                    <RuntimeConfigProbe name="nearest sibling" />
                </ConfigProvider>
            </ConfigProvider>,
        );
        const inherited = { designSystem: 'shadcn', colorMode: 'dark', brandColor: null, locale: 'en-US', size: 'small', density: 'comfortable', direction: 'rtl', nonce: 'nearest-nonce' };
        expect(screen.getByLabelText('nearest runtime').textContent).toBe(JSON.stringify({ ...inherited, direction: 'ltr' }));
        expect(screen.getByLabelText('nested runtime').textContent).toBe(JSON.stringify(inherited));
        expect(screen.getByLabelText('nearest sibling').textContent).toBe(JSON.stringify(inherited));
        expect(screen.getByLabelText('nested runtime').parentElement).toBe(screen.getByLabelText('nearest direction host'));
    });

    it('carries runtime direction through an actual Portal and updates the complete ConfigBoundary', async () => {
        const view = await render(
            <ConfigProvider designSystem="apple" colorMode="dark" brandColor="#123456" locale="en-US" size="large" density="compact" direction="rtl" nonce="portal-nonce">
                <RuntimeDirectionProvider direction="ltr">
                    {createPortal(<ConfigBoundary aria-label="runtime portal"><RuntimeConfigProbe name="runtime portal config" /></ConfigBoundary>, document.body)}
                </RuntimeDirectionProvider>
            </ConfigProvider>,
        );
        const portal = screen.getByLabelText('runtime portal');
        expect(portal.parentElement).toBe(document.body);
        expect(portal.getAttribute('dir')).toBe('ltr');
        expect(portal.getAttribute('lang')).toBe('en-US');
        expect(portal.dataset.crabDesign).toBe('apple');
        expect(portal.dataset.theme).toBe('dark');
        expect(portal.dataset.crabSize).toBe('large');
        expect(portal.dataset.crabDensity).toBe('compact');
        expect(portal.getAttribute('nonce')).toBe('portal-nonce');
        expect(portal.querySelector('style')?.getAttribute('nonce')).toBe('portal-nonce');
        expect(screen.getByLabelText('runtime portal config').textContent).toBe(JSON.stringify({ designSystem: 'apple', colorMode: 'dark', brandColor: '#123456', locale: 'en-US', size: 'large', density: 'compact', direction: 'ltr', nonce: 'portal-nonce' }));
        await view.rerender(
            <ConfigProvider designSystem="shadcn" colorMode="light" brandColor={null} locale="zh-CN" size="small" density="comfortable" direction="ltr" nonce="updated-nonce">
                <RuntimeDirectionProvider direction="rtl">
                    {createPortal(<ConfigBoundary aria-label="runtime portal"><RuntimeConfigProbe name="runtime portal config" /></ConfigBoundary>, document.body)}
                </RuntimeDirectionProvider>
            </ConfigProvider>,
        );
        expect(screen.getByLabelText('runtime portal')).toBe(portal);
        expect(portal.getAttribute('dir')).toBe('rtl');
        expect(portal.getAttribute('lang')).toBe('zh-CN');
        expect(portal.dataset.crabDesign).toBe('shadcn');
        expect(portal.dataset.theme).toBe('light');
        expect(portal.dataset.crabSize).toBe('small');
        expect(portal.dataset.crabDensity).toBe('comfortable');
        expect(portal.getAttribute('nonce')).toBe('updated-nonce');
        expect(portal.querySelector('style')).toBeNull();
        expect(screen.getByLabelText('runtime portal config').textContent).toBe(JSON.stringify({ designSystem: 'shadcn', colorMode: 'light', brandColor: null, locale: 'zh-CN', size: 'small', density: 'comfortable', direction: 'rtl', nonce: 'updated-nonce' }));
    });

    it('preserves root defaults when only a runtime direction is present', async () => {
        const view = await render(<RuntimeDirectionProvider direction="rtl"><RuntimeConfigProbe name="runtime defaults" /></RuntimeDirectionProvider>);
        const output = screen.getByLabelText('runtime defaults');
        expect(output.parentElement).toBe(view.container);
        expect(view.container.children).toHaveLength(1);
        expect(output.textContent).toBe(JSON.stringify({ designSystem: 'md3', colorMode: 'light', brandColor: null, locale: 'zh-CN', size: 'medium', density: 'standard', direction: 'rtl' }));
    });
});
