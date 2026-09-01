export const meta = {
    title: "全局关键字搜索",
    description: "showSearchBar=true 在表格顶部显示内置搜索栏，输入关键字后所有可见列匹配到的文字会高亮显示，并支持上一个 / 下一个导航。DataTypeLoader.getSearchText 可为枚举等类型自定义匹配文本。",
};

import { css } from "@crab-dev/css";
import ProtocolTable from "../../src/table.js";
import type { DataTypeLoader, ProtocolColumnType } from "../../src/types.js";
import type { Row } from "@crab-dev/rc-table";

interface BookRow extends Row {
    dataRef: {
        isbn:      string;
        title:     string;
        author:    string;
        category:  "fiction" | "tech" | "history" | "science" | "art";
        publisher: string;
        year:      number;
        price:     number;
        inStock:   boolean;
    };
}

const CATEGORY_LABEL: Record<string, string> = {
    fiction:  "小说",
    tech:     "技术",
    history:  "历史",
    science:  "科学",
    art:      "艺术",
};

const CATEGORIES = ["fiction", "tech", "history", "science", "art"] as const;
const AUTHORS    = ["张伟", "李静", "王芳", "陈刚", "刘洋", "赵磊", "孙丽", "周军"];
const PUBLISHERS = ["人民文学出版社", "机械工业出版社", "商务印书馆", "清华大学出版社", "中信出版社"];
const TITLES     = [
    "深入理解计算机系统", "三体", "人类简史", "算法导论", "枪炮、病菌与钢铁",
    "白夜行", "设计心理学", "自私的基因", "追风筝的人", "活着",
];

const ALL_ROWS: BookRow[] = Array.from({ length: 120 }, (_, i) => ({
    id: String(i + 1),
    dataRef: {
        isbn:      `978-7-${String(100 + i).padStart(3, "0")}-${String(i * 13 + 1).padStart(5, "0")}-${i % 10}`,
        title:     `${TITLES[i % TITLES.length]}（第${(i % 3) + 1}版）`,
        author:    AUTHORS[i % AUTHORS.length],
        category:  CATEGORIES[i % CATEGORIES.length],
        publisher: PUBLISHERS[i % PUBLISHERS.length],
        year:      2015 + (i % 10),
        price:     29.9 + (i % 30) * 5,
        inStock:   i % 3 !== 2,
    },
}));

const COLUMNS: ProtocolColumnType[] = [
    { name: "$.isbn",      title: "ISBN",      dataType: "text",     width: 200, fixed: "left" },
    { name: "$.title",     title: "书名",      dataType: "text",     width: 240 },
    { name: "$.author",    title: "作者",      dataType: "text",     width: 100 },
    { name: "$.category",  title: "分类",      dataType: "category", width: 90  },
    { name: "$.publisher", title: "出版社",    dataType: "text",     width: 180 },
    { name: "$.year",      title: "出版年",    dataType: "number",   width: 80, align: "right" },
    { name: "$.price",     title: "定价（元）", dataType: "number",   width: 100, align: "right" },
    { name: "$.inStock",   title: "库存",      dataType: "stock",    width: 80  },
];

const TYPE_LOADERS: DataTypeLoader[] = [
    { name: "text",   render: undefined, editRender: undefined, filterEditor: undefined },
    { name: "number", render: undefined, editRender: undefined, filterEditor: undefined },
    {
        name: "category",
        render: ({ row, column }) => {
            const field = String(column.name).replace(/^\$\./, "");
            const s = String(row.dataRef[field] ?? "");
            return CATEGORY_LABEL[s] ?? s;
        },
        editRender: undefined,
        filterEditor: undefined,
        // 搜索时同时匹配中文标签和英文 key（getSearchText 接收 row）
        getSearchText: (row) => {
            const s = String((row as BookRow).dataRef.category ?? "");
            return `${s} ${CATEGORY_LABEL[s] ?? ""}`;
        },
    },
    {
        name: "stock",
        render: ({ row, column }) => {
            const field = String(column.name).replace(/^\$\./, "");
            const inStock = Boolean(row.dataRef[field]);
            return (
                <span style={{ color: inStock ? "oklch(55% 0.18 140)" : "oklch(55% 0.18 25)" }}>
                    {inStock ? "有货" : "缺货"}
                </span>
            );
        },
        editRender: undefined,
        filterEditor: undefined,
        // 搜索时用中文标签匹配
        getSearchText: (row) => ((row as BookRow).dataRef.inStock ? "有货" : "缺货"),
    },
];

const fetchColumns = (): Promise<ProtocolColumnType[]> =>
    new Promise((resolve) => setTimeout(() => resolve(COLUMNS), 150));

const fetchData = (): Promise<BookRow[]> =>
    new Promise((resolve) => setTimeout(() => resolve(ALL_ROWS), 200));

const containerStyle = css`
    width: 100%;
    height: 440px;
`;

const SearchBarDemo = () => (
    <ProtocolTable<BookRow>
        className={containerStyle}
        fetchColumns={fetchColumns}
        fetchData={fetchData}
        typeLoaders={TYPE_LOADERS}
        showSearchBar
    />
);

export default SearchBarDemo;
