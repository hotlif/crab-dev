export const meta = {
    title: "大量数据",
    description: "页数超过 7 时自动折叠为首尾 + 中部区间 + 省略号跳转",
};
import Pagination from "../../src/index.js";

export default function ManyPagesDemo() {
    return <Pagination defaultCurrent={23} total={980} pageSize={10} />;
}
