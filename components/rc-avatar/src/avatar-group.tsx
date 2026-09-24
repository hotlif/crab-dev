import { useComponentSize } from '@crab-dev/rc-config-provider';
import { css, cx } from '@crab-dev/css';
import { Children, cloneElement, isValidElement } from 'react';
import type { CSSProperties, FC, ReactElement, ReactNode } from 'react';
import Badge from '@crab-dev/rc-badge';
import Button from '@crab-dev/rc-button';
import token, { vars } from './token.js';
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
    margin-left: ${token.group.margin};
    transition: ${token.group.transition};
    box-shadow: 0 0 0 ${token.group.item.ring.width} ${token.group.item['border-color']};

    &:first-child {
        margin-left: 0;
    }

    &:hover {
        z-index: 10;
        transform: ${token.group['transform-hover']};
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
    border-radius: ${token.shape.square['border-radius']};
`;

const extraActionStyle = css`
    && {
        min-width: ${token.interaction.touch['min-width']};
        min-height: ${token.interaction.touch['min-height']};
        margin-inline-start: ${token.group.action.gap};
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
    size: sizeProp,
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
    const size = useComponentSize(sizeProp);
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
            ? { [vars['group.margin']]: resolvedSpacing }
            : {}),
        ...style,
    };

    const badgeCount: ReactNode = renderExtra
        ? renderExtra(hiddenCount, hiddenChildren)
        : `+${hiddenCount}`;

    const badgeTitle = `+${hiddenCount} more`;

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

                const showBadgeOnThis = isLast && shouldShowBadge && !extraInteractive;

                return (
                    <span
                        key={child.key ?? index}
                        className={cx(
                            itemBaseStyle,
                            itemShapeStyleMap[shape],
                        )}
                        style={{ zIndex }}
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
            {shouldShowBadge && extraInteractive && (
                <Button type="button" appearance="tonal" shape="circle" className={extraActionStyle}
                    aria-label={badgeTitle} onClick={onExtraClick}>
                    {badgeCount}
                </Button>
            )}
        </div>
    );
};

export default AvatarGroup;
