'use strict'

import fetch from 'node-fetch'
import ServiceError from '../errors/service.js'

export default function fetchViaCepService (cepWithLeftPad, configurations) {
  const url = `https://viacep.com.br/ws/${cepWithLeftPad}/json/`
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
    .then(checkForViaCepError)
    .then(extractCepValuesFromResponse)
    .catch(throwApplicationError)
}

function analyzeAndParseResponse (response) {
  if (response.ok) {
    return response.json()
  }

  throw Error('Erro ao se conectar com o serviço ViaCEP.')
}

function checkForViaCepError (responseObject) {
  if (responseObject.erro === true) {
    throw new Error('CEP não encontrado na base do ViaCEP.')
  }

  return responseObject
}

function extractCepValuesFromResponse (responseObject) {
  return {
    cep: responseObject.cep.replace('-', ''),
    state: responseObject.uf,
    city: responseObject.localidade,
    neighborhood: responseObject.bairro,
    street: responseObject.logradouro,
    service: 'viacep',
  }
}

function throwApplicationError (error) {
  const serviceError = new ServiceError({
    message: error.message,
    service: 'viacep'
  })

  if (error.name === 'FetchError') {
    serviceError.message = 'Erro ao se conectar com o serviço ViaCEP.'
  }

  throw serviceError
}
