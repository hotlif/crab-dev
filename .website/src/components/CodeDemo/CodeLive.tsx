import { type HTMLAttributes, type FC, useState } from "react";
import RcLive from "@crab/rc-live";
import RcButton from "@crab/rc-button";
import RcTree, {
    LoadStateType, NodeType, getTreeNodeDepth, useTreeData
} from "@crab/rc-tree";
import { css, cx } from "@linaria/core";
import { flex, flexAlignItems, fontSize } from "@crab/styleify";
import Table from "@crab/rc-table";
import { BsCode } from "react-icons/bs";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { fakerZH_CN } from "@faker-js/faker"
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import RcFrame from "@crab/rc-frame";
import { MenuItemType } from "@crab/rc-menu";
import LineEdit from "@crab/rc-line-edit";
import { AiOutlineLock  } from "react-icons/ai";

interface CodeLiveProps extends HTMLAttributes<HTMLDivElement> {
    source: string
    title: string,
    description: string,
}

const scopes = {
    Button: RcButton,
    Tree: RcTree,
    LoadStateType,
    NodeType,
    getTreeNodeDepth,
    useTreeData,
    useState,
    fakerZH_CN,
    Table,
    Frame: RcFrame,
    MenuItemType: MenuItemType,
    LineEdit,
    AiOutlineLock
}

const CodeLive: FC<CodeLiveProps> = ({
    source,
    title,
    description,
    className,
    ...restProps
}) => {

    const [isShowCode, setIsShowCode] = useState<boolean>(false);

    const renderCode = () => {
        if (!isShowCode) {
            return null;
        }
        return (
            <div
                className={css`
                    > pre {
                        margin: 0px !important;
                    }  
                `}
            >
                <SyntaxHighlighter
                    language="tsx"
                    style={{
                        ...vs,
                        "pre[class*=\"language-\"]": {
                            ...vs["pre[class*=\"language-\"]"],
                            backgroundColor: "transparent"
                        }
                    }}
                >
                    {source}
                </SyntaxHighlighter>
            </div>
        )
    }

    return (
        <div
            className={cx(css`
                border: 1px solid rgba(5,5,5,0.06);
            `, className)}
            {...restProps}
        >
            <div
                className={css`
                    position: relative;
                    padding: 42px 24px 50px;
                `}
            >
                <RcLive
                    source={source}
                    scopes={scopes}
                />
            </div>
            <div
                className={css`
                    display: flex;
                    align-items: center;
                    &::after {
                        content: "";
                        height: 1px;
                        flex: 1;
                        border-top: 1px solid rgba(5,5,5,0.06);
                    }
                    &::before {
                        content: "";
                        width: 2rem;
                        height: 1px;
                        border-top: 1px solid rgba(5,5,5,0.06);
                    }
                `}
            >
                <span
                    className={css`
                        padding-inline: 1rem;
                    `}
                >
                    {title}
                </span>
            </div>
            <div
                className={css`
                    ${fontSize("base")}
                    padding: 0.5rem 1.5rem 1.5rem 1.5rem;
                `}
            >
                {description}
            </div>
            <div
                className={css`
                    ${flex()}
                    ${flexAlignItems("center")}
                    justify-content: center;
                    padding: 12px 0;
                    border-top: 1px solid rgba(5,5,5,0.06);
                `}
            >
                <span
                    className={css`
                        cursor: pointer;
                    `}
                    onClick={() => {
                        setIsShowCode(!isShowCode)
                    }}
                >
                    <BsCode />
                </span>
            </div>
            {renderCode()}
        </div>
    )
}

export default CodeLive;
