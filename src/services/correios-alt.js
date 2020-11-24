'use strict'

import fetch from 'node-fetch'
import ServiceError from '../errors/service.js'

export default function fetchCorreiosAltAPIService(
  cepWithLeftPad,
  proxyURL = ''
) {
  const url = `${proxyURL}https://buscacepinter.correios.com.br/app/cep/carrega-cep.php?cep=${cepWithLeftPad}`
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    }
  }

  return fetch(url, options)
    .then(parseResponse)
    .then(extractCepValuesFromResponse)
    .catch(throwApplicationError)
}

async function parseResponse(response) {
  response = await response.json()

  if (response.erro === true || response.total === 0) {
    throw new Error('CEP não encontrado na base dos Correios.')
  }

  return response
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
