import { dirname, extname, join, relative } from "path";
import { logTime, timeStart } from "./utils.js";
import { mkdir, writeFile } from "fs";
import * as fs from "fs";

const isDirExist = async path => await fs.promises.access(path).then(()=>true).catch(()=>false);

export async function readLocalFile( path: string ): string {
  if ( await isDirExist(path) ) {
    return fs.readFile( path, (err, data) => {
      if (err) throw err;
      return data.toString();
    });
  } else {
    throw new Error(`File not found: ${path}`);
  }
}

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
