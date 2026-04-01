import { node } from "@crab-dev/standards-jest-preset";
export default {
    ...node,
    transform: {
        "\\.[jt]sx?$": [
            "babel-jest",
            {
                presets: [
                    ["@babel/preset-env", { targets: "defaults", modules: false }],
                    "@babel/preset-typescript",
                    ["@babel/preset-react", { runtime: "automatic" }],
                ],
            },
        ],
    },
};
