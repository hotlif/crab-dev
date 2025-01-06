// 定义一个包含列值的对象
/**
 * ColumnsValue 对象包含了不同列宽的值。
 * 
 * - 数字键 (1-12): 表示列的数量。
 * - "auto": 自动列宽。
 * - "3xs" - "7xl": 表示不同的固定宽度，单位为 rem。
 * 
 * @property {string} 1 - 表示 1 列。
 * @property {string} 2 - 表示 2 列。
 * @property {string} 3 - 表示 3 列。
 * @property {string} 4 - 表示 4 列。
 * @property {string} 5 - 表示 5 列。
 * @property {string} 6 - 表示 6 列。
 * @property {string} 7 - 表示 7 列。
 * @property {string} 8 - 表示 8 列。
 * @property {string} 9 - 表示 9 列。
 * @property {string} 10 - 表示 10 列。
 * @property {string} 11 - 表示 11 列。
 * @property {string} 12 - 表示 12 列。
 * @property {string} auto - 自动列宽。
 * @property {string} 3xs - 固定宽度 16rem。
 * @property {string} 2xs - 固定宽度 18rem。
 * @property {string} xs - 固定宽度 20rem。
 * @property {string} sm - 固定宽度 24rem。
 * @property {string} md - 固定宽度 28rem。
 * @property {string} lg - 固定宽度 32rem。
 * @property {string} xl - 固定宽度 36rem。
 * @property {string} 2xl - 固定宽度 42rem。
 * @property {string} 3xl - 固定宽度 48rem。
 * @property {string} 4xl - 固定宽度 56rem。
 * @property {string} 5xl - 固定宽度 64rem。
 * @property {string} 6xl - 固定宽度 72rem。
 * @property {string} 7xl - 固定宽度 80rem。
 */
const ColumnsValue = {
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10",
    11: "11",
    12: "12",
    auto: "auto",
    "3xs": "16rem",
    "2xs": "18rem",
    xs: "20rem",
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "36rem",
    "2xl": "42rem",
    "3xl": "48rem",
    "4xl": "56rem",
    "5xl": "64rem",
    "6xl": "72rem",
    "7xl": "80rem",
};

// 根据传入的键返回对应的列样式
export const columns = (key: keyof typeof ColumnsValue) => {
    return `columns: ${ColumnsValue[key]};`;
}
