import {
    height,
    width,
    boxSizing,
    display,
    flexDirection,
    flexGrow,
    overflow
} from "@crab/styleify";
import type { FC, HTMLAttributes, ReactNode } from "react";
import { cx, css } from "@linaria/core";
import Header from "./header";
import Sidebar, { SidebarProps } from "./sidebar";
import Content from "./content";

interface FrameProps extends Omit<HTMLAttributes<HTMLDivElement>, ""> {
    headerTitle?: string
    headerLogoIconUrl?: string
    headerUserName?: ReactNode
    sidebarLoadMenus?: SidebarProps["loadMenus"]
}

const Frame: FC<FrameProps> = ({
    className,
    headerTitle,
    headerLogoIconUrl,
    headerUserName,
    sidebarLoadMenus,
    children,
    ...restProps
}) => {
    return (
        <div
            className={cx(className, css`
                ${display("flex")}
                ${flexDirection("col")}
                ${width("full")}
                ${height("full")}
                ${boxSizing("border")}
                ${overflow("hidden")}
            `)}
            {...restProps}
        >
            <Header
                title={headerTitle}
                username={headerUserName}
                logoIconUrl={headerLogoIconUrl}
            />
            <div
                className={css`
                    ${display("flex")}
                    ${flexGrow(1)}
                    ${height("full")}
                `}
            >
                <Sidebar
                    loadMenus={sidebarLoadMenus}
                />
                <Content>
                    {children}
                </Content>
            </div>
        </div>
    )
}

export default Frame;
