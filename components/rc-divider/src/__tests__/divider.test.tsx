import { describe, expect, it } from '@crab-dev/wake/test';
import { render } from '@crab-dev/wake/test/react';
import { createRef } from 'react';
import Divider from '../divider.js';
describe('Divider', () => {
    it('renders a semantic separator by default', async () => {
        const { container } = await render(<Divider />);
        const separator = container.querySelector('[role="separator"]');
        expect(separator).toBeTruthy();
        expect(separator?.getAttribute('aria-hidden')).toBeNull();
        const svg = separator?.querySelector('svg');
        expect(svg?.getAttribute('aria-hidden')).toBe('true');
        expect(svg?.getAttribute('focusable')).toBe('false');
        const line = svg?.querySelector('line');
        expect(line?.getAttribute('x1')).toBe('0');
        expect(line?.getAttribute('x2')).toBe('100%');
        expect(line?.getAttribute('y1')).toBe('50%');
        expect(line?.getAttribute('y2')).toBe('50%');
    });
    it('omits aria-orientation for horizontal dividers (separator defaults to horizontal)', async () => {
        const { container } = await render(<Divider />);
        const separator = container.querySelector('[role="separator"]');
        expect(separator?.getAttribute('aria-orientation')).toBeNull();
    });
    it('marks vertical dividers with aria-orientation', async () => {
        const { container } = await render(<Divider direction="vertical"/>);
        const separator = container.querySelector('[role="separator"]');
        expect(separator?.getAttribute('aria-orientation')).toBe('vertical');
        const line = separator?.querySelector('svg > line');
        expect(line?.getAttribute('x1')).toBe('50%');
        expect(line?.getAttribute('x2')).toBe('50%');
        expect(line?.getAttribute('y1')).toBe('0');
        expect(line?.getAttribute('y2')).toBe('100%');
    });
    it('drops decorative dividers out of the accessibility tree', async () => {
        const { container } = await render(<Divider decorative/>);
        expect(container.querySelector('[role="separator"]')).toBeNull();
        expect(container.querySelector('[role="none"]')).toBeTruthy();
        expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
    });
    it('renders inline text', async () => {
        const { container } = await render(<Divider>分组标题</Divider>);
        expect(container.textContent).toContain('分组标题');
        const separator = container.querySelector('[role="separator"]');
        expect(separator?.firstElementChild?.tagName).toBe('svg');
        expect(separator?.lastElementChild?.tagName).toBe('svg');
        expect(separator?.querySelectorAll('svg[aria-hidden="true"][focusable="false"]')).toHaveLength(2);
    });
    it('names the separator after its text (children of a static separator are presentational)', async () => {
        const { container } = await render(<Divider>分组标题</Divider>);
        const separator = container.querySelector('[role="separator"]');
        const labelledBy = separator?.getAttribute('aria-labelledby');
        expect(labelledBy).toBeTruthy();
        // useId 产出的 id 含冒号, 走 getElementById 而非选择器, 免去转义
        const label = typeof labelledBy === 'string' ? document.getElementById(labelledBy) : null;
        expect(label?.textContent).toBe('分组标题');
    });
    it('keeps text dividers out of aria-hidden even though they are separators', async () => {
        const { container } = await render(<Divider>分组标题</Divider>);
        const separator = container.querySelector('[role="separator"]');
        expect(separator?.getAttribute('aria-hidden')).toBeNull();
    });
    it('treats an empty children value as a plain line rather than a text divider', async () => {
        const { container } = await render(<Divider>{undefined}</Divider>);
        const separator = container.querySelector('[role="separator"]');
        expect(separator?.getAttribute('aria-labelledby')).toBeNull();
    });
    it('injects the text offset as a custom property', async () => {
        const { container } = await render(<Divider textAlign="start" textOffset={24}>
                标题
        </Divider>);
        const separator = container.querySelector<HTMLElement>('[role="separator"]');
        expect(separator?.style.getPropertyValue('--rc-divider-text-offset')).toBe('24px');
    });
    it('passes a string text offset through untouched', async () => {
        const { container } = await render(<Divider textAlign="end" textOffset="10%">
                标题
        </Divider>);
        const separator = container.querySelector<HTMLElement>('[role="separator"]');
        expect(separator?.style.getPropertyValue('--rc-divider-text-offset')).toBe('10%');
    });
    it('forwards ref to the root element', async () => {
        const ref = createRef<HTMLDivElement>();
        await render(<Divider ref={ref}/>);
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
    it('merges consumer className and forwards native props', async () => {
        const { container } = await render(<Divider className="custom" data-testid="line"/>);
        const separator = container.querySelector('[role="separator"]');
        expect(separator?.classList.contains('custom')).toBe(true);
        expect(separator?.getAttribute('data-testid')).toBe('line');
    });
});
