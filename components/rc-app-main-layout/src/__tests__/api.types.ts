import type { ComponentProps, Key } from 'react';

type LayoutProps = ComponentProps<(typeof import('../layout.js'))['default']>;

export function verifySidebarSelectionContract(keys: Key[] | undefined): LayoutProps[] {
    const readOnly: LayoutProps = { sidebarSelectedKeys: ['users', 0] };
    const empty: LayoutProps = { sidebarSelectedKeys: [] };
    const forwarded: LayoutProps = { sidebarSelectedKeys: keys };
    // @ts-expect-error Menu keys remain React keys, not arbitrary route objects.
    const invalid: LayoutProps = { sidebarSelectedKeys: [{ path: '/users' }] };
    return [readOnly, empty, forwarded, invalid];
}
