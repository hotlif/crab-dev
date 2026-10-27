import { describe, expect, it } from '@crab-dev/wake/test';
import { act, render } from '@crab-dev/wake/test/react';
import type { CSSProperties } from 'react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Tag from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

async function settleColor() {
    await act(async () => {
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        for (const animation of document.getAnimations()) {
            if (animation.effect?.getComputedTiming().iterations !== Infinity) animation.finish();
        }
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    });
}

describe('custom Tag color rerenders with published CSS and browser CSSOM', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`updates variable borders to transparent on the retained element (${designSystem}/${colorMode})`, async () => {
                const fixture = (color: string, label: string, style?: CSSProperties, bordered = true) => <>
                    <style>{compiledCss}</style>
                    <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                        <div style={{ '--tag-background': '#246' } as CSSProperties}>
                            <Tag data-custom-color color={color} style={style} bordered={bordered}>{label}</Tag>
                        </div>
                    </ConfigProvider>
                </>;
                const view = await render(fixture('#722ed1', 'Purple'));
                const tag = view.container.querySelector<HTMLElement>('[data-custom-color]')!;
                const observe = async (label: string) => {
                    await settleColor();
                    expect(view.container.querySelector('[data-custom-color]')).toBe(tag);
                    expect(tag.textContent).toBe(label);
                    const computed = getComputedStyle(tag);
                    return {
                        label,
                        inlineForeground: tag.style.color,
                        inlineBackground: tag.style.backgroundColor,
                        inlineBorder: tag.style.borderColor,
                        foreground: computed.color,
                        background: computed.backgroundColor,
                        borders: [computed.borderTopColor, computed.borderRightColor, computed.borderBottomColor, computed.borderLeftColor],
                    };
                };
                expect(await observe('Purple')).toEqual({ label: 'Purple', inlineForeground: 'white', inlineBackground: 'rgb(114, 46, 209)', inlineBorder: 'rgb(114, 46, 209)', foreground: 'rgb(255, 255, 255)', background: 'rgb(114, 46, 209)', borders: Array(4).fill('rgb(114, 46, 209)') });

                await view.rerender(fixture('#1677ff', 'Blue'));
                expect(await observe('Blue')).toEqual({ label: 'Blue', inlineForeground: 'black', inlineBackground: 'rgb(22, 119, 255)', inlineBorder: 'rgb(22, 119, 255)', foreground: 'rgb(0, 0, 0)', background: 'rgb(22, 119, 255)', borders: Array(4).fill('rgb(22, 119, 255)') });

                await view.rerender(fixture('#1677ff', 'Explicit', { color: 'navy' }));
                expect((await observe('Explicit')).foreground).toBe('rgb(0, 0, 128)');

                await view.rerender(fixture('var(--tag-background)', 'CSS pair', { color: 'ivory' }));
                expect(await observe('CSS pair')).toEqual({ label: 'CSS pair', inlineForeground: 'ivory', inlineBackground: 'var(--tag-background)', inlineBorder: 'var(--tag-background)', foreground: 'rgb(255, 255, 240)', background: 'rgb(34, 68, 102)', borders: Array(4).fill('rgb(34, 68, 102)') });

                // This is the exact transition that failed in the DOM suite.
                // Both inline CSSOM and all computed physical borders must
                // change on the same host node; no remount can hide stale style.
                await view.rerender(fixture('#1238', 'Alpha pair', { color: 'white' }, false));
                expect(await observe('Alpha pair')).toEqual({ label: 'Alpha pair', inlineForeground: 'white', inlineBackground: 'rgba(17, 34, 51, 0.533)', inlineBorder: 'transparent', foreground: 'rgb(255, 255, 255)', background: 'rgba(17, 34, 51, 0.533)', borders: Array(4).fill('rgba(0, 0, 0, 0)') });
                expect(tag.getBoundingClientRect().height).toBeGreaterThan(0);
                expect(getComputedStyle(tag).borderTopWidth).toBe('1px');

                await view.rerender(fixture('var(--tag-background)', 'Restored border', { color: 'ivory' }));
                expect((await observe('Restored border')).borders).toEqual(Array(4).fill('rgb(34, 68, 102)'));

                await view.rerender(fixture('primary', 'Preset'));
                await settleColor();
                expect(view.container.querySelector('[data-custom-color]')).toBe(tag);
                expect({ color: tag.style.color, backgroundColor: tag.style.backgroundColor, borderColor: tag.style.borderColor }).toEqual({ color: '', backgroundColor: '', borderColor: '' });
            });
        }
    }
});
