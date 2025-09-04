/**
 * title="基础用法"
 * description="一个简单的 Menu 导航"
 */
import RcMenu, { MenuItemType } from "@crab/rc-menu";
import { Key, useState } from "react";

const ChevronDown = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
        >
            <path
                fillRule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
            />
        </svg>
    )
}

const ChevronUp = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
        >
            <path
                fillRule="evenodd"
                d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
            />
        </svg>
    )
}

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
						icon: <ChevronDown />,
						children: [{
							type: MenuItemType.Item,
							icon: <ChevronDown />,
							key: 21,
							title: "用户调整",
						}, {
							type: MenuItemType.Item,
							icon: <ChevronDown />,
							key: 22,
							title: "用户删除",
						}]
					}, {
						type: MenuItemType.ItemGroup,
						icon: <ChevronDown />,
						key: 3,
						title: "角色管理",
						children: [{
							type: MenuItemType.Item,
							icon: <ChevronDown />,
							key: 31,
							title: "人员角色",
						}, {
							type: MenuItemType.Item,
							icon: <ChevronDown />,
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
						icon: <ChevronDown />,
						key: 12,
						title: "菜单维护",
						children: [{
							type: MenuItemType.Item,
							icon: <ChevronDown />,	
							key: 121,
							title: "菜单新增",
						}, {
							type: MenuItemType.Item,
							icon: <ChevronDown />,
							key: 122,
							title: "菜单编辑",
						}, {
							type: MenuItemType.Item,
							key: 123,
							icon: <ChevronDown />,
							title: "菜单删除",
						}]
					}, {
						type: MenuItemType.Item,
						icon: <ChevronDown />,
						key: 13,
						title: "数据字典维护",
					}]
				}]}
			/>
		</>
	);
};

export default SimpleFrame;
