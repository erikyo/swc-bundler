import path from "path";
import { readFile } from "node:fs/promises";
import { readLocalFile } from "./fs.js";
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

export const timeStart = (action: string) => {
  console.info(`${action}...`);
  return process.hrtime();
};

export const logTime = (start: [number, number], action: string) => {
  const end = process.hrtime(start);
  console.info(`${action}: ${end[0]}s ${end[1] / 1000000}ms`);
};

export function collect(value: any, previousValue: any): Array<string> {
  // If the user passed the option with no value, like "babel file.js --presets", do nothing.
  if (typeof value !== "string") return previousValue;

  const values = value.split(",");

  return previousValue ? previousValue.concat(values) : values;
}


export const getConfig = async (filePath: string) => {
  const currentPath = path.resolve(process.cwd(), filePath);
  return readLocalFile(currentPath)
};
