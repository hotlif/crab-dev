import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
.crab-design-workspace {
    --crab-prototype-paper: ${token.color.surface.content};
    --crab-prototype-panel: ${token.color.surface.low};
    --crab-prototype-rule: ${token.color.border.subtle};
}
.crab-design-form-footer { display: grid; gap: 1rem; }
.crab-design-form-footer > .crab-design-feedback { min-block-size: 2lh; }
.crab-design-form-field { min-width: 0; }
[data-prototype-design="macos"] .crab-design-hero { min-height: 9rem; border: 1px solid ${token.color.border.subtle}; background: ${token.color.surface.low}; }
[data-prototype-design="shadcn"] .crab-design-hero { min-height: 9rem; border: 0; border-bottom: 1px solid ${token.color.border.default}; border-radius: 0; background: ${token.color.surface.content}; }
[data-prototype-design="macos"] .crab-design-hero h1 { font-size: clamp(1.9rem, 3vw, 2.4rem); }
[data-prototype-design="shadcn"] .crab-design-hero h1 { font-size: clamp(2rem, 3vw, 2.65rem); letter-spacing: -.045em; }
[data-prototype-design="macos"] .crab-design-hero-art, [data-prototype-design="shadcn"] .crab-design-hero-art { display: grid; place-items: center; background: transparent; }
[data-prototype-design="macos"] .crab-design-hero-art::before, [data-prototype-design="shadcn"] .crab-design-hero-art::before { display: none; }
.crab-design-panel-art { width: min(70%, 12rem); padding: .65rem .85rem; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.card}; background: ${token.color.surface.content}; }
[data-prototype-design="macos"] .crab-design-panel-art { transform: rotate(-3deg); box-shadow: ${token.shadow.card}; }
.crab-design-panel-heading, .crab-design-panel-actions { display: flex; gap: 4px; align-items: center; }
.crab-design-panel-heading i { width: .45rem; height: .45rem; border-radius: 50%; background: ${token.color.border.default}; }
[data-prototype-design="shadcn"] .crab-design-panel-heading { height: .3rem; width: 40%; background: ${token.color.text.primary}; }
[data-prototype-design="shadcn"] .crab-design-panel-heading i { display: none; }
.crab-design-panel-field { margin-block: .7rem; height: 1.1rem; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.control}; }
.crab-design-panel-actions { justify-content: flex-end; }
.crab-design-panel-actions i { height: .7rem; width: 1.9rem; border-radius: ${token.shape.control}; background: ${token.color.surface.high}; }
.crab-design-panel-actions i:last-child { background: ${token.color.brand.primary}; }
[data-prototype-design="shadcn"] .crab-design-panel-actions { flex-direction: row-reverse; }
[data-prototype-design="macos"] .crab-design-button-art, [data-prototype-design="macos"] .crab-design-stage { background: linear-gradient(145deg, ${token.color.surface.low}, ${token.color.surface.high}); }
[data-prototype-design="shadcn"] :is(.crab-design-button-art, .crab-design-flow, .crab-design-stage) { background: ${token.color.surface.low}; }
[data-prototype-design="macos"] .crab-design-button-art, [data-prototype-design="shadcn"] .crab-design-button-art { gap: .6rem; }
[data-prototype-design="macos"] .crab-design-button-art span, [data-prototype-design="shadcn"] .crab-design-button-art span { transform: none; border-radius: ${token.shape.button}; box-shadow: none; border: 1px solid transparent; padding: .5rem 1.05rem; }
[data-prototype-design="macos"] .crab-design-button-art span { padding: .28rem 1.2rem; box-shadow: ${token.shadow.control}; }
.crab-design-button-art span.crab-design-art-secondary { background: ${token.color.surface.content}; color: ${token.color.text.primary}; border-color: ${token.color.border.subtle}; }
[data-prototype-design="macos"] .crab-design-flow { background: ${token.color.surface.low}; }
[data-prototype-design="macos"] .crab-design-flow::before, [data-prototype-design="shadcn"] .crab-design-flow::before { display: none; }
.crab-design-scene-sample { width: min(80%, 17rem); padding: .7rem 1rem; display: grid; gap: .55rem; background: ${token.color.surface.content}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; font-size: .75rem; }
.crab-design-scene-sample div { display: flex; justify-content: space-between; align-items: center; gap: .4rem; }
.crab-design-scene-sample kbd { justify-self: end; color: ${token.color.text.secondary}; }
[data-prototype-design="macos"] .crab-design-scene-sample { box-shadow: ${token.shadow.control}; }
[data-prototype-design="shadcn"] .crab-design-scene-sample div { border-block-start: 1px solid ${token.color.border.subtle}; padding-block-start: .6rem; color: ${token.color.feedback.error.text}; }
[data-prototype-design="shadcn"] .crab-design-scene-sample b { color: ${token.color.text.primary}; }
[data-prototype-design="macos"] .crab-design-stage form { width: min(100%, 28rem); padding: 0; gap: 0; overflow: hidden; }
[data-prototype-design="macos"] .crab-design-stage h3 { padding: .6rem 1rem; border-block-end: 1px solid ${token.color.border.subtle}; background: ${token.color.surface.low}; text-align: center; font-size: .92rem; }
[data-prototype-design="macos"] .crab-design-form-field { padding: 1.35rem 1.25rem; }
[data-prototype-design="macos"] .crab-design-form-footer { padding: .7rem 1rem; border-block-start: 1px solid ${token.color.border.subtle}; background: ${token.color.surface.low}; gap: .35rem; }
[data-prototype-design="macos"] .crab-design-actions { justify-content: flex-end; }
[data-prototype-design="macos"] .crab-design-form-footer > .crab-design-feedback { grid-row: 1; }
[data-prototype-design="macos"] .crab-design-motion-controls { background: var(--crab-prototype-panel); }
[data-prototype-design="macos"] .crab-design-composition-card { box-shadow: ${token.shadow.control}; }
[data-prototype-design="shadcn"] .crab-design-stage form { width: min(100%, 31rem); padding: 1.2rem; box-shadow: none; }
[data-prototype-design="shadcn"] .crab-design-form-footer { gap: .5rem; padding-block-start: .85rem; border-block-start: 1px solid ${token.color.border.subtle}; }
[data-prototype-design="shadcn"] .crab-design-form-footer > .crab-design-feedback { box-sizing: content-box; padding: .35rem .5rem; border: 1px solid transparent; border-radius: ${token.shape.control}; }
[data-prototype-design="shadcn"][data-variant="candidate"] .crab-design-form-footer > .crab-design-feedback[data-phase="failed"] { border-color: ${token.color.feedback.error.border}; background: ${token.color.feedback.error.background}; }
[data-prototype-design="shadcn"] :is(.crab-design-composition-card, .crab-design-composition-themes) { border-radius: ${token.shape.card}; }
@media (max-width: 720px) {
    [data-prototype-design="macos"] .crab-design-hero-art, [data-prototype-design="shadcn"] .crab-design-hero-art { display: none; }
}
`;
