import { css, cx } from '@linaria/core';
import type { FC } from 'react';
import NoDataIllustration from './illustrations/no-data.js';
import NoPermissionIllustration from './illustrations/no-permission.js';
import SearchNotFoundIllustration from './illustrations/search-not-found.js';
import token from './token.js';
import type { EmptyPreset, EmptyProps } from './types.js';

// ─── 默认文案（格式塔接近性：文字与语境高度匹配，减少认知摩擦） ──────────────

const DEFAULT_TITLES: Record<EmptyPreset, string> = {
    'default': '暂无数据',
    'search': '未找到匹配内容',
    'no-permission': '暂无访问权限',
};

const DEFAULT_DESCRIPTIONS: Record<EmptyPreset, string> = {
    'default': '当前还没有内容，快去添加吧',
    'search': '尝试修改关键词或调整筛选条件',
    'no-permission': '请联系管理员获取相应权限',
};

// ─── 样式 ─────────────────────────────────────────────────────────────────────

const containerStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: ${token.container.padding};
    min-height: ${token.container['min-height']};
    text-align: center;
`;

const imageStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${token.image['margin-bottom']};
    color: ${token.image.color};
    flex-shrink: 0;
`;

const titleStyle = css`
    margin: 0 0 ${token.title['margin-bottom']};
    color: ${token.title.color};
    font-size: ${token.title['font-size']};
    font-weight: ${token.title['font-weight']};
    line-height: 1.4;
`;

const descriptionStyle = css`
    margin: 0 0 ${token.description['margin-bottom']};
    color: ${token.description.color};
    font-size: ${token.description['font-size']};
    line-height: 1.6;
    max-width: 320px;
`;

const actionStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 4px;
`;

// ─── 预置插图映射 ─────────────────────────────────────────────────────────────

const PRESET_ILLUSTRATIONS: Record<EmptyPreset, FC<{ width?: string | number; height?: string | number; className?: string }>> = {
    'default': NoDataIllustration,
    'search': SearchNotFoundIllustration,
    'no-permission': NoPermissionIllustration,
};

// ─── 组件 ─────────────────────────────────────────────────────────────────────

const Empty: FC<EmptyProps> = ({
    preset = 'default',
    image,
    imageSize = token.image.size,
    title,
    description,
    action,
    className,
    ...restProps
}) => {
    const resolvedTitle = title !== undefined ? title : DEFAULT_TITLES[preset];
    const resolvedDescription = description !== undefined ? description : DEFAULT_DESCRIPTIONS[preset];

    const renderImage = () => {
        if (image !== undefined) {
            return (
                <div className={imageStyle}>
                    {image}
                </div>
            );
        }

        const Illustration = PRESET_ILLUSTRATIONS[preset];
        const sizeValue = typeof imageSize === 'number' ? `${imageSize}px` : imageSize;

        return (
            <div className={imageStyle}>
                <Illustration width={sizeValue} height={sizeValue} />
            </div>
        );
    };

    return (
        <div
            role="status"
            aria-label={typeof resolvedTitle === 'string' ? resolvedTitle : undefined}
            className={cx(containerStyle, className)}
            {...restProps}
        >
            {renderImage()}
            {resolvedTitle !== null && resolvedTitle !== undefined && (
                <p className={titleStyle}>{resolvedTitle}</p>
            )}
            {resolvedDescription !== null && resolvedDescription !== undefined && (
                <p className={descriptionStyle}>{resolvedDescription}</p>
            )}
            {action && (
                <div className={actionStyle}>
                    {action}
                </div>
            )}
        </div>
    );
};

export default Empty;
