import type { SVGAttributes } from 'react';

const NoDataIllustration = (props: SVGAttributes<SVGSVGElement>) => (
    <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        {...props}
    >
        {/* 盒子底部 */}
        <rect
            x="12"
            y="44"
            width="56"
            height="22"
            rx="4"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
        />
        {/* 盒子盖子左半 */}
        <path
            d="M12 44L18 28H38V44"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
        />
        {/* 盒子盖子右半 */}
        <path
            d="M68 44L62 28H42V44"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
        />
        {/* 盒盖扣带 */}
        <path
            d="M32 36H48"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
        />
        {/* 盒子内部横线（暗示空） */}
        <path
            d="M26 56H54"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.4"
        />
    </svg>
);

export default NoDataIllustration;
