
/**
 * title = "选中状态"
 * description = "`isSelected` 用于工具栏过滤器、视图切换等 toggle 场景"
 */

import Button from '../../src/index.js';
import { css } from '@linaria/core';
import { useState } from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

type Align = 'left' | 'center' | 'right';

const SelectedDemo = () => {
    const [align, setAlign] = useState<Align>('left');
    const [view, setView] = useState<'table' | 'card'>('table');

    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            `}
        >
            <div
                className={css`
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                `}
            >
                <Button
                    appearance="subtle"
                    icon={<AlignLeft />}
                    aria-label="左对齐"
                    isSelected={align === 'left'}
                    onClick={() => setAlign('left')}
                />
                <Button
                    appearance="subtle"
                    icon={<AlignCenter />}
                    aria-label="居中对齐"
                    isSelected={align === 'center'}
                    onClick={() => setAlign('center')}
                />
                <Button
                    appearance="subtle"
                    icon={<AlignRight />}
                    aria-label="右对齐"
                    isSelected={align === 'right'}
                    onClick={() => setAlign('right')}
                />
            </div>

            <div
                className={css`
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                `}
            >
                <Button
                    appearance="text"
                    isSelected={view === 'table'}
                    onClick={() => setView('table')}
                >
                    列表视图
                </Button>
                <Button
                    appearance="text"
                    isSelected={view === 'card'}
                    onClick={() => setView('card')}
                >
                    卡片视图
                </Button>
            </div>
        </div>
    );
};

export default SelectedDemo;
