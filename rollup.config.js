import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'

const input = 'src/cep-promise.js'
const defaultPlugins = [
  babel({
    babelrc: false,
    presets: [['@babel/preset-env', { modules: false }]],
    exclude: 'node_modules/**'
  })
]

export default [
  {
    input,
    plugins: [].concat(defaultPlugins, [
      commonjs(),
      json()
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
      commonjs(),
      json()
    ]),
    context: 'window',
    output: {
      file: 'dist/cep-promise-browser.js',
      format: 'umd',
      name: 'cep'
    }
  }
]

