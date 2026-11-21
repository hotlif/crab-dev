import { flushSync } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import type { ElementType } from "react";
import ConfigProvider, { type ConfigValue } from "@crab-dev/rc-config-provider";
import type { IsolatedLifecycle } from "@crab-dev/wake/federation/react";
import { loaders } from "../../.tmp/federated-demo-loaders.js";
import "../../../components/rc-theme/css/index.css";
import "./demo.css";

type DemoProps = Omit<ConfigValue, "nonce"> & { id: string; nonce: string | null };
type DemoModule = {
    default: ElementType;
    meta?: { args?: Record<string, unknown> };
};
type MountedDemo = { root: Root; demo: DemoModule };

let nextRoot = 0;

function renderDemo({ root, demo }: MountedDemo, { id: _id, nonce, ...config }: DemoProps) {
    const Example = demo.default;
    root.render(<ConfigProvider {...config} nonce={nonce ?? undefined} className="crab-federated-demo">
        <Example {...demo.meta?.args} />
    </ConfigProvider>);
}

const lifecycle: IsolatedLifecycle<DemoProps, MountedDemo> = {
    async mount({ mountRoot, props, emit }) {
        const load = (loaders as Readonly<Partial<Record<string, () => Promise<DemoModule>>>>)[props.id];
        if (!Object.hasOwn(loaders, props.id) || !load) throw new Error("找不到演示");
        const demo = await load();
        let renderError: unknown;
        let mounting = true;
        const root = createRoot(mountRoot, {
            identifierPrefix: "crab-docs-demo-" + nextRoot++ + "-",
            onUncaughtError(error) {
                if (mounting) renderError = error;
                else emit("crab:demo-error", { message: error instanceof Error ? error.message : String(error) });
            },
        });
        const mounted = { root, demo };
        flushSync(() => renderDemo(mounted, props));
        mounting = false;
        if (renderError !== undefined) {
            root.unmount();
            throw renderError;
        }
        return mounted;
    },
    update(mounted, { props }) {
        renderDemo(mounted, props);
    },
    unmount({ root }) {
        root.unmount();
    },
};

export default lifecycle;
