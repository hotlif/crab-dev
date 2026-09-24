import { css } from '@crab-dev/css';
import token, { vars } from '@crab-dev/rc-token-semantic';
import { useConfig } from './context.js';
import type { ConfigSize } from './types.js';

/** Explicit component sizes win; omitted sizes follow the nearest provider. */
export function useComponentSize<T extends string | number>(size: T | undefined): T | ConfigSize {
    const config = useConfig();
    return size ?? config.size;
}

/** Numeric geometry for virtual lists; keep custom row measurements authoritative. */
export const componentSizeMetrics = {
    small: { row: 40, header: 48, navigation: 44 },
    middle: { row: 52, header: 56, navigation: 56 },
    large: { row: 60, header: 64, navigation: 64 },
} as const satisfies Record<ConfigSize, { row: number; header: number; navigation: number }>;

// Declare every role at every boundary so nested providers can restore middle.
// Primitive sizes, typography and touch targets are never globally scaled.
export const componentSizeStyles: Record<ConfigSize, string> = {
    small: css`
        ${vars['density.navigation']}: ${token.sizing.small.navigation};
        ${vars['density.item']}: ${token.sizing.small.item};
        ${vars['density.gap']}: ${token.sizing.small.gap};
        ${vars['density.padding']}: ${token.sizing.small.padding};
        ${vars['density.cell-padding']}: ${token.sizing.small['cell-padding']};
    `,
    middle: css`
        ${vars['density.navigation']}: ${token.sizing.middle.navigation};
        ${vars['density.item']}: ${token.sizing.middle.item};
        ${vars['density.gap']}: ${token.sizing.middle.gap};
        ${vars['density.padding']}: ${token.sizing.middle.padding};
        ${vars['density.cell-padding']}: ${token.sizing.middle['cell-padding']};
    `,
    large: css`
        ${vars['density.navigation']}: ${token.sizing.large.navigation};
        ${vars['density.item']}: ${token.sizing.large.item};
        ${vars['density.gap']}: ${token.sizing.large.gap};
        ${vars['density.padding']}: ${token.sizing.large.padding};
        ${vars['density.cell-padding']}: ${token.sizing.large['cell-padding']};
    `,
};
