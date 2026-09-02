/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'palette.grid.color': '--flow-diagram-palette-grid-color',
    'palette.node.background-color': '--flow-diagram-palette-node-background-color',
    'palette.node.border-color': '--flow-diagram-palette-node-border-color',
    'palette.node.label.color': '--flow-diagram-palette-node-label-color',
    'palette.edge.color': '--flow-diagram-palette-edge-color'
});

const token = defineTokens({
    'palette': {
        'grid': {
            'color': `var(${vars['palette.grid.color']}, var(--token-semantic-color-border-subtle, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286)))))`
        },
        'node': {
            'background-color': `var(${vars['palette.node.background-color']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`,
            'border-color': `var(${vars['palette.node.border-color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
            'label': {
                'color': `var(${vars['palette.node.label.color']}, var(--token-semantic-color-text-on-brand, var(--token-global-zinc-50, oklch(0.980 0.002 286))))`
            }
        },
        'edge': {
            'color': `var(${vars['palette.edge.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`
        }
    }
});

export default token;
