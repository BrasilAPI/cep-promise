#! /usr/bin/env node
const cep = require('../dist/cep-promise')
const cepNumber = process.argv.splice(2, 1)[0]

const pretify = (obj) => {
  return Object.keys(obj)
    .map(key => `${key}: ${obj[key]}`)
    .join('\n')
}

const successfulLog = (result) => console.log(`
✉️  😃  ✉️
${pretify(result)}
`)

const failureLog = (result) => console.log(`
❌  😰  ❌
${pretify(result)}
`)

const noArgsProvided = () => console.log(`
😔
Não foi possível reconhecer os parametros de entrada.
Tente novamente seguindo o exemplo:
cep 29065250
`)

if (!cepNumber) {
  noArgsProvided()
} else {
  cep(cepNumber)
    .then(successfulLog)
    .catch(failureLog)
}
