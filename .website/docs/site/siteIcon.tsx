type IconName = "home" | "start" | "components" | "learn" | "tools" | "code" | "overview" | "up" | "close";

/** Small, decorative icons; their containing controls provide the accessible names. */
export default function SiteIcon({ name }: { name: IconName }) {
    return <svg viewBox="0 0 24 24" className="crab-docs-site-icon" aria-hidden="true" focusable="false">
        {name === "home" && <><circle cx="12" cy="12" r="9" /><path d="M15 8a5 5 0 1 0 0 8" /></>}
        {name === "start" && <>{[5, 12, 19].flatMap(x => [5, 12, 19].map(y => <circle key={`${x}-${y}`} cx={x} cy={y} r="1" />))}</>}
        {name === "components" && <><circle cx="12" cy="12" r="9" /><path d="M12 7v10M7 12h10" /></>}
        {name === "learn" && <><path d="M5 3h14v18H5zM9 3v8l3-2 3 2V3" /></>}
        {name === "tools" && <><path d="M4 7h16M4 17h16" /><circle cx="9" cy="7" r="3" /><circle cx="16" cy="17" r="3" /></>}
        {name === "code" && <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-12-2 14" />}
        {name === "overview" && <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7v1" /></>}
        {name === "up" && <path d="M5 4h14M12 20V8m-5 5 5-5 5 5" />}
        {name === "close" && <path d="m6 6 12 12M6 18 18 6" />}
    </svg>;
}
