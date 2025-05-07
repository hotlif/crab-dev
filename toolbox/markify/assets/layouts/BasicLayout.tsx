import { css } from "@linaria/core";
import { useOutlet } from "react-router";
import { padding } from "@crab/styleify";
import RcFrame from "@crab/rc-frame";

const BasicLayout = () => {
    const outlet = useOutlet();
    return (
        <RcFrame
            headerTitle="<%=title %>"
            headerLogoIconUrl="<%=logo %>"
            headerUserName=""
            sidebarLoadMenus={async () => {
                const menus = await getMenus();
                return menus;
            }}
        >
            <div
                className={css`
                    ${padding("p-4")}
                `}
            >
                {outlet}
            </div>
        </RcFrame>
    )
}

export default BasicLayout;
