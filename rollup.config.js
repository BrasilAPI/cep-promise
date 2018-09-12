import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'

const input = 'src/index.js'
const defaultPlugins = [
  babel({
    babelrc: false,
    plugins: ['external-helpers'],
    presets: [['env', {modules: false}]]
  })
]

export default [
  {
    input,
    external: [ 'isomorphic-unfetch' ],
    plugins: [].concat(defaultPlugins, [
      commonjs()
    ]),
    output: {
      file: 'dist/cep-promise.js',
      exports: 'named',
      globals: {
        'isomorphic-unfetch': 'fetch'
      },
      format: 'umd',
      name: 'cep'
    }
  }
]
