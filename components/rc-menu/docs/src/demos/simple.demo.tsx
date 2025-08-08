import RcMenu, { MenuItemType } from "../../../src/index";
import { Key, useState } from "react";
import { ChevronDown, ChevronUp } from "../../../src/icon";


const SimpleFrame = () => {
	const [selectKeys, setSelectKeys] = useState<Key[]>([]);
	const [openKeys, setOpenKeys] = useState<Key[]>([1, 11]);
	const [mode, setMode] = useState<"horizontal" | "vertical">("vertical");

	return (
		<>
			<button
				onClick={() => {
					if (mode === "horizontal") {
						setMode("vertical");
					} else {
						setMode("horizontal");
					}
				}}
			>
				切换 Mode
			</button>
			<RcMenu
				style={{
					width: mode === "vertical" ? 250 : "auto"
				}}
				mode={mode}
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
					icon: <ChevronDown />,
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
					icon: <ChevronUp />,
					title: "系统管理",
					children: [{
						type: MenuItemType.Item,
						key: 12,
						title: "菜单维护",
						children: [{
							type: MenuItemType.Item,
							key: 121,
							title: "菜单新增",
						}, {
							type: MenuItemType.Item,
							key: 122,
							title: "菜单编辑",
						}, {
							type: MenuItemType.Item,
							key: 123,
							title: "菜单删除",
						}]
					}, {
						type: MenuItemType.Item,
						key: 13,
						title: "数据字典维护",
					}]
				}]}
			/>
		</>
	);
};

export default SimpleFrame;
