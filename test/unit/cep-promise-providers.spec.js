'use strict'

import chai from 'chai'
import chaiSubset from 'chai-subset'
import nock from 'nock'
import path from 'path'

import cep from '../../src/cep-promise.js'
import CepPromiseError from '../../src/errors/cep-promise.js'
import { getAvailableServices } from '../../src/services/index.js'

chai.use(chaiSubset)

let expect = chai.expect

describe('when invoked with providers parameter', () => {
  before(() => {
    nock.disableNetConnect()
  })

  describe('and the providers param is a string', () => {
    it('should reject with "validation_error"', () => {
      return cep('05010000', { providers: 'viacep' }).catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'Erro ao inicializar a instância do CepPromise.',
            type: 'validation_error',
            errors: [
              {
                service: 'providers_validation',
                message: 'O parâmetro providers deve ser uma lista.'
              }
            ]
          })
      })
    })
  })

  describe('and the providers param is a integer', () => {
    it('should reject with "validation_error"', () => {
      return cep('05010000', { providers: 123 }).catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'Erro ao inicializar a instância do CepPromise.',
            type: 'validation_error',
            errors: [
              {
                service: 'providers_validation',
                message: 'O parâmetro providers deve ser uma lista.'
              }
            ]
          })
      })
    })
  })

  describe('and the providers param is a object', () => {
    it('should reject with "validation_error"', () => {
      return cep('05010000', { providers: {} }).catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'Erro ao inicializar a instância do CepPromise.',
            type: 'validation_error',
            errors: [
              {
                service: 'providers_validation',
                message: 'O parâmetro providers deve ser uma lista.'
              }
            ]
          })
      })
    })
  })

  describe('and the providers param is a function', () => {
    it('should reject with "validation_error"', () => {
      return cep('05010000', { providers: () => () => { } }).catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'Erro ao inicializar a instância do CepPromise.',
            type: 'validation_error',
            errors: [
              {
                service: 'providers_validation',
                message: 'O parâmetro providers deve ser uma lista.'
              }
            ]
          })
      })
    })
  })

  describe('and the providers param is a invalid array', () => {
    it('should reject with "validation_error"', () => {
      const availableProviders = Object.keys(getAvailableServices())

      return cep('05010000', { providers: [123, 'viacep'] }).catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            message: 'Erro ao inicializar a instância do CepPromise.',
            type: 'validation_error',
            errors: [
              {
                message:
                `O provider "123" é inválido. Os providers disponíveis são: ["${availableProviders.join('", "')}"].`,
                service: 'providers_validation'
              }
            ]
          })
      })
    })
  })

  describe('and the providers param is [\'viacep\']', () => {
    it('should call only viacep service', () => {
      const correiosMock = nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/response-cep-05010000-found.xml')
        )

      const correiosAltMock = nock('https://buscacepinter.correios.com.br')
        .post('/app/cep/carrega-cep.php')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/correios-alt-cep-05010000-found.json')
        )

      const viaCepMock = nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-cep-05010000-found.json')
        )

      const wideNetMock = nock('https://ws.apicep.com')
        .get('/busca-cep/api/cep/05010000.json')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/widenet-cep-05010000-found.json')
        )

      return cep('05010000', { providers: ['viacep'] })
        .then(address => {
          expect(address).to.deep.equal({
            cep: '05010000',
            state: 'SP',
            city: 'São Paulo',
            neighborhood: 'Perdizes',
            street: 'Rua Caiubi',
            service: 'viacep'
          })

          expect(viaCepMock.isDone()).to.be.equal(true)
          expect(correiosMock.isDone()).to.be.equal(false)
          expect(correiosAltMock.isDone()).to.be.equal(false)
          expect(wideNetMock.isDone()).to.be.equal(false)
        })
    })
  })

  describe('and the providers param is [\'widenet\']', () => {
    it('should call only widenet service', () => {
      const correiosMock = nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/response-cep-05010000-found.xml')
        )

      const correiosAltMock = nock('https://buscacepinter.correios.com.br')
        .post('/app/cep/carrega-cep.php')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/correios-alt-cep-05010000-found.json')
        )

      const viaCepMock = nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-cep-05010000-found.json')
        )

      const wideNetMock = nock('https://ws.apicep.com')
        .get('/busca-cep/api/cep/05010000.json')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/widenet-cep-05010000-found.json')
        )

      return cep('05010000', { providers: ['widenet'] })
        .then(address => {
          expect(address).to.deep.equal({
            cep: '05010000',
            state: 'SP',
            city: 'São Paulo',
            neighborhood: 'Perdizes',
            street: 'Rua Caiubi',
            service: 'widenet'
          })

          expect(wideNetMock.isDone()).to.be.equal(true)
          expect(viaCepMock.isDone()).to.be.equal(false)
          expect(correiosMock.isDone()).to.be.equal(false)
          expect(correiosAltMock.isDone()).to.be.equal(false)
      })
    })
  })

  describe('and the providers param is [\'correios\']', () => {
    it('should call only correios service', () => {
      const correiosMock = nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/response-cep-05010000-found.xml')
        )

      const correiosAltMock = nock('https://buscacepinter.correios.com.br')
        .post('/app/cep/carrega-cep.php')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/correios-alt-cep-05010000-found.json')
        )

      const viaCepMock = nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-cep-05010000-found.json')
        )

      const wideNetMock = nock('https://ws.apicep.com')
        .get('/busca-cep/api/cep/05010000.json')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/widenet-cep-05010000-found.json')
        )

      return cep('05010000', { providers: ['correios'] })
        .then(address => {
          expect(address).to.deep.equal({
            cep: '05010000',
            state: 'SP',
            city: 'São Paulo',
            neighborhood: 'Perdizes',
            street: 'Rua Caiubi',
            service: 'correios'
          })

          expect(correiosMock.isDone()).to.be.equal(true)
          expect(correiosAltMock.isDone()).to.be.equal(false)
          expect(viaCepMock.isDone()).to.be.equal(false)
          expect(wideNetMock.isDone()).to.be.equal(false)
      })
    })
  })

  describe('and the providers param is [\'correios-alt\']', () => {
    it('should call only correios service', () => {
      const correiosMock = nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/response-cep-05010000-found.xml')
        )

      const correiosAltMock = nock('https://buscacepinter.correios.com.br')
        .post('/app/cep/carrega-cep.php')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/correios-alt-cep-05010000-found.json')
        )

      const viaCepMock = nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-cep-05010000-found.json')
        )

      const wideNetMock = nock('https://cep.widenet.host')
        .get('/busca-cep/api/cep/05010000.json')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/widenet-cep-05010000-found.json')
        )

      return cep('05010000', { providers: ['correios-alt']})
        .then(address => {
          expect(address).to.deep.equal({
            cep: '05010000',
            state: 'SP',
            city: 'São Paulo',
            neighborhood: 'Perdizes',
            street: 'Rua Caiubi',
            service: 'correios-alt'
          })

          expect(correiosMock.isDone()).to.be.equal(false)
          expect(correiosAltMock.isDone()).to.be.equal(true)
          expect(viaCepMock.isDone()).to.be.equal(false)
          expect(wideNetMock.isDone()).to.be.equal(false)
        })
    })
  })

  describe('and the providers param is [\'brasilapi\']', () => {
    it('should call only brasilapi service', () => {
      const correiosMock = nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/response-cep-05010000-found.xml')
        )

      const correiosAltMock = nock('https://buscacepinter.correios.com.br')
        .post('/app/cep/carrega-cep.php')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/correios-alt-cep-05010000-found.json')
        )

      const viaCepMock = nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-cep-05010000-found.json')
        )

      const wideNetMock = nock('https://ws.apicep.com')
        .get('/busca-cep/api/cep/05010000.json')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/widenet-cep-05010000-found.json')
        )

      const brasilAPIMock = nock('https://brasilapi.com.br/')
        .get('/api/cep/v1/05010000')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/brasilapi-cep-05010000-found.json')
        )

      return cep('05010000', { providers: ['brasilapi'] })
        .then(address => {
          expect(address).to.deep.equal({
            cep: '05010000',
            state: 'SP',
            city: 'São Paulo',
            neighborhood: 'Perdizes',
            street: 'Rua Caiubi',
            service: 'brasilapi'
          })

          expect(correiosMock.isDone()).to.be.equal(false)
          expect(correiosAltMock.isDone()).to.be.equal(false)
          expect(viaCepMock.isDone()).to.be.equal(false)
          expect(wideNetMock.isDone()).to.be.equal(false)
          expect(brasilAPIMock.isDone()).to.be.equal(true)
        })
    })
  })

  describe('and the providers param is [\'correios, viacep\']', () => {
    it('should call only correios and viacep services', () => {
      const correiosMock = nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/response-cep-05010000-found.xml')
        )

      const correiosAltMock = nock('https://buscacepinter.correios.com.br')
        .post('/app/cep/carrega-cep.php')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/correios-alt-cep-05010000-found.json')
        )

      const viaCepMock = nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-cep-05010000-found.json')
        )

      const wideNetMock = nock('https://ws.apicep.com')
        .get('/busca-cep/api/cep/05010000.json')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/widenet-cep-05010000-found.json')
        )

      return cep('05010000', { providers: ['correios', 'viacep'] })
        .then(address => {
          expect(address).to.deep.equal({
            cep: '05010000',
            state: 'SP',
            city: 'São Paulo',
            neighborhood: 'Perdizes',
            street: 'Rua Caiubi',
            service: address.service
          })

          expect(viaCepMock.isDone()).to.be.equal(true)
          expect(correiosMock.isDone()).to.be.equal(true)
          expect(correiosAltMock.isDone()).to.be.equal(false)
          expect(wideNetMock.isDone()).to.be.equal(false)
        })
    })
  })

  describe('and the providers param is []', () => {
    it('should call all services', () => {
      const correiosMock = nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/response-cep-05010000-found.xml')
        )

      const correiosAltMock = nock('https://buscacepinter.correios.com.br')
        .post('/app/cep/carrega-cep.php')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/correios-alt-cep-05010000-found.json')
        )

      const viaCepMock = nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-cep-05010000-found.json')
        )

      const wideNetMock = nock('https://ws.apicep.com')
        .get('/busca-cep/api/cep/05010000.json')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/widenet-cep-05010000-found.json')
        )

      return cep('05010000', { providers: [] })
        .then(address => {
          expect(address).to.deep.equal({
            cep: '05010000',
            state: 'SP',
            city: 'São Paulo',
            neighborhood: 'Perdizes',
            street: 'Rua Caiubi',
            service: address.service
          })

          expect(viaCepMock.isDone()).to.be.equal(true)
          expect(correiosMock.isDone()).to.be.equal(true)
          expect(correiosAltMock.isDone()).to.be.equal(true)
          expect(wideNetMock.isDone()).to.be.equal(true)
        })
    })
  })

  afterEach(() => {
    nock.cleanAll()
  })
})
