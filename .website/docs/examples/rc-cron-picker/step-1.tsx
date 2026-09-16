import CronPicker from "@crab-dev/rc-cron-picker";
import "@crab-dev/rc-cron-picker/css/index.css";
export default function Example() {
    return <CronPicker defaultValue="0 9 * * *" previewCount={3} aria-label="任务执行规则" />;
}
