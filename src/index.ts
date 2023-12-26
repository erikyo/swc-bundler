#!/usr/bin/env node
import { getOptions } from "./options.js";
import { readLocalFile } from "./fs.js";
import { readPackageJson } from "./utils.js";
import { version as swcCoreVersion } from "@swc/core";
import * as os from "os";

/**
 * Runs the program by parsing command line arguments and calling the bundler function.
 *
 * @return {Promise<void>} A promise that resolves when the program has finished running.
 */
export async function swcBundler() {
  // Parse the command line arguments
  // read package.json to get swc-cli version and other meta
  const pkg = await readPackageJson();
  // Get the options from the command line
  const cliCommands = await getOptions(pkg);
  // get the bundler config file
  const bundleConfig = await readLocalFile( cliCommands.config ) as string

  console.log( "🟡 Starting bundler..." );
  console.log( `Version: ${pkg.version}\n @swc/core: ${swcCoreVersion}\n CPU Cores: ${os.cpus().length}\n OS Arch: ${os.arch()}` );

  // If the watch flag is set, watch for file changes and trigger rebuilds
  if (cliCommands.watch) {
    // Watch for file changes and trigger rebuilds
    try {
      // while the user did not press command + c key to exit the process in watch mode keep watching
      await watchFiles( cliCommands, bundleConfig );
    } catch (err) {
      console.error(err);
    } finally {
      process.exit(0);
    }
  }

  console.log( "🟢 Starting bundler..." );
  console.log( "With config file ", cliCommands.config );

  // Call the bundler function
  await bundle( cliCommands, bundleConfig );
}

// Parse the command line arguments and swcBundler the bundler function
swcBundler()
  .then(() => {
    console.log("Exiting! 👋 Bye Bye!");
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

