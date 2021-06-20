'use strict'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import chaiSubset from 'chai-subset'
import nock from 'nock'
import path from 'path'

import cep from '../../src/cep-promise.js'
import CepPromiseError from '../../src/errors/cep-promise.js'

chai.use(chaiAsPromised)
chai.use(chaiSubset)

let expect = chai.expect

describe('[unit] cep-promise for node', () => {
  before(() => {
    nock.disableNetConnect()
  })

  describe('when imported', () => {
    it('should return a Function', () => {
      expect(cep).to.be.a('function')
    })
  })

  describe('when invoked', () => {
    it('should return a Promise', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/response-cep-05010000-found.xml')
        )

      nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-cep-05010000-found.json')
        )

      nock('https://ws.apicep.com')
        .get('/busca-cep/api/cep/05010000.json')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/widenet-cep-05010000-found.json')
        )

      nock('https://brasilapi.com.br/')
        .get('/api/cep/v1/05010000')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/brasilapi-cep-05010000-found.json')
        )

      const cepPromise = cep('05010000')
      expect(cepPromise.then).to.be.a('function')
      expect(cepPromise.catch).to.be.a('function')
    })
  })

  describe('when invoked without arguments', () => {
    it('should reject with "validation_error"', () => {
      return cep().catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'Erro ao inicializar a instância do CepPromise.',
            type: 'validation_error',
            errors: [
              {
                message:
                  'Você deve chamar o construtor utilizando uma String ou um Number.',
                service: 'cep_validation'
              }
            ]
          })
      })
    })
  })

  describe('when invoked with an Array', () => {
    it('should reject with "validation_error"', () => {
      return cep([1, 2, 3]).catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'Erro ao inicializar a instância do CepPromise.',
            type: 'validation_error',
            errors: [
              {
                message:
                  'Você deve chamar o construtor utilizando uma String ou um Number.',
                service: 'cep_validation'
              }
            ]
          })
      })
    })
  })

  describe('when invoked with an Object', () => {
    it('should reject with "validation_error"', () => {
      return cep({ nintendo: true, ps: false, xbox: false }).catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'Erro ao inicializar a instância do CepPromise.',
            type: 'validation_error',
            errors: [
              {
                message:
                  'Você deve chamar o construtor utilizando uma String ou um Number.',
                service: 'cep_validation'
              }
            ]
          })
      })
    })
  })

  describe('when invoked with an Function', () => {
    it('should reject with "validation_error"', () => {
      return cep(function zelda() {
        return 'link'
      }).catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'Erro ao inicializar a instância do CepPromise.',
            type: 'validation_error',
            errors: [
              {
                message:
                  'Você deve chamar o construtor utilizando uma String ou um Number.',
                service: 'cep_validation'
              }
            ]
          })
      })
    })
  })

  describe('when invoked with a valid "05010000" String', () => {
    it('should fulfill with correct address', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/response-cep-05010000-found.xml')
        )

      nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-cep-05010000-found.json')
        )

      nock('https://ws.apicep.com')
        .get('/busca-cep/api/cep/05010000.json')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/widenet-cep-05010000-found.json')
        )

      nock('https://brasilapi.com.br/')
        .get('/api/cep/v1/05010000')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/brasilapi-cep-05010000-found.json')
        )

      return cep('05010000')
        .then(address => expect(address).to.deep.equal({
          cep: '05010000',
          state: 'SP',
          city: 'São Paulo',
          neighborhood: 'Perdizes',
          street: 'Rua Caiubi',
          service: address.service
        })
        )
    })
  })

  describe('when invoked with a valid 5010000 Number', () => {
    it('should fulfill with correct address', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/response-cep-05010000-found.xml')
        )

      nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-cep-05010000-found.json')
        )

      nock('https://ws.apicep.com')
        .get('/busca-cep/api/cep/05010000.json')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/widenet-cep-05010000-found.json')
        )

      nock('https://brasilapi.com.br/')
        .get('/api/cep/v1/05010000')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/brasilapi-cep-05010000-found.json')
        )

      return cep(5010000)
        .then(address => expect(address).to.deep.equal({
          cep: '05010000',
          state: 'SP',
          city: 'São Paulo',
          neighborhood: 'Perdizes',
          street: 'Rua Caiubi',
          service: address.service
        })
        )
    })
  })

  describe('Should succeed only with correios service', () => {
    it('should fulfill with correct address', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/response-cep-05010000-found.xml')
        )

      nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-cep-99999999-error.json')
        )

      nock('https://ws.apicep.com')
        .get('/busca-cep/api/cep/05010000.json')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/widenet-cep-99999999-error.json')
        )

      nock('https://brasilapi.com.br/')
        .get('/api/cep/v1/99999999')
        .replyWithFile(
          404,
          path.join(__dirname, '/fixtures/brasilapi-cep-99999999-error.json')
        )


      return cep('05010000')
        .then(address => expect(address).to.deep.equal({
          cep: '05010000',
          state: 'SP',
          city: 'São Paulo',
          neighborhood: 'Perdizes',
          street: 'Rua Caiubi',
          service: 'correios'
        })
        )
    })
  })

  describe('Should succeed only with viacep service', () => {
    it('should fulfill with correct address', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(
          500,
          path.join(__dirname, '/fixtures/response-unknown-format.xml')
        )

      nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-cep-05010000-found.json')
        )

      nock('https://ws.apicep.com')
        .get('/busca-cep/api/cep/05010000.json')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/widenet-cep-99999999-error.json')
        )

      nock('https://brasilapi.com.br/')
        .get('/api/cep/v1/99999999')
        .replyWithFile(
          404,
          path.join(__dirname, '/fixtures/brasilapi-cep-99999999-error.json')
        )

      return cep('05010000')
        .then(address => expect(address).to.deep.equal({
          cep: '05010000',
          state: 'SP',
          city: 'São Paulo',
          neighborhood: 'Perdizes',
          street: 'Rua Caiubi',
          service: 'viacep'
        })
        )
    })
  })

  describe('Should succeed only with widenet service', () => {
    it('should fulfill with correct address', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(
          500,
          path.join(__dirname, '/fixtures/response-unknown-format.xml')
        )

      nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-cep-99999999-error.json')
        )

      nock('https://ws.apicep.com')
        .get('/busca-cep/api/cep/05010000.json')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/widenet-cep-05010000-found.json')
        )

      nock('https://brasilapi.com.br/')
        .get('/api/cep/v1/99999999')
        .replyWithFile(
          404,
          path.join(__dirname, '/fixtures/brasilapi-cep-99999999-error.json')
        )

      return cep('5010000')
        .then(address => expect(address).to.deep.equal({
          cep: '05010000',
          state: 'SP',
          city: 'São Paulo',
          neighborhood: 'Perdizes',
          street: 'Rua Caiubi',
          service: 'widenet'
        }))
    })
  })

  describe('Should succeed only with brasilapi service', () => {
    it('should fulfill with correct address', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(
          500,
          path.join(__dirname, '/fixtures/response-unknown-format.xml')
        )

      nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-cep-99999999-error.json')
        )

      nock('https://ws.apicep.com')
        .get('/busca-cep/api/cep/05010000.json')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/widenet-cep-99999999-error.json')
        )

      nock('https://brasilapi.com.br/')
        .get('/api/cep/v1/05010000')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/brasilapi-cep-05010000-found.json')
        )

      return cep('5010000')
        .then(address => expect(address).to.deep.equal({
          cep: '05010000',
          state: 'SP',
          city: 'São Paulo',
          neighborhood: 'Perdizes',
          street: 'Rua Caiubi',
          service: 'brasilapi'
        }))
    })
  })

  describe('when its not possible to parse the returned XML and then succeed to one failover service', () => {
    it('should fulfill with correct address', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/response-bad-xml.xml')
        )

      nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-cep-05010000-found.json')
        )

      nock('https://ws.apicep.com')
        .get('/busca-cep/api/cep/05010000.json')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/widenet-cep-05010000-found.json')
        )

      nock('https://brasilapi.com.br/')
        .get('/api/cep/v1/05010000')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/brasilapi-cep-05010000-found.json')
        )

      return cep('5010000')
        .then(address => expect(address).to.deep.equal({
          cep: '05010000',
          state: 'SP',
          city: 'São Paulo',
          neighborhood: 'Perdizes',
          street: 'Rua Caiubi',
          service: address.service
        }))
    })
  })

  describe('when http request to Correios fails and then succeed to the failover service', () => {
    it('should fulfill with correct address', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithError(
          'getaddrinfo ENOTFOUND apps.correios.com.br apps.correios.com.br:443'
        )

      nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-cep-05010000-found.json')
        )

      nock('https://ws.apicep.com')
        .get('/busca-cep/api/cep/05010000.json')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/widenet-cep-05010000-found.json')
        )

      nock('https://brasilapi.com.br/')
        .get('/api/cep/v1/05010000')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/brasilapi-cep-05010000-found.json')
        )

      return cep('5010000')
        .then(address => expect(address).to.deep.equal({
          cep: '05010000',
          state: 'SP',
          city: 'São Paulo',
          neighborhood: 'Perdizes',
          street: 'Rua Caiubi',
          service: address.service
        }))
    })
  })

  describe('when invoked with an inexistent "99999999" CEP', () => {
    it('should reject with "service_error"', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(
          500,
          path.join(__dirname, '/fixtures/response-cep-not-found.xml')
        )

      nock('https://viacep.com.br')
        .get('/ws/99999999/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-cep-99999999-error.json')
        )

      nock('https://ws.apicep.com')
        .get('/busca-cep/api/cep/99999999.json')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/widenet-cep-99999999-error.json')
        )

      nock('https://brasilapi.com.br/')
        .get('/api/cep/v1/99999999')
        .replyWithFile(
          404,
          path.join(__dirname, '/fixtures/brasilapi-cep-99999999-error.json')
        )

      return cep('99999999').catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'Todos os serviços de CEP retornaram erro.',
            type: 'service_error',
            errors: [
              {
                message: 'CEP NAO ENCONTRADO',
                service: 'correios'
              },
              {
                message: 'CEP não encontrado na base do ViaCEP.',
                service: 'viacep'
              },
              {
                message: 'CEP não encontrado na base do WideNet.',
                service: 'widenet'
              }
            ]
          })
      })
    })
  })

  describe('when invoked with an invalid "123456789" CEP', () => {
    it('should reject with "validation_error"', () => {
      return cep('123456789').catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'CEP deve conter exatamente 8 caracteres.',
            type: 'validation_error',
            errors: [
              {
                service: 'cep_validation',
                message: 'CEP informado possui mais do que 8 caracteres.'
              }
            ]
          })
      })
    })
  })

  describe('when http request fails both for primary and secondary service with bad response', () => {
    it('should reject with "service_error"', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithError(
          'getaddrinfo ENOTFOUND apps.correios.com.br apps.correios.com.br:443'
        )

      nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .reply(400, '<h2>Bad Request (400)</h2>')

      nock('https://ws.apicep.com')
        .get('/busca-cep/api/cep/05010000.json')
        .reply(400, '<h2>Bad Request (400)</h2>')

      nock('https://brasilapi.com.br/')
        .get('/api/cep/v1/05010000')
        .reply(400, '<h2>Bad Request (400)</h2>')

      return cep('05010000').catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'Todos os serviços de CEP retornaram erro.',
            type: 'service_error',
            errors: [
              {
                message: 'Erro ao se conectar com o serviço dos Correios.',
                service: 'correios'
              },
              {
                message: 'Erro ao se conectar com o serviço ViaCEP.',
                service: 'viacep'
              },
              {
                message: 'Erro ao se conectar com o serviço WideNet.',
                service: 'widenet'
              },
              {
                name: 'ServiceError',
                message: 'CEP não encontrado na base do BrasilAPI.',
                service: 'brasilapi'
              }
            ]
          })
      })
    })
  })

  describe('when http request has unformatted xml and alternatives services fails', () => {
    it('should reject with "service_error"', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/response-bad-xml.xml')
        )

      nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .reply(400, '<h2>Bad Request (400)</h2>')

      nock('https://ws.apicep.com')
        .get('/busca-cep/api/cep/05010000.json')
        .reply(400, '<h2>Bad Request (400)</h2>')

      nock('https://brasilapi.com.br/')
        .get('/api/cep/v1/05010000')
        .reply(400, '<h2>Bad Request (400)</h2>')

      return cep('05010000').catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'Todos os serviços de CEP retornaram erro.',
            type: 'service_error',
            errors: [
              {
                message: 'Não foi possível interpretar o XML de resposta.',
                service: 'correios'
              },
              {
                message: 'Erro ao se conectar com o serviço ViaCEP.',
                service: 'viacep'
              },
              {
                message: 'Erro ao se conectar com o serviço WideNet.',
                service: 'widenet'
              },
              {
                name: 'ServiceError',
                message: 'CEP não encontrado na base do BrasilAPI.',
                service: 'brasilapi'
              }
            ]
          })
      })
    })
  })

  describe('when http request fails both for primary and secondary service with error', () => {
    it('should reject with "service_error"', () => {
      nock('https://apps.correios.com.br')
        .post('/SigepMasterJPA/AtendeClienteService/AtendeCliente')
        .replyWithError(
          'getaddrinfo ENOTFOUND apps.correios.com.br apps.correios.com.br:443'
        )

      nock('https://viacep.com.br')
        .get('/ws/05010000/json/')
        .replyWithError(
          'getaddrinfo ENOTFOUND apps.correios.com.br apps.correios.com.br:443'
        )

      nock('https://ws.apicep.com')
        .get('/busca-cep/api/cep/05010000.json')
        .replyWithError(
          'getaddrinfo ENOTFOUND apps.correios.com.br apps.correios.com.br:443'
        )

      nock('https://brasilapi.com.br/')
        .get('/api/cep/v1/05010000')
        .replyWithError(
          'getaddrinfo ENOTFOUND apps.correios.com.br apps.correios.com.br:443'
        )

      return cep('05010000').catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'Todos os serviços de CEP retornaram erro.',
            type: 'service_error',
            errors: [
              {
                message: 'Erro ao se conectar com o serviço dos Correios.',
                service: 'correios'
              },
              {
                message: 'Erro ao se conectar com o serviço ViaCEP.',
                service: 'viacep'
              },
              {
                message: 'Erro ao se conectar com o serviço WideNet.',
                service: 'widenet'
              },
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
