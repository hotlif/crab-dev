import { css, cx } from '@crab-dev/css';
import type { Ref } from 'react';
import type { ProseProps, ProseSize } from './types.js';
import token from './token.js';
import { invertStyle, baseStyle } from "./prose.styles.js";
// ── 尺寸变体 ────────────────────────────────────────────────────────────────

const sizeStyles: Record<ProseSize, string> = {
    sm: css`
        font-size: 0.875rem;
        line-height: 1.5714;

        & :where(p):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.7143em;
            margin-bottom: 0.7143em;
        }

        & :where([class~="lead"]):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.2857em;
            line-height: 1.45;
            margin-top: 0.7143em;
            margin-bottom: 0.7143em;
        }

        & :where(blockquote):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8571em;
            margin-bottom: 0.8571em;
            padding-inline-start: 0.8571em;
        }

        & :where(h1):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.8571em;
            margin-top: 0;
            margin-bottom: 0.4286em;
            line-height: 1.2;
        }

        & :where(h2):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.2857em;
            margin-top: 1.1429em;
            margin-bottom: 0.4286em;
            line-height: 1.35;
        }

        & :where(h3):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.1429em;
            margin-top: 0.8571em;
            margin-bottom: 0.2857em;
            line-height: 1.45;
        }

        & :where(h4):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.7143em;
            margin-bottom: 0.2143em;
            line-height: 1.45;
        }

        & :where(img):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
        }

        & :where(picture):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
        }

        & :where(picture > img):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
            margin-bottom: 0;
        }

        & :where(video):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
        }

        & :where(kbd):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8571em;
            border-radius: 0.3125rem;
            padding-top: 0.1429em;
            padding-inline-end: 0.3571em;
            padding-bottom: 0.1429em;
            padding-inline-start: 0.3571em;
        }

        & :where(code):not(:where(pre code, [class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8571em;
            padding: 0.0714em 0.2143em;
        }

        & :where(h2 code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.9em;
        }

        & :where(h3 code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8889em;
        }

        & :where(pre):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8571em;
            line-height: 1.6;
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
            border-radius: 0.25rem;
            padding-top: 0.5714em;
            padding-inline-end: 0.8571em;
            padding-bottom: 0.5714em;
            padding-inline-start: 0.8571em;
        }

        & :where(ol):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.7143em;
            margin-bottom: 0.7143em;
            padding-inline-start: 1.4286em;
        }

        & :where(ul):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.7143em;
            margin-bottom: 0.7143em;
            padding-inline-start: 1.4286em;
        }

        & :where(li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.1429em;
            margin-bottom: 0.1429em;
        }

        & :where(ol > li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding-inline-start: 0.4286em;
        }

        & :where(ul > li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding-inline-start: 0.4286em;
        }

        & > :where(ul) > :where(li) :where(p):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.4286em;
            margin-bottom: 0.4286em;
        }

        & > :where(ul) > :where(li) > :where(p:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.7143em;
        }

        & > :where(ul) > :where(li) > :where(p:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0.7143em;
        }

        & > :where(ol) > :where(li) > :where(p:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.7143em;
        }

        & > :where(ol) > :where(li) > :where(p:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0.7143em;
        }

        & :where(ul ul):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ul ol):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ol ul):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ol ol):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.4286em;
            margin-bottom: 0.4286em;
        }

        & :where(dl):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.7143em;
            margin-bottom: 0.7143em;
        }

        & :where(dt):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.7143em;
        }

        & :where(dd):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.2857em;
            padding-inline-start: 1.4286em;
        }

        & :where(hr):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 2em;
            margin-bottom: 2em;
        }

        & :where(hr + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h2 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h3 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h4 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(table):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8571em;
            line-height: 1.5;
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
        }

        & :where(thead th):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding: 0.6667em 0.8em;
        }

        & :where(tbody td):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(tfoot td):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding: 0.6667em 0.8em;
        }

        & :where(figure):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
        }

        & :where(figcaption):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8571em;
            line-height: 1.3333;
            margin-top: 0.6667em;
        }

        & > :where(:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & > :where(:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0;
        }
    `,

    base: css`
        font-size: ${token.body['font-size']};
        line-height: ${token.body['line-height']};

        & :where(p):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8em;
            margin-bottom: 0.8em;
        }

        & :where([class~="lead"]):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.2em;
            line-height: 1.5;
            margin-top: 0.8em;
            margin-bottom: 0.8em;
        }

        & :where(blockquote):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1em;
            margin-bottom: 1em;
        }

        & :where(h1):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: ${token.h1['font-size']};
            margin-top: 0;
            margin-bottom: 0.5em;
            line-height: ${token.h1['line-height']};
        }

        & :where(h2):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: ${token.h2['font-size']};
            margin-top: 1.4em;
            margin-bottom: 0.4em;
            line-height: ${token.h2['line-height']};
        }

        & :where(h3):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: ${token.h3['font-size']};
            margin-top: 1.2em;
            margin-bottom: 0.35em;
            line-height: ${token.h3['line-height']};
        }

        & :where(h4):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1em;
            margin-bottom: 0.3em;
            line-height: ${token.h4['line-height']};
            font-size: ${token.h4['font-size']};
        }

        & :where(img):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1em;
            margin-bottom: 1em;
        }

        & :where(picture):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1em;
            margin-bottom: 1em;
        }

        & :where(picture > img):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
            margin-bottom: 0;
        }

        & :where(video):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1em;
            margin-bottom: 1em;
        }

        & :where(kbd):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.875em;
            border-radius: 0.3125rem;
            padding-top: 0.1875em;
            padding-inline-end: 0.375em;
            padding-bottom: 0.1875em;
            padding-inline-start: 0.375em;
        }

        & :where(code):not(:where(pre code, [class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.875em;
            padding: 0.1em 0.32em;
        }

        & :where(h2 code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.875em;
        }

        & :where(h3 code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.9em;
        }

        & :where(pre):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.875em;
            line-height: 1.6;
            margin-top: 1em;
            margin-bottom: 1em;
            border-radius: 0.5rem;
            padding-top: 0.875em;
            padding-inline-end: 1.125em;
            padding-bottom: 0.875em;
            padding-inline-start: 1.125em;
        }

        & :where(ol):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.65em;
            margin-bottom: 0.65em;
            padding-inline-start: 1.4em;
        }

        & :where(ul):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.65em;
            margin-bottom: 0.65em;
            padding-inline-start: 1.4em;
        }

        & :where(li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.35em;
            margin-bottom: 0.35em;
        }

        & :where(ol > li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding-inline-start: 0.375em;
        }

        & :where(ul > li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding-inline-start: 0.375em;
        }

        & > :where(ul) > :where(li) :where(p):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.42em;
            margin-bottom: 0.42em;
        }

        & > :where(ul) > :where(li) > :where(p:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.65em;
        }

        & > :where(ul) > :where(li) > :where(p:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0.65em;
        }

        & > :where(ol) > :where(li) > :where(p:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.65em;
        }

        & > :where(ol) > :where(li) > :where(p:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0.65em;
        }

        & :where(ul ul):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ul ol):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ol ul):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ol ol):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.42em;
            margin-bottom: 0.42em;
        }

        & :where(dl):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.65em;
            margin-bottom: 0.65em;
        }

        & :where(dt):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.65em;
        }

        & :where(dd):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.375em;
            padding-inline-start: 1.4em;
        }

        & :where(hr):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        & :where(hr + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h2 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h3 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h4 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(table):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.875em;
            line-height: 1.6;
            margin-top: 1em;
            margin-bottom: 1em;
        }

        & :where(thead th):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding: 0.5714em 0.75em;
        }

        & :where(tbody td):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(tfoot td):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding: 0.5714em 0.75em;
        }

        & :where(figure):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1em;
            margin-bottom: 1em;
        }

        & :where(figcaption):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.875em;
            line-height: 1.4286;
            margin-top: 0.55em;
        }

        & > :where(:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & > :where(:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0;
        }
    `,

    lg: css`
        font-size: 1.125rem;
        line-height: 1.6667;

        & :where(p):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8889em;
            margin-bottom: 0.8889em;
        }

        & :where([class~="lead"]):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.2222em;
            line-height: 1.45;
            margin-top: 0.8889em;
            margin-bottom: 0.8889em;
        }

        & :where(blockquote):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.1111em;
            margin-bottom: 1.1111em;
            padding-inline-start: 1em;
        }

        & :where(h1):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 2.2222em;
            margin-top: 0;
            margin-bottom: 0.5556em;
            line-height: 1.1;
        }

        & :where(h2):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.4444em;
            margin-top: 1.3333em;
            margin-bottom: 0.5556em;
            line-height: 1.3;
        }

        & :where(h3):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.2222em;
            margin-top: 1.1111em;
            margin-bottom: 0.4444em;
            line-height: 1.45;
        }

        & :where(h4):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1em;
            margin-bottom: 0.3333em;
            line-height: 1.45;
        }

        & :where(img):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
        }

        & :where(picture):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
        }

        & :where(picture > img):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
            margin-bottom: 0;
        }

        & :where(video):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
        }

        & :where(kbd):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8889em;
            border-radius: 0.3125rem;
            padding-top: 0.2222em;
            padding-inline-end: 0.4444em;
            padding-bottom: 0.2222em;
            padding-inline-start: 0.4444em;
        }

        & :where(code):not(:where(pre code, [class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8889em;
            padding: 0.1111em 0.2778em;
        }

        & :where(h2 code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8667em;
        }

        & :where(h3 code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.875em;
        }

        & :where(pre):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8889em;
            line-height: 1.65;
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
            border-radius: 0.375rem;
            padding-top: 0.8889em;
            padding-inline-end: 1.3333em;
            padding-bottom: 0.8889em;
            padding-inline-start: 1.3333em;
        }

        & :where(ol):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8889em;
            margin-bottom: 0.8889em;
            padding-inline-start: 1.5556em;
        }

        & :where(ul):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8889em;
            margin-bottom: 0.8889em;
            padding-inline-start: 1.5556em;
        }

        & :where(li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.3333em;
            margin-bottom: 0.3333em;
        }

        & :where(ol > li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding-inline-start: 0.4444em;
        }

        & :where(ul > li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding-inline-start: 0.4444em;
        }

        & > :where(ul) > :where(li) :where(p):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.6667em;
            margin-bottom: 0.6667em;
        }

        & > :where(ul) > :where(li) > :where(p:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8889em;
        }

        & > :where(ul) > :where(li) > :where(p:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0.8889em;
        }

        & > :where(ol) > :where(li) > :where(p:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8889em;
        }

        & > :where(ol) > :where(li) > :where(p:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0.8889em;
        }

        & :where(ul ul):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ul ol):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ol ul):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ol ol):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.5556em;
            margin-bottom: 0.5556em;
        }

        & :where(dl):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8889em;
            margin-bottom: 0.8889em;
        }

        & :where(dt):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8889em;
        }

        & :where(dd):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.4444em;
            padding-inline-start: 1.5556em;
        }

        & :where(hr):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 2em;
            margin-bottom: 2em;
        }

        & :where(hr + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h2 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h3 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h4 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(table):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8889em;
            line-height: 1.5;
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
        }

        & :where(thead th):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding: 0.75em 0.875em;
        }

        & :where(tbody td):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(tfoot td):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding: 0.75em 0.875em;
        }

        & :where(figure):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
        }

        & :where(figcaption):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8889em;
            line-height: 1.5;
            margin-top: 0.75em;
        }

        & > :where(:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & > :where(:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0;
        }
    `,

    xl: css`
        font-size: 1.25rem;
        line-height: 1.65;

        & :where(p):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8em;
            margin-bottom: 0.8em;
        }

        & :where([class~="lead"]):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.15em;
            line-height: 1.45;
            margin-top: 0.8em;
            margin-bottom: 0.8em;
        }

        & :where(blockquote):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.1em;
            margin-bottom: 1.1em;
            padding-inline-start: 1em;
        }

        & :where(h1):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 2.2em;
            margin-top: 0;
            margin-bottom: 0.6em;
            line-height: 1.05;
        }

        & :where(h2):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.5em;
            margin-top: 1.3em;
            margin-bottom: 0.55em;
            line-height: 1.2;
        }

        & :where(h3):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.25em;
            margin-top: 1.1em;
            margin-bottom: 0.45em;
            line-height: 1.35;
        }

        & :where(h4):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1em;
            margin-bottom: 0.35em;
            line-height: 1.5;
        }

        & :where(img):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        & :where(picture):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        & :where(picture > img):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
            margin-bottom: 0;
        }

        & :where(video):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        & :where(kbd):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.9em;
            border-radius: 0.3125rem;
            padding-top: 0.25em;
            padding-inline-end: 0.4em;
            padding-bottom: 0.25em;
            padding-inline-start: 0.4em;
        }

        & :where(code):not(:where(pre code, [class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.9em;
            padding: 0.1em 0.25em;
        }

        & :where(h2 code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8611em;
        }

        & :where(h3 code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.9em;
        }

        & :where(pre):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.9em;
            line-height: 1.65;
            margin-top: 1.4em;
            margin-bottom: 1.4em;
            border-radius: 0.5rem;
            padding-top: 1em;
            padding-inline-end: 1.25em;
            padding-bottom: 1em;
            padding-inline-start: 1.25em;
        }

        & :where(ol):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8em;
            margin-bottom: 0.8em;
            padding-inline-start: 1.5em;
        }

        & :where(ul):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8em;
            margin-bottom: 0.8em;
            padding-inline-start: 1.5em;
        }

        & :where(li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.3em;
            margin-bottom: 0.3em;
        }

        & :where(ol > li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding-inline-start: 0.4em;
        }

        & :where(ul > li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding-inline-start: 0.4em;
        }

        & > :where(ul) > :where(li) :where(p):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.6em;
            margin-bottom: 0.6em;
        }

        & > :where(ul) > :where(li) > :where(p:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8em;
        }

        & > :where(ul) > :where(li) > :where(p:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0.8em;
        }

        & > :where(ol) > :where(li) > :where(p:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8em;
        }

        & > :where(ol) > :where(li) > :where(p:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0.8em;
        }

        & :where(ul ul):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ul ol):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ol ul):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ol ol):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.6em;
            margin-bottom: 0.6em;
        }

        & :where(dl):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8em;
            margin-bottom: 0.8em;
        }

        & :where(dt):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8em;
        }

        & :where(dd):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.45em;
            padding-inline-start: 1.5em;
        }

        & :where(hr):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 2em;
            margin-bottom: 2em;
        }

        & :where(hr + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h2 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h3 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h4 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(table):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.9em;
            line-height: 1.5;
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        & :where(thead th):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding: 0.8em 0.875em;
        }

        & :where(tbody td):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(tfoot td):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding: 0.8em 0.875em;
        }

        & :where(figure):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        & :where(figcaption):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.9em;
            line-height: 1.5556;
            margin-top: 0.8em;
        }

        & > :where(:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & > :where(:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0;
        }
    `,
};

// ── 组件 ──────────────────────────────────────────────────────────────────────

function Prose({
    size = 'base',
    invert = false,
    as: Tag = 'div',
    className,
    children,
    ref,
    ...rest
}: ProseProps) {
    return (
        <Tag
            ref={ref as Ref<HTMLDivElement>}
            className={cx(
                baseStyle,
                sizeStyles[size],
                invert && invertStyle,
                className,
            )}
            {...rest}
        >
            {children}
        </Tag>
    );
}

export default Prose;


