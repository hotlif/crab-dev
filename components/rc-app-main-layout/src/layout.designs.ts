import { css } from '@crab-dev/css';
import token from './token.js';

// Account and document menus share the floating material, not toolbar fill.
export const macosMenuStyle = css`
    && {
        background-color: ${token.macos.menu['background-color']};
        background-image: ${token.material['background-image']};
        backdrop-filter: ${token.material['backdrop-filter']};
        -webkit-backdrop-filter: ${token.material['backdrop-filter']};
        border: 1px solid ${token.macos.menu['border-color']};
        border-radius: ${token.macos.menu['border-radius']};
        box-shadow: ${token.macos.menu['box-shadow']};
        @media (forced-colors: active) { border-color: CanvasText; box-shadow: none; }
    }
`;

// Tahoe separates a floating navigation surface from edge-to-edge content.
// Titles/breadcrumbs do not receive a glass backing with the toolbar buttons.
export const macosSidebarStyle = css`
    && {
    margin: ${token.macos.sidebar.margin};
    border: 1px solid ${token.macos.sidebar['border-color']};
    border-radius: ${token.macos.sidebar['border-radius']};
    box-shadow: ${token.macos.sidebar['box-shadow']};
    }
`;
export const macosToolbarStyle = css`
    && {
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    > button:not(:disabled) {
        background-color: ${token.macos.toolbar['background-color']};
        background-image: ${token.material['background-image']};
        backdrop-filter: ${token.material['backdrop-filter']};
        -webkit-backdrop-filter: ${token.material['backdrop-filter']};
        box-shadow: ${token.macos.toolbar['box-shadow']};
    }
    @media (forced-colors: active) { > button:not(:disabled) { background: ButtonFace; box-shadow: none; } }
    }
`;
