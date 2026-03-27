import { css, cx } from '@linaria/core';
import { useState, type FC, type HTMLAttributes, type ReactNode } from 'react';
import ReactMarkdown from "react-markdown";
import { Prism } from 'react-syntax-highlighter';
// @ts-expect-error
import vs from 'react-syntax-highlighter/dist/esm/styles/prism/vs.js';
import { CodeXml, Code, AppWindow } from "./icons";

export interface PreviewProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    title: ReactNode
    description: string
    path: string
    sourceCode: string
}

const Preview: FC<PreviewProps> = ({
    title,
    description,
    children,
    sourceCode,
    path,
    ...restProps
}) => {
    const [isExpandCode, setIsExpandCode] = useState(false);
    return (
        <div
            className={cx(css`
                
            `)}
            {...restProps}
        >
            <div
                className={css`
                    padding: 2rem 1rem;
                    border: 1px solid #eaeaea;
                `}
            >
                {children}
            </div>
            <div
                className={css`
                    position: relative;
                    padding: 1rem;
                    border-left: 1px solid #eaeaea;
                    border-right: 1px solid #eaeaea;
                `}
            >
                <div
                    className={css`
                        position: absolute;
                        color: rgba(0,0,0,0.88);
                        font-weight: 500;
                        font-size: 14px;   
                        top: -14px;
                        padding: 1px 8px; 
                        background-color: #fff;
                    `}
                >
                    {title}
                </div>
                <div>
                    <ReactMarkdown>
                        {description}
                    </ReactMarkdown>
                </div>
            </div>
            <div
                className={css`
                    padding: 12px 0px;
                    display: flex;
                    justify-content: center;
                    border: 1px solid #eaeaea;
                    gap: 1rem;
                    > div {
                        cursor: pointer;
                        user-select: none;
                    }
                `}
            >
                <div
                    onClick={() => {
                        setIsExpandCode(!isExpandCode);
                    }}
                >
                    {isExpandCode ?  <CodeXml /> : <Code />}
                </div>
                <div
                    onClick={() => {
                        window.open(path)
                    }}
                >
                    <AppWindow />
                </div>
            </div>
            {
                isExpandCode ? (
                     <div
                        className={css`
                            display: flex;
                            border-left: 1px solid #eaeaea;
                            border-right: 1px solid #eaeaea;
                            border-bottom: 1px solid #eaeaea;
                            overflow: hidden;
                        `}
                    >
                        <Prism
                            language="jsx"
                            style={vs}
                            wrapLongLines
                            customStyle={{
                                border: "unset",
                                fontSize: 16,
                                margin: 0,
                                maxWidth: "100%",
                            }}
                        >
                            {sourceCode}
                        </Prism>
                    </div>
                ) : null
            }
           
        </div>
    )
}

export default Preview;