import Card from '@crab-dev/rc-card';
import Flex from '@crab-dev/rc-flex';

export const meta = {
    title: '按容器宽度排列图幅卡片',
    description: '每张图幅宽 152 像素。缩窄窗口时每行容纳的图幅变少，纵向滚动可继续浏览。',
};

export default function VirtualCardsDemo() {
    return (
        <Flex
            aria-label="地形图图幅"
            style={{ height: 248 }}
            gap={8}
            virtual={{
                itemCount: 1_001,
                itemWidth: 152,
                itemHeight: 64,
                getItemKey: index => index + 41001,
                renderItem: index => (
                    <Card size="small" style={{ height: '100%', boxSizing: 'border-box' }}>
                        图幅 {index + 41001}
                    </Card>
                ),
            }}
        />
    );
}
