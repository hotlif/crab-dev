import type { SVGAttributes } from 'react';

const SearchNotFoundIllustration = (props: SVGAttributes<SVGSVGElement>) => (
    <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        {...props}
    >
        {/* 放大镜圆圈 */}
        <circle
            cx="34"
            cy="34"
            r="18"
            stroke="currentColor"
            strokeWidth="2.5"
        />
        {/* 放大镜手柄 */}
        <path
            d="M47 47L62 62"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
        />
        {/* 叉号左线 */}
        <path
            d="M27 27L41 41"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
        />
        {/* 叉号右线 */}
        <path
            d="M41 27L27 41"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
        />
    </svg>
);

export default SearchNotFoundIllustration;
