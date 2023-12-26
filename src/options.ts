
import commander from "commander";

import { collect } from "./utils.js";
import * as os from "os";
import path, { join } from "path";
import { CONFIGFILE } from "./constants.js";

export async function getOptions(pkg) {

  const program = new commander.Command();

  program
    .version(pkg.version)
    .usage("<command> [options]")
    .helpOption("-h, --help", "Display help information")
    .option("--config [path]", "Path to a spack.config.js file to use.", join(process.cwd(), CONFIGFILE) )

    .option("--target [browser | node]", "Target runtime environment")

    .option(
      "--context [path]",
      `The base directory (absolute path!) for resolving the 'entry'` +
      ` option. If 'output.pathinfo' is set, the included pathinfo is shortened to this directory`,
      path.join(process.cwd())
    )

    .option("--entry [list]", "List of entries", collect)

    .option("-W --watch", `Enter watch mode, which rebuilds on file change.`, false )

    .option("--debug", `Switch loaders to debug mode`, false )

    // Output options:
    .option(
      "-o --output",
      `The output path and file for compilation assets`
    )
    .option("--output-path", `The output directory as **absolute path**`)
    .option("--silent", "Prevent output from being displayed in stdout")
    .option("--json, -j", "Prints the result as JSON")

    // get the options from the command line
    .parse();

  // return the options
  return program.opts();
}
