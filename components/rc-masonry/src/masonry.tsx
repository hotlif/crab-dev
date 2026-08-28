import { css, cx } from '@crab-dev/css';
import {
    Children,
    cloneElement,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import type { CSSProperties, FC, ReactElement } from 'react';
import token from './token.js';
import type { MasonryProps } from './types.js';

const containerStyle = css`
    position: relative;
    width: 100%;
`;

const itemStyle = css`
    position: absolute;
    transition: ${token.transition};
`;

interface ItemPosition {
    top: number;
    left: number;
    width: number;
}

const Masonry: FC<MasonryProps> = ({
    columns = 2,
    gutter,
    sequential = false,
    children,
    className,
    style,
    ...restProps
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [positions, setPositions] = useState<ItemPosition[]>([]);
    const [containerHeight, setContainerHeight] = useState(0);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const items = Children.toArray(children);
    const count = items.length;

    // 确保列数至少为 1
    const cols = Math.max(1, Math.floor(columns));

    // 观测容器宽度变化
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerWidth(entry.contentRect.width);
            }
        });

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    // 计算每一项的位置
    const computeLayout = useCallback(() => {
        if (containerWidth === 0 || count === 0) {
            setPositions([]);
            setContainerHeight(0);
            return;
        }

        const gap = gutter ?? 0;
        const colWidth = (containerWidth - gap * (cols - 1)) / cols;
        const colHeights = new Array<number>(cols).fill(0);
        const newPositions: ItemPosition[] = [];

        for (let i = 0; i < count; i++) {
            let colIndex: number;

            if (sequential) {
                colIndex = i % cols;
            } else {
                // 找到最短的列
                colIndex = 0;
                for (let c = 1; c < cols; c++) {
                    if (colHeights[c] < colHeights[colIndex]) {
                        colIndex = c;
                    }
                }
            }

            const left = colIndex * (colWidth + gap);
            const top = colHeights[colIndex];

            newPositions.push({ top, left, width: colWidth });

            // 获取实际子元素高度
            const el = itemRefs.current[i];
            const itemHeight = el ? el.offsetHeight : 0;

            colHeights[colIndex] = top + itemHeight + gap;
        }

        setPositions(newPositions);
        setContainerHeight(Math.max(...colHeights) - gap);
    }, [containerWidth, count, cols, gutter, sequential]);

    // 当项数量或容器宽度变化时，重新布局
    useEffect(() => {
        computeLayout();
    }, [computeLayout]);

    // 观测每个子元素的高度变化
    useEffect(() => {
        const refs = itemRefs.current.filter(Boolean) as HTMLDivElement[];
        if (refs.length === 0) return;

        const observer = new ResizeObserver(() => {
            computeLayout();
        });

        for (const ref of refs) {
            observer.observe(ref);
        }

        return () => observer.disconnect();
    }, [count, computeLayout]);

    const setItemRef = (index: number) => (el: HTMLDivElement | null) => {
        itemRefs.current[index] = el;
    };

    return (
        <div
            ref={containerRef}
            className={cx(containerStyle, className)}
            style={{ ...style, height: containerHeight > 0 ? containerHeight : undefined }}
            {...restProps}
        >
            {items.map((child, index) => {
                const pos = positions[index];
                const itemInlineStyle: CSSProperties = pos
                    ? {
                        transform: `translate(${pos.left}px, ${pos.top}px)`,
                        width: pos.width,
                    }
                    : {
                        visibility: 'hidden' as const,
                    };

                return (
                    <div
                        key={(child as ReactElement).key ?? index}
                        ref={setItemRef(index)}
                        className={itemStyle}
                        style={itemInlineStyle}
                    >
                        {cloneElement(child as ReactElement, {})}
                    </div>
                );
            })}
        </div>
    );
};

export default Masonry;
