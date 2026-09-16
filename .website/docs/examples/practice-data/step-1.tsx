import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Table, { type Row, type ColumnType } from "@crab-dev/rc-table";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import "@crab-dev/rc-table/css/index.css";
import "@crab-dev/rc-auto-sizer/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["section-gap"]};
    font-size: ${token.font.size.body};
    & > p {
        margin: 0;
        color: ${token.color.text.secondary};
    }
    & output {
        color: ${token.color.text.secondary};
        font-size: ${token.font.size.caption};
    }
`;
interface Member extends Row {
    dataRef: {
        name: string;
        team: string;
        active: boolean;
    };
}
const members: Member[] = Array.from(
    {
        length: 23,
    },
    (_, index) => ({
        id: String(index + 1),
        height: 40,
        dataRef: {
            name: ["林晓", "周宁", "陈雨", "王悦"][index % 4] + String(index + 1),
            team: index % 2 ? "研发" : "设计",
            active: index % 3 !== 0,
        },
    }),
);
const columns: ColumnType<Member>[] = [
    {
        name: "$.name",
        title: "姓名",
    },
    {
        name: "$.team",
        title: "团队",
    },
    {
        name: "$.active",
        title: "状态",
        render: ({ row }) => (row.dataRef.active ? "启用" : "停用"),
    },
];
const frame = css`
    height: calc(${token.space["section-gap"]} * 20);
    min-width: 0;
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.radius.md};
    overflow: hidden;
    font-size: ${token.font.size.body};
    line-height: 1.5;
    --table-border-color: ${token.color.border.subtle};
`;
export default function Example() {
    const filtered = members;
    const pageRows = filtered;
    return (
        <div className={layout}>
            <output>共 {filtered.length} 位成员</output>
            <div className={frame}>
                <AutoSizer>
                    {({ width, height }) => (
                        <Table
                            aria-label="成员管理列表"
                            width={width}
                            height={height}
                            headerRowHeight={40}
                            columns={columns}
                            rows={pageRows}
                        />
                    )}
                </AutoSizer>
            </div>
        </div>
    );
}
