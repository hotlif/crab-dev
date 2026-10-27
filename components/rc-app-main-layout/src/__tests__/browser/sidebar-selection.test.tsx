import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen, userEvent, waitFor } from '@crab-dev/wake/test/react';
import type { Key } from 'react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import { MenuItemType, type MenuItem } from '@crab-dev/rc-menu';
import Layout, { AppMainLayoutProvider, useAppMainLayoutTabs } from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

function createNavigationLoader() {
    const pending = Promise.withResolvers<MenuItem[]>();
    return {
        loadMenus: () => pending.promise,
        complete: async () => {
            // Control only completion timing, keeping the published async loading
            // implementation and its resulting real Menu DOM/styles intact.
            await act(async () => {
                pending.resolve([
                    { key: 'users', type: MenuItemType.Item, title: 'Users navigation' },
                    { key: 'reports', type: MenuItemType.Item, title: 'Reports navigation' },
                ]);
                await pending.promise;
            });
        },
    };
}

function currentItems(): string[] {
    return [...document.querySelectorAll('aside [data-menu-item][aria-current]')].map(item => item.textContent ?? '');
}

describe('Published Layout sidebar selection and painted state', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`synchronizes ${designSystem}/${colorMode} page switches, close and close-all`, async () => {
                const user = userEvent.setup();
                const { loadMenus, complete } = createNavigationLoader();
                const onMenuClick = mock.fn();
                function Bridge() {
                    const tabs = useAppMainLayoutTabs();
                    return <Layout sidebarLoadMenus={loadMenus} fullscreenable={false} onSidebarMenuItemClick={(param) => {
                        onMenuClick(param);
                        tabs.openTab({ key: param.item.key, title: String(param.item.key), children: <p>{String(param.item.key)} content</p> });
                    }} />;
                }
                await render(<ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                    <style>{compiledCss}</style>
                    <div style={{ width: 900, height: 480 }}>
                        <AppMainLayoutProvider initialTabs={[{ key: 'dashboard', title: 'Dashboard', closable: false, children: 'Dashboard content' }]}>
                            <Bridge />
                        </AppMainLayoutProvider>
                    </div>
                </ConfigProvider>);
                await complete();
                const users = (await screen.findByText('Users navigation')).closest<HTMLElement>('[data-menu-item]')!;
                const reports = screen.getByText('Reports navigation').closest<HTMLElement>('[data-menu-item]')!;
                const width = users.getBoundingClientRect().width;
                expect(width).toBeGreaterThan(0);
                expect(currentItems()).toEqual([]);
                await user.click(users);
                await waitFor(() => expect(currentItems()).toEqual(['Users navigation']));
                await user.click(reports);
                await waitFor(() => expect(currentItems()).toEqual(['Reports navigation']));
                await user.click(screen.getByRole('tab', { name: 'users' }));
                await waitFor(() => {
                    expect(currentItems()).toEqual(['Users navigation']);
                    expect(getComputedStyle(users).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
                    expect(getComputedStyle(reports).backgroundColor).toBe('rgba(0, 0, 0, 0)');
                });
                expect(users.getBoundingClientRect().width).toBe(width);
                const closeUsers = screen.getByRole('tab', { name: 'users' }).parentElement?.querySelector<HTMLButtonElement>('button[aria-label="关闭标签页"]');
                expect(closeUsers).toBeTruthy();
                await user.click(closeUsers!);
                await waitFor(() => expect(currentItems()).toEqual(['Reports navigation']));
                expect(screen.getByRole('tab', { name: 'reports' }).getAttribute('aria-selected')).toBe('true');
                // This explicit DOM event tests the actual published context-menu
                // behavior; native Shift+F10/pointer review is tracked separately.
                await fireEvent(screen.getByRole('tab', { name: 'reports' }), new MouseEvent('contextmenu', { bubbles: true }));
                await user.click(await screen.findByRole('menuitem', { name: '关闭全部页面' }));
                await waitFor(() => {
                    expect(currentItems()).toEqual([]);
                    expect(getComputedStyle(reports).backgroundColor).toBe('rgba(0, 0, 0, 0)');
                });
                expect(screen.getByRole('tab', { name: 'Dashboard' }).getAttribute('aria-selected')).toBe('true');
                expect(users.getBoundingClientRect().width).toBe(width);
                expect(onMenuClick).toHaveBeenCalledTimes(2);
            });

            it(`preserves explicit ${designSystem}/${colorMode} business keys until the caller changes them`, async () => {
                const user = userEvent.setup();
                const { loadMenus, complete } = createNavigationLoader();
                const onMenuClick = mock.fn();
                const content = (keys: Key[] | undefined) => <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                    <style>{compiledCss}</style>
                    <div style={{ width: 900, height: 480 }}>
                        <AppMainLayoutProvider initialTabs={[{ key: 'route:/users/42', title: 'User details', breadcrumbs: [{ key: 'users', title: 'Users' }] }]}>
                            <Layout sidebarLoadMenus={loadMenus} sidebarSelectedKeys={keys} onSidebarMenuItemClick={onMenuClick} fullscreenable={false} />
                        </AppMainLayoutProvider>
                    </div>
                </ConfigProvider>;
                const view = await render(content(undefined));
                await complete();
                await screen.findByText('Users navigation');
                expect(currentItems()).toEqual([]);
                await view.rerender(content(['users']));
                expect(currentItems()).toEqual(['Users navigation']);
                await user.click(screen.getByText('Reports navigation'));
                expect(currentItems()).toEqual(['Users navigation']);
                expect(onMenuClick).toHaveBeenCalledTimes(1);
                await view.rerender(content(['reports']));
                expect(currentItems()).toEqual(['Reports navigation']);
                await view.rerender(content([]));
                expect(currentItems()).toEqual([]);
                await view.rerender(content(undefined));
                expect(currentItems()).toEqual([]);
                expect(onMenuClick).toHaveBeenCalledTimes(1);
            });
        }
    }
});
