import { css } from '@crab-dev/css';
import token from '../token.js';

export const headerStyle = css`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--rc-card-gap, ${token.size.medium.gap});
    padding: var(--rc-card-pad, ${token.size.medium.padding});
    padding-bottom: 0;
`;

export const titleStyle = css`
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${token.header.title.color};
    font-size: var(--rc-card-title-size, ${token.size.medium.title['font-size']});
    font-weight: ${token.header.title['font-weight']};
    line-height: ${token.header.title['line-height']};
`;

export const extraStyle = css`
    flex-shrink: 0;
`;
