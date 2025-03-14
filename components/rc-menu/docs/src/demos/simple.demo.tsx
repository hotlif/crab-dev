/**
 * label="基础用法"
 * description="一个简单的框架"
 */
import RcMenu, { MenuItemType } from "../../../src/index";
import { Key, useState } from "react";


const SimpleFrame = () => {
	const [selectKeys, setSelectKeys] = useState<Key[]>([]);
	const [openKeys, setOpenKeys] = useState<Key[]>([1, 11]);
	return (
		<RcMenu
			style={{
				width: 250
			}}
			selectedKeys={selectKeys}
			onSelectItem={({
				selectedKeys,
				item
			}) => {
				console.log(item)
				setSelectKeys(selectedKeys)
			}}
			openKeys={openKeys}
			onOpenChange={setOpenKeys}
			items={[{
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
			}]}
		/>
	);
};

export default SimpleFrame;
