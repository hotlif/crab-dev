import { run, build } from "../esm/index.mjs";

const param = process.argv[2];

if (param === "dev") {
    run();
} else if (param === "build") {
    build();
}
