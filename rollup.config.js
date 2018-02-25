import fs from 'fs'
import path from 'path'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

const input = 'src/cep-promise.js'
const defaultPlugins = [
  babel({
    babelrc: false,
    plugins: ['external-helpers'],
    presets: [['env', {modules: false}]]
  })
]

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json')))
const dependencies = Object.keys(pkg.dependencies || {})

export default [
  {
    input,
    plugins: defaultPlugins,
    external: dependencies,
    output: [
      {
        file: 'dist/cep-promise-esm.js',
        format: 'es'
      },
      {
        file: 'dist/cep-promise.js',
        format: 'cjs'
      }
    ]
  },
  {
    input,
    plugins: [].concat(defaultPlugins, [
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
