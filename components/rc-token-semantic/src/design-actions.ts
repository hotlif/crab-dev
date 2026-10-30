import palette from '@crab-dev/rc-token-global';
import { defineTokens } from '@crab-dev/css';

/** L2 desktop action extensions. MD3 defaults are authored only in token.toml. */
export const designActionContract: Record<'apple' | 'shadcn', ActionSizes> = defineTokens({
    apple: {
        xs: {
            height: palette['space']['6'],
            'padding-inline': palette['space']['2'],
            'font-size': palette['font']['size']['xs'],
            'line-height': palette['space']['4'],
            gap: palette['space']['1'],
            icon: palette['space']['3'],
            'square-radius': palette['radius']['3'],
            'pressed-radius': palette['radius']['3'],
            'border-width': palette['space']['px'],
        },
        s: {
            height: palette['space']['7'],
            'padding-inline': palette['space']['3'],
            'font-size': palette['font']['size']['sm'],
            'line-height': palette['space']['5'],
            gap: palette['space']['1-5'],
            icon: palette['space']['3-5'],
            'square-radius': palette['radius']['3'],
            'pressed-radius': palette['radius']['3'],
            'border-width': palette['space']['px'],
        },
        m: {
            height: palette['size']['32'],
            'padding-inline': palette['space']['4'],
            'font-size': palette['font']['size']['sm'],
            'line-height': palette['space']['5'],
            gap: palette['space']['1-5'],
            icon: palette['space']['4'],
            'square-radius': palette['radius']['3'],
            'pressed-radius': palette['radius']['3'],
            'border-width': palette['space']['px'],
        },
        l: {
            height: palette['size']['40'],
            'padding-inline': palette['space']['5'],
            'font-size': palette['font']['size']['md'],
            'line-height': palette['space']['6'],
            gap: palette['space']['2'],
            icon: palette['space']['5'],
            'square-radius': palette['radius']['3'],
            'pressed-radius': palette['radius']['3'],
            'border-width': palette['space']['px'],
        },
        xl: {
            height: palette['size']['48'],
            'padding-inline': palette['space']['6'],
            'font-size': palette['font']['size']['lg'],
            'line-height': palette['space']['6'],
            gap: palette['space']['2'],
            icon: palette['space']['6'],
            'square-radius': palette['radius']['3'],
            'pressed-radius': palette['radius']['3'],
            'border-width': palette['space']['px'],
        },
    },
    shadcn: {
        xs: {
            height: palette['size']['32'],
            'padding-inline': palette['space']['3'],
            'font-size': palette['font']['size']['sm'],
            'line-height': palette['space']['5'],
            gap: palette['space']['1-5'],
            icon: palette['space']['4'],
            'square-radius': palette['radius']['4'],
            'pressed-radius': palette['radius']['4'],
            'border-width': palette['space']['px'],
        },
        s: {
            height: palette['size']['36'],
            'padding-inline': palette['space']['4'],
            'font-size': palette['font']['size']['sm'],
            'line-height': palette['space']['5'],
            gap: palette['space']['2'],
            icon: palette['space']['4'],
            'square-radius': palette['radius']['4'],
            'pressed-radius': palette['radius']['4'],
            'border-width': palette['space']['px'],
        },
        m: {
            height: palette['size']['40'],
            'padding-inline': palette['space']['6'],
            'font-size': palette['font']['size']['sm'],
            'line-height': palette['space']['5'],
            gap: palette['space']['2'],
            icon: palette['space']['4'],
            'square-radius': palette['radius']['4'],
            'pressed-radius': palette['radius']['4'],
            'border-width': palette['space']['px'],
        },
        l: {
            height: palette['size']['48'],
            'padding-inline': palette['space']['6'],
            'font-size': palette['font']['size']['md'],
            'line-height': palette['space']['6'],
            gap: palette['space']['2'],
            icon: palette['space']['5'],
            'square-radius': palette['radius']['4'],
            'pressed-radius': palette['radius']['4'],
            'border-width': palette['space']['px'],
        },
        xl: {
            height: palette['size']['56'],
            'padding-inline': palette['space']['8'],
            'font-size': palette['font']['size']['lg'],
            'line-height': palette['space']['6'],
            gap: palette['space']['2'],
            icon: palette['space']['6'],
            'square-radius': palette['radius']['4'],
            'pressed-radius': palette['radius']['4'],
            'border-width': palette['space']['px'],
        },
    },
});

export type ActionSize = 'xs' | 's' | 'm' | 'l' | 'xl';
export type ActionGeometry = Record<
    | 'height'
    | 'padding-inline'
    | 'font-size'
    | 'line-height'
    | 'gap'
    | 'icon'
    | 'square-radius'
    | 'pressed-radius'
    | 'border-width',
    string
>;
export type ActionSizes = Record<ActionSize, ActionGeometry>;
