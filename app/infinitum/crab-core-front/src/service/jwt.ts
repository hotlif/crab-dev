import { useState } from "react"
import { useRequest } from "@crab/rc-request";
import { useNavigate } from "react-router";
import { setToken } from "../util/jwt";

export const useIssueRequest = (): [boolean,  (username: string, password: string) => Promise<void>] => {
    const [loading, setLoading] = useState<boolean>(false);
    const [request] = useRequest();
    const navigate = useNavigate();
    return [
        loading,
        async (username: string, password: string) => {
            try {
                setLoading(true);
                const jwt = await request.post("/jwt/issue", {
                    username,
                    password
                });
                setToken(jwt.data.payload);
                navigate("/");
            } catch (error: any) {
                const {
                    data
                } = error.response
                setLoading(false)
            }
        }
    ]
}
