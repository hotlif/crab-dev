import { useEffect, useState, type FC } from "react";
import { css } from "@linaria/core";
import { BsCode, BsCodeSlash } from "react-icons/bs";
import demos from "@@@/demos";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CodeProps {
    path: string
}

const Code: FC<CodeProps> = ({
    path
}) => {
    const [reactElement, setReactElement] = useState();
    const [isExpandCode, setIsExpandCode] = useState(false);
    const [code, setCode] = useState();
    useEffect(() => {
        const element = demos.find(element => element.path === path);
        element?.source?.then(source => {
            setCode(source?.default);
        })
        element?.component?.then?.((Component) => {
            setReactElement(<Component.default />);
        })
    }, [path])
    return (
        <div
            className={css`
                margin-top: 2rem;
            `}
        >
            <div
                className={css`
                    position: relative;
                    border-left: 1px solid #eaeaea;
                    border-right: 1px solid #eaeaea;
                    border-top: 1px solid #eaeaea;
                    flex: 0 0 50%;
                    min-height: 100px;
                    padding: 1rem;
                `}
            >
                {reactElement}
            </div>
            <div
                className={css`
                    padding: 12px 0px;
                    display: flex;
                    justify-content: center;
                    cursor: pointer;
                    border: 1px solid #eaeaea;
                `}
            >
                <div
                    className={css`
                        user-select: none;
                    `}
                    onClick={() => {
                        setIsExpandCode(!isExpandCode);
                    }}
                >
                    {isExpandCode ?  <BsCodeSlash /> : <BsCode />}
                    
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
                            padding-left: 1rem;
                            font-size: 16px;
                        `}
                    >
                        <SyntaxHighlighter language="javascript" style={vs}>
                            {code}
                        </SyntaxHighlighter>
                    </div>
                ) : null
            }
           
        </div>
    )
}


const Codes: FC<CodeProps> = ({
    path
}) => {
    const [reactElement, setReactElement] = useState();
    useEffect(() => {
        const left = [];
        const right = [];
        demos.filter(element => element.path?.startsWith(path)).forEach((element, index) => {
            if (index % 2 === 0) {
                left.push(<Code key={element.path} path={element.path}/> )
            } else {
                right.push(<Code key={element.path} path={element.path}/> )
            }
        });
        setReactElement(
            <>
                <div
                    className={css`
                        display: flex;
                        flex-direction: column;
                    `}
                >
                    {left}
                </div>
                <div
                    className={css`
                        display: flex;
                        flex-direction: column;
                    `}
                >
                    {right}
                </div>
            </>
        )
    }, [path])
    return (
        <div
            className={css`
                display: grid;
                grid-template-columns: 1fr 1fr;
                width: 100%;
                gap: 1rem;
            `}
        >
            {reactElement}
        </div>
    )
}

export default Codes;