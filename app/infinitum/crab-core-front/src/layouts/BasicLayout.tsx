import { useOutlet } from "react-router";
import RcFrame from "@crab-dev/rc-frame";
import { css } from "@linaria/core";
import { padding } from "@crab-dev/styleify";
import { useMenuRequest } from "../service/basic";

const BasicLayout = () => {
    const outlet = useOutlet();

    const [, getMenus] = useMenuRequest();
    return (
        <RcFrame
            headerTitle="Infinitum"
            headerLogoIconUrl="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            headerUserName="张尽"
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
