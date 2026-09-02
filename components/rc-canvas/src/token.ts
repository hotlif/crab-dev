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
            'color': `var(${vars['palette.foreground.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
        },
        'grid': {
            'color': `var(${vars['palette.grid.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`
        },
        'selection': {
            'border-color': `var(${vars['palette.selection.border-color']}, var(--token-semantic-color-selection-border, var(--token-global-blue-700, oklch(0.488 0.230 264))))`,
            'background-color': `var(${vars['palette.selection.background-color']}, var(--token-semantic-color-selection-background, var(--token-global-blue-50, oklch(0.970 0.014 254))))`
        },
        'editor': {
            'background-color': `var(${vars['palette.editor.background-color']}, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0))))`,
            'border-color': `var(${vars['palette.editor.border-color']}, var(--token-semantic-color-border-focus, var(--token-global-blue-600, oklch(0.546 0.245 262))))`
        },
        'transformer': {
            'handle': {
                'background-color': `var(${vars['palette.transformer.handle.background-color']}, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0))))`,
                'border-color': `var(${vars['palette.transformer.handle.border-color']}, var(--token-semantic-color-border-focus, var(--token-global-blue-600, oklch(0.546 0.245 262))))`
            },
            'selection': {
                'border-color': `var(${vars['palette.transformer.selection.border-color']}, var(--token-semantic-color-selection-border, var(--token-global-blue-700, oklch(0.488 0.230 264))))`
            }
        },
        'minimap': {
            'background-color': `var(${vars['palette.minimap.background-color']}, color-mix(in oklch, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0))) 92%, transparent))`,
            'viewport': {
                'border-color': `var(${vars['palette.minimap.viewport.border-color']}, color-mix(in oklch, var(--token-semantic-color-selection-border, var(--token-global-blue-700, oklch(0.488 0.230 264))) 80%, transparent))`,
                'background-color': `var(${vars['palette.minimap.viewport.background-color']}, var(--token-semantic-color-selection-background, var(--token-global-blue-50, oklch(0.970 0.014 254))))`
            },
            'border-color': `var(${vars['palette.minimap.border-color']}, color-mix(in oklch, var(--token-semantic-color-border-default, var(--token-global-zinc-500, oklch(0.660 0.014 286))) 8%, transparent))`,
            'box-shadow': `var(${vars['palette.minimap.box-shadow']}, var(--token-semantic-shadow-float, var(--token-global-shadow-md, 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1))))`,
            'image-fallback': {
                'background-color': `var(${vars['palette.minimap.image-fallback.background-color']}, color-mix(in oklch, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))) 70%, transparent))`
            }
        }
    }
});

export default token;
