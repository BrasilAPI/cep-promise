'use strict'

import request from 'request-promise'

function fetchViaCepService (cepWithLeftPad) {
  const options = {
    method: 'GET',
    uri: 'https://viacep.com.br/ws/' + cepWithLeftPad + '/json/',
    headers: {
      'content-type': 'application/json;charset=utf-8',
      'cache-control': 'no-cache'
    }
  }
  return request(options)
    .then((res) => {
      if (JSON.parse(res).erro) {
        throw new RangeError('CEP inválido')
      }
      return res
    })
    .catch((err) => {
      if (err instanceof RangeError) {
        throw err
      }
      throw new Error('Erro ao se conectar com o serviços de ceps')
    })
}

export default fetchViaCepService


