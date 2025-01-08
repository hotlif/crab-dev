
import { describe, it, expect } from "@jest/globals";
import { getAllFiles } from "../AutoScanWebpackPlugin";
import { join } from "path";


describe('AutoScanWebpackPlugin', () => {
    it("should get all files in the current directory", async () => {
        const currentPath = join(__dirname, "TestDirectoryStructure");
        const data = await getAllFiles(currentPath, /\.ts$/, null);
        expect(data.length).toEqual(3);
        expect(data).toContain(join(currentPath, "A.ts"));
        expect(data).toContain(join(currentPath, "A", "A1.ts"));
        expect(data).toContain(join(currentPath, "A", "AA", "AA1.ts"));
    })
});
