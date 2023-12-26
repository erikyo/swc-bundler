import { dirname, extname, join, relative } from "path";
import { logTime, timeStart } from "./utils.js";
import { mkdir, writeFile } from "fs";
import { readFile } from "node:fs/promises";
import { access, constants } from "node:fs";

/**
 * Checks if a directory exists and is accessible with read and write
 * permissions. Logs an error message if the directory cannot be found.
 *
 * @param {string} folderPath - The path to the directory to check.
 * @return {boolean} True if the directory exists and is accessible,
 *                   false if an error occurs.
 */
const isDirExist = (folderPath: string): boolean => {
  try {
    access(folderPath, constants.R_OK | constants.W_OK,
      (err) => {
        if (err) console.log("Cannot find the directory: ", err);
        return true
      }
    );
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Asynchronously reads the contents of the local file at the given path.
 *
 * @param {string} path - The path to the file.
 * @return {Promise<string>} A promise that resolves with the file contents.
 */
export async function readLocalFile( path: string )  {
  if ( isDirExist(path) ) {
    const data = await readFile( path, (err, data) => {
      if (err) throw err;
      return data.toString();
    })
    return data
  } else {
    throw new Error(`File not found: ${path}`);
  }
}

/**
 * Asynchronously writes the output files and their source maps
 * to the specified directory, creating directories as needed.
 *
 * @param {any} output - an object containing file names as keys
 * and their corresponding code and source map as values.
 * @param {any} spackOptions - an object containing the `output.path`
 * where the files should be written.
 * @return {Promise<void>} A promise that resolves when all files
 * have been written.
 */
export async function writeOutput(output: any, spackOptions: any) {
  const emitStart = timeStart('🕗 Writing');
  const writes = Object.keys(output).map(async (name) => {
  const fullPath = join(spackOptions.output.path, relative(process.cwd(), name).replace(extname(name), '.js'))

    mkdir(dirname(fullPath), { recursive: true });

    writeFile(fullPath, output[name].code, "utf-8");
    if (output[name].map) {
      writeFile(`${fullPath}.map`, output[name].map, "utf-8");
    }
  });

   Promise
     .all(writes)
     .then(
       () => logTime(emitStart, '🟢 Done')
     )
     .catch(
       err => console.log(err)
     );

}
