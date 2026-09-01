import { css, cx } from '@crab-dev/css';
import { Children, cloneElement, isValidElement } from 'react';
import type { CSSProperties, FC, KeyboardEvent, MouseEvent, ReactElement, ReactNode } from 'react';
import Badge from '@crab-dev/rc-badge';
import token from './token.js';
import type { AvatarGroupProps, AvatarProps, AvatarShape, AvatarSize } from './types.js';

const groupStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    isolation: isolate;
`;

const itemBaseStyle = css`
    position: relative;
    display: inline-flex;
    margin-left: var(--avatar-group-overlap, ${token.group.overlap});
    transition: ${token.group.transition};
    box-shadow: 0 0 0 ${token.group.item.ring.width} ${token.group.item.border.color};

    &:first-child {
        margin-left: 0;
    }

    &:hover {
        z-index: 10;
        transform: translateY(${token.group.hover.translate.y});
    }

    &:focus-within {
        z-index: 10;
    }

    @media (prefers-reduced-motion: reduce) {
        transition: box-shadow 120ms linear;

        &:hover {
            transform: none;
        }
    }
`;

const itemCircleStyle = css`
    border-radius: 50%;
`;

const itemSquareStyle = css`
    border-radius: ${token.shape.square.radius};
`;

const itemInteractiveStyle = css`
    cursor: pointer;

    &:focus-visible {
        outline: none;
        box-shadow:
            0 0 0 ${token.group.item.ring.width} ${token.group.item.border.color},
            0 0 0 calc(${token.group.item.ring.width} + 2px) ${token.focus.ring.color};
    }
`;

const itemShapeStyleMap: Record<AvatarShape, string> = {
    circle: itemCircleStyle,
    square: itemSquareStyle,
};

const resolveSpacing = (spacing: AvatarGroupProps['spacing']): string | undefined => {
    if (spacing === undefined) {
        return undefined;
    }

    return typeof spacing === 'number' ? `${spacing}px` : spacing;
};

const resolveBadgeSize = (size: AvatarSize | number): 'default' | 'small' => {
    if (typeof size === 'number') {
        return size < 32 ? 'small' : 'default';
    }

    return size === 'small' ? 'small' : 'default';
};

const AvatarGroup: FC<AvatarGroupProps> = ({
    size = 'middle',
    shape = 'circle',
    max,
    spacing,
    renderExtra,
    onExtraClick,
    className,
    style,
    children,
    ...restProps
}) => {
    const childArray = Children.toArray(children).filter(
        (child): child is ReactElement<AvatarProps> => isValidElement(child),
    );

    const totalCount = childArray.length;
    const visibleCount = max !== undefined && max < totalCount ? max : totalCount;
    const hiddenCount = totalCount - visibleCount;
    const visibleChildren = childArray.slice(0, visibleCount);
    const hiddenChildren = childArray.slice(visibleCount);

    const extraInteractive = typeof onExtraClick === 'function';

    const resolvedSpacing = resolveSpacing(spacing);
    const mergedStyle: CSSProperties = {
        ...(resolvedSpacing !== undefined
            ? ({ '--avatar-group-overlap': resolvedSpacing } as CSSProperties)
            : {}),
        ...style,
    };

    const handleExtraClick = (event: MouseEvent<HTMLSpanElement>) => {
        onExtraClick?.(event);
    };

    const handleExtraKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onExtraClick?.(event as unknown as MouseEvent<HTMLSpanElement>);
        }
    };

    const badgeCount: ReactNode = renderExtra
        ? renderExtra(hiddenCount, hiddenChildren)
        : `+${hiddenCount}`;

    // Non-interactive: Badge indicator carries aria-label via title.
    // Interactive:     outer button span carries aria-label; Badge gets no title
    //                  so its indicator doesn't duplicate the label.
    const badgeTitle = extraInteractive ? undefined : `+${hiddenCount} more`;

    const shouldShowBadge = hiddenCount > 0;

    return (
        <div
            {...restProps}
            className={cx(groupStyle, className)}
            style={mergedStyle}
        >
            {visibleChildren.map((child, index) => {
                const isLast = index === visibleCount - 1;
                const zIndex = visibleCount - index;
                const merged = cloneElement(child, {
                    size: child.props.size ?? size,
                    shape: child.props.shape ?? shape,
                } as Partial<AvatarProps>);

                const showBadgeOnThis = isLast && shouldShowBadge;

                return (
                    <span
                        key={child.key ?? index}
                        className={cx(
                            itemBaseStyle,
                            itemShapeStyleMap[shape],
                            showBadgeOnThis && extraInteractive && itemInteractiveStyle,
                        )}
                        style={{ zIndex }}
                        aria-label={showBadgeOnThis && extraInteractive ? `+${hiddenCount} more` : undefined}
                        role={showBadgeOnThis && extraInteractive ? 'button' : undefined}
                        tabIndex={showBadgeOnThis && extraInteractive ? 0 : undefined}
                        onClick={showBadgeOnThis && extraInteractive ? handleExtraClick : undefined}
                        onKeyDown={showBadgeOnThis && extraInteractive ? handleExtraKeyDown : undefined}
                    >
                        {showBadgeOnThis ? (
                            <Badge
                                count={badgeCount}
                                overflowCount={9999}
                                size={resolveBadgeSize(size)}
                                title={badgeTitle}
                            >
                                {merged}
                            </Badge>
                        ) : (
                            merged
                        )}
                    </span>
                );
            })}
        </div>
    );
};

export default AvatarGroup;