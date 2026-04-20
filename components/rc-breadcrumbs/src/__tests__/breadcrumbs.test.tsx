import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import Breadcrumbs from '../breadcrumbs.js';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
    cleanup();
});

describe('Breadcrumbs', () => {
    const items = [
        { title: 'Home', href: '/home' },
        { title: 'Components', href: '/components' },
        { title: 'Breadcrumbs' },
    ];

    it('renders all breadcrumb items', () => {
        render(<Breadcrumbs items={items} />);

        expect(screen.getByText('Home')).toBeTruthy();
        expect(screen.getByText('Components')).toBeTruthy();
        expect(screen.getByText('Breadcrumbs')).toBeTruthy();
    });

    it('renders links for non-last breadcrumb items with href', () => {
        render(<Breadcrumbs items={items} />);

        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(2);
        expect(links[0].getAttribute('href')).toBe('/home');
        expect(links[1].getAttribute('href')).toBe('/components');
    });

    it('marks the last breadcrumb with aria-current=page', () => {
        render(<Breadcrumbs items={items} />);

        expect(screen.getByText('Breadcrumbs').getAttribute('aria-current')).toBe('page');
    });

    it('renders custom separator', () => {
        render(<Breadcrumbs items={items} separator="→" />);

        expect(screen.getAllByText('→').length).toBe(2);
    });

    it('calls onClick when clicking breadcrumb item', () => {
        const onClick = jest.fn();
        render(
            <Breadcrumbs
                items={[
                    { title: 'Home', onClick },
                    { title: 'Current' },
                ]}
            />,
        );

        fireEvent.click(screen.getByText('Home'));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('collapses middle items when maxCount is set', () => {
        render(
            <Breadcrumbs
                maxCount={4}
                items={[
                    { title: 'Level 1' },
                    { title: 'Level 2' },
                    { title: 'Level 3' },
                    { title: 'Level 4' },
                    { title: 'Level 5' },
                    { title: 'Level 6' },
                ]}
            />,
        );

        expect(screen.getByText('Level 1')).toBeTruthy();
        expect(screen.getByText('Level 2')).toBeTruthy();
        expect(screen.queryByText('Level 3')).toBeNull();
        expect(screen.getByText('...')).toBeTruthy();
        expect(screen.getByText('Level 6')).toBeTruthy();
    });

    it('supports custom aria-label', () => {
        const { container } = render(<Breadcrumbs items={items} aria-label="路径导航" />);
        const nav = container.querySelector('nav');

        expect(nav?.getAttribute('aria-label')).toBe('路径导航');
    });
});
