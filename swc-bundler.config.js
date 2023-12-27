import path from "path";

/** @type {SwcBundle} */
const config = {
  entry: [
    // path.join(process.cwd() + "/src/api/index.ts"),
    // path.join(process.cwd() + "/src/client/index.ts"),
    path.join(process.cwd() + "/src/index.ts")
  ],
  source: {
    dir: path.join(process.cwd(), "./src")
  },
  output: {
    path: path.join(process.cwd(), './lib'),
    file: undefined
  },
  module: {},
  options: {
    sourceMaps: true,
    module: {
      type: "umd",
      noInterop: false,
      globals: {
        default: "swc-bundler"
      },
      strict: false,
      strictMode: true,
      lazy: false
    },
    minify: true,
    jsc: {
      parser: {
        syntax: "typescript",
        tsx: false
      },
      target: "es5",
      loose: false,
      minify: {
        compress: {
          arguments: false,
          arrows: true,
          booleans: true,
        },
        mangle: {
          toplevel: false,
          keep_classnames: false,
        }
      }
    },
  },
  modules: [
    {
      output: {
        type: 'cjs',
        entry: 'swcBundler',
        outDir: 'dist/cjs/',
        sourcemap: true,
        configFile: '.swcBundler-cjs',
      }
    },
    {
      output: {
        type: 'umd',
        outFile: 'dist/umd/swcBundler.umd'
      }
    },
    {
      output: {
        type: 'esm',
        target: 'es6',
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true,
        outDir: 'dist/esm/'
      }
    }
  ]
};

export default config
