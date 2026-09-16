import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import TablePro, { type ProtocolColumnType } from "@crab-dev/rc-table-pro";
import "@crab-dev/rc-table-pro/css/index.css";
const columns: ProtocolColumnType[] = [
    {
        name: "$.name",
        title: "姓名",
        dataType: "text",
        width: 120,
    },
    {
        name: "$.team",
        title: "团队",
        dataType: "text",
        width: 120,
    },
];
// 业务接入位置：将这两个本地加载函数替换为接口请求。
const fetchColumns = async () => columns;
const fetchData = async () => [
    {
        id: "1",
        dataRef: {
            name: "林晓",
            team: "设计",
        },
    },
    {
        id: "2",
        dataRef: {
            name: "周宁",
            team: "研发",
        },
    },
    {
        id: "3",
        dataRef: {
            name: "陈雨",
            team: "产品",
        },
    },
];
const frame = css`
    height: calc(${token.space["section-gap"]} * 24);
    min-width: 0;
`;
export default function Example() {
    return (
        <TablePro
            showRowNumber={false}
            className={frame}
            fetchColumns={fetchColumns}
            fetchData={fetchData}
        />
    );
}
