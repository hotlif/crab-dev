import { useMemo, type ReactElement, type ReactNode } from 'react';
import ConfigContext, { useConfig } from './context.js';
import type { ConfigDirection } from './types.js';

/**
 * Internal direction context for components that already own their DOM boundary.
 * The consumer must apply the matching dir attribute; visual axes still require
 * ConfigProvider's CSS boundary. Preserve every other field from the nearest context.
 */
export default function RuntimeDirectionProvider({ direction, children }: {
    direction: ConfigDirection;
    children: ReactNode;
}): ReactElement {
    const inherited = useConfig();
    // Consumer stability: uncompiled Table consumers also memoize retained cells.
    // A new context object for an unchanged direction would bypass those cell
    // comparators on every selection update. Keep this narrow derived boundary
    // stable while still forwarding every real parent configuration change.
    const config = useMemo(() => direction === inherited.direction
        ? inherited
        : { ...inherited, direction }, [inherited, direction]);
    return <ConfigContext value={config}>{children}</ConfigContext>;
}
