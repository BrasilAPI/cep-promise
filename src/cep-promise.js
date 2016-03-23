'use strict'

export default function (cepRawValue) {
  return new Promise((resolve, reject) => {
    validateInput(cepRawValue)
      .then(removeSpecialCharacters)
      .then(finish)
      .catch(reject)

    function validateInput (cepRawValue) {
      return new Promise(function (resolve, reject) {
        var cepTypeOf = typeof cepRawValue

        if (cepTypeOf === 'number' || cepTypeOf === 'string') {
          return resolve(cepRawValue)
        }

        return reject({
          type: 'type_error',
          message: 'You need to call the constructor with a String or Number.'
        })
      })
    }

    function removeSpecialCharacters (cepRawValue) {
      return new Promise((resolve, reject) => {
        let cepCleanValue = cepRawValue.toString().replace(/[^0-9]+/ig, '')
        resolve(cepCleanValue)
      })
    }

    function finish (cepResult) {
      resolve(cepResult)
    }
  })
}
