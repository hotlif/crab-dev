import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalStyle`
.crab-docs-toc[data-variant="mobile"] { display: none; }
.crab-docs-page-heading { display: grid; gap: ${token["space"]["stack-gap"]}; margin-bottom: ${token.space["group-gap"]}; }
.crab-docs-page-heading h1 { font-size: ${token.typography.headline.large["font-size"]}; font-weight: ${token.typography.headline.large["font-weight"]}; line-height: ${token.typography.headline.large["line-height"]}; letter-spacing: 0; overflow-wrap: anywhere; }
.crab-docs-page-heading > * { margin: 0; }
.crab-docs-page-heading > p { color: ${token["color"]["text"]["secondary"]}; }
.crab-docs-muted { color: ${token["color"]["text"]["secondary"]}; font-size: ${token["font"]["size"]["caption"]}; }
.crab-docs-prose > h1:first-child { display: none; }
.crab-docs-prose > h2 { margin: ${token.space["page-padding"]} 0 ${token.space["section-gap"]}; font-size: ${token.typography.headline.small["font-size"]}; }
.crab-docs-prose > h3 { margin-top: ${token.space["group-gap"]}; font-size: ${token.typography.title.large["font-size"]}; }
.crab-docs-prose > :is(h2,h3,h4) { font-weight: ${token.typography.headline.small["font-weight"]}; line-height: ${token.typography.headline.small["line-height"]}; }
.crab-docs-prose > :is(p,ul,ol) code { padding: ${globalToken.space["0-5"]} ${token.space["inline-gap"]}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.radius.sm}; background: var(--crab-docs-code-background); font-family: ${globalToken.font.family.mono}; font-size: .875em; overflow-wrap: anywhere; }
.crab-docs-prose > p { max-width: 72ch; margin: ${token["space"]["stack-gap"]} 0; }
.crab-docs-prose > :is(p, ul, ol, blockquote), .crab-docs-prose > details > :is(p, ul, ol) { overflow-wrap: anywhere; }
.crab-docs-prose > p a, .crab-docs-prose > ul a { text-decoration: underline; text-underline-offset: .2em; }
.crab-docs-prose > table { width: 100%; display: block; overflow-x: auto; border-collapse: collapse; }
.crab-docs-prose > table :is(th,td) { border-bottom: 1px solid ${token["color"]["fill"]["default"]}; padding: ${token["space"]["stack-gap"]}; text-align: left; }
.crab-docs-prose > details, .crab-docs-api > details { border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; padding: ${token["space"]["section-gap"]}; margin-block: ${token["space"]["section-gap"]}; }
.crab-docs summary { cursor: pointer; font-weight: ${token["font"]["weight"]["strong"]}; }
.crab-docs-prose > :is(h2,h3,h4), .crab-docs-page [id] { scroll-margin-top: 9rem; }
.crab-docs-pager { display: flex; justify-content: space-between; flex-wrap: wrap; gap: ${token["space"]["section-gap"]}; margin-top: calc(${token["space"]["group-gap"]} * 2); border-top: 1px solid ${token["color"]["fill"]["default"]}; padding-top: ${token["space"]["section-gap"]}; }
.crab-docs-pager a { white-space: normal; }
.crab-docs-code { min-width: 0; max-width: 100%; margin: ${token.space["section-gap"]} 0; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; overflow: hidden; background: var(--crab-docs-code-background); }
.crab-docs-code figcaption { display: flex; align-items: center; justify-content: space-between; padding: ${token.space["component-gap"]} ${token.space["section-gap"]}; border-bottom: 1px solid ${token.color.border.subtle}; font-size: ${token.font.size.caption}; color: ${token.color.text.secondary}; }
.crab-docs-code pre { margin: 0; padding: ${token.space["section-gap"]}; max-width: 100%; overflow-x: auto; tab-size: 4; white-space: pre; font-size: ${token.font.size.body}; line-height: 1.75; font-weight: ${token.font.weight.body}; }
.crab-docs-code code { display: block; font-family: ${globalToken.font.family.mono}; }
.crab-docs-code-line { display: block; min-height: 1.75em; }
.crab-docs-code p { padding-inline: ${token["space"]["section-gap"]}; }
.crab-docs-api { min-width: 0; }
.crab-docs-api-filter { width: 100%; max-width: calc(${globalToken.space[24]} * 4); }
.crab-docs-api { font-size: ${token.font.size.body}; line-height: 1.65; }
.crab-docs-api-heading > strong { font-size: ${token.font.size.subhead}; font-weight: ${token.typography.title.large.emphasized['font-weight']}; }
.crab-docs-api-heading > span { color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; font-variant-numeric: tabular-nums; }
.crab-docs-api-heading { display: flex; flex-wrap: wrap; gap: ${token["space"]["section-gap"]}; justify-content: space-between; margin-bottom: ${token["space"]["section-gap"]}; }
.crab-docs-properties { margin: ${token["space"]["section-gap"]} 0; }
.crab-docs-properties > div { display: grid; grid-template-columns: minmax(8rem, 1fr) minmax(0, 3fr); gap: ${token["space"]["section-gap"]}; border-top: 1px solid ${token["color"]["fill"]["default"]}; padding-block: ${token["space"]["section-gap"]}; }
.crab-docs-properties dt { display: flex; align-items: start; flex-wrap: wrap; gap: ${token["space"]["component-gap"]}; font-weight: ${token["font"]["weight"]["strong"]}; overflow-wrap: anywhere; }
.crab-docs-properties dt span { font-size: ${token["font"]["size"]["caption"]}; border: 1px solid ${token["color"]["fill"]["default"]}; border-radius: ${token["radius"]["sm"]}; padding-inline: ${token["space"]["inline-gap"]}; }
.crab-docs-properties dt { font-weight: ${token.typography.title.large.emphasized['font-weight']}; }
.crab-docs-properties dt span { font-weight: ${token.font.weight.body}; color: ${token.color.text.secondary}; }
.crab-docs-properties [data-kind="deprecated"] { color: ${token.color.feedback.warning.text}; background: ${token.color.feedback.warning.background}; }
.crab-docs-properties code { font-family: ${globalToken.font.family.mono}; font-size: ${token.font.size.body}; }
.crab-docs-properties dd > code { color: ${token.color.text.secondary}; }
.crab-docs-properties dd { margin: 0; min-width: 0; overflow-wrap: anywhere; }
.crab-docs-properties dd > code { display: block; overflow-x: auto; white-space: pre; padding-bottom: ${token["space"]["inline-gap"]}; }
.crab-docs-properties dd p { margin: ${token["space"]["component-gap"]} 0; }
`;
