import { i } from "motion/react-client";

export const prefix = "crab";

const TokenPrefix = `--${prefix}-menu-horizontal`;

const TokenDefaultValue = {
    horizontal: {
        groupItem: {
            indentBase: "5px",
            indentScale: "0.7"
        }
    }
}


const TokenVarName = {
    horizontal: {
        groupItem: {
            indentBase: `${TokenPrefix}-item-group-indent-base`,
            indentScale: `${TokenPrefix}-item-group-indent-scale`
        }
    }
}


const Token = {
    horizontal: {
        groupItem: {
            indentBase: `var(${TokenVarName.horizontal.groupItem.indentBase}, ${TokenDefaultValue.horizontal.groupItem.indentBase})`,
            indentScale: `var(${TokenVarName.horizontal.groupItem.indentScale}, ${TokenDefaultValue.horizontal.groupItem.indentScale})`
        }
    }
}

export default Token;



