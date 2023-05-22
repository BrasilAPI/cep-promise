'use strict'

import fetch from 'node-fetch'
import ServiceError from '../errors/service.js'

/**
 * @typedef {import('../cep-promise').CepPromiseConfigurations} CepPromiseConfigurations
 * @typedef {import('../cep-promise').CepResponse} CepResponse
 * @typedef {import('node-fetch').Response} FetchResponse
 * @typedef {import('./index').Provider} Provider
 */

/**
 * @param { string } cepWithLeftPad
 * @param { CepPromiseConfigurations } configurations
 * @returns { Promise<void | CepResponse> }
 */
export default function fetchBrasilAPIService (cepWithLeftPad, configurations) {
  const url = `https://brasilapi.com.br/api/cep/v1/${cepWithLeftPad}`
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    timeout: configurations.timeout || 30000
  }

  return fetch(url, options)
    .then(parseResponse)
    .then(extractCepValuesFromResponse)
    .catch(throwApplicationError)
}

/**
 * @param { FetchResponse } response
 * @returns { Promise<Object<string, string>> }
 */
function parseResponse (response) {
  if (response.ok === false || response.status !== 200) {
    throw new Error('CEP não encontrado na base do BrasilAPI.')
  }

  return response.json()
}

/**
 * 
 * @param { Object<string, string> } response 
 * @returns { CepResponse }
 */
function extractCepValuesFromResponse (response) {
  return {
    cep: response.cep,
    state: response.state,
    city: response.city,
    neighborhood: response.neighborhood,
    street: response.street,
    service: 'brasilapi'
  }
}

/**
 * 
 * @param { Error } error 
 */
function throwApplicationError (error) {
  const serviceError = new ServiceError({
    message: error.message,
    service: 'brasilapi'
  })

  if (error.name === 'FetchError') {
    serviceError.message = 'Erro ao se conectar com o serviço BrasilAPI.'
  }

  throw serviceError
}
