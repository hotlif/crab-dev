import { css } from '@crab-dev/css';
import token from '../token.js';

export const footerStyle = css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: ${token.footer.gap};
    margin-top: auto;
    padding: ${token.footer['padding-block']} var(--rc-card-pad, ${token.size.medium.padding});
    border-top: 1px solid ${token.footer.divider['border-color']};
`;
