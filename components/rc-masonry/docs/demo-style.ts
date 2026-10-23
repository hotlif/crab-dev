import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';

export const itemStyle = css`
    box-sizing: border-box;
    border-radius: ${token.shape.card}; padding: ${token.space['card-padding']};
    border: 1px solid ${token.color.border.subtle};
    box-shadow: ${token.shadow.card};
    color: ${token.color.brand['on-container']}; background: ${token.color.brand.container};
    font-size: ${token.typography.body.medium['font-size']}; font-weight: ${token.typography.label['font-weight']};
    &:nth-child(3n + 2) { color: ${token.color.secondary['on-container']}; background: ${token.color.secondary.container}; }
    &:nth-child(3n) { color: ${token.color.tertiary['on-container']}; background: ${token.color.tertiary.container}; }
`;
export const heightStyles: Record<number, string> = {
    80: css`height: calc(${token.size[40]} * 2);`,
    90: css`height: calc(${token.size[40]} * 2.25);`,
    100: css`height: calc(${token.size[40]} * 2.5);`,
    110: css`height: calc(${token.size[40]} * 2.75);`,
    120: css`height: calc(${token.size[40]} * 3);`,
    140: css`height: calc(${token.size[40]} * 3.5);`,
    150: css`height: calc(${token.size[40]} * 3.75);`,
    160: css`height: calc(${token.size[40]} * 4);`,
    180: css`height: calc(${token.size[40]} * 4.5);`,
    200: css`height: calc(${token.size[40]} * 5);`,
};
export const controlStyle = css`margin-bottom: ${token.space['group-gap']}; max-width: calc(${token.size[40]} * 6);`;
