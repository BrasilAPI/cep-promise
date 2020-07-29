import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import replace from '@rollup/plugin-replace'

const input = 'src/cep-promise.js'
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
    plugins: [
      replace({
        'isomorphic-unfetch': 'node-fetch',
      })
    ].concat(defaultPlugins, [
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
        'isomorphic-unfetch': 'unfetch',
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

