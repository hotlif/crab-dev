import { css, cx } from '@crab-dev/css';
import { useEffect, useRef } from 'react';
import type { FC, KeyboardEvent, CSSProperties } from 'react';
import { useDragResize, useEventCallback } from '@crab-dev/rc-hooks';
import token from './token.js';
import type { SplitPaneProps } from './types.js';

const rootStyle = css`
    display: flex;
    align-items: stretch;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
`;

const rootVerticalStyle = css`
    flex-direction: column;
`;

const paneStyle = css`
    min-width: 0;
    min-height: 0;
`;

const primaryPaneStyle = css`
    flex-shrink: 0;
`;

const flexPaneStyle = css`
    flex: 1;
`;

/* 命中区（separator.size）宽于可见线：1px 的线抓不住，7px 的空气抓得住 */
const separatorStyle = css`
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    touch-action: none; /* 触屏拖动调宽，不触发页面滚动 */
    user-select: none;

    &::before {
        content: '';
        position: absolute;
        background: ${token.separator.line.color};
        transition: ${token.separator.transition};
    }

    &:hover::before,
    &[data-dragging]::before {
        background: ${token.separator.line['color-active']};
    }

    &:focus-visible {
        outline: none; /* 仅因下一行立即给出替代焦点意符，方才允许 */
        box-shadow: ${token.focus.ring};
    }

    @media (prefers-reduced-motion: reduce) {
        &::before {
            transition: none;
        }
    }
`;

/* 左右分栏：分隔条是竖线 */
const separatorHorizontalStyle = css`
    width: ${token.separator.size};
    cursor: col-resize;

    &::before {
        top: 0;
        bottom: 0;
        left: 50%;
        width: ${token.separator.line.width};
        transform: translateX(-50%);
    }
`;

/* 上下分栏：分隔条是横线 */
const separatorVerticalStyle = css`
    height: ${token.separator.size};
    cursor: row-resize;

    &::before {
        left: 0;
        right: 0;
        top: 50%;
        height: ${token.separator.line.width};
        transform: translateY(-50%);
    }
`;

const separatorDisabledStyle = css`
    cursor: default;
`;

/** 读取记住的尺寸；无记录 / 脏数据 / 存储不可用（隐私模式等）一律返回 null */
function readPersisted(key: string | undefined): number | null {
    if (key === undefined) {
        return null;
    }
    try {
        const raw = window.localStorage.getItem(key);
        const value = raw === null ? Number.NaN : Number(raw);
        return Number.isFinite(value) ? value : null;
    } catch {
        return null;
    }
}

/**
 * 可拖拽调整尺寸的分栏面板。
 *
 * - 指针拖拽（Pointer Events，触屏 / 触控笔可用）与键盘调整（方向键步进、
 *   Home/End 到边界、Enter 复位）两条通道；分隔条为 `role="separator"`，
 *   带 `aria-valuenow` 汇报当前尺寸；
 * - 双击分隔条复位到 `defaultSize`；
 * - `persistKey` 记住用户调整的尺寸，下次挂载优先恢复（失败静默）；
 * - 拖拽机制来自 `@crab-dev/rc-hooks` 的 `useDragResize`（window 级监听、
 *   全局 user-select/cursor 锁、min/max 夹取）。
 */
const SplitPane: FC<SplitPaneProps> = ({
    children,
    direction = 'horizontal',
    primary = 'first',
    size,
    defaultSize,
    min = 0,
    max,
    step = 16,
    onSizeChange,
    persistKey,
    disabled = false,
    'aria-label': ariaLabel = '调整面板大小',
    className,
    style,
    ref,
}) => {
    const horizontal = direction === 'horizontal';

    // persistKey 的恢复值只在首次挂载读一次：之后它是「输出」而非「输入」，
    // 跟着 size 变化重读会造成自激
    const initialSizeRef = useRef<number | null>(null);
    initialSizeRef.current ??= readPersisted(persistKey) ?? defaultSize;

    const { size: currentSize, dragging, setSize, handleProps } = useDragResize({
        size,
        defaultSize: initialSizeRef.current,
        min,
        max,
        axis: horizontal ? 'x' : 'y',
        // 主面板在分隔条的哪一侧决定拖拽方向与尺寸增减的映射
        edge: primary === 'first' ? 'end' : 'start',
        onChange: onSizeChange,
    });

    // 复位目标是 prop 的 defaultSize 而非恢复值：双击语义是「回到设计默认」，
    // 不是「回到上次记住的位置」
    const resetToDefault = useEventCallback(() => setSize(defaultSize));

    // 拖拽结束 / 键盘调整后记住尺寸；防抖合并拖拽过程的高频变化
    useEffect(() => {
        if (persistKey === undefined || dragging) {
            return;
        }
        const timer = window.setTimeout(() => {
            try {
                window.localStorage.setItem(persistKey, String(currentSize));
            } catch {
                // 配额耗尽 / 隐私模式：记不住可以接受，绝不报错
            }
        }, 300);
        return () => window.clearTimeout(timer);
    }, [persistKey, currentSize, dragging]);

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) {
            return;
        }
        const grow = horizontal ? 'ArrowRight' : 'ArrowDown';
        const shrink = horizontal ? 'ArrowLeft' : 'ArrowUp';
        // primary=second 时分隔条向正方向移动意味着主面板变小，方向感反转
        const sign = primary === 'first' ? 1 : -1;
        switch (event.key) {
            case grow:
                setSize(currentSize + sign * step);
                break;
            case shrink:
                setSize(currentSize - sign * step);
                break;
            case 'Home':
                setSize(min);
                break;
            case 'End':
                if (max === undefined) {
                    return;
                }
                setSize(max);
                break;
            case 'Enter':
                resetToDefault();
                break;
            default:
                return;
        }
        event.preventDefault();
    };

    const primarySizeStyle: CSSProperties = horizontal
        ? { width: currentSize }
        : { height: currentSize };

    return (
        <div ref={ref} className={cx(rootStyle, !horizontal && rootVerticalStyle, className)} style={style}>
            <div
                className={cx(paneStyle, primary === 'first' ? primaryPaneStyle : flexPaneStyle)}
                style={primary === 'first' ? primarySizeStyle : undefined}
            >
                {children[0]}
            </div>
            <div
                role="separator"
                aria-orientation={horizontal ? 'vertical' : 'horizontal'}
                aria-label={ariaLabel}
                aria-valuenow={Math.round(currentSize)}
                aria-valuemin={Math.round(min)}
                aria-valuemax={max !== undefined ? Math.round(max) : undefined}
                aria-disabled={disabled || undefined}
                tabIndex={disabled ? undefined : 0}
                data-dragging={dragging ? '' : undefined}
                className={cx(
                    separatorStyle,
                    horizontal ? separatorHorizontalStyle : separatorVerticalStyle,
                    disabled && separatorDisabledStyle,
                )}
                onPointerDown={disabled ? undefined : handleProps.onPointerDown}
                onDoubleClick={disabled ? undefined : resetToDefault}
                onKeyDown={onKeyDown}
            />
            <div
                className={cx(paneStyle, primary === 'second' ? primaryPaneStyle : flexPaneStyle)}
                style={primary === 'second' ? primarySizeStyle : undefined}
            >
                {children[1]}
            </div>
        </div>
    );
};

export default SplitPane;
