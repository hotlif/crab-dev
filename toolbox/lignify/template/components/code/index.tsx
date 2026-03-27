import { useEffect, useState, type FC, useRef } from "react";
import { css } from "@linaria/core";
import ComponentPreview from "@crab-dev/rc-component-preview";
import demos from "@@@/demos";

interface CodeProps {
    path: string
    columns: number
}

const Code: FC<CodeProps> = ({
    path
}) => {
    const [reactElement, setReactElement] = useState();
    const [code, setCode] = useState<string>("");
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
        <ComponentPreview
            path={path}
            title={frontmatter?.title}
            description={frontmatter?.description}
            sourceCode={code}
        >
            {reactElement}
        </ComponentPreview>
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