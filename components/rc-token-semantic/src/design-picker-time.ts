import { defineTokens } from '@crab-dev/css';
import palette from '@crab-dev/rc-token-global';
import token from './token.js';

/** Compact Web time-input geometry; the dial's domain coordinates stay unchanged. */
export interface DesktopTimePickerContract {
    readonly input: Readonly<Record<'width' | 'height' | 'font-size' | 'font-weight' | 'line-height', string>>;
    readonly 'dial-field': Readonly<Record<'width' | 'width-24h' | 'height' | 'font-size' | 'line-height', string>>;
    readonly period: Readonly<Record<'width' | 'horizontal-width' | 'horizontal-height', string>>;
}
export const desktopTimePickerContract: DesktopTimePickerContract = defineTokens({
    input: {
        width: palette.size[64],
        height: palette.size[48],
        'font-size': token.typography.title.large['font-size'],
        'font-weight': token.typography.title.large['font-weight'],
        'line-height': token.typography.title.large['line-height'],
    },
    'dial-field': {
        width: `calc(${palette.size[64]} + ${palette.space[2]})`,
        'width-24h': `calc(${palette.size[64]} + ${palette.space[6]})`,
        height: palette.size[56],
        'font-size': token.typography.headline.small['font-size'],
        'line-height': token.typography.headline.small['line-height'],
    },
    period: {
        width: palette.size[48],
        'horizontal-width': `calc(${palette.size[64]} * 2 + ${palette.space[6]})`,
        'horizontal-height': palette.size[32],
    },
});
