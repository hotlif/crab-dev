import { run, build, bundle, getConfig } from "../esm/index.mjs";

const param = process.argv[2];

getConfig(process.cwd()).then((conf) => {
    if (param === "dev") {
        run(conf);
    } else if (param === "build") {
        build(conf);
    } else if (param === "bundle") {
        bundle(conf);
    }
})

