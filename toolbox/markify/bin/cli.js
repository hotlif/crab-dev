import { dev, getConfig } from "../esm/index.mjs";


const command = process.argv[2];

getConfig(process.cwd()).then((conf) => {
    if (command === "dev") {
        dev(conf);
    }
})

