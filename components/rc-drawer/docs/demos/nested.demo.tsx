export const meta = {
    title: "嵌套打开",
    description: "支持层层嵌套打开（示例共 10 层）；每层独立维护开关状态，关闭后不影响下层。",
};

import { useState } from "react";
import Button from "@crab-dev/rc-button";

import Drawer, { type DrawerSize } from "../../src/index.js";

const TOTAL_LEVELS = 10;

const getSize = (level: number): DrawerSize => {
    if (level <= 3) return "large";
    if (level <= 6) return "medium";
    return "small";
};

interface LevelDrawerProps {
    level: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const LevelDrawer = ({ level, open, onOpenChange }: LevelDrawerProps) => {
    const [childOpen, setChildOpen] = useState(false);
    const hasChild = level < TOTAL_LEVELS;
    return (
        <>
            <Drawer
                open={open}
                onOpenChange={onOpenChange}
                title={`第 ${level} 层抽屉`}
                size={getSize(level)}
                footer={
                    <>
                        <Button onClick={() => onOpenChange(false)}>关闭当前层</Button>
                        {hasChild && (
                            <Button appearance="primary" onClick={() => setChildOpen(true)}>
                                打开第 {level + 1} 层
                            </Button>
                        )}
                    </>
                }
            >
                <p>当前层级：{level} / {TOTAL_LEVELS}</p>
                <p>
                    {hasChild
                        ? "点击底部按钮可以继续在此之上叠加一层抽屉。"
                        : "已到达最深一层，关闭后将逐级回到上一层。"}
                </p>
            </Drawer>
            {hasChild && (
                <LevelDrawer
                    level={level + 1}
                    open={childOpen}
                    onOpenChange={setChildOpen}
                />
            )}
        </>
    );
};

const NestedDemo = () => {
    const [rootOpen, setRootOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setRootOpen(true)}>打开第 1 层</Button>
            <LevelDrawer level={1} open={rootOpen} onOpenChange={setRootOpen} />
        </>
    );
};

export default NestedDemo;
