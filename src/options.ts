
import commander from "commander";

import { collect } from "./utils.js";
import path, { join } from "path";
import { CONFIGFILE, SWCRCFILE } from "./constants.js";
import { CliOptions } from "./types.js";

/**
 * Initializes command line interface options for a package
 * based on the provided configuration.
 *
 * @param {object} pkg - The package.json contents with version.
 * @return {Promise<object>} A promise that resolves with the CLI options.
 */
export async function getOptions(pkg: { version: string; }): Promise<CliOptions> {

  const program = new commander.Command();

  program
    .version( pkg.version , "-v, --version", "Display the version number")
    .usage("<command> [options] [entry] [entry] ... [option] [value]")

    .helpOption("-h, --help", "Display help information")

    .option("--debug", `Switch loaders to debug mode`, false )
    .option("-env, --env-name", `The name of the 'env' to use when loading configs and plugins. Defaults to the value of SWC_ENV, or else NODE_ENV, or else development.`, false )

    .option("-c, --config", "Path to a swc-bundler.config.js file to use. [path]", join(process.cwd(), CONFIGFILE) )
    .option("--config-file", "Path to a .swcrc file to use.. [path]", join(process.cwd(), SWCRCFILE) )

    /** Output options: */

    .option("-o, --output, --out-file", `The output path and file for compilation assets`)
    .option("-d, --output-path, --out-dir", `The output directory as **absolute path**`)

    /** Input options: */
    .option("-f, --filename", "Filename to use when reading from stdin. This will be used in source maps and errors.", collect)
    .option("-e, --entry [list]", "List of entries", collect)
    .option("--ignore [list]", "List of glob paths to not compile.", collect)

    .option(
      "-C, --context [path]",
      `The base directory (relative) for resolving the 'entry' option.`,
      process.cwd()
    )
    .option(
      "-S, --source-root",
      `The root from which all sources are relative.`,
      process.cwd()
    )

    .option("-m, --module", "Module type. By default, module statements will remain untouched. [ ES6 | AMD | UMD | CJS | NODE | WEB ]")
    .option("-t, --target", "The target JavaScript language version. es3 | es5 | es2015 | es2016 | es2017 | es2018 | es2019 | es2020 | es2021 | es2022")
    .option("-p, --parse", "The parser to use, ecmascript or typescript.  [ ecmascript | typescript ]")

    .option("-W, --watch", `Enter watch mode, which rebuilds on file change.`, false )

    .option("--minification", `Enabling this will will preserve only license comments **`)
    .option("--mangle", `Similar to the mangle properties option of terser **`)
    .option("--compress", `Similar to the compress option of terser **`)
    .option("-s, --silent", "Prevent output from being displayed in stdout")
    .option("-j, --json", "Prints the result as JSON")

    // get the options from the command line
    .parse();

  // return the options
  return program.opts() as CliOptions;
}
