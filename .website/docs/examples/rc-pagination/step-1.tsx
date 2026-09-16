import Pagination from "@crab-dev/rc-pagination";
import "@crab-dev/rc-pagination/css/index.css";
export default function Example() {
    return <Pagination total={45} defaultPageSize={10} />;
}
