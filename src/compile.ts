import { logTime, timeStart } from "./utils.js";
import chokidar from "chokidar";
import { CliOptions } from "./types.js";
import { BundleOptions } from "@swc/core/spack.js";
import { bundle } from "@swc/core";


export async function watchFiles(cliCommands: CliOptions, bundlerOptions: BundleOptions) {
  const watcher = chokidar.watch(bundlerOptions.source.dir, {
    ignoreInitial: true
  });

  watcher.on("all", async () => {
    console.log("🟡 File change detected. Rebuilding...");
    await bundler(cliCommands, bundlerOptions);
  });

  console.log("🟢 Watching files for changes...");
}

export async function bundler(cliCommands, bundlerOptions: BundleOptions) {
  const bundleStart = timeStart("📦 Bundling...");

  const configOpts: BundleOptions = bundlerOptions

  const output = await bundle(configOpts);
  logTime(bundleStart, "🚀 Bundle done in ");
  console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
  return output;
}
