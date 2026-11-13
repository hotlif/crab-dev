import { TimePicker } from '@crab-dev/rc-date-picker';
import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';

export const meta = { title: '体系默认的时间输入', description: 'macOS 使用紧凑数字字段；显式表盘仍可通过 panelProps 请求。' };
const frame = css`padding: ${token.space['section-gap']}; max-width: 320px;`;
export default function DesktopTimeDemo() {
    return <div className={frame}>
        <TimePicker label="开始时间" defaultValue={{ hour: 9, minute: 30, second: 0 }} supportingText="打开后可用键盘调整小时与分钟。" />
    </div>;
}
