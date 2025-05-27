import { alignItems, cursor, display, fontSize, fontWeight, height, margin, position } from "@crab/styleify"
import { css } from "@linaria/core"
import { useMatches, useNavigate } from "react-router";
import { type Key } from "react";

import DocsIndexLayout from "./DocsIndexLayout";
import DocsLayout from "./DocsLayout";
import { getConfig } from "../util/global";
import mdxs from "@@@/mdx"

const config = getConfig();

const BasicLayout = () => {

    const navigate = useNavigate();
    const matches = useMatches()
    const currentRouter = matches.pop();


    const getNavs = () => {
        const navs: {
            id: Key,
            title: string
        }[] = [];
        mdxs.forEach(element => {
            if (element.metadata.nav) {
                const { id } = element.metadata.nav;
                if (navs.find(e => e.id === id) == null) {
                    navs.push(element.metadata.nav)
                }
            }
        })
        return navs;
    }
    const renderContent = () => {
        if (currentRouter?.pathname === "/") {
            return <DocsIndexLayout />
        } else {
            return <DocsLayout />
        }
    }


    return (
        <>
            <header
                className={css`
                    ${position("sticky")}
                    ${display("flex")}
                    ${height("14")}
                    ${alignItems("center")}
                    top: 0px;
                    background-color: rgb(245, 245, 245);
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
                `}
            >
                <div
                    className={css`
                        ${margin("ml-6")}
                        ${cursor("pointer")}
                        ${display("flex")}
                        ${alignItems("center")}
                    `}
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    <img
                        className={css`
                            width: 3rem;
                            height: 3rem;
                            margin-right: 0.5rem;
                            user-select: none;
                        `}
                        src="/images/crab.png"
                    />
                    <h1
                        className={css`
                            ${fontSize("xl")}
                            ${fontWeight("bold")}
                            user-select: none;
                        `}
                    >
                        {config.title}
                    </h1>
                </div>
                <div
                    className={css`
                        flex: 1;
                    `}
                />
                <div>
                    <ul
                        className={css`
                            padding-right: 1rem;
                        `}
                    >
                        {getNavs().map(element => (
                            <li
                                className={css`
                                    ${display("inline")}
                                    ${cursor("pointer")}
                                    margin-right: 1rem;
                                `}
                                key={element.id}
                                onClick={() => {
                                    const md = mdxs.find(e => element.id === e.metadata?.nav?.id);
                                    if (md && md.metadata?.path) {
                                        navigate(md.metadata?.path)
                                    }
                                }}
                            >
                                {element.title}
                            </li>
                        ))}
                    </ul>
                </div>
            </header>
             {renderContent()}
        </>
    )
}

export default BasicLayout;
