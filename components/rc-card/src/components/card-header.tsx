import { css, cx } from '@crab-dev/css';
import { use, type MouseEvent } from 'react';
import token from '../token.js';
import { CardContext } from '../context.js';
import type { CardHeaderProps } from '../types.js';

// 标题区：下方留白交给后续区块（body 通过 [data-card-header] + & 压缩顶距），
// 自身只负责顶部与两侧的容器边距。
const headerStyle = css`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--rc-card-gap, ${token.size.middle.gap});
    padding: var(--rc-card-pad, ${token.size.middle.padding});
    padding-bottom: 0;
`;

const titleStyle = css`
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${token.header['title-color']};
    font-size: var(--rc-card-title-size, ${token.size.middle['title-size']});
    font-weight: ${token.header['title-weight']};
    line-height: 1.4;
`;

const extraStyle = css`
    flex-shrink: 0;
`;

const CardHeader = ({ title, extra, className, ref, ...restProps }: CardHeaderProps) => {
    const { clickable } = use(CardContext);

    // 整卡可点击时, extra 内操作（按钮 / 链接）的点击不得冒泡触发整卡 onClick。
    // 键盘路径无需等价处理：焦点落在 extra 内控件上时, Enter / Space 由该控件消费,
    // 不会再触发卡片根节点的键盘激活。
    const stopBubble = clickable
        ? (e: MouseEvent<HTMLDivElement>) => e.stopPropagation()
        : undefined;

    return (
        <div {...restProps} ref={ref} data-card-header="" className={cx(headerStyle, className)}>
            {title != null && <div className={titleStyle}>{title}</div>}
            {extra != null && (
                <div className={extraStyle} onClick={stopBubble}>
                    {extra}
                </div>
            )}
        </div>
    );
};

export default CardHeader;
