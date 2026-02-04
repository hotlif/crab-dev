import { css, cx } from "@linaria/core";
import RcMenu, { MenuItem, MenuItemType } from "@crab-dev/rc-menu";
import { useNavigate, useOutlet } from "react-router";
import { MDXProvider } from "@mdx-js/react";
import mdxs from "@@@/mdxs";
import Code from "../components/code";
import DocGen from "../components/docgen";

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

    const isSingleComponent = mdxs.find(element => element.path === "/docs/README.md") != null;
    const renderSidebar = () => {
        if (isSingleComponent) {
            return null;
        }
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
            {!isSingleComponent && (
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
            )}
            
            <div
                className={css`
                    display: flex;
                    flex: 1;
                    min-height: 0;
                `}
            >
                {renderSidebar()}
                <main
                    className={cx(css`
                        margin-left: 1rem;
                        height: 100%;
                        overflow: auto;
                        min-height: 0;
                        min-width: 0;
                        flex: 1;
                    `, isSingleComponent && css`
                        padding: 0rem 4rem;
                    `)}
                >
                    <MDXProvider
                        components={{
                            Demos: Code,
                            API: DocGen
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
