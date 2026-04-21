/**
 * @jest-environment jsdom
 */
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

import Tabs from '../tabs.js';
import type { TabsItem } from '../types.js';

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => cleanup());

const baseItems: TabsItem[] = [
    { key: 'one', label: 'One', children: <p>Panel One</p> },
    { key: 'two', label: 'Two', children: <p>Panel Two</p> },
    { key: 'three', label: 'Three', children: <p>Panel Three</p>, disabled: true },
    { key: 'four', label: 'Four', children: <p>Panel Four</p> },
];

describe('Tabs', () => {
    it('renders all tabs and activates the first enabled item by default', () => {
        render(<Tabs items={baseItems} />);

        const tablist = screen.getByRole('tablist');
        expect(tablist).toBeTruthy();
        expect(screen.getAllByRole('tab')).toHaveLength(4);

        const firstTab = screen.getByRole('tab', { name: 'One' });
        expect(firstTab.getAttribute('aria-selected')).toBe('true');
        expect(firstTab.getAttribute('tabindex')).toBe('0');
    });

    it('respects defaultActiveKey', () => {
        render(<Tabs items={baseItems} defaultActiveKey="two" />);
        expect(screen.getByRole('tab', { name: 'Two' }).getAttribute('aria-selected')).toBe('true');
    });

    it('switches panels on click and fires onChange', () => {
        const onChange = jest.fn();
        render(<Tabs items={baseItems} onChange={onChange} />);

        fireEvent.click(screen.getByRole('tab', { name: 'Two' }));
        expect(onChange).toHaveBeenCalledWith('two');
        expect(screen.getByRole('tab', { name: 'Two' }).getAttribute('aria-selected')).toBe('true');
    });

    it('does not switch when clicking a disabled tab', () => {
        const onChange = jest.fn();
        render(<Tabs items={baseItems} onChange={onChange} />);

        fireEvent.click(screen.getByRole('tab', { name: 'Three' }));
        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByRole('tab', { name: 'One' }).getAttribute('aria-selected')).toBe('true');
    });

    it('supports controlled activeKey', () => {
        const Controlled = () => {
            const [key, setKey] = useState('two');
            return (
                <div>
                    <button type="button" onClick={() => setKey('four')}>external</button>
                    <Tabs items={baseItems} activeKey={key} onChange={setKey} />
                </div>
            );
        };
        render(<Controlled />);

        expect(screen.getByRole('tab', { name: 'Two' }).getAttribute('aria-selected')).toBe('true');
        fireEvent.click(screen.getByText('external'));
        expect(screen.getByRole('tab', { name: 'Four' }).getAttribute('aria-selected')).toBe('true');
    });

    it('navigates with ArrowRight / ArrowLeft / Home / End skipping disabled', () => {
        const onChange = jest.fn();
        render(<Tabs items={baseItems} onChange={onChange} />);

        const firstTab = screen.getByRole('tab', { name: 'One' });
        firstTab.focus();

        fireEvent.keyDown(firstTab, { key: 'ArrowRight' });
        expect(onChange).toHaveBeenLastCalledWith('two');

        const secondTab = screen.getByRole('tab', { name: 'Two' });
        fireEvent.keyDown(secondTab, { key: 'ArrowRight' });
        // Three is disabled, should jump to Four
        expect(onChange).toHaveBeenLastCalledWith('four');

        const fourthTab = screen.getByRole('tab', { name: 'Four' });
        fireEvent.keyDown(fourthTab, { key: 'Home' });
        expect(onChange).toHaveBeenLastCalledWith('one');

        fireEvent.keyDown(firstTab, { key: 'End' });
        expect(onChange).toHaveBeenLastCalledWith('four');

        fireEvent.keyDown(fourthTab, { key: 'ArrowLeft' });
        expect(onChange).toHaveBeenLastCalledWith('two');
    });

    it('activates on Enter and Space', () => {
        const onChange = jest.fn();
        render(<Tabs items={baseItems} onChange={onChange} />);

        const secondTab = screen.getByRole('tab', { name: 'Two' });
        secondTab.focus();
        fireEvent.keyDown(secondTab, { key: 'Enter' });
        expect(onChange).toHaveBeenLastCalledWith('two');

        const fourthTab = screen.getByRole('tab', { name: 'Four' });
        fourthTab.focus();
        fireEvent.keyDown(fourthTab, { key: ' ' });
        expect(onChange).toHaveBeenLastCalledWith('four');
    });

    it('fires onTabClose when close button clicked', () => {
        const items: TabsItem[] = [
            { key: 'a', label: 'A', children: 'A', closable: true },
            { key: 'b', label: 'B', children: 'B', closable: true },
        ];
        const onTabClose = jest.fn();
        render(<Tabs items={items} onTabClose={onTabClose} />);

        const closeButtons = screen.getAllByRole('button', { name: 'Close tab' });
        expect(closeButtons).toHaveLength(2);
        fireEvent.click(closeButtons[1]!);
        expect(onTabClose).toHaveBeenCalled();
        expect(onTabClose.mock.calls[0]![0]).toBe('b');
    });

    it('fires onTabClose on Delete when closable', () => {
        const items: TabsItem[] = [
            { key: 'a', label: 'A', children: 'A', closable: true },
        ];
        const onTabClose = jest.fn();
        render(<Tabs items={items} onTabClose={onTabClose} />);

        const tab = screen.getByRole('tab', { name: /A/ });
        fireEvent.keyDown(tab, { key: 'Delete' });
        expect(onTabClose).toHaveBeenCalled();
    });

    it('hides inactive panels by default and destroys them when destroyInactiveTabPane=true', () => {
        const { rerender } = render(<Tabs items={baseItems} />);

        // Default: all panels exist, inactive are hidden
        const panels = screen.getAllByRole('tabpanel', { hidden: true });
        expect(panels).toHaveLength(4);

        rerender(<Tabs items={baseItems} destroyInactiveTabPane />);
        const visiblePanels = screen.getAllByRole('tabpanel');
        expect(visiblePanels).toHaveLength(1);
        expect(visiblePanels[0]!.textContent).toBe('Panel One');
    });

    it('renders tabBarExtraContent as right shorthand and as object', () => {
        const { rerender } = render(
            <Tabs items={baseItems} tabBarExtraContent={<span>extra-right</span>} />,
        );
        expect(screen.getByText('extra-right')).toBeTruthy();

        rerender(
            <Tabs
                items={baseItems}
                tabBarExtraContent={{
                    left: <span>extra-left</span>,
                    right: <span>extra-right-2</span>,
                }}
            />,
        );
        expect(screen.getByText('extra-left')).toBeTruthy();
        expect(screen.getByText('extra-right-2')).toBeTruthy();
    });

    it('renders card and pill type tabs', () => {
        const { rerender } = render(<Tabs items={baseItems} type="card" />);
        expect(screen.getByRole('tab', { name: 'One' }).getAttribute('aria-selected')).toBe('true');

        rerender(<Tabs items={baseItems} type="pill" />);
        expect(screen.getByRole('tab', { name: 'One' }).getAttribute('aria-selected')).toBe('true');
    });

    it('applies centered layout', () => {
        render(<Tabs items={baseItems} centered />);
        expect(screen.getByRole('tablist')).toBeTruthy();
    });
});
