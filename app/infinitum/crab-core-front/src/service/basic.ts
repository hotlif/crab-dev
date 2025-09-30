import { useState } from "react"
import { useRequest } from "@crab-dev/rc-request";

interface MenuType {
    id: number
    name: string
    icon: string
    parent_id: number
    create_at: number
    path: string
    updated_at: number
}

export const useMenuRequest = (): [boolean,  () => Promise<any[]>] => {
    const [loading, setLoading] = useState<boolean>(false);
    const [request] = useRequest();
    return [
        loading,
        async () => {
            try {
                setLoading(true);
                const { data } = await request.get<{
                    payload: MenuType[]
                }>("/menu/get/user");
                const recursiveProcessingOfTreeStructure = (parentId: number): Array<any> => {
                    const currentData = data.payload.filter(element => element.parent_id === parentId);
                    return currentData.map(element => ({
                        icon: element.icon,
                        title: element.name,
                        data: element,
                        type: 0,
                        key: element.id,
                        children: recursiveProcessingOfTreeStructure(element.id)
                    }));
                }
                const returnData = recursiveProcessingOfTreeStructure(0);
                return returnData;
            } catch (error: any) {
                const {
                    data
                } = error.response
                setLoading(false)
                return [];
            }
        }
    ]
}
