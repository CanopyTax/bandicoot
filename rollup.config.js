import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

const config = {
  input: 'src/bandicoot.js',
  plugins: [
    resolve(),
    babel({exclude: 'nodeModules/**'}),
  ],
  external: [
    'react',
    'react-dom',
  ],
}

export default [
  Object.assign({}, config, {
    output: {
      file: 'lib/bandicoot.js',
      format: 'esm',
    },
  }),
  Object.assign({}, config, {
    output: {
      file: 'lib/bandicoot.umd.js',
      format: 'umd',
      name: 'bandicoot',
    },
  }),
]
