'use strict'

import getCorreios from './services/correios.js'
import getViaCep from './services/viacep.js'
import Promise from 'bluebird'

const CEP_SIZE = 8

export default function (cepRawValue) {
  return new Promise((resolve, reject) => {
    Promise.resolve(cepRawValue)
      .then(validateInputType)
      .then(removeSpecialCharacters)
      .then(validateInputLength)
      .then(leftPadWithZeros)
      .then(getCep)
      .then(finish)
      .catch(Promise.AggregateError, (err) => {
        return reject(err.map((error) => {
          return errorHandler(error)
        }))
      })
      .catch((err) => reject(errorHandler(err)))

    function validateInputType (cepRawValue) {
      let cepTypeOf = typeof cepRawValue

      if (cepTypeOf === 'number' || cepTypeOf === 'string') {
        return cepRawValue
      }

      throw new TypeError('Você deve chamar o construtor utilizando uma String ou Number')
    }

    function removeSpecialCharacters (cepRawValue) {
      return cepRawValue.toString().replace(/\D+/g, '')
    }

    function leftPadWithZeros (cepCleanValue) {
      let cepWithLeftPad = cepCleanValue.toString()

      while (cepWithLeftPad.length < CEP_SIZE) {
        cepWithLeftPad = '0' + cepWithLeftPad
      }

      return cepWithLeftPad
    }

    function validateInputLength (cepWithLeftPad) {
      if (cepWithLeftPad.length <= CEP_SIZE) {
        return cepWithLeftPad
      }
      throw new TypeError('CEP deve conter exatamente 8 caracteres')
    }

    function getCep (cepWithLeftPad) {
      return Promise.any([
        getCorreios(cepWithLeftPad),
        getViaCep(cepWithLeftPad)
      ])
        .catch(Promise.AggregateError, (err) => {
          throw err
        })
    }

    function finish (addressObject) {
      resolve(addressObject)
    }

    function errorHandler (error) {
      if (error instanceof TypeError) {
        return {
          type: 'type_error',
          message: error.message
        }
      }

      if (error instanceof RangeError) {
        return {
          type: 'range_error',
          message: error.message
        }
      }
      if (error instanceof Error) {
        return {
          type: 'error',
          message: error.message
        }
      }
    }
  })
}
