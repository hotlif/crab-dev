import { css } from '@crab-dev/css';
import { TokenVars as buttonVars } from '@crab-dev/rc-button';
import token from './token.js';

export const commandGroupStyle = css`display: contents;`;
// Related toolbar controls sample one glass surface. Document titles and the
// canvas remain outside it; a page thumbnail is content, never tinted glass.
export const macosCommandGroupStyle = css`
    && {
    display: flex; flex-wrap: wrap; align-items: center;
    gap: ${token.toolbar.gap}; padding: ${token.macos.group.padding};
    border: 1px solid ${token.macos.material['border-color']};
    border-radius: ${token.macos.group['border-radius']};
    background-color: ${token.macos.material['background-color']};
    background-image: ${token.macos.material['background-image']};
    backdrop-filter: ${token.macos.material['backdrop-filter']};
    -webkit-backdrop-filter: ${token.macos.material['backdrop-filter']};
    box-shadow: ${token.macos.material['box-shadow']};
    &:empty { display: none; }
    }
`;
export const macosToolbarStyle = css`&& { background: transparent; }`;
export const macosPanelStyle = css`
    && {
    background-color: ${token.macos.material['background-color']};
    background-image: ${token.macos.material['background-image']};
    backdrop-filter: ${token.macos.material['backdrop-filter']};
    -webkit-backdrop-filter: ${token.macos.material['backdrop-filter']};
    border: 1px solid ${token.macos.material['border-color']};
    &:not([data-panel='properties']) {
        margin: ${token.toolbar.gap};
        border-radius: ${token.macos.panel['border-radius']};
        box-shadow: ${token.macos.material['box-shadow']};
    }
    }
`;
export const macosThumbnailStyle = css`
    ${buttonVars['tonal.color-selected']}: ${token.macos.thumbnail.color};
    ${buttonVars['tonal.background-color-selected']}: ${token.macos.thumbnail['background-color-selected']};
    &&[aria-selected='true'] {
        box-shadow: inset 0 0 0 2px ${token.selection.color};
        background-image: none;
    }
    @media (forced-colors: active) {
        &&[aria-selected='true'] { color: HighlightText; background: Highlight; box-shadow: none; }
    }
`;
