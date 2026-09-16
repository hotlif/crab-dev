import Radio, { RadioGroup } from "@crab-dev/rc-radio";
import "@crab-dev/rc-radio/css/index.css";
export default function Example() {
    return (
        <RadioGroup defaultValue="weekly">
            <Radio value="daily">每天</Radio>
            <Radio value="weekly">每周</Radio>
        </RadioGroup>
    );
}
