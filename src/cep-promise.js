'use strict'

export default function (cepRawValue) {
  return new Promise((resolve, reject) => {
    validateInput(cepRawValue)
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

    function finish (cepResult) {
      resolve(cepResult)
    }
  })
}
