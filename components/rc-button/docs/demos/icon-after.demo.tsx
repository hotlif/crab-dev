
export const meta = {
    title: "图标位置",
    description: "`icon` 在文字左侧，`iconAfter` 在文字右侧，可同时使用",
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
            <Button icon={<Search />} iconAfter={<ChevronDown />}>搜索并展开</Button>
        </div>
    );
};

export default IconAfterDemo;
