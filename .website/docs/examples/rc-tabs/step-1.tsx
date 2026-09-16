import Tabs from "@crab-dev/rc-tabs";
import "@crab-dev/rc-tabs/css/index.css";
const items = [
    {
        key: "overview",
        label: "概览",
        children: <p>项目运行正常。</p>,
    },
    {
        key: "activity",
        label: "活动",
        children: <p>林晓更新了文档。</p>,
    },
];
export default function Example() {
    return <Tabs items={items} />;
}
