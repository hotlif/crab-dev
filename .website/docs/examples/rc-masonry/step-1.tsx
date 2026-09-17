import Masonry from "@crab-dev/rc-masonry";
import Card from "@crab-dev/rc-card";
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
    return (
        <Masonry columns={2} gutter={16} sequential>
            {cards}
        </Masonry>
    );
}
