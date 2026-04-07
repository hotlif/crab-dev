/**
 * title = "标签数量限制"
 * description = "多选模式下设置 maxTagCount 限制展示的标签数量"
 */

import Select from '../../src/index.js';

const options = Array.from({ length: 20 }, (_, i) => ({
    label: `Tag ${i + 1}`,
    value: `tag-${i + 1}`,
}));

const MaxTagCountDemo = () => {
    return (
        <Select
            aria-label="max-tag"
            multiple
            maxTagCount={3}
            defaultValue={['tag-1', 'tag-2', 'tag-3', 'tag-4', 'tag-5']}
            options={options}
            placeholder="请选择标签"
        />
    );
};

export default MaxTagCountDemo;
