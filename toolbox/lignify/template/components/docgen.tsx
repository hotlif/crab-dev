import { css } from "@linaria/core";
import { FC, useEffect, useState } from "react"

interface DocGenProps {
    url?: string
    path: string
}

let DocGenJSONCache: any = null;

const DocGen: FC<DocGenProps> = ({
    url = "/docgen.json",
    path
}) => {
    const [isLoadingDocGenData, setIsLoadingDocGenData] = useState(true);
    useEffect(() => {
        if (DocGenJSONCache == null) {
            setIsLoadingDocGenData(true)
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    DocGenJSONCache = data;
                })
                .finally(() => {
                    setIsLoadingDocGenData(false);
                });
        }
    }, [url])

    if (isLoadingDocGenData) {
        return null;
    }

    return (
        <table
            className={css`
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
                border: 1px solid rgba(5, 5, 5, 0.06);
            `}
        >
            <thead
                className={css`
                    > tr {
                        color: #5c6b77;
                        font-weight: 500;
                        white-space: nowrap;
                        background: rgba(0, 0, 0, 0.02);
                        border: 1px solid rgba(5, 5, 5, 0.06);
                        > th {
                            padding: 12px 24px;
                            text-align: left;
                        }   
                    } 
                   
                `}
            >
                <tr>
                    <th>
                        属性
                    </th>
                    <th>
                        说明
                    </th>
                    <th>
                        类型
                    </th>
                    <th>
                        默认值
                    </th>
                </tr>
            </thead>
            <tbody
                className={css`
                    > tr {
                        border: 1px solid rgba(5, 5, 5, 0.06);
                        > td {
                            padding: 12px 24px;
                            text-align: left;
                        }
                        > td:nth-child(3) {
                            color: #c41d7f;
                        }
                    }
                `}
            >
                {Object.keys(DocGenJSONCache?.[path]?.[0]?.props ?? {}).map?.((key) => {
                    const element = DocGenJSONCache?.[path]?.[0]?.props[key];
                    const getTypeString = () => {
                        if (element?.tsType?.raw) {
                            return element?.tsType?.raw
                        }
                        return element?.tsType?.name
                    }
                    return (
                        <tr>
                            <td>{key}</td>
                            <td>{element?.description}</td>
                            <td>{getTypeString()}</td>
                            <td>{(element?.defaultValue?.value ?? "-")}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}


export default DocGen;