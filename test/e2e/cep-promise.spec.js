'use strict'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import cep from '../../src/cep-promise.js'

chai.use(chaiAsPromised)

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

  describe('when invoked with an inexistent "99999999" cep', () => {
    it('should reject with "range_error"', () => {
      return expect(cep('99999999')).to.be.rejected.and.to.eventually.deep
        .include({
          type: 'range_error',
          message: 'CEP não encontrado na base dos Correios',
          service: 'correios'
        })
        .include({
          type: 'range_error',
          message: 'CEP não encontrado na base do ViaCEP',
          service: 'viacep'
        })
    })
  })

  describe('when invoked with an inexistend "1" cep', () => {
    it('should reject with "range_error"', () => {
      return expect(cep('1')).to.be.rejected.and.to.eventually.deep
        .include({
          type: 'range_error',
          message: 'CEP não encontrado na base dos Correios',
          service: 'correios'
        })
        .include({
          type: 'range_error',
          message: 'CEP não encontrado na base do ViaCEP',
          service: 'viacep'
        })
    })
  })

  describe('when invoked with an invalid "123456789" cep', () => {
    it('should reject with "type_error"', () => {
      return expect(cep('123456789')).to.be.rejected.and.to.eventually.contain({
        type: 'type_error',
        message: 'CEP deve conter exatamente 8 caracteres',
        service: 'cep-promise'
      })
    })
  })
})
