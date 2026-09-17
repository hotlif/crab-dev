import { useState, useTransition } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Table, { type Row, type ColumnType } from "@crab-dev/rc-table";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import LineEdit from "@crab-dev/rc-line-edit";
import Select from "@crab-dev/rc-select";
import Pagination from "@crab-dev/rc-pagination";
import Button from "@crab-dev/rc-button";
import Empty from "@crab-dev/rc-empty";
import Alert from "@crab-dev/rc-alert";
import Spin from "@crab-dev/rc-spin";
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
    height: calc(${token.space["section-gap"]} * 16);
    min-width: 0;
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.radius.md};
    overflow: hidden;
    font-size: ${token.font.size.body};
    line-height: 1.5;
    --table-border-color: ${token.color.border.subtle};
`;
// 业务接入位置：替换此函数，保留返回的 Member[] 结构。
async function mockLoad(mode: "success" | "empty" | "failure"): Promise<Member[]> {
    await new Promise<void>((resolve) => setTimeout(resolve, 600));
    if (mode === "failure") throw new Error("模拟读取失败");
    return mode === "empty" ? [] : members;
}
const toolbarStyle = css`
    display: grid;
    grid-template-columns: repeat(
        auto-fit,
        minmax(min(100%, calc(${token.space["section-gap"]} * 16)), 1fr)
    );
    gap: ${token.space["section-gap"]};
    max-width: calc(${token.space["section-gap"]} * 44);
`;
const actionsStyle = css`
    display: flex;
    flex-wrap: wrap;
    gap: ${token.space["component-gap"]};
    @media (max-width: 767px) {
        & > button {
            min-height: calc(${token.space["card-padding"]} * 2 + ${token.space["inline-gap"]});
        }
    }
`;
const resultsStyle = css`
    display: grid;
    gap: ${token.space["section-gap"]};
`;
const fieldStyle = css`
    display: grid;
    gap: ${token.space["component-gap"]};
    width: 100%;
    min-width: 0;
    max-width: calc(${token.space["section-gap"]} * 24);
    font-size: ${token.font.size.body};
    font-weight: ${token.font.weight.label};
`;
export default function Example() {
    const [rows, setRows] = useState(members);
    const [failed, setFailed] = useState(false);
    const [pending, startTransition] = useTransition();
    const [query, setQuery] = useState("");
    const [team, setTeam] = useState("all");
    const [page, setPage] = useState(1);
    const filtered = rows.filter(
        (row) =>
            row.dataRef.name.toLowerCase().includes(query.trim().toLowerCase()) &&
            (team === "all" || row.dataRef.team === team),
    );
    const pageRows = filtered.slice((page - 1) * 5, page * 5);
    function load(mode: "success" | "empty" | "failure") {
        setFailed(false);
        startTransition(async () => {
            try {
                setRows(await mockLoad(mode));
                setPage(1);
            } catch {
                setFailed(true);
            }
        });
    }
    return (
        <div className={layout}>
            <div className={toolbarStyle}>
                <label className={fieldStyle}>
                    搜索姓名
                    <LineEdit
                        value={query}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setPage(1);
                        }}
                        maxLength={30}
                        placeholder="例如：林晓"
                        disabled={pending}
                    />
                </label>
                <label className={fieldStyle}>
                    团队
                    <Select
                        value={team}
                        onChange={(value) => {
                            setTeam(value ?? "all");
                            setPage(1);
                        }}
                        options={[
                            {
                                value: "all",
                                label: "全部团队",
                            },
                            {
                                value: "设计",
                                label: "设计",
                            },
                            {
                                value: "研发",
                                label: "研发",
                            },
                        ]}
                        disabled={pending}
                    />
                </label>
            </div>
            <p>体验加载成功、失败和空数据三种状态。</p>
            <div className={actionsStyle}>
                <Button disabled={pending} onClick={() => load("success")}>
                    重新加载
                </Button>
                <Button disabled={pending} onClick={() => load("failure")}>
                    模拟失败
                </Button>
                <Button disabled={pending} onClick={() => load("empty")}>
                    模拟空数据
                </Button>
            </div>
            <section className={resultsStyle} aria-busy={pending} aria-label="请求结果">
                <div aria-live="polite">
                    {pending ? (
                        <Spin tip="正在读取成员…" />
                    ) : failed ? (
                        <Alert
                            type="error"
                            title="读取失败"
                            action={<Button onClick={() => load("success")}>重试</Button>}
                        >
                            这是可重复触发的本地模拟错误。
                        </Alert>
                    ) : filtered.length === 0 ? (
                        <Empty
                            title="没有匹配的成员"
                            description="清除筛选条件，或点击重新加载恢复本地数据。"
                        />
                    ) : null}
                </div>
                {!pending && !failed && filtered.length > 0 && (
                    <>
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
                        <Pagination
                            current={page}
                            pageSize={5}
                            total={filtered.length}
                            onChange={setPage}
                        />
                    </>
                )}
            </section>
        </div>
    );
}
