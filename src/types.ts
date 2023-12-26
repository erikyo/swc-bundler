import { EnvConfig } from "@swc/core";

export interface CliOptions {
  output: string;
  entry: string;
  debug: boolean;
  silent: boolean;
  json: boolean;
  watch: boolean;
}

export type BundleInput = BundleOptions | BundleOptions[];


export interface BundleOptions extends SpackConfig {
  workingDir?: string
}

/**
 * Programmatic options.
 */
export interface Options extends Config {
  /**
   * If true, a file is parsed as a script instead of module.
   */
  script?: boolean;

  /**
   * The working directory that all paths in the programmatic
   * options will be resolved relative to.
   *
   * Defaults to `process.cwd()`.
   */
  cwd?: string;
  caller?: CallerOptions;
  /** The filename associated with the code currently being compiled,
   * if there is one. The filename is optional, but not all of Swc's
   * functionality is available when the filename is unknown, because a
   * subset of options rely on the filename for their functionality.
   *
   * The three primary cases users could swcBundler into are:
   *
   * - The filename is exposed to plugins. Some plugins may require the
   * presence of the filename.
   * - Options like "test", "exclude", and "ignore" require the filename
   * for string/RegExp matching.
   * - .swcrc files are loaded relative to the file being compiled.
   * If this option is omitted, Swc will behave as if swcrc: false has been set.
   */
  filename?: string;

  /**
   * The initial path that will be processed based on the "rootMode" to
   * determine the conceptual root folder for the current Swc project.
   * This is used in two primary cases:
   *
   * - The base directory when checking for the default "configFile" value
   * - The default value for "swcrcRoots".
   *
   * Defaults to `opts.cwd`
   */
  root?: string;

  /**
   * This option, combined with the "root" value, defines how Swc chooses
   * its project root. The different modes define different ways that Swc
   * can process the "root" value to get the final project root.
   *
   * "root" - Passes the "root" value through as unchanged.
   * "upward" - Walks upward from the "root" directory, looking for a directory
   * containing a swc.config.js file, and throws an error if a swc.config.js
   * is not found.
   * "upward-optional" - Walk upward from the "root" directory, looking for
   * a directory containing a swc.config.js file, and falls back to "root"
   *  if a swc.config.js is not found.
   *
   *
   * "root" is the default mode because it avoids the risk that Swc
   * will accidentally load a swc.config.js that is entirely outside
   * of the current project folder. If you use "upward-optional",
   * be aware that it will walk up the directory structure all the
   * way to the filesystem root, and it is always possible that someone
   * will have a forgotten swc.config.js in their home directory,
   * which could cause unexpected errors in your builds.
   *
   *
   * Users with monorepo project structures that swcBundler builds/tests on a
   * per-package basis may well want to use "upward" since monorepos
   * often have a swc.config.js in the project root. Running Swc
   * in a monorepo subdirectory without "upward", will cause Swc
   * to skip loading any swc.config.js files in the project root,
   * which can lead to unexpected errors and compilation failure.
   */
  rootMode?: "root" | "upward" | "upward-optional";

  /**
   * The current active environment used during configuration loading.
   * This value is used as the key when resolving "env" configs,
   * and is also available inside configuration functions, plugins,
   * and presets, via the api.env() function.
   *
   * Defaults to `process.env.SWC_ENV || process.env.NODE_ENV || "development"`
   */
  envName?: string;

  /**
   * Defaults to searching for a default `.swcrc` file, but can
   * be passed the path of any JS or JSON5 config file.
   *
   *
   * NOTE: This option does not affect loading of .swcrc files,
   * so while it may be tempting to do configFile: "./foo/.swcrc",
   * it is not recommended. If the given .swcrc is loaded via the
   * standard file-relative logic, you'll end up loading the same
   * config file twice, merging it with itself. If you are linking
   * a specific config file, it is recommended to stick with a
   * naming scheme that is independent of the "swcrc" name.
   *
   * Defaults to `path.resolve(opts.root, ".swcrc")`
   */
  configFile?: string | boolean;

  /**
   * true will enable searching for configuration files relative to the "filename" provided to Swc.
   *
   * A swcrc value passed in the programmatic options will override one set within a configuration file.
   *
   * Note: .swcrc files are only loaded if the current "filename" is inside of
   *  a package that matches one of the "swcrcRoots" packages.
   *
   *
   * Defaults to true as long as the filename option has been specified
   */
  swcrc?: boolean;

  /**
   * By default, Babel will only search for .babelrc files within the "root" package
   *  because otherwise Babel cannot know if a given .babelrc is meant to be loaded,
   *  or if it's "plugins" and "presets" have even been installed, since the file
   *  being compiled could be inside node_modules, or have been symlinked into the project.
   *
   *
   * This option allows users to provide a list of other packages that should be
   * considered "root" packages when considering whether to load .babelrc files.
   *
   *
   * For example, a monorepo setup that wishes to allow individual packages
   * to have their own configs might want to do
   *
   *
   *
   * Defaults to `opts.root`
   */
  swcrcRoots?: boolean | MatchPattern | MatchPattern[];

  /**
   * `true` will attempt to load an input sourcemap from the file itself, if it
   * contains a //# sourceMappingURL=... comment. If no map is found, or the
   * map fails to load and parse, it will be silently discarded.
   *
   *  If an object is provided, it will be treated as the source map object itself.
   *
   * Defaults to `true`.
   */
  inputSourceMap?: boolean | string;

  /**
   * The name to use for the file inside the source map object.
   *
   * Defaults to `path.basename(opts.filenameRelative)` when available, or `"unknown"`.
   */
  sourceFileName?: string;

  /**
   * The sourceRoot fields to set in the generated source map, if one is desired.
   */
  sourceRoot?: string;

  plugin?: Plugin;

  isModule?: boolean | "unknown";

  /**
   * Destination path. Note that this value is used only to fix source path
   * of source map files and swc does not write output to this path.
   */
  outputPath?: string;
}

export interface CallerOptions {
  name: string;
  [key: string]: any;
}

export type Swcrc = Config | Config[];

/**
 * .swcrc
 */
export interface Config {
  /**
   * Note: The type is string because it follows rust's regex syntax.
   */
  test?: string | string[];
  /**
   * Note: The type is string because it follows rust's regex syntax.
   */
  exclude?: string | string[];
  env?: EnvConfig;
  jsc?: JscConfig;
  module?: ModuleConfig;
  minify?: boolean;

  /**
   * - true to generate a sourcemap for the code and include it in the result object.
   * - "inline" to generate a sourcemap and append it as a data URL to the end of the code, but not include it in the result object.
   *
   * `swc-cli` overloads some of these to also affect how maps are written to disk:
   *
   * - true will write the map to a .map file on disk
   * - "inline" will write the file directly, so it will have a data: containing the map
   * - Note: These options are bit weird, so it may make the most sense to just use true
   *  and handle the rest in your own code, depending on your use case.
   */
  sourceMaps?: boolean | "inline";

  inlineSourcesContent?: boolean;
}

/**
 * `spack.config,js`
 */
export interface SpackConfig {
  /**
   * @default process.env.NODE_ENV
   */
  mode?: Mode

  target?: Target

  entry: EntryConfig,

  output: OutputConfig

  module: ModuleConfig

  options?: Options

  /**
   * Modules to exclude from bundle.
   */
  externalModules?: string[]
}

export interface OutputConfig {
  name: string
  path: string
}


export interface ModuleConfig {

}

export type Mode = 'production' | 'development' | 'none';
export type Target = 'browser' | 'node';

export type EntryConfig = string | string[] | {
  [name: string]: string
}
