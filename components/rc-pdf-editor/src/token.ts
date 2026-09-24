/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.background': '--pdf-editor-root-background',
    'root.color': '--pdf-editor-root-color',
    'root.font-family': '--pdf-editor-root-font-family',
    'root.font-size': '--pdf-editor-root-font-size',
    'root.line-height': '--pdf-editor-root-line-height',
    'root.height': '--pdf-editor-root-height',
    'root.min-height': '--pdf-editor-root-min-height',
    'root.border-radius': '--pdf-editor-root-border-radius',
    'root.border-color': '--pdf-editor-root-border-color',
    'root.border-width': '--pdf-editor-root-border-width',
    'root.color-error': '--pdf-editor-root-color-error',
    'root.background-color-error': '--pdf-editor-root-background-color-error',
    'toolbar.background': '--pdf-editor-toolbar-background',
    'toolbar.min-height': '--pdf-editor-toolbar-min-height',
    'toolbar.padding': '--pdf-editor-toolbar-padding',
    'toolbar.gap': '--pdf-editor-toolbar-gap',
    'toolbar.file-name.min-width': '--pdf-editor-toolbar-file-name-min-width',
    'toolbar.icon.width': '--pdf-editor-toolbar-icon-width',
    'toolbar.icon.color': '--pdf-editor-toolbar-icon-color',
    'toolbar.icon.background-color-hover': '--pdf-editor-toolbar-icon-background-color-hover',
    'toolbar.icon.background-color-focus': '--pdf-editor-toolbar-icon-background-color-focus',
    'toolbar.icon.background-color-pressed': '--pdf-editor-toolbar-icon-background-color-pressed',
    'toolbar.target.width': '--pdf-editor-toolbar-target-width',
    'objects.height': '--pdf-editor-objects-height',
    'objects.max-height': '--pdf-editor-objects-max-height',
    'objects.gap': '--pdf-editor-objects-gap',
    'objects.font-size': '--pdf-editor-objects-font-size',
    'objects.line-height': '--pdf-editor-objects-line-height',
    'objects.icon.width': '--pdf-editor-objects-icon-width',
    'panel.width': '--pdf-editor-panel-width',
    'panel.properties.width': '--pdf-editor-panel-properties-width',
    'panel.padding': '--pdf-editor-panel-padding',
    'panel.gap': '--pdf-editor-panel-gap',
    'panel.scroll.padding': '--pdf-editor-panel-scroll-padding',
    'panel.scrollbar-color': '--pdf-editor-panel-scrollbar-color',
    'panel.heading.font-size': '--pdf-editor-panel-heading-font-size',
    'panel.heading.font-weight': '--pdf-editor-panel-heading-font-weight',
    'canvas.background': '--pdf-editor-canvas-background',
    'canvas.paper.background-color': '--pdf-editor-canvas-paper-background-color',
    'canvas.padding': '--pdf-editor-canvas-padding',
    'selection.color': '--pdf-editor-selection-color',
    'selection.background': '--pdf-editor-selection-background',
    'selection.border-width': '--pdf-editor-selection-border-width',
    'status.color': '--pdf-editor-status-color',
    'status.font-size': '--pdf-editor-status-font-size',
    'status.padding-block': '--pdf-editor-status-padding-block',
    'status.zoom.width': '--pdf-editor-status-zoom-width',
    'status.zoom.height': '--pdf-editor-status-zoom-height',
    'status.zoom.font-size': '--pdf-editor-status-zoom-font-size',
    'status.zoom.line-height': '--pdf-editor-status-zoom-line-height',
    'thumbnail.height': '--pdf-editor-thumbnail-height',
    'thumbnail.drop.height': '--pdf-editor-thumbnail-drop-height',
    'thumbnail.drop.background-color': '--pdf-editor-thumbnail-drop-background-color',
    'thumbnail.background-color-dragging': '--pdf-editor-thumbnail-background-color-dragging',
    'thumbnail.image.width': '--pdf-editor-thumbnail-image-width',
    'thumbnail.image.height': '--pdf-editor-thumbnail-image-height',
    'demo.panel.width': '--pdf-editor-demo-panel-width',
    'demo.editor.height': '--pdf-editor-demo-editor-height',
    'demo.preview.height': '--pdf-editor-demo-preview-height',
    'demo.title.font-size': '--pdf-editor-demo-title-font-size'
});

const token = defineTokens({
    'root': {
        'background': `var(${vars['root.background']}, var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`,
        'color': `var(${vars['root.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'font-family': `var(${vars['root.font-family']}, var(--token-semantic-font-family-body, var(--token-global-font-family-material, 'Roboto', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei UI', sans-serif)))`,
        'font-size': `var(${vars['root.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-md, 16px)))`,
        'line-height': `var(${vars['root.line-height']}, var(--token-semantic-font-line-height-body, var(--token-global-line-height-normal, 1.5)))`,
        'height': `var(${vars['root.height']}, min(800px, 85vh))`,
        'min-height': `var(${vars['root.min-height']}, 480px)`,
        'border-radius': `var(${vars['root.border-radius']}, var(--token-semantic-radius-lg, var(--token-global-radius-6, 12px)))`,
        'border-color': `var(${vars['root.border-color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`,
        'border-width': `var(${vars['root.border-width']}, 1px)`,
        'color-error': `var(${vars['root.color-error']}, var(--token-semantic-color-feedback-error-text, var(--token-global-material-error-10, oklch(0.25390329 0.07937181 27.605486))))`,
        'background-color-error': `var(${vars['root.background-color-error']}, var(--token-semantic-color-surface-container, var(--token-global-material-neutral-94, oklch(0.95362610 0.01470533 312.243326))))`
    },
    'toolbar': {
        'background': `var(${vars['toolbar.background']}, var(--token-semantic-color-surface-container, var(--token-global-material-neutral-94, oklch(0.95362610 0.01470533 312.243326))))`,
        'min-height': `var(${vars['toolbar.min-height']}, var(--token-semantic-size-64, var(--token-global-size-64, 64px)))`,
        'padding': `var(${vars['toolbar.padding']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`,
        'gap': `var(${vars['toolbar.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'file-name': {
            'min-width': `var(${vars['toolbar.file-name.min-width']}, var(--token-semantic-size-96, var(--token-global-size-96, 96px)))`
        },
        'icon': {
            'width': `var(${vars['toolbar.icon.width']}, var(--token-semantic-space-group-gap, var(--token-global-space-6, 24px)))`,
            'color': `var(${vars['toolbar.icon.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
            'background-color-hover': `var(${vars['toolbar.icon.background-color-hover']}, color-mix(in oklch, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), transparent))`,
            'background-color-focus': `var(${vars['toolbar.icon.background-color-focus']}, color-mix(in oklch, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))) calc(var(--token-semantic-state-opacity-focus, var(--token-global-opacity-12, 0.12)) * 100%), transparent))`,
            'background-color-pressed': `var(${vars['toolbar.icon.background-color-pressed']}, color-mix(in oklch, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))) calc(var(--token-semantic-state-opacity-pressed, var(--token-global-opacity-12, 0.12)) * 100%), transparent))`
        },
        'target': {
            'width': `var(${vars['toolbar.target.width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
        }
    },
    'objects': {
        'height': `var(${vars['objects.height']}, calc(var(--token-semantic-size-40, var(--token-global-size-40, 40px)) * 4))`,
        'max-height': `var(${vars['objects.max-height']}, 40%)`,
        'gap': `var(${vars['objects.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'font-size': `var(${vars['objects.font-size']}, var(--token-semantic-typography-body-medium-font-size, var(--token-global-font-size-sm, 14px)))`,
        'line-height': `var(${vars['objects.line-height']}, var(--token-semantic-typography-body-medium-line-height, var(--token-global-line-height-14-20, 1.4285714285714286)))`,
        'icon': {
            'width': `var(${vars['objects.icon.width']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`
        }
    },
    'panel': {
        'width': `var(${vars['panel.width']}, 240px)`,
        'properties': {
            'width': `var(${vars['panel.properties.width']}, 280px)`
        },
        'padding': `var(${vars['panel.padding']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`,
        'gap': `var(${vars['panel.gap']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`,
        'scroll': {
            'padding': `var(${vars['panel.scroll.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`
        },
        'scrollbar-color': `var(${vars['panel.scrollbar-color']}, color-mix(in oklch, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))) 50%, transparent))`,
        'heading': {
            'font-size': `var(${vars['panel.heading.font-size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`,
            'font-weight': `var(${vars['panel.heading.font-weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`
        }
    },
    'canvas': {
        'background': `var(${vars['canvas.background']}, var(--token-semantic-color-surface-overlay, var(--token-global-material-neutral-92, oklch(0.93250577 0.01478797 312.240074))))`,
        'paper': {
            'background-color': `var(${vars['canvas.paper.background-color']}, oklch(1 0 0))`
        },
        'padding': `var(${vars['canvas.padding']}, var(--token-semantic-space-page-padding, var(--token-global-space-6, 24px)))`
    },
    'selection': {
        'color': `var(${vars['selection.color']}, var(--token-semantic-color-selection-border, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'background': `var(${vars['selection.background']}, color-mix(in oklch, var(--token-semantic-color-selection-border, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))) 12%, transparent))`,
        'border-width': `var(${vars['selection.border-width']}, 2px)`
    },
    'status': {
        'color': `var(${vars['status.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'font-size': `var(${vars['status.font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`,
        'padding-block': `var(${vars['status.padding-block']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'zoom': {
            'width': `var(${vars['status.zoom.width']}, calc(var(--token-semantic-size-64, var(--token-global-size-64, 64px)) + var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px))))`,
            'height': `var(${vars['status.zoom.height']}, var(--token-semantic-size-32, var(--token-global-size-32, 32px)))`,
            'font-size': `var(${vars['status.zoom.font-size']}, var(--token-semantic-typography-label-large-font-size, var(--token-global-font-size-sm, 14px)))`,
            'line-height': `var(${vars['status.zoom.line-height']}, calc(var(--token-semantic-typography-label-large-font-size, var(--token-global-font-size-sm, 14px)) * var(--token-semantic-typography-label-large-line-height, var(--token-global-line-height-14-20, 1.4285714285714286))))`
        }
    },
    'thumbnail': {
        'height': `var(${vars['thumbnail.height']}, 200px)`,
        'drop': {
            'height': `var(${vars['thumbnail.drop.height']}, 2px)`,
            'background-color': `var(${vars['thumbnail.drop.background-color']}, var(--token-semantic-color-selection-border, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`
        },
        'background-color-dragging': `var(${vars['thumbnail.background-color-dragging']}, var(--token-semantic-color-state-dragged, color-mix(in oklch, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))) calc(var(--token-semantic-state-opacity-dragged, var(--token-global-opacity-16, 0.16)) * 100%), transparent)))`,
        'image': {
            'width': `var(${vars['thumbnail.image.width']}, 160px)`,
            'height': `var(${vars['thumbnail.image.height']}, 152px)`
        }
    },
    'demo': {
        'panel': {
            'width': `var(${vars['demo.panel.width']}, 320px)`
        },
        'editor': {
            'height': `var(${vars['demo.editor.height']}, 640px)`
        },
        'preview': {
            'height': `var(${vars['demo.preview.height']}, 320px)`
        },
        'title': {
            'font-size': `var(${vars['demo.title.font-size']}, var(--token-semantic-typography-headline-small-font-size, var(--token-global-font-size-2xl, 24px)))`
        }
    }
});

export default token;
