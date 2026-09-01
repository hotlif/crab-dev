import { css, cx } from '@crab-dev/css';
import { useEffect, useState } from 'react';
import { useTimeout } from '@crab-dev/rc-hooks';

import SpinIndicator, { sizeStyleOf } from './indicator.js';
import token from './token.js';
import type { SpinProps } from './types.js';

/* ────────────────────────────────── 静态样式 ────────────────────────────────── */

const spinnerStyle = css`
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${token.tip.gap};
    animation: rc-spin-appear ${token.motion.appear} both;

    @keyframes rc-spin-appear {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    /* 淡入只是修饰, reduce 下直接去掉；旋转不同（见 indicator.tsx）, 那是唯一的进行中反馈 */
    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const tipStyle = css`
    color: ${token.tip.color};
    font-size: var(--rc-spin-font-size, ${token.size.middle['font-size']});
    line-height: 1.4;
    text-align: center;
`;

/* ---- 包裹模式 ---- */

const containerStyle = css`
    position: relative;
`;

const contentStyle = css`
    transition: opacity ${token.motion.appear};

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const contentMaskedStyle = css`
    opacity: ${token.content.opacity};
    filter: blur(${token.content.blur});
    user-select: none;
`;

const overlayStyle = css`
    position: absolute;
    inset: 0;
    z-index: ${token.overlay['z-index']};
    display: flex;
    align-items: center;
    justify-content: center;
    /* 遮罩层自身不吃事件；内容的不可交互由 inert 保证, 而非靠一层拦截板 */
    pointer-events: none;
`;

/* ────────────────────────────────── 组件 ────────────────────────────────── */

/**
 * 加载中：为耗时操作提供"正在进行"的反馈。
 *
 * - 独立使用时渲染一枚指示器；传入 `children` 则进入包裹模式, 笼罩该区域
 * - `delay` 用于压掉秒回请求的 spinner 闪烁
 * - 包裹模式下内容被 `inert` 阻断, 鼠标与键盘都无法进入加载中的区域
 *
 * 若宿主自身已声明加载语义（如按钮的 `aria-busy`）, 应改用 `SpinIndicator` 这一纯视觉环,
 * 避免读屏重复播报。
 */
const Spin = ({
    spinning = true,
    size = 'middle',
    tip,
    delay = 0,
    indicator,
    label = '加载中',
    children,
    className,
    ref,
    ...restProps
}: SpinProps) => {
    // 延迟显示：spinning 为真只是"开始加载", visible 才是"该让用户看见指示器"。
    // 二者分离, 才能让 delay 内完成的操作全程无 spinner。
    const [visible, setVisible] = useState(() => spinning && delay <= 0);

    useEffect(() => {
        if (!spinning) {
            // 结束加载：立即撤下指示器, 不受 delay 影响（延迟只针对"出现"）
            setVisible(false);
        } else if (delay <= 0) {
            setVisible(true);
        }
    }, [spinning, delay]);

    // delay 为 null 时 useTimeout 暂停计时；spinning 转假会一并清理待触发的计时器
    useTimeout(() => setVisible(true), spinning && delay > 0 ? delay : null);

    const spinnerNode = (
        <div
            className={cx(spinnerStyle, sizeStyleOf(size))}
            role="status"
            aria-live="polite"
            // tip 是可见文案, 已能作为可访问名；此时再加 aria-label 反而会把它覆盖掉
            aria-label={tip === undefined ? label : undefined}
        >
            {/* 尺寸由根节点的 --rc-spin-size 下发, 故此处不重复传 size */}
            {indicator ?? <SpinIndicator />}
            {tip !== undefined && <span className={tipStyle}>{tip}</span>}
        </div>
    );

    // 独立模式：不加载时不占位, 也不在无障碍树里留下空的 status 容器
    if (children === undefined) {
        if (!visible) return null;

        return (
            <div {...restProps} ref={ref} className={className}>
                {spinnerNode}
            </div>
        );
    }

    return (
        <div
            {...restProps}
            ref={ref}
            className={cx(containerStyle, className)}
            aria-busy={visible}
        >
            {/* inert 同时阻断鼠标点击、键盘 Tab 与读屏进入——加载中的内容不可用,
                就该真的不可用, 而不是"看起来禁用、Tab 一按还是能选中"。 */}
            <div className={cx(contentStyle, visible && contentMaskedStyle)} inert={visible}>
                {children}
            </div>
            {visible && <div className={overlayStyle}>{spinnerNode}</div>}
        </div>
    );
};

export default Spin;
