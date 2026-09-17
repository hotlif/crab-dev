import Tooltip from "@crab-dev/rc-tooltip";
import Button from "@crab-dev/rc-button";
export default function Example() {
    return (
        <Tooltip title="保存后团队成员可看到修改">
            <Button>保存</Button>
        </Tooltip>
    );
}
