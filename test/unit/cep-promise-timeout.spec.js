'use strict'

import chai from 'chai'
import chaiSubset from 'chai-subset'
import nock from 'nock'
import path from 'path'

import cep from '../../src/cep-promise.js'
import CepPromiseError from '../../src/errors/cep-promise.js'

chai.use(chaiSubset)

let expect = chai.expect

describe('when invoked with timeout parameter', () => {
  before(() => {
    nock.disableNetConnect()
  })

  describe('and the providers exceed the timeout', () => {
    it('should reject with "service_error"', () => {
      nock('https://brasilapi.com.br/')
        .get('/api/cep/v1/05010000')
        .delay(3)
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/brasilapi-cep-05010000-found.json')
        )
      return cep('05010000', {timeout: 1, providers: ['brasilapi']})
      .then(() => expect(true).to.be.equal(false))
      .catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'Todos os serviços de CEP retornaram erro.',
            type: 'service_error',
            errors: [
              {
                message: 'Erro ao se conectar com o serviço BrasilAPI.',
                service: 'brasilapi'
              }
            ]
          })
      })

    })
  })

  afterEach(() => {
    nock.cleanAll()
  })
})
