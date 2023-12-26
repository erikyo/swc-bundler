#!/usr/bin/env node

import { bundleCode, bundler, watchFiles } from "./compile.js";
import {  getOptions, readPackageJson } from "./options.js";
import { readLocalFile } from "./file.js";
import { Config } from "./types.js";

/**
 * Runs the program by parsing command line arguments and calling the bundler function.
 *
 * @return {Promise<void>} A promise that resolves when the program has finished running.
 */
export async function swcBundler() {
  // Parse the command line arguments
  // read package.json to get swc-cli version and other meta
  const pkg = await readPackageJson();
  const cliCommands = await getOptions(pkg);

  const bundleConfig = readLocalFile( cliCommands.config ) as Config

  // If the watch flag is set, watch for file changes and trigger rebuilds
  if (cliCommands.watch) {
    // Watch for file changes and trigger rebuilds
    try {
      // while the user did not press command + c key to exit the process in watch mode keep watching
      await watchFiles( bundleConfig );
    } catch (err) {
      console.error(err);
    } finally {
      process.exit(0);
    }
  }

  console.log( "🟢 Starting bundler..." );
  console.log( "With config file ", cliCommands.config );

  // Call the bundler function
  await bundleCode( bundleConfig );
}

// Parse the command line arguments and swcBundler the bundler function
swcBundler()
  .then(() => {
    console.log("Exiting! 👋 Bye Bye!");
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });

export default swcBundler
