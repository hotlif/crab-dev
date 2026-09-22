import Select from "@crab-dev/rc-select";
const options = [
    {
        value: "hz",
        label: "杭州",
    },
    {
        value: "sh",
        label: "上海",
    },
    {
        value: "sg",
        label: "新加坡",
    },
];
export default function Example() {
    return <Select label="工作城市" supportingText="用于安排线下办公地点。" appearance="filled" options={options} />;
}
