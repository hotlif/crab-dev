import { describe, it, expect } from "@jest/globals";
import { renderHTML } from "../../conf";
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("test conf.ts", () => {
    it("test generate renderHTML", async () => {
        const data = await renderHTML(join(__dirname, "ReactWebpackPlugin"));
        expect(data).not.toBeNull();
    })
})
