/**
 * title = "基础用法"
 * description = "title 与 extra 组成标题区, 裸内容自动落入内容区。"
 */

import Button from '@crab-dev/rc-button';
import Card from '../../src/index.js';

const BasicDemo = () => {
    return (
        <Card
            title="项目周报"
            extra={<Button appearance="link">更多</Button>}
            style={{ maxWidth: 360 }}
        >
            本周完成卡片组件的令牌设计与交互实现, 覆盖三种视觉变体与整卡点击语义,
            下周进入文档与回归测试阶段。
        </Card>
    );
};

export default BasicDemo;
