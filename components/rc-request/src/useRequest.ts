import { useRequestContext } from "./RequestContext";

const useRequest = () => {
    const context = useRequestContext();
    return [context.instance.current!]
}

export default useRequest;
