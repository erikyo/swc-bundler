import { version as swcCoreVersion } from "@swc/core";
import commander from "commander";

import { collect } from "./utils.js";
import * as os from "os";
import { Config } from "./types.js";
import path, { join } from "path";
import { readFile } from "node:fs/promises";
import { readLocalFile } from "./file.js";
import { CONFIGFILE } from "./constants.js";

export const getConfig = async (filePath: string) => {
  const currentPath = path.resolve(process.cwd(), filePath);
  return readLocalFile(currentPath) as Config
};

/**
 * Asynchronously reads and parses the package.json file.
 * the path refers to the folder of the module inside ./lib/module/
 *
 * @return {Object|undefined} The parsed package.json as an object,
 * or undefined if an error occurs.
 */
export async function readPackageJson() {
  try {
    const data = await readFile(new URL("../../package.json", import.meta.url));
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading package.json:", error);
  }
}

export async function getOptions(pkg) {

  const program = new commander.Command();

  program
    .name("📦 SWC-Bundler")
    .description(
      `Version: ${pkg.version}\n @swc/core: ${swcCoreVersion}\n CPU Cores: ${os.cpus().length}\n OS Arch: ${os.arch()}`
    )
    .version(pkg.version)
    .usage("<command> [options]")
    .option("-h, --help", "Display help information")

    .option("--config [path]", "Path to a spack.config.js file to use.", join(process.cwd(), CONFIGFILE) )

    .option("--mode <development | production | none>", "Mode to use", 'development')
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
