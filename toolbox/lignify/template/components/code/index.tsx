import { useEffect, useState, useMemo, type FC, type ReactNode } from "react";
import { css } from "@linaria/core";
import ComponentPreview from "@crab-dev/rc-component-preview";
import demos from "@@@/demos";

// ─── DemoItem ───────────────────────────────────────────────────────────────

interface DemoItemProps {
    path: string;
}

const DemoItem: FC<DemoItemProps> = ({ path }) => {
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
}

const masonryRootStyle = css`
    display: flex;
    align-items: flex-start;
    width: 100%;
`;

const masonryColumnStyle = css`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
`;

const DemoMasonry: FC<DemoMasonryProps> = ({ path, columns = 2, gutter = 16 }) => {
    const filteredDemos = useMemo(
        () => demos.filter((element) => element.path?.startsWith(path)),
        [path],
    );

    const [gutterH, gutterV] = Array.isArray(gutter) ? gutter : [gutter, gutter];

    // Round-robin distribution: left column first (1→L, 2→R, 3→L, 4→R…)
    const columnArrays = useMemo(() => {
        const cols: (typeof filteredDemos)[] = Array.from({ length: columns }, () => []);
        filteredDemos.forEach((demo, i) => {
            cols[i % columns].push(demo);
        });
        return cols;
    }, [filteredDemos, columns]);

    return (
        <div className={masonryRootStyle} style={{ gap: gutterH }}>
            {columnArrays.map((col, colIndex) => (
                <div key={colIndex} className={masonryColumnStyle} style={{ gap: gutterV }}>
                    {col.map((demo) => (
                        <DemoItem key={demo.path} path={demo.path} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default DemoMasonry;