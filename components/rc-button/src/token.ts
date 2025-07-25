import { col } from "motion/react-client";

export const prefix = "crab";

const TokenPrefix = `--${prefix}-button`;

const TokenDefaultValue = {
    primary: {
        color: {
            normal: "rgb(255, 255, 255)",
        },
        backgroundColor: {
            normal: "rgb(22, 119, 255)",
            hover: "#4096ff",
            active: "#0958d0",
        }
    },
    link: {
        backgroundColor: {
            normal: "transparent",
            disabled: "transparent"
        },
        color: {
            normal: "rgb(22, 119, 255)",
            hover: "#4096ff",
            active: "#0958d9"
        }
    },
    dashed: {
        border: {
            width: "1px",
            style: "dashed",
            color: {
                normal: "rgb(22, 119, 255)",
                hover: "#4096ff",
                active: "#0958d9"
            }
        },
        boxShadow: "rgba(0, 0, 0, 0.02) 0px 2px 0px 0px",
        backgroundColor: "#fff",
        color: {
            normal: "rgb(22, 119, 255)",
            hover: "#4096ff",
            active: "#0958d9"
        }
    },
    text: {
        backgroundColor: {
            hover: "rgba(0,0,0,0.04)",
            active: "rgba(0,0,0,0.15)"
        }
    },
    subtle: {
        boxShadow: "rgba(0, 0, 0, 0.02) 0px 2px 0px 0px",
        border: {
            style: "solid",
            width: "1px",
            color: {
                normal: "rgb(217, 217, 217)",
                hover: "rgb(64, 150, 255)",
                active: "0958d9"
            },
        },
        backgroundColor: {
            normal: "#fff"
        },
        color: {
            hover: "rgb(64, 150, 255)",
            active: "#0958d9"
        }
    }
}

const TokenVarName = {
    primary: {
        color: {
            normal: `${TokenPrefix}-primary-color-normal`,
        },
        backgroundColor: {
            normal: `${TokenPrefix}-primary-bg-color`,
            hover: `${TokenPrefix}-primary-bg-color-hover`,
            active: `${TokenPrefix}-primary-bg-color-active`,
        },
    },
    link: {
        backgroundColor: {
            normal: `${TokenPrefix}-link-bg-color`,
            disabled: `${TokenPrefix}-link-bg-color-disabled`
        },
        color: {
            normal: `${TokenPrefix}-link-color-normal`,
            hover: `${TokenPrefix}-link-color-hover`,
            active: `${TokenPrefix}-link-color-active`
        }
    },
    dashed: {
        border: {
            width: `${TokenPrefix}-dashed-border-width`,
            style: `${TokenPrefix}-dashed-border-style`,
            color: {
                normal: `${TokenPrefix}-dashed-border-color-normal`,
                hover: `${TokenPrefix}-dashed-border-color-hover`,
                active: `${TokenPrefix}-dashed-border-color-active`
            }
        },
        boxShadow: `${TokenPrefix}-dashed-box-shadow`,
        backgroundColor: `${TokenPrefix}-dashed-bg-color`,
        color: {
            normal: `${TokenPrefix}-dashed-color-normal`,
            hover: `${TokenPrefix}-dashed-color-hover`,
            active: `${TokenPrefix}-dashed-color-active`
        }
    },
    text: {
        backgroundColor: {
            hover: `${TokenPrefix}-text-bg-color-hover`,
            active: `${TokenPrefix}-text-bg-color-active`
        }
    },
    subtle: {
        boxShadow: `${TokenPrefix}-subtle-box-shadow`,
        border: {
            style: `${TokenPrefix}-subtle-border-style`,
            width: `${TokenPrefix}-subtle-border-width`,
            color: {
                normal: `${TokenPrefix}-subtle-border-color-normal`,
                hover: `${TokenPrefix}-subtle-border-color-hover`,
                active: `${TokenPrefix}-subtle-border-color-active`
            },
        },
        backgroundColor: {
            normal: `${TokenPrefix}-subtle-bg-color-normal`,
            active: `${TokenPrefix}-subtle-bg-color-active`
        },
        color: {
            hover: `${TokenPrefix}-subtle-color-hover`,
            active: `${TokenPrefix}-subtle-color-active`
        }
    }
}

const Token = {
    primary: {
        color: {
            normal: `var(${TokenVarName.primary.color.normal}, ${TokenDefaultValue.primary.color.normal})`,
        },
        backgroundColor: {
            normal: `var(${TokenVarName.primary.backgroundColor.normal}, ${TokenDefaultValue.primary.backgroundColor.normal})`,
            hover: `var(${TokenVarName.primary.backgroundColor.hover}, ${TokenDefaultValue.primary.backgroundColor.hover})`,
            active: `var(${TokenVarName.primary.backgroundColor.active}, ${TokenDefaultValue.primary.backgroundColor.active})`,
        },
    },
    link: {
        backgroundColor: {
            normal: `var(${TokenVarName.link.backgroundColor.normal}, ${TokenDefaultValue.link.backgroundColor.normal})`,
            disabled: `var(${TokenVarName.link.backgroundColor.disabled}, ${TokenDefaultValue.link.backgroundColor.disabled})`
        },
        color: {
            normal: `var(${TokenVarName.link.color.normal}, ${TokenDefaultValue.link.color.normal})`,
            hover: `var(${TokenVarName.link.color.hover}, ${TokenDefaultValue.link.color.hover})`,
            active: `var(${TokenVarName.link.color.active}, ${TokenDefaultValue.link.color.active})`
        }
    },
    dashed: {
        border: {
            width: `var(${TokenVarName.dashed.border.width}, ${TokenDefaultValue.dashed.border.width})`,
            style: `var(${TokenVarName.dashed.border.style}, ${ TokenDefaultValue.dashed.border.style})`,
            color: {
                normal: `var(${TokenVarName.dashed.border.color.normal}, ${TokenDefaultValue.dashed.border.color.normal})`,
                hover: `var(${TokenVarName.dashed.border.color.hover}, ${TokenDefaultValue.dashed.border.color.hover})`,
                active: `var(${TokenVarName.dashed.border.color.active}, ${TokenDefaultValue.dashed.border.color.active})`
            }
        },
        boxShadow: `var(${TokenVarName.dashed.boxShadow}, ${TokenDefaultValue.dashed.boxShadow})`,
        backgroundColor: `var(${TokenVarName.dashed.backgroundColor}, ${TokenDefaultValue.dashed.backgroundColor})`,
        color: {
            normal: `var(${TokenVarName.dashed.color.normal}, ${TokenDefaultValue.dashed.color.normal})`,
            hover: `var(${TokenVarName.dashed.color.hover}, ${TokenDefaultValue.dashed.color.hover})`,
            active: `var(${TokenVarName.dashed.color.active}, ${TokenDefaultValue.dashed.color.active})`
        }
    },
    text: {
        backgroundColor: {
            hover: `var(${TokenVarName.text.backgroundColor.hover}, ${TokenDefaultValue.text.backgroundColor.hover})`,
            active: `var(${TokenVarName.text.backgroundColor.active}, ${TokenDefaultValue.text.backgroundColor.active})`
        }
    },
    subtle: {
        boxShadow: `var(${TokenVarName.subtle.boxShadow}, ${TokenDefaultValue.subtle.boxShadow})`,
        border: {
            style: `var(${TokenVarName.subtle.border.style}, ${TokenDefaultValue.subtle.border.style})`,
            width: `var(${TokenVarName.subtle.border.width}, ${TokenDefaultValue.subtle.border.width})`,
            color: {
                normal: `var(${TokenVarName.subtle.border.color.normal}, ${TokenDefaultValue.subtle.border.color.normal})`,
                hover: `var(${TokenVarName.subtle.border.color.hover}, ${TokenDefaultValue.subtle.border.color.hover})`,
                active: `var(${TokenVarName.subtle.border.color.active}, ${TokenDefaultValue.subtle.border.color.active})`
            },
        },
        backgroundColor: {
            normal: `var(${TokenVarName.subtle.backgroundColor.normal}, ${TokenDefaultValue.subtle.backgroundColor.normal})`
        },
        color: {
            hover: `var(${TokenVarName.subtle.color.hover}, ${TokenDefaultValue.subtle.color.hover})`,
            active: `var(${TokenVarName.subtle.color.active}, ${TokenDefaultValue.subtle.color.active})`
        }
    }
}

export default Token;
