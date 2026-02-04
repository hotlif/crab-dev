import { type ButtonHTMLAttributes } from "react"

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "onClickCapture"> {

    /**
     * 加载中
     */
    loading?: boolean

	/**
	 * 按钮类型
	 */
	appearance?: "primary" | "subtle" | "dashed" | "text" | "link"
    
    /**
     * 按钮的大小, 默认为 middle
     */
    size?: "large" | "middle" | "small"

    /**
	 * 宽度设置为父容器宽度
	 */
	shouldFitContainer?: boolean

    /**
     * see ButtonHTMLAttributes<HTMLButtonElement>["onClick"]
     */
    onClick?: (param: Parameters<NonNullable<ButtonHTMLAttributes<HTMLButtonElement>["onClick"]>>[0]) => Promise<void> | void

    /**
     * see ButtonHTMLAttributes<HTMLButtonElement>["onClickCapture"]
     */
    onClickCapture?: (param: Parameters<NonNullable<ButtonHTMLAttributes<HTMLButtonElement>["onClickCapture"]>>[0]) => Promise<void> | void
}
