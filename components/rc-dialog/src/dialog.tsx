
import { css } from '@linaria/core';
import { useEffect, useLayoutEffect, useRef, type FC, type HTMLAttributes, type ReactNode} from 'react';

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    /**
     *  dialog 的标题
     */
    title?: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const Dialog: FC<DialogProps> = ({
    open,
    onOpenChange,
    title
}) => {
c
    return (
        <>
            <dialog
                className={css`
                    width: 50%;
                    top: 25%;
                    padding: 0;
                `}
                open={open}
            >
                <div
                    className={css`
                        display: flex;
                    `}
                >
                    
                </div>
                <div
                    className={css`
                        height: 200px;
                    `}
                >

                </div>
            </dialog>
        </>
    )
}

export default Dialog;