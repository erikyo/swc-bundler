import { logTime, timeStart } from "./utils.js";
import chokidar from "chokidar";
import { bundle } from "@swc/core";
import { BundleOptions } from "./types.js";
import { writeOutput } from "./file.js";


export async function bundleCode(bundleConfig) {
  const bundleStart = timeStart('📦 Bundling...');
  console.log(bundleConfig)
  const output = await bundle(bundleConfig);
  logTime(bundleStart, '🚀 Bundle done in ');
  return output;
}

export async function watchFiles(configOpts: BundleOptions) {
  const watcher = chokidar.watch( configOpts.entry, {
    ignoreInitial: true,
  });

  watcher.on("all", async () => {
    console.log("🟡 File change detected. Rebuilding...");
    await bundler(configOpts);
  });

  console.log("🟢 Watching files for changes...");
}

export async function bundler(bundlerOptions: BundleOptions) {
  const output = await bundleCode(bundlerOptions);
  await writeOutput(output, bundlerOptions);
  console.log(` ${bundlerOptions.output.name} done in `);
  console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
}
