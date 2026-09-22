import TextEdit from "@crab-dev/rc-text-edit";
export default function Example() {
    return (
        <TextEdit
            label="项目说明"
            supportingText="描述本次改版目标，最多 120 字。"
            appearance="filled"
            maxLength={120}
        />
    );
}
