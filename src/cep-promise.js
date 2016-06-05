'use strict'

export default function (cepRawValue) {
  return new Promise((resolve, reject) => {
    Promise.resolve(cepRawValue)
      .then(validateInput)
      .then(removeSpecialCharacters)
      .then(leftPadWithZeros)
      .then(finish)
      .catch(handleError)

    function validateInput (cepRawValue) {
      var cepTypeOf = typeof cepRawValue

      if (cepTypeOf === 'number' || cepTypeOf === 'string') {
        return cepRawValue
      }

      throw new TypeError('You need to call the constructor with a String or Number.')
    }

    function removeSpecialCharacters (cepRawValue) {
      let cepCleanValue = cepRawValue.toString().replace(/[^0-9]+/ig, '')
      return cepCleanValue
    }

    function leftPadWithZeros (cepCleanValue) {
      let cepWithLeftPad = cepCleanValue.toString()
      let size = 8

      while (cepWithLeftPad.length < size) {
        cepWithLeftPad = '0' + cepWithLeftPad
      }

      return cepWithLeftPad
    }

    function finish (cepResult) {
      resolve(cepResult)
    }

    function handleError (error) {
      if (error instanceof TypeError) {
        return reject({
          type: 'type_error',
          message: error.message
        })
      }
    }
  })
}
