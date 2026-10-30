import { cx } from "@crab-dev/css";
import type { HTMLAttributes, Ref } from "react";
import { sizeStyleOf } from "./indicator.js";
import type { SpinSize } from "./types.js";
import { expressiveStyle } from "./expressiveIndicator.styles.js";
export interface ExpressiveSpinIndicatorProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
    size?: SpinSize;
    ref?: Ref<HTMLSpanElement>;
}

/** 纯视觉的 M3 Expressive 形变加载指示器；加载语义由 Spin 或宿主提供。 */
const ExpressiveSpinIndicator = ({ size, className, ref, ...restProps }: ExpressiveSpinIndicatorProps) => (
    <span
        {...restProps}
        ref={ref}
        data-indicator="expressive"
        className={cx(expressiveStyle, size !== undefined && sizeStyleOf(size), className)}
        aria-hidden="true"
    />
);

export default ExpressiveSpinIndicator;
