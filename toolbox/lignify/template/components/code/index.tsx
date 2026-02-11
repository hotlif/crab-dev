import { useEffect, useState, type FC } from "react";
import { css } from "@linaria/core";
import { BsCode, BsCodeSlash, BsPalette, BsWindowFullscreen } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
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
    const [frontmatter, setFrontmatter] = useState<Record<string,any>>({});
    useEffect(() => {
        const element = demos.find(element => element.path === path);
        setFrontmatter(element?.frontmatter);
        element?.source?.then(source => {
            setCode(source?.default);
        })
        element?.component?.then?.((Component) => {
            setReactElement(<Component.default />);
        })
    }, [path])
    return (
        <div>
            <div
                className={css`
                    position: relative;
                    border: 1px solid #eaeaea;
                    flex: 0 0 50%;
                    min-height: 60px;
                    padding: 1rem;
                `}
            >
                {reactElement}
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
                    {frontmatter?.title}
                </div>
                <div>
                    <ReactMarkdown>
                        {frontmatter?.description}
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
                    {isExpandCode ?  <BsCodeSlash /> : <BsCode />}
                </div>
                <div>
                    <BsPalette />
                </div>
                <div
                    onClick={() => {
                        window.open(path.replaceAll(".", "/"))
                    }}
                >
                    <BsWindowFullscreen />
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


const iconStyle = css`
    display: flex;
    flex-direction: column;
`

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
                    className={iconStyle}
                >
                    {left}
                </div>
                <div
                    className={iconStyle}
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