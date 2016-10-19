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
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(200, path.join(__dirname, '/fixtures/response-cep-05010000-found.xml'))
      nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithFile(200, path.join(__dirname, '/fixtures/viacep-cep-05010000-found.json'))
      const cepRequest = cep('05010000')
      expect(cepRequest.then).to.be.a('function')
      expect(cepRequest.catch).to.be.a('function')
    })
  })

  describe('when invoked without arguments', () => {
    it('should reject with "type_error"', () => {
      return cep()
        .catch((err) => {
          expect(err).to.be.an('error')
          expect(err.errors).to.contain({
            type: 'type_error',
            message: 'Você deve chamar o construtor utilizando uma String ou Number',
            service: 'cep-promise'
          })
        })
    })
  })

  describe('when invoked with an Array', () => {
    it('should reject with "type_error"', () => {
      return cep([1, 2, 3])
        .catch((err) => {
          expect(err).to.be.an('error')
          expect(err.errors).to.contain({
            type: 'type_error',
            message: 'Você deve chamar o construtor utilizando uma String ou Number',
            service: 'cep-promise'
          })
        })
    })
  })

  describe('when invoked with an Object', () => {
    it('should reject with "type_error"', () => {
      return cep({ nintendo: true, ps: false, xbox: false })
        .catch((err) => {
          expect(err).to.be.an('error')
          expect(err.errors).to.contains({
            type: 'type_error',
            message: 'Você deve chamar o construtor utilizando uma String ou Number',
            service: 'cep-promise'
          })
        })
    })
  })

  describe('when invoked with an Function', () => {
    it('should reject with "type_error"', () => {
      return cep(function zelda () { return 'link' })
        .catch((err) => {
          expect(err).to.be.an('error')
          expect(err.errors).to.contain({
            type: 'type_error',
            message: 'Você deve chamar o construtor utilizando uma String ou Number',
            service: 'cep-promise'
          })
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
      nock('https://viacep.com.br')
        .get('/ws/99999999/json/')
        .replyWithFile(200, path.join(__dirname, '/fixtures/viacep-cep-99999999-error.json'))
      return cep('99999999')
        .catch((err) => {
          expect(err).to.be.an('error')
          expect(err.errors).to.include({
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
  })

  describe('when invoked with an invalid "123456789" cep', () => {
    it('should reject with "type_error"', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(500, path.join(__dirname, '/fixtures/response-cep-invalid-format.xml'))
      return cep('123456789')
        .catch((err) => {
          expect(err).to.be.an('error')
          expect(err.errors).to.include({
            type: 'type_error',
            message: 'CEP deve conter exatamente 8 caracteres',
            service: 'cep-promise'
          })
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
      return cep('05010000')
        .catch((err) => {
          expect(err).to.be.an('error')
          expect(err.errors).to.include({
            type: 'system',
            message: 'Erro ao se conectar com o serviço dos Correios',
            service: 'correios',
            name: 'FetchError',
            errno: undefined,
            code: undefined
          })
          .include({
            type: 'error',
            message: 'Erro ao se conectar com o serviço ViaCEP',
            service: 'viacep'
          })
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
      return cep('05010000')
        .catch((err) => {
          expect(err).to.be.an('error')
          expect(err.errors).to.include({
            type: 'type_error',
            message: 'Não foi possível interpretar o XML de resposta',
            service: 'correios'
          })
          .include({
            type: 'error',
            message: 'Erro ao se conectar com o serviço ViaCEP',
            service: 'viacep'
          })
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
      return cep('05010000')
        .catch((err) => {
          expect(err).to.be.an('error')
          expect(err.errors).to.include({
            type: 'system',
            message: 'Erro ao se conectar com o serviço dos Correios',
            service: 'correios',
            name: 'FetchError',
            errno: undefined,
            code: undefined
          })
          .include({
            type: 'system',
            message: 'Erro ao se conectar com o serviço ViaCEP',
            service: 'viacep',
            name: 'FetchError',
            errno: undefined,
            code: undefined
          })
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
        .replyWithError('getaddrinfo ENOTFOUND viacep.com.br viacep.com.br:443')
      return cep('05010000')
        .catch((err) => {
          expect(err).to.be.an('error')
          expect(err.errors).to.include({
            type: 'range_error',
            message: 'CEP deve conter exatamente 8 caracteres',
            service: 'correios'
          })
        })
    })
  })

  afterEach(() => {
    nock.cleanAll()
  })
})
