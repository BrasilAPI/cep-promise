'use strict'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import cep from '../../src/cep-promise.js'

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
    it('should reject the Promise', () => {
      return expect(cep()).to.eventually.be.rejected
    })
  })
})
