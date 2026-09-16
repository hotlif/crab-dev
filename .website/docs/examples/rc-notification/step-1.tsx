import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { useNotification } from "@crab-dev/rc-notification";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-notification/css/index.css";
import "@crab-dev/rc-button/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [notification, holder] = useNotification();
    return (
        <div className={layout}>
            {holder}
            <Button
                onClick={() =>
                    notification.open({
                        title: "导出完成",
                        description: "本月报表已准备好。",
                        duration: 3000,
                    })
                }
            >
                模拟导出完成
            </Button>
        </div>
    );
}
