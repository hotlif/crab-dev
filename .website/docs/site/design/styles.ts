import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
.crab-design-workspace { color: ${token.color.text.primary}; }
.crab-design-workspace :is(h1, h2, h3, p) { margin: 0; }
.crab-design-workspace h2 { font-size: clamp(1.25rem, 2vw, 1.55rem); line-height: 1.35; }
.crab-design-workspace h3 { font-size: 1.15rem; line-height: 1.45; }
.crab-design-hero { isolation: isolate; position: relative; overflow: hidden; display: flex; align-items: center; min-height: 10.75rem; padding: 2rem clamp(1.25rem, 3vw, 2.5rem); border-radius: ${token.shape.card}; background: color-mix(in oklab, ${token.color.brand.primary} 10%, ${token.color.surface.low}); }
.crab-design-hero > div:first-child { position: relative; z-index: 1; max-width: 65%; }
.crab-design-crumb, .crab-design-body small { font-size: .81rem; font-weight: 550; color: ${token.color.text.secondary}; }
.crab-design-crumb a { color: ${token.color.text.link}; }
.crab-design-title { display: flex; align-items: center; gap: .9rem; flex-wrap: wrap; }
.crab-design-hero h1 { font-size: clamp(2rem, 3.3vw, 3rem); line-height: 1.2; margin-block: .35rem .55rem; letter-spacing: -.025em; }
.crab-design-hero p, .crab-design-card-body p, .crab-design-guides p { color: ${token.color.text.secondary}; }
.crab-design-status { display: inline-flex; align-items: center; gap: .35rem; padding: .15rem .6rem; font-size: .75rem; font-weight: 600; color: ${token.color.selection.foreground}; background: ${token.color.background.selected}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.full}; }
.crab-design-status::before, .crab-design-feedback::before { content: ""; display: inline-block; width: .4rem; height: .4rem; border-radius: 50%; background: currentColor; }
.crab-design-body { display: grid; gap: 1.5rem; padding: 1.6rem clamp(.5rem, 2vw, 1.65rem); }
.crab-design-pair { display: grid; grid-template-columns: minmax(0,1.2fr) minmax(0,1fr); gap: 1.35rem; }
.crab-design-card, .crab-design-experiment, .crab-design-guides a { background: ${token.color.surface.content}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; }
.crab-design-card { margin-block-start: .7rem; overflow: hidden; }
.crab-design-card-body { padding: 1.1rem 1.4rem; }
.crab-design-card-body p { margin: .4rem 0 1rem; font-size: .9rem; }
.crab-design-hero-art { position: absolute; inset: 0 0 0 auto; width: 35%; background: linear-gradient(110deg, transparent, color-mix(in oklab, ${token.color.brand.primary} 17%, transparent)); }
.crab-design-hero-art::before { content: ""; position: absolute; inset: 0; opacity: .45; mask-image: linear-gradient(90deg, transparent, black); background-image: linear-gradient(${token.color.border.subtle} 1px, transparent 1px), linear-gradient(90deg, ${token.color.border.subtle} 1px, transparent 1px); background-size: 22px 22px; }
.crab-design-button-art, .crab-design-stage { background-color: color-mix(in oklab, ${token.color.brand.primary} 8%, ${token.color.surface.low}); background-image: radial-gradient(${token.color.border.subtle} 1px, transparent 1px); background-size: 14px 14px; }
.crab-design-button-art, .crab-design-flow { min-height: 8.3rem; display: flex; position: relative; align-items: center; justify-content: center; }
.crab-design-button-art span { background: ${token.color.brand.primary}; color: ${token.color.text["on-brand"]}; border-radius: 3rem; padding: .7rem 2rem; font-weight: 600; transform: rotate(-10deg); box-shadow: -13px 4px 0 ${token.color.background.selected}, -24px 8px 0 ${token.color.border.subtle}; }
.crab-design-flow { gap: clamp(1.4rem, 4vw, 4.4rem); background: color-mix(in oklab, ${token.color.feedback.success.background} 72%, ${token.color.surface.low}); }
.crab-design-flow::before { content: ""; position: absolute; top: 44%; left: 21%; right: 21%; border-top: 2px dashed ${token.color.border.default}; }
.crab-design-flow span { display: grid; justify-items: center; gap: .3rem; z-index: 1; font-size: .8rem; }
.crab-design-flow i { display: grid; place-items: center; width: 2.8rem; height: 2.8rem; border-radius: 30%; border: 1px solid ${token.color.border.subtle}; color: ${token.color.feedback.success.text}; background: ${token.color.surface.content}; font: normal 1.5rem/1 sans-serif; }
.crab-design-guides { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: .75rem; margin-block-start: .75rem; }
.crab-design-guides a { display: flex; align-items: center; gap: .75rem; padding: 1rem; text-decoration: none; color: inherit; }
.crab-design-guides a:hover { background: ${token.color.surface.low}; }
.crab-design-guides a > svg { flex: none; color: ${token.color.text.link}; }
.crab-design-guides a > span { margin-inline-start: auto; }
.crab-design-guides p { margin-top: .2rem; font-size: .78rem; }
.crab-design-section-head { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: .7rem; margin-block-end: .8rem; }
.crab-design-experiment { display: grid; grid-template-columns: minmax(0,1.6fr) minmax(0,1fr); overflow: hidden; }
.crab-design-stage { display: grid; place-items: center; padding: 1.4rem; }
.crab-design-stage form { display: grid; gap: 1rem; width: min(100%,24rem); padding: 1.5rem; border-radius: ${token.shape.card}; background: ${token.color.surface.content}; border: 1px solid ${token.color.border.subtle}; box-shadow: ${token.shadow.card}; }
.crab-design-actions, .crab-design-settings h3, .crab-design-failure, .crab-design-feedback { display: flex; align-items: center; gap: .7rem; }
.crab-design-actions { flex-wrap: wrap; }
.crab-design-settings { padding: 1.4rem 1.6rem; display: grid; align-content: center; justify-items: start; gap: .75rem; border-inline-start: 1px solid ${token.color.border.subtle}; }
.crab-design-settings > * { justify-self: stretch; }
.crab-design-settings > button { justify-self: start; }
.crab-design-failure { font-size: .875rem; }
.crab-design-failure { justify-content: space-between; }
.crab-design-feedback, .crab-design-notes { font-size: .8rem; color: ${token.color.text.secondary}; }
.crab-design-feedback[data-phase="failed"] { color: ${token.color.feedback.error.text}; }
.crab-design-feedback[data-phase="success"] { color: ${token.color.feedback.success.text}; }
.crab-design-notes { border-block-start: 1px solid ${token.color.border.subtle}; padding-block-start: .7rem; width: 100%; }
.crab-design-notes p { margin-top: .25rem; }
@keyframes crab-design-spin { to { transform: rotate(360deg); } }
@media (max-width: 900px) { .crab-design-guides { grid-template-columns: 1fr; } }
@media (max-width: 720px) {
    .crab-design-pair, .crab-design-experiment { grid-template-columns: 1fr; }
    .crab-design-hero-art { display: none; }
    .crab-design-hero > div:first-child { max-width: 100%; }
    .crab-design-stage, .crab-design-settings { padding: 1rem; }
    .crab-design-settings { border-inline-start: 0; border-block-start: 1px solid ${token.color.border.subtle}; }
}
`;
