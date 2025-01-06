import { PrefixName } from "../util";

// 定义环偏移阴影变量名
const ringOffsetShadowVarName = `--${PrefixName}-ring-offset-shadow`;
// 定义环阴影变量名
const ringShadowVarName = `--${PrefixName}-ring-shadow`;
// 定义阴影变量名
const shadowVarName = `--${PrefixName}-shadow`;
// 定义阴影颜色变量名
const shadowColorVarName = `--${PrefixName}-shadow-color`;
// 定义盒子阴影模板
const boxShadowTemplate = `box-shadow: var(${ringOffsetShadowVarName}, 0 0 #0000), var(${ringShadowVarName}, 0 0 #0000), var(${shadowVarName});`;

// 定义不同阴影值
const ShadowValue = {
    sm: `
        ${shadowVarName}: 0 1px 2px 0 var(${shadowColorVarName}, #0000000d);
        ${boxShadowTemplate}
    `,
    normal: `
        ${shadowVarName}: 0 1px 3px 0 var(${shadowColorVarName}, #0000001a), 0 1px 2px -1px var(${shadowColorVarName}, #0000001a);
        ${boxShadowTemplate}
    `,
    md: `
        ${shadowVarName}: 0 4px 6px -1px var(${shadowColorVarName}, #0000001a), 0 2px 4px -1px var(${shadowColorVarName}, #0000001a);
        ${boxShadowTemplate}
    `,
    lg: `
        ${shadowVarName}: 0 10px 15px -3px var(${shadowColorVarName}, #0000001a), 0 4px 6px -2px var(${shadowColorVarName}, #0000001a);
        ${boxShadowTemplate}
    `,
    xl: `
        ${shadowVarName}: 0 20px 25px -5px var(${shadowColorVarName}, #0000001a), 0 10px 10px -5px var(${shadowColorVarName}, #0000001a);
        ${boxShadowTemplate}
    `,
    "2xl": `
        ${shadowVarName}: 0 25px 50px -12px var(${shadowColorVarName}, #0000001a);
        ${boxShadowTemplate}
    `,
    inner: `
        ${shadowVarName}: inset 0 2px 4px 0 var(${shadowColorVarName}, #0000000d);
        ${boxShadowTemplate}
    `,
    none: `
        ${shadowVarName}: 0 0 #0000;
        ${boxShadowTemplate}
    `,
};

// 导出 boxShadow 函数，根据键值返回相应的阴影值
export const boxShadow = (key: keyof typeof ShadowValue) => {
    return ShadowValue[key];
}
