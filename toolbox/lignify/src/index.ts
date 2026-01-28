import { run as cRun, build as cBuild } from "@crab-dev/crustify";
import LignifyMod from "./mod";

export const build = async () => {
    await cBuild({
        mods: [new LignifyMod()],
    });
}

export const run = async () => {
    await cRun({
        mods: [new LignifyMod()]
    });
}