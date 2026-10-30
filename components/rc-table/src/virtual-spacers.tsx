import { type CSSProperties } from "react";
import { css } from "@crab-dev/css";

export const paddingLeft = (
    <div
        key="table-virtual-left-padding"
        className={css`
            display: inline-block;
            vertical-align: top;
            box-sizing: border-box;
            width: calc(var(--crab-rc-virtual-left-padding-width, 0px) - var(--crab-rc-virtual-left-padding-width-offset, 0px));
            height: 100%;
        `}
    />
);

export const paddingLeftWithCompensation = (leftPaddingCompensation: number) => (
    <div
        key="table-virtual-left-padding-body"
        className={css`
            display: inline-block;
            vertical-align: top;
            box-sizing: border-box;
            height: 100%;
        `}
        style={{
            width: `calc(var(--crab-rc-virtual-left-padding-width, 0px) - var(--crab-rc-virtual-left-padding-width-offset, 0px) - ${leftPaddingCompensation}px)`
        }}
    />
);

export const paddingRight = (
    <div
        key="table-virtual-right-padding"
        className={css`
            display: inline-block;
            vertical-align: top;
            box-sizing: border-box;
            /* Fixed right columns are rendered independently of the window;
               their widths must not also remain in its trailing spacer. */
            width: max(0px, calc(var(--crab-rc-virtual-right-padding-width, 0px) - var(--rc-table-fixed-right-width, 0px)));
            height: 100%;
        `}
    />
);

export const verticalPaddingBaseStyle: CSSProperties = {
    display: "block",
    boxSizing: "border-box",
    width: "100%"
};

export const paddingBottom = (
    <div
        key="table-virtual-bottom-padding"
        aria-hidden="true"
        data-rc-table-virtual-spacer="bottom"
        style={{
            ...verticalPaddingBaseStyle,
            height: "var(--crab-rc-virtual-bottom-padding-height, 0px)"
        }}
    />
);

export const paddingTop = (topPaddingCompensation = 0) => (
    <div
        key="table-virtual-top-padding-body"
        aria-hidden="true"
        data-rc-table-virtual-spacer="top"
        style={{
            ...verticalPaddingBaseStyle,
            height: `max(0px, calc(var(--crab-rc-virtual-top-padding-height, 0px) - ${topPaddingCompensation}px))`
        }}
    />
);
