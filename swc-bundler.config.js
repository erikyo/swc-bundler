import { config } from "@swc/core/spack";
import path from "path";

module.exports = config({
  entry: [path.join(process.cwd() + "/src/index.ts")],
  source: {
    dir: path.join(process.cwd(), "src")
  },
  output: {
    path: path.join(process.cwd(), 'lib'),
  },
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
    config({
      output: {
        format: 'cjs',
        name: 'swcBundler',
        outDir: 'dist/cjs/',
        sourcemap: true,
        configFile: '.swcBundler-cjs',
      }
    }),
    config({
      output: {
        format: 'umd',
        name: 'swcBundler',
        outFile: 'dist/umd/swcBundler.umd'
      }
    }),
    config({
      output: {
        format: 'esm',
        type: 'es6',
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true,
        outDir: 'dist/esm/'
      }
    })
  ]
});
