import { css } from "@linaria/core";
import RcMenu, { MenuItem, MenuItemType } from "@crab-dev/rc-menu";
import { Key, useState } from "react";
import { useNavigate, useOutlet } from "react-router";
import { MDXProvider } from "@mdx-js/react";
import mdxs from "@@@/mdxs";
import Code from "../components/code";

const getMenuItems = () => {
    const items: MenuItem[] = [];
    mdxs.forEach((mdx: any) => {
        const title = mdx?.frontmatter?.title;
        items.push({
            type: MenuItemType.Item,
            title: title || mdx?.name,
            key: mdx?.name,
            data: mdx
        })
    })
    return items;
}


const LayoutIndex = () => {
    const outlet = useOutlet();
    const navigate = useNavigate();
    const renderSidebar = () => {
        return (
            <aside
                className={css`
                    width: 250px;
                    border-right: 1px solid #eaeaea;
                    padding: 0.5rem 0.2rem;
                `}
            >
                <RcMenu
                    items={getMenuItems()}
                    onSelectItem={({
                        item
                    }) => {
                        const data: any = item.data;
                        const path = (data?.frontmatter?.path ?? data?.path).split(".")[0];
                        if (path) {
                            navigate(path);
                        }
                    }}
                />
            </aside>   
        )
    }
    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                height: 100%;
            `}
        >
            <header
                className={css`
                    display: flex;
                    align-items: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.025), 0 2px 6px rgba(0,0,0,0.035);
                    height: 50px;
                    flex-shrink: 0;
                    padding-left: 1rem;
                `}
            >
                <div
                    className={css`
                        font-size: 16px;
                        cursor: pointer;
                    `}
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    Lignify
                </div>
            </header>
            <div
                className={css`
                    display: flex;
                    flex: 1;
                    min-height: 0;
                `}
            >
                {renderSidebar()}
                <main
                    className={css`
                        margin-left: 1rem;
                        height: 100%;
                        overflow: auto;
                        min-height: 0;
                        min-width: 0;
                        flex: 1;
                    `}
                >
                    <MDXProvider
                        components={{
                            Demos: Code
                        }}
                    >
                        {outlet}
                    </MDXProvider>
                </main>
            </div>
        </div>
    )
}

export default LayoutIndex;
