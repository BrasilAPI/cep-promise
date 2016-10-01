'use strict'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import cep from '../../src/cep-promise.js'
import nock from 'nock'
import path from 'path'

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
      return expect(cep()).to.be.rejected.and.to.eventually.deep.equal({
        type: 'type_error',
        message: 'Você deve chamar o construtor utilizando uma String ou Number',
        service: undefined
      })
    })
  })

  describe('when invoked with an Array', () => {
    it('should reject with "type_error"', () => {
      return expect(cep([1, 2, 3])).to.be.rejected.and.to.eventually.deep.equal({
        type: 'type_error',
        message: 'Você deve chamar o construtor utilizando uma String ou Number',
        service: undefined
      })
    })
  })

  describe('when invoked with an Object', () => {
    it('should reject with "type_error"', () => {
      return expect(cep({ nintendo: true, ps: false, xbox: false })).to.be.rejected.and.to.eventually.deep.equal({
        type: 'type_error',
        message: 'Você deve chamar o construtor utilizando uma String ou Number',
        service: undefined
      })
    })
  })

  describe('when invoked with an Function', () => {
    it('should reject with "type_error"', () => {
      return expect(cep(function zelda () { return 'link' })).to.be.rejected.and.to.eventually.deep.equal({
        type: 'type_error',
        message: 'Você deve chamar o construtor utilizando uma String ou Number',
        service: undefined
      })
    })
  })

  describe('when invoked with a valid "05010000" string', () => {
    it('should fulfill with correct address', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(200, path.join(__dirname, '/fixtures/response-cep-05010000-found.xml'))

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
        .replyWithFile(200, path.join(__dirname, '/fixtures/response-cep-05010000-found.xml'))

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
    it('should reject with "range_error"', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(500, path.join(__dirname, '/fixtures/response-cep-not-found.xml'))

      return expect(cep('99999999')).to.be.rejected.and.to.eventually.deep.include({
        type: 'range_error',
        message: 'CEP não encontrado na base dos Correios',
        service: 'correios'
      })
    })
  })

  describe('when invoked with an inexistend "1" cep', () => {
    it('should reject with "range_error"', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(500, path.join(__dirname, '/fixtures/response-cep-not-found.xml'))

      return expect(cep('1')).to.be.rejected.and.to.eventually.deep.include({
        type: 'range_error',
        message: 'CEP não encontrado na base dos Correios',
        service: 'correios'
      })
    })
  })

  describe('when invoked with an invalid "123456789" cep', () => {
    it('should reject with "type_error"', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(500, path.join(__dirname, '/fixtures/response-cep-invalid-format.xml'))

      return expect(cep('123456789')).to.be.rejected.and.to.eventually.deep.include({
        type: 'type_error',
        message: 'CEP deve conter exatamente 8 caracteres',
        service: undefined
      })
    })
  })

  describe('when request returns with error but with an unkown XML schema and then succeed to the failover service', () => {
    it('should reject with "error"', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(500, path.join(__dirname, '/fixtures/response-unknown-format.xml'))
      nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithFile(200, path.join(__dirname, '/fixtures/viacep-cep-05010000-found.json'))
      return expect(cep('5010000')).to.eventually.deep.equal({
        cep: '05010000',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Perdizes',
        street: 'Rua Caiubi'
      })
    })
  })

  describe('when its not possible to parse the returning XML and then succeed to the failover service', () => {
    it('should fulfill with correct address', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(200, path.join(__dirname, '/fixtures/response-bad-xml.xml'))
      nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithFile(200, path.join(__dirname, '/fixtures/viacep-cep-05010000-found.json'))
      return expect(cep('5010000')).to.eventually.deep.equal({
        cep: '05010000',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Perdizes',
        street: 'Rua Caiubi'
      })
    })
  })

  describe('when http request to correios fails and then succeed to the failover service', () => {
    it('should fulfill with correct address', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithError('getaddrinfo ENOTFOUND apps.correios.com.br apps.correios.com.br:443')
      nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithFile(200, path.join(__dirname, '/fixtures/viacep-cep-05010000-found.json'))
      return expect(cep('5010000')).to.eventually.deep.equal({
        cep: '05010000',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Perdizes',
        street: 'Rua Caiubi'
      })
    })
  })
  describe('when http request fails both for primary and secondary service with bad response', () => {
    it('should reject with "error"', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithError('getaddrinfo ENOTFOUND apps.correios.com.br apps.correios.com.br:443')
      nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .reply(400, '<h2>Bad Request (400)</h2>')
      return expect(cep('05010000')).to.be.rejected.and.to.eventually.deep.include({
        type: 'error',
        message: 'Erro ao se conectar com o serviços de ceps',
        service: 'viacep'
      })
    })
  })
  describe('when http request has unformated xml and secondary service fails', () => {
    it('should reject with "error"', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(200, path.join(__dirname, '/fixtures/response-bad-xml.xml'))
      nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .reply(400, '<h2>Bad Request (400)</h2>')
      return expect(cep('05010000')).to.be.rejected.and.to.eventually.deep.include({
        type: 'error',
        message: 'Erro ao se conectar com o serviços de ceps',
        service: 'viacep'
      })
    })
  })

  describe('when http request fails both for primary and secondary service with error', () => {
    it('should reject with "error"', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithError('getaddrinfo ENOTFOUND apps.correios.com.br apps.correios.com.br:443')
      nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithError('getaddrinfo ENOTFOUND apps.correios.com.br apps.correios.com.br:443')
      return expect(cep('05010000')).to.be.rejected.and.to.eventually.deep.include({
        type: 'error',
        message: 'Erro ao se conectar com o serviços de ceps',
        service: 'viacep'
      })
    })
  })

  describe("when http request fails to correios because it's length it is superior to 8", () => {
    it('should reject with "error"', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(500, path.join(__dirname, '/fixtures/response-cep-invalid-format.xml'))
      nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithError('getaddrinfo ENOTFOUND apps.correios.com.br apps.correios.com.br:443')
      return expect(cep('05010000')).to.be.rejected.and.to.eventually.deep.include({
        type: 'range_error',
        message: 'CEP deve conter exatamente 8 caracteres',
        service: 'correios'
      })
    })
  })

  afterEach(() => {
    nock.cleanAll()
  })
})
