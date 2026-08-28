export const meta = {
    title: "每页条数选择",
    description: "传入 showSizeChanger 以显示每页条数下拉；切换时会保持当前首条可见。",
};
import Pagination from "../../src/index.js";

export default function SizeChangerDemo() {
    return (
        <Pagination
            total={500}
            defaultPageSize={20}
            showSizeChanger
            showTotal
            pageSizeOptions={[10, 20, 50, 100]}
        />
    );
}
