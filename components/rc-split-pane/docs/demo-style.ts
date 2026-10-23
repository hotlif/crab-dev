import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';

export const frameStyle = css`
    height: calc(${token.size[40]} * 4);
    border: 1px solid ${token.color.border.default};
    border-radius: ${token.shape.card}; overflow: hidden;
    background: ${token.color.workspace.content};
`;
export const tallFrameStyle = css`height: calc(${token.size[40]} * 5.5);`;
export const paneStyle = css`
    display: flex; align-items: center; justify-content: center;
    height: 100%; padding: ${token.space['component-gap']}; box-sizing: border-box;
    font-size: ${token.typography.body.medium['font-size']}; color: ${token.color.text.secondary};
    text-align: center;
`;
export const sidebarStyle = css`background: ${token.color.workspace.sidebar};`;
export const consoleStyle = css`background: ${token.color.background.inverse}; color: ${token.color.text.inverse};`;
