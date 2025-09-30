import {
    height,
    width,
    flex,
    flexDirection,
} from "@crab-dev/styleify";
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
                ${flex()}
                ${flexDirection("column")}
                ${width("100%")}
                ${height("100%")}
                box-sizing: border-box;
                overflow: hidden;
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
                    ${flex()}
                    ${height("100%")}
                    flex-grow: 1;
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
