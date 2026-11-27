import Flex from '@crab-dev/rc-flex';

export const meta = {
    title: '按行浏览一万条档案',
    description: '聚焦列表并按 End 查看最后一条档案，按 Home 回到起点。',
};

export default function VirtualListDemo() {
    return (
        <Flex
            aria-label="测绘档案"
            style={{ height: 216 }}
            gap={4}
            virtual={{
                itemCount: 10_000,
                itemHeight: 32,
                getItemKey: index => index + 10001,
                renderItem: index => <span>测绘档案 {index + 10001}</span>,
            }}
        />
    );
}
