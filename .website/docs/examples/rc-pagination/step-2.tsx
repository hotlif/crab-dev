import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Pagination from "@crab-dev/rc-pagination";
import "@crab-dev/rc-pagination/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [page, setPage] = useState(1);
    return (
        <div className={layout}>
            <ul>
                {Array.from(
                    {
                        length: 23,
                    },
                    (_, index) => `项目 ${index + 1}`,
                )
                    .slice((page - 1) * 5, page * 5)
                    .map((item) => (
                        <li key={item}>{item}</li>
                    ))}
            </ul>
            <Pagination total={23} pageSize={5} current={page} onChange={setPage} />
        </div>
    );
}
