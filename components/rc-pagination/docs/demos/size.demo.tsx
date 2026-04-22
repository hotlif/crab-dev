/**
 * title = "紧凑尺寸"
 * description = "size=\"small\" 用于表格内联、抽屉底部等高密度场景"
 */
import { css } from "@linaria/core";
import Pagination from "../../src/index.js";

const stackStyle = css`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export default function SizeDemo() {
    return (
        <div className={stackStyle}>
            <Pagination total={120} size="medium" />
            <Pagination total={120} size="small" />
        </div>
    );
}
