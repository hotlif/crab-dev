import { css } from "@crab-dev/css";
import type { CSSProperties } from "react";

const horizontalStyle = css`
    display: inline-block;
    vertical-align: top;
    box-sizing: border-box;
    height: 100%;
`;

const verticalStyle: CSSProperties = { display: "block", boxSizing: "border-box", width: "100%" };

export function horizontalSpacer(side: "left" | "right", width: number) {
    return <div key={`table-virtual-${side}-padding`} data-rc-table-virtual-spacer={side}
        aria-hidden="true" className={horizontalStyle} style={{ width: Math.max(0, width) }} />;
}

export function verticalSpacer(side: "top" | "bottom", height: number) {
    return <div key={`table-virtual-${side}-padding`} aria-hidden="true" data-rc-table-virtual-spacer={side}
        style={{ ...verticalStyle, height: Math.max(0, height) }} />;
}
