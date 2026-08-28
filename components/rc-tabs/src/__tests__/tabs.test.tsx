import { describe, expect, it, mock, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import { useState } from 'react';
import Tabs from '../tabs.js';
import type { TabsItem } from '../types.js';
(globalThis as unknown as {
    IS_REACT_ACT_ENVIRONMENT: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
const baseItems: TabsItem[] = [
    { key: 'one', label: 'One', children: <p>Panel One</p> },
    { key: 'two', label: 'Two', children: <p>Panel Two</p> },
    { key: 'three', label: 'Three', children: <p>Panel Three</p>, disabled: true },
    { key: 'four', label: 'Four', children: <p>Panel Four</p> },
];
describe('Tabs', () => {
    it('renders all tabs and activates the first enabled item by default', async () => {
        await render(<Tabs items={baseItems}/>);
        const tablist = screen.getByRole('tablist');
        expect(tablist).toBeTruthy();
        expect(screen.getAllByRole('tab')).toHaveLength(4);
        const firstTab = screen.getByRole('tab', { name: 'One' });
        expect(firstTab.getAttribute('aria-selected')).toBe('true');
        expect(firstTab.getAttribute('tabindex')).toBe('0');
    });
    it('uses instance-scoped aria ids to avoid collisions', async () => {
        const sharedItems: TabsItem[] = [
            { key: 'one', label: 'One', children: <p>One Panel</p> },
            { key: 'two', label: 'Two', children: <p>Two Panel</p> },
        ];
        await render(<div>
            <Tabs items={sharedItems}/>
            <Tabs items={sharedItems}/>
        </div>);
        const firstTabs = screen.getAllByRole('tab', { name: 'One' });
        expect(firstTabs).toHaveLength(2);
        const panelIds = firstTabs.map(tab => tab.getAttribute('aria-controls'));
        expect(panelIds[0]).toBeTruthy();
        expect(panelIds[1]).toBeTruthy();
        expect(panelIds[0]).not.toBe(panelIds[1]);
        panelIds.forEach((panelId) => {
            const panel = panelId != null ? document.getElementById(panelId) : null;
            expect(panel).toBeTruthy();
            const labelledBy = panel?.getAttribute('aria-labelledby');
            expect(labelledBy).toBeTruthy();
        });
    });
    it('respects defaultActiveKey', async () => {
        await render(<Tabs items={baseItems} defaultActiveKey="two"/>);
        expect(screen.getByRole('tab', { name: 'Two' }).getAttribute('aria-selected')).toBe('true');
    });
    it('switches panels on click and fires onChange', async () => {
        const onChange = mock.fn();
        await render(<Tabs items={baseItems} onChange={onChange}/>);
        await fireEvent.click(screen.getByRole('tab', { name: 'Two' }));
        expect(onChange).toHaveBeenCalledWith('two');
        expect(screen.getByRole('tab', { name: 'Two' }).getAttribute('aria-selected')).toBe('true');
    });
    it('does not switch when clicking a disabled tab', async () => {
        const onChange = mock.fn();
        await render(<Tabs items={baseItems} onChange={onChange}/>);
        await fireEvent.click(screen.getByRole('tab', { name: 'Three' }));
        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByRole('tab', { name: 'One' }).getAttribute('aria-selected')).toBe('true');
    });
    it('supports controlled activeKey', async () => {
        const Controlled = () => {
            const [key, setKey] = useState('two');
            return (<div>
                <button type="button" onClick={() => setKey('four')}>external</button>
                <Tabs items={baseItems} activeKey={key} onChange={setKey}/>
            </div>);
        };
        await render(<Controlled />);
        expect(screen.getByRole('tab', { name: 'Two' }).getAttribute('aria-selected')).toBe('true');
        await fireEvent.click(screen.getByText('external'));
        expect(screen.getByRole('tab', { name: 'Four' }).getAttribute('aria-selected')).toBe('true');
    });
    it('navigates with ArrowRight / ArrowLeft / Home / End skipping disabled', async () => {
        const onChange = mock.fn();
        await render(<Tabs items={baseItems} onChange={onChange}/>);
        const firstTab = screen.getByRole('tab', { name: 'One' });
        firstTab.focus();
        await fireEvent.keyDown(firstTab, { key: 'ArrowRight' });
        expect(onChange).toHaveBeenLastCalledWith('two');
        const secondTab = screen.getByRole('tab', { name: 'Two' });
        await fireEvent.keyDown(secondTab, { key: 'ArrowRight' });
        // Three is disabled, should jump to Four
        expect(onChange).toHaveBeenLastCalledWith('four');
        const fourthTab = screen.getByRole('tab', { name: 'Four' });
        await fireEvent.keyDown(fourthTab, { key: 'Home' });
        expect(onChange).toHaveBeenLastCalledWith('one');
        await fireEvent.keyDown(firstTab, { key: 'End' });
        expect(onChange).toHaveBeenLastCalledWith('four');
        await fireEvent.keyDown(fourthTab, { key: 'ArrowLeft' });
        expect(onChange).toHaveBeenLastCalledWith('two');
    });
    it('activates on Enter and Space', async () => {
        const onChange = mock.fn();
        await render(<Tabs items={baseItems} onChange={onChange}/>);
        const secondTab = screen.getByRole('tab', { name: 'Two' });
        secondTab.focus();
        await fireEvent.keyDown(secondTab, { key: 'Enter' });
        expect(onChange).toHaveBeenLastCalledWith('two');
        const fourthTab = screen.getByRole('tab', { name: 'Four' });
        fourthTab.focus();
        await fireEvent.keyDown(fourthTab, { key: ' ' });
        expect(onChange).toHaveBeenLastCalledWith('four');
    });
    it('fires onTabClose when close button clicked', async () => {
        const items: TabsItem[] = [
            { key: 'a', label: 'A', children: 'A', closable: true },
            { key: 'b', label: 'B', children: 'B', closable: true },
        ];
        const onTabClose = mock.fn();
        await render(<Tabs items={items} onTabClose={onTabClose}/>);
        const closeButtons = screen.getAllByRole('button', { name: 'Close tab' });
        expect(closeButtons).toHaveLength(2);
        await fireEvent.click(closeButtons[1]!);
        expect(onTabClose).toHaveBeenCalled();
        expect(onTabClose.calls.calls[0]![0]).toBe('b');
    });
    it('fires onTabClose on Delete when closable', async () => {
        const items: TabsItem[] = [
            { key: 'a', label: 'A', children: 'A', closable: true },
        ];
        const onTabClose = mock.fn();
        await render(<Tabs items={items} onTabClose={onTabClose}/>);
        const tab = screen.getByRole('tab', { name: /A/ });
        await fireEvent.keyDown(tab, { key: 'Delete' });
        expect(onTabClose).toHaveBeenCalled();
    });
    it('hides inactive panels by default and destroys them when destroyInactiveTabPane=true', async () => {
        const { rerender } = await render(<Tabs items={baseItems}/>);
        // Default: all panels exist, inactive are hidden
        const panels = screen.getAllByRole('tabpanel', { hidden: true });
        expect(panels).toHaveLength(4);
        await rerender(<Tabs items={baseItems} destroyInactiveTabPane/>);
        const visiblePanels = screen.getAllByRole('tabpanel');
        expect(visiblePanels).toHaveLength(1);
        expect(visiblePanels[0]!.textContent).toBe('Panel One');
    });
    it('renders tabBarExtraContent as right shorthand and as object', async () => {
        const { rerender } = await render(<Tabs items={baseItems} tabBarExtraContent={<span>extra-right</span>}/>);
        expect(screen.getByText('extra-right')).toBeTruthy();
        await rerender(<Tabs items={baseItems} tabBarExtraContent={{
            left: <span>extra-left</span>,
            right: <span>extra-right-2</span>,
        }}/>);
        expect(screen.getByText('extra-left')).toBeTruthy();
        expect(screen.getByText('extra-right-2')).toBeTruthy();
    });
    it('renders card and pill type tabs', async () => {
        const { rerender } = await render(<Tabs items={baseItems} type="card"/>);
        expect(screen.getByRole('tab', { name: 'One' }).getAttribute('aria-selected')).toBe('true');
        await rerender(<Tabs items={baseItems} type="pill"/>);
        expect(screen.getByRole('tab', { name: 'One' }).getAttribute('aria-selected')).toBe('true');
    });
    it('applies centered layout', async () => {
        await render(<Tabs items={baseItems} centered/>);
        expect(screen.getByRole('tablist')).toBeTruthy();
    });
});
