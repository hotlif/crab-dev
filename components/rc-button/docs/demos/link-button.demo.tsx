
/**
 * title = "链接按钮"
 * description = "传入 `href` 时渲染为 `<a>` 元素，保留所有 Button 样式与交互"
 */

import Button from '../../src/index.js';
import { css } from '@linaria/core';
import { ExternalLink } from 'lucide-react';

const LinkButtonDemo = () => {
    return (
        <div
            className={css`
                display: flex;
                align-items: center;
                gap: 1rem;
                flex-wrap: wrap;
            `}
        >
            <Button appearance="primary" href="https://example.com" target="_blank" rel="noopener noreferrer">
                主要链接
            </Button>
            <Button appearance="subtle" href="https://example.com" target="_blank" rel="noopener noreferrer">
                次级链接
            </Button>
            <Button
                appearance="link"
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                iconAfter={<ExternalLink />}
            >
                外部链接
            </Button>
            <Button
                appearance="subtle"
                href="https://example.com"
                disabled
            >
                禁用链接
            </Button>
        </div>
    );
};

export default LinkButtonDemo;
