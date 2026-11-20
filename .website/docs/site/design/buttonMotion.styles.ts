import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";

globalStyle`
.crab-design-jump-links { display: flex; flex-wrap: wrap; gap: .4rem 1rem; margin-block-start: .65rem; }
.crab-design-jump-links a { color: ${token.color.text.link}; font-size: .875rem; }
.crab-design-motion-lab, #button-scenario { scroll-margin-block-start: 5rem; }
.crab-design-motion-board { display: grid; grid-template-columns: minmax(0,1.6fr) minmax(0,1fr); overflow: hidden; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; background: ${token.color.surface.content}; }
.crab-design-motion-stage { display: grid; grid-template-rows: minmax(4.5rem, auto); align-content: start; place-items: center; min-width: 0; gap: .8rem; min-height: 11rem; padding: 1rem; background: var(--crab-prototype-paper); }
.crab-design-motion-stage > p { font-size: .82rem; }
.crab-design-motion-controls { display: grid; align-content: center; justify-items: start; gap: .8rem; min-width: 0; padding: 1.2rem; border-inline-start: 1px solid ${token.color.border.subtle}; }
.crab-design-motion-controls p { color: ${token.color.text.secondary}; font-size: .875rem; }
.crab-design-motion-stage .crab-design-feedback { text-align: center; }
.crab-design-motion-action { position: relative; display: inline-flex; max-inline-size: 100%; vertical-align: middle; }
.crab-design-motion-stage .crab-design-motion-action:not([data-kind="icon"]) > button,
.crab-design-actions .crab-design-motion-action > button { inline-size: 7rem; max-inline-size: 100%; }
.crab-design-motion-lab[data-slow="true"] { --crab-playback-stretch: 2; }
.crab-design-motion-clip { position: absolute; inset: 0; border-radius: ${token.shape.button}; overflow: hidden; pointer-events: none; }
.crab-design-motion-pulse { position: absolute; inset: 0; pointer-events: none; opacity: 0; }
[data-prototype-design="md3"] .crab-design-motion-pulse { inset: auto; left: var(--crab-press-x); top: var(--crab-press-y); width: 230%; aspect-ratio: 1; border-radius: 50%; background: currentColor; animation: crab-prototype-ripple calc(${globalToken.duration[350]} * var(--crab-playback-stretch, 1)) ${globalToken.easing.out}; }
@keyframes crab-prototype-ripple {
    from { transform: translate(-50%,-50%) scale(.04); opacity: .32; }
    65% { opacity: .14; }
    to { transform: translate(-50%,-50%) scale(1); opacity: 0; }
}
[data-prototype-design="macos"] .crab-design-motion-pulse { border-radius: inherit; box-shadow: inset 0 1px 0 1px currentColor, inset 0 -2px 4px ${token.color.border.strong}; animation: crab-prototype-bezel calc(${globalToken.duration.normal} * var(--crab-playback-stretch, 1)) ${globalToken.easing.out}; }
@keyframes crab-prototype-bezel { from { opacity: .7; } to { opacity: 0; } }
[data-prototype-design="shadcn"] .crab-design-motion-pulse { border-radius: inherit; border: 1px solid currentColor; animation: crab-prototype-edge calc(${globalToken.duration[150]} * var(--crab-playback-stretch, 1)) ease-out; }
@keyframes crab-prototype-edge { from { opacity: .7; } to { opacity: 0; } }
.crab-design-motion-indicator { display: inline-flex; flex: none; position: relative; width: 1em; height: 1em; align-items: center; justify-content: space-between; }
[data-prototype-design="md3"] .crab-design-motion-indicator { box-sizing: border-box; border: 2px solid currentColor; border-inline-end-color: transparent; border-radius: 50%; animation: crab-design-spin calc(.72s * var(--crab-playback-stretch, 1)) linear infinite; }
[data-prototype-design="macos"] .crab-design-motion-indicator { background: repeating-conic-gradient(currentColor 0deg 18deg, transparent 18deg 45deg); mask-image: radial-gradient(circle,transparent 32%,#000 36% 64%,transparent 68%), conic-gradient(transparent, #000); mask-composite: intersect; animation: crab-design-spin calc(.8s * var(--crab-playback-stretch, 1)) steps(8) infinite; }
[data-prototype-design="shadcn"] .crab-design-motion-indicator i { width: 24%; aspect-ratio: 1; border-radius: 50%; background: currentColor; animation: crab-prototype-dot calc(.9s * var(--crab-playback-stretch, 1)) ease-in-out infinite; }
[data-prototype-design="shadcn"] .crab-design-motion-indicator i:nth-child(2) { animation-delay: calc(-.6s * var(--crab-playback-stretch, 1)); }
[data-prototype-design="shadcn"] .crab-design-motion-indicator i:nth-child(3) { animation-delay: calc(-.3s * var(--crab-playback-stretch, 1)); }
@keyframes crab-prototype-dot { 0%, 65%, 100% { opacity: .35; } 30% { opacity: 1; } }
.crab-design-feedback[data-motion-result="true"]::before { display: none; }
.crab-design-result-icon { flex: none; width: 1.1rem; height: 1.1rem; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
[data-prototype-design="md3"] .crab-design-result-icon { animation: crab-prototype-result-in calc(${globalToken.duration.normal} * var(--crab-playback-stretch, 1)) ${globalToken.easing.out}; }
@keyframes crab-prototype-result-in { from { opacity: .25; } to { opacity: 1; } }
[data-prototype-design="macos"] .crab-design-result-icon { animation: crab-prototype-result-fade calc(${globalToken.duration.normal} * var(--crab-playback-stretch, 1)) ease-out; }
@keyframes crab-prototype-result-fade { from { opacity: .15; } to { opacity: 1; } }
[data-prototype-design="shadcn"] .crab-design-result-icon path { stroke-dasharray: 1; animation: crab-prototype-draw calc(${globalToken.duration.normal} * var(--crab-playback-stretch, 1)) ease-out; }
@keyframes crab-prototype-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@media (max-width: 720px) {
    .crab-design-motion-board { grid-template-columns: 1fr; }
    .crab-design-motion-controls { border-inline-start: 0; border-block-start: 1px solid ${token.color.border.subtle}; padding: 1rem; }
}
@media (max-width: 480px) {
    .crab-design-motion-stage { padding-inline: .35rem; }
}
@media (prefers-reduced-motion: reduce) {
    .crab-design-workspace[data-prototype-design] :is(.crab-design-motion-pulse, .crab-design-motion-indicator, .crab-design-motion-indicator i, .crab-design-result-icon, .crab-design-result-icon path) { animation: none; }
}
@media (forced-colors: active) {
    .crab-design-motion-action .crab-design-motion-indicator, .crab-design-swatch .crab-design-motion-indicator { forced-color-adjust: none; color: ButtonText; }
}
`;
