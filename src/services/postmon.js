'use strict'

import fetch from 'node-fetch'
import ServiceError from '../errors/service.js'

export default function fetchViaCepService (cepWithLeftPad, configurations) {
  const url = `https://api.postmon.com.br/v1/cep/${cepWithLeftPad}`
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    timeout: configurations.timeout || 30000
  }

  if (typeof window == 'undefined') {
    options.headers['user-agent'] = 'cep-promise'
  }

  return fetch(url, options)
    .then(analyzeAndParseResponse)
    .then(checkForPostmanError)
    .then(extractCepValuesFromResponse)
    .catch(throwApplicationError)
}

function analyzeAndParseResponse (response) {
  if (response.ok) {
    return response.json()
  }

  throw Error('Erro ao se conectar com o serviço Postmon.')
}

function checkForPostmanError (responseObject) {
  if (!responseObject ) {
    throw new Error('CEP não encontrado na base do Postmon.')
  }

  return responseObject
}

function extractCepValuesFromResponse (responseObject) {
  return {
    cep: responseObject.cep.replace('-', ''),
    state: responseObject.estado,
    city: responseObject.cidade,
    neighborhood: responseObject.bairro,
    street: responseObject.logradouro,
    service: 'postmon'
  }
}

function throwApplicationError (error) {
  const serviceError = new ServiceError({
    message: error.message,
    service: 'postmon'
  })

  if (error.name === 'FetchError') {
    serviceError.message = 'Erro ao se conectar com o serviço Postmon.'
  }

  throw serviceError
}
