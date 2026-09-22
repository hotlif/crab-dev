import { describe, expect, it } from '@crab-dev/wake/test';
import { render, screen } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Button from '../button.js';
import ButtonGroup from '../buttonGroup.js';

describe('Button global size', () => {
    it('inherits danger from the group and lets a child opt out', async () => {
        const { rerender } = await render(<ButtonGroup danger appearance="text">
            <Button>Remove</Button><Button danger={false}>Cancel</Button>
        </ButtonGroup>);
        expect(screen.getByText('Remove').closest('button')?.getAttribute('data-tone')).toBe('danger');
        expect(screen.getByText('Remove').closest('button')?.hasAttribute('danger')).toBe(false);
        expect(screen.getByText('Cancel').closest('button')?.hasAttribute('data-tone')).toBe(false);
        await rerender(<ButtonGroup danger={false}><Button>Remove</Button></ButtonGroup>);
        expect(screen.getByText('Remove').closest('button')?.hasAttribute('data-tone')).toBe(false);
    });
    it('inherits all five appearances while explicit children take precedence', async () => {
        const { rerender } = await render(<>
            <Button appearance="tonal">Tonal reference</Button>
            <Button appearance="outlined">Outlined reference</Button>
            <ButtonGroup appearance="tonal"><Button>Inherited appearance</Button><Button appearance="outlined">Explicit appearance</Button></ButtonGroup>
        </>);
        const tonal = screen.getByText('Tonal reference').closest('button')?.className;
        const outlined = screen.getByText('Outlined reference').closest('button')?.className;
        expect(tonal).not.toBe(outlined);
        expect(screen.getByText('Inherited appearance').closest('button')?.className).toBe(tonal);
        expect(screen.getByText('Explicit appearance').closest('button')?.className).toBe(outlined);
        for (const appearance of ['elevated', 'primary', 'tonal', 'outlined', 'text'] as const) {
            await rerender(<>
                <Button appearance={appearance}>Reference</Button>
                <ButtonGroup appearance={appearance}><Button>Inherited appearance</Button><Button appearance="outlined">Explicit appearance</Button></ButtonGroup>
            </>);
            expect(screen.getByText('Inherited appearance').closest('button')?.className).toBe(screen.getByText('Reference').closest('button')?.className);
            expect(screen.getByText('Explicit appearance').closest('button')?.className).toBe(outlined);
        }
    });
    it('resolves explicit size before group size before provider size', async () => {
        const { rerender } = await render(
            <ConfigProvider size="large">
                <Button>Inherited</Button>
                <Button size="large">Large</Button>
                <Button size="small">Small</Button>
                <ButtonGroup size="small">
                    <Button>Grouped</Button>
                    <Button size="large">Explicit</Button>
                </ButtonGroup>
            </ConfigProvider>,
        );
        const large = screen.getByText('Large').closest('button')?.className;
        const small = screen.getByText('Small').closest('button')?.className;
        expect(large).not.toBe(small);
        expect(screen.getByText('Inherited').closest('button')?.className).toBe(large);
        expect(screen.getByText('Grouped').closest('button')?.className).toBe(small);
        expect(screen.getByText('Explicit').closest('button')?.className).toBe(large);
        await rerender(<ConfigProvider size="small"><Button>Inherited</Button></ConfigProvider>);
        expect(screen.getByText('Inherited').closest('button')?.className).toBe(small);
    });

    it('keeps group spacing consistent with inherited size', async () => {
        const { container } = await render(
            <ConfigProvider size="large">
                <ButtonGroup><Button>Inherited</Button></ButtonGroup>
                <ButtonGroup size="large"><Button>Explicit</Button></ButtonGroup>
            </ConfigProvider>,
        );
        const groups = container.querySelector('[data-theme]')?.children;
        expect(groups?.[0].className).toBe(groups?.[1].className);
    });
});
