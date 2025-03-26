import { run, build, bundle, getConfig } from "../esm/index.mjs";


const command = process.argv[2];

getConfig(process.cwd()).then((conf) => {
    if (command === "dev") {
        run(conf);
    } else if (command === "build") {
        build(conf);
    } else if (command === "bundle") {
        bundle(conf);
    }
})

