import Segmented from "@crab-dev/rc-segmented";
import "@crab-dev/rc-segmented/css/index.css";
export default function Example() {
    return <Segmented options={["日", "周", "月"]} defaultValue="周" />;
}
