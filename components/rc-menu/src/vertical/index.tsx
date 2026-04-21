import { useEffect, useRef, useState, type FC } from "react";

import { type MenuProps } from "../menu.js";
import VerticalNormalMenu from "./normal.js";
import VerticalCollapsedMenu from "./collapsed.js";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface VerticalMenuProps extends Omit<MenuProps, "mode"> {}

// 与外层宽度动画对齐的切换延迟（贴近 semantic `motion.expand` 的 duration.slow = 300ms）。
// 展开：立即切回 normal（让文字随宽度增长自然出现）；
// 收起：等外层宽度动画结束再切到 collapsed（避免文本被瞬间吞掉的撕裂感）。
const SWAP_DELAY_MS = 300;

const VerticalMenu: FC<VerticalMenuProps> = (props) => {
    const [showCollapsed, setShowCollapsed] = useState(Boolean(props.inlineCollapsed));
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (props.inlineCollapsed) {
            timerRef.current = setTimeout(() => {
                setShowCollapsed(true);
                timerRef.current = null;
            }, SWAP_DELAY_MS);
        } else {
            setShowCollapsed(false);
        }

        return () => {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [props.inlineCollapsed]);

    if (showCollapsed) {
        return <VerticalCollapsedMenu {...props} />;
    }
    return <VerticalNormalMenu {...props} />;
};

export default VerticalMenu;
