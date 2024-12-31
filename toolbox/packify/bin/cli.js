import { build } from "../esm/index.mjs";
const param = process.argv[2];

if (param === "build") {
    build();
}
