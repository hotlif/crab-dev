import { css } from "@linaria/core";
import { useEffect, useState, type ComponentType, type FC, type ReactNode } from "react";
import { useSearchParams } from "react-router";
import demoLoaders from "../_generated/demoLoaders.js";

const errorStyle = css`
    padding: 24px;
    color: var(--text-tertiary);
    font-size: 13px;
    font-family: var(--font-mono);
    line-height: 1.6;
    text-align: center;
    word-break: break-word;
`;

const DemoStandaloneView: FC = () => {
    const [searchParams] = useSearchParams();
    const [element, setElement] = useState<ReactNode>(null);
    const [error, setError] = useState<string | null>(null);
    const demoPath = searchParams.get("path") ?? "";

    useEffect(() => {
        if (!demoPath) {
            setElement(null);
            setError("缺少 path 查询参数，无法定位 demo。");
            return;
        }

        const loader = demoLoaders[demoPath];
        if (!loader) {
            setElement(null);
            setError(`未找到 demo 加载器：${demoPath}`);
            return;
        }

        let mounted = true;
        setError(null);
        loader()
            .then(mod => {
                if (!mounted) return;
                const C = mod.default as ComponentType;
                setElement(<C />);
            })
            .catch((err: unknown) => {
                if (!mounted) return;
                const message = err instanceof Error ? err.message : String(err);
                setElement(null);
                setError(`无法加载示例：${message}`);
            });

        return () => {
            mounted = false;
        };
    }, [demoPath]);

    if (error) {
        return <div className={errorStyle}>{error}</div>;
    }
    return <>{element}</>;
};

export default DemoStandaloneView;
