
/**
 * title = "基础"
 * description = "一个基础的打印模板设计器"
 */

import PrinterDraftEditor from "../../src/index";
import TSPL, { CustomizeWidget } from "../../src/widgets/tspl";

const SizeDemo = () => {
    return (
        <PrinterDraftEditor
            style={{
                flex: 1
            }}
            resources={TSPL}
            pageSettings={{
                width: 500,
                height: 400
            }}
            CustomizeWidget={CustomizeWidget}
        />
    )
}

export default SizeDemo;