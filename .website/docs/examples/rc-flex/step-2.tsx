import Flex from '@crab-dev/rc-flex';

export default function Example() {
    return (
        <Flex
            aria-label="图幅目录"
            style={{ height: 200 }}
            gap={12}
            virtual={{
                itemCount: 10_000,
                itemHeight: 32,
                itemWidth: 128,
                getItemKey: index => index + 41001,
                renderItem: index => <span>图幅 {index + 41001}</span>,
            }}
        />
    );
}
