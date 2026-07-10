import { build, generateCssToken, generateDocgen } from "../esm/index.mjs";
const param = process.argv[2];

if (param === "build") {
    build();
} else if (param === "generate:css-token") {
    generateCssToken();
} else if (param === "generate:docgen") {
    generateDocgen();
}
