import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { useNotification } from "@crab-dev/rc-notification";
import Button from "@crab-dev/rc-button";
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
                onClick={() => {
                    notification.open({
                        title: "导出完成",
                        description: "本月报表已准备好。",
                        duration: 3000,
                    });
                }}
            >
                模拟导出完成
            </Button>
            <Button onClick={() => {
                for (const title of ["数据同步完成", "报表生成完成", "导出完成"]) {
                    notification.open({
                        title,
                        description: "关闭当前通知，查看后面的任务结果。",
                        duration: 0,
                    });
                }
            }}>
                查看 3 条通知层叠
            </Button>
        </div>
    );
}
