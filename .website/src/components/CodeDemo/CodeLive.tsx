import { type HTMLAttributes, type FC, useState } from "react";
import RcLive from "@crab/rc-live";
import RcButton from "@crab/rc-button";
import { css, cx } from "@linaria/core";
import { alignItems, cursor, display, fontWeight, fontSize } from "@crab/styleify";
import { BsCode } from "react-icons/bs";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeLiveProps extends HTMLAttributes<HTMLDivElement> {
    source: string
    title: string,
    description: string,
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
                    border-top: 1px solid rgba(5,5,5,0.06);  
                    > pre {
                        margin: 0px !important;
                    }  
                `}
            >
                <SyntaxHighlighter
                    language="tsx"
                    style={vs}
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
                    scopes={{
                        RcButton
                    }}
                />
            </div>
            <div
                className={css`
                    transform: translate(1.5rem, -10px);
                    ${fontWeight("bold")}
                `}
            >
                {title}
            </div>
            <div
                className={css`
                    ${fontSize("sm")}
                    padding: 0.5rem 1.5rem 1.5rem 1.5rem;
                `}
            >
                {description}
            </div>
            <div
                className={css`
                    ${display("flex")}
                    ${alignItems("center")}
                    justify-content: center;
                    padding: 12px 0;
                    border-top: 1px solid rgba(5,5,5,0.06);
                `}
            >
                <span
                    className={css`
                        ${cursor("pointer")}    
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
