import type { FC, HTMLAttributes, ReactNode } from "react";
import { cx, css } from "@linaria/core";
import Header from "./header";
import Sidebar, { SidebarProps } from "./sidebar";
import Content from "./content";

interface FrameProps extends Omit<HTMLAttributes<HTMLDivElement>, ""> {
    headerTitle?: string
    headerLogoIconUrl?: string
    headerUserName?: ReactNode
    headerUserAvatar?: ReactNode
    sidebarLoadMenus?: SidebarProps["loadMenus"]
}

const Frame: FC<FrameProps> = ({
    className,
    headerTitle,
    headerLogoIconUrl,
    headerUserName,
    headerUserAvatar,
    sidebarLoadMenus,
    children,
    ...restProps
}) => {
    return (
        <div
            className={cx(className, css`
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                overflow: hidden;
            `)}
            {...restProps}
        >
            <Header
                title={headerTitle}
                username={headerUserName}
                logoIconUrl={headerLogoIconUrl}
                userAvatar={headerUserAvatar}
            />
            <div
                className={css`
                    display: flex;
                    height: 100%;
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
