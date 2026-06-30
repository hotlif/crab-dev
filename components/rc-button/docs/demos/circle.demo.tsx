
/**
 * title = "圆形按钮"
 * description = "`shape=\"circle\"` 搭配纯图标（无 children）适用于工具栏操作图标"
 */

import Button from '../../src/index.js';
import { css } from '@linaria/core';
import { Plus, Pencil, Trash2, Search, Settings } from 'lucide-react';

const CircleDemo = () => {
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
                    gap: 0.75rem;
                `}
            >
                <Button appearance="primary" shape="circle" aria-label="新增" icon={<Plus />} size="large" />
                <Button appearance="primary" shape="circle" aria-label="新增" icon={<Plus />} />
                <Button appearance="primary" shape="circle" aria-label="新增" icon={<Plus />} size="small" />
            </div>

            <div
                className={css`
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                `}
            >
                <Button shape="circle" aria-label="搜索" icon={<Search />} />
                <Button shape="circle" aria-label="编辑" icon={<Pencil />} />
                <Button shape="circle" aria-label="设置" icon={<Settings />} />
                <Button appearance="danger" shape="circle" aria-label="删除" icon={<Trash2 />} />
                <Button shape="circle" aria-label="删除" icon={<Trash2 />} disabled />
            </div>
        </div>
    );
};

export default CircleDemo;
