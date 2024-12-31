import { PrefixName } from "../util";

const ringOffsetShadowVarName = `--${PrefixName}-ring-offset-shadow`;
const ringShadowVarName = `--${PrefixName}-ring-shadow`;
const shadowVarName = `--${PrefixName}-shadow`;
const shadowColoredVarName = `--${PrefixName}-shadow-colored`;
const shadowColorVarName = `--${PrefixName}-shadow-color`;
const boxShadow = `box-shadow: var(${ringOffsetShadowVarName}, 0 0 #0000), var(${ringShadowVarName}, 0 0 #0000), var(${shadowVarName});`;

export const shadowSm = `
    ${shadowColoredVarName}: 0 1px 2px 0 var(${shadowColorVarName}, #0000000d);
    ${boxShadow}
`;

export const shadow = `
    ${shadowColoredVarName}: 0 1px 3px 0 var(${shadowColorVarName}, #0000001a), 0 1px 2px -1px var(${shadowColorVarName}, #0000001a);
    ${boxShadow}
`;

export const shadowMd = `
    ${shadowColoredVarName}: 0 4px 6px -1px var(${shadowColorVarName}, #0000001a), 0 2px 4px -2px var(${shadowColorVarName}, #0000001a);
    ${boxShadow}
`;

export const shadowLg = `
    ${shadowColoredVarName}: 0 10px 15px -3px var(${shadowColorVarName}, #0000001a), 0 4px 6px -4px var(${shadowColorVarName}, #0000001a);
    ${boxShadow}
`;

export const shadowXl = `
    ${shadowColoredVarName}: 0 20px 25px -5px var(${shadowColorVarName}, #0000001a), 0 8px 10px -6px var(${shadowColorVarName}, #0000001a);
    ${boxShadow}
`;

export const shadow2xl = `
    ${shadowColoredVarName}: 0 25px 50px -12px var(${shadowColorVarName}, #0000001a);
    ${boxShadow}
`;

export const shadowInner = `
    ${shadowColoredVarName}: inset 0 2px 4px 0  var(${shadowColorVarName}, #0000000d);
    ${boxShadow}
`;

export const shadowNone = `
    ${shadowColoredVarName}: 0 0 #0000;
    ${boxShadow}
`;
