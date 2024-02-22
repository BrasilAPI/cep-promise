'use strict'

import fetch from 'node-fetch'
import ServiceError from '../errors/service.js'

export default function fetchCorreiosAltAPIService(
  cepWithLeftPad,
  configurations
) {
  const url = 'https://buscacepinter.correios.com.br/app/endereco/carrega-cep-endereco.php'
  const options = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Referer': 'https://buscacepinter.correios.com.br/app/endereco/index.php',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    },
    body: `endereco=${cepWithLeftPad}&tipoCEP=ALL`,
    timeout: configurations.timeout || 30000
  }

  return fetch(url, options)
    .then(parseResponse)
    .then(extractCepValuesFromResponse)
    .catch(throwApplicationError)
}

function parseResponse(response) {
  return response.json().then(result => {
    if (result.total === 0 || result.erro || result.dados[0].cep === "" || result.dados[0].cep.replace(/\D/g, '') !== cepWithLeftPad) {
      throw new Error('CEP não encontrado na base dos Correios.')
    }
    return result
  })
}

function extractCepValuesFromResponse(response) {
  const firstCep = response.dados[0]
  return {
    cep: firstCep.cep,
    state: firstCep.uf,
    city: firstCep.localidade,
    neighborhood: firstCep.bairro,
    street: firstCep.logradouroDNEC,
    service: 'correios-alt'
  }
}

function throwApplicationError(error) {
  const serviceError = new ServiceError({
    message: error.message,
    service: 'correios-alt'
  })

  if (error.name === 'FetchError') {
    serviceError.message = 'Erro ao se conectar com o serviço dos Correios Alt.'
  }

  throw serviceError
}
