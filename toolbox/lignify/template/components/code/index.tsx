import { useEffect, useState, type FC, useRef } from "react";
import { css } from "@linaria/core";
import { BsCode, BsCodeSlash, BsPalette, BsWindowFullscreen } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import demos from "@@@/demos";
import { Prism } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeProps {
    path: string
    columns: number
}

const Code: FC<CodeProps> = ({
    path
}) => {
    const [reactElement, setReactElement] = useState();
    const [isExpandCode, setIsExpandCode] = useState(false);
    const [code, setCode] = useState();
    const [frontmatter, setFrontmatter] = useState<Record<string,any>>({});
    const codeBlockRef = useRef<HTMLDivElement>(null);
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
        <div
            className={css`
            `}
        >
            <div
                className={css`
                    display: flex;
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
                        ref={codeBlockRef}
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
                            {code}
                        </Prism>
                    </div>
                ) : null
            }
           
        </div>
    )
}


const iconStyle = css`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`

const Codes: FC<CodeProps> = ({
    path,
    columns = 2
}) => {
    const [reactElement, setReactElement] = useState<JSX.Element>();
    
    useEffect(() => {
        const columns_array: JSX.Element[][] = Array.from({ length: columns }, () => []);
        
        demos.filter(element => element.path?.startsWith(path)).forEach((element, index) => {
            columns_array[index % columns].push(
                <Code key={element.path} path={element.path} />
            );
        });
        
        setReactElement(
            <>
                {columns_array.map((col, idx) => (
                    <div key={idx} className={iconStyle}>
                        {col}
                    </div>
                ))}
            </>
        );
    }, [path]);
    
    return (
        <div
            className={css`
                display: grid;
                gap: 1rem;
            `}
            style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
            }}
        >
            {reactElement}
        </div>
    );
}

export default Codes;