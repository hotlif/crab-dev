import type { SVGProps } from 'react';

const baseProps: SVGProps<SVGSVGElement> = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: 14,
    height: 14,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};

export const CodeIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg {...baseProps} {...props}>
        <path d="m16 18 6-6-6-6" />
        <path d="m8 6-6 6 6 6" />
    </svg>
);

export const EyeIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg {...baseProps} {...props}>
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

export const CopyIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg {...baseProps} {...props}>
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
);

export const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg {...baseProps} {...props}>
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

export const ExternalLinkIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg {...baseProps} {...props}>
        <path d="M15 3h6v6" />
        <path d="M10 14 21 3" />
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
);
