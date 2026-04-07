/**
 * title = "加载中"
 * description = "设置 loading 展示加载状态"
 */

import { useState } from 'react';
import Select from '../../src/index.js';
import type { SelectOption } from '../../src/index.js';

const LoadingDemo = () => {
    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState<SelectOption[]>([]);

    const handleOpenChange = (open: boolean) => {
        if (open && options.length === 0) {
            setLoading(true);
            setTimeout(() => {
                setOptions([
                    { label: '异步选项一', value: '1' },
                    { label: '异步选项二', value: '2' },
                    { label: '异步选项三', value: '3' },
                ]);
                setLoading(false);
            }, 1500);
        }
    };

    return (
        <Select
            aria-label="loading"
            loading={loading}
            options={options}
            onOpenChange={handleOpenChange}
            placeholder="点击加载选项"
        />
    );
};

export default LoadingDemo;
