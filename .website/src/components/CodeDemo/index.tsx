import RcLive from "@crab/rc-live";
import { useEffect, useState } from "react";
import { dirname } from "path";
import { useMatches, useRouteLoaderData } from "react-router";

import CodeLive from "./CodeLive";
import mdxs from "@@@/mdx";
import demos from "@@@/demos";
import { css } from "@linaria/core";

type DemoType = typeof demos[number];

const CodeDemo = () => {
    const matches = useMatches()
    const currentRouter = matches.pop();
    const {
        metadata,
    } = useRouteLoaderData(currentRouter!.id);

 
    const [codeSourceDemos, setCodeSourceDemos] = useState<DemoType[]>([]);

    useEffect(() => {
        const md = mdxs.find(element => element.metadata?.path === metadata?.path);
        if (md != null) {
            const {
                relativePath
            } = md;
            const path = dirname(relativePath);
            const demosCode = demos.filter(element => element.relativePath.substring(0, path.length) === path);
            if (demosCode) {
                setCodeSourceDemos(demosCode);
            }
        }
    }, [])
    return (
        <div
            className={css`
                display: flex;
                flex-wrap: wrap;
            `}
        >
            {codeSourceDemos.map(element => (
                <CodeLive
                    className={css`
                        flex: 0 0 50%;
                    `}
                    source={element.source}
                    title={element.metadata?.title}
                    description={element.metadata?.description}
                />
            ))}
        </div>
    )
}

export default CodeDemo;
