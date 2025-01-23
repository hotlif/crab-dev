
import { describe, it, expect } from "@jest/globals";
import { dirname, join } from 'node:path';
import { existsSync, rmdirSync} from "fs";
import { fileURLToPath } from 'node:url';

import { getTmpDir } from "../../util";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("test util", () => {
    it("test generate getTmpDir", async () => {
        if (existsSync(join(__dirname, ".tmp"))) {
            rmdirSync(join(__dirname, ".tmp"))
        }
        const path = getTmpDir(__dirname);
        expect(existsSync(path)).toBe(true);
        expect(path).toMatchSnapshot();
    })
})
