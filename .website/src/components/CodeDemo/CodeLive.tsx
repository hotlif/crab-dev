import { type HTMLAttributes, type FC, useState } from "react";
import RcLive from "@crab/rc-live";
import RcButton from "@crab/rc-button";
import RcTree, {
    LoadStateType, NodeType, getTreeNodeDepth, useTreeData
} from "@crab/rc-tree";
import { css, cx } from "@linaria/core";
import { flex, flexAlignItems, fontSize } from "@crab/styleify";
import { BsCode } from "react-icons/bs";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeLiveProps extends HTMLAttributes<HTMLDivElement> {
    source: string
    title: string,
    description: string,
}

const scopes = {
    RcButton,
    RcTree,
    LoadStateType,
    NodeType,
    getTreeNodeDepth,
    useTreeData,
    useState,
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
                    border-bottom: 1px solid rgba(5,5,5,0.06);
                `}
            >
                <RcLive
                    source={source}
                    scopes={scopes}
                />
            </div>
            <div
                className={css`
                    transform: translate(1.5rem, -10px);
                `}
            >
                {title}
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
