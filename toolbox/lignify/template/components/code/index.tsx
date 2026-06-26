import { useEffect, useState, useMemo, type FC, type ReactNode } from "react";
import ComponentPreview, { type PreviewDensity } from "@crab-dev/rc-component-preview";
import RcMasonry from "@crab-dev/rc-masonry";
import demos from "@@@/demos";

// ─── DemoItem ───────────────────────────────────────────────────────────────

interface DemoItemProps {
    path: string;
    density?: PreviewDensity;
}

const DemoItem: FC<DemoItemProps> = ({ path, density }) => {
    const [reactElement, setReactElement] = useState<ReactNode>();
    const [code, setCode] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [frontmatter, setFrontmatter] = useState<Record<string, any>>({});

    useEffect(() => {
        const element = demos.find((el) => el.path === path);
        if (!element) return;

        setFrontmatter(element.frontmatter ?? {});

        element.source?.then((source) => {
            setCode(source?.default ?? "");
        });

        element.component?.then?.((Component) => {
            setReactElement(<Component.default />);
        });
    }, [path]);

    return (
        <ComponentPreview
            path={path.replaceAll(".", "/")}
            title={frontmatter?.title}
            description={frontmatter?.description}
            sourceCode={code}
            density={density}
        >
            {reactElement}
        </ComponentPreview>
    );
};

// ─── DemoMasonry ────────────────────────────────────────────────────────────

interface DemoMasonryProps {
    path: string;
    columns?: number;
    gutter?: number | [number, number];
    density?: PreviewDensity;
}

const DemoMasonry: FC<DemoMasonryProps> = ({ path, columns = 2, gutter = 16, density }) => {
    const filteredDemos = useMemo(
        () => demos.filter((element) => element.path?.startsWith(path)),
        [path],
    );

    return (
        <RcMasonry
            columns={columns}
            gutter={gutter}
            sequential
        >
            {filteredDemos.map(demo => (
                <DemoItem key={demo.path} path={demo.path} density={density} />
            ))}
        </RcMasonry>
    );
};

export default DemoMasonry;
