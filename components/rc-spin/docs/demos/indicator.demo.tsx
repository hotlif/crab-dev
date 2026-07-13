/**
 * title = "自定义指示器"
 * description = "indicator 替换默认的旋转环; 无障碍语义（role=status / aria-label）仍由 Spin 统一兜底。"
 */

import { css } from '@linaria/core';
import Spin from '../../src/index.js';

const rowStyle = css`
    display: flex;
    gap: 48px;
    align-items: center;
`;

const dotsStyle = css`
    display: flex;
    gap: 6px;

    & > span {
        width: 8px;
        height: 8px;
        background-color: oklch(0.22 0.005 286);
        border-radius: 50%;
        animation: rc-spin-demo-bounce 1.2s ease-in-out infinite;
    }

    & > span:nth-child(2) {
        animation-delay: 0.15s;
    }

    & > span:nth-child(3) {
        animation-delay: 0.3s;
    }

    @keyframes rc-spin-demo-bounce {
        0%,
        80%,
        100% {
            opacity: 0.25;
            transform: translateY(0);
        }
        40% {
            opacity: 1;
            transform: translateY(-4px);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        & > span {
            animation-name: rc-spin-demo-fade;
        }

        @keyframes rc-spin-demo-fade {
            0%,
            100% {
                opacity: 1;
            }
            50% {
                opacity: 0.3;
            }
        }
    }
`;

const Dots = () => (
    <div className={dotsStyle} aria-hidden="true">
        <span />
        <span />
        <span />
    </div>
);

const IndicatorDemo = () => {
    return (
        <div className={rowStyle}>
            <Spin indicator={<Dots />} />
            <Spin indicator={<Dots />} tip="正在处理" />
        </div>
    );
};

export default IndicatorDemo;
