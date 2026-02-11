
/**
 * title = "基础"
 * description = "一个基础的打印模板设计器"
 */

import PrinterDraftEditor from "../../src/index";
import { css } from "@linaria/core";
import TSPL, { CustomizeWidget } from "../../src/widgets/TSPL";

const SizeDemo = () => {

    return (
        <div
            className={css`
                margin-bottom: 1rem;
            `}
        >
            <PrinterDraftEditor
                resources={TSPL}
                pageSettings={{
                    width: 500,
                    height: 400
                }}
                CustomizeWidget={CustomizeWidget}
            />
        </div>
    )
}

export default SizeDemo;