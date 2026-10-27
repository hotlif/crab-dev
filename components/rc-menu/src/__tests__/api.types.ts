import type { MenuProps } from '../menu.js';

export function verifyStateContract(): { readOnly: MenuProps; conflicting: MenuProps } {
    const readOnly: MenuProps = { selectedKeys: [], openKeys: [] };
    // @ts-expect-error Controlled state and its initial default are mutually exclusive.
    const conflicting: MenuProps = { selectedKeys: [], defaultSelectedKeys: [] };
    return { readOnly, conflicting };
}
