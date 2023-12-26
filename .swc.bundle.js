export default  {
  input: 'src/index.ts',
  defaults: {
    jsc: {
      parser: {
        syntax: "ecmascript",
      },
      transform: {},
    },
  },
  output: [
    {
      filename: "input.js",
      // Input files are treated as module by default.
      isModule: false,
      file: 'lib/bundles/bundle.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'lib/bundles/bundle.esm.min.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'lib/bundles/bundle.umd.js',
      format: 'umd',
      name: 'myLibrary',
      sourcemap: true
    },
    {
      file: 'lib/bundles/bundle.umd.min.js',
      format: 'umd',
      name: 'myLibrary',
      sourcemap: true
    }
  ],
  plugins: []
}
