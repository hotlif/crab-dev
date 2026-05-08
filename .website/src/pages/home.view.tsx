import { css } from "@linaria/core";
import { useEffect } from "react";
import { Link } from "react-router";
import manifest from "../_generated/manifest.js";
import { ArrowRightIcon, SparkIcon, PackageIcon, CodeIcon } from "../components/icons.js";

const heroStyle = css`
    position: relative;
    padding: 92px 24px 64px;
    overflow: hidden;
    isolation: isolate;
    text-align: center;

    @media (max-width: 720px) {
        padding: 80px 16px 56px;
    }
`;

const heroInnerStyle = css`
    max-width: 1180px;
    margin: 0 auto;
`;

const heroStageStyle = css`
    position: relative;
    border: 1px solid var(--border);
    border-radius: calc(var(--radius-xl) + 6px);
    background:
        radial-gradient(120% 90% at 100% 0%, color-mix(in oklab, var(--tone-cyan-soft) 70%, transparent), transparent 60%),
        radial-gradient(120% 90% at 0% 100%, color-mix(in oklab, var(--tone-amber-soft) 60%, transparent), transparent 65%),
        var(--card);
    box-shadow: var(--shadow-md);
    padding: 34px 30px 30px;
    overflow: hidden;
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: 22px;
    align-items: center;

    &::before {
        content: "";
        position: absolute;
        left: 18px;
        right: 18px;
        top: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--border-default), transparent);
        pointer-events: none;
    }

    @media (max-width: 720px) {
        padding: 22px 14px 20px;
        border-radius: calc(var(--radius-xl) + 2px);
        grid-template-columns: 1fr;
        gap: 14px;
    }
`;

const heroContentStyle = css`
    text-align: left;

    @media (max-width: 720px) {
        text-align: center;
    }
`;

const heroVisualStyle = css`
    position: relative;
`;

const heroPreviewPanelStyle = css`
    border: 1px solid var(--border);
    border-radius: calc(var(--radius-xl) + 2px);
    background: linear-gradient(180deg, var(--card), var(--surface-base));
    box-shadow: var(--shadow-sm);
    overflow: hidden;

    > .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 12px 14px;
        border-bottom: 1px solid var(--border);
        background: color-mix(in oklab, var(--tone-cyan-soft) 34%, var(--card));
    }

    > .head > .title {
        font-size: 12px;
        font-family: var(--font-mono);
        color: var(--muted-foreground);
    }

    > .head > .badge {
        font-size: 11px;
        border: 1px solid var(--border);
        border-radius: 999px;
        padding: 3px 8px;
        color: var(--foreground);
        background: var(--background);
    }

    > .body {
        padding: 14px;
    }
`;

const heroMetricsGridStyle = css`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;

    @media (max-width: 720px) {
        grid-template-columns: 1fr;
    }
`;

const heroMetricCardStyle = css`
    --hero-metric-accent: var(--tone-cyan);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--background);
    padding: 11px 12px;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);

    &::before {
        content: "";
        display: block;
        width: 32px;
        height: 2px;
        border-radius: 999px;
        background: color-mix(in oklab, var(--hero-metric-accent) 70%, transparent);
        margin-bottom: 8px;
    }

    &:hover {
        border-color: var(--border-default);
        box-shadow: var(--shadow-sm);
        transform: translateY(-1px);
    }

    > .label {
        display: block;
        font-size: 10px;
        font-family: var(--font-mono);
        letter-spacing: 0.02em;
        color: var(--muted-foreground);
        margin-bottom: 6px;
    }

    > .value {
        display: block;
        font-size: 26px;
        line-height: 1.02;
        letter-spacing: -0.03em;
        color: color-mix(in oklab, var(--foreground) 88%, var(--hero-metric-accent));
        font-weight: 700;
        margin-bottom: 4px;
    }

    > .desc {
        display: block;
        font-size: 12px;
        line-height: 1.45;
        color: var(--muted-foreground);
    }

    &.toneAmber {
        --hero-metric-accent: var(--tone-amber);
    }

    &.toneRose {
        --hero-metric-accent: var(--tone-rose);
    }

    &.wide {
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 10px 12px;
        align-items: baseline;

        > .label {
            grid-column: 1 / -1;
            margin-bottom: 0;
        }

        > .value {
            margin-bottom: 0;
        }

        > .desc {
            align-self: center;
        }
    }
`;

const heroStageGlowStyle = css`
    position: absolute;
    width: 420px;
    height: 420px;
    right: -180px;
    top: -180px;
    border-radius: 999px;
    pointer-events: none;
    background: radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--tone-cyan) 20%, transparent), transparent 72%);
    opacity: 0.8;
    filter: blur(12px);

    @media (max-width: 720px) {
        width: 300px;
        height: 300px;
        right: -150px;
        top: -150px;
    }
`;

const heroFloatingDotStyle = css`
    position: absolute;
    width: 280px;
    height: 280px;
    border-radius: 999px;
    pointer-events: none;
    z-index: -1;
    filter: blur(20px);
    opacity: 0.2;
    animation: floatY 10s ease-in-out infinite;

    &.left {
        left: -80px;
        top: 30%;
        background: radial-gradient(circle at 50% 50%, var(--aurora-1), transparent 70%);
    }

    &.right {
        right: -80px;
        top: 8%;
        background: radial-gradient(circle at 50% 50%, var(--aurora-2), transparent 70%);
        animation-delay: 2s;
    }

    &.center {
        left: 45%;
        top: -80px;
        width: 240px;
        height: 240px;
        background: radial-gradient(circle at 50% 50%, var(--aurora-3), transparent 70%);
        animation-delay: 1s;
    }

    @keyframes floatY {
        0%, 100% { transform: translate3d(0, 0, 0); }
        50% { transform: translate3d(0, -14px, 0); }
    }

    @media (max-width: 960px) {
        width: 220px;
        height: 220px;
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const auroraStyle = css`
    position: absolute;
    inset: -10%;
    z-index: -1;
    pointer-events: none;
    background:
        radial-gradient(ellipse 44% 30% at 28% 30%, var(--aurora-1) 0%, transparent 70%),
        radial-gradient(ellipse 42% 36% at 76% 20%, var(--aurora-2) 0%, transparent 72%),
        radial-gradient(ellipse 58% 28% at 50% 84%, var(--aurora-3) 0%, transparent 75%);
    opacity: 0.34;
    filter: blur(34px);
    animation: drift 18s ease-in-out infinite alternate;

    @keyframes drift {
        0% { transform: translate3d(0, 0, 0) scale(1); }
        100% { transform: translate3d(2%, -2%, 0) scale(1.05); }
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const gridLinesStyle = css`
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background-image:
        linear-gradient(var(--border-subtle) 1px, transparent 1px),
        linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent 80%);
    -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent 80%);
    opacity: 0.2;
`;

const eyebrowStyle = css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 9999px;
    border: 1px solid var(--border);
    background: linear-gradient(90deg, var(--tone-cyan-soft), var(--card) 46%, var(--tone-amber-soft));
    color: var(--muted-foreground);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
`;

const heroEnterStyle = css`
    opacity: 0;
    transform: translate3d(0, 18px, 0);
    animation: heroEnter 760ms cubic-bezier(0.22, 1, 0.36, 1) forwards;

    &.d1 { animation-delay: 120ms; }
    &.d2 { animation-delay: 200ms; }
    &.d3 { animation-delay: 300ms; }
    &.d4 { animation-delay: 420ms; }

    @keyframes heroEnter {
        from {
            opacity: 0;
            transform: translate3d(0, 18px, 0);
        }
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        opacity: 1;
        transform: none;
        animation: none;
    }
`;

const headlineStyle = css`
    --headline-sheen-color: oklch(24% 0.02 240 / 0.18);
    --headline-glow-color: color-mix(in oklab, var(--tone-cyan) 22%, transparent);
    --headline-tint-sat-min: 1.03;
    --headline-tint-sat-max: 1.14;
    --headline-tint-rotate-max: 8deg;

    margin: 22px auto 16px;
    font-size: clamp(34px, 5.2vw, 62px);
    line-height: 1.06;
    letter-spacing: -0.04em;
    font-weight: 700;
    color: var(--text-primary);
    max-width: 12ch;

    em {
        position: relative;
        display: inline-block;
        font-style: normal;
        color: transparent;
        background-image: linear-gradient(
            98deg,
            color-mix(in oklab, var(--foreground) 56%, var(--tone-cyan-soft)) 0%,
            color-mix(in oklab, var(--foreground) 46%, var(--tone-cyan)) 34%,
            color-mix(in oklab, var(--foreground) 50%, var(--tone-rose)) 62%,
            color-mix(in oklab, var(--foreground) 62%, var(--tone-amber)) 82%,
            color-mix(in oklab, var(--foreground) 44%, var(--tone-cyan)) 100%
        );
        background-size: 260% 100%;
        text-shadow: 0 0 0 transparent;
        text-decoration: none;
        -webkit-background-clip: text;
        background-clip: text;
        animation:
            textFlow 8.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite,
            textBreathe 4.8s ease-in-out infinite,
            textTint 6.6s ease-in-out infinite;

        &::after {
            content: "";
            position: absolute;
            inset: -3px -4px;
            border-radius: 8px;
            pointer-events: none;
            background: linear-gradient(112deg, transparent 28%, var(--headline-sheen-color) 48%, transparent 66%);
            transform: translate3d(-46%, 0, 0) skewX(-12deg);
            opacity: 0;
            filter: blur(0.4px);
            animation: textSheen 4.6s ease-in-out infinite;
        }
    }

    @keyframes textFlow {
        0%, 100% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
    }

    @keyframes textBreathe {
        0%, 100% {
            transform: translate3d(0, 0, 0);
            text-shadow: 0 0 0 color-mix(in oklab, var(--tone-cyan) 0%, transparent);
        }
        50% {
            transform: translate3d(0, -0.3px, 0);
            text-shadow: 0 2px 14px var(--headline-glow-color);
        }
    }

    @keyframes textTint {
        0%, 100% {
            filter: saturate(var(--headline-tint-sat-min)) hue-rotate(0deg);
        }
        50% {
            filter: saturate(var(--headline-tint-sat-max)) hue-rotate(var(--headline-tint-rotate-max));
        }
    }

    @keyframes textSheen {
        0%, 42% {
            opacity: 0;
            transform: translate3d(-46%, 0, 0) skewX(-12deg);
        }
        53% {
            opacity: 0.78;
        }
        74%, 100% {
            opacity: 0;
            transform: translate3d(48%, 0, 0) skewX(-12deg);
        }
    }

    :global([data-theme="dark"]) & {
        --headline-sheen-color: oklch(100% 0 0 / 0.32);
        --headline-glow-color: color-mix(in oklab, var(--tone-cyan) 16%, transparent);
        --headline-tint-sat-min: 1.02;
        --headline-tint-sat-max: 1.08;
        --headline-tint-rotate-max: 6deg;
    }

    :global([data-theme="dark"]) & em {
        background-image: linear-gradient(
            98deg,
            color-mix(in oklab, var(--foreground) 80%, var(--tone-cyan-soft)) 0%,
            color-mix(in oklab, var(--foreground) 64%, var(--tone-cyan)) 34%,
            color-mix(in oklab, var(--foreground) 72%, var(--tone-rose-soft)) 62%,
            color-mix(in oklab, var(--foreground) 82%, var(--tone-amber-soft)) 82%,
            color-mix(in oklab, var(--foreground) 72%, var(--tone-cyan)) 100%
        );
    }

    @media (prefers-reduced-motion: reduce) {
        em {
            animation: none;
            background-position: 0 50%;
            text-shadow: none;
        }

        em::after {
            animation: none;
            opacity: 0;
        }
    }
`;

const subtitleStyle = css`
    margin: 0 auto 30px;
    font-size: clamp(15px, 1.4vw, 18px);
    line-height: 1.6;
    color: var(--muted-foreground);
    max-width: 44ch;

    @media (max-width: 720px) {
        max-width: 100%;
    }
`;

const ctaRowStyle = css`
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 12px;

    @media (max-width: 720px) {
        justify-content: center;
    }
`;

const ctaArrowStyle = css`
    transition: transform var(--transition-fast);
`;

const heroMetaStyle = css`
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 8px;

    @media (max-width: 720px) {
        justify-content: center;
    }
`;

const heroMetaItemStyle = css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--border);
    background: var(--card);
    border-radius: 999px;
    padding: 5px 10px;
    font-size: 12px;
    color: var(--muted-foreground);

    strong {
        color: var(--foreground);
        font-weight: 600;
    }
`;

const heroSignalStripStyle = css`
    margin-top: 20px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 6px;

    @media (max-width: 720px) {
        justify-content: center;
    }
`;

const heroSignalItemStyle = css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 9px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--background);
    color: var(--muted-foreground);
    font-size: 10.5px;
    font-family: var(--font-mono);
    opacity: 0.9;
`;

const buttonStyle = css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: calc(var(--radius-md) - 2px);
    border: 1px solid var(--border);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: transform var(--transition-fast), background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);

    &:hover { transform: translateY(-1px); }
    &:active { transform: translateY(0); }
    &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px var(--focus-ring-soft);
    }

    &:hover > .ctaArrow {
        transform: translateX(2px);
    }
`;

const primaryStyle = css`
    background: var(--primary);
    color: var(--primary-foreground);
    border-color: var(--primary);

    &:hover {
        background: var(--accent-foreground);
        color: var(--primary-foreground);
        box-shadow: var(--shadow-sm);
    }
`;

const ghostStyle = css`
    background: var(--card);
    color: var(--foreground);
    border-color: var(--border);

    &:hover {
        background: var(--accent);
        border-color: var(--border-default);
    }
`;

const sectionStyle = css`
    max-width: 1200px;
    margin: 0 auto;
    padding: 52px 24px;

    @media (max-width: 720px) {
        padding: 56px 16px;
    }
`;

const sectionSurfaceStyle = css`
    border: 1px solid var(--border);
    border-radius: calc(var(--radius-xl) + 4px);
    background: var(--card);
    box-shadow: var(--shadow-sm);
    padding: 28px 24px;

    @media (max-width: 720px) {
        padding: 20px 14px;
    }
`;

const revealStyle = css`
    opacity: 0;
    transform: translate3d(0, 22px, 0);
    transition: opacity 560ms cubic-bezier(0.22, 1, 0.36, 1), transform 560ms cubic-bezier(0.22, 1, 0.36, 1);

    @media (prefers-reduced-motion: reduce) {
        opacity: 1;
        transform: none;
        transition: none;
    }
`;

const revealVisibleStyle = css`
    opacity: 1;
    transform: translate3d(0, 0, 0);
`;

const sectionHeaderStyle = css`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 24px;
    text-align: center;
`;

const sectionEyebrowStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    margin: 0 auto;
    padding: 5px 10px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: linear-gradient(90deg, var(--tone-cyan-soft), var(--background) 50%, var(--tone-rose-soft));
    color: var(--muted-foreground);
    font-size: 11px;
    font-family: var(--font-mono);
    letter-spacing: 0.02em;
`;

const sectionTitleStyle = css`
    font-size: clamp(28px, 3vw, 40px);
    line-height: 1.2;
    letter-spacing: -0.03em;
    font-weight: 700;
    color: var(--text-primary);
`;

const sectionLeadStyle = css`
    font-size: 14px;
    color: var(--muted-foreground);
    max-width: 46ch;
    line-height: 1.6;
    margin: 0 auto;
`;

const featureGridStyle = css`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;

    @media (max-width: 960px) {
        grid-template-columns: 1fr;
    }
`;

const featureCardStyle = css`
    --feature-accent: var(--tone-cyan);
    padding: 22px;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--card);
    position: relative;
    overflow: hidden;
    transition: border-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);

    &::before {
        content: "";
        position: absolute;
        inset: -1px;
        border-radius: inherit;
        pointer-events: none;
        background: radial-gradient(120% 90% at 0% 0%, color-mix(in oklab, var(--feature-accent) 18%, transparent), transparent 65%);
        opacity: 0.7;
        transition: opacity var(--transition-fast);
    }

    &:hover {
        border-color: var(--border-default);
        transform: translateY(-2px);
        box-shadow: var(--shadow-sm);

        &::before {
            opacity: 1;
        }
    }

    &.toneAmber {
        --feature-accent: var(--tone-amber);
    }

    &.toneRose {
        --feature-accent: var(--tone-rose);
    }
`;

const featureCard1Style = css`
    transition-delay: 40ms;
`;

const featureCard2Style = css`
    transition-delay: 120ms;
`;

const featureCard3Style = css`
    transition-delay: 200ms;
`;

const featureIconStyle = css`
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: var(--accent);
    color: var(--foreground);
    border: 1px solid var(--border);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
    animation: iconFloat 5.8s ease-in-out infinite;

    @keyframes iconFloat {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-2px);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const featureTitleStyle = css`
    font-size: 17px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 6px;
`;

const featureDescStyle = css`
    font-size: 14px;
    color: var(--muted-foreground);
    line-height: 1.6;
`;

const workflowSectionStyle = css`
    max-width: 1200px;
    margin: 0 auto;
    padding: 44px 24px 12px;

    @media (max-width: 720px) {
        padding: 36px 16px 16px;
    }
`;

const workflowTrackStyle = css`
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;

    &::before {
        content: "";
        position: absolute;
        left: 18px;
        right: 18px;
        top: 24px;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--border-default), transparent);
        z-index: 0;
    }

    @media (max-width: 960px) {
        grid-template-columns: 1fr;

        &::before {
            display: none;
        }
    }
`;

const workflowCardStyle = css`
    --workflow-accent: var(--tone-cyan);
    position: relative;
    z-index: 1;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--card);
    padding: 18px;
    transition: border-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);

    &::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 2px;
        border-radius: 999px;
        background: linear-gradient(90deg, color-mix(in oklab, var(--workflow-accent) 74%, transparent), transparent);
        opacity: 0.72;
    }

    &:hover {
        border-color: var(--border-default);
        transform: translateY(-2px);
        box-shadow: var(--shadow-sm);
    }

    > .step {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 999px;
        border: 1px solid var(--border);
        background: var(--background);
        color: var(--foreground);
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 12px;
        box-shadow: 0 0 0 0 color-mix(in oklab, var(--workflow-accent) 38%, transparent);
        animation: stepPulse 4.8s ease-in-out infinite;
    }

    @keyframes stepPulse {
        0%, 100% {
            box-shadow: 0 0 0 0 color-mix(in oklab, var(--workflow-accent) 0%, transparent);
        }
        50% {
            box-shadow: 0 0 0 6px color-mix(in oklab, var(--workflow-accent) 20%, transparent);
        }
    }

    > .title {
        display: block;
        font-size: 16px;
        font-weight: 650;
        color: var(--foreground);
        margin-bottom: 8px;
    }

    > .desc {
        font-size: 13.5px;
        line-height: 1.6;
        color: var(--muted-foreground);
        margin-bottom: 12px;
    }

    > .meta {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        color: var(--muted-foreground);
        font-family: var(--font-mono);
    }

    &.toneAmber {
        --workflow-accent: var(--tone-amber);
    }

    &.toneRose {
        --workflow-accent: var(--tone-rose);
    }

    @media (prefers-reduced-motion: reduce) {
        > .step {
            animation: none;
            box-shadow: none;
        }
    }
`;

const previewSectionStyle = css`
    max-width: 1200px;
    margin: 0 auto;
    padding: 14px 24px 20px;

    @media (max-width: 720px) {
        padding: 12px 16px 20px;
    }
`;

const previewWrapStyle = css`
    position: relative;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background:
        linear-gradient(180deg, var(--showcase-top-tint), transparent),
        var(--card);
    overflow: hidden;
    padding: 18px;
    box-shadow: 0 1px 2px oklch(0% 0 0 / 0.03);

    > .topGlow {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--border-default), transparent);
        opacity: 0.75;
        pointer-events: none;
        z-index: 3;
    }

    > .scanLight {
        position: absolute;
        top: -20%;
        left: -30%;
        width: 34%;
        height: 140%;
        pointer-events: none;
        background: linear-gradient(100deg, transparent 10%, var(--showcase-scan-glow) 50%, transparent 90%);
        transform: translate3d(-120%, 0, 0);
        animation: scanX 16s ease-in-out infinite;
        z-index: 1;
    }

    @keyframes scanX {
        0%, 18% {
            transform: translate3d(-120%, 0, 0);
            opacity: 0;
        }
        40% {
            opacity: 0.6;
        }
        62% {
            transform: translate3d(320%, 0, 0);
            opacity: 0;
        }
        100% {
            transform: translate3d(320%, 0, 0);
            opacity: 0;
        }
    }

    /* Subtle texture for a more product-like showcase surface. */
    &::selection {
        background: transparent;
    }

    & .laneA,
    & .laneB {
        animation-play-state: running;
    }

    &:hover .laneA,
    &:hover .laneB,
    &:focus-within .laneA,
    &:focus-within .laneB {
        animation-play-state: paused;
    }

    &::before,
    &::after {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        width: 72px;
        pointer-events: none;
        z-index: 2;
    }

    &::before {
        left: 0;
        background: linear-gradient(90deg, var(--card), transparent);
    }

    &::after {
        right: 0;
        background: linear-gradient(270deg, var(--card), transparent);
    }

    @media (prefers-reduced-motion: reduce) {
        > .scanLight {
            animation: none;
            opacity: 0;
        }
    }

`;

const previewHeaderStyle = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;

    > .title {
        font-size: 14px;
        font-weight: 700;
        letter-spacing: -0.01em;
        color: var(--foreground);
    }

    > .caption {
        font-size: 12px;
        color: var(--muted-foreground);
        font-family: var(--font-mono);
    }
`;


const previewLaneStyle = css`
    display: flex;
    gap: 10px;
    width: max-content;
    will-change: transform;
    position: relative;
    z-index: 2;

    &.laneA {
        animation: laneScrollLeft 120s linear infinite;
    }

    &.laneB {
        margin-top: 10px;
        animation: laneScrollRight 120s linear infinite;
    }

    @keyframes laneScrollLeft {
        0% {
            transform: translate3d(0, 0, 0);
        }
        100% {
            transform: translate3d(-50%, 0, 0);
        }
    }

    @keyframes laneScrollRight {
        0% {
            transform: translate3d(-50%, 0, 0);
        }
        100% {
            transform: translate3d(0, 0, 0);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        &.laneA,
        &.laneB {
            transform: none;
            animation: none;
        }
    }
`;

const previewCardStyle = css`
    width: 216px;
    position: relative;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: calc(var(--radius-md) + 2px);
    background: var(--background);
    box-shadow: var(--shadow-sm);
    transition: transform var(--transition-fast), border-color var(--transition-fast), filter var(--transition-fast), opacity var(--transition-fast);

    &.front {
        opacity: 1;
        filter: saturate(1);
        transform: translateY(0) scale(1);
        animation: cardDriftFront 7.8s ease-in-out infinite;
    }

    &.back {
        opacity: 0.74;
        filter: saturate(0.9);
        transform: translateY(3px) scale(0.99);
        animation: cardDriftBack 8.4s ease-in-out infinite;
    }

    @keyframes cardDriftFront {
        0%, 100% {
            transform: translateY(0) scale(1);
        }
        50% {
            transform: translateY(-2px) scale(1.003);
        }
    }

    @keyframes cardDriftBack {
        0%, 100% {
            transform: translateY(3px) scale(0.99);
        }
        50% {
            transform: translateY(1px) scale(0.992);
        }
    }

    > .head {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 8px;
        margin-bottom: 8px;
        padding-right: 54px;
    }

    > .head > .dot {
        width: 18px;
        height: 18px;
        border-radius: 6px;
        border: 1px solid var(--border);
        background: var(--accent);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--foreground);
    }

    &.laneB {
        > .head > .dot {
            background: var(--tone-amber-soft);
            border-color: color-mix(in oklab, var(--tone-amber) 45%, var(--border));
            color: color-mix(in oklab, var(--tone-amber) 65%, var(--foreground));
        }
    }

    > .head > .pkg {
        font-size: 10px;
        color: var(--muted-foreground);
        font-family: var(--font-mono);
    }

    > .head > .version {
        position: absolute;
        top: 9px;
        right: 9px;
        font-size: 10px;
        font-family: var(--font-mono);
        color: var(--foreground);
        border: 1px solid var(--border);
        border-radius: 999px;
        padding: 2px 7px;
        background: color-mix(in oklab, var(--card) 78%, var(--tone-cyan-soft));
        white-space: nowrap;
    }

    > .name {
        display: block;
        font-size: 13px;
        color: var(--foreground);
        font-weight: 600;
        margin-bottom: 6px;
    }

    > .desc {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-size: 11.5px;
        line-height: 1.5;
        color: var(--muted-foreground);
    }

    @media (prefers-reduced-motion: reduce) {
        &.front,
        &.back {
            animation: none;
        }
    }
`;

const componentGridStyle = css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 12px;
`;

const componentCardStyle = css`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface-raised);
    color: var(--text-primary);
    text-decoration: none;
    transition: border-color var(--transition-fast), background-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);

    &:hover {
        border-color: var(--border-default);
        background: var(--accent);
        transform: translateY(-1px);
        box-shadow: var(--shadow-sm);

        > .cardTop > .iconWrap {
            transform: translate3d(0, -1px, 0) scale(1.06) rotate(-6deg);
            background: var(--foreground);
            color: var(--background);
            border-color: var(--foreground);
        }
    }

    &:focus-visible {
        outline: none;
        border-color: var(--ring);
        box-shadow: 0 0 0 3px var(--focus-ring-soft), var(--shadow-sm);

        > .cardTop > .iconWrap {
            transform: translate3d(0, -1px, 0) scale(1.04);
            border-color: var(--ring);
        }
    }

    > .cardTop {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2px;
        padding-right: 58px;
    }

    > .cardTop > .iconWrap {
        width: 22px;
        height: 22px;
        border-radius: 7px;
        border: 1px solid var(--border);
        background: var(--background);
        color: var(--muted-foreground);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: transform var(--transition-fast), background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
    }

    > .cardTop > .meta {
        font-size: 11px;
        color: var(--muted-foreground);
        font-family: var(--font-mono);
    }

    > .name {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
    }

    > .desc {
        font-size: 12.5px;
        color: var(--muted-foreground);
        line-height: 1.55;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    > .version {
        position: absolute;
        top: 12px;
        right: 12px;
        display: inline-flex;
        font-size: 10.5px;
        font-family: var(--font-mono);
        color: var(--foreground);
        border: 1px solid var(--border);
        border-radius: 999px;
        padding: 2px 8px;
        background: color-mix(in oklab, var(--card) 80%, var(--tone-cyan-soft));
    }
`;

const HomeView = () => {
    type PreviewItem = {
        slug: string;
        title: string;
        description?: string;
        version?: string;
    };

    const getPreviewVersionLabel = (item: PreviewItem): string => {
        const raw = (item.version ?? "unknown").trim();
        return raw.startsWith("v") ? raw : `v${raw}`;
    };

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const revealNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal='true']"));
        if (revealNodes.length === 0) {
            return;
        }

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(revealVisibleStyle);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.18,
                rootMargin: "0px 0px -10% 0px",
            },
        );

        revealNodes.forEach(node => observer.observe(node));

        return () => {
            observer.disconnect();
        };
    }, []);

    const previewItems = manifest as PreviewItem[];
    const previewLaneA = [...previewItems, ...previewItems];
    const previewLaneB = [...previewItems.slice().reverse(), ...previewItems.slice().reverse()];

    return (
        <>
            <section className={heroStyle}>
                <div aria-hidden className={gridLinesStyle} />
                <div aria-hidden className={auroraStyle} />
                <div aria-hidden className={`${heroFloatingDotStyle} left`} />
                <div aria-hidden className={`${heroFloatingDotStyle} right`} />
                <div aria-hidden className={`${heroFloatingDotStyle} center`} />
                <div className={heroInnerStyle}>
                    <div className={heroStageStyle}>
                        <div aria-hidden className={heroStageGlowStyle} />
                        <div className={heroContentStyle}>
                            <span className={`${eyebrowStyle} ${heroEnterStyle} d1`}>
                                <SparkIcon />
                                production-grade ui system
                            </span>
                            <h1 className={`${headlineStyle} ${heroEnterStyle} d2`}>
                                让组件系统成为你的 <em>体验资产</em>
                            </h1>
                            <p className={`${subtitleStyle} ${heroEnterStyle} d3`}>
                                提供的不只是组件，而是一套可复制的体验标准。
                                从主题一致性到交互反馈，帮助团队稳定交付高质量界面。
                            </p>
                            <div className={`${ctaRowStyle} ${heroEnterStyle} d4`}>
                                <Link to="/components" className={`${buttonStyle} ${primaryStyle}`}>
                                    立即浏览组件
                                    <span className={`${ctaArrowStyle} ctaArrow`}><ArrowRightIcon /></span>
                                </Link>
                                <a
                                    href="https://github.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`${buttonStyle} ${ghostStyle}`}
                                >
                                    查看 GitHub
                                </a>
                            </div>
                            <div className={`${heroMetaStyle} ${heroEnterStyle} d4`}>
                                <span className={heroMetaItemStyle}><strong>{manifest.length}</strong> 个组件</span>
                                <span className={heroMetaItemStyle}><strong>Light / Dark</strong> 双主题</span>
                                <span className={heroMetaItemStyle}><strong>0 Runtime CSS</strong> 样式输出</span>
                            </div>
                            <div className={`${heroSignalStripStyle} ${heroEnterStyle} d4`}>
                                <span className={heroSignalItemStyle}>design-token-first</span>
                                <span className={heroSignalItemStyle}>a11y-ready baseline</span>
                                <span className={heroSignalItemStyle}>demo-driven documentation</span>
                            </div>
                        </div>

                        <div className={`${heroVisualStyle} ${heroEnterStyle} d3`}>
                            <div className={heroPreviewPanelStyle}>
                                <div className="head">
                                    <span className="title">Core Product Metrics</span>
                                    <span className="badge">real-time overview</span>
                                </div>
                                <div className="body">
                                    <div className={heroMetricsGridStyle}>
                                        <div className={heroMetricCardStyle}>
                                            <span className="label">Library Coverage</span>
                                            <span className="value">{manifest.length}+</span>
                                            <span className="desc">覆盖基础交互到复合场景，减少重复造轮子。</span>
                                        </div>
                                        <div className={`${heroMetricCardStyle} toneAmber`}>
                                            <span className="label">Theme Reliability</span>
                                            <span className="value">100%</span>
                                            <span className="desc">关键展示层由语义变量驱动，深浅主题切换无断层。</span>
                                        </div>
                                        <div className={`${heroMetricCardStyle} toneRose`}>
                                            <span className="label">Motion Discipline</span>
                                            <span className="value">3-tier</span>
                                            <span className="desc">入场、滚动、微交互分层管理，并兼容 reduced-motion。</span>
                                        </div>
                                        <div className={`${heroMetricCardStyle} wide`}>
                                            <span className="label">Engineering Fit</span>
                                            <span className="value">PnP</span>
                                            <span className="desc">与 Yarn 4 PnP 和 monorepo 链路无缝协同。</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`${previewSectionStyle} ${revealStyle}`} data-reveal="true">
                <div className={previewWrapStyle}>
                    <span className="topGlow" aria-hidden />
                    <span className="scanLight" aria-hidden />
                    <div className={previewHeaderStyle}>
                        <span className="title">组件预览带</span>
                        <span className="caption">component-only · auto scrolling</span>
                    </div>
                    <div className={`${previewLaneStyle} laneA`}>
                        {previewLaneA.map((item, index) => (
                            <div
                                className={`${previewCardStyle} ${index % 3 === 1 ? "back" : "front"}`}
                                key={`preview-a-${item.slug}-${index}`}
                            >
                                <div className="head">
                                    <span className="dot"><PackageIcon /></span>
                                    <span className="pkg">@crab-dev/{item.slug}</span>
                                    <span className="version">{getPreviewVersionLabel(item)}</span>
                                </div>
                                <span className="name">{item.title}</span>
                                <span className="desc">{item.description ?? `@crab-dev/${item.slug} 组件`}</span>
                            </div>
                        ))}
                    </div>
                    <div className={`${previewLaneStyle} laneB`}>
                        {previewLaneB.map((item, index) => (
                            <div
                                className={`${previewCardStyle} ${index % 3 === 0 ? "back" : "front"}`}
                                key={`preview-b-${item.slug}-${index}`}
                            >
                                <div className="head">
                                    <span className="dot"><PackageIcon /></span>
                                    <span className="pkg">@crab-dev/{item.slug}</span>
                                    <span className="version">{getPreviewVersionLabel(item)}</span>
                                </div>
                                <span className="name">{item.title}</span>
                                <span className="desc">{item.description ?? `@crab-dev/${item.slug} 组件`}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={`${workflowSectionStyle} ${revealStyle}`} data-reveal="true">
                <div className={sectionSurfaceStyle}>
                    <div className={sectionHeaderStyle}>
                        <span className={sectionEyebrowStyle}>delivery workflow</span>
                        <h2 className={sectionTitleStyle}>从评估到上线，始终同一节奏</h2>
                        <p className={sectionLeadStyle}>
                            统一规范让产品、设计、前端在同一条路径协作，降低返工与沟通摩擦。
                        </p>
                    </div>
                    <div className={workflowTrackStyle}>
                        <article className={`${workflowCardStyle} ${revealStyle}`} data-reveal="true">
                            <span className="step">01</span>
                            <span className="title">快速评估组件能力</span>
                            <p className="desc">
                                在总览和示例中快速建立边界认知，判断是否匹配当前页面目标。
                            </p>
                            <span className="meta">preview · compare · decide</span>
                        </article>
                        <article className={`${workflowCardStyle} toneAmber ${revealStyle}`} data-reveal="true">
                            <span className="step">02</span>
                            <span className="title">接入并验证主题一致性</span>
                            <p className="desc">
                                语义变量驱动 light / dark，在同一屏内验证视觉一致与状态反馈。
                            </p>
                            <span className="meta">token · theme · a11y</span>
                        </article>
                        <article className={`${workflowCardStyle} toneRose ${revealStyle}`} data-reveal="true">
                            <span className="step">03</span>
                            <span className="title">规模化复制到业务页面</span>
                            <p className="desc">
                                在 monorepo 链路中复用组件与规范，保持多人并行下的稳定输出。
                            </p>
                            <span className="meta">reuse · ship · evolve</span>
                        </article>
                    </div>
                </div>
            </section>

            <section className={`${sectionStyle} ${revealStyle}`} data-reveal="true">
                <div className={sectionHeaderStyle}>
                    <h2 className={sectionTitleStyle}>一套视觉语言，贯穿设计到交付</h2>
                    <p className={sectionLeadStyle}>
                        不是堆视觉，而是构建可复用的体验标准。边框、层级、状态与排版始终一致。
                    </p>
                </div>
                <div className={featureGridStyle}>
                    <div className={`${featureCardStyle} ${revealStyle} ${featureCard1Style}`} data-reveal="true">
                        <span className={featureIconStyle}><SparkIcon /></span>
                        <div className={featureTitleStyle}>语义 Token 驱动</div>
                        <p className={featureDescStyle}>
                            颜色、边框、阴影和焦点环全部由 token 控制，主题升级不需要大范围重写组件样式。
                        </p>
                    </div>
                    <div className={`${featureCardStyle} toneAmber ${revealStyle} ${featureCard2Style}`} data-reveal="true">
                        <span className={featureIconStyle}><CodeIcon /></span>
                        <div className={featureTitleStyle}>叙事型文档布局</div>
                        <p className={featureDescStyle}>
                            首屏、总览、详情页都使用统一信息结构，快速建立认知路径，减少阅读跳转成本。
                        </p>
                    </div>
                    <div className={`${featureCardStyle} toneRose ${revealStyle} ${featureCard3Style}`} data-reveal="true">
                        <span className={featureIconStyle}><PackageIcon /></span>
                        <div className={featureTitleStyle}>工程链路无缝兼容</div>
                        <p className={featureDescStyle}>
                            风格迁移不会影响组件发现、Demo 运行和 API 展示，现有 monorepo 生产流程可直接复用。
                        </p>
                    </div>
                </div>
            </section>

            <section className={`${sectionStyle} ${revealStyle}`} data-reveal="true">
                <div className={sectionHeaderStyle}>
                    <h2 className={sectionTitleStyle}>开箱即可落地的 {manifest.length} 个组件</h2>
                    <p className={sectionLeadStyle}>
                        从基础交互到复杂容器，每个组件都配套演示与文档，评审前即可完成真实验证。
                    </p>
                </div>
                <div className={componentGridStyle}>
                    {manifest.map(item => (
                        <Link
                            key={item.slug}
                            to={`/components/${item.slug}`}
                            className={`${componentCardStyle} ${revealStyle}`}
                            data-reveal="true"
                        >
                            <span className="cardTop">
                                <span className="iconWrap"><PackageIcon /></span>
                            </span>
                            <span className="name">{item.title}</span>
                            <span className="desc">
                                {item.description || `@crab-dev/${item.slug} 组件`}
                            </span>
                            <span className="version">{getPreviewVersionLabel(item)}</span>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
};

export default HomeView;
