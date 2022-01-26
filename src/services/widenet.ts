import fetch, { Response } from 'node-fetch'
import ServiceError from '../errors/service'
import { CEP, Configurations } from '../types'

export interface WideNetResponse {
  ok: boolean,
  status: number,
  code: string,
  state: string,
  city: string,
  district: string,
  address: string
}

export default function fetchWideNetService(cepWithLeftPad: string, configurations: Configurations): Promise<CEP | void> {
  const url = `https://ws.apicep.com/busca-cep/api/cep/${cepWithLeftPad}.json`
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    timeout: configurations.timeout || 30000
  }

  return fetch(url, options)
    .then(analyzeAndParseResponse)
    .then(checkForWideNetError)
    .then(extractCepValuesFromResponse)
    .catch(throwApplicationError)
}

function analyzeAndParseResponse(response: Response) {
  if (response.ok) {
    return response.json()
  }

  throw Error('Erro ao se conectar com o serviço WideNet.')
}

function checkForWideNetError(object: WideNetResponse) {
  if (object.ok === false || object.status !== 200) {
    throw new Error('CEP não encontrado na base do WideNet.')
  }

  return object
}

function extractCepValuesFromResponse(object: WideNetResponse): CEP {
  return {
    cep: object.code.replace('-', ''),
    state: object.state,
    city: object.city,
    neighborhood: object.district,
    street: object.address,
    service: 'widenet'
  }
}

function throwApplicationError(error: Error) {
  const serviceError = new ServiceError({
    message: error.message,
    service: 'widenet'
  })

  if (error.name === 'FetchError') {
    serviceError.message = 'Erro ao se conectar com o serviço WideNet.'
  }

  throw serviceError
}
