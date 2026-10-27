import token from "@crab-dev/rc-token-semantic";
import { canvasViewportStyle } from "../demo-layout.js";
export const meta = {
    title: "文字对齐与多行",
    description: "textAlign（left / center / right）、textBaseline（top / middle / bottom）以及 \\\\n 换行和 maxWidth 自动词换行的综合演示。",
};

import { css, cx } from "@crab-dev/css";
import { Canvas, Line, Text } from "@crab-dev/rc-canvas";

// Wake 0.1.38: preserve both static style bindings across the imported cx composition.
const wrapStyle = css`
    display: block;
    width: fit-content;
    margin: 0 auto;
    border: 1px solid ${token.color.border.default};
    border-radius: ${token.shape.card};
    background: ${token.color.workspace.content};
`;

const ERROR_INK = token.color.feedback.error.text;
const SUCCESS_INK = token.color.feedback.success.text;
const ACCENT_INK = token.color.brand.primary;
const GUIDE = token.color.border.default;
const LABEL = token.color.text.secondary;

export default function TextAdvancedDemo() {
    return (
        <div className={cx.call(undefined, wrapStyle, canvasViewportStyle)} role="region" aria-label={`${meta.title}画布，可横向滚动`} tabIndex={0}>
            <Canvas width={480} height={270}>

                {/* ── textAlign ─────────────────────────────────── */}
                <Text x={240} y={10} fontSize={12} fill={LABEL} textAlign="center">textAlign</Text>

                <Line x1={100} y1={25} x2={100} y2={70} color={GUIDE} lineWidth={1} />
                <Line x1={240} y1={25} x2={240} y2={70} color={GUIDE} lineWidth={1} />
                <Line x1={380} y1={25} x2={380} y2={70} color={GUIDE} lineWidth={1} />

                <Text x={100} y={48} fontSize={14} fill={ERROR_INK} textAlign="left" textBaseline="middle">left</Text>
                <Text x={240} y={48} fontSize={14} fill={SUCCESS_INK} textAlign="center" textBaseline="middle">center</Text>
                <Text x={380} y={48} fontSize={14} fill={ACCENT_INK} textAlign="right" textBaseline="middle">right</Text>

                {/* ── textBaseline（三列，各持一条短参考线）──────── */}
                <Text x={240} y={82} fontSize={12} fill={LABEL} textAlign="center">textBaseline</Text>

                {/* 子标签 */}
                <Text x={105} y={96} fontSize={12} fill={LABEL} textAlign="center">top</Text>
                <Text x={240} y={96} fontSize={12} fill={LABEL} textAlign="center">middle</Text>
                <Text x={375} y={96} fontSize={12} fill={LABEL} textAlign="center">bottom</Text>

                {/* 三列各自短参考线，y 统一 138：
                    top 列文字顶部在 138 → 文字在线下方；
                    middle 文字中心在 138 → 文字跨线；
                    bottom 文字底部在 138 → 文字在线上方，与子标签留足间距 */}
                <Line x1={40}  y1={138} x2={170} y2={138} color={GUIDE} lineWidth={1} />
                <Line x1={185} y1={138} x2={295} y2={138} color={GUIDE} lineWidth={1} />
                <Line x1={310} y1={138} x2={440} y2={138} color={GUIDE} lineWidth={1} />

                {/* 三段文字 y=138，baseline 不同 → 相对参考线的位置不同 */}
                <Text x={105} y={138} fontSize={14} fill={ERROR_INK} textAlign="center" textBaseline="top">AaBb</Text>
                <Text x={240} y={138} fontSize={14} fill={SUCCESS_INK} textAlign="center" textBaseline="middle">AaBb</Text>
                <Text x={375} y={138} fontSize={14} fill={ACCENT_INK} textAlign="center" textBaseline="bottom">AaBb</Text>

                {/* ── 多行 ──────────────────────────────────────── */}
                <Text x={20}  y={160} fontSize={12} fill={LABEL}>{'\\n 换行'}</Text>
                <Text x={20} y={178} fontSize={13} fill={ACCENT_INK} lineHeight={20}>{"第一行\n第二行\n第三行"}</Text>

                <Text x={250} y={160} fontSize={12} fill={LABEL}>maxWidth 自动换行</Text>
                <Text x={250} y={178} fontSize={13} fill={SUCCESS_INK} lineHeight={20} maxWidth={130}>
                    {"自动按宽度换行的长文本 with mixed English"}
                </Text>

            </Canvas>
        </div>
    );
}
