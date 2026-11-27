import { css, cx } from '@crab-dev/css';
import type { FlexProps } from './types.js';
import VirtualFlex from './virtual-flex.js';

const layoutStyle = css`
    display: flex;
`;

/** 弹性布局；提供 virtual 时按可视行渲染内容。 */
export default function Flex(props: FlexProps) {
    if (props.virtual) return <VirtualFlex {...props} />;

    const { direction, wrap, align, justify, gap, children, className, style, virtual: _virtual, ...rest } = props;
    return (
        <div
            {...rest}
            className={cx(layoutStyle, className)}
            style={{ flexDirection: direction, flexWrap: wrap, alignItems: align, justifyContent: justify, gap, ...style }}
        >
            {children}
        </div>
    );
}
