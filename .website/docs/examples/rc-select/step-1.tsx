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
    return <Select aria-label="工作城市" options={options} placeholder="请选择城市" />;
}
