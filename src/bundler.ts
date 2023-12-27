import { logTime, timeStart } from "./utils.js";
import chokidar from "chokidar";
import { bundle } from "@swc/core";
import { writeOutput } from "./fs.js";

export async function watchFiles(swcOptions) {
  const watcher = chokidar.watch(
    swcOptions.source.dir, //file, dir, glob, or array
    {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      ignoreInitial: true,
      persistent: true
    });

  watcher.on("all", async () => {
    console.log("🟡 File change detected. Rebuilding...");
    await bundler(swcOptions);
  });

  console.log("🟢 Watching files for changes...");
}

export async function bundler(swcOptions) {
  const bundleStart = timeStart("📦 Bundling...");

  bundle(swcOptions)
    .then( async output => {
      return await writeOutput(output, swcOptions);
    })
    .catch(e => console.log(e))
    .finally(() => {
      logTime(bundleStart, "🚀 Bundle done in ");
      console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
    });
}
