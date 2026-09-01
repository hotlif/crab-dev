
export const meta = {
    title: "按钮组",
    description: "`ButtonGroup` 统一管理子按钮的 `size` 和 `appearance`，适用于工具栏场景",
};

import Button, { ButtonGroup } from '../../src/index.js';
import { css } from '@crab-dev/css';
import { Bold, Italic, Underline } from 'lucide-react';
import { useState } from 'react';

const ButtonGroupDemo = () => {
    const [formats, setFormats] = useState<Set<string>>(new Set());

    const toggle = (key: string) => {
        setFormats((prev) => {
            const next = new Set(prev);
            if (next.has(key)) { next.delete(key); } else { next.add(key); }
            return next;
        });
    };

    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            `}
        >
            <ButtonGroup>
                <Button appearance="primary">创建</Button>
                <Button>编辑</Button>
                <Button appearance="danger">删除</Button>
            </ButtonGroup>

            <ButtonGroup size="small">
                <Button>上一页</Button>
                <Button>1</Button>
                <Button isSelected>2</Button>
                <Button>3</Button>
                <Button>下一页</Button>
            </ButtonGroup>

            <ButtonGroup appearance="subtle">
                <Button
                    icon={<Bold />}
                    aria-label="粗体"
                    isSelected={formats.has('bold')}
                    onClick={() => toggle('bold')}
                />
                <Button
                    icon={<Italic />}
                    aria-label="斜体"
                    isSelected={formats.has('italic')}
                    onClick={() => toggle('italic')}
                />
                <Button
                    icon={<Underline />}
                    aria-label="下划线"
                    isSelected={formats.has('underline')}
                    onClick={() => toggle('underline')}
                />
            </ButtonGroup>
        </div>
    );
};

export default ButtonGroupDemo;
