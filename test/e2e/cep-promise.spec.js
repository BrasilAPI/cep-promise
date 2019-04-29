'use strict'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import chaiSubset from 'chai-subset'

import cep from '../../src/cep-promise.js'
import CepPromiseError from '../../src/errors/cep-promise.js'

chai.use(chaiAsPromised)
chai.use(chaiSubset)

let expect = chai.expect

describe('cep-promise (E2E)', () => {
  describe('when invoked with a valid "05010000" string', () => {
    it('should fulfill with correct address', () => {
      return expect(cep('05010000')).to.eventually.deep.equal({
        cep: '05010000',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Perdizes',
        street: 'Rua Caiubi'
      })
    })
  })

  describe('when invoked with a valid 5010000 number', () => {
    it('should fulfill with correct address', () => {
      return expect(cep(5010000)).to.eventually.deep.equal({
        cep: '05010000',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Perdizes',
        street: 'Rua Caiubi'
      })
    })
  })

  describe('when invoked with an inexistent "99999999" CEP', () => {
    it('should reject with "service_error"', () => {
      return cep('99999999')
        .catch((error) => {
          return expect(error)
            .to.be.an.instanceOf(CepPromiseError)
            .and.containSubset({
              name: 'CepPromiseError',
              message: 'Todos os serviços de CEP retornaram erro.',
              type: 'service_error',
              errors: [{
                message: 'CEP INVÁLIDO',
                service: 'correios'
              }, {
                message: 'CEP não encontrado na base do ViaCEP.',
                service: 'viacep'
              }]
            })
        })
    })
  })

  describe('when invoked with an invalid "123456789" CEP', () => {
    it('should reject with "validation_error"', () => {
      return cep('123456789')
        .catch((error) => {
          return expect(error)
            .to.be.an.instanceOf(CepPromiseError)
            .and.containSubset({
              name: 'CepPromiseError',
              message: 'CEP deve conter exatamente 8 caracteres.',
              type: 'validation_error',
              errors: [{
                service: 'cep_validation',
                message: 'CEP informado possui mais do que 8 caracteres.'
              }]
            })
        })
    })
  })
})
