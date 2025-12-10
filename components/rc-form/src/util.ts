import { ItemInstance } from "./item";

export const findItemByName = (data: Set<ItemInstance<any>>, name: string) => {
    const entries = data.values();
    while (true) {
        const result = entries.next();
        if (result.done) break;
        if (result.value.getName() === name) {
            return result.value;
        }
    }
    return null;
}


export const getItemsToObject = (data: Set<ItemInstance<any>>) => {
    const resultObject: any = {};
    const entries = data.values();
    while (true) {
        const result = entries.next();
        if (result.done) break;
        if (result.value) {
            const name = result.value.getName();
            const value = result.value.getValue();
            resultObject[name] = value;
        }
    }
    return resultObject;
}