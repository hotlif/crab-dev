
/**
 * title = "基本"
 * description = "一个基础的对话框"
 */

import { useState } from "react";
import Button from "@crab-dev/rc-button";

import Dialog from "../../src/index.js";


const BaseDemo = () => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <Dialog
                title="基本对话框"
                open={open}
                onOpenChange={setOpen}
            >
                这是一个基础的对话框信息
            </Dialog>
            <Button
                onClick={() => {
                    setOpen(true)
                }}
            >
                打开对话框
            </Button>
        </>
    )
}

export default BaseDemo;