import Flex from '@crab-dev/rc-flex';

const sheetIds = [41001, 41002, 41003, 41004, 41005, 41006];

export default function Example() {
    return (
        <Flex wrap="wrap" gap={12}>
            {sheetIds.map(id => <span key={id} style={{ whiteSpace: 'nowrap' }}>图幅 {id}</span>)}
        </Flex>
    );
}
