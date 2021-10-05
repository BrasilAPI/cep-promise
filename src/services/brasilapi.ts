import fetch from 'node-fetch'
import type { Response } from "node-fetch"
import ServiceError from '../errors/service.js'
import type { ArrayString, CEP, Configurations } from '../types.js'

export default function fetchBrasilAPIService (cepWithLeftPad: string, configurations: Configurations): Promise<CEP | void> {
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

function parseResponse (response: Response) {
  if (response.ok === false || response.status !== 200) {
    throw new Error('CEP não encontrado na base do BrasilAPI.')
  }

  return response.json()
}

function extractCepValuesFromResponse (response: ArrayString): CEP {
  return {
    cep: response.cep,
    state: response.state,
    city: response.city,
    neighborhood: response.neighborhood,
    street: response.street,
    service: 'brasilapi'
  }
}

function throwApplicationError (error: Error) {
  const serviceError = new ServiceError({
    message: error.message,
    service: 'brasilapi'
  })

  if (error.name === 'FetchError') {
    serviceError.message = 'Erro ao se conectar com o serviço BrasilAPI.'
  }

  throw serviceError
}
