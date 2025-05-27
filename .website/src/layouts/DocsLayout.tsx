import { useMatches, useNavigate, useOutlet, useRouteLoaderData } from "react-router";
import { useRef, type FC } from "react";
import { css, cx } from "@linaria/core";
import { cursor, display, fontSize } from "@crab/styleify";
import { useViewportSize } from "@crab/rc-hooks"

import mdxs from "@@@/mdx"
import markdownStyle from "../styles/Markdown";

interface DocsLayoutProps {
}

const selectMenuStyle = css`
    background-color: rgb(230, 244, 255);
    color: rgb(22, 119, 255);
`

const DocsLayout: FC<DocsLayoutProps> = ({
}) => {
    const outlet = useOutlet();
    const matches = useMatches()
    const currentRouter = matches[matches.length - 1];
    const navigate = useNavigate();

    const {
        metadata,
    } = useRouteLoaderData(currentRouter!.id);

    return (
        <main
            className={css`
                ${display("flex")}
                flex: 1;
                overflow: auto;
            `}
        >
            <aside
                className={css`
                    position: sticky;
                    top: 0;
                    left: 0;
                    width: 258px;
                    padding: 1rem;
                    height: 100%;
                    box-sizing: border-box;
                    border-right: 1px solid rgba(5, 5, 5, 0.06);
                    overflow-y: auto;
                `}
            >
                <ul
                    className={css`
                        list-style-type: none;
                        padding-inline-start: 0px;
                        margin-block-start: 0px;
                        margin-block-end: 0px;
                    `}
                >
                    {mdxs.filter(element => element.metadata?.nav?.id === metadata?.nav?.id).map(element => (
                        <li
                            className={cx(
                                css`
                                    ${display("flex")}
                                    ${cursor("pointer")}
                                    ${fontSize("base")}
                                    align-items: center;
                                    height: 40px;
                                    padding-left: 30px;
                                    border-radius: 6px;
                                `,
                                element.metadata?.path === currentRouter?.pathname ? selectMenuStyle : null
                            )}
                            key={element.metadata.path}
                            onClick={() => {
                                navigate(element.metadata.path)
                            }}
                        >
                            {element.metadata.title}
                        </li>
                    ))}
                </ul>
            </aside>
            <div
                className={cx(markdownStyle, css`
                    flex: 1;
                    padding: 0rem 4rem 4rem 4rem;
                `)}
            >
                {outlet}
            </div>
        </main>
    )
}

export default DocsLayout;
