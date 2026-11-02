import { defineTokens } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

export const home = defineTokens({
    title: token.typography.headline.large["font-size"],
    titleSmall: token.typography.headline.small["font-size"],
    touch: token.size.control, demoRadius: token.shape.card,
});
