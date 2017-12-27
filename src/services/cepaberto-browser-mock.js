'use strict'

import ServiceError from '../errors/service.js'

/*
 * This is a mock service to be used when Browserify
 * renders the distribution file. Correios service
 * doesn't support CORS.
 */

function fetchCepAbertoService (cepWithLeftPad) {
  return new Promise((resolve, reject) => {
    const serviceError = new ServiceError({
      message: 'O serviço dos Cep aberto não aceita requests via Browser (CORS).',
      service: 'cepaberto'
    })

    reject(serviceError)
  })
}

export default fetchCepAbertoService
