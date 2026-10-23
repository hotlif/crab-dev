import { defineTokens } from "@crab-dev/css";
import global from "@crab-dev/rc-token-global";
import token, { designColorContract } from "@crab-dev/rc-token-semantic";

/** Public Material primitives shared with component themes. */
export const material = defineTokens({
    ...global.material,
    primary: global.purple,
    variant: global.material['neutral-variant'],
});

export const stateLayers = defineTokens({ hover: `calc(${token.state.opacity.hover} * 100%)`, pressed: `calc(${token.state.opacity.pressed} * 100%)` });

/** All styles use the public L2 contracts; the site owns no separate palette. */
export const colors = designColorContract;
