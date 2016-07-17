'use strict'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import cep from '../../src/cep-promise.js'
import nock from 'nock';
import path from 'path';

chai.use(chaiAsPromised)

let expect = chai.expect

describe('cep-promise (unit)', () => {
  describe('when imported', () => {
    it('should return a Function', () => {
      expect(cep).to.be.an('function')
    })
  })

  describe('when invoked', () => {
    it('should return a Promise', () => {
      expect(cep().then).to.be.a('function')
      expect(cep().catch).to.be.a('function')
    })
  })

  describe('when invoked without arguments', () => {
    it('should reject with "type_error"', () => {
      return expect(cep()).to.rejectedWith({
        type: 'type_error',
        message: 'You need to call the constructor with a String.'
      })
    })
  })

  describe('when invoked with an Array', () => {
    it('should reject with "type_error"', () => {
      return expect(cep([1, 2, 3])).to.rejectedWith({
        type: 'type_error',
        message: 'You need to call the constructor with a String.'
      })
    })
  })

  describe('when invoked with an Object', () => {
    it('should reject with "type_error"', () => {
      return expect(cep({ nintendo: true, ps: false, xbox: false })).to.rejectedWith({
        type: 'type_error',
        message: 'You need to call the constructor with a String.'
      })
    })
  })

  describe('when invoked with an Function', () => {
    it('should reject with "type_error"', () => {
      return expect(cep(function zelda () { return 'link' })).to.rejectedWith({
        type: 'type_error',
        message: 'You need to call the constructor with a String.'
      })
    })
  })

  describe('when invoked with a valid "05010000" string', () => {
    it('should fulfill with correct address', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(200, path.join( __dirname, '/fixtures/response-cep-05010000-found.xml' ) )

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
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(200, path.join( __dirname, '/fixtures/response-cep-05010000-found.xml' ) )

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
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(500, path.join( __dirname, '/fixtures/response-cep-not-found.xml' ) )

      return expect(cep('99999999')).to.be.rejected.and.to.eventually.deep.equal({
        type: 'type_error',
        message: 'CEP NAO ENCONTRADO'
      })
    })
  })

  describe('when invoked with an inexistend "1" cep', () => {
    it('should reject with "type_error"', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(500, path.join( __dirname, '/fixtures/response-cep-not-found.xml' ) )

      return expect(cep('1')).to.be.rejected.and.to.eventually.deep.equal({
        type: 'type_error',
        message: 'CEP NAO ENCONTRADO'
      })
    })
  })

  describe('when invoked with an invalid "123456789" cep', () => {
    it('should reject with "type_error"', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(500, path.join( __dirname, '/fixtures/response-cep-invalid-format.xml' ) )

      return expect(cep('123456789')).to.be.rejected.and.to.eventually.deep.equal({
        type: 'type_error',
        message: 'BUSCA DEFINIDA COMO EXATA, 0 CEP DEVE TER 8 DIGITOS'
      })
    })
  })

  describe('when request returns with success but with an unkown XML schema', () => {
    it('should reject with "error"', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(200, path.join( __dirname, '/fixtures/response-unknown-format.xml' ) )

      return expect(cep('05010000')).to.be.rejected.and.to.eventually.deep.equal({
        type: 'error',
        message: 'Correios respondeu consulta utilizando um formato de XML desconhecido'
      })
    })
  })

  describe('when request returns with error but with an unkown XML schema', () => {
    it('should reject with "error"', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(500, path.join( __dirname, '/fixtures/response-unknown-format.xml' ) )

      return expect(cep('05010000')).to.be.rejected.and.to.eventually.deep.equal({
        type: 'error',
        message: 'Correios respondeu consulta utilizando um formato de XML desconhecido'
      })
    })
  })

  describe('when its not possible to parse the returning XML', () => {
    it('should reject with "error"', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(200, path.join( __dirname, '/fixtures/response-bad-xml.xml' ) )

      return expect(cep('05010000')).to.be.rejected.and.to.eventually.deep.equal({
        type: 'error',
        message: 'Correios respondeu consulta utilizando um formato de XML desconhecido'
      })
    })
  })

  afterEach( () => {
    nock.cleanAll();
  });
})
