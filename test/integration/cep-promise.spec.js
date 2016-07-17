'use strict'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import cep from '../../src/cep-promise.js'

chai.use(chaiAsPromised)

let expect = chai.expect

describe('cep-promise (integration)', () => {

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

  describe('when invoked with an inexistend "99999999" cep', () => {
    it('should reject with "type_error"', () => {
      return expect(cep('99999999')).to.be.rejected.and.to.eventually.deep.equal({
        type: 'type_error',
        message: 'CEP NAO ENCONTRADO'
      })
    })
  })

  describe('when invoked with an inexistend "1" cep', () => {
    it('should reject with "type_error"', () => {
      return expect(cep('1')).to.be.rejected.and.to.eventually.deep.equal({
        type: 'type_error',
        message: 'CEP NAO ENCONTRADO'
      })
    })
  })

  describe('when invoked with an invalid "123456789" cep', () => {
    it('should reject with "type_error"', () => {
      return expect(cep('123456789')).to.be.rejected.and.to.eventually.deep.equal({
        type: 'type_error',
        message: 'BUSCA DEFINIDA COMO EXATA, 0 CEP DEVE TER 8 DIGITOS'
      })
    })
  })

})
