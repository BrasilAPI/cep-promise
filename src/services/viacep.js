'use strict'

import request from 'request-promise'

function fetchViaCepService (cepWithLeftPad) {
  const options = {
    method: 'GET',
    uri: 'https://viacep.com.br/ws/' + cepWithLeftPad + '/json/',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    }
  }
  return request(options)
    .then((res) => {
      if (JSON.parse(res).erro) {
        throw new RangeError('CEP inválido')
      }
      return res
    })
    .then(parseResponse)
    .then(extractValuesFromParsedResponse)
    .catch((err) => {
      if (err instanceof RangeError) {
        throw Object.assign(err, {service: 'viacep'})
      }
      throw Object.assign(err, {message: 'Erro ao se conectar com o serviços de ceps', service: 'viacep'})
    })
}

function parseResponse (responseString) {
  return new Promise((resolve, reject) => {
    resolve(JSON.parse(responseString))
  })
}

function extractValuesFromParsedResponse (responseObject) {
  return {
    cep: responseObject.cep.replace('-', ''),
    state: responseObject.uf,
    city: responseObject.localidade,
    neighborhood: responseObject.bairro,
    street: responseObject.logradouro
  }
}

export default fetchViaCepService
