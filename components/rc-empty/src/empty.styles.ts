import { css } from '@crab-dev/css';
import token from './token.js';

export const containerStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: ${token.container.padding};
    min-height: ${token.container['min-height']};
    text-align: center;
    min-width: 0;
    font-family: ${token.container['font-family']};
`;

export const imageStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${token.image['margin-bottom']};
    color: ${token.image.color};
    flex-shrink: 0;
`;

export const titleStyle = css`
    overflow-wrap: anywhere;
    margin: 0 0 ${token.title['margin-bottom']};
    color: ${token.title.color};
    font-size: ${token.title['font-size']};
    font-weight: ${token.title['font-weight']};
    line-height: ${token.title['line-height']};
`;

export const descriptionStyle = css`
    margin: 0 0 ${token.description['margin-bottom']};
    color: ${token.description.color};
    font-size: ${token.description['font-size']};
    line-height: ${token.description['line-height']};
    max-width: ${token.description['max-width']};
    overflow-wrap: anywhere;
`;

export const actionStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${token.action.gap};
    flex-wrap: wrap;
    margin-top: ${token.action['margin-top']};
`;

