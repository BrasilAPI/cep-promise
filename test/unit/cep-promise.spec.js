'use strict'

import chai from 'chai'
import cep from '../../src/cep-promise.js'

let expect = chai.expect

describe('cep-promise (unit)', () => {
  describe('when imported', () => {
    it('should return a Function', () => {
      expect(cep).to.be.an('function')
    })
  })
})
