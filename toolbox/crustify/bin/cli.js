import { Command } from "commander";
import { run, build, getConfig } from "../esm/index.mjs";
import packagejson from "../package.json" with { type: "json"};

const program = new Command();

program
    .name("Crustify")
    .description(`Crustify simplifies the frontend workflow by providing a zero-config environment 
for developing libraries and applications.

Whether you are scaffolding a new UI kit, running a dev server, or bundling 
for production, Crustify handles the complexity so you can focus on writing code.
  `).version(packagejson.version);

program.command('run-task')
    .description('Run a task command')
    .argument('<string>', 'The task to run (e.g. app:dev, app:build, playground:dev, playground:build)')
    .action(async (command, options) => {
        const conf = await getConfig(process.cwd());
        if (command === "app:dev") {
            run(conf);
        } else if (command === "app:build") {
            build(conf);
        } else {
            throw new Error(`Invalid command. [${command}]`)
        }
    });

program.parse();