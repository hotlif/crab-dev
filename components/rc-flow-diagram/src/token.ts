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
            'color': `var(${vars['palette.grid.color']}, var(--token-semantic-color-border-subtle, var(--token-global-material-neutral-variant-80, oklch(0.82874810 0.01775809 308.222736))))`
        },
        'node': {
            'background-color': `var(${vars['palette.node.background-color']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
            'border-color': `var(${vars['palette.node.border-color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`,
            'label': {
                'color': `var(${vars['palette.node.label.color']}, var(--token-semantic-color-text-on-brand, var(--token-global-white, oklch(1.000 0 0))))`
            }
        },
        'edge': {
            'color': `var(${vars['palette.edge.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`
        }
    }
});

export default token;
