'use strict'

import fetch from 'isomorphic-fetch'

function fetchViaCepService (cepWithLeftPad) {
  const url = 'https://viacep.com.br/ws/' + cepWithLeftPad + '/json/'
  const options = {
    method: 'GET',
    uri: 'https://viacep.com.br/ws/' + cepWithLeftPad + '/json/',
    mode: 'cors',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    }
  }

  return fetch(url, options)
    .then(response => response.json())
    .then(extractValuesFromParsedResponse)
    .catch((err) => {
      if (err instanceof RangeError) {
        throw Object.assign(err, {
          service: 'viacep'
        })
      }
      throw Object.assign(err, {
        message: 'Erro ao se conectar com o serviço ViaCEP',
        service: 'viacep'
      })
    })
}

function extractValuesFromParsedResponse (responseObject) {
  if (responseObject.erro === true) {
    throw new RangeError('CEP não encontrado na base do ViaCEP')
  }

  return {
    cep: responseObject.cep.replace('-', ''),
    state: responseObject.uf,
    city: responseObject.localidade,
    neighborhood: responseObject.bairro,
    street: responseObject.logradouro
  }
}

export default fetchViaCepService
