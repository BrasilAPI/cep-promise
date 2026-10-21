'use strict'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import nock from 'nock'
import cep from '../../src/cep-promise.js'
import CepPromiseError from '../../src/errors/cep-promise.js'

chai.use(chaiAsPromised)

// Never permit external HTTP calls in this regression test.
describe('[unit] non-finite CEP numbers', () => {
  before(() => nock.disableNetConnect())

  ;[NaN, Infinity, -Infinity].forEach(value => {
    it(`rejects ${value} as a validation error`, () => {
      return chai.expect(cep(value, { providers: ['viacep'] }))
        .to.be.rejectedWith(CepPromiseError)
        .then(error => {
          chai.expect(error.type).to.equal('validation_error')
          chai.expect(error.errors[0].service).to.equal('cep_validation')
        })
    })
  })
})
