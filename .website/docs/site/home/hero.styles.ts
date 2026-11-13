import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";

globalStyle`
.crab-home { min-width: 0; max-width: 80rem; margin-inline: auto; color: ${token.color.text.primary}; }
.crab-home :where(h1,h2,h3,p,fieldset) { margin: 0; }
.crab-home section { scroll-margin-top: ${globalToken.space[24]}; }
.crab-home-eyebrow { font-size: ${token.font.size.caption}; line-height: 1.5; font-weight: ${token.font.weight.label}; color: ${token.color.text.link}; }
.crab-home-hero { display: grid; grid-template-columns: minmax(0,1fr); gap: ${globalToken.space[10]}; padding-block: ${globalToken.space[8]} ${globalToken.space[12]}; align-items: center; border-bottom: ${globalToken.space.px} solid ${token.color.border.subtle}; }
.crab-home-intro { display: grid; min-width: 0; justify-items: start; gap: ${globalToken.space[6]}; }
.crab-home-title-group, .crab-home-intro-actions { display: grid; min-width: 0; justify-items: start; gap: ${globalToken.space[4]}; }
.crab-home-stage { min-width: 0; }
.crab-home-intro h1 { font-size: ${token.typography.title.large["font-size"]}; line-height: ${token.typography.title.large["line-height"]}; font-weight: ${token.font.weight.strong}; }
.crab-home-headline { font-size: clamp(2.5rem, 4.4vw, 4.25rem); line-height: 1.14; font-weight: ${token.typography.display.large["font-weight"]}; letter-spacing: -.045em; text-wrap: balance; }
.crab-home-headline > span { color: ${token.color.text.link}; }
.crab-home-lead { max-width: 38ch; font-size: ${token.typography.body.large["font-size"]}; line-height: 1.85; color: ${token.color.text.secondary}; text-wrap: pretty; }
.crab-home-actions { display: flex; flex-wrap: wrap; gap: ${globalToken.space[3]}; }
.crab-home-actions > a { min-height: ${token.size[48]}; padding-inline: ${globalToken.space[6]}; }
.crab-home-inventory { font-size: ${token.font.size.caption}; color: ${token.color.text.secondary}; }
.crab-home-inventory > span { padding-inline: ${globalToken.space[2]}; }
.crab-home-quick-links { display: flex; flex-wrap: wrap; gap: ${globalToken.space[2]}; }
.crab-home-quick-links a { min-height: ${token.size[40]}; color: ${token.color.text.secondary}; }
.crab-home-hero-preview { min-width: 0; display: grid; gap: ${globalToken.space[4]}; padding: ${globalToken.space[6]}; background: ${token.color.surface.container}; border: ${globalToken.space.px} solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; }
.crab-home-design-picker { display: grid; justify-items: start; gap: ${globalToken.space[3]}; padding-block: ${globalToken.space[4]}; border-block: ${globalToken.space.px} solid ${token.color.border.subtle}; max-width: 100%; }
.crab-home-design-label { font-size: ${token.font.size.caption}; font-weight: ${token.font.weight.label}; color: ${token.color.text.primary}; }
.crab-home-design-description { font-size: ${token.font.size.caption}; color: ${token.color.text.secondary}; }
.crab-home-preview-notes { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: ${globalToken.space[3]}; }
.crab-home-preview-note { min-width: 0; display: grid; align-content: start; justify-items: start; gap: ${globalToken.space[3]}; padding: ${globalToken.space[4]}; border: ${globalToken.space.px} solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; background: ${token.color.surface.content}; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; }
.crab-home-note-label { font-weight: ${token.font.weight.label}; color: ${token.color.text.primary}; }
.crab-home-preview-caption { display: flex; justify-content: space-between; gap: ${globalToken.space[3]}; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; line-height: 1.5; }
.crab-home-preview-form { display: grid; min-width: 0; gap: ${globalToken.space[4]}; padding-top: ${globalToken.space[2]}; }
.crab-home-preview-option { display: flex; align-items: center; justify-content: space-between; gap: ${globalToken.space[4]}; }
.crab-home-preview-option strong { font-size: ${token.font.size.body}; font-weight: ${token.font.weight.label}; }
.crab-home-preview-option p { margin-top: ${globalToken.space[1]}; font-size: ${token.font.size.caption}; color: ${token.color.text.secondary}; }
.crab-home-preview-status { min-height: 3em; font-size: ${token.font.size.caption}; line-height: 1.5; color: ${token.color.text.secondary}; overflow-wrap: anywhere; }
.crab-home-section, .crab-home-demo { padding-inline: 0; padding-block: ${globalToken.space[10]}; }
.crab-home-section-heading h2 { font-size: ${token.typography.headline.medium["font-size"]}; }
.crab-home-practices { border-block: ${globalToken.space.px} solid ${token.color.border.subtle}; }
@container (min-width: 900px) {
    .crab-home-hero { grid-template-columns: minmax(0,1fr) minmax(0,1.05fr); gap: ${globalToken.space[12]}; padding-block: ${globalToken.space[10]} ${globalToken.space[12]}; }
}
@media (max-width: 599px) {
    .crab-home-headline { font-size: ${token.typography.headline.large["font-size"]}; }
    .crab-home-hero { gap: ${globalToken.space[6]}; }
    .crab-home-hero-preview { padding: ${globalToken.space[3]}; }
    .crab-home-preview-notes { grid-template-columns: minmax(0,1fr); }
    .crab-home-section, .crab-home-demo { padding-block: ${globalToken.space[8]}; }
}
.crab-docs[data-crab-design="md3"] .crab-home-hero-preview { border-color: transparent; border-radius: ${token.shape["extra-large"]} ${token.shape.large} ${token.shape["extra-large"]} ${token.shape.large}; }
.crab-docs[data-crab-design="macos"] .crab-home-hero-preview { background: ${token.color.surface.low}; box-shadow: ${token.shadow.card}; }
.crab-docs[data-crab-design="shadcn"] .crab-home-hero-preview { background: ${token.color.surface.content}; }
@media (forced-colors: active) {
    .crab-docs[data-crab-design] .crab-home-hero-preview, .crab-home-preview-note { border-color: CanvasText; }
}
`;
