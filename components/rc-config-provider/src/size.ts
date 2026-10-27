import { css } from '@crab-dev/css';
import token, { densityGeometry, vars } from '@crab-dev/rc-token-semantic';
import { useConfig } from './context.js';
import type { ConfigSize, ConfigDensity } from './types.js';

/** Explicit component sizes win; omitted sizes follow the nearest provider. */
export function useComponentSize<T extends string | number>(size: T | undefined): T | ConfigSize {
    const config = useConfig();
    return size ?? config.size;
}

/** Density owns data rows and spacing independently of control size. */
export const densityStyles: Record<ConfigDensity, string> = {
    compact: css`
        ${vars['density.row']}: ${token.density.compact.row};
        ${vars['density.header']}: ${token.density.compact.header};
        ${vars['density.navigation']}: ${token.density.compact.navigation};
        ${vars['density.item']}: ${token.density.compact.item};
        ${vars['density.gap']}: ${token.density.compact.gap};
        ${vars['density.padding']}: ${token.density.compact.padding};
        ${vars['density.cell-padding']}: ${token.density.compact['cell-padding']};
    `,
    standard: css`
        ${vars['density.row']}: ${token.density.standard.row};
        ${vars['density.header']}: ${token.density.standard.header};
        ${vars['density.navigation']}: ${token.density.standard.navigation};
        ${vars['density.item']}: ${token.density.standard.item};
        ${vars['density.gap']}: ${token.density.standard.gap};
        ${vars['density.padding']}: ${token.density.standard.padding};
        ${vars['density.cell-padding']}: ${token.density.standard['cell-padding']};
    `,
    comfortable: css`
        ${vars['density.row']}: ${token.density.comfortable.row};
        ${vars['density.header']}: ${token.density.comfortable.header};
        ${vars['density.navigation']}: ${token.density.comfortable.navigation};
        ${vars['density.item']}: ${token.density.comfortable.item};
        ${vars['density.gap']}: ${token.density.comfortable.gap};
        ${vars['density.padding']}: ${token.density.comfortable.padding};
        ${vars['density.cell-padding']}: ${token.density.comfortable['cell-padding']};
    `,
};

/** Numeric virtualized geometry is generated from the same L2 density source. */
export const componentDensityMetrics = densityGeometry;
