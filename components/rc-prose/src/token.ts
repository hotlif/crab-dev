/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.max-width': '--prose-root-max-width',
    'body.color': '--prose-body-color',
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
    'h2.font-weight': '--prose-h2-font-weight',
    'h3.font-weight': '--prose-h3-font-weight',
    'h4.font-weight': '--prose-h4-font-weight',
    'dt.font-weight': '--prose-dt-font-weight',
    'th.font-weight': '--prose-th-font-weight',
    'marker.font-weight': '--prose-marker-font-weight'
});

const token = defineTokens({
    'root': {
        'max-width': `var(${vars['root.max-width']}, var(--prose-max-width, 100%))`
    },
    'body': {
        'color': `var(${vars['body.color']}, var(--prose-body, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286)))))`
    },
    'heading': {
        'color': `var(${vars['heading.color']}, var(--prose-headings, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286)))))`
    },
    'lead': {
        'color': `var(${vars['lead.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`
    },
    'link': {
        'color': `var(${vars['link.color']}, var(--prose-links, var(--token-semantic-color-text-link, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'color-hover': `var(${vars['link.color-hover']}, var(--prose-links-hover, var(--token-semantic-color-text-link-hover, var(--token-global-purple-30, oklch(0.41029262 0.13369038 292.705951)))))`
    },
    'strong': {
        'color': `var(${vars['strong.color']}, var(--prose-bold, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286)))))`,
        'font-weight': `var(${vars['strong.font-weight']}, var(--token-semantic-font-weight-strong, var(--token-global-font-weight-bold, 700)))`
    },
    'list': {
        'counter': {
            'color': `var(${vars['list.counter.color']}, var(--prose-counters, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286)))))`
        },
        'bullet': {
            'color': `var(${vars['list.bullet.color']}, var(--prose-bullets, var(--token-semantic-color-border-hover, var(--token-global-zinc-700, oklch(0.430 0.012 286)))))`
        }
    },
    'hr': {
        'border-color': `var(${vars['hr.border-color']}, var(--prose-hr-color, var(--token-semantic-color-border-default, var(--token-global-zinc-600, oklch(0.550 0.014 286)))))`
    },
    'blockquote': {
        'color': `var(${vars['blockquote.color']}, var(--prose-quotes, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286)))))`,
        'border-color': `var(${vars['blockquote.border-color']}, var(--prose-quote-borders, var(--token-semantic-color-border-default, var(--token-global-zinc-600, oklch(0.550 0.014 286)))))`,
        'font-weight': `var(${vars['blockquote.font-weight']}, var(--token-semantic-font-weight-body, var(--token-global-font-weight-regular, 400)))`
    },
    'caption': {
        'color': `var(${vars['caption.color']}, var(--prose-captions, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286)))))`
    },
    'code': {
        'color': `var(${vars['code.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'background-color': `var(${vars['code.background-color']}, var(--prose-code-bg, var(--token-semantic-color-fill-subtle, var(--token-semantic-color-fill-inactive, var(--token-global-zinc-100, oklch(0.950 0.003 286))))))`,
        'font-weight': `var(${vars['code.font-weight']}, var(--token-semantic-font-weight-body, var(--token-global-font-weight-regular, 400)))`
    },
    'pre': {
        'color': `var(${vars['pre.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'background-color': `var(${vars['pre.background-color']}, var(--prose-pre-bg, var(--token-semantic-color-fill-subtle, var(--token-semantic-color-fill-inactive, var(--token-global-zinc-100, oklch(0.950 0.003 286))))))`,
        'font-weight': `var(${vars['pre.font-weight']}, var(--token-semantic-font-weight-body, var(--token-global-font-weight-regular, 400)))`
    },
    'kbd': {
        'color': `var(${vars['kbd.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'box-shadow': `var(${vars['kbd.box-shadow']}, var(--prose-kbd-shadows, 0 0 0 1px var(--token-semantic-color-border-strong, var(--token-semantic-color-border-hover, var(--token-global-zinc-700, oklch(0.430 0.012 286))))))`,
        'font-weight': `var(${vars['kbd.font-weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`
    },
    'table': {
        'heading': {
            'border-color': `var(${vars['table.heading.border-color']}, var(--prose-th-borders, var(--token-semantic-color-border-hover, var(--token-global-zinc-700, oklch(0.430 0.012 286)))))`,
            'background-color': `var(${vars['table.heading.background-color']}, var(--prose-thead-bg, var(--token-semantic-color-fill-subtle, var(--token-semantic-color-fill-inactive, var(--token-global-zinc-100, oklch(0.950 0.003 286))))))`
        },
        'cell': {
            'border-color': `var(${vars['table.cell.border-color']}, var(--prose-td-borders, var(--token-semantic-color-border-default, var(--token-global-zinc-600, oklch(0.550 0.014 286)))))`
        }
    },
    'inverse': {
        'body': {
            'color': `var(${vars['inverse.body.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))) 82%, transparent))`
        },
        'heading': {
            'color': `var(${vars['inverse.heading.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))) 92%, transparent))`
        },
        'lead': {
            'color': `var(${vars['inverse.lead.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))) 60%, transparent))`
        },
        'link': {
            'color': `var(${vars['inverse.link.color']}, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))))`,
            'color-hover': `var(${vars['inverse.link.color-hover']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))) 80%, transparent))`
        },
        'strong': {
            'color': `var(${vars['inverse.strong.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))) 92%, transparent))`
        },
        'list': {
            'counter': {
                'color': `var(${vars['inverse.list.counter.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))) 60%, transparent))`
            },
            'bullet': {
                'color': `var(${vars['inverse.list.bullet.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))) 60%, transparent))`
            }
        },
        'hr': {
            'border-color': `var(${vars['inverse.hr.border-color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))) 24%, transparent))`
        },
        'blockquote': {
            'color': `var(${vars['inverse.blockquote.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))) 85%, transparent))`,
            'border-color': `var(${vars['inverse.blockquote.border-color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))) 24%, transparent))`
        },
        'caption': {
            'color': `var(${vars['inverse.caption.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))) 60%, transparent))`
        },
        'code': {
            'color': `var(${vars['inverse.code.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))) 90%, transparent))`,
            'background-color': `var(${vars['inverse.code.background-color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))) 8%, transparent))`
        },
        'pre': {
            'color': `var(${vars['inverse.pre.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))) 75%, transparent))`,
            'background-color': `var(${vars['inverse.pre.background-color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))) 8%, transparent))`
        },
        'kbd': {
            'color': `var(${vars['inverse.kbd.color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))) 90%, transparent))`,
            'box-shadow': `var(${vars['inverse.kbd.box-shadow']}, 0 0 0 1px color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))) 45%, transparent))`
        },
        'table': {
            'heading': {
                'border-color': `var(${vars['inverse.table.heading.border-color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))) 15%, transparent))`,
                'background-color': `var(${vars['inverse.table.heading.background-color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))) 5%, transparent))`
            },
            'cell': {
                'border-color': `var(${vars['inverse.table.cell.border-color']}, color-mix(in oklch, var(--token-semantic-color-text-inverse, var(--token-global-zinc-50, oklch(0.980 0.002 286))) 8%, transparent))`
            }
        }
    },
    'a': {
        'font-weight': `var(${vars['a.font-weight']}, var(--token-semantic-font-weight-body, var(--token-global-font-weight-regular, 400)))`
    },
    'h1': {
        'font-weight': `var(${vars['h1.font-weight']}, 600)`
    },
    'h2': {
        'font-weight': `var(${vars['h2.font-weight']}, var(--token-semantic-font-weight-heading, var(--token-global-font-weight-semibold, 600)))`
    },
    'h3': {
        'font-weight': `var(${vars['h3.font-weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`
    },
    'h4': {
        'font-weight': `var(${vars['h4.font-weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`
    },
    'dt': {
        'font-weight': `var(${vars['dt.font-weight']}, var(--token-semantic-font-weight-heading, var(--token-global-font-weight-semibold, 600)))`
    },
    'th': {
        'font-weight': `var(${vars['th.font-weight']}, var(--token-semantic-font-weight-heading, var(--token-global-font-weight-semibold, 600)))`
    },
    'marker': {
        'font-weight': `var(${vars['marker.font-weight']}, var(--token-semantic-font-weight-body, var(--token-global-font-weight-regular, 400)))`
    }
});

export default token;
