import type { SVGAttributes } from 'react';

const NoPermissionIllustration = (props: SVGAttributes<SVGSVGElement>) => (
    <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        {...props}
    >
        {/* 锁体 */}
        <rect
            x="18"
            y="40"
            width="44"
            height="28"
            rx="5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
        />
        {/* 锁梁 */}
        <path
            d="M28 40V30C28 22.268 34.268 16 42 16H38C45.732 16 52 22.268 52 30V40"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        {/* 钥匙孔圆 */}
        <circle
            cx="40"
            cy="52"
            r="4"
            stroke="currentColor"
            strokeWidth="2"
        />
        {/* 钥匙孔竖线 */}
        <path
            d="M40 56V62"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

export default NoPermissionIllustration;
