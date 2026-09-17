import { describe, expect, it } from '@crab-dev/wake/test';
import { render, screen } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Button from '../button.js';
import ButtonGroup from '../buttonGroup.js';

describe('Button global size', () => {
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
