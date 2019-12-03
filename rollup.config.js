import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import minify from 'rollup-plugin-babel-minify'
import postcss from 'rollup-plugin-postcss'

const config = {
  input: 'src/bandicoot.js',
  plugins: [
    resolve(),
    babel({exclude: 'nodeModules/**'}),
    minify({
      comments: false,
    }),
    postcss({modules: true})
  ],
  external: [
    'react',
    'react-dom',
  ],
}

export default [
  Object.assign({}, config, {
    output: {
      file: 'dist/bandicoot.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  }),
  Object.assign({}, config, {
    output: {
      file: 'dist/bandicoot.umd.js',
      format: 'umd',
      name: 'bandicoot',
      sourcemap: true,
      globals: {
        'react': 'React',
      },
    },
  }),
]
