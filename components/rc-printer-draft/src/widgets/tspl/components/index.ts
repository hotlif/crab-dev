import { WidgetType } from "../types";

import Text from "./Text";
import Barcode from "./Barcode";

const Components = [{
    name: WidgetType.Text,
    component: Text
}, {
    name: WidgetType.Barcode,
    component: Barcode
}]

export default Components;