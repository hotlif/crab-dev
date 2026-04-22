/**
 * title = "显示总量"
 * description = "showTotal 支持布尔值或自定义渲染函数，展示当前区间与总数"
 */
import { css } from "@linaria/core";
import Pagination from "../../src/index.js";

const stackStyle = css`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export default function ShowTotalDemo() {
    return (
        <div className={stackStyle}>
            <Pagination defaultCurrent={2} total={256} pageSize={20} showTotal />
            <Pagination
                defaultCurrent={2}
                total={256}
                pageSize={20}
                showTotal={(total, [from, to]) => `Showing ${from}-${to} of ${total}`}
            />
        </div>
    );
}
