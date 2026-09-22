
export const meta = {
    title: "图标位置",
    description: "M3 推荐单个前置图标；iconAfter 保留为 Material Web 支持的后置图标扩展。",
};

import Button from '../../src/index.js';
import { css } from '@crab-dev/css';
import { ArrowRight, ChevronDown, Download, Search } from 'lucide-react';

const IconAfterDemo = () => {
    return (
        <div
            className={css`
                display: flex;
                align-items: center;
                gap: 1rem;
                flex-wrap: wrap;
            `}
        >
            <Button icon={<Search />}>搜索</Button>
            <Button iconAfter={<ArrowRight />}>下一步</Button>
            <Button iconAfter={<ChevronDown />}>更多选项</Button>
            <Button appearance="primary" iconAfter={<Download />}>下载</Button>
        </div>
    );
};

export default IconAfterDemo;
