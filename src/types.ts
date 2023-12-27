import { BundleInput, EntryConfig, Mode, OutputConfig, SpackConfig, Target } from "@swc/core/spack.js";
import { EsParserConfig, JscConfig, JscTarget, ModuleConfig, Options, Plugin, TsParserConfig } from "@swc/core";


export interface CliOptions {
  /** Switch loaders to debug mode (default: false) */
  debug?: boolean;
  /** Path to a swc-bundler.config.js file to use. */
  config?: string;
  /** The output file for compilation assets. */
  output?: string;
  /** The output path for compilation assets. */
  outputPath?: string;
  /** Filename to use when reading from stdin. This will be used in source maps and errors. */
  filename?: string;
  /** List of entries. */
  entry?: string[];
  /** List of entries. */
  ignore?: string[];
  /** EnvConfig to use when loading configs and plugins. Defaults to the value of SWC_ENV, or else NODE_ENV, or else development.*/
  envName?: string;
  /** The base directory (relative) for resolving the 'entry' option. default: process.cwd() */
  context?: string;
  /** The root from which all sources are relative */
  sourceRoot?: string;
  /** The target JavaScript language version. es3 | es5 | es2015 | es2016 | es2017 | es2018 | es2019 | es2020 | es2021 | es2022 */
  target?: boolean;
  /** The parser to use, ecmascript or typescript.  [ ecmascript | typescript ] */
  parse?: boolean;
  /** Module type. By default, module statements will remain untouched. [ ES6 | AMD | UMD | CJS | NODE | WEB ] */
  module?:  ModuleConfig
  /** Enabling this will preserve only license comments */
  minification?: string
  /** Similar to the mangle properties option of terser */
  parser?: TsParserConfig | EsParserConfig
  /** Enabling this will preserve only license comments */
  jscTarget?: JscTarget
  /** Similar to the compress option of terser */
  watch?: boolean;
  /** Prevent output from being displayed in stdout. */
  silent?: boolean;
  /** Enable minification. */
  minify?: boolean;
  /** Prints the result as JSON. */
  json?: boolean;
  /**  If true, a file is parsed as a script instead of module. */
  script?: boolean;
  /** Module type. By default, module statements will remain untouched. */
  isModule?: boolean | 'unknown';
  /** Plugins */
  plugin?: Plugin;
}

interface ModuleExport {
  entry: string;
  sourceFileName?: string;
  outputPath?: string;
  configFile: string;
  outFile?: string;
  type?: string;
  jsc?: JscConfig;
  clean?: boolean;
  target?: string;
  preserveModules?: string;
  preserveModulesRoot?: string;
  sourcemap?: boolean | "inline";
  inlineSourcesContent?: boolean;
}

type Bundle = {
  /**
   * @default process.env.NODE_ENV
   */
  mode?: Mode;
  target?: Target;
  entry: EntryConfig;
  output: OutputConfig;
  module: ModuleConfig;
  options?: Options;
  /**
   * Modules to exclude from bundle.
   */
  externalModules?: string[];
}

interface SwcBundle extends Bundle {
  modules: ModuleExport[]
}
