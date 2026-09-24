import Switch from '../../src/index.js';

export const meta = {
    title: '从右向左布局',
    description: '手柄与状态层跟随文档方向；按下时手柄放大但中心保持不变。',
};

export default function RtlDemo() {
    return <div dir="rtl"><Switch defaultChecked>RTL 开关</Switch></div>;
}
