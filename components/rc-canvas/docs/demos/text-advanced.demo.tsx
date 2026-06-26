/**
 * title = "文字对齐与多行"
 * description = "textAlign（left / center / right）、textBaseline（top / middle / bottom）以及 \\n 换行和 maxWidth 自动词换行的综合演示。"
 */

import { css } from "@linaria/core";
import { Canvas, Line, Text } from "../../src/index.js";

const wrapStyle = css`
    display: block;
    width: fit-content;
    margin: 0 auto;
    border: 1px solid var(--border-subtle, #e5e5e5);
    border-radius: 8px;
    overflow: hidden;
    background: #fafafa;
`;

const RED   = "oklch(0.38 0.18 28)";
const GREEN = "oklch(0.38 0.18 160)";
const BLUE  = "oklch(0.38 0.18 255)";
const GUIDE = "oklch(0.80 0.05 250)";
const LABEL = "oklch(0.55 0 0)";

export default function TextAdvancedDemo() {
    return (
        <div className={wrapStyle}>
            <Canvas width={480} height={270}>

                {/* ── textAlign ─────────────────────────────────── */}
                <Text x={240} y={10} fontSize={12} fill={LABEL} textAlign="center">textAlign</Text>

                <Line x1={100} y1={25} x2={100} y2={70} color={GUIDE} lineWidth={1} />
                <Line x1={240} y1={25} x2={240} y2={70} color={GUIDE} lineWidth={1} />
                <Line x1={380} y1={25} x2={380} y2={70} color={GUIDE} lineWidth={1} />

                <Text x={100} y={48} fontSize={14} fill={RED}   textAlign="left"   textBaseline="middle">left</Text>
                <Text x={240} y={48} fontSize={14} fill={GREEN} textAlign="center" textBaseline="middle">center</Text>
                <Text x={380} y={48} fontSize={14} fill={BLUE}  textAlign="right"  textBaseline="middle">right</Text>

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
                <Text x={105} y={138} fontSize={14} fill={RED}   textAlign="center" textBaseline="top">AaBb</Text>
                <Text x={240} y={138} fontSize={14} fill={GREEN} textAlign="center" textBaseline="middle">AaBb</Text>
                <Text x={375} y={138} fontSize={14} fill={BLUE}  textAlign="center" textBaseline="bottom">AaBb</Text>

                {/* ── 多行 ──────────────────────────────────────── */}
                <Text x={20}  y={160} fontSize={12} fill={LABEL}>{'\\n 换行'}</Text>
                <Text x={20}  y={178} fontSize={13} fill={BLUE}  lineHeight={20}>{"第一行\n第二行\n第三行"}</Text>

                <Text x={250} y={160} fontSize={12} fill={LABEL}>maxWidth 自动换行</Text>
                <Text x={250} y={178} fontSize={13} fill={GREEN} lineHeight={20} maxWidth={130}>
                    {"自动按宽度换行的长文本 with mixed English"}
                </Text>

            </Canvas>
        </div>
    );
}
