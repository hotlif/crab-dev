export const flex = () => {
    return `
        display: flex;
        > * {
            flex-grow: 0;
            flex-shrink: 0;
            flex-basis: auto;
        }
    `
}

export const flexDirection = (type: "row" | "row-reverse" | "column" | "column-reverse") => {
    return `flex-direction: ${type};`;
}

export const flexWrap = (value: "nowrap" | "wrap" | "wrap-reverse") => {
    return `flex-wrap: ${value};`;
}

export const flexJustifyContent = (value: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly") => {
    return `justify-content: ${value};`;
}

export const flexAlignItems = (value: "stretch" | "flex-start" | "flex-end" | "center" | "baseline") => {
    return `align-items: ${value};`;
}

export const flexAlignContent = (value: "stretch" | "flex-start" | "flex-end" | "center" | "space-between" | "space-around") => {
    return `align-content: ${value};`;
}

export const flexItemOrder = (value: number) => {
    return `order: ${value};`;
}

export const flexItemGrow = (value: number) => {
    return `flex-grow: ${value};`
}

export const flexItemShrink = (value: number) => {
    return `flex-shrink: ${value};`;
}

export const flexItemBasis = (value: string) => {
    return `flex-basis: ${value};`;
}

export const flexItemAlignSelf = (value: "auto" | "flex-start" | "flex-end" | "center" | "baseline" | "stretch") => {
    return `align-self: ${value}`;
}


export const grid = () => {
    return `
        display: grid;
    `
}

export const gridTemplateColumns = (value: string) => {
    return `grid-template-columns: ${value};`
}

export const gridTemplateRows = (value: string) => {
    return `grid-template-rows: ${value};`
}

export const gridTemplateAreas = (value: string) => {
    return `grid-template-areas: ${value};`;
}

export const gridAlignTtems = (value: "start" | "end" | "center" | "stretch") => {
    return `align-items: ${value};`;
}

export const gridJustifyItems = (value: "start" | "end" | "center" | "stretch") => {
    return `justify-items: ${value};`;
}

export const gridJustifyContent = (value: "start" | "end" | "center" | "stretch" | "space-between" | "space-around" | "space-evenly") => {
    return `justify-content: ${value};`
}

export const gridAlignContent = (value: "start" | "end" | "center" | "stretch" | "space-between" | "space-around" | "space-evenly") => {
    return `align-content: ${value};`;
}

export const gridItemRowSpan = (value: number) => {
    return `grid-row: span ${value};`
}

export const gridItemColumnSpan = (value: number) => {
    return `grid-column: span ${value};`;
}

/**
 * 用于设置行和列之间的间隙
 * @param column 列的间隙
 * @param row    行的间隙
 * @returns 
 */
export const gap = (column: string, row: string) => {
    return `gap: ${column} ${row};`;
}

export const row = () => {
    return `
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        > * {
            flex-grow: 0;
            flex-shrink: 0;
            flex-basis: auto;
        }
    `
}

export const column = () => {
    return `
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        > * {
            flex-grow: 0;
            flex-shrink: 0;
            flex-basis: auto;
        }
    `
} 