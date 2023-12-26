export const timeStart = (action: string) => {
  console.info(`${action}...`);
  return process.hrtime();
};

export const logTime = (start: [number, number], action: string) => {
  const end = process.hrtime(start);
  console.info(`${action}: ${end[0]}s ${end[1] / 1000000}ms`);
};

export function isUserDefinedEntry(name: string, spackOptions: any) {
  const entry = spackOptions.entry;
  if (typeof entry === "string") {
    return entry === name;
  } else {
    return Array.isArray(entry) ? entry.includes(name) : name in entry;
  }
}


export function collect(value: any, previousValue: any): Array<string> {
  // If the user passed the option with no value, like "babel file.js --presets", do nothing.
  if (typeof value !== "string") return previousValue;

  const values = value.split(",");

  return previousValue ? previousValue.concat(values) : values;
}
