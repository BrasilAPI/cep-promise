import fetch, { RequestInit, HeadersInit, Response } from 'node-fetch'
import { CEP, Configurations } from '../cep-promise.js'
import ServiceError from '../errors/service.js'

export default function fetchViaCepService (cepWithLeftPad: string, configurations: Configurations): Promise<CEP | void> {
  const url = `https://viacep.com.br/ws/${cepWithLeftPad}/json/`
  type OptionsInit = Omit<RequestInit, "headers"> & { 
    headers: HeadersInit & { 'user-agent'?: string }
  };
  const options: OptionsInit  = {
    timeout: configurations.timeout || 30000,
    method: 'GET',
    /**
     * Node-fetch does not suport mode
     */
    // mode: "cors",
    headers: {
      'content-type': 'application/json;charset=utf-8',
    },
    
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

function analyzeAndParseResponse (response: Response) {
  if (response.ok) {
    return response.json()
  }

  throw Error('Erro ao se conectar com o serviço ViaCEP.')
}

function checkForViaCepError (responseObject: any) {
  if (responseObject.erro === true) {
    throw new Error('CEP não encontrado na base do ViaCEP.')
  }

  return responseObject
}

function extractCepValuesFromResponse (responseObject: { [k: string]: string }): CEP {
  return {
    cep: responseObject.cep.replace('-', ''),
    state: responseObject.uf,
    city: responseObject.localidade,
    neighborhood: responseObject.bairro,
    street: responseObject.logradouro,
    service: 'viacep'
  }
}

function throwApplicationError (error: Error) {
  const serviceError = new ServiceError({
    message: error.message,
    service: 'viacep'
  })

  if (error.name === 'FetchError') {
    serviceError.message = 'Erro ao se conectar com o serviço ViaCEP.'
  }

  throw serviceError
}
