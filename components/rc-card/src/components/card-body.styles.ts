import { css } from '@crab-dev/css';
import token from '../token.js';

export const bodyStyle = css`
    flex: 1 1 auto;
    min-width: 0;
    overflow-wrap: anywhere;
    padding: var(--rc-card-pad, ${token.size.medium.padding});
    color: ${token.body.color};
    font-size: ${token.body['font-size']};
    line-height: ${token.body['line-height']};

    [data-card-header] + & {
        padding-top: var(--rc-card-gap, ${token.size.medium.gap});
    }
`;
