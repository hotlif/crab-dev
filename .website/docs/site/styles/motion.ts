import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";

globalStyle`
@keyframes crab-site-rise { from { transform: translateY(12px); } to { transform: none; } }
@keyframes crab-site-fade { from { opacity: 0; } to { opacity: 1; } }
.crab-site-enter, [data-site-reveal="entered"] { animation: crab-site-rise ${token.motion.spatial.default} backwards, crab-site-fade ${token.motion.effects.default} backwards; }
.crab-site-enter[data-enter-step="actions"] { animation-delay: 75ms; }
.crab-site-enter[data-enter-step="stage"] { animation-delay: 150ms; }
[data-site-reveal="pending"] { opacity: 0; transform: translateY(12px); }
[data-site-reveal="pending"]:focus-within { opacity: 1; transform: none; }
.crab-site-reveal { min-width: 0; }
.crab-docs :is(.crab-home-hero-preview, .crab-home-preview-note, .crab-home-design-picker, .crab-catalog-artwork, .crab-docs-page-heading, .crab-docs-topbar, .crab-docs-sidebar) {
    transition: background-color ${token.motion.effects.default}, border-color ${token.motion.effects.fast}, color ${token.motion.effects.fast}, border-radius ${token.motion.spatial.fast}, box-shadow ${token.motion.effects.default};
}
.crab-docs .crab-catalog-grid .crab-catalog-item { transition: transform ${token.motion.spatial.fast}, background-color ${token.motion.effects.fast}, border-color ${token.motion.effects.fast}, box-shadow ${token.motion.effects.fast}; }
.crab-catalog-arrow, .crab-home-category-arrow { transition: transform ${token.motion.spatial.fast}; }
.crab-home-category-arrow { display: inline-block; }
.crab-home-practices > article { transition: transform ${token.motion.spatial.fast}, background-color ${token.motion.effects.fast}, border-color ${token.motion.effects.fast}; }
.crab-docs-results button { transition: background-color ${token.motion.effects.fast}, border-color ${token.motion.effects.fast}; }
@media (hover: hover) and (pointer: fine) {
    .crab-docs .crab-catalog-grid .crab-catalog-item:hover, .crab-home-practices > article:hover { transform: translateY(-2px); }
    .crab-catalog-item:hover .crab-catalog-arrow, .crab-home-category-link:hover .crab-home-category-arrow { transform: translateX(${globalToken.space["0-5"]}); }
    [dir="rtl"] .crab-catalog-item:hover .crab-catalog-arrow, [dir="rtl"] .crab-home-category-link:hover .crab-home-category-arrow { transform: translateX(-${globalToken.space["0-5"]}); }
}
@media (prefers-reduced-motion: reduce) {
    .crab-site-enter, [data-site-reveal] { animation: none; opacity: 1; transform: none; }
    .crab-docs :is(.crab-home-hero-preview, .crab-home-preview-note, .crab-home-design-picker, .crab-catalog-artwork, .crab-docs-page-heading, .crab-docs-topbar, .crab-docs-sidebar),
    .crab-docs .crab-catalog-grid .crab-catalog-item, .crab-home-practices > article, .crab-catalog-arrow, .crab-home-category-arrow, .crab-docs-results button { transition: none; }
    .crab-docs .crab-catalog-grid .crab-catalog-item:hover, .crab-home-practices > article:hover, .crab-docs .crab-catalog-item:hover .crab-catalog-arrow, .crab-docs .crab-home-category-link:hover .crab-home-category-arrow { transform: none; }
}
`;
