import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'

const input = 'src/cep-promise.js'
const defaultPlugins = [
  babel({
    babelrc: false,
    presets: [['@babel/preset-env', { modules: false }]]
  })
]

export default [
  {
    input,
    plugins: [].concat(defaultPlugins, [
      commonjs()
    ]),
    output: {
      file: 'dist/cep-promise.js',
      format: 'umd',
      name: 'cep'
    }
  },
  {
    input,
    plugins: [
      replace({
        'node-fetch': 'unfetch',
      })
    ].concat(defaultPlugins, [
      resolve({
        browser: true
      }),
      commonjs()
    ]),
    context: 'window',
    output: {
      file: 'dist/cep-promise-browser.js',
      format: 'umd',
      name: 'cep'
    }
  }
]

