/**
 * title = "可搜索"
 * description = "设置 searchable 支持关键字过滤"
 */

import Select from '../../src/index.js';

const options = Array.from({ length: 1000 }, (_, i) => ({
    label: `Language ${i + 1}`,
    value: `lang-${i + 1}`,
}));

const SearchableDemo = () => {
    return (
        <Select
            aria-label="language"
            searchable
            options={options}
            placeholder="输入关键字筛选"
        />
    );
};

export default SearchableDemo;
