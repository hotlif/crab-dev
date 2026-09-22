/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'palette.foreground.color': '--canvas-palette-foreground-color',
    'palette.grid.color': '--canvas-palette-grid-color',
    'palette.selection.border-color': '--canvas-palette-selection-border-color',
    'palette.selection.background-color': '--canvas-palette-selection-background-color',
    'palette.editor.background-color': '--canvas-palette-editor-background-color',
    'palette.editor.border-color': '--canvas-palette-editor-border-color',
    'palette.transformer.handle.background-color': '--canvas-palette-transformer-handle-background-color',
    'palette.transformer.handle.border-color': '--canvas-palette-transformer-handle-border-color',
    'palette.transformer.selection.border-color': '--canvas-palette-transformer-selection-border-color',
    'palette.minimap.background-color': '--canvas-palette-minimap-background-color',
    'palette.minimap.viewport.border-color': '--canvas-palette-minimap-viewport-border-color',
    'palette.minimap.viewport.background-color': '--canvas-palette-minimap-viewport-background-color',
    'palette.minimap.border-color': '--canvas-palette-minimap-border-color',
    'palette.minimap.box-shadow': '--canvas-palette-minimap-box-shadow',
    'palette.minimap.image-fallback.background-color': '--canvas-palette-minimap-image-fallback-background-color'
});

const token = defineTokens({
    'palette': {
        'foreground': {
            'color': `var(${vars['palette.foreground.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`
        },
        'grid': {
            'color': `var(${vars['palette.grid.color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`
        },
        'selection': {
            'border-color': `var(${vars['palette.selection.border-color']}, var(--token-semantic-color-selection-border, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
            'background-color': `var(${vars['palette.selection.background-color']}, var(--token-semantic-color-selection-background, var(--token-global-purple-90, oklch(0.91829316 0.04770250 302.827510))))`
        },
        'editor': {
            'background-color': `var(${vars['palette.editor.background-color']}, var(--token-semantic-color-surface-raised, var(--token-semantic-color-background-elevated, var(--token-global-material-neutral-96, oklch(0.96728288 0.01181410 313.217082)))))`,
            'border-color': `var(${vars['palette.editor.border-color']}, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`
        },
        'transformer': {
            'handle': {
                'background-color': `var(${vars['palette.transformer.handle.background-color']}, var(--token-semantic-color-surface-raised, var(--token-semantic-color-background-elevated, var(--token-global-material-neutral-96, oklch(0.96728288 0.01181410 313.217082)))))`,
                'border-color': `var(${vars['palette.transformer.handle.border-color']}, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`
            },
            'selection': {
                'border-color': `var(${vars['palette.transformer.selection.border-color']}, var(--token-semantic-color-selection-border, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`
            }
        },
        'minimap': {
            'background-color': `var(${vars['palette.minimap.background-color']}, color-mix(in oklch, var(--token-semantic-color-surface-raised, var(--token-semantic-color-background-elevated, var(--token-global-material-neutral-96, oklch(0.96728288 0.01181410 313.217082)))) 92%, transparent))`,
            'viewport': {
                'border-color': `var(${vars['palette.minimap.viewport.border-color']}, color-mix(in oklch, var(--token-semantic-color-selection-border, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))) 80%, transparent))`,
                'background-color': `var(${vars['palette.minimap.viewport.background-color']}, var(--token-semantic-color-selection-background, var(--token-global-purple-90, oklch(0.91829316 0.04770250 302.827510))))`
            },
            'border-color': `var(${vars['palette.minimap.border-color']}, color-mix(in oklch, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))) 8%, transparent))`,
            'box-shadow': `var(${vars['palette.minimap.box-shadow']}, var(--token-semantic-shadow-float, var(--token-global-shadow-material-2, 0 1px 2px 0 oklch(0 0 0 / 0.3), 0 2px 6px 2px oklch(0 0 0 / 0.15))))`,
            'image-fallback': {
                'background-color': `var(${vars['palette.minimap.image-fallback.background-color']}, color-mix(in oklch, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))) 70%, transparent))`
            }
        }
    }
});

export default token;
