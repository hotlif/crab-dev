import { describe, expect, it, mock, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import Breadcrumbs from '../breadcrumbs.js';
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
describe('Breadcrumbs', () => {
    const items = [
        { title: 'Home', href: '/home' },
        { title: 'Components', href: '/components' },
        { title: 'Breadcrumbs' },
    ];
    it('renders all breadcrumb items', async () => {
        await render(<Breadcrumbs items={items}/>);
        expect(screen.getByText('Home')).toBeTruthy();
        expect(screen.getByText('Components')).toBeTruthy();
        expect(screen.getByText('Breadcrumbs')).toBeTruthy();
    });
    it('renders links for non-last breadcrumb items with href', async () => {
        await render(<Breadcrumbs items={items}/>);
        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(2);
        expect(links[0].getAttribute('href')).toBe('/home');
        expect(links[1].getAttribute('href')).toBe('/components');
    });
    it('marks the last breadcrumb with aria-current=page', async () => {
        await render(<Breadcrumbs items={items}/>);
        expect(screen.getByText('Breadcrumbs').getAttribute('aria-current')).toBe('page');
    });
    it('renders custom separator', async () => {
        const { container } = await render(<Breadcrumbs items={items} separator="→"/>);
        const separators = [...container.querySelectorAll('[aria-hidden="true"]')]
            .filter((element) => element.textContent === '→');
        expect(separators).toHaveLength(2);
    });
    it('calls onClick when clicking breadcrumb item', async () => {
        const onClick = mock.fn();
        await render(<Breadcrumbs items={[
            { title: 'Home', onClick },
            { title: 'Current' },
        ]}/>);
        await fireEvent.click(screen.getByText('Home'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });
    it('collapses middle items when maxCount is set', async () => {
        const { container } = await render(<Breadcrumbs maxCount={4} items={[
            { title: 'Level 1' },
            { title: 'Level 2' },
            { title: 'Level 3' },
            { title: 'Level 4' },
            { title: 'Level 5' },
            { title: 'Level 6' },
        ]}/>);
        expect(screen.getByText('Level 1')).toBeTruthy();
        expect(screen.getByText('Level 2')).toBeTruthy();
        expect(container.textContent).not.toContain('Level 3');
        expect(container.textContent).toContain('...');
        expect(screen.getByText('Level 6')).toBeTruthy();
    });
    it('supports custom aria-label', async () => {
        const { container } = await render(<Breadcrumbs items={items} aria-label="路径导航"/>);
        const nav = container.querySelector('nav');
        expect(nav?.getAttribute('aria-label')).toBe('路径导航');
    });
});
