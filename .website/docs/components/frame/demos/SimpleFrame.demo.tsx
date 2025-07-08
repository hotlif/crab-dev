/**
 * title = "基础用法"
 * description = "一个简单的框架"
 * [style]
 * gridColumn = "span 2"
 */
import Frame from "@crab/rc-frame";
import { MenuItemType } from "@crab/rc-menu";

const SimpleFrame = () => {
	return (
		<Frame
			style={{
				height: 400
			}}
			headerTitle="Crab Frame"
			headerLogoIconUrl="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
			headerUserName="testInfo"
			sidebarLoadMenus={async () => {
				return [{
					type: MenuItemType.Item,
					key: 1,
					title: "人员信息",
					children: [{
						type: MenuItemType.ItemGroup,
						key: 2,
						title: "用户管理",
						children: [{
							type: MenuItemType.Item,
							key: 21,
							title: "用户调整",
						}, {
							type: MenuItemType.Item,
							key: 22,
							title: "用户删除",
						}]
					}, {
						type: MenuItemType.ItemGroup,
						key: 3,
						title: "角色管理",
						children: [{
							type: MenuItemType.Item,
							key: 31,
							title: "人员角色",
						}, {
							type: MenuItemType.Item,
							key: 32,
							title: "系统角色",
						}]
					}]
				},{
					type: MenuItemType.Item,
					key: 11,
					title: "系统管理",
					children: [{
						type: MenuItemType.Item,
						key: 12,
						title: "菜单维护",
					}, {
						type: MenuItemType.Item,
						key: 13,
						title: "数据字典维护",
					}]
				}]
			}}
		/>
	);
};

export default SimpleFrame;
