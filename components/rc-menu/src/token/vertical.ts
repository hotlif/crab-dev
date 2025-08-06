export const prefix = "crab";

const TokenPrefix = `--${prefix}-menu-vertical`;

const TokenDefaultValue = {
    vertical: {
        item: {
            inlineIndent: "24px",
            title: {
                width: "100%",
                height: "2.5rem",
                fontSize: "14px",
                paddingInlineStart: "1rem",
                paddingInlineEnd: "1rem",
                marginTop: "0.125rem",
                marginBottom: "0.125rem",
                borderRadius: "8px",
                backgroundColor: {
                    hover: "rgba(0,0,0,0.06)",
                    active: "rgba(0,0,0,0.10)",
                    select: "rgba(0,0,0,0.06)",
                }
            },
            children: {
                backgroundColor: "rgba(0,0,0,0.02)",
                padding: "0px 4px"
            }
        },
        itemGroup: {
            title: {
                color: "rgba(0, 0, 0, 0.45)",
                height: "2.25rem",
                fontSize: "14px",
            }
        }
    }
}

const TokenVarName = {
    vertical: {
        item: {
            inlineIndent: `${TokenPrefix}-item-inline-indent`,
            title: {
                width: `${TokenPrefix}-item-title-width`,
                height: `${TokenPrefix}-item-title-height`,
                fontSize: `${TokenPrefix}-item-title-fontSize`,
                paddingInlineStart: `${TokenPrefix}-item-title-padding-inline-start`,
                paddingInlineEnd: `${TokenPrefix}-item-title-padding-inline-end`,
                marginTop: `${TokenPrefix}-item-title-margin-top`,
                marginBottom: `${TokenPrefix}-item-title-margin-bottom`,
                borderRadius: `${TokenPrefix}-item-title-border-radius`,
                backgroundColor: {
                    hover: `${TokenPrefix}-item-title-border-bg-color-hover`,
                    active: `${TokenPrefix}-item-title-border-bg-color-hover`,
                    select: `${TokenPrefix}-item-title-border-bg-color-select`
                }
            },
            children: {
                backgroundColor: `${TokenPrefix}-item-children-bg-color`,
                padding: `${TokenPrefix}-item-children-padding`,
            }
        },
        itemGroup: {
            title: {
                color: `${TokenPrefix}-item-group-title-color`,
                height: `${TokenPrefix}-item-group-title-height`,
                fontSize: `${TokenPrefix}-item-group-title-font-size`,
            }
        }
    }
}

const Token = {
    vertical: {
        item: {
            inlineIndent: `var(${TokenVarName.vertical.item.inlineIndent}, ${TokenDefaultValue.vertical.item.inlineIndent})`,
            title: {
                width: `var(${TokenVarName.vertical.item.title.width}, ${TokenDefaultValue.vertical.item.title.width})`,
                height: `var(${TokenVarName.vertical.item.title.height}, ${TokenDefaultValue.vertical.item.title.height})`,
                fontSize: `var(${TokenVarName.vertical.item.title.fontSize}, ${TokenDefaultValue.vertical.item.title.fontSize})`,
                paddingInlineStart: `var(${TokenVarName.vertical.item.title.paddingInlineStart}, ${TokenDefaultValue.vertical.item.title.paddingInlineStart})`,
                paddingInlineEnd: `var(${TokenVarName.vertical.item.title.paddingInlineEnd}, ${TokenDefaultValue.vertical.item.title.paddingInlineEnd})`,
                marginTop: `var(${TokenVarName.vertical.item.title.marginTop}, ${TokenDefaultValue.vertical.item.title.marginTop})`,
                marginBottom: `var(${TokenVarName.vertical.item.title.marginBottom}, ${TokenDefaultValue.vertical.item.title.marginBottom})`,
                borderRadius:  `var(${TokenVarName.vertical.item.title.borderRadius}, ${TokenDefaultValue.vertical.item.title.borderRadius})`,
                backgroundColor: {
                    hover: `var(${TokenVarName.vertical.item.title.backgroundColor.hover}, ${TokenDefaultValue.vertical.item.title.backgroundColor.hover})`,
                    active: `var(${TokenVarName.vertical.item.title.backgroundColor.active}, ${TokenDefaultValue.vertical.item.title.backgroundColor.active})`,
                    select: `var(${TokenVarName.vertical.item.title.backgroundColor.select}, ${TokenDefaultValue.vertical.item.title.backgroundColor.select})`
                }
            },
            children: {
                backgroundColor: `var(${TokenVarName.vertical.item.children.backgroundColor}, ${TokenDefaultValue.vertical.item.children.backgroundColor})`,
                padding: `var(${TokenVarName.vertical.item.children.padding}, ${TokenDefaultValue.vertical.item.children.padding})`
            }
        },
        itemGroup: {
            title: {
                color: `var(${TokenVarName.vertical.itemGroup.title.color}, ${TokenDefaultValue.vertical.itemGroup.title.color})`,
                height: `var(${TokenVarName.vertical.itemGroup.title.height}, ${TokenDefaultValue.vertical.itemGroup.title.height})`,
                fontSize: `var(${TokenVarName.vertical.itemGroup.title.fontSize}, ${TokenDefaultValue.vertical.itemGroup.title.fontSize})`,
            }
        },

    }
}


export default Token;