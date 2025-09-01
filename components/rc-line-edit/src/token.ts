import { css } from "@linaria/core";

export const prefix = "crab";

const TokenPrefix = `--${prefix}-line-edit`;

const TokenDefaultValue = {
    border: {
        radius: "4px",
        color: {
            normal: "rgb(217, 217, 217)",
            focusWithin: "rgb(22, 119, 255)",
        },
    },
    boxShadow: {
        focusWithin: "rgba(5, 145, 255, 0.1) 0px 0px 0px 2px",
    },
    transition: "all 200ms",
}

const TokenVarName = {
    border: {
        radius: `${TokenPrefix}-border-radius`,
        color: {
            normal: `${TokenPrefix}-border-color-normal`,
            focusWithin: `${TokenPrefix}-border-color-focus-within`,
        },
    },
    boxShadow: {
        focusWithin: `${TokenPrefix}-box-shadow-focus-within`,
    },
    transition: `${TokenPrefix}-transition`,
}

const Token = {
    border: {
        radius: `var(${TokenVarName.border.radius}, ${TokenDefaultValue.border.radius})`,
        color: {
            normal: `var(${TokenVarName.border.color.normal}, ${TokenDefaultValue.border.color.normal})`,
            focusWithin: `var(${TokenVarName.border.color.focusWithin}, ${TokenDefaultValue.border.color.focusWithin})`,
        },
    },
    boxShadow: {
        focusWithin: `var(${TokenVarName.boxShadow.focusWithin}, ${TokenDefaultValue.boxShadow.focusWithin})`,
    },
    transition: `var(${TokenVarName.transition}, ${TokenDefaultValue.transition})`,
}

export default Token;