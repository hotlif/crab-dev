import { css } from '@crab-dev/css';
import token from '../token.js';

export const metaStyle = css`
    display: flex;
    align-items: flex-start;
    gap: ${token.meta.gap};
    min-width: 0;
`;

export const avatarStyle = css`
    flex-shrink: 0;
`;

export const textStyle = css`
    display: flex;
    flex-direction: column;
    /* Fill the remaining row so percentage-based loading slots have the same
       available width as the final title and description. */
    flex: 1 1 auto;
    gap: ${token.meta.text.gap};
    min-width: 0;
`;

export const titleStyle = css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${token.meta.title.color};
    font-size: ${token.meta.title['font-size']};
    font-weight: ${token.meta.title['font-weight']};
    line-height: ${token.meta.title['line-height']};
`;

export const descriptionStyle = css`
    color: ${token.meta.desc.color};
    font-size: ${token.meta.desc['font-size']};
    line-height: ${token.meta.desc['line-height']};
    overflow-wrap: anywhere;
`;
