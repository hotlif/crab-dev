import LiveExample from "./liveExample.js";
import type { TutorialRecord } from "./tutorial.js";

export default function FirstExample({ tutorial }: { readonly tutorial: TutorialRecord }) {
    const first = tutorial.steps[0];
    if (!first || first.preview.kind !== "inline") return null;
    return (
        <LiveExample
            title="基础示例"
            heading="none"
            density="compact"
            description={first.goal}
            sourceCode={first.sourceCode}
            load={first.preview.load}
        />
    );
}
