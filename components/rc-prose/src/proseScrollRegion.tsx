import { cx } from '@crab-dev/css';
import { scrollRegionStyle } from './prose.styles.js';
import type { ProseScrollRegionProps } from './types.js';

export default function ProseScrollRegion({ className, ...props }: ProseScrollRegionProps) {
    return <div {...props} className={cx(scrollRegionStyle, className)} role="region" tabIndex={0} />;
}
