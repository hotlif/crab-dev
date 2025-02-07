import { join } from "path";
import { readFile, readdir } from "fs/promises";
import LcpWebSdk from "./api";

const publishToServe = async (
    baseURL: string,
    name: string,
    componentName: string
) => {
    const sdk = new LcpWebSdk(baseURL);
    await sdk.login({
        username: process.env.LCP_WEB_USER_NAME || "",
        password: process.env.LCP_WEB_PASSWORD || "",
        tenantCode: "00000000"
    });

    const files = await readdir(join(process.cwd(), "bundle"));
    const uploadFile = files.find(file => {
        const reg = new RegExp(`^${componentName}\\.bundle\\.[a-zA-Z0-9]+\\.js$`)
        if (reg.test(file)) {
            return true;
        }
        return false;
    });

    if (uploadFile != null) {
        const fileData = await readFile(join(process.cwd(), "bundle", uploadFile));
        const blob = new Blob([fileData], { type: 'application/zip' });
        const uploadFIleInfo = await sdk.componentFileUpload(blob);
        await sdk.componentAddOrUpdate({
            Color: "",
            ComponentConfig: {
                globalInputParams: [],
                useInputParams: [],
                useOutputParams: []
            },
            ComponentFile: uploadFIleInfo,
            ComponentName: componentName,
            Icon: "",
            IsUploadIcon: 0,
            MobileComponentFile: null,
            Name: name,
            Tag: "",
            TagTemp: [],
            VersionId: null
        })
    }
}

export default publishToServe;
