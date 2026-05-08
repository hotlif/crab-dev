import { css } from "@linaria/core";
import { Outlet, ScrollRestoration } from "react-router";
import SiteHeader from "../components/siteHeader.js";
import SiteFooter from "../components/siteFooter.js";

const rootStyle = css`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

const mainStyle = css`
    flex: 1;
    width: 100%;
`;

const SiteLayout = () => {
    return (
        <div className={rootStyle}>
            <ScrollRestoration />
            <SiteHeader />
            <main className={mainStyle}>
                <Outlet />
            </main>
            <SiteFooter />
        </div>
    );
};

export default SiteLayout;
