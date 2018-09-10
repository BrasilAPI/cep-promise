'use strict'

import fetch from 'isomorphic-unfetch'
import ServiceError from '../errors/service.js'

export default function fetchCepAbertoService (cepWithLeftPad, proxyURL = '') {
  const url = `${proxyURL}http://www.cepaberto.com/api/v3/cep?cep=${cepWithLeftPad}`
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
    .then(extractCepValuesFromResponse)
    .catch(throwApplicationError)
}

function analyzeAndParseResponse (response) {
  if (response.ok) {
    return response.json()
  }
  throw Error('Erro ao se conectar com o serviço Cep Aberto.')
}

function extractCepValuesFromResponse (responseObject) {
  return {
    cep: responseObject.cep,
    state: responseObject.estado.sigla,
    city: responseObject.cidade.nome,
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
