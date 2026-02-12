
import { useOutlet } from "react-router";
import { MDXProvider } from "@mdx-js/react";
import { css } from "@linaria/core";
import Code from "../components/code";
import DocGen from "../components/docgen";

const MarkdownLayout = () => {
    const outlet = useOutlet();
    return (
        <div
            className={css`
                padding: 0rem 4rem 4rem 4rem;
            `}
        >
            <MDXProvider
                components={{
                    Demos: Code,
                    API: DocGen
                }}
            >
                {outlet}
            </MDXProvider>
        </div>
    )
}

export default MarkdownLayout;