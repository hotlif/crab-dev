import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
[data-radio-prototype] { max-inline-size: 54rem; margin-inline: auto; }
[data-radio-prototype] .crab-design-hero {
    min-height: auto;
    padding: .75rem clamp(.5rem, 2vw, 1.65rem) 0;
    border: 0;
    background: transparent;
}
[data-radio-prototype] .crab-design-hero > div:first-child { max-width: 100%; }
[data-radio-prototype] :is(.crab-design-hero-art, .crab-design-status) { display: none; }
[data-radio-prototype] .crab-design-jump-links {
    display: flex;
    flex-wrap: wrap;
    gap: .4rem 1rem;
    margin-block-start: .65rem;
    font-size: .875rem;
}
[data-radio-prototype] .crab-design-body { container-type: inline-size; }
#radio-startup, #radio-required, #radio-rules { scroll-margin-block-start: 5rem; }

.crab-radio-panel, .crab-radio-rules {
    min-inline-size: 0;
    margin: 0;
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    background: ${token.color.surface.content};
}
.crab-radio-panel-body { display: grid; gap: .65rem; padding: .95rem 1rem; }
.crab-radio-group-heading { display: grid; gap: .2rem; }
[data-radio-prototype] .crab-radio-group-heading h3 { font-size: 1rem; }
.crab-radio-detail, .crab-radio-rules dd {
    color: ${token.color.text.secondary};
    font-size: .875rem;
    line-height: 1.45;
    overflow-wrap: anywhere;
}
.crab-radio-detail[data-invalid] { color: ${token.color.feedback.error.text}; }
.crab-radio-detail strong { color: ${token.color.text.primary}; }
[data-radio-prototype] .crab-radio-choices { display: grid; grid-template-columns: minmax(0, 1fr); gap: .3rem; }
#radio-required .crab-radio-choices { display: flex; flex-wrap: wrap; gap: .35rem .6rem; }
#radio-required .crab-radio-choice { min-inline-size: min(100%, 9rem); }
.crab-radio-choice {
    box-sizing: border-box;
    min-block-size: ${token.size["touch-target"]};
    padding: .32rem .55rem;
}
.crab-radio-choice-copy { display: grid; min-inline-size: 0; gap: .12rem; }
.crab-radio-choice-title { font-weight: 600; overflow-wrap: anywhere; }
[data-radio-prototype] .crab-radio-choice[data-disabled] { opacity: 1; }
.crab-radio-choice[data-disabled] .crab-radio-choice-title { color: ${token.color.text.secondary}; }
@media (forced-colors: none) {
    .crab-radio-choice[data-disabled] [data-radio-part="control"] { opacity: ${token.opacity.disabled}; }
}
.crab-radio-footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: .55rem 1rem;
    padding: .7rem 1rem;
    border-block-start: 1px solid ${token.color.border.subtle};
}
.crab-radio-footer > :last-child { margin-inline-start: auto; }
.crab-radio-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: .5rem; }
.crab-radio-rules { padding: .95rem 1rem; }
.crab-radio-rules dl {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: .5rem 1rem;
    margin-block: .9rem 0;
}
.crab-radio-rules dt { font-size: .875rem; font-weight: 650; }
.crab-radio-rules dd { margin: 0; }

[data-radio-prototype][data-prototype-design="md3"] .crab-radio-panel {
    border-color: transparent;
    border-radius: 1.4rem;
    background: ${token.color.surface.low};
}
[data-radio-prototype][data-prototype-design="md3"] .crab-radio-panel-body { padding: 1rem clamp(.65rem, 3cqi, 1.4rem); }
[data-radio-prototype][data-prototype-design="md3"] .crab-radio-choice { padding-block: .4rem; }
[data-radio-prototype][data-prototype-design="md3"] .crab-radio-footer {
    border-color: transparent;
    border-end-start-radius: inherit;
    border-end-end-radius: inherit;
    background: ${token.color.surface.container};
}

[data-radio-prototype][data-prototype-design="macos"] { max-inline-size: 44rem; }
[data-radio-prototype][data-prototype-design="macos"] .crab-radio-panel-body { gap: .45rem; padding: .7rem .9rem; }
[data-radio-prototype][data-prototype-design="macos"] .crab-radio-choices { gap: 0 .45rem; }
[data-radio-prototype][data-prototype-design="macos"] .crab-radio-choice { padding: .24rem .2rem; }
[data-radio-prototype][data-prototype-design="macos"] #radio-startup .crab-radio-choice + .crab-radio-choice {
    border-block-start: 1px solid ${token.color.border.subtle};
}
[data-radio-prototype][data-prototype-design="macos"] .crab-radio-detail { font-size: .8125rem; }
[data-radio-prototype][data-prototype-design="macos"] .crab-radio-footer {
    padding: .55rem .9rem;
    border-end-start-radius: inherit;
    border-end-end-radius: inherit;
    background: ${token.color.surface.low};
}

[data-radio-prototype][data-prototype-design="shadcn"] .crab-radio-panel { border: 0; background: transparent; }
[data-radio-prototype][data-prototype-design="shadcn"] .crab-radio-panel-body { padding: 0 0 .6rem; }
[data-radio-prototype][data-prototype-design="shadcn"] .crab-radio-choices { gap: .48rem; }
[data-radio-prototype][data-prototype-design="shadcn"] .crab-radio-choice {
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.control};
    background: ${token.color.surface.content};
    transition: border-color ${token.motion.effects.fast};
}
[data-radio-prototype][data-prototype-design="shadcn"] .crab-radio-choice:not([data-disabled]):hover {
    border-color: ${token.color.text.secondary};
}
[data-radio-prototype][data-prototype-design="shadcn"] .crab-radio-choice[data-state="checked"] {
    border-color: ${token.color.text.primary};
}
[data-radio-prototype][data-prototype-design="shadcn"] .crab-radio-footer { padding-inline: 0; }

@container (max-width: 24rem) {
    #radio-required .crab-radio-choice { flex-basis: 100%; }
    .crab-radio-rules dl { grid-template-columns: minmax(0, 1fr); gap: .24rem; }
    .crab-radio-rules dd + dt { margin-block-start: .4rem; }
}
@media (prefers-reduced-motion: reduce) {
    [data-radio-prototype][data-prototype-design="shadcn"] .crab-radio-choice { transition: none; }
}
`;
