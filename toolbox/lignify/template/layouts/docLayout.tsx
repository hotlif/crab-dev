
import { useOutlet } from "react-router";
import { MDXProvider } from "@mdx-js/react";
import { css } from "@linaria/core";
import DemoMasonry from "../components/code/index.js";
import DocGen from "../components/docgen.js";

const DocLayout = () => {
    const outlet = useOutlet();
    return (
        <div
            className={css`
                padding: 0rem 4rem 4rem 4rem;
            `}
        >
            <MDXProvider
                components={{
                    Demos: DemoMasonry,
                    API: DocGen
                }}
            >
                {outlet}
            </MDXProvider>
        </div>
    )
}

export default DocLayout;