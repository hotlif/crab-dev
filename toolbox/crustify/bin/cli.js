import { run, build, bundle } from "../esm/index.mjs";

const param = process.argv[2];

if (param === "dev") {
    run();
} else if (param === "build") {
    build();
} else if (param === "bundle") {
    bundle();
}
