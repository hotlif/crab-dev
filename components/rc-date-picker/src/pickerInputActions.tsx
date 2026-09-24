import { css } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import { TokenVars as lineEditVars } from '@crab-dev/rc-line-edit';
import { useEffect, useState, type Ref } from 'react';

import { Calendar, Clock, XCircleFill } from './icons.js';
import token from './token.js';

const actionStyle = css`
    flex-shrink: 0;
    && {
        padding: 0;
        width: var(${lineEditVars['action.min-width']}, ${token.field.action.width});
        min-width: var(${lineEditVars['action.min-width']}, ${token.field.action.width});
        height: var(${lineEditVars['action.height']}, ${token.field.action.width});
        color: ${token.field.action.color};
    }
    && svg {
        width: ${token.field.icon.width};
        height: ${token.field.icon.width};
    }
    // LineEdit 已在字段容器上应用禁用透明度。
    &&:disabled > span { opacity: 1; }
    @media (pointer: coarse) {
        && {
            width: ${token.field.action.touch.width};
            min-width: ${token.field.action.touch.width};
            height: ${token.field.action.touch.width};
        }
    }
`;

interface PickerInputActionsProps {
    kind?: 'date' | 'time';
    hasValue: boolean;
    hovered: boolean;
    disabled?: boolean;
    open: boolean;
    onClear: () => void;
    onOpen: () => void;
}

/** 悬停边界是整个 LineEdit 容器，输入框与尾部按钮之间的移动不算离开。 */
export function usePickerFieldHover(reference: Ref<HTMLDivElement>) {
    const [hovered, setHovered] = useState(false);
    const containerRef = (node: HTMLDivElement | null) => {
        const cleanup = typeof reference === 'function' ? reference(node) : undefined;
        if (reference && typeof reference !== 'function') reference.current = node;
        if (!node) return;
        const onPointerOver = (event: PointerEvent) => {
            if (event.pointerType !== 'touch') setHovered(true);
        };
        const onPointerOut = (event: PointerEvent) => {
            if (!(event.relatedTarget instanceof Node) || !node.contains(event.relatedTarget)) {
                setHovered(false);
            }
        };
        node.addEventListener('pointerover', onPointerOver);
        node.addEventListener('pointerout', onPointerOut);
        return () => {
            node.removeEventListener('pointerover', onPointerOver);
            node.removeEventListener('pointerout', onPointerOut);
            if (cleanup) cleanup();
            else if (typeof reference === 'function') reference(null);
            else if (reference) reference.current = null;
        };
    };
    return { hovered, containerRef };
}

export default function PickerInputActions({ kind = 'date', hasValue, hovered, disabled, open, onClear, onOpen }: PickerInputActionsProps) {
    const [focused, setFocused] = useState(false);
    const [withoutHover, setWithoutHover] = useState(false);
    useEffect(() => {
        const media = window.matchMedia?.('(hover: none)');
        if (!media) return;
        const update = () => setWithoutHover(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);
    const showClear = hasValue && !disabled && (hovered || focused || withoutHover);

    // 保留同一个按钮节点与命中区域，只切换图标、名称和动作，避免切换时丢失焦点。
    return <Button
        type="button"
        appearance="text"
        shape="circle"
        size="small"
        className={actionStyle}
        data-role={showClear ? 'picker-clear' : kind === 'time' ? 'picker-clock' : 'picker-calendar'}
        aria-label={showClear ? (kind === 'time' ? '清除时间' : '清除日期') : (kind === 'time' ? '选择时间' : '打开日历')}
        aria-expanded={showClear ? undefined : open}
        disabled={disabled}
        icon={showClear ? <XCircleFill aria-hidden="true" /> : kind === 'time' ? <Clock aria-hidden="true" /> : <Calendar aria-hidden="true" />}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onClick={(event) => {
            event.stopPropagation();
            if (showClear) onClear();
            else onOpen();
        }}
    />;
}
