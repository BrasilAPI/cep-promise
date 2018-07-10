'use strict'

import fetch from 'isomorphic-unfetch'
import ServiceError from '../errors/service.js'

export default function fetchCepAbertoService (cepWithLeftPad) {
  const url = `https://cors.now.sh/http://www.cepaberto.com/api/v2/ceps.json?cep=${cepWithLeftPad}`
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json;charset=utf-8',
      'Authorization': 'Token token="37bfda18fd4b423cdb6748d14ba30aa6"'
    }
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
  throw Error('Erro ao se conectar com o serviço Cep Aberto.')
}

function checkForViaCepError (responseObject) {
  if (!Object.keys(responseObject).length) {
    throw new Error('CEP não encontrado na base do Cep Aberto.')
  }
  return responseObject
}

function extractCepValuesFromResponse (responseObject) {
  return {
    cep: responseObject.cep,
    state: responseObject.estado,
    city: responseObject.cidade,
    neighborhood: responseObject.bairro,
    street: responseObject.logradouro
  }
}

function throwApplicationError (error) {
  const serviceError = new ServiceError({
    message: error.message,
    service: 'cepaberto'
  })

  if (error.name === 'FetchError') {
    serviceError.message = 'Erro ao se conectar com o serviço Cep Aberto.'
  }

  throw serviceError
}
