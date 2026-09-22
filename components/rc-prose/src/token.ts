/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.max-width': '--prose-root-max-width',
    'body.color': '--prose-body-color',
    'body.font-family': '--prose-body-font-family',
    'body.font-size': '--prose-body-font-size',
    'body.line-height': '--prose-body-line-height',
    'heading.color': '--prose-heading-color',
    'lead.color': '--prose-lead-color',
    'link.color': '--prose-link-color',
    'link.color-hover': '--prose-link-color-hover',
    'strong.color': '--prose-strong-color',
    'strong.font-weight': '--prose-strong-font-weight',
    'list.counter.color': '--prose-list-counter-color',
    'list.bullet.color': '--prose-list-bullet-color',
    'hr.border-color': '--prose-hr-border-color',
    'blockquote.color': '--prose-blockquote-color',
    'blockquote.border-color': '--prose-blockquote-border-color',
    'blockquote.font-weight': '--prose-blockquote-font-weight',
    'caption.color': '--prose-caption-color',
    'code.color': '--prose-code-color',
    'code.background-color': '--prose-code-background-color',
    'code.font-weight': '--prose-code-font-weight',
    'pre.color': '--prose-pre-color',
    'pre.background-color': '--prose-pre-background-color',
    'pre.font-weight': '--prose-pre-font-weight',
    'kbd.color': '--prose-kbd-color',
    'kbd.box-shadow': '--prose-kbd-box-shadow',
    'kbd.font-weight': '--prose-kbd-font-weight',
    'table.heading.border-color': '--prose-table-heading-border-color',
    'table.heading.background-color': '--prose-table-heading-background-color',
    'table.cell.border-color': '--prose-table-cell-border-color',
    'inverse.body.color': '--prose-inverse-body-color',
    'inverse.heading.color': '--prose-inverse-heading-color',
    'inverse.lead.color': '--prose-inverse-lead-color',
    'inverse.link.color': '--prose-inverse-link-color',
    'inverse.link.color-hover': '--prose-inverse-link-color-hover',
    'inverse.strong.color': '--prose-inverse-strong-color',
    'inverse.list.counter.color': '--prose-inverse-list-counter-color',
    'inverse.list.bullet.color': '--prose-inverse-list-bullet-color',
    'inverse.hr.border-color': '--prose-inverse-hr-border-color',
    'inverse.blockquote.color': '--prose-inverse-blockquote-color',
    'inverse.blockquote.border-color': '--prose-inverse-blockquote-border-color',
    'inverse.caption.color': '--prose-inverse-caption-color',
    'inverse.code.color': '--prose-inverse-code-color',
    'inverse.code.background-color': '--prose-inverse-code-background-color',
    'inverse.pre.color': '--prose-inverse-pre-color',
    'inverse.pre.background-color': '--prose-inverse-pre-background-color',
    'inverse.kbd.color': '--prose-inverse-kbd-color',
    'inverse.kbd.box-shadow': '--prose-inverse-kbd-box-shadow',
    'inverse.table.heading.border-color': '--prose-inverse-table-heading-border-color',
    'inverse.table.heading.background-color': '--prose-inverse-table-heading-background-color',
    'inverse.table.cell.border-color': '--prose-inverse-table-cell-border-color',
    'a.font-weight': '--prose-a-font-weight',
    'h1.font-weight': '--prose-h1-font-weight',
    'h1.font-size': '--prose-h1-font-size',
    'h1.line-height': '--prose-h1-line-height',
    'h2.font-weight': '--prose-h2-font-weight',
    'h2.font-size': '--prose-h2-font-size',
    'h2.line-height': '--prose-h2-line-height',
    'h3.font-weight': '--prose-h3-font-weight',
    'h3.font-size': '--prose-h3-font-size',
    'h3.line-height': '--prose-h3-line-height',
    'h4.font-weight': '--prose-h4-font-weight',
    'h4.font-size': '--prose-h4-font-size',
    'h4.line-height': '--prose-h4-line-height',
    'dt.font-weight': '--prose-dt-font-weight',
    'th.font-weight': '--prose-th-font-weight',
    'marker.font-weight': '--prose-marker-font-weight'
});

const token = defineTokens({
    'root': {
        'max-width': `var(${vars['root.max-width']}, var(--prose-max-width, 100%))`
    },
    'body': {
        'color': `var(${vars['body.color']}, var(--prose-body, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)))))`,
        'font-family': `var(${vars['body.font-family']}, var(--token-semantic-typography-body-font-family, var(--token-global-font-family-material, 'Roboto', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei UI', sans-serif)))`,
        'font-size': `var(${vars['body.font-size']}, var(--token-semantic-typography-body-large-font-size, var(--token-global-font-size-md, 16px)))`,
        'line-height': `var(${vars['body.line-height']}, var(--token-semantic-typography-body-large-line-height, var(--token-global-line-height-16-24, 1.5)))`
    },
    'heading': {
        'color': `var(${vars['heading.color']}, var(--prose-headings, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)))))`
    },
    'lead': {
        'color': `var(${vars['lead.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`
    },
    'link': {
        'color': `var(${vars['link.color']}, var(--prose-links, var(--token-semantic-color-text-link, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'color-hover': `var(${vars['link.color-hover']}, var(--prose-links-hover, var(--token-semantic-color-text-link-hover, var(--token-global-purple-30, oklch(0.41029262 0.13369038 292.705951)))))`
    },
    'strong': {
        'color': `var(${vars['strong.color']}, var(--prose-bold, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)))))`,
        'font-weight': `var(${vars['strong.font-weight']}, var(--token-semantic-font-weight-strong, var(--token-global-font-weight-bold, 700)))`
    },
    'list': {
        'counter': {
            'color': `var(${vars['list.counter.color']}, var(--prose-counters, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936)))))`
        },
        'bullet': {
            'color': `var(${vars['list.bullet.color']}, var(--prose-bullets, var(--token-semantic-color-border-hover, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)))))`
        }
    },
    'hr': {
        'border-color': `var(${vars['hr.border-color']}, var(--prose-hr-color, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182)))))`
    },
    'blockquote': {
        'color': `var(${vars['blockquote.color']}, var(--prose-quotes, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)))))`,
        'border-color': `var(${vars['blockquote.border-color']}, var(--prose-quote-borders, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182)))))`,
        'font-weight': `var(${vars['blockquote.font-weight']}, var(--token-semantic-font-weight-body, var(--token-global-font-weight-regular, 400)))`
    },
    'caption': {
        'color': `var(${vars['caption.color']}, var(--prose-captions, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936)))))`
    },
    'code': {
        'color': `var(${vars['code.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'background-color': `var(${vars['code.background-color']}, var(--prose-code-bg, var(--token-semantic-color-fill-subtle, var(--token-semantic-color-fill-inactive, var(--token-global-zinc-100, oklch(0.950 0.003 286))))))`,
        'font-weight': `var(${vars['code.font-weight']}, var(--token-semantic-font-weight-body, var(--token-global-font-weight-regular, 400)))`
    },
    'pre': {
        'color': `var(${vars['pre.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'background-color': `var(${vars['pre.background-color']}, var(--prose-pre-bg, var(--token-semantic-color-fill-subtle, var(--token-semantic-color-fill-inactive, var(--token-global-zinc-100, oklch(0.950 0.003 286))))))`,
        'font-weight': `var(${vars['pre.font-weight']}, var(--token-semantic-font-weight-body, var(--token-global-font-weight-regular, 400)))`
    },
    'kbd': {
        'color': `var(${vars['kbd.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'box-shadow': `var(${vars['kbd.box-shadow']}, var(--prose-kbd-shadows, 0 0 0 1px var(--token-semantic-color-border-strong, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)))))`,
        'font-weight': `var(${vars['kbd.font-weight']}, var(--token-semantic-typography-label-font-weight, var(--token-global-font-weight-medium, 500)))`
    },
    'table': {
        'heading': {
            'border-color': `var(${vars['table.heading.border-color']}, var(--prose-th-borders, var(--token-semantic-color-border-hover, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)))))`,
            'background-color': `var(${vars['table.heading.background-color']}, var(--prose-thead-bg, var(--token-semantic-color-fill-subtle, var(--token-semantic-color-fill-inactive, var(--token-global-zinc-100, oklch(0.950 0.003 286))))))`
        },
        'cell': {
            'border-color': `var(${vars['table.cell.border-color']}, var(--prose-td-borders, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182)))))`
        }
    },
    'inverse': {
        'body': {
            'color': `var(${vars['inverse.body.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))) 82%, transparent))`
        },
        'heading': {
            'color': `var(${vars['inverse.heading.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))) 92%, transparent))`
        },
        'lead': {
            'color': `var(${vars['inverse.lead.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))) 60%, transparent))`
        },
        'link': {
            'color': `var(${vars['inverse.link.color']}, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))))`,
            'color-hover': `var(${vars['inverse.link.color-hover']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))) 80%, transparent))`
        },
        'strong': {
            'color': `var(${vars['inverse.strong.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))) 92%, transparent))`
        },
        'list': {
            'counter': {
                'color': `var(${vars['inverse.list.counter.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))) 60%, transparent))`
            },
            'bullet': {
                'color': `var(${vars['inverse.list.bullet.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))) 60%, transparent))`
            }
        },
        'hr': {
            'border-color': `var(${vars['inverse.hr.border-color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))) 24%, transparent))`
        },
        'blockquote': {
            'color': `var(${vars['inverse.blockquote.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))) 85%, transparent))`,
            'border-color': `var(${vars['inverse.blockquote.border-color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))) 24%, transparent))`
        },
        'caption': {
            'color': `var(${vars['inverse.caption.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))) 60%, transparent))`
        },
        'code': {
            'color': `var(${vars['inverse.code.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))) 90%, transparent))`,
            'background-color': `var(${vars['inverse.code.background-color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))) 8%, transparent))`
        },
        'pre': {
            'color': `var(${vars['inverse.pre.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))) 75%, transparent))`,
            'background-color': `var(${vars['inverse.pre.background-color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))) 8%, transparent))`
        },
        'kbd': {
            'color': `var(${vars['inverse.kbd.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))) 90%, transparent))`,
            'box-shadow': `var(${vars['inverse.kbd.box-shadow']}, 0 0 0 1px color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))) 45%, transparent))`
        },
        'table': {
            'heading': {
                'border-color': `var(${vars['inverse.table.heading.border-color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))) 15%, transparent))`,
                'background-color': `var(${vars['inverse.table.heading.background-color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))) 5%, transparent))`
            },
            'cell': {
                'border-color': `var(${vars['inverse.table.cell.border-color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))) 8%, transparent))`
            }
        }
    },
    'a': {
        'font-weight': `var(${vars['a.font-weight']}, var(--token-semantic-font-weight-body, var(--token-global-font-weight-regular, 400)))`
    },
    'h1': {
        'font-weight': `var(${vars['h1.font-weight']}, var(--token-semantic-typography-headline-large-emphasized-font-weight, var(--token-global-font-weight-medium, 500)))`,
        'font-size': `var(${vars['h1.font-size']}, var(--token-semantic-typography-headline-large-font-size, var(--token-global-font-size-4xl, 32px)))`,
        'line-height': `var(${vars['h1.line-height']}, var(--token-semantic-typography-headline-large-line-height, var(--token-global-line-height-32-40, 1.25)))`
    },
    'h2': {
        'font-weight': `var(${vars['h2.font-weight']}, var(--token-semantic-typography-title-font-weight, var(--token-global-font-weight-regular, 400)))`,
        'font-size': `var(${vars['h2.font-size']}, var(--token-semantic-typography-headline-small-font-size, var(--token-global-font-size-2xl, 24px)))`,
        'line-height': `var(${vars['h2.line-height']}, var(--token-semantic-typography-headline-small-line-height, var(--token-global-line-height-24-32, 1.3333333333333333)))`
    },
    'h3': {
        'font-weight': `var(${vars['h3.font-weight']}, var(--token-semantic-typography-label-font-weight, var(--token-global-font-weight-medium, 500)))`,
        'font-size': `var(${vars['h3.font-size']}, var(--token-semantic-typography-title-large-font-size, var(--token-global-font-size-22, 22px)))`,
        'line-height': `var(${vars['h3.line-height']}, var(--token-semantic-typography-title-large-line-height, var(--token-global-line-height-22-28, 1.2727272727272727)))`
    },
    'h4': {
        'font-weight': `var(${vars['h4.font-weight']}, var(--token-semantic-typography-label-font-weight, var(--token-global-font-weight-medium, 500)))`,
        'font-size': `var(${vars['h4.font-size']}, var(--token-semantic-typography-title-medium-font-size, var(--token-global-font-size-md, 16px)))`,
        'line-height': `var(${vars['h4.line-height']}, var(--token-semantic-typography-title-medium-line-height, var(--token-global-line-height-16-24, 1.5)))`
    },
    'dt': {
        'font-weight': `var(${vars['dt.font-weight']}, var(--token-semantic-typography-title-font-weight, var(--token-global-font-weight-regular, 400)))`
    },
    'th': {
        'font-weight': `var(${vars['th.font-weight']}, var(--token-semantic-typography-title-font-weight, var(--token-global-font-weight-regular, 400)))`
    },
    'marker': {
        'font-weight': `var(${vars['marker.font-weight']}, var(--token-semantic-font-weight-body, var(--token-global-font-weight-regular, 400)))`
    }
});

export default token;
