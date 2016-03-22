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

  describe('when invoked with a valid String', () => {
    it('should fulfill', () => {
      return expect(cep('05010000')).to.be.fulfilled
    })
  })

  describe('when invoked with a valid Number', () => {
    it('should fulfill', () => {
      return expect(cep(5010000)).to.be.fulfilled
    })
  })
})
