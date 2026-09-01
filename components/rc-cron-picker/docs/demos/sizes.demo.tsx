export const meta = {
    title: "尺寸与状态",
    description: "三档尺寸、禁用态与外部校验状态;预览条数可通过 previewCount 调整或关闭",
};

import CronPicker from '../../src/index.js';

const SizesDemo = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
        <CronPicker size="large" defaultValue="*/10 * * * *" aria-label="大尺寸 Cron 表达式" />
        <CronPicker size="middle" defaultValue="*/10 * * * *" aria-label="中尺寸 Cron 表达式" />
        <CronPicker size="small" defaultValue="*/10 * * * *" aria-label="小尺寸 Cron 表达式" previewCount={0} />
        <CronPicker disabled defaultValue="0 0 * * *" aria-label="禁用的 Cron 表达式" />
        <CronPicker status="warning" defaultValue="0 0 * * *" aria-label="警告态 Cron 表达式" />
    </div>
);

export default SizesDemo;
