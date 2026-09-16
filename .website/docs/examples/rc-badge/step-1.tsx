import Badge from "@crab-dev/rc-badge";
import "@crab-dev/rc-badge/css/index.css";
export default function Example() {
    return (
        <Badge count={5}>
            <span>待办消息</span>
        </Badge>
    );
}
