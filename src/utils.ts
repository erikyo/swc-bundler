import path, { join } from "path";
import { readFile } from "node:fs/promises";
import { readLocalFile } from "./fs.js";
import { CONFIGFILE } from "./constants.js";
import { pathToFileURL } from "node:url";

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

/**
 * Logs the start of an action and returns the current high-resolution real
 * time in a [seconds, nanoseconds] tuple.
 *
 * @param {string} action - The action being started.
 * @return {[number, number]} The high-resolution real time mark.
 */
export const timeStart = (action: string) => {
  console.info(`${action}...`);
  return process.hrtime();
};

/**
 * Logs the time taken for an action in seconds and milliseconds.
 *
 * @param {[number, number]} start - The high-resolution real time
 * at the start of the action.
 * @param {string} action - Description of the action being timed.
 */
export const logTime = (start: [number, number], action: string) => {
  const end = process.hrtime(start);
  console.info(`${action}: ${end[0]}s ${end[1] / 1000000}ms`);
};

/**
 * Collects and concatenates value strings, splitting by commas.
 *
 * @param {any} value - The new value to be processed.
 * @param {any} previousValue - The previous array of collected strings.
 * @return {Array<string>} An array of strings with the new value(s)
 * added, or the previous array if the new value is not a string.
 */
export function collect(value: any, previousValue: any): Array<string> {
  // If the user passed the option with no value, like "babel file.js --presets", do nothing.
  if (typeof value !== "string") return previousValue;

  const values = value.split(",");

  return previousValue ? previousValue.concat(values) : values;
}

/**
 * Asynchronously retrieves configuration from a specified file path.
 *
 * @param {string} filePath - The relative path to the configuration file.
 * @return {Promise<any>} A promise that resolves with the file content.
 */
export const getConfig = async (filePath: string) => {
  const currentPath = path.resolve(process.cwd(), filePath);
  return readLocalFile(currentPath)
};


export async function parseConfig(cliCommands) {
  // Read the config file in the current folder get the js file and import the default config
  const config = join( cliCommands?.context , cliCommands?.config || CONFIGFILE );
  let bundleConfig: BundleOptions;
  const configExt = path.extname(config);
  if (configExt === ".js" || configExt === ".ts" || configExt === ".mjs") {
    // Resolve the config to an absolute path if it's not already
    const absoluteConfigPath = path.resolve(config);
    // Convert the absolute path to a URL
    const fileURL = pathToFileURL(absoluteConfigPath).href;
    bundleConfig = (await import(fileURL)).default as BundleOptions;
    console.log(bundleConfig)
  } else {
    // get the bundler config file
    const rawConfig = await readLocalFile(cliCommands.config ?? CONFIGFILE);
    bundleConfig = JSON.parse(rawConfig) as BundleOptions;
  }
  return  bundleConfig
}
