import { useMemo, type ReactElement } from "react";
import { Entity } from "../entity";
import Item, { type Editor } from "../item";

const useEntityCreateItems = (entity: Entity, editors: Record<string, ReactElement<Editor<any>>>) => {
    const items = useMemo(() => {
        return entity.fields.map(element => (
            <Item
                name={element.name}
                label={element.label}
            >
                {editors?.[element.type]}
            </Item>
        ))
    }, [entity])
    return [items]
}

export default useEntityCreateItems;