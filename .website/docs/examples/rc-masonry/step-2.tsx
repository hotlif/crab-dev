import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Masonry from "@crab-dev/rc-masonry";
import Card from "@crab-dev/rc-card";
import Button from "@crab-dev/rc-button";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
const cards = [
    "建立项目",
    "编写一个最小示例，确认样式和事件都能工作。",
    "接入业务状态",
    "增加校验、反馈与窄屏适配，再交给团队使用。",
].map((text, index) => (
    <Card key={text} title={`任务 ${index + 1}`}>
        {text}
    </Card>
));
export default function Example() {
    const [columns, setColumns] = useState(2);
    return (
        <div className={layout}>
            <Button onClick={() => setColumns((value) => (value === 1 ? 2 : 1))}>
                列数：{columns}
            </Button>
            <Masonry columns={columns} gutter={16} sequential>
                {cards}
            </Masonry>
        </div>
    );
}
