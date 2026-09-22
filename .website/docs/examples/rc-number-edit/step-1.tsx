import NumberEdit from "@crab-dev/rc-number-edit";
export default function Example() {
    return (
        <NumberEdit
            label="购买数量"
            supportingText="可输入 1–10，或使用加减按钮和方向键调整。"
            appearance="filled"
            defaultValue={2}
            min={1}
            max={10}
            step={1}
        />
    );
}
