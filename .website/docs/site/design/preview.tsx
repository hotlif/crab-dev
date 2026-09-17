import { createContext, use, useEffect, useId, useState } from "react";
import type { PropsWithChildren } from "react";
import Segmented from "@crab-dev/rc-segmented";
import { SiteContext } from "../siteContext.js";
import type { Density, Theme } from "./tokens.js";
import "./styles.js";

const PreviewContext = createContext<{ theme: Theme; density: Density; touch: boolean }>({
    theme: "light", density: "standard", touch: false,
});

export function useDesignPreview() {
    return use(PreviewContext);
}

export default function DesignPreview({ children }: PropsWithChildren) {
    const site = use(SiteContext);
    const [standaloneTheme, setStandaloneTheme] = useState<Theme>("light");
    const [density, setDensity] = useState<Density>("standard");
    const [touch, setTouch] = useState(false);
    const theme = site?.theme.resolved ?? standaloneTheme;
    function changeTheme(next: Theme) {
        if (site) site.theme.setTheme(next);
        else setStandaloneTheme(next);
    }
    const id = useId();
    useEffect(() => {
        const query = matchMedia("(pointer: coarse)");
        function update() { setTouch(query.matches); }
        update(); query.addEventListener("change", update);
        return () => query.removeEventListener("change", update);
    }, []);
    return <PreviewContext value={{ theme, density, touch }}>
        <div className="crab-language" data-theme={theme} data-density={density} data-wake-demo="design-language">
            <div className="cl-controls">
                <div className="cl-control"><span id={`${id}-theme`}>页面主题</span><Segmented aria-labelledby={`${id}-theme`} value={theme}
                    options={[{ label: "浅色", value: "light" }, { label: "深色", value: "dark" }]}
                    onChange={value => changeTheme(value === "dark" ? "dark" : "light")} /></div>
                <div className="cl-control"><span id={`${id}-density`}>信息密度</span><Segmented aria-labelledby={`${id}-density`} value={density}
                    options={[{ label: "标准", value: "standard" }, { label: "紧凑", value: "compact" }]}
                    onChange={value => setDensity(value === "compact" ? "compact" : "standard")} /></div>
                <p className="cl-caption">主题与顶部设置同步，密度仅调整此样板。{touch ? "触控环境优先使用 44px 交互目标。" : "标准更舒展，紧凑适合密集操作。"}</p>
            </div>
            {children}
        </div>
    </PreviewContext>;
}
