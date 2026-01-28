import { Command } from "commander";
import { run, build } from "../esm/index.mjs";
import packagejson from "../package.json" with { type: "json"};

const program = new Command();

program
    .name("Lignify")
    .description(`Lignify is a zero-configuration toolset for component-based development.`).version(packagejson.version);

program.command('run-task')
    .description('Run a task command')
    .argument('<string>', 'The task to run (e.g. app:dev, app:build)')
    .action(async (command, options) => {
        if (command === "app:dev") {
            await run();
        } else if (command === "app:build") {
            await build();
        } else {
            throw new Error(`Invalid command. [${command}]`)
        }
    });

program.parse();