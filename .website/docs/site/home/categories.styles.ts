import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";

globalStyle`
.crab-home-categories-section { container: home-categories / inline-size; }
.crab-home-categories-section > .crab-home-section-heading { align-items: start; flex-direction: column; gap: ${globalToken.space[4]}; }
.crab-home-categories { display: grid; grid-template-columns: minmax(0,1fr); gap: ${globalToken.space[4]}; }
.crab-home-category { min-width: 0; }
.crab-home-categories .crab-home-category-panel { height: 100%; background: ${token.color.surface.content}; border-color: ${token.color.border.subtle}; box-shadow: none; }
.crab-home-category .crab-home-category-body { display: flex; flex-direction: column; gap: ${globalToken.space[5]}; padding: ${globalToken.space[4]}; }
.crab-home-category-heading { display: grid; gap: ${globalToken.space[2]}; }
.crab-home-category-heading h3 { font-size: ${token.typography.title.medium["font-size"]}; line-height: ${token.typography.title.medium["line-height"]}; font-weight: ${token.typography.title.medium["font-weight"]}; color: ${token.color.text.primary}; }
.crab-home-category-heading p { font-size: ${token.font.size.body}; line-height: 1.7; color: ${token.color.text.secondary}; }
.crab-home-component-links { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: ${globalToken.space[1]} ${globalToken.space[3]}; margin-top: auto; }
.crab-home-component-links .crab-home-category-link { min-width: 0; width: 100%; min-height: ${token.size.control}; justify-content: space-between; padding-inline: ${globalToken.space[2]}; color: ${token.color.text.primary}; }
.crab-home-component-links .crab-home-category-link:hover { color: ${token.color.text.link}; background: ${token.color.background["hover-subtle"]}; }
.crab-home-component-links .crab-home-category-link:focus-visible { outline: ${globalToken.space["0-5"]} solid ${token.color.focus.ring}; outline-offset: -${globalToken.space["0-5"]}; }
@container home-categories (min-width: 40rem) {
    .crab-home-categories-section > .crab-home-section-heading { flex-direction: row; align-items: end; }
    .crab-home-categories { grid-template-columns: repeat(2,minmax(0,1fr)); gap: ${globalToken.space[6]}; }
    .crab-home-category .crab-home-category-body { padding: ${globalToken.space[6]}; }
}
@container home-categories (min-width: 64rem) {
    .crab-home-categories { grid-template-columns: repeat(3,minmax(0,1fr)); }
}
@media (pointer: coarse) {
    .crab-home-component-links .crab-home-category-link { min-height: ${token.size["touch-target"]}; }
}
@media (forced-colors: active) {
    .crab-home-categories .crab-home-category-panel { border-color: CanvasText; }
    .crab-home-component-links .crab-home-category-link:focus-visible { outline-color: Highlight; }
}
`;
