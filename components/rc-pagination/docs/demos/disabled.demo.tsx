/**
 * title = "禁用状态"
 * description = "disabled 会整体锁定分页器，所有按钮与输入框不可交互"
 */
import Pagination from "../../src/index.js";

export default function DisabledDemo() {
    return <Pagination defaultCurrent={3} total={100} showQuickJumper showTotal disabled />;
}
