import { describe, expect, it } from '@crab-dev/wake/test';
import { render } from '@crab-dev/wake/test/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getOpaqueHexForeground } from '../custom-color.js';
import Tag from '../tag.js';

describe('opaque custom Tag colors', () => {
    it('chooses readable endpoints for the captured examples and gray boundary', () => {
        // Fixed expected outcomes, including both sides of the gray crossover;
        // do not recompute the implementation formula in these assertions.
        const cases = [
            ['#1677ff', 'black'],
            ['#722ed1', 'white'],
            ['#eb2f96', 'black'],
            ['#13c2c2', 'black'],
            ['#000', 'white'],
            ['#fff', 'black'],
            ['#757575', 'white'],
            ['#767676', 'black'],
            [' #AbCf ', 'black'],
            ['#112233FF', 'white'],
            ['#FFFFFFff', 'black'],
        ] as const;
        for (const [color, foreground] of cases) {
            expect(getOpaqueHexForeground(color)).toBe(foreground);
        }
    });

    it('declines translucent, unresolved and malformed colors', () => {
        for (const value of [
            '#0000', '#123e', '#112233fe', '#ffffff80',
            'transparent', 'red', 'var(--tag-color)', 'rgb(1 2 3)',
            'color-mix(in srgb, red 50%, transparent)',
            '', '123456', '#12', '#12345', '#1234567', '#gggggg',
        ]) {
            expect(getOpaqueHexForeground(value)).toBeUndefined();
        }
    });

    it('renders the derived foreground while preserving caller overrides', async () => {
        const { container, rerender } = await render(<Tag color="#722ed1">Purple</Tag>);
        const tag = container.firstElementChild as HTMLSpanElement;
        expect(tag.style.color).toBe('white');
        expect(tag.style.backgroundColor).toBe('#722ed1');

        await rerender(<Tag color="#1677ff">Blue</Tag>);
        expect(tag.style.color).toBe('black');
        expect(tag.style.backgroundColor).toBe('#1677ff');

        await rerender(<Tag color="#1677ff" style={{ color: 'navy' }}>Explicit</Tag>);
        expect(tag.style.color).toBe('navy');

        await rerender(<Tag color="var(--tag-background)" style={{ color: 'ivory' }}>CSS pair</Tag>);
        expect(tag.style.color).toBe('ivory');
        expect(tag.style.backgroundColor).toBe('var(--tag-background)');

        await rerender(<Tag color="#1238" style={{ color: 'white' }} bordered={false}>Alpha pair</Tag>);
        expect(tag.style.color).toBe('white');
        // Environment boundary: Wake 0.1.45 DOM retains the variable border
        // even on a component-free span after assigning transparent. SSR below
        // checks emitted declarations; the required published browser suite
        // checks this exact retained-node sequence and all four computed sides
        // in six themes. Restore the DOM getter regression after a Wake upgrade
        // supports this CSSOM mutation. The product has no compatibility hack.
        expect(tag.textContent).toBe('Alpha pair');
    });

    it('serializes custom border declarations without relying on the DOM CSS parser', () => {
        const variable = renderToStaticMarkup(<Tag color="var(--tag-background)" style={{ color: 'ivory' }}>CSS pair</Tag>);
        expect(variable).toContain('color:ivory');
        expect(variable).toContain('background-color:var(--tag-background)');
        expect(variable).toContain('border-color:var(--tag-background)');

        const alpha = renderToStaticMarkup(<Tag color="#1238" style={{ color: 'white' }} bordered={false}>Alpha pair</Tag>);
        expect(alpha).toContain('color:white');
        expect(alpha).toContain('background-color:#1238');
        expect(alpha).toContain('border-color:transparent');

        const explicit = renderToStaticMarkup(<Tag color="#1238" style={{ color: 'white', borderColor: 'navy' }} bordered={false}>Explicit border</Tag>);
        expect(explicit).toContain('border-color:navy');
    });

    it('keeps preset colors under the design token contract', async () => {
        const { container } = await render(<Tag color="primary">Preset</Tag>);
        const tag = container.firstElementChild as HTMLSpanElement;
        expect(tag.style.color).toBe('');
        expect(tag.style.backgroundColor).toBe('');
    });
});
