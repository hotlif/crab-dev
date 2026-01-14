import { build, generateCssToken } from "../esm/index.mjs";
const param = process.argv[2];

if (param === "build") {
    build();
} else if (param === "generate:css-token") {
    generateCssToken();
}
