import { prefix } from "./util";

type MarginType = "space-x" | "space-y" | "x" | "y" | "end" | "start" | "left" | "top" | "right" | "bottom";

export const margin = (value: number | string, type: MarginType = "x") => {
    let valueStr = value;
    if (typeof value === "number") {
        valueStr = `calc(${value} * var(--${prefix}-margin-space, 0.25rem))`;;
    }
    const x = `margin-inline: ${valueStr};`
    switch (type) {
        case "space-x":
            return `
                & > :not(:last-child) {
                    margin-inline-start: ${valueStr};
                    margin-inline-end: ${valueStr};
                };
            `
        case "space-y":
            return `
                & > :not(:last-child) {
                    margin-block-start: ${valueStr};
                    margin-block-end: ${valueStr};
                };
            `
        case "x":
            return x;
        case "y":
            return `margin-block:  ${valueStr};`
        case "end":
            return `margin-inline-end: ${valueStr};`
        case "start":
            return `margin-inline-start: ${valueStr};`
        case "bottom":
            return `margin-bottom: ${valueStr};`
        case "left":
            return `margin-left: ${valueStr};`
        case "right":
            return `margin-right: ${valueStr};`
        case "top":
            return `margin-top: ${valueStr};`
        default:
            return x;
    }
}

type PaddingType = "space-x" | "space-y" | "x" | "y" | "end" | "start" | "left" | "top" | "right" | "bottom";

export const padding = (value: number | string, type: PaddingType = "x") => {
    let valueStr = value;
    if (typeof value === "number") {
        valueStr = `calc(${value} * var(--${prefix}-padding-space, 0.25rem))`;;
    }
    const x = `padding-inline: ${valueStr};`
    switch (type) {
        case "x":
            return x;
        case "y":
            return `padding-block:  ${valueStr};`
        case "end":
            return `padding-inline-end: ${valueStr};`
        case "start":
            return `padding-inline-start: ${valueStr};`
        case "bottom":
            return `padding-bottom: ${valueStr};`
        case "left":
            return `padding-left: ${valueStr};`
        case "right":
            return `padding-right: ${valueStr};`
        case "top":
            return `padding-top: ${valueStr};`
        default:
            return x;
    }
}

type ZIndexType = "base" | "low" | "mid" | "high" | "top" | "float" | "fixed" | "ultimate"

export const zIndex = (value: ZIndexType) => {
    const base = "z-index: 0;"
    switch(value) {
        case "base":
            return base;
        case "low":
            return "z-index: 100;";
        case "mid":
            return "z-index: 200;";
        case "high":
            return "z-index: 300;";
        case "top":
            return "z-index: 400;";
        case "float":
            return "z-index: 500;";
        case "fixed":
            return "z-index: 600;";
        case "ultimate":
            return "z-index: 700;";
        default:
            return base;
    }

}

export const boxShadow = (value: "xs" | "sm" | "md" | "lg" | "xl" | "2xl") => {
    switch (value) {
        case "xs":
            return "box-shadow: 0 1px 2px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.03);";
        case "sm":
            return "box-shadow: 0 2px 4px rgba(0,0,0,0.025), 0 2px 6px rgba(0,0,0,0.035);";
        case "md":
            return "box-shadow: 0 4px 6px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04);";
        case "lg":
            return "box-shadow: 0 6px 10px rgba(0,0,0,0.035), 0 6px 16px rgba(0,0,0,0.045);";
        case "xl":
            return "box-shadow: 0 8px 12px rgba(0,0,0,0.04), 0 10px 20px rgba(0,0,0,0.05);";
        case "2xl":
            return "box-shadow: 0 12px 16px rgba(0,0,0,0.05), 0 14px 28px rgba(0,0,0,0.06);";
        default:
            return "";
    }
}

export const height = (value: number | string) => {
    if (typeof value === "number") {
        return `height: calc(${value} * var(--${prefix}-height-space, 0.25rem));`;
    }
    return `height: ${value};`;
}

export const width = (value: number | string) => {
    if (typeof value === "number") {
        return `width: calc(${value} * var(--${prefix}-width-space, 0.25rem));`;
    }
    return `width: ${value};`;
}