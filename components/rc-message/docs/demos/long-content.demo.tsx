export const meta = {
    title: "长连续文本",
    description: "长链接与标识符在窄屏中换行，保留完整信息。",
};

import Message from "../../src/message.js";

const LongContentDemo = () => (
    <Message
        content="文件已保存：https://example.com/projects/material-design-component-library/documents/2026-10-22/release-notes-with-a-long-continuous-identifier-0123456789abcdef"
        duration={0}
        showProgress={false}
    />
);

export default LongContentDemo;
