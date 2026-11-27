import Flex from '@crab-dev/rc-flex';
import Tag from '@crab-dev/rc-tag';

export const meta = {
    title: '让地图图层标签自然换行',
    description: '标签按图层的阅读顺序排列，宽度不足时折到下一行。',
};

const layers = ['地形等高线', '水系', '行政边界', '历史道路', '土地利用', '观测站点'];

export default function WrapDemo() {
    return (
        <Flex role="group" aria-label="地图图层" wrap="wrap" align="center" gap={8}>
            {layers.map(layer => <Tag key={layer}>{layer}</Tag>)}
        </Flex>
    );
}
