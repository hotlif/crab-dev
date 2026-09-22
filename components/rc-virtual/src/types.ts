/** 等高行或等宽列。无需创建与条目数量等长的尺寸数组。 */
export interface UniformVirtualAxis {
    /** 条目数量，非负整数。 */
    count: number;
    /** 每项尺寸，单位为 px。 */
    itemSize: number;
}

/** 可变尺寸数组，或固定尺寸轴。 */
export type VirtualAxis = number[] | UniformVirtualAxis;
