import { createContext, createRef, type FC, type ReactNode, type RefObject, useContext, useEffect, useRef } from "react";
import axios, { type CreateAxiosDefaults, type AxiosInstance } from "axios";
import { nanoid } from "nanoid";
import { addRequestEntity, addResponseEntity } from "./database";

interface RequestContextType {
    instance: RefObject<AxiosInstance | null>;
}
  
export const RequestContext = createContext<RequestContextType>({
    instance: createRef(),
});

export const useRequestContext = () => {
    const context = useContext(RequestContext);
    if (!context) throw new Error("useRequestContext must be used within a RequestProvider");
    return context;
}

interface RequestProviderProps {
    config: CreateAxiosDefaults,
    children: ReactNode
}

export const RequestProvider: FC<RequestProviderProps> = ({
    config,
    children
}) => {
    const instance = useRef<AxiosInstance>(axios.create(config));

    useEffect(() => {
        const requestInterceptor = instance.current.interceptors.request.use(
            async (config: any) => {
                const requestId = nanoid();
                config.headers["CRAB-REQUEST-ID"] = requestId;
                config._$RequestId = requestId;
                config._$RequestDateTime = new Date();
                await addRequestEntity({
                    id: requestId,
                    url: config.url!,
                    method: config.method!,
                    headers: config.headers!,
                    data: config.data,
                    createAt: new Date()
                });
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        )

        const responseInterceptors = instance.current.interceptors.response.use(
            async (response) => {
                const requestId = response.request.headers["CRAB-REQUEST-ID"];
                const createAt = new Date();
                await addResponseEntity({
                    id: requestId,
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                    data: response.data,
                    time: createAt.getTime() - (response.config as any)._$RequestDateTime.getTime(),
                    createAt: createAt
                })
                return response;
            },
            async (error) => {
                const createAt = new Date();
                const response = error.response;
                const requestId = error.config._$RequestId;
                const requestDateTime = error.config._$RequestDateTime;
                await addResponseEntity({
                    id: requestId,
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                    data: response.data,
                    time: createAt.getTime() - requestDateTime.getTime(),
                    createAt: createAt
                })
                return Promise.reject(error);
            }
        )
        return () => {
            instance.current.interceptors.request.eject(requestInterceptor);
            instance.current.interceptors.response.eject(responseInterceptors);
        }
    }, [])

    return (
        <RequestContext.Provider
            value={{
                instance
            }}
        >
            {children}
        </RequestContext.Provider>
    )
}
