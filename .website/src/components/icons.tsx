import type { SVGProps } from "react";

const base: SVGProps<SVGSVGElement> = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
};

export const SunIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
);

export const MoonIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

export const ArrowRightIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
);

export const ExternalLinkIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M14 4h6v6" />
        <path d="M10 14 20 4" />
        <path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" />
    </svg>
);

export const SparkIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M5.5 18.5l2.1-2.1M16.4 7.6l2.1-2.1" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

export const CodeIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
    </svg>
);

export const CopyIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

export const CheckIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M20 6L9 17l-5-5" />
    </svg>
);

export const SearchIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
    </svg>
);

export const GithubIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
);

export const PackageIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M16.5 9.4l-9-5.19" />
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
    </svg>
);

export const IssueIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5" />
        <circle cx="12" cy="16" r="0.8" fill="currentColor" stroke="none" />
    </svg>
);

export const EditIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5z" />
    </svg>
);

export const CompassIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <circle cx="12" cy="12" r="9" />
        <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
    </svg>
);

export const HistoryIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M3 12a9 9 0 1 0 2.64-6.36" />
        <path d="M3 4v4h4" />
        <path d="M12 7v5l3 2" />
    </svg>
);

export const MenuIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
);

export const CloseIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);

/**
 * Cute little crab — contrast-safe mascot style.
 * Uses currentColor-based neutral tones to match both black and white backgrounds.
 */
export const CrabMarkIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...p}
    >
        {/* Claws */}
        <path d="M7.1 13.3 C5.9 12.9 5 12.2 4.6 11.5" stroke="currentColor" strokeOpacity="0.95" strokeWidth="1.8" />
        <path d="M4.6 11.5 C4 10.7 4 9.8 4.7 9.2" stroke="currentColor" strokeOpacity="0.88" strokeWidth="1.6" />
        <path d="M4.6 11.5 C4.1 12.1 4.1 12.8 4.7 13.3" stroke="currentColor" strokeOpacity="0.88" strokeWidth="1.6" />
        <path d="M16.9 13.3 C18.1 12.9 19 12.2 19.4 11.5" stroke="currentColor" strokeOpacity="0.95" strokeWidth="1.8" />
        <path d="M19.4 11.5 C20 10.7 20 9.8 19.3 9.2" stroke="currentColor" strokeOpacity="0.88" strokeWidth="1.6" />
        <path d="M19.4 11.5 C19.9 12.1 19.9 12.8 19.3 13.3" stroke="currentColor" strokeOpacity="0.88" strokeWidth="1.6" />

        {/* Body */}
        <ellipse cx="12" cy="14.9" rx="5.8" ry="4.7" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.6" />

        {/* Eye stalks */}
        <path d="M10.8 11.2 C10.5 10.3 10.2 9.7 9.9 9.1" stroke="currentColor" strokeOpacity="0.9" strokeWidth="1.3" />
        <path d="M13.2 11.2 C13.5 10.3 13.8 9.7 14.1 9.1" stroke="currentColor" strokeOpacity="0.9" strokeWidth="1.3" />

        {/* Eyes */}
        <circle cx="9.9" cy="8.45" r="1.65" fill="var(--crab-eye-white, oklch(100% 0 0))" stroke="currentColor" strokeWidth="1.05" />
        <circle cx="14.1" cy="8.45" r="1.65" fill="var(--crab-eye-white, oklch(100% 0 0))" stroke="currentColor" strokeWidth="1.05" />
        <circle cx="10" cy="8.65" r="0.56" fill="var(--crab-eye-pupil, oklch(28% 0 0))" stroke="none" />
        <circle cx="14" cy="8.65" r="0.56" fill="var(--crab-eye-pupil, oklch(28% 0 0))" stroke="none" />
        <circle cx="10.28" cy="8.38" r="0.16" fill="white" stroke="none" />
        <circle cx="14.28" cy="8.38" r="0.16" fill="white" stroke="none" />

        {/* Smile and blush */}
        <path d="M10.25 15.35 Q11.1 16.15 12 15.35 Q12.9 16.15 13.75 15.35" stroke="currentColor" strokeOpacity="0.9" strokeWidth="1.2" />
        <ellipse cx="8.1" cy="15.4" rx="0.85" ry="0.52" fill="currentColor" fillOpacity="0.2" stroke="none" />
        <ellipse cx="15.9" cy="15.4" rx="0.85" ry="0.52" fill="currentColor" fillOpacity="0.2" stroke="none" />

        {/* Legs */}
        <path d="M8.95 18.8 C8.3 19.35 7.55 19.82 6.75 20.08" stroke="currentColor" strokeOpacity="0.86" strokeWidth="1.3" />
        <path d="M10.8 19.2 C10.38 19.75 10.05 20.3 9.86 20.92" stroke="currentColor" strokeOpacity="0.86" strokeWidth="1.3" />
        <path d="M15.05 18.8 C15.7 19.35 16.45 19.82 17.25 20.08" stroke="currentColor" strokeOpacity="0.86" strokeWidth="1.3" />
        <path d="M13.2 19.2 C13.62 19.75 13.95 20.3 14.14 20.92" stroke="currentColor" strokeOpacity="0.86" strokeWidth="1.3" />
    </svg>
);
